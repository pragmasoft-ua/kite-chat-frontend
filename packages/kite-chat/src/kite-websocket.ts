import {assert} from './assert';
import {
  BinaryMsg,
  ContentMsg,
  ErrorMsg,
  FileMsg,
  HttpError,
  JoinChannel,
  KiteMsg,
  MsgAck,
  MsgType,
  PlaintextMsg,
  UploadRequest,
  UploadResponse,
  FileVerification,
  PlainTextVerification,
  JoinOptions,
} from './kite-types';
import {formatSize} from './format';
import {zipFiles} from './zip';
import {downloadUrl, upload} from './file-service';
import {
  verifyFile, 
  verifyPlainText,
  SUPPORTED_FILE_FORMATS,
  PLAIN_MAX_SIZE,
} from './verification';
import {decodeKiteMsg, encodeKiteMsg} from './serialization';
import {SUBPROTOCOL} from './shared-constants';

const CHANNEL_NAME = 'k1te channel';

const WS_CLOSE_REASON_NORMAL = 1000;

const MIN_RECONNECTION_INTERVAL_MS = 60 * 1000; // 1 min

const PING_INTERVAL_MS = 60 * 1000; // 1 min

const MISSED_PONGS_TO_RECONNECT = 3;

const ZIP_FILE_FORMAT = "application/zip";

export class KiteWebsocket {
  /*
   * ws is null initially and until the first connection, which is delayed till the first
   * outgoing message is sent, unless eagerlyConnect option is set in a JoinChannel message.
   *
   * Then, it is automatically reconnected forever on the connection loss, so ws shouldn't be null
   * once connected, but ws.readyState may be not ws.OPEN
   *
   * ws can be reset back to null if network is offline or if all tabs are closed (tabsCount === 0)
   * but in this case shared worker is anyway destroyed.
  */
  protected ws: WebSocket | null;

  /**
   * Cache JoinChannel request till the time we will send it to the server after
   * ws connection is established.
  */
  private joinChannel: JoinChannel | null = null;

  /**
   * Cache file messages that would be uploaded
  */
  private messageCache = new Array<ContentMsg>();

  private batchAccumulator = 0;

  private zipQueue = new Array<FileMsg>();

  private outgoingQueue = new Array<KiteMsg>();

  private pingerTimer: ReturnType<typeof setInterval> | null = null;

  private online: boolean = navigator.onLine; 

  public onFailedMessage?: (messageId: string, reason: FileVerification|PlainTextVerification, errorMessage?: string) => void;
  public onZippedMessage?: (messageId: string, zippedIds: string[], file: File) => void;
  public onContentMessage?: (msg: ContentMsg) => void;
  public onMessageAck?: (messageId: string, destiationMessageId: string, timestamp: Date) => void;
  public onError?: (reason: string, code: number) => void;
  public onOnline?: () => void;
  public onOffline?: (sessionDurationMs: number) => void;

  /**
   * Track the time when last ws connection was establisted to ensure
   * minimal reconnection interval (to avoid reconnecting too often infinitely)
  */
  private connectedTimestampMs = 0;
  private reconnectionAttempts = 0;
  private lastPongTimeMs = 0;

  constructor() {
    window.addEventListener("online", this.onClientOnline.bind(this));
    window.addEventListener("offline", this.onClientOffline.bind(this));
  }

  private messageById = (messageId: string) =>
    this.messageCache.findLast((msg) => msg.messageId === messageId);

  public sendPlaintextMessage(msg: PlaintextMsg) {  
    const result = verifyPlainText(msg.text);
  
    switch (result) {
      case PlainTextVerification.EXCEED_SIZE:
        this.onFailedMessage?.(
          msg.messageId, result, `Text message size exceeds ${formatSize(PLAIN_MAX_SIZE)} limit.`,
        );
        break;
      case PlainTextVerification.SUCCEED:
        this.queue(msg);
        break;
    }
  }
  
  public join(options: JoinOptions) {
    const payload: JoinChannel = {
      type: MsgType.JOIN,
      ...options,
    };
    this.joinChannel = this.joinChannel ?? payload;
    this.joinChannel.eagerlyConnect =
      this.joinChannel.eagerlyConnect ?? payload.eagerlyConnect;
    assert(
      this.joinChannel.endpoint === payload.endpoint,
      'Cannot use different chat endpoints for the same domain'
    );
    console.debug('join', this.joinChannel);
    if (!this.ws && this.joinChannel.eagerlyConnect) {
      this.triggerWsConnection();
    }
  }

  private getZipChunks(maxSize: number = SUPPORTED_FILE_FORMATS[ZIP_FILE_FORMAT]) {
    const chunks = new Array<FileMsg[]>();
  
    while (this.zipQueue.length > 0) {
      const chunk = this.zipQueue.reduce((acc, msg) => {
        const newSize = acc.size + msg.file.size;
        if (newSize <= maxSize) {
          acc.messages.push(msg);
          acc.size = newSize;
        }
        return acc;
      }, { size: 0, messages: new Array<FileMsg>()});
  
      chunks.push(chunk.messages);
      this.zipQueue = this.zipQueue.filter(msg => !chunk.messages.includes(msg));
    }

    return chunks;
  }

