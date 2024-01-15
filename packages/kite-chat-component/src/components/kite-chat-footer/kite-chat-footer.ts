/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import {LitElement, html, css, unsafeCSS, PropertyValues} from 'lit';
import {query, state, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {sharedStyles} from '../../shared-styles';
import {ScopedElementsMixin} from '@open-wc/scoped-elements/lit-element.js';
import {KiteIconElement} from '../kite-icon';
import {KiteCustomKeyboardElement} from '../kite-custom-keyboard';
import type {ReplyKeyboardMarkup as KeyboardMarkup} from '../../kite-payload';

import footerStyles from './kite-chat-footer.css?inline';

import {KiteMsgElement} from '../../kite-msg';
import {randomStringId} from '../../random-string-id';

import {
  ClipboardController,
  CustomKeyboardController,
} from '../../controllers';

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
 * @fires {CustomEvent} kite-chat-footer.cancel
 */
export class KiteChatFooterElement extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'kite-icon': KiteIconElement,
    'kite-custom-keyboard': KiteCustomKeyboardElement,
  };

  @query('textarea')
  private textarea!: HTMLTextAreaElement;

  @query('input[type="file"]')
  private fileInput!: HTMLInputElement;

  @state()
  private sendEnabled = false;

  @property({type: Object})
  customKeyboardMarkup: KeyboardMarkup|null = null;

  @property()
  editMessage: KiteMsgElement|null = null;

  protected clipboardController = new ClipboardController(this);

  protected keyboardController = new CustomKeyboardController(this);

  private get editMessageFile() {
    return this.editMessage?.querySelector('kite-file');
  }

  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    if (changedProperties.has('editMessage') && this.editMessage) {
      this.editMessage.unselect();
      if(!this.editMessage.querySelector('kite-file')) {
        this.textarea.value = this.editMessage.innerText;
        this.textarea.focus();
      } else {
        this.fileInput.click();
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
    this.sendEnabled && this.keyboardController.setMode(true);
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

  private _sendAction(e: CustomEvent) {
    const {text} = e.detail;
    this.dispatchEvent(new CustomEvent<KiteChatFooterChange>('kite-chat-footer.change', {
      ...CUSTOM_EVENT_INIT,
      detail: {text}
    }))
    this.customKeyboardMarkup?.oneTimeKeyboard && this._switchKeyboard();
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

  private _renderEdited() {
    if(!this.editMessage) {
      return null;
    }
    return html`
      <div class="flex items-center gap-1 rounded-b p-2">
        ${!this.editMessageFile
          ? html`<span class="edit-message">${this.editMessage.textContent}</span>`
          : html`<span 
            class="edit-message edit-message_file" 
            @click="${() => this.fileInput.click()}"
          >${this.editMessageFile.name}</span>`
        }
        <kite-icon
          data-cancel
          icon="arrow-back" 
          title="Cancel" 
          class="icon active-icon my-2 mx-2.5"
          @click="${this._cancelEdit}"
        ></kite-icon>
      </div>
    `;
  }

  private async _handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    const clipboardData = await this.clipboardController.pasteFromClipboard(e);
    if(!clipboardData) return;

    const cursorPosition = this.textarea.selectionStart || 0;
    const currentText = this.textarea.value;
    const newText =
      currentText.substring(0, cursorPosition) +
      clipboardData.text +
      currentText.substring(cursorPosition);
    this.textarea.value = newText;
    this._handleEnabled();
    
    if(!clipboardData.files) return;
    for(const file of clipboardData.files) {
      const batchId = randomStringId();
      this.dispatchEvent(new CustomEvent<KiteChatFooterChange>('kite-chat-footer.change', {
        ...CUSTOM_EVENT_INIT,
        detail: {
          file,
          batchId,
          totalFiles: 1,
        }
      }));
    }
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
    this.dispatchEvent(new CustomEvent('kite-chat-footer.cancel'));
  }

  private _switchKeyboard() {
    this.keyboardController.toggle();
  }

  override render() {
    const isAttachmentActive = !this.editMessage || !!this.editMessageFile;
    const isTextareaActive = !this.editMessageFile;
    const isKeyboardSwitchHidden = this.sendEnabled || !!this.editMessage || !this.customKeyboardMarkup || !!this.customKeyboardMarkup.isPersistent;
    return html`
      ${this._renderEdited()}
      <div class="flex items-start gap-1 rounded-b p-2">
        <label>
          <input
            type="file"
            class="hidden"
            aria-hidden="true"
            multiple
            @change=${this._onFileInput}
            .disabled=${!isAttachmentActive}
            accept=${ifDefined(this.editMessageFile?.file?.type)}
          />
          <kite-icon
            icon="attachment"
            title="Attach file"
            class="icon ${classMap({
              'active-icon': isAttachmentActive,
              'inactive-icon': !isAttachmentActive,
            })}"
          ></kite-icon>
        </label>
        <textarea
          required
          rows="1"
          autocomplete="on"
          spellcheck="true"
          wrap="soft"
          placeholder=${this.customKeyboardMarkup?.inputFieldPlaceholder ?? "Type a message"}
          class="caret-primary-color w-full max-h-24 min-h-[1.5rem] flex-1 resize-y border-none bg-transparent outline-none"
          @input=${this._handleEnabled}
          @keyup=${this._handleKeyUp}
          @paste=${this._handlePaste}
          @click=${() => this.shadowRoot?.activeElement === this.textarea && this.keyboardController.setMode(true)}
          .disabled=${!isTextareaActive}
        ></textarea>
        <kite-icon
          icon=${this.keyboardController.defaultKeyboard ? "layout-grid" : "keyboard"}
          title=${this.keyboardController.defaultKeyboard ? "Use reply keyboard" : "Use default keyboard"}
          class="icon active-icon ${classMap({'hidden': isKeyboardSwitchHidden})}"
          @pointerdown=${(event: Event) => event.preventDefault()}
          @click=${() => {
            this.shadowRoot?.activeElement !== this.textarea && this.textarea.focus();
            this._switchKeyboard();
          }}
        ></kite-icon>
        <kite-icon
          icon="send"
          title="Send (Ctrl+↩)"
          class="icon ${classMap({
            'active-icon': this.sendEnabled,
            'inactive-icon': !this.sendEnabled,
          })}"
          @click=${this._sendText}
        ></kite-icon>
      </div>
      <kite-custom-keyboard
        .keyboard=${this.customKeyboardMarkup?.keyboard ?? []}
        .resize=${!!this.customKeyboardMarkup?.resizeKeyboard}
        @kite-custom-keyboard.click=${this._sendAction}
      ></kite-custom-keyboard>
    `;
  }

  static override styles = [sharedStyles, componentStyles];
}
