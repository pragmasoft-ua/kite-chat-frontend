import {
  MsgStatus,
  PlaintextMsg as PlaintextMsgPayload,
  FileMsg as FileMsgPayload,
  CustomKeyboardMarkup,
} from '@pragmasoft-ukraine/kite-chat-component';

export class HttpError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export enum MsgType {
  JOIN = 'JOIN',
  OK = 'OK',
  ERROR = 'ERR',
  ACK = 'ACK',
  PLAINTEXT = 'TXT',
  FILE = 'FILE',
  DELETE = 'DELETE',
  BIN = 'BIN',
  UPLOAD = 'UPL',
  CONNECTED = 'TAB+',
  DISCONNECTED = 'TAB-',
  PING = 'PING',
  PONG = 'PONG',
  FAILED = "FAILED",
}

export type JoinOptions = {
  memberId: string;
  memberName?: string;
  endpoint: string;
  eagerlyConnect?: boolean;
};

export type JoinChannel = {
  type: MsgType.JOIN;
} & JoinOptions;

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
  timestamp: Date;
  inlineKeyboard?: CustomKeyboardMarkup;
} & PlaintextMsgPayload;

export type FileMsg = {
  type: MsgType.FILE;
  messageId: string;
  timestamp: Date;
} & FileMsgPayload;

export type DeleteMsg = {
  type: MsgType.DELETE;
  messageId: string;
};

export type UploadRequest = {
  type: MsgType.UPLOAD;
  messageId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  timestamp: Date;
};

export type UploadResponse = {
  type: MsgType.UPLOAD;
  messageId: string;
  canonicalUri: string;
  uploadUri?: string;
};

export type BinaryMsg = {
  type: MsgType.BIN;
  messageId: string;
  url: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  timestamp: Date;
  status?: MsgStatus;
};

export type Connected = {
  type: MsgType.CONNECTED;
};

export type Disconnected = {
  type: MsgType.DISCONNECTED;
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

export enum FileVerification {
  UNSUPPORTED_TYPE = "UNSUPPORTED_TYPE",
  EXCEED_SIZE = "EXCEED_SIZE",
  SUCCEED = "SUCCEED"
}

export enum PlainTextVerification {
  EXCEED_SIZE = "EXCEED_SIZE",
  SUCCEED = "SUCCEED"
}

export type FailedMsg = {
  type: MsgType.FAILED;
  reason: FileVerification|PlainTextVerification;
  messageId: string;
  description?: string;
};

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
  | Ping
  | Pong
  | FailedMsg;

export enum BroadcastType {
  CONNECTED = 'ONLINE',
  ACTIVE = 'VISIBLE',
  APPEND = 'ADD',
  EDIT = 'EDIT',
  REMOVE = 'REMOVE',
  SEND = 'SEND',
}

export type ConnectedTab = {
  type: BroadcastType.CONNECTED;
}

export type ActiveTab = {
  type: BroadcastType.ACTIVE;
}

export type AppendMsg = {
  type: BroadcastType.APPEND;
  msg: ContentMsg;
};

export type EditMsg = {
  type: BroadcastType.EDIT;
  messageId: string;
  updatedMsg: ContentMsg;
};

export type RemoveMsg = {
  type: BroadcastType.REMOVE;
  messageId: string;
};

export type OutgoingMsg = {
  type: BroadcastType.SEND;
  msg: ContentMsg;
};

export type BroadcastMsg =
  | ConnectedTab
  | ActiveTab
  | AppendMsg
  | EditMsg
  | RemoveMsg
  | OutgoingMsg;
