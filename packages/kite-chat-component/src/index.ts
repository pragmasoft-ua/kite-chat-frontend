import '@webcomponents/scoped-custom-element-registry';
import type {
  KiteChatElement, 
  KiteMsgSend, 
  KiteMsgDelete, 
  KiteMsgSelect,
} from './kite-chat';
import type {KiteFileElement} from './kite-file';
import type {KiteMsgElement} from './kite-msg';
import type {
  KiteNotificationElement,
  KiteCustomKeyboardElement
} from './components';
import "@oddbird/popover-polyfill";

declare global {
  interface HTMLElementTagNameMap {
    'kite-chat': KiteChatElement;
    'kite-msg': KiteMsgElement;
    'kite-file': KiteFileElement;
    'kite-toast-notification': KiteNotificationElement;
    'kite-custom-keyboard': KiteCustomKeyboardElement;
  }
  interface HTMLElementEventMap {
    'kite-chat.hide': CustomEvent;
    'kite-chat.show': CustomEvent;
    'kite-chat.send': CustomEvent<KiteMsgSend>;
    'kite-chat.delete': CustomEvent<KiteMsgDelete>;
    'kite-chat.select': CustomEvent<KiteMsgSelect>;
  }

  interface DocumentEventMap {
    'kite-chat.hide': CustomEvent;
    'kite-chat.show': CustomEvent;
    'kite-chat.send': CustomEvent<KiteMsgSend>;
    'kite-chat.delete': CustomEvent<KiteMsgDelete>;
    'kite-chat.select': CustomEvent<KiteMsgSelect>;
  }
}

export * from './components';
export * from './kite-chat';
export * from './kite-msg';
export * from './kite-file';
export * from './kite-payload';
export * from './random-string-id';
export {default as prettyBytes} from 'pretty-bytes';
