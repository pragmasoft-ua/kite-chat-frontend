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
  edited: boolean; 
};

export type PlaintextMsg = BaseMsg & {
  text: string;
};

export type FileMsg = BaseMsg & {
  file: File;
  batchId?: string;
  totalFiles?: number;
};

export type KiteMsg = PlaintextMsg | FileMsg;

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
}
