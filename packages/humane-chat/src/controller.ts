import {
  ConnectedMsg,
  ErrorMsg,
  HumaneMsg,
  MsgType,
  PlaintextMsg,
} from './humane-types';

import {randomStringId} from '@pragmasoft-ukraine/humane-chat-component';

const userId = randomStringId();

console.debug('Install sharedWorker');

const sharedWorker = new SharedWorker(
  new URL('blob-url:./humane-worker.ts', import.meta.url),
  {
    type: 'module',
    name: '👩🏻/humane chat worker',
  }
);

sharedWorker.port.onmessage = (e: MessageEvent<HumaneMsg>) => {
  const payload = e.data;
  if (!payload) throw new Error('no payload');
  switch (payload.type) {
    case MsgType.PLAINTEXT:
      handleIncomingMessage(payload);
      break;
    case MsgType.CONNECTED:
      handleConnected(payload);
      break;
    case MsgType.ERROR:
      handleError(payload);
      break;
  }
};

addEventListener('beforeunload', () =>
  sharedWorker.port.postMessage({
    type: MsgType.DISCONNECTED,
    userId,
  })
);

sharedWorker.port.start();

sharedWorker.port.postMessage({
  type: MsgType.CONNECTED,
  userId,
});

function handleIncomingMessage(incoming: PlaintextMsg) {
  console.log(
    'Incoming',
    incoming.payload,
    incoming.msgId,
    incoming.timestamp.toISOString()
  );
}

function handleConnected(connected: ConnectedMsg) {
  console.log('Connected', connected.userId);
}

function handleError(e: ErrorMsg) {
  console.error(e.code, e.reason);
}
