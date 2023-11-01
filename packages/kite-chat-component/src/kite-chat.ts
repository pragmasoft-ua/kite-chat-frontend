/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import {LitElement, html, css, unsafeCSS, PropertyValues} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {sharedStyles} from './shared-styles';

import kiteChatStyles from './kite-chat.css?inline';
import {randomStringId} from './random-string-id';
import {
  FileMsg,
  isPlaintextMsg,
  KiteMsg,
  MsgStatus,
  PlaintextMsg,
} from './kite-payload';
import {AnchorController} from './anchor-controller';
import {DraggableController} from './draggable-controller';

console.debug('kite-chat loaded');

const componentStyles = css`
  ${unsafeCSS(kiteChatStyles)}
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
export class KiteChatElement extends LitElement {
  /**
   * opens chat dialog
   */
  @property({type: Boolean, reflect: true})
  open = false;

  @property()
  heading = '🪁Kite chat';

  @query('textarea')
  private textarea!: HTMLTextAreaElement;

  @query('#kite-dialog')
  private dialog!: HTMLElement;

  @state()
  private sendEnabled = false;

  protected anchorController!: AnchorController;

  protected draggableController = new DraggableController(this, "#kite-toggle", this._toggleOpen.bind(this));

  constructor() {
    super();

    if (!CSS.supports('anchor-name', '--combobox')) {
        // The anchor-name property is not supported
        this.anchorController = new AnchorController(this, {width: '20rem', height: '30rem'})
    }
  }

  override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.dialog.showPopover();
      } else {
        this.dialog.hidePopover();
      }
    }
  }

  override render() {
    return html`
      <div class="kite">
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
        <div
          popover="manual"
          id="kite-dialog"
          class="kite-dialog ${classMap({
            'scale-y-100': this.open,
            'scale-y-0': !this.open,
          })} selection:bg-primary-color fixed p-0 z-40 flex h-[30rem] w-[20rem] origin-bottom flex-col rounded border shadow-lg transition-transform selection:text-white"
        >
          <header
            class="bg-primary-color flex h-12 select-none flex-row items-center justify-between rounded-t p-2 text-secondary-color"
          >
            <h3 class="kite-title flex-1">${this.heading}</h3>
            <span
              data-close
              title="Close"
              class="cursor-pointer rounded-full bg-white bg-opacity-0 py-2 px-2.5 leading-none hover:bg-opacity-30"
              @click="${this._toggleOpen}"
              >✕</span
            >
          </header>
          <main
            class="flex flex-1 snap-y flex-col-reverse overflow-y-auto bg-slate-300/50 p-2"
          >
            <div class="flex min-h-min flex-col flex-wrap items-start">
              <slot></slot>
            </div>
          </main>
          <footer class="flex items-start gap-1 rounded-b p-2">
            <label>
              <input
                type="file"
                class="hidden"
                aria-hidden="true"
                multiple
                @change=${this._sendFile}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6 cursor-pointer opacity-50 hover:opacity-100"
              >
                <title>Attach file</title>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                />
              </svg>
            </label>
            <textarea
              required
              rows="1"
              autocomplete="on"
              spellcheck="true"
              wrap="soft"
              placeholder="Type a message"
              class="caret-primary-color max-h-24 min-h-[1.5rem] flex-1 resize-y border-none bg-transparent outline-none"
              @input=${this._handleEnabled}
              @keyup=${this._handleKeyUp}
            ></textarea>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="${classMap({
                'opacity-50': this.sendEnabled,
                'hover:opacity-100': this.sendEnabled,
                'cursor-pointer': this.sendEnabled,
                'opacity-30': !this.sendEnabled,
                'pointer-events-none': !this.sendEnabled,
              })} h-6 w-6"
              @click=${this._sendText}
            >
              <title>Send (Ctrl+↩)</title>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </footer>
        </div>
      </div>
    `;
  }

  private _toggleOpen() {
    this.open ? this.hide() : this.show();
  }

  private _sendText() {
    if (this.textarea.value?.length > 0) {
      const message: PlaintextMsg = {
        messageId: randomStringId(),
        timestamp: new Date(),
        status: MsgStatus.unknown,
        text: this.textarea.value,
      };
      if (this._dispatchMsg(message)) {
        this.appendMsg(message);
        this.textarea.value = '';
        this.textarea.focus();
        this._handleEnabled();
      }
    }
  }

  private _handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      this._sendText();
    }
  }

  private _handleEnabled() {
    this.sendEnabled = this.textarea.value.length > 0;
  }

  private _sendFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const numFiles = target.files?.length ?? 0;
    for (let i = 0; i < numFiles; i++) {
      const file = target.files?.item(i);
      if (!file) continue;
      const message: FileMsg = {
        messageId: randomStringId(),
        timestamp: new Date(),
        status: MsgStatus.unknown,
        file,
      };
      this._dispatchMsg(message) && this.appendMsg(message);
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

  hide() {
    if (!this.open) {
      return;
    }
    const e = new CustomEvent('kite-chat.hide', CUSTOM_EVENT_INIT);
    this.dispatchEvent(e);
    if (!e.defaultPrevented) {
      this.open = false;
    }
  }

  show() {
    if (this.open) {
      return;
    }
    const e = new CustomEvent('kite-chat.show', CUSTOM_EVENT_INIT);
    this.dispatchEvent(e);
    if (!e.defaultPrevented) {
      this.open = true;
      this.textarea.focus();
    }
  }

  appendMsg(msg: KiteMsg) {
    const {messageId = randomStringId(), timestamp = new Date(), status} = msg;
    const msgElement = document.createElement('kite-msg');
    msgElement.messageId = messageId;
    msgElement.timestamp = timestamp;
    msgElement.status = status;
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
