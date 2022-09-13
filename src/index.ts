import {HumaneChat, HumaneMessageOutgoing} from './humane-chat';
import {HumaneMsg} from './humane-msg';
declare global {
  interface HTMLElementTagNameMap {
    'humane-chat': HumaneChat;
    'humane-msg': HumaneMsg;
  }

  interface DocumentEventMap {
    'humane-chat.hide': CustomEvent;
    'humane-chat.show': CustomEvent;
    'humane-chat.send': CustomEvent<HumaneMessageOutgoing>;
  }
}

export {HumaneChat} from './humane-chat';
export {HumaneMsg} from './humane-msg';
