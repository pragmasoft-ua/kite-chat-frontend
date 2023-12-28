import type {
  JoinChannel,
  ErrorMsg,
  KiteMsg,
  PlaintextMsg,
  MsgAck,
  Connected,
  FileMsg,
  ContentMsg,
  FailedMsg,
  ZippedMsg,
} from './kite-types';

import {MsgType} from './kite-types';

import {
  KiteChatElement,
  KiteMsgElement,
  KiteFileElement,
  KiteMsg as KiteChatMsg,
  randomStringId,
  isPlaintextMsg,
  MsgStatus,
  isFileMsg,
  NotificationType,
  KiteMsgDelete,
} from '@pragmasoft-ukraine/kite-chat-component';

import KiteDedicatedWorker from './kite-worker?worker&inline';
import KiteSharedWorker from './kite-worker?sharedworker&inline';
import {assert} from './assert';
import {
  KiteDB, 
  openDatabase, 
  getMessages, 
  addMessage,
  modifyMessage,
  deleteMessage,
  messageById
} from './kite-storage';

export type KiteChatOptions = {
  endpoint: string;
  eagerlyConnect?: boolean;
  createIfMissing?: boolean;
  open?: boolean;
  userId?: string;
  userName?: string;
};

const DEFAULT_OPTS: Partial<KiteChatOptions> = {
  eagerlyConnect: false,
  createIfMissing: true,
  open: false,
};

const KITE_USER_ID_STORE_KEY = 'KITE_USER_ID';

export class KiteChat {
  protected readonly opts: KiteChatOptions;
  protected kiteWorker: Worker | SharedWorker | null;
  readonly element: KiteChatElement | null;
  private db: KiteDB | null;
  public defaultNotificationTitle: string = '';
  public defaultNotificationOptions: NotificationOptions = {
    body: "You have a new message!",
  }

