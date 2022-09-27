import {
  ConnectedMsg,
  DisconnectedMsg,
  ErrorMsg,
  HumaneMsg,
  MsgType,
  PlaintextMsg,
} from './humane-types';

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
  'chatId',
  'userId',
];

const DISCONNECTED_MSG_FIELDS: Array<keyof DisconnectedMsg> =
  CONNECTED_MSG_FIELDS;

const ERROR_MSG_FIELDS: Array<keyof ErrorMsg> = ['type', 'reason', 'code'];

const PLAINTEXT_MSG_FIELDS: Array<keyof PlaintextMsg> = [
  'type',
  'msgId',
  'chatId',
  'userId',
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

export const inflateHumaneMsg = (raw: unknown[]): HumaneMsg => {
  const msgType = raw[0] as MsgType;
  return HUMANE_MSG_INFLATERS[msgType](raw) as HumaneMsg;
};

export const deflateHumaneMsg = (msg: HumaneMsg): unknown[] => {
  return HUMANE_MSG_DEFLATERS[msg.type](msg);
};
