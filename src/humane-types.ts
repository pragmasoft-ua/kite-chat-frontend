export const enum MsgStatus {
  UNKNOWN = 0,
  SENT = 1,
  DELIVERED = 2,
  READ = 3,
}

export type PayloadMsg<TPayload> = {
  msgId: string;
  chatId: string;
  userId: string;
  timestamp: Date;
  status?: MsgStatus;
  payload: TPayload;
};

export const enum MsgType {
  CONNECTED = 0,
  DISCONNECTED = 1,
  ERROR = 2,
  PLAINTEXT = 3,
}

export type ConnectedMsg = {
  type: MsgType.CONNECTED;
  chatId: string;
  userId: string;
};
export type DisconnectedMsg = {
  type: MsgType.DISCONNECTED;
  chatId: string;
  userId: string;
};
export type ErrorMsg = {
  type: MsgType.ERROR;
  reason: string;
  code: number;
};
export type PlaintextMsg = {
  type: MsgType.PLAINTEXT;
} & PayloadMsg<string>;

export type HumaneMsg =
  | ConnectedMsg
  | DisconnectedMsg
  | ErrorMsg
  | PlaintextMsg;