  constructor(opts: KiteChatOptions) {
    this.opts = Object.assign({}, DEFAULT_OPTS, opts);
    if (!this.opts.userId) {
      this.opts.userId = this.persistentRandomId();
    }
    console.debug('new KiteChat', JSON.stringify(this.opts));
    console.debug('origin', location.origin);
    console.debug('meta.url.origin', new URL(import.meta.url).origin);

    this.element = this.findOrCreateElement(
      this.opts.createIfMissing as boolean
    );

    this.defaultNotificationTitle = this.element?.heading || '';
    this.defaultNotificationOptions.icon = this.getFaviconURL();

    openDatabase().then((db: KiteDB) => {
      this.db = db;
      this.restore();
    }).catch((e: Error) => {
      console.error("Failed to open indexedDB:", e.message);
    })

    addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.postMessage({
          type: MsgType.ACTIVE_TAB,
        });
        this.restore();
      } else {
        if (this.kiteWorker instanceof Worker) {
          this.postMessage({
            type: MsgType.DISCONNECTED,
          });
        }
      }
    });
    this.connect();

    Notification.requestPermission();
  }

  private getPort(worker: SharedWorker|Worker) {
    if (worker instanceof Worker) {
      return worker;
    } else {
      return worker.port;
    }
  }

  public connect() {
    console.debug('connect');

    const onWorkerMessageBound = this.onWorkerMessage.bind(this);

    const kiteWorker = window.SharedWorker 
      ? new KiteSharedWorker() 
      : new KiteDedicatedWorker();

    const endpoint = new URL(this.opts.endpoint);

    assert(
      endpoint.protocol.toLocaleLowerCase().startsWith('ws'),
      'ws and wss protocols are only supported for the endpoint url'
    );
    assert(
      endpoint.searchParams.has('c'),
      'enpoint url should have c=<channel name> required query parameter'
    );

    const join: JoinChannel = {
      type: MsgType.JOIN,
      endpoint: this.opts.endpoint, // DOMException: URL object could not be cloned
      memberId: this.opts.userId as string,
      memberName: this.opts.userName,
      eagerlyConnect: this.opts.eagerlyConnect,
    };

    kiteWorker.addEventListener('error', (this.onWorkerError as ((e: Event) => void)).bind(this));

    const kiteWorkerPort = this.getPort(kiteWorker);

    kiteWorkerPort.onmessage = onWorkerMessageBound;
    kiteWorkerPort.onmessageerror = this.onDeliveryError.bind(this);
    kiteWorkerPort.postMessage(join);
  
    if (!(kiteWorkerPort instanceof Worker)) {
      kiteWorkerPort.start();
    }

    this.kiteWorker = kiteWorker;
  }

  private postMessage(msg: KiteMsg) {
    if (!this.kiteWorker) {
      throw new Error('Not connected');
    }
    this.getPort(this.kiteWorker).postMessage(msg);
  }

  private close() {
    if(!this.kiteWorker) return;
    !(this.kiteWorker instanceof Worker) && this.kiteWorker.port.close();
    this.kiteWorker = null;
  }

  public disconnect() {
    console.debug('disconnect');
    this.element?.appendNotification({message: 'Disconnected from host', type: NotificationType.WARNING});

    this.postMessage({
      type: MsgType.DISCONNECTED,
    });
    this.close();
  }

  private save(msg: ContentMsg) {
    if(!this.db) {
      return;
    }
    addMessage(msg, this.db);
    this.element?.appendMsg(msg);
  }

  private update(messageId: string, updatedMsg: ContentMsg) {
    if(!this.db) {
      return;
    }
    modifyMessage(messageId, updatedMsg, this.db);
  }

  private delete(messageId: string) {
    if(!this.db) {
      return;
    }
    const msgElement = document.querySelector(
      `${KiteMsgElement.TAG}[messageId="${messageId}"]`
    ) as KiteFileElement | undefined;
    msgElement?.remove();
    deleteMessage(messageId, this.db);
  }

  private restore() {
    if(!this.db) {
      return;
    }
    const msgElements = document.querySelectorAll(
      `${KiteMsgElement.TAG}`
    )
    const lastElement = msgElements.length > 0 
      ? (msgElements[msgElements.length - 1] as KiteMsgElement).messageId 
      : undefined;
    getMessages(this.db, lastElement).then((messages: ContentMsg[]) => {
      console.debug("getMessages", messages);
      if (!this.element) return;
      for (const msg of messages) {
        this.element.appendMsg(msg, false);
      }
      if(messages.length > 0) {
        this.element?.appendNotification({message: 'Message history restored', type: NotificationType.INFO, duration: "auto"});
      }
    }).catch((e: Error) => {
      console.error("Failed to get messages from storage:", e.message);
      this.element?.appendNotification({message: 'Failed to restore messages', type: NotificationType.ERROR});
    });
  }

  protected persistentRandomId(): string {
    let savedId = localStorage.getItem(KITE_USER_ID_STORE_KEY);
    if (!savedId) {
      savedId = randomStringId();
      localStorage.setItem(KITE_USER_ID_STORE_KEY, savedId);
    }
    return savedId;
  }

  protected onOutgoingMessage(msg: CustomEvent<KiteChatMsg>) {
    const {detail} = msg;
    let outgoing = null;
    if (isPlaintextMsg(detail)) {
      outgoing = {
        ...detail,
        type: MsgType.PLAINTEXT,
      } as PlaintextMsg;
    } else if (isFileMsg(detail)) {
      outgoing = {
        ...detail,
        type: MsgType.FILE,
      } as FileMsg;
    } else {
      throw new Error('Unexpected payload type ' + JSON.stringify(detail));
    }
    if(!outgoing.edited) {
      console.debug('outgoing', outgoing);
      this.db && addMessage(outgoing, this.db);
      this.postMessage(outgoing);
    } else {
      this.db && modifyMessage(outgoing.messageId, outgoing, this.db);
      //TODO backend message editing
      //this.kiteWorker.port.postMessage(outgoing);
    }
  }

  protected onDeleteMessage(msg: CustomEvent<KiteMsgDelete>) {
    const {detail} = msg;
    console.debug('onDeleteMessage', detail);
    this.delete(detail.messageId);
    //TODO backend message deleting
    //this.kiteWorker.port.postMessage(outgoing);
  }

  protected onElementShow() {
    console.debug('onElementShow');
  }

  protected findOrCreateElement(createIfMissing: boolean) {
    let element = document.querySelector('kite-chat');
    if (!element) {
      if (!createIfMissing) {
        return null;
      }
      element = new KiteChatElement();
      this.opts.open ? element.show() : element.hide();
      document.body.appendChild(element);
    }
    element.addEventListener(
      'kite-chat.send',
      this.onOutgoingMessage.bind(this)
    );
    element.addEventListener(
      'kite-chat.delete',
      this.onDeleteMessage.bind(this)
    );
    element.addEventListener('kite-chat.show', this.onElementShow.bind(this));
    return element;
  }

  protected onWorkerMessage(e: MessageEvent<KiteMsg>) {
    const payload = e.data;
    console.debug('onWorkerMessage', JSON.stringify(payload));
    if (!payload) throw new Error('no payload in incoming message');
    switch (payload.type) {
      case MsgType.CONNECTED:
        this.onConnected(payload);
        break;
      case MsgType.PLAINTEXT:
      case MsgType.FILE:
        this.onContentMessage(payload);
        break;
      case MsgType.ACK:
        this.onMessageAck(payload);
        break;
      case MsgType.ERROR:
        this.onErrorMessage(payload);
        break;
      case MsgType.FAILED:
        this.onFailedMessage(payload);
        break;
      case MsgType.ZIPPED:
        this.onZippedMessage(payload);
        break;
      case MsgType.ONLINE:
      case MsgType.OFFLINE:
        this.log(payload);
        break;
    }
  }

  protected onContentMessage(incoming: ContentMsg) {
    console.debug('onContentMessage', incoming.messageId, incoming.timestamp);
    if(!this.db) {
      return;
    }
    messageById(incoming.messageId, this.db).then(message => {
      if(!message) {
        this.db && this.save(incoming);
      } else {
        this.db && this.update(incoming.messageId, incoming);
      }
    });

    this.msgNotification(incoming);
  }

  protected msgNotification(msg: ContentMsg) {
    // Use the Notification API to show a system notification
    if (Notification.permission === 'granted') {
      const notificationOptions: NotificationOptions = {
        image: isPlaintextMsg(msg) ? undefined : URL.createObjectURL((msg as FileMsg).file),
        ...this.defaultNotificationOptions
      };
  
      new Notification(this.defaultNotificationTitle, notificationOptions);
    }
  }

  protected getFaviconURL(): string | undefined {
    const faviconElement = document.querySelector("link[rel='icon']") || document.querySelector("link[rel='shortcut icon']");
    return faviconElement ? (faviconElement as HTMLLinkElement).href : undefined;
  }

  protected onConnected(payload: Connected) {
    console.debug('connected', payload);
    this.element?.appendNotification({message: 'Connected to host', type: NotificationType.SUCCESS, duration: "auto"});
  }

  protected onMessageAck(ack: MsgAck) {
    console.debug('onMessageAck', ack);
    const msgElement = document.querySelector(
      `${KiteMsgElement.TAG}[messageId="${ack.messageId}"]`
    ) as KiteMsgElement | undefined;
    if (msgElement) {
      msgElement.messageId = ack.destiationMessageId;
      msgElement.status = MsgStatus.delivered;
    }
    this.update(ack.messageId, {
      messageId: ack.destiationMessageId,
      status: MsgStatus.delivered,
    } as ContentMsg);
  }

  protected onErrorMessage(e: ErrorMsg) {
    // TODO display error as a text message
    console.error(e.code, e.reason);
    const errorMessage = e.reason || 'Unknown error.';
    this.element?.appendNotification({message: errorMessage, type: NotificationType.ERROR});
  }

  protected onZippedMessage(e: ZippedMsg) {
    console.debug('onZippedMessage', e);
    const fileElement = document.querySelector(
      `${KiteMsgElement.TAG}[messageId="${e.messageId}"] > ${KiteFileElement.TAG}`
    ) as KiteFileElement | undefined;
    fileElement && (fileElement.file = e.file);
    this.update(e.messageId, {
      file: e.file,
    } as ContentMsg);
    e.zippedIds.forEach(id => this.delete(id));
  }

  protected onFailedMessage(e: FailedMsg) {
    console.debug('onFailedMessage', e);
    const msgElement = document.querySelector(
      `${KiteMsgElement.TAG}[messageId="${e.messageId}"]`
    ) as KiteMsgElement | undefined;
    if (msgElement) {
      msgElement.status = MsgStatus.failed;
    }
    const errorMessage = e.description || 'Unknown error.';
    this.element?.appendNotification({message: errorMessage, type: NotificationType.ERROR});
    this.update(e.messageId, {
      status: MsgStatus.failed,
    } as ContentMsg);
  }

  protected onDeliveryError(msg: MessageEvent<unknown>) {
    // TODO retry?
    // TODO mark message with a failed status
    console.error('Cannot deliver message ', msg);
  }

  protected onWorkerError(e: ErrorEvent) {
    this.kiteWorker = null;
    throw new Error(
      `Worker initialization error '${e.message}': ${e.filename}(${e.lineno}:${e.colno}). ${e.error}`
    );
  }

  /**
   * TODO replace with UI change
   * @deprecated temporary, replace with UI change
   * @param msg
   */
  protected log(msg: KiteMsg) {
    console.log(JSON.stringify(msg));
  }
}
