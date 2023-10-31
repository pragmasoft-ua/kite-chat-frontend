import type {KiteChatElement} from './kite-chat';
import {KiteFileElement} from './kite-file';
import type {KiteMsgElement} from './kite-msg';
import type {KiteMsg} from './kite-payload';
import "@oddbird/popover-polyfill";

declare global {
  interface HTMLElementTagNameMap {
    'kite-chat': KiteChatElement;
    'kite-msg': KiteMsgElement;
    'kite-file': KiteFileElement;
  }
  interface HTMLElementEventMap {
    'kite-chat.hide': CustomEvent;
    'kite-chat.show': CustomEvent;
    'kite-chat.send': CustomEvent<KiteMsg>;
  }

  interface DocumentEventMap {
    'kite-chat.hide': CustomEvent;
    'kite-chat.show': CustomEvent;
    'kite-chat.send': CustomEvent<KiteMsg>;
  }
}

export * from './kite-chat';
export * from './kite-msg';
export * from './kite-file';
export * from './kite-payload';
export * from './random-string-id';
export {default as prettyBytes} from 'pretty-bytes';
