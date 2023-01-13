export enum MsgType {
  JOIN = 0,
  ACK = 1,
  ERROR = 2,
  PLAINTEXT = 3,
  CONNECTED = 100,
  DISCONNECTED = 101,
}

export type JoinChannel = {
  type: MsgType.JOIN;
  memberId: string;
  memberName?: string;
  endpoint: string;
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
};

export type Connected = {
  type: MsgType.CONNECTED;
};

export type Disconnected = {
  type: MsgType.DISCONNECTED;
};

export type KiteMsg =
  | JoinChannel
  | MessageAck
  | ErrorResponse
  | PlaintextMessage
  | Connected
  | Disconnected;
