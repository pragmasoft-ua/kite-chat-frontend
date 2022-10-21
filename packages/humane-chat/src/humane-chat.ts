import type {
  ConnectedMsg,
  ErrorMsg,
  HumaneMsg,
  PlaintextMsg,
} from './humane-types';

import {MsgType} from './humane-types';

import {
  HumaneChatElement,
  PayloadMsg,
  randomStringId,
} from '@pragmasoft-ukraine/humane-chat-component';

import {CHANNEL_NAME} from './shared-constants';

import HumaneWorker from './humane-worker?sharedworker&inline';

export type HumaneChatOptions = {
  endpoint: string;
  eagerlyConnect?: boolean;
  createIfMissing?: boolean;
  open?: boolean;
  userId?: string;
  context?: Record<string, string>;
};

const DEFAULT_OPTS: Partial<HumaneChatOptions> = {
  eagerlyConnect: false,
  createIfMissing: true,
  open: false,
};

const HUMANE_USER_ID_STORE_KEY = 'HUMANE_USER_ID';

export class HumaneChat {
  protected readonly opts: HumaneChatOptions;
  protected humaneWorker: SharedWorker | null;
  protected readonly broadcastChannel = new BroadcastChannel(CHANNEL_NAME);

  readonly element: HumaneChatElement | null;

  constructor(opts: HumaneChatOptions) {
    this.opts = Object.assign({}, DEFAULT_OPTS, opts);
    if (!this.opts.userId) {
      this.opts.userId = this.persistentRandomId();
    }
    console.debug('HumaneChat', JSON.stringify(this.opts));

    this.element = this.findOrCreateElement(
      this.opts.createIfMissing as boolean
    );
    if (this.element?.open || this.opts.eagerlyConnect) {
      this.connect();
    }

    this.broadcastChannel.onmessage = this.onWorkerMessage.bind(this);
  }

  protected persistentRandomId(): string {
    let savedId = localStorage.getItem(HUMANE_USER_ID_STORE_KEY);
    if (!savedId) {
      savedId = randomStringId();
      localStorage.setItem(HUMANE_USER_ID_STORE_KEY, savedId);
    }
    return savedId;
  }

  protected onOutgoingMessage(msg: CustomEvent<PayloadMsg<string>>) {
    console.debug('outgoing', msg);
    if (!this.humaneWorker) {
      throw new Error('Not connected');
    }
    this.humaneWorker.port.postMessage({
      type: MsgType.PLAINTEXT,
      ...msg.detail,
    });
  }

  protected onElementShow() {
    console.debug('onElementShow');
    if (!this.humaneWorker) {
      this.connect();
    }
  }

  protected findOrCreateElement(createIfMissing: boolean) {
    let element = document.querySelector('humane-chat');
    if (!element) {
      if (!createIfMissing) {
        return null;
      }
      element = new HumaneChatElement();
      element.open = this.opts.open as boolean;
      document.body.appendChild(element);
    }
    element.addEventListener(
      'humane-chat.send',
      this.onOutgoingMessage.bind(this)
    );
    element.addEventListener('humane-chat.show', this.onElementShow.bind(this));
    return element;
  }

  public connect() {
    console.debug('connect');

    // TODO worker needs to be started unconditionally, but inside worker connect needs to be performed conditionally
    // That's because we cannot restart failed worker - next time after worker error it is silently created in error state.

    const humaneWorker = new HumaneWorker();

    humaneWorker.port.onmessage = this.onWorkerMessage.bind(this);
    humaneWorker.port.onmessageerror = this.onDeliveryError.bind(this);
    humaneWorker.addEventListener('error', this.onWorkerError.bind(this));
    humaneWorker.port.start();
    humaneWorker.port.postMessage({
      type: MsgType.CONNECTED,
      userId: this.opts.userId,
      endpoint: this.opts.endpoint,
      context: this.opts.context,
    });

    this.humaneWorker = humaneWorker;
  }

  public disconnect() {
    if (!this.humaneWorker) return;

    console.debug('disconnect');

    if (this.humaneWorker)
      this.humaneWorker.port.postMessage({
        type: MsgType.DISCONNECTED,
        userId: this.opts.userId,
      });
    this.humaneWorker = null;
  }

  protected onWorkerMessage(e: MessageEvent<HumaneMsg>) {
    const payload = e.data;
    if (!payload) throw new Error('no payload in incoming message');
    switch (payload.type) {
      case MsgType.PLAINTEXT:
        this.onIncomingMessage(payload);
        break;
      case MsgType.CONNECTED:
        this.onConnectedMessage(payload);
        break;
      case MsgType.ERROR:
        this.onErrorMessage(payload);
        break;
    }
  }

  protected onIncomingMessage(incoming: PlaintextMsg) {
    console.debug(
      'onIncomingMessage',
      incoming.payload,
      incoming.msgId,
      incoming.timestamp.toISOString()
    );

    this.element?.incoming(
      incoming.payload,
      incoming.msgId,
      incoming.timestamp.toISOString()
    );
  }

  protected onConnectedMessage(connected: ConnectedMsg) {
    console.log('Connected', connected.userId);
  }

  protected onErrorMessage(e: ErrorMsg) {
    console.error(e.code, e.reason);
  }

  protected onDeliveryError(msg: MessageEvent<unknown>) {
    // TODO retry?
    // TODO mark message with a failed status
    console.error('Cannot deliver message ', msg);
  }

  protected onWorkerError(e: ErrorEvent) {
    this.humaneWorker = null;
    throw new Error(
      `Worker initialization error '${e.message}': ${e.filename}(${e.lineno}:${e.colno}). ${e.error}`
    );
  }
}
