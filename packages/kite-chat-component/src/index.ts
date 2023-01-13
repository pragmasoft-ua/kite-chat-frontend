import type {KiteChatElement} from './kite-chat';
import type {KiteMsgElement} from './kite-msg';
import type {PayloadMsg} from './kite-payload';

declare global {
  interface HTMLElementTagNameMap {
    'kite-chat': KiteChatElement;
    'kite-msg': KiteMsgElement;
  }
  interface HTMLElementEventMap {
    'kite-chat.hide': CustomEvent;
    'kite-chat.show': CustomEvent;
    'kite-chat.send': CustomEvent<PayloadMsg<string>>;
  }

  interface DocumentEventMap {
    'kite-chat.hide': CustomEvent;
    'kite-chat.show': CustomEvent;
    'kite-chat.send': CustomEvent<PayloadMsg<string>>;
  }
}

export * from './kite-chat';
export * from './kite-msg';
export * from './kite-payload';
export * from './random-string-id';
