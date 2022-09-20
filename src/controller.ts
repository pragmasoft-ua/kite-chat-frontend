import {
  ConnectedPayload,
  ErrorPayload,
  HumaneMessage,
  Payload,
  PayloadType,
} from './humane-types';

import {HumaneChatElement} from './humane-chat';

const requiredElement = <T extends HTMLElement = HTMLElement>(
  selector: string
): T => {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Element '${selector}' is missing`);
  return el;
};

const sharedWorker = new SharedWorker(
  new URL('humane-worker.ts', import.meta.url),
  {
    type: 'module',
    name: '👩🏻/humane chat worker',
  }
);

sharedWorker.port.onmessage = (e: MessageEvent<Payload>) => {
  const payload = e.data;
  if (!payload) throw new Error('no payload');
  switch (payload.type) {
    case PayloadType.MSG:
      handleIncomingMessage(payload);
      break;
    case PayloadType.CONNECTED:
      handleConnected(payload);
      break;
    case PayloadType.ERROR:
      handleError(payload);
      break;
  }
};

const chat: HumaneChatElement = requiredElement('humane-chat');
const textarea: HTMLTextAreaElement = requiredElement('textarea');
const sendToChatBtn = requiredElement('#send');
const openBtn = requiredElement('#open');
const closeBtn = requiredElement('#close');
const colorpicker = requiredElement('#colorpicker');
const root = document.documentElement;

document.addEventListener('humane-chat.send', (e) => {
  const payload = e.detail;
  sharedWorker.port.postMessage({type: PayloadType.MSG, ...payload});
});

addEventListener('beforeunload', () =>
  sharedWorker.port.postMessage({
    type: PayloadType.DISCONNECTED,
    userId: chat.userId,
  })
);

sendToChatBtn.addEventListener('click', () => chat.incoming(textarea.value));
openBtn.addEventListener('click', () => chat.show());
closeBtn.addEventListener('click', () => chat.hide());
colorpicker.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const color = target.value;
  root.style.setProperty('--humane-primary-color', color);
});

sharedWorker.port.start();
sharedWorker.port.postMessage({
  type: PayloadType.CONNECTED,
  userId: chat.userId,
});

function handleIncomingMessage(incoming: HumaneMessage) {
  chat.incoming(incoming.msg, incoming.msgId, incoming.datetime);
}

function handleConnected(connected: ConnectedPayload) {
  console.log('Connected', connected.userId);
}

function handleError(e: ErrorPayload) {
  console.error(e.code, e.reason);
}
