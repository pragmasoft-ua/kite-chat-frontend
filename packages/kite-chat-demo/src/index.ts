import {
  isPlaintextMsg,
  KiteChat,
  KiteMsg,
  prettyBytes,
} from '@pragmasoft-ukraine/kite-chat';

const endpoint = import.meta.env.VITE_WS_ENDPOINT;

console.log('endpoint', endpoint);

const kiteChat = new KiteChat({endpoint, createIfMissing: true});
addEventListener('beforeunload', () => kiteChat.disconnect());

const requiredElement = <T extends HTMLElement = HTMLElement>(
  selector: string
): T => {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Element '${selector}' is missing`);
  return el;
};

const textarea: HTMLTextAreaElement = requiredElement('textarea');
const sendToChatBtn = requiredElement('#send');
const openBtn = requiredElement('#open');
const closeBtn = requiredElement('#close');
const colorpicker = requiredElement('#colorpicker');
const outgoing = requiredElement('section#outgoing');
const root = document.documentElement;
const fileInfo = (file: File) => `${file.name} (${prettyBytes(file.size)})`;

kiteChat.element?.addEventListener(
  'kite-chat.send',
  (e: CustomEvent<KiteMsg>) => {
    const payload = e.detail;
    outgoing.insertAdjacentHTML(
      'beforeend',
      `<p>${payload?.timestamp?.toISOString()}: ${
        isPlaintextMsg(payload) ? payload.text : fileInfo(payload.file)
      }</p>`
    );
  }
);

sendToChatBtn.addEventListener('click', () =>
  kiteChat.element?.appendMsg({text: textarea.value})
);
openBtn.addEventListener('click', () => kiteChat.element?.show());
closeBtn.addEventListener('click', () => kiteChat.element?.hide());
colorpicker.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const color = target.value;
  root.style.setProperty('--kite-primary-color', color);
});
