import {HumaneChatElement} from './humane-chat';
import {HumaneMsgElement} from './humane-msg';
import {HumaneMessage} from './humane-types';

declare global {
  interface HTMLElementTagNameMap {
    'humane-chat': HumaneChatElement;
    'humane-msg': HumaneMsgElement;
  }

  interface DocumentEventMap {
    'humane-chat.hide': CustomEvent;
    'humane-chat.show': CustomEvent;
    'humane-chat.send': CustomEvent<HumaneMessage>;
  }
}

export {HumaneChatElement} from './humane-chat';
export {HumaneMsgElement} from './humane-msg';
