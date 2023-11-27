/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property, query, queryAssignedElements, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {sharedStyles} from './shared-styles';

import kiteChatStyles from './kite-chat.css?inline';
import {randomStringId} from './random-string-id';
import {
  isPlaintextMsg,
  KiteMsg,
  MsgStatus,
} from './kite-payload';
import {
  SelectionContainerMixin,
  VisibilityMixin,
} from './mixins';
import {
  AnchorController, 
  DraggableController
} from './controllers';
import {
  KiteChatFooterElement, 
  KiteChatFooterChange,
  KiteChatHeaderElement
} from './components';
import {KiteMsgElement} from './kite-msg';

console.debug('kite-chat loaded');

const componentStyles = css`
  ${unsafeCSS(kiteChatStyles)}
  @position-fallback --flip {
      @try {
        bottom: calc(anchor(top) + var(--kite-gap));
        top: auto;
        left: auto;
        right: anchor(right);
      }
      @try {
        bottom: auto;
        top: calc(anchor(bottom) + var(--kite-gap));
        left: auto;
        right: anchor(right);
      }
      @try {
        bottom: calc(anchor(top) + var(--kite-gap));
        top: auto;
        left: anchor(left);
        right: auto;
      }
      @try {
        bottom: auto;
        top: calc(anchor(bottom) + var(--kite-gap));
        left: anchor(left);
        right: auto;
      }
  }
`;

const CUSTOM_EVENT_INIT = {
  bubbles: true,
  composed: true,
  cancelable: true,
};

/**
 * KiteChat is an embeddable livechat component
 *
 * @fires {CustomEvent} kite-chat.show - Chat window opens
 * @fires {CustomEvent} kite-chat.hide - Chat window closes
 * @fires {CustomEvent} kite-chat.send - Outgoing message is sent
 * @attr {Boolean} open - displays chat window if true or only toggle button if false or missing
 * @attr {"light" | "dark"} theme - defines kite chat theme, using prefers-color-scheme by default
 * @attr {string} heading - Chat dialog heading
 * @slot {"kite-msg" | "p"} - kite-chat component contains chat messages as nested subcomponents, allowing server-side rendering
 * @cssvar --kite-primary-color - accent color, styles toggle button, title bar, text selection, cursor
 * @cssvar --kite-secondary-color - accent contrast color, styles title, close button, toggle button icon color
 * @csspart toggle - The toggle button TODO implement
 */
