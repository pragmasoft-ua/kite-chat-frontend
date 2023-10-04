export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

/**
 * need to duplicate the same type declaration from kite-chat-component/src/kite-payload
 * otherwise kite-worker is packaged incorrectly (includes entire chat component module)
 * */
export enum MsgStatus {
  unknown = 0,
  sent = 1,
  delivered = 2,
  read = 3,
}

export enum MsgType {
  JOIN = 'JOIN',
  ACK = 'ACK',
  ERROR = 'ERR',
  PLAINTEXT = 'TXT',
  FILE = 'FILE',
  BIN = 'BIN',
  UPLOAD = 'UPL',
  CONNECTED = 'TAB+',
  DISCONNECTED = 'TAB-',
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PING = 'PING',
  PONG = 'PONG',
}

export type JoinChannel = {
  type: MsgType.JOIN;
  memberId: string;
  memberName?: string;
  endpoint: URL;
  eagerlyConnect?: boolean;
};

export type MsgAck = {
  type: MsgType.ACK;
  messageId: string;
  destiationMessageId: string;
  timestamp: Date;
};

export type ErrorMsg = {
  type: MsgType.ERROR;
  reason: string;
  code: number;
};

export type PlaintextMsg = {
  type: MsgType.PLAINTEXT;
  text: string;
  messageId: string;
  timestamp: Date;
  status?: MsgStatus;
};

export type FileMsg = {
  type: MsgType.FILE;
  file: File;
  messageId: string;
  timestamp: Date;
  status?: MsgStatus;
};

export type UploadRequest = {
  type: MsgType.UPLOAD;
  messageId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
};

export type UploadResponse = {
  type: MsgType.UPLOAD;
  messageId: string;
  url: string;
};

export type BinaryMsg = {
  type: MsgType.BIN;
  messageId: string;
  timestamp: Date;
  url: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
};

export type Connected = {
  type: MsgType.CONNECTED;
  messageHistory: Array<ContentMsg>;
};

export type Disconnected = {
  type: MsgType.DISCONNECTED;
};

export type Online = {
  type: MsgType.ONLINE;
};

export type Offline = {
  type: MsgType.OFFLINE;
  sessionDurationMs: number;
};

export type Ping = {
  type: MsgType.PING;
};

export type Pong = {
  type: MsgType.PONG;
};

export type ContentMsg = PlaintextMsg | FileMsg;

export type KiteMsg =
  | JoinChannel
  | MsgAck
  | ErrorMsg
  | ContentMsg
  | UploadRequest
  | UploadResponse
  | BinaryMsg
  | Connected
  | Disconnected
  | Online
  | Offline
  | Ping
  | Pong;
