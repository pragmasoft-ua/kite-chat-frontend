import {HumaneChat} from './humane-chat';
import {HumaneMsg} from './humane-msg';
import {HumaneMessage} from './humane-types';

declare global {
  interface HTMLElementTagNameMap {
    'humane-chat': HumaneChat;
    'humane-msg': HumaneMsg;
  }

  interface DocumentEventMap {
    'humane-chat.hide': CustomEvent;
    'humane-chat.show': CustomEvent;
    'humane-chat.send': CustomEvent<HumaneMessage>;
  }
}

export {HumaneChat} from './humane-chat';
export {HumaneMsg} from './humane-msg';
