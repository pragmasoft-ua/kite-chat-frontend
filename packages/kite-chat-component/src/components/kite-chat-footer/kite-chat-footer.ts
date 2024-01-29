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
import {KiteContextMenuElement, ContextMenuAction, ContextMenuClick} from '../kite-context-menu';
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

const TEXT_STYLES: TextStyle[] = ["bold", "italic", "underline", "strikethrough", "spoiler", "link", "quote"];

enum FooterActionType {
  ATTACH = 'attach',
  FORMAT = 'format',
}

const FOOTER_ACTION = {
  [FooterActionType.ATTACH]: {label: 'Attach file'},
  [FooterActionType.FORMAT]: {label: 'Format text', submenu: TEXT_STYLES.map(style => ({label: style, value: style}))},
}

function getFooterActions(actions: FooterActionType[]): ContextMenuAction[] {
  return actions.map((action) => ({
    ...FOOTER_ACTION[action],
    value: action,
  }));
}


/**
 * KiteChat component footer
 *
 * @fires {CustomEvent} kite-chat-footer.change
 * @fires {CustomEvent} kite-chat-footer.cancel
 */
export class KiteChatFooterElement extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'kite-icon': KiteIconElement,
    'kite-context-menu': KiteContextMenuElement,
  };

  @query('textarea')
  private textarea!: HTMLTextAreaElement;

  @query('input[type="file"]')
  private fileInput!: HTMLInputElement;

  @query('#resizer')
  private resizer!: HTMLElement;

  @query('kite-context-menu')
  private contextMenu!: KiteContextMenuElement;

  @state()
  private sendEnabled = false;

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

  private _handleAutoResize() {
    if (this.initialResizePosition) return;
    this.textarea.style.height = this.textarea.scrollHeight + 'px';
  }

  private initialResizePosition: number|null = null;

  private _startResize(event: PointerEvent) {
    event.stopPropagation();
    this.resizer.onpointermove = this._handleResize.bind(this);
    this.resizer.setPointerCapture(event.pointerId);
    document.body.style.cursor = 'ns-resize';
    this.initialResizePosition = event.clientY;
  }

  private _stopResize(event: PointerEvent) {
    this.resizer.releasePointerCapture(event.pointerId);
    this.resizer.onpointermove = null;
    document.body.style.cursor = 'auto';
  }

  private _handleResize(event: PointerEvent) {
    if (!this.initialResizePosition || !this.textarea) return;
    const newHeight = this.initialResizePosition - event.clientY + this.textarea.clientHeight;
    this.initialResizePosition = event.clientY;
    this.textarea.style.height = `${newHeight}px`;
  }

  private handleOuterClick(e: Event) {
    if(e.defaultPrevented) return;
    this.contextMenu.hide();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.body.addEventListener('click', this.handleOuterClick.bind(this));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.body.removeEventListener('click', this.handleOuterClick.bind(this));
  }

  private _contextMenu(event: MouseEvent) {
    !this.contextMenu.open && event.preventDefault();
    const actions = getFooterActions([
      ...(!this.editMessage || !!this.editMessageFile ? [FooterActionType.ATTACH] : []), 
      FooterActionType.FORMAT
    ]);
    this.contextMenu.setActions(actions);
    this.contextMenu.show();
  }

  private _handleMenuClick(event: CustomEvent<ContextMenuClick>) {
    const {action, subaction} = event.detail;

    switch(action.value) {
      case FooterActionType.ATTACH:
        this.fileInput.click();
        break;
      case FooterActionType.FORMAT:
        subaction && this._handleFormatText(subaction.value as TextStyle)
        break;
    }
  }

  override render() {
    const isAttachmentActive = !this.editMessage || !!this.editMessageFile;
    const isTextareaActive = !this.editMessageFile;
    return html`
      <div 
        id="resizer"
        class="absolute flex top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 touch-none
        after:h-1 after:w-12 after:rounded after:bg-gray-300 after:shadow-sm after:self-center after:cursor-n-resize"
        @pointerdown=${this._startResize}
        @pointerup=${this._stopResize}
      >
      </div>
      ${this._renderEdited()}
      <div class="flex items-start gap-1 rounded-b p-2">
        <div class="relative">
        <kite-context-menu class="w-max -left-1 bottom-[calc(100%+0.5rem)]" @kite-context-menu.click=${this._handleMenuClick}></kite-context-menu>
          <kite-icon
            icon="dots-vertical"
            title="Options"
            class="icon active-icon"
            @pointerdown=${(event: Event) => event.preventDefault()}
            @click=${this._contextMenu}
          ></kite-icon>
        </div>
        <input
            type="file"
            class="hidden"
            aria-hidden="true"
            multiple
            @change=${this._onFileInput}
            .disabled=${!isAttachmentActive}
            accept=${ifDefined(this.editMessageFile?.file?.type)}
        />
        <textarea
          required
          rows="1"
          autocomplete="on"
          spellcheck="true"
          wrap="soft"
          placeholder="Type a message"
          class="caret-primary-color w-full max-h-24 min-h-[1.5rem] flex-1 resize-none border-none bg-transparent outline-none"
          @input=${() => {
            this._handleAutoResize();
            this._handleEnabled();
          }}
          @keyup=${this._handleKeyUp}
          @paste=${async (event: Event) => {
            await this._handlePaste(event as ClipboardEvent);
            this._handleAutoResize();
          }}
          @click=${() => this.shadowRoot?.activeElement === this.textarea}
          .disabled=${!isTextareaActive}
        ></textarea>
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
