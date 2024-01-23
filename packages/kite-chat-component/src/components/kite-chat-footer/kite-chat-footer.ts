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
import {formatText, TextStyle} from '../../utils';

import footerStyles from './kite-chat-footer.css?inline';

import {KiteMsgElement} from '../../kite-msg';
import {randomStringId} from '../../random-string-id';

import {
  ClipboardController,
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
  };

  @query('textarea')
  private textarea!: HTMLTextAreaElement;

  @query('input[type="file"]')
  private fileInput!: HTMLInputElement;

  @state()
  private sendEnabled = false;

  @state()
  private formattingOptions = false;

  @property()
  editMessage: KiteMsgElement|null = null;

  protected clipboardController = new ClipboardController(this);

  private get editMessageFile() {
    return this.editMessage?.querySelector('kite-file');
  }

  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    if (changedProperties.has('editMessage') && this.editMessage) {
      this.editMessage.unselect();
      if(!this.editMessage.querySelector('kite-file')) {
        this.textarea.value = this.editMessage.textContent ?? '';
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

  private _handleFormatText(style: TextStyle) {
    const textarea = this.textarea;
    const selectedText = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );

    if (selectedText.length > 0) {
      const beforeSelection = textarea.value.substring(0, textarea.selectionStart);
      const afterSelection = textarea.value.substring(textarea.selectionEnd);
      textarea.value = `${beforeSelection}${formatText(selectedText, style)}${afterSelection}`;
    } else {
      textarea.value = formatText(textarea.value, style);
    }
  }

  override render() {
    const textStyles: TextStyle[] = ["bold", "italic", "underline", "strikethrough", "spoiler", "link", "quote"];
    const isAttachmentActive = !this.editMessage || !!this.editMessageFile;
    const isTextareaActive = !this.editMessageFile;
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
          placeholder="Type a message"
          class="caret-primary-color w-full max-h-24 min-h-[1.5rem] flex-1 resize-y border-none bg-transparent outline-none"
          @blur=${() => {this.formattingOptions = false;}}
          @input=${() => {
            this.formattingOptions = false;
            this._handleEnabled();
          }}
          @keyup=${this._handleKeyUp}
          @paste=${this._handlePaste}
          @click=${() => this.shadowRoot?.activeElement === this.textarea}
          .disabled=${!isTextareaActive}
        ></textarea>
        <div class="relative">
          <div class="flex flex-col gap-1 p-2 absolute bg-[var(--kite-menu-background)] 
            -left-2 bottom-[calc(100%+0.5rem)] shadow-md rounded transition-all duration-3000 ease-in-out overflow-hidden origin-bottom
            ${classMap({'scale-y-100': this.formattingOptions, 'scale-y-0': !this.formattingOptions})}"
          >
          ${textStyles.map(formattingOption => html`
            <kite-icon
              icon=${formattingOption}
              title=${formattingOption.charAt(0).toUpperCase() + formattingOption.slice(1)} 
              class="icon active-icon"
              @pointerdown=${(event: Event) => event.preventDefault()}
              @click=${() => this._handleFormatText(formattingOption)}
            ></kite-icon>
          `)}
          </div>
          <kite-icon
            icon="formatting"
            title="Format text"
            class="icon active-icon"
            @pointerdown=${(event: Event) => event.preventDefault()}
            @click=${() => {this.formattingOptions = !this.formattingOptions;}}
          ></kite-icon>
        </div>
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
    `;
  }

  static override styles = [sharedStyles, componentStyles];
}
