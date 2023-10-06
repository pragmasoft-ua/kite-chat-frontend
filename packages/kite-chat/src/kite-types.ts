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
  OK = 'OK',
  ERROR = 'ERR',
  ACK = 'ACK',
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
  endpoint: string;
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
  messageId: string;
  text: string;
  timestamp: Date;
  status?: MsgStatus;
};

export type FileMsg = {
  type: MsgType.FILE;
  messageId: string;
  file: File;
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
  url: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  timestamp: Date;
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

export type OK = {
  type: MsgType.OK;
};

export type ContentMsg = PlaintextMsg | FileMsg;

export type KiteMsg =
  | JoinChannel
  | OK
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
