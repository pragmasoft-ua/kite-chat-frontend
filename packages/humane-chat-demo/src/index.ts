import '@pragmasoft-ukraine/humane-chat'; // imported for side effect, registering web components
import type {HumaneChatElement} from '@pragmasoft-ukraine/humane-chat-component';

const requiredElement = <T extends HTMLElement = HTMLElement>(
  selector: string
): T => {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Element '${selector}' is missing`);
  return el;
};

const chat: HumaneChatElement = requiredElement('humane-chat');
const textarea: HTMLTextAreaElement = requiredElement('textarea');
const sendToChatBtn = requiredElement('#send');
const openBtn = requiredElement('#open');
const closeBtn = requiredElement('#close');
const colorpicker = requiredElement('#colorpicker');
const outgoing = requiredElement('section#outgoing');
const root = document.documentElement;

document.addEventListener('humane-chat.send', (e) => {
  const payload = e.detail;
  outgoing.insertAdjacentHTML(
    'beforeend',
    `<p>${payload.timestamp.toISOString()}: ${payload.payload}</p>`
  );
});

sendToChatBtn.addEventListener('click', () => chat.incoming(textarea.value));
openBtn.addEventListener('click', () => chat.show());
closeBtn.addEventListener('click', () => chat.hide());
colorpicker.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const color = target.value;
  root.style.setProperty('--humane-primary-color', color);
});
