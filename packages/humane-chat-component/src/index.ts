import type {HumaneChatElement} from './humane-chat';
import type {HumaneMsgElement} from './humane-msg';
import type {PayloadMsg} from './humane-payload';

declare global {
  interface HTMLElementTagNameMap {
    'humane-chat': HumaneChatElement;
    'humane-msg': HumaneMsgElement;
  }

  interface DocumentEventMap {
    'humane-chat.hide': CustomEvent;
    'humane-chat.show': CustomEvent;
    'humane-chat.send': CustomEvent<PayloadMsg<string>>;
  }
}

export * from './humane-chat';
export * from './humane-msg';
export * from './humane-payload';
export * from './random-string-id';
