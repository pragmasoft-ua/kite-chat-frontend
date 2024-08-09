import type {
  JoinOptions,
  ContentMsg,
  BroadcastMsg,
} from './kite-types';

import {
  BroadcastType,
} from './kite-types';

import {
  KiteChatElement,
  KiteMsg as KiteChatMsg,
  randomStringId,
  MsgStatus,
  isFileMsg,
  NotificationType,
  KiteMsgDelete,
} from '@pragmasoft-ukraine/kite-chat-component';

import {assert} from './assert';
import {KiteDBManager} from './kite-storage';
import {KiteWebsocket} from './kite-websocket';
import {CHANNEL_NAME} from './shared-constants';

export type KiteChatOptions = {
  endpoint: string;
  eagerlyConnect?: boolean;
  createIfMissing?: boolean;
  open?: boolean;
  editing?: boolean;
  userId?: string;
  userName?: string;
  notificationIconUrl?: string;
};

const DEFAULT_OPTS: Partial<KiteChatOptions> = {
  eagerlyConnect: false,
  createIfMissing: true,
  open: false,
  editing: true,
};

const KITE_USER_ID_STORE_KEY = 'KITE_USER_ID';
const KITE_RECONNECT_TIMEOUT = 1000;

export class KiteChat {
  protected readonly opts: KiteChatOptions;
  protected kiteWebsocket: KiteWebsocket | null;
  protected kiteChannel: BroadcastChannel;
  protected kiteDB: KiteDBManager;
  readonly element: KiteChatElement | null;
  private connectionTimeout: ReturnType<typeof setInterval> | null = null;

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

    const kiteDB = new KiteDBManager();
    kiteDB.onopen = this.restore.bind(this);

    this.kiteDB = kiteDB;

    const kiteChannel = new BroadcastChannel(CHANNEL_NAME);
    kiteChannel.onmessage = this.onChannelMessage.bind(this);

    this.kiteChannel = kiteChannel;

    this.initClient();

    addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.initClient();
      }
    });

    addEventListener('click', this.handleUserInteraction.bind(this));
  }

  private handleUserInteraction() {
    removeEventListener('click', this.handleUserInteraction.bind(this));
  
    Notification.requestPermission();
  }

  private initClient() {
    this.kiteChannel.postMessage({type: BroadcastType.ACTIVE});

    this.connectionTimeout = setTimeout(() => {
      this.kiteChannel.postMessage({type: BroadcastType.CONNECTED});
      setTimeout(() => {!this.kiteWebsocket && this.connect();});
    }, KITE_RECONNECT_TIMEOUT);
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
    kiteWebsocket.onOnline = () => {this.log('Online', NotificationType.SUCCESS)};
    kiteWebsocket.onOffline = () => {this.log('Offline', NotificationType.WARNING)};
    kiteWebsocket.join(options);

    this.kiteWebsocket = kiteWebsocket;
  }

  public disconnect() {
    console.debug('disconnect');
    this.kiteWebsocket?.disconnect();
    this.kiteWebsocket = null;
  }

  private onChannelMessage(e: MessageEvent<BroadcastMsg>) {
    const data = e.data;

    switch(data.type) {
      case BroadcastType.CONNECTED:
        this.disconnect();
        break;
      case BroadcastType.ACTIVE:
        this.connectionTimeout && clearTimeout(this.connectionTimeout);
        break;
      case BroadcastType.APPEND:
        this.element?.appendMsg(data.msg, false);
        break;
      case BroadcastType.EDIT:
        this.element?.editMsg(data.messageId, data.updatedMsg);
        break;
      case BroadcastType.REMOVE:
        this.element?.removeMsg(data.messageId);
        break;
      case BroadcastType.SEND:
        !data.msg.edited 
          ? this.element?.appendMsg(data.msg, false) 
          : this.element?.editMsg(data.msg.messageId, data.msg);
        this.kiteWebsocket?.send(data.msg);
        break;
    }
  }

  private create(msg: ContentMsg) {
    this.element?.appendMsg(msg);

    this.kiteChannel.postMessage({type: BroadcastType.APPEND, msg});

    this.kiteDB.addMessage(msg);
  }

  private update(messageId: string, updatedMsg: ContentMsg) {
    this.element?.editMsg(messageId, updatedMsg);

    this.kiteChannel.postMessage({type: BroadcastType.EDIT, messageId, updatedMsg});

    this.kiteDB.messageById(messageId).then(originalMessage => {
      if(!originalMessage) return;
      this.kiteDB.modifyMessage(messageId, {...originalMessage, ...updatedMsg});
    });
  }

  private delete(messageId: string) {
    this.element?.removeMsg(messageId);

    this.kiteChannel.postMessage({type: BroadcastType.REMOVE, messageId});

    this.kiteDB.deleteMessage(messageId);
  }

  private restore() {
    this.kiteDB.getMessages().then((messages: ContentMsg[]) => {
      console.debug("getMessages", messages);
      for (const msg of messages) {
        this.element?.appendMsg(msg, false);
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

  private send(outgoing: ContentMsg) {
    this.kiteChannel.postMessage({type: BroadcastType.SEND, msg: outgoing});

    this.kiteWebsocket?.send(outgoing);
  }

  protected onOutgoingMessage(msg: CustomEvent<KiteChatMsg>) {
    const outgoing = msg.detail as ContentMsg;
    console.debug('outgoing', outgoing);

    if(!outgoing.edited) {
      this.kiteDB.addMessage(outgoing);
    } else {
      this.kiteDB.modifyMessage(outgoing.messageId, outgoing);
    }
  
    this.send(outgoing);
    //TODO backend message editing
  }

  protected onDeleteMessage(msg: CustomEvent<KiteMsgDelete>) {
    const {detail} = msg;
    console.debug('onDeleteMessage', detail);
    this.delete(detail.messageId);
    //TODO backend message deleting
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
      element = document.createElement('kite-chat') as KiteChatElement;
      this.opts.open ? element.show() : element.hide();
      element.editing = !!this.opts.editing;
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

    if(!incoming.edited) {
      this.create(incoming);
    } else {
      this.update(incoming.messageId, incoming);
    }

    this.msgNotification(incoming);
  }

  protected msgNotification(msg: ContentMsg) {
    // Use the Notification API to show a system notification
    if (Notification.permission === 'granted') {  
      const title = this.element?.heading || '';
      const options = {
        icon: this.opts.notificationIconUrl ?? this.getFaviconURL(),
      };
      const notification = new Notification(title, {
        ...options,
        image: isFileMsg(msg) ? URL.createObjectURL(msg.file) : undefined,
      } as NotificationOptions);
      notification.onclick = this.onNotificationClick.bind(this);
    }
  }

  protected onNotificationClick() {
    this.element?.show();
  }

  protected getFaviconURL(): string | undefined {
    const faviconElement = document.querySelector("link[rel='icon']") || document.querySelector("link[rel='shortcut icon']");
    return faviconElement ? (faviconElement as HTMLLinkElement).href : undefined;
  }

  protected onMessageAck(messageId: string, destiationMessageId: string, timestamp: Date) {
    console.debug('onMessageAck', messageId, timestamp);
    this.update(messageId, {messageId: destiationMessageId, status: MsgStatus.delivered} as ContentMsg);
  }

  protected onError(reason: string, code: number) {
    // TODO display error as a text message
    console.error(code, reason);
    const errorMessage = reason || 'Unknown error.';
    this.element?.appendNotification({message: errorMessage, type: NotificationType.ERROR});
  }

  protected onZippedMessage(messageId: string, zippedIds: string[], file: File) {
    console.debug('onZippedMessage', messageId, zippedIds);
    this.update(messageId, {file} as ContentMsg);
    zippedIds.forEach(id => this.delete(id));
  }

  protected onFailedMessage(messageId: string, reason: string, description?: string) {
    console.debug('onFailedMessage', messageId, reason);
    const errorMessage = description || 'Unknown error.';
    this.element?.appendNotification({message: errorMessage, type: NotificationType.ERROR});
    this.update(messageId, {status: MsgStatus.failed} as ContentMsg);
  }

  protected onDeliveryError(msg: MessageEvent<unknown>) {
    // TODO retry?
    // TODO mark message with a failed status
    console.error('Cannot deliver message ', msg);
  }

  /**
   * @param msg
   */
  protected log(message: string, type: NotificationType = NotificationType.INFO) {
    this.element?.appendNotification({message, type, duration: 'auto'});
  }
}
