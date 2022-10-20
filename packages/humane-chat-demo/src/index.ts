import {HumaneChat} from '@pragmasoft-ukraine/humane-chat';

const base = new URL(import.meta.url);
const endpoint = new URL(`ws://${base.host}${import.meta.env.WS}`);

console.log('endpoint', endpoint);

const humaneChat = new HumaneChat({endpoint, createIfMissing: true});
addEventListener('beforeunload', () => humaneChat.disconnect());

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

humaneChat.element?.addEventListener('humane-chat.send', (e: CustomEvent) => {
  const payload = e.detail;
  outgoing.insertAdjacentHTML(
    'beforeend',
    `<p>${payload.timestamp.toISOString()}: ${payload.payload}</p>`
  );
});

sendToChatBtn.addEventListener('click', () =>
  humaneChat.element?.incoming(textarea.value)
);
openBtn.addEventListener('click', () => humaneChat.element?.show());
closeBtn.addEventListener('click', () => humaneChat.element?.hide());
colorpicker.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const color = target.value;
  root.style.setProperty('--humane-primary-color', color);
});
