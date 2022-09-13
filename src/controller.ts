import {HumaneChat} from './humane-chat';

const requiredElement = <T extends HTMLElement = HTMLElement>(
  selector: string
): T => {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Element '${selector}' is missing`);
  return el;
};

const chat: HumaneChat = requiredElement('humane-chat');
const textarea: HTMLTextAreaElement = requiredElement('textarea');
const receive = requiredElement('#receive');
const openBtn = requiredElement('#open');
const closeBtn = requiredElement('#close');

document.addEventListener('humane-chat.send', console.log);

receive.addEventListener('click', () => chat.incoming(textarea.value));
openBtn.addEventListener('click', () => chat.show());
closeBtn.addEventListener('click', () => chat.hide());