@customElement('kite-chat')
export class KiteChatElement extends 
    VisibilityMixin(
      SelectionContainerMixin(
          LitElement, 
          KiteMsgElement
        ), 
      {show: 'kite-chat.show', hide: 'kite-chat.hide'}
    ) {
  @property()
  heading = '🪁Kite chat';

  @query('kite-chat-footer')
  private footer!: KiteChatFooterElement;

  @query('#kite-dialog')
  private dialog!: HTMLElement;

  @queryAssignedElements({selector: '[status]'})
  private sentMessageElements!: NodeListOf<KiteMsgElement>;

  private get editable() {
    return this.selectedElements.length === 1 
      && [...this.sentMessageElements].find((msgElement) => (
        this.selectedElements[0].isEqualNode(msgElement)
      ));
  }

  @state()
  private editMessage: KiteMsgElement|null = null;

  protected anchorController!: AnchorController;

  protected draggableController = new DraggableController(this, "#kite-toggle", this._toggleOpen.bind(this));

  constructor() {
    super();

    if (!CSS.supports('anchor-name', '--toggle')) {
        // The anchor-name property is not supported
        this.anchorController = new AnchorController(this, 
          '--custom-anchor',
          ['fallback-1', 'fallback-2', 'fallback-3', 'fallback-4'],
          '.kite-toggle', '.kite-dialog'
        );
    }
  }

  override render() {
    return html`
      ${this._renderToggle()}
      <dialog
        tabindex="-1"
        popover="manual"
        id="kite-dialog"
        class="kite-dialog ${classMap({
          'scale-y-100': this.open,
          'scale-y-0': !this.open,
        })} selection:bg-primary-color outline-none fixed p-0 z-40 flex origin-bottom flex-col rounded border shadow-lg transition-transform selection:text-white"
      >
        <kite-chat-header
          @kite-chat-header.cancel=${this._unselect}
          @kite-chat-header.edit=${this._edit}
          @kite-chat-header.delete=${this._delete}
          @kite-chat-header.close=${this._toggleOpen}
          .editable=${!!this.editable}
          .selectedElementsCount=${this.selectedElements.length}
          .heading=${this.heading}
        >
        </kite-chat-header>
        <main
          class="flex flex-1 snap-y flex-col-reverse overflow-y-auto bg-slate-300/50 p-2"
        >
          <div class="flex min-h-min flex-col flex-wrap items-start">
            ${this._renderSelectionContainer()}
          </div>
        </main>
        <kite-chat-footer
          @kite-chat-footer.change=${this._handleSend}
          .editMessage=${this.editMessage}
        >
        </kite-chat-footer>
      </dialog>
    `;
  }

  private _renderToggle() {
    return html`
      <div
        id="kite-toggle"
        title="Show live chat dialog"
        class="kite-toggle bg-primary-color fixed right-4 bottom-4 z-30 h-12 w-12 cursor-pointer rounded-full p-2 text-secondary-color shadow hover:text-opacity-80"
        popovertarget="kite-dialog"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      </div>
    `;
  }

  private _edit() {
    this.editMessage = this.selectedElements[0] ?? null;
  }

  private _delete() {
    //TODO api call
    this.selectedElements.forEach((msgElement) => {
      msgElement.remove();
    });
  }

  override _visibilityCallback(): void {
    if (this.open) {
      this.footer.focus();
      this.dialog.showPopover();
    } else {
      this.footer.blur();
      this.dialog.hidePopover();
    }
  }

  editMsg(msg: KiteMsg) {
    if(!msg.messageId || !this.editMessage) {
      return;
    }
    const {messageId, timestamp = new Date(), status} = msg;
    this.editMessage.messageId = messageId;
    this.editMessage.timestamp = timestamp;
    this.editMessage.status = status;
    this.editMessage.edited = true;
    if (isPlaintextMsg(msg)) {
      this.editMessage.innerText = msg.text;
    } else {
      const {file} = msg;
      const fileElement = this.editMessage.querySelector('kite-file');
      fileElement && (fileElement.file = file);
    }
    this.editMessage.scrollIntoView(false);
    this.editMessage = null;
  }

  private _handleSend(e: CustomEvent<KiteChatFooterChange>) {
    const message: KiteMsg = {
      messageId: this.editMessage ? this.editMessage.messageId : randomStringId(),
      timestamp: new Date(),
      status: MsgStatus.unknown,
      edited: !!this.editMessage,
      ...e.detail,
    };
    if (this._dispatchMsg(message)) {
      if(this.editMessage) {
        this.editMsg(message);
      } else {
        this.appendMsg(message);
      }
    }
  }

  private _dispatchMsg(detail: KiteMsg): boolean {
    const e = new CustomEvent<KiteMsg>('kite-chat.send', {
      ...CUSTOM_EVENT_INIT,
      detail,
    });
    this.dispatchEvent(e);
    return !e.defaultPrevented;
  }

  appendMsg(msg: KiteMsg) {
    const {messageId = randomStringId(), timestamp = new Date(), status, edited} = msg;
    const msgElement = document.createElement('kite-msg');
    msgElement.messageId = messageId;
    msgElement.timestamp = timestamp;
    msgElement.status = status;
    msgElement.edited = edited;
    if (isPlaintextMsg(msg)) {
      msgElement.innerText = msg.text;
    } else {
      const {file} = msg;
      const fileElement = document.createElement('kite-file');
      fileElement.file = file;
      msgElement.appendChild(fileElement);
    }
    this.appendChild(msgElement);
    msgElement.scrollIntoView(false);
    this.show();
  }

  static override styles = [sharedStyles, componentStyles];
}

export {KiteChatFooterElement, KiteChatHeaderElement};