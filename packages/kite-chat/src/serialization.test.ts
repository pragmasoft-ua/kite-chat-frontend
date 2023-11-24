import {describe, expect, it} from '@jest/globals';
import {MsgType, PlaintextMsg} from './kite-types';
import {decodeKiteMsg, encodeKiteMsg} from './serialization';

describe('serialization', () => {
  it('should be able to encode and then decode back kite message', () => {
    const plaintext: PlaintextMsg = {
      type: MsgType.PLAINTEXT,
      messageId: 'SomeTextId',
      text: 'Some text',
      timestamp: new Date(),
    };

    const encoded = encodeKiteMsg(plaintext);
    console.log(encoded);

    const decoded = decodeKiteMsg(encoded);
    console.log(decoded);

    expect(decoded).toStrictEqual(plaintext);
  });

  it('should be able to encode kite message with status', () => {
    const plaintext: PlaintextMsg = {
      type: MsgType.PLAINTEXT,
      messageId: 'ui4bJAV0Jo',
      text: 'hello',
      timestamp: new Date('2023-11-23T13:19:07.255Z'),
      status: 2,
    };

    const encoded = JSON.stringify(["TXT","ui4bJAV0Jo","hello","2023-11-23T13:19:07.255Z",2]);
    console.log(encoded);

    const decoded = decodeKiteMsg(encoded);
    console.log(decoded);

    expect(decoded).toStrictEqual(plaintext);
  });
});
