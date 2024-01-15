export enum MsgStatus {
  unknown = 0,
  sent = 1,
  delivered = 2,
  read = 3,
  failed = 4,
}

export type BaseMsg = {
  messageId?: string;
  timestamp?: Date;
  status?: MsgStatus;
  edited?: boolean; 
  replyMarkup?: InlineKeyboardMarkup;
};

export type PlaintextMsg = BaseMsg & {
  text: string;
};

export type FileMsg = BaseMsg & {
  file: File;
  batchId?: string;
  totalFiles?: number;
};

export enum MsgOperation {
  delete = 1,
  send = 2,
}

export type KiteMsg = PlaintextMsg | FileMsg;

export type KiteMsgSend = KiteMsg;

export type KiteMsgDelete = {
  messageId: string;
};

export type MsgSend  = {
  type: MsgOperation.send;
  detail: KiteMsgSend;
}

export type MsgDelete  = {
  type: MsgOperation.delete;
  detail: KiteMsgDelete;
}

export type KiteMsgEvent = MsgSend | MsgDelete;

export function isPlaintextMsg(msg: KiteMsg): msg is PlaintextMsg {
  return (msg as PlaintextMsg).text !== undefined;
}

export function isFileMsg(msg: KiteMsg): msg is FileMsg {
  return (msg as FileMsg).file !== undefined;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export type KiteNotification = {
  message?: string;
  type?: NotificationType;
  duration?: number | 'auto';
}

export type ReplyKeyboardButton = {
  text: string;
};

export type ReplyKeyboardMarkup = {
  keyboard: (ReplyKeyboardButton|string)[][];
  isPersistent?: boolean;
  resizeKeyboard?: boolean;
  oneTimeKeyboard?: boolean;
  inputFieldPlaceholder?: string;
};

export type InlineKeyboardButton = ReplyKeyboardButton & {
  callbackData?: string;  
};

export type InlineKeyboardMarkup = {
  keyboard: InlineKeyboardButton[][];
};

export type KeyboardButton = string | (InlineKeyboardButton & ReplyKeyboardButton);
