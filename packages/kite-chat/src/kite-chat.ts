import type {
  JoinOptions,
  KiteMsg,
  PlaintextMsg,
  FileMsg,
  ContentMsg,
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
import {KiteWebsocket} from './kite-websocket';
import {CHANNEL_NAME} from './shared-constants';

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
  protected kiteWebsocket: KiteWebsocket | null;
  protected kiteChannel: BroadcastChannel;
  readonly element: KiteChatElement | null;
  private db: KiteDB | null;
  public defaultNotificationTitle: string = '';
  public defaultNotificationOptions: NotificationOptions = {
    body: "You have a new message!",
  };

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

    const kiteChannel = new BroadcastChannel(CHANNEL_NAME);
    kiteChannel.onmessage = this.onChannelMessage.bind(this);

    addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        kiteChannel.postMessage({type: MsgType.CONNECTED});
        !this.kiteWebsocket && this.connect();
        this.restore();
      }
    });

    this.kiteChannel = kiteChannel;
    Notification.requestPermission();
  }

  public connect() {
    console.debug('connect');

    const kiteWebsocket = new KiteWebsocket();

    const endpoint = new URL(this.opts.endpoint);

    assert(
      endpoint.protocol.toLocaleLowerCase().startsWith('ws'),
      'ws and wss protocols are only supported for the endpoint url'
    );
    assert(
      endpoint.searchParams.has('c'),
      'enpoint url should have c=<channel name> required query parameter'
    );

    const options: JoinOptions = {
      endpoint: this.opts.endpoint,
      memberId: this.opts.userId as string,
      memberName: this.opts.userName,
      eagerlyConnect: this.opts.eagerlyConnect,
    };

    kiteWebsocket.onContentMessage = this.onContentMessage.bind(this);
    kiteWebsocket.onMessageAck = this.onMessageAck.bind(this);
    kiteWebsocket.onFailedMessage = this.onFailedMessage.bind(this);
    kiteWebsocket.onError = this.onError.bind(this);
    kiteWebsocket.onZippedMessage = this.onZippedMessage.bind(this);
    kiteWebsocket.onOnline = () => {console.log('online')};
    kiteWebsocket.onOffline = () => {console.log('offline')};
    kiteWebsocket.join(options);

    this.kiteWebsocket = kiteWebsocket;
  }

  public disconnect() {
    console.debug('disconnect');
    this.element?.appendNotification({message: 'Disconnected from host', type: NotificationType.WARNING});
    this.kiteWebsocket?.disconnect();
    this.kiteWebsocket = null;
  }

  private onChannelMessage(e: MessageEvent<KiteMsg>) {
    const data = e.data;

    switch(data.type) {
      case MsgType.CONNECTED:
        this.disconnect();
    }
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
    const msgElement = document.querySelector(
      `${KiteMsgElement.TAG}[messageId="${messageId}"]`
    ) as KiteFileElement | undefined;
    msgElement?.remove();
    if(!this.db) {
      return;
    }
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
      this.kiteWebsocket?.sendPlaintextMessage(outgoing);
    } else if (isFileMsg(detail)) {
      outgoing = {
        ...detail,
        type: MsgType.FILE,
      } as FileMsg;
      this.kiteWebsocket?.sendFileMessage(outgoing);
    } else {
      throw new Error('Unexpected payload type ' + JSON.stringify(detail));
    }
    if(!outgoing.edited) {
      console.debug('outgoing', outgoing);
      this.db && addMessage(outgoing, this.db);
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

  protected onMessageAck(messageId: string, destiationMessageId: string, timestamp: Date) {
    console.debug('onMessageAck', messageId, timestamp);
    const msgElement = document.querySelector(
      `${KiteMsgElement.TAG}[messageId="${messageId}"]`
    ) as KiteMsgElement | undefined;
    if (msgElement) {
      msgElement.messageId = destiationMessageId;
      msgElement.status = MsgStatus.delivered;
    }
    this.update(messageId, {
      messageId: destiationMessageId,
      status: MsgStatus.delivered,
    } as ContentMsg);
  }

  protected onError(reason: string, code: number) {
    // TODO display error as a text message
    console.error(code, reason);
    const errorMessage = reason || 'Unknown error.';
    this.element?.appendNotification({message: errorMessage, type: NotificationType.ERROR});
  }

  protected onZippedMessage(messageId: string, zippedIds: string[], file: File) {
    console.debug('onZippedMessage', messageId, zippedIds);
    const fileElement = document.querySelector(
      `${KiteMsgElement.TAG}[messageId="${messageId}"] > ${KiteFileElement.TAG}`
    ) as KiteFileElement | undefined;
    fileElement && (fileElement.file = file);
    this.update(messageId, {
      file,
    } as ContentMsg);
    zippedIds.forEach(id => this.delete(id));
  }

  protected onFailedMessage(messageId: string, reason: string, description?: string) {
    console.debug('onFailedMessage', messageId, reason);
    const msgElement = document.querySelector(
      `${KiteMsgElement.TAG}[messageId="${messageId}"]`
    ) as KiteMsgElement | undefined;
    if (msgElement) {
      msgElement.status = MsgStatus.failed;
    }
    const errorMessage = description || 'Unknown error.';
    this.element?.appendNotification({message: errorMessage, type: NotificationType.ERROR});
    this.update(messageId, {
      status: MsgStatus.failed,
    } as ContentMsg);
  }

  protected onDeliveryError(msg: MessageEvent<unknown>) {
    // TODO retry?
    // TODO mark message with a failed status
    console.error('Cannot deliver message ', msg);
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
