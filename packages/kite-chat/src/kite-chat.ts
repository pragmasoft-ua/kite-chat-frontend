import type {
  JoinChannel,
  ErrorResponse,
  KiteMsg,
  PlaintextMessage,
  MessageAck,
} from './kite-types';

import {MsgType} from './kite-types';

import {
  KiteChatElement,
  PayloadMsg,
  randomStringId,
} from '@pragmasoft-ukraine/kite-chat-component';

import {CHANNEL_NAME} from './shared-constants';

import KiteWorker from './kite-worker?sharedworker&inline';

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
  protected kiteWorker: SharedWorker | null;
  protected readonly broadcastChannel = new BroadcastChannel(CHANNEL_NAME);

  readonly element: KiteChatElement | null;

  constructor(opts: KiteChatOptions) {
    this.opts = Object.assign({}, DEFAULT_OPTS, opts);
    if (!this.opts.userId) {
      this.opts.userId = this.persistentRandomId();
    }
    console.debug('KiteChat', JSON.stringify(this.opts));

    this.element = this.findOrCreateElement(
      this.opts.createIfMissing as boolean
    );
    if (this.element?.open || this.opts.eagerlyConnect) {
      this.connect();
    }

    this.broadcastChannel.onmessage = this.onWorkerMessage.bind(this);
  }

  protected persistentRandomId(): string {
    let savedId = localStorage.getItem(KITE_USER_ID_STORE_KEY);
    if (!savedId) {
      savedId = randomStringId();
      localStorage.setItem(KITE_USER_ID_STORE_KEY, savedId);
    }
    return savedId;
  }

  protected onOutgoingMessage(msg: CustomEvent<PayloadMsg<string>>) {
    console.debug('outgoing', msg);
    if (!this.kiteWorker) {
      throw new Error('Not connected');
    }
    this.kiteWorker.port.postMessage({
      type: MsgType.PLAINTEXT,
      ...msg.detail,
    });
  }

  protected onElementShow() {
    console.debug('onElementShow');
    if (!this.kiteWorker) {
      this.connect();
    }
  }

  protected findOrCreateElement(createIfMissing: boolean) {
    let element = document.querySelector('kite-chat');
    if (!element) {
      if (!createIfMissing) {
        return null;
      }
      element = new KiteChatElement();
      element.open = this.opts.open as boolean;
      document.body.appendChild(element);
    }
    element.addEventListener(
      'kite-chat.send',
      this.onOutgoingMessage.bind(this)
    );
    element.addEventListener('kite-chat.show', this.onElementShow.bind(this));
    return element;
  }

  public connect() {
    console.debug('connect');

    // TODO worker needs to be started unconditionally, but inside worker connect needs to be performed conditionally
    // That's because we cannot restart failed worker - next time after worker error it is silently created in error state.

    const kiteWorker = new KiteWorker();

    kiteWorker.port.onmessage = this.onWorkerMessage.bind(this);
    kiteWorker.port.onmessageerror = this.onDeliveryError.bind(this);
    kiteWorker.addEventListener('error', this.onWorkerError.bind(this));
    kiteWorker.port.start();
    const join: JoinChannel = {
      type: MsgType.JOIN,
      endpoint: this.opts.endpoint,
      memberId: this.opts.userId as string,
      memberName: this.opts.userName,
    };
    kiteWorker.port.postMessage(join);

    this.kiteWorker = kiteWorker;
  }

  public disconnect() {
    if (!this.kiteWorker) return;

    console.debug('disconnect');

    if (this.kiteWorker)
      this.kiteWorker.port.postMessage({
        type: MsgType.DISCONNECTED,
      });
    this.kiteWorker = null;
  }

  protected onWorkerMessage(e: MessageEvent<KiteMsg>) {
    const payload = e.data;
    if (!payload) throw new Error('no payload in incoming message');
    switch (payload.type) {
      case MsgType.CONNECTED:
        this.onConnected();
        break;
      case MsgType.PLAINTEXT:
        this.onPlaintextMessage(payload);
        break;
      case MsgType.ACK:
        this.onMessageAck(payload);
        break;
      case MsgType.ERROR:
        this.onErrorMessage(payload);
        break;
    }
  }

  protected onPlaintextMessage(incoming: PlaintextMessage) {
    console.debug(
      'onPlaintextMessage',
      incoming.messageId,
      incoming.text,
      incoming.timestamp
    );

    this.element?.incoming(
      incoming.text,
      incoming.messageId,
      incoming.timestamp.toISOString()
    );
  }

  protected onConnected() {
    console.debug('connected');
  }

  protected onMessageAck(ack: MessageAck) {
    // TODO this.element?.ack(ack.messageId, ack.destiationMessageId, ack.timestamp);
    console.debug(ack);
  }

  protected onErrorMessage(e: ErrorResponse) {
    // TODO display error as a text message
    console.error(e.code, e.reason);
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
}
