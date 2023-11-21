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
  FileMsg,
  isPlaintextMsg,
  KiteMsg,
  MsgStatus,
  PlaintextMsg,
} from './kite-payload';
import {
  SelectionContainerMixin,
  VisibilityMixin,
  FileInputMixin
} from './mixins';
import {
  AnchorController, 
  DraggableController
} from './controllers';
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
export class KiteChatElement extends FileInputMixin(VisibilityMixin(SelectionContainerMixin(LitElement, KiteMsgElement), {show: 'kite-chat.show', hide: 'kite-chat.hide'})) {
  @property()
  heading = '🪁Kite chat';

  @query('textarea')
  private textarea!: HTMLTextAreaElement;

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

  @state()
  private sendEnabled = false;

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
        <dialog
          tabindex="-1"
          popover="manual"
          id="kite-dialog"
          class="kite-dialog ${classMap({
            'scale-y-100': this.open,
            'scale-y-0': !this.open,
          })} selection:bg-primary-color outline-none fixed p-0 z-40 flex origin-bottom flex-col rounded border shadow-lg transition-transform selection:text-white"
        >
          <header
            class="bg-primary-color flex h-12 select-none flex-row items-center justify-between rounded-t p-2 text-secondary-color"
          >
            ${
              this.renderSelected() || html`
                  <h3 class="kite-title flex-1">${this.heading}</h3>
                  <span
                    data-close
                    title="Close"
                    class="cursor-pointer rounded-full bg-white bg-opacity-0 py-2 px-2.5 leading-none hover:bg-opacity-30"
                    @click="${this._toggleOpen}"
                    >✕</span
                  >
                `
            }
          </header>
          <main
            class="flex flex-1 snap-y flex-col-reverse overflow-y-auto bg-slate-300/50 p-2"
          >
            <div class="flex min-h-min flex-col flex-wrap items-start">
              ${this._renderSelectionContainer()}
            </div>
          </main>
          <footer class="flex flex-col">
            ${this.renderEdited()}
            <div class="flex items-start gap-1 rounded-b p-2">
              ${this._renderFileInput()}
              <textarea
                required
                rows="1"
                autocomplete="on"
                spellcheck="true"
                wrap="soft"
                placeholder="Type a message"
                class="caret-primary-color w-full max-h-24 min-h-[1.5rem] flex-1 resize-y border-none bg-transparent outline-none"
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
            </div>
          </footer>
        </dialog>
      </div>
    `;
  }

  private renderSelected() {
    if(this.selectedElements.length === 0) {
      return null;
    }
    return html`
      <span
        data-cancel
        title="Cancel"
        class="cursor-pointer rounded-full bg-white bg-opacity-0 py-2 px-2.5 leading-none hover:bg-opacity-30"
        @click="${this._unselect}"
        >✕</span
      >
      <span class="flex-1">${this.selectedElements.length} selected</span>
      ${
        this.editable ? html`
          <span
            data-edit
            title="Edit"
            class="cursor-pointer h-full aspect-square rounded-full bg-white bg-opacity-0 py-1 px-1.5 leading-none hover:bg-opacity-30"
            @click="${this._edit}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full" fill="currentColor" viewBox="0 0 30 30">
              <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"></path>
            </svg>
          </span>
        ` : null
      }
      <span
        data-delete
        title="Delete"
        class="cursor-pointer h-full aspect-square rounded-full bg-white bg-opacity-0 py-1 px-1.5 leading-none hover:bg-opacity-30"
        @click="${this._delete}"
      >
      <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 50 50">
        <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z"></path>
      </svg>
    </span>
    `;
  }

  private renderEdited() {
    if(!this.editMessage) {
      return null;
    }
    const file = this.editMessage.querySelector('kite-file');
    return html`
      <div class="flex items-center gap-1 rounded-b p-2">
        ${!file
          ? html`<span class="edit-message">${this.editMessage.textContent}</span>`
          : html`<span 
            class="edit-message edit-message_file" 
            @click="${() => this.fileInput.click()}"
          >${file.name}</span>`
        }
        <span
          data-cancel
          title="Cancel"
          class="cursor-pointer py-2 px-2.5"
          @click="${this._cancelEdit}"
          >
          <svg xmlns="http://www.w3.org/2000/svg" class="opacity-30 pointer-events-none  h-6 w-6" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" />
          </svg>
          </span
        >
      </div>
    `;
  }

  private _cancelEdit() {
    if(!this.editMessage) {
      return;
    }
    if(!this.editMessage.querySelector('kite-file')) {
      this.textarea.value = '';
      this.textarea.blur();
    }
    this.editMessage = null;
  }

  private _edit() {
    this.editMessage = this.selectedElements[0] ?? null;
    if (this.editMessage) {
      this.editMessage.unselect();
      if(!this.editMessage.querySelector('kite-file')) {
        this.textarea.value = this.editMessage.innerText;
        this.textarea.focus();
      }
    }
  }

  private _delete() {
    //TODO api call
    this.selectedElements.forEach((msgElement) => {
      msgElement.remove();
    });
  }

  override _visibilityCallback(): void {
    if (this.open) {
      this.textarea.focus();
      this.dialog.showPopover();
    } else {
      this.textarea.blur();
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

  private _sendText() {
    if (this.textarea.value?.length > 0) {
      const message: PlaintextMsg = {
        messageId: this.editMessage ? this.editMessage.messageId : randomStringId(),
        timestamp: new Date(),
        status: MsgStatus.unknown,
        text: this.textarea.value,
        edited: !!this.editMessage,
      };
      if (this._dispatchMsg(message)) {
        if(this.editMessage) {
          this.editMsg(message);
        } else {
          this.appendMsg(message);
        }
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

  override _fileInputCallback(file: File) {
    const message: FileMsg = {
      messageId: this.editMessage ? this.editMessage.messageId : randomStringId(),
      timestamp: new Date(),
      status: MsgStatus.unknown,
      edited: !!this.editMessage,
      file,
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