  private uploadFileMessage(payload: FileMsg, file: File = payload.file) {
    const upload: UploadRequest = {
      type: MsgType.UPLOAD,
      messageId: payload.messageId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      timestamp: payload.timestamp,
    };
    this.messageCache.push({...payload, file});
    this.queue(upload);
  }

  public sendFileMessage(msg: FileMsg) {
    const maxSize = (type: string) => formatSize(SUPPORTED_FILE_FORMATS[type as keyof typeof SUPPORTED_FILE_FORMATS]);
  
    const result = verifyFile(msg.file);
    const {file} = msg;
  
    switch (result) {
      case FileVerification.UNSUPPORTED_TYPE:
        if(file.size > SUPPORTED_FILE_FORMATS[ZIP_FILE_FORMAT]) {
          this.onFailedMessage?.(
            msg.messageId, FileVerification.EXCEED_SIZE, `${ZIP_FILE_FORMAT} size exceeds ${maxSize(ZIP_FILE_FORMAT)} limit.`
          );
        } else {
          this.zipQueue.push(msg);
        }
        break;
      case FileVerification.EXCEED_SIZE:
        this.onFailedMessage?.(
          msg.messageId, FileVerification.EXCEED_SIZE, `${file.type} size exceeds ${maxSize(file.type)} limit.`
        );
        break;
      case FileVerification.SUCCEED:
        this.uploadFileMessage(msg);
        break;
    }

    this.batchAccumulator++;

    if(msg.totalFiles !== this.batchAccumulator) {
      return;
    }

    const chunks = this.getZipChunks();

    for(const chunk of chunks) {
      zipFiles(chunk.map(msgItem => msgItem.file), ZIP_FILE_FORMAT, msg.timestamp)
        .then(file => {
          const {messageId} = chunk[0];
          const messageIds = chunk.map(msg => msg.messageId);
          this.onZippedMessage?.(
            messageId, messageIds.filter(id => id !== messageId), file,
          );
          this.uploadFileMessage(chunk[0], file);
        })
        .catch(error => {
          console.error('Error zipping file:', error);
        });
    }

    this.batchAccumulator = 0;
  }

  private onWsJoined() {
    console.debug(CHANNEL_NAME, 'ws joined');
    this.flushQueue();
    this.onOnline?.();
  }
  
  private onWsPlaintextMessage(payload: PlaintextMsg) {
    this.onContentMessage?.(payload);
  }
  
  private async onWsBinaryMessage(payload: BinaryMsg) {
    try {
      const file: File = await downloadUrl(payload.url);
      const incoming: FileMsg = {
        ...payload,
        type: MsgType.FILE,
        file,
      };
      this.onContentMessage?.(incoming);
    } catch (error) {
      if (error instanceof HttpError) {
        this.onError?.(error.message, error.status);
      } else {
        console.error(error);
      }
    }
  }
  
  private async onWsUploadResponse(payload: UploadResponse) {
    try {
      const {canonicalUri, uploadUri, messageId} = payload;
      const msg = this.messageById(messageId) as FileMsg;
      const file = msg?.file;
      assert(!!file, `No file in ${messageId}`);
      await upload(uploadUri ?? canonicalUri, file);
      const outgoing: BinaryMsg = {
        type: MsgType.BIN,
        messageId,
        url: canonicalUri,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        timestamp: msg.timestamp,
      };
      this.queue(outgoing);
    } catch (error) {
      if (error instanceof HttpError) {
        this.onError?.(error.message, error.status);
      } else if (error instanceof Error) {
        this.onError?.(error.message, 0);
      } else {
        console.error(error);
      }
    }
  }
  
  private onWsMessageAck(payload: MsgAck) {
    const {messageId, destiationMessageId, timestamp} = payload;
    console.debug(CHANNEL_NAME, 'Message Ack', messageId, destiationMessageId);
    // console.warn(CHANNEL_NAME, 'Unexpected Ack', payload.messageId);
    // TODO handle properly in tab controller
    this.onMessageAck?.(messageId, destiationMessageId, timestamp);
  }
  
  private onErrorResponse(payload: ErrorMsg) {
    // TODO add error message to the messageHistory
    console.error(CHANNEL_NAME, payload.code, payload.reason);
    this.onError?.(payload.reason, payload.code);
  }
  
  private onPongResponse() {
    console.debug('pong');
    this.lastPongTimeMs = Date.now();
  }

  public disconnect(reason: string = 'active tab closed') {
    // https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4
    this.ws?.close(WS_CLOSE_REASON_NORMAL, reason);
    this.joinChannel = null;
    this.messageCache.length = 0;
    this.outgoingQueue.length = 0;
  }

  private onWsOpen() {
    console.debug(CHANNEL_NAME, 'ws connected');
    this.connectedTimestampMs = Date.now();
    assert(!!this.joinChannel, 'no pending joinChannel message');
    this.wsSend(this.joinChannel);
    this.lastPongTimeMs = Date.now();
    this.pingerTimer = setInterval(this.pinger.bind(this), PING_INTERVAL_MS);
  }
  
