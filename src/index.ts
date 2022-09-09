import {HumaneChat} from './humane-chat';
import {HumaneMsg} from './humane-msg';
declare global {
  interface HTMLElementTagNameMap {
    'humane-chat': HumaneChat;
    'humane-msg': HumaneMsg;
  }
}

export {HumaneChat} from './humane-chat';
export {HumaneMsg} from './humane-msg';
