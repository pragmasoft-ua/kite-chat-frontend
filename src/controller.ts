import {HumaneChat} from './humane-chat';

const requiredElement = <T extends HTMLElement = HTMLElement>(
  selector: string
): T => {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Element '${selector}' is missing`);
  return el;
};

const sharedWorker = new SharedWorker(
  new URL('./humane-worker.ts', import.meta.url),
  {
    type: 'module',
    name: '👩🏻/humane chat worker',
  }
);

sharedWorker.port.onmessage = console.log;

const chat: HumaneChat = requiredElement('humane-chat');
const textarea: HTMLTextAreaElement = requiredElement('textarea');
const sendToChatBtn = requiredElement('#send');
const openBtn = requiredElement('#open');
const closeBtn = requiredElement('#close');
const colorpicker = requiredElement('#colorpicker');
const root = document.documentElement;

document.addEventListener('humane-chat.send', (e) => alert(e.detail.msg));

sendToChatBtn.addEventListener('click', () => chat.incoming(textarea.value));
openBtn.addEventListener('click', () => chat.show());
closeBtn.addEventListener('click', () => chat.hide());
colorpicker.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const color = target.value;
  root.style.setProperty('--humane-primary-color', color);
});
