import {
  JoinChannel,
  OK,
  MsgAck,
  ErrorMsg,
  KiteMsg,
  MsgType,
  PlaintextMsg,
  BinaryMsg,
  UploadRequest,
  UploadResponse,
  Ping,
  Pong,
} from './kite-types';

declare type Decoder = (raw: unknown[]) => Record<string, unknown>;
declare type Encoder = (obj: Record<string, unknown>) => unknown[];

const decoderFactory = (fields: string[]) => (raw: unknown[]) =>
  raw.reduce<Record<string, unknown>>((obj, field, index) => {
    const fieldName = fields[index];
    const decoder = FIELD_DECODERS[fieldName];
    const value = decoder ? decoder(field) : field;
    obj[fieldName] = value;
    return obj;
  }, {});

const encoderFactory = (fields: string[]) => (obj: Record<string, unknown>) =>
  fields.reduce<unknown[]>((arr, fieldName) => {
    const value = obj[fieldName];
    const encoder = FIELD_ENCODERS[fieldName];
    const encoded = encoder ? encoder(value) : value;
    arr.push(encoded);
    return arr;
  }, []);

type Codec = (val: unknown) => unknown;

const FIELD_DECODERS: Record<string, Codec> = {
  timestamp: (val: unknown) => new Date(val as string),
};

const FIELD_ENCODERS: Record<string, Codec> = {
  timestamp: (val) => (val as Date).toISOString(),
  endpoint: (val) => new URL(val as string).searchParams.get('c'),
};

const JOIN_CHANNEL_FIELDS: Array<keyof JoinChannel> = [
  'type',
  'memberId',
  'memberName',
  'endpoint',
];

const MESSAGE_ACK_FIELDS: Array<keyof MsgAck> = [
  'type',
  'messageId',
  'destiationMessageId',
  'timestamp',
];

const ERROR_RESPONSE_FIELDS: Array<keyof ErrorMsg> = ['type', 'reason', 'code'];

const PLAINTEXT_MESSAGE_FIELDS: Array<keyof PlaintextMsg> = [
  'type',
  'messageId',
  'text',
  'timestamp',
];

const BINARY_MESSAGE_FIELDS: Array<keyof BinaryMsg> = [
  'type',
  'messageId',
  'url',
  'fileName',
  'fileType',
  'fileSize',
  'timestamp',
];

const UPLOAD_REQUEST_FIELDS: Array<keyof UploadRequest> = [
  'type',
  'messageId',
  'fileName',
  'fileType',
  'fileSize',
];

const UPLOAD_RESPONSE_FIELDS: Array<keyof UploadResponse> = [
  'type',
  'messageId',
  'url',
];

const PING_FIELDS: Array<keyof Ping> = ['type'];

const PONG_FIELDS: Array<keyof Pong> = PING_FIELDS;

const OK_FIELDS: Array<keyof OK> = PING_FIELDS;

const KITE_MSG_DECODERS: Partial<Record<MsgType, Decoder>> = {
  [MsgType.ACK]: decoderFactory(MESSAGE_ACK_FIELDS),
  [MsgType.OK]: decoderFactory(OK_FIELDS),
  [MsgType.ERROR]: decoderFactory(ERROR_RESPONSE_FIELDS),
  [MsgType.PLAINTEXT]: decoderFactory(PLAINTEXT_MESSAGE_FIELDS),
  [MsgType.UPLOAD]: decoderFactory(UPLOAD_RESPONSE_FIELDS),
  [MsgType.BIN]: decoderFactory(BINARY_MESSAGE_FIELDS),
  [MsgType.PONG]: decoderFactory(PONG_FIELDS),
};

const KITE_MSG_ENCODERS: Partial<Record<MsgType, Encoder>> = {
  [MsgType.JOIN]: encoderFactory(JOIN_CHANNEL_FIELDS),
  [MsgType.PLAINTEXT]: encoderFactory(PLAINTEXT_MESSAGE_FIELDS),
  [MsgType.UPLOAD]: encoderFactory(UPLOAD_REQUEST_FIELDS),
  [MsgType.BIN]: encoderFactory(BINARY_MESSAGE_FIELDS),
  [MsgType.PING]: encoderFactory(PING_FIELDS),
};

export const decodeKiteMsg = (raw: string): KiteMsg => {
  const array = JSON.parse(raw);
  if (!Array.isArray(array)) {
    throw new Error('Bad message');
  }
  const msgType = array[0] as MsgType;
  const decoder = KITE_MSG_DECODERS[msgType];
  if (!decoder) {
    throw new Error('Unsupported decoder for message type ' + msgType);
  }
  return decoder(array) as KiteMsg;
};

export const encodeKiteMsg = (msg: KiteMsg): string => {
  const msgType = msg.type;
  const encoder = KITE_MSG_ENCODERS[msgType];
  if (!encoder) {
    throw new Error('Unsupported encoder for message type ' + msgType);
  }
  const raw = encoder(msg);
  return JSON.stringify(raw);
};
