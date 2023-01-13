import {describe, expect, it} from '@jest/globals';
import {MsgType, PlaintextMessage} from './kite-types';
import {decodeKiteMsg, encodeKiteMsg} from './serialization';

describe('serialization', () => {
  it('should be able to encode and then decode back kite message', () => {
    const plaintext: PlaintextMessage = {
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
});