  private onWsClose(e: CloseEvent) {
    if (this.pingerTimer) {
      clearInterval(this.pingerTimer);
      this.pingerTimer = null;
    }
    const sessionDurationMs = this.connectedTimestampMs
      ? Date.now() - this.connectedTimestampMs
      : 0;
    console.debug(
      CHANNEL_NAME,
      `ws disconnected, session duration ${Math.round(
        (sessionDurationMs * 60) / 1000
      )} minutes`,
      e
    );
    this.onOffline?.(sessionDurationMs);
    if (!this.online) {
      console.warn(CHANNEL_NAME, 'offline, do not reconnect');
      this.ws = null;
      return;
    }
    const timeToReconnect = MIN_RECONNECTION_INTERVAL_MS - sessionDurationMs;
    if (timeToReconnect > 0) {
      console.debug(CHANNEL_NAME, 'schedule reconnect', timeToReconnect);
      setTimeout(this.triggerWsConnection, timeToReconnect);
    } else {
      this.triggerWsConnection();
    }
  }
  
  private onWsError(e: Event) {
    console.debug(CHANNEL_NAME, 'onWsError', e);
    this.onError?.('Connection error', -1);
    // TODO close ws in the case of error?
  }

  private onWsMessage(event: MessageEvent) {
    const payload = event.data;
    console.debug(CHANNEL_NAME, 'ws received', payload);
    const kiteMsg = decodeKiteMsg(payload);
    switch (kiteMsg.type) {
      case MsgType.PLAINTEXT:
        this.onWsPlaintextMessage(kiteMsg);
        break;
      case MsgType.BIN:
        this.onWsBinaryMessage(kiteMsg);
        break;
      case MsgType.UPLOAD:
        this.onWsUploadResponse(kiteMsg as UploadResponse);
        break;
      case MsgType.ACK:
        this.onWsMessageAck(kiteMsg);
        break;
      case MsgType.OK:
        this.onWsJoined();
        break;
      case MsgType.ERROR:
        this.onErrorResponse(kiteMsg);
        break;
      case MsgType.PONG:
        this.onPongResponse();
        break;
    }
  }

  private onClientOnline() {
    console.log(CHANNEL_NAME, 'went online');
    this.online = true;
    if (this.outgoingQueue.length > 0) {
      console.log(
        CHANNEL_NAME,
        'outgoing queue has messages, trigger ws reconnection'
      );
      this.triggerWsConnection();
    } else if (this.joinChannel?.eagerlyConnect) {
      console.log(CHANNEL_NAME, 'eagerlyConnect is true, trigger ws reconnection');
      this.triggerWsConnection();
    }
    this.onOnline?.();
  }
  
  private onClientOffline() {
    console.log(CHANNEL_NAME, 'went offline');
    this.online = false;
    if (this.ws?.readyState === this.ws?.OPEN) {
      console.warn('unexpected state, ws is open while offline, closing it');
      this.ws?.close();
    }
    this.ws = null;
  }

  private triggerWsConnection() {
    console.log(CHANNEL_NAME, 'ws connecting..', this.reconnectionAttempts++);
    assert(!!this.joinChannel, 'Missing websocket connection configuration');
    const endpoint = this.joinChannel.endpoint;
    this.ws = new WebSocket(endpoint, SUBPROTOCOL);
    this.ws.onmessage = this.onWsMessage.bind(this);
    this.ws.onopen = this.onWsOpen.bind(this);
    this.ws.onclose = this.onWsClose.bind(this);
    this.ws.onerror = this.onWsError.bind(this);
  }

  private wsSend(payload: KiteMsg) {
    assert(!!this.ws, 'No Websocket connection');
    assert(this.ws.readyState === this.ws.OPEN, 'Websocket is not ready');
    console.debug(CHANNEL_NAME, 'ws send', payload);
    const encoded = encodeKiteMsg(payload);
    this.ws.send(encoded);
  }
  
  private flushQueue() {
    let queueSize = this.outgoingQueue.length;
    if (queueSize <= 0) return;
    console.debug(CHANNEL_NAME, 'flush queue', queueSize);
    while (queueSize-- > 0) {
      const payload = this.outgoingQueue[0];
      this.wsSend(payload);
      this.outgoingQueue.shift();
    }
  }

  private queue(msg: KiteMsg) {
    this.outgoingQueue.push(msg);
    if (this.ws) {
      this.ws.readyState === this.ws.OPEN && this.flushQueue();
    } else if (this.online) {
      this.triggerWsConnection();
    }
  }
  
  private pinger() {
    const sinceLastPongMs = Date.now() - this.lastPongTimeMs;
    if (sinceLastPongMs > PING_INTERVAL_MS * MISSED_PONGS_TO_RECONNECT) {
      this.disconnect(`missed ${MISSED_PONGS_TO_RECONNECT} pongs, reconnect`);
    }
    this.wsSend({type: MsgType.PING});
  }  
}