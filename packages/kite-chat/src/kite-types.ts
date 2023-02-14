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
  JOIN = 0,
  ACK = 1,
  ERROR = 2,
  PLAINTEXT = 3,
  CONNECTED = 100,
  DISCONNECTED = 101,
  ONLINE = 102,
  OFFLINE = 103,
}

export type JoinChannel = {
  type: MsgType.JOIN;
  memberId: string;
  memberName?: string;
  endpoint: string;
  eagerlyConnect?: boolean;
};

export type MessageAck = {
  type: MsgType.ACK;
  messageId: string;
  destiationMessageId: string;
  timestamp: Date;
};

export type ErrorResponse = {
  type: MsgType.ERROR;
  reason: string;
  code: number;
};

export type PlaintextMessage = {
  type: MsgType.PLAINTEXT;
  text: string;
  messageId: string;
  timestamp: Date;
  status?: MsgStatus;
  tabIndex?: number;
};

export type Connected = {
  type: MsgType.CONNECTED;
  tabIndex: number;
  messageHistory: Array<PlaintextMessage>;
};

export type Disconnected = {
  type: MsgType.DISCONNECTED;
  tabIndex: number;
};

export type Online = {
  type: MsgType.ONLINE;
};

export type Offline = {
  type: MsgType.OFFLINE;
  sessionDurationMs: number;
};

export type KiteMsg =
  | JoinChannel
  | MessageAck
  | ErrorResponse
  | PlaintextMessage
  | Connected
  | Disconnected
  | Online
  | Offline;
