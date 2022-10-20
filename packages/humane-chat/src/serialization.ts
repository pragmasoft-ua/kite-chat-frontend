import type {
  ConnectedMsg,
  DisconnectedMsg,
  ErrorMsg,
  HumaneMsg,
  MsgType,
  PlaintextMsg,
} from './humane-types';
import {Decoder, Encoder} from '@msgpack/msgpack';

const inflaterFactory = (fields: string[]) => (raw: unknown[]) =>
  raw.reduce<Record<string, unknown>>((obj, field, index) => {
    obj[fields[index]] = field;
    return obj;
  }, {});

const deflaterFactory = (fields: string[]) => (obj: Record<string, unknown>) =>
  fields.reduce<unknown[]>((arr, field) => {
    arr.push(obj[field]);
    return arr;
  }, []);

const CONNECTED_MSG_FIELDS: Array<keyof ConnectedMsg> = [
  'type',
  'endpoint',
  'userId',
];

const DISCONNECTED_MSG_FIELDS: Array<keyof DisconnectedMsg> = [
  'type',
  'userId',
];

const ERROR_MSG_FIELDS: Array<keyof ErrorMsg> = ['type', 'reason', 'code'];

const PLAINTEXT_MSG_FIELDS: Array<keyof PlaintextMsg> = [
  'type',
  'msgId',
  'timestamp',
  'status',
  'payload',
];

const HUMANE_MSG_INFLATERS = [
  inflaterFactory(CONNECTED_MSG_FIELDS),
  inflaterFactory(DISCONNECTED_MSG_FIELDS),
  inflaterFactory(ERROR_MSG_FIELDS),
  inflaterFactory(PLAINTEXT_MSG_FIELDS),
];

const HUMANE_MSG_DEFLATERS = [
  deflaterFactory(CONNECTED_MSG_FIELDS),
  deflaterFactory(DISCONNECTED_MSG_FIELDS),
  deflaterFactory(ERROR_MSG_FIELDS),
  deflaterFactory(PLAINTEXT_MSG_FIELDS),
];

const inflateHumaneMsg = (raw: unknown[]): HumaneMsg => {
  const msgType = raw[0] as MsgType;
  return HUMANE_MSG_INFLATERS[msgType](raw) as HumaneMsg;
};

const deflateHumaneMsg = (msg: HumaneMsg): unknown[] => {
  return HUMANE_MSG_DEFLATERS[msg.type](msg);
};

const encoder = new Encoder();
const decoder = new Decoder();

export const deserializeHumaneMsg = (buffer: ArrayBuffer): HumaneMsg => {
  const raw = decoder.decode(buffer);
  return inflateHumaneMsg(raw as unknown[]);
};

export const serializeHumaneMsg = (msg: HumaneMsg): ArrayBuffer => {
  const deflated = deflateHumaneMsg(msg);
  const encoded = encoder.encode(deflated);
  return encoded.buffer;
};
