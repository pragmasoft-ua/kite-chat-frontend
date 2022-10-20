import {PayloadMsg} from '@pragmasoft-ukraine/humane-chat-component';

export enum MsgType {
  CONNECTED = 0,
  DISCONNECTED = 1,
  ERROR = 2,
  PLAINTEXT = 3,
}

export type ConnectedMsg = {
  type: MsgType.CONNECTED;
  endpoint: string;
  userId: string;
};

export type DisconnectedMsg = {
  type: MsgType.DISCONNECTED;
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
