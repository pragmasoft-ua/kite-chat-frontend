/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import {LitElement, html, css, unsafeCSS, PropertyValues} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {sharedStyles} from '../../shared-styles';

import footerStyles from './kite-chat-footer.css?inline';

import {KiteMsgElement} from '../../kite-msg';
import {randomStringId} from '../../random-string-id';

const CUSTOM_EVENT_INIT = {
  bubbles: true,
  composed: false,
  cancelable: false,
};

const componentStyles = css`
  ${unsafeCSS(footerStyles)}
`;

type ChangeTextarea = {
  text: string;
}

type ChangeFile = {
  file: File;
  batchId: string;
  totalFiles: number;
}

export type KiteChatFooterChange = ChangeTextarea | ChangeFile;

/**
 * KiteChat component footer
 *
 * @fires {CustomEvent} kite-chat-footer.change
 */
@customElement('kite-chat-footer')
export class KiteChatFooterElement extends LitElement {
  @query('textarea')
  private textarea!: HTMLTextAreaElement;

  @query('input[type="file"]')
  private fileInput!: HTMLInputElement;

  @state()
  private sendEnabled = false;

  @state()
  editMessage: KiteMsgElement|null = null;

  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    if (changedProperties.has('editMessage') && this.editMessage) {
      this.editMessage.unselect();
      if(!this.editMessage.querySelector('kite-file')) {
        this.textarea.value = this.editMessage.innerText;
        this.textarea.focus();
      }
    }
  }

  override blur() {
    this.textarea?.blur();
  }

  override focus() {
    this.textarea?.focus();
  }

  private _handleEnabled() {
    this.sendEnabled = this.textarea.value.length > 0;
  }

  private _handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      this._sendText();
    }
  }

  private _sendText() {
    this.dispatchEvent(new CustomEvent<KiteChatFooterChange>('kite-chat-footer.change', {
      ...CUSTOM_EVENT_INIT,
      detail: {
        text: this.textarea.value
      }
    }))
    this.textarea.value = '';
    this.textarea.focus();
    this._handleEnabled();
  }

  private _onFileInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []).filter(file => file);
    const batchId = randomStringId();
    files.forEach(file => {
      this.dispatchEvent(new CustomEvent<KiteChatFooterChange>('kite-chat-footer.change', {
        ...CUSTOM_EVENT_INIT,
        detail: {
          file,
          batchId,
          totalFiles: files.length,
        }
      }))
    });
}

  private _renderFileInput() {
    return html`
        <label>
            <input
                type="file"
                class="hidden"
                aria-hidden="true"
                multiple
                @change=${this._onFileInput}
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
    `;
  }

  private _renderTextInput() {
    return html`
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
    `;
  }

  private _renderEdited() {
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

  override render() {
    return html`
      ${this._renderEdited()}
      <div class="flex items-start gap-1 rounded-b p-2">
        ${this._renderFileInput()}
        ${this._renderTextInput()}
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
    `;
  }

  static override styles = [sharedStyles, componentStyles];
}
