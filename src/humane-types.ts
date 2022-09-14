export enum Status {
  UNKNOWN = 'unknown',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

export type HumaneMessage = {
  msg: string;
  msgId: string;
  chatId: string;
  userId: string;
  datetime: string;
  status?: Status;
};

export const enum PayloadType {
  MSG = 'msg',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

export type HumaneMessagePayload = {type: PayloadType.MSG} & HumaneMessage;
export type ConnectedPayload = {type: PayloadType.CONNECTED; userId: string};
export type DisconnectedPayload = {
  type: PayloadType.DISCONNECTED;
  userId: string;
};
export type ErrorPayload = {
  type: PayloadType.ERROR;
  reason: string;
  code: number;
};

export type Payload =
  | HumaneMessagePayload
  | ConnectedPayload
  | DisconnectedPayload
  | ErrorPayload;
