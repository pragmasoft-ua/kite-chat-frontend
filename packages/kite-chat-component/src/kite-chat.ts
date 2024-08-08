/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, eventOptions, property, query, queryAssignedElements, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {sharedStyles} from './shared-styles';
import {ScopedElementsMixin} from '@open-wc/scoped-elements/lit-element.js';

import kiteChatStyles from './kite-chat.css?inline';
import {randomStringId} from './random-string-id';
import {
  isPlaintextMsg,
  KiteMsg,
  MsgStatus,
  MsgOperation,
  KiteMsgSend,
  KiteMsgDelete,
  KiteMsgEvent,
  CustomKeyboardMarkup,
} from './kite-payload';
import {
  SelectionContainerMixin,
  VisibilityMixin,
  NotificationContainerMixin,
  ScreenshotMixin,
} from './mixins';
import {
  AnchorController, 
  DraggableController,
  TimelineContainerController,
  Select as KiteMsgSelect,
  ClipboardController,
  ClipboardContent,
  ClipboardData,
  WebShareController,
} from './controllers';
import {
  KiteChatFooterElement, 
  KiteChatFooterChange,
  KiteChatHeaderElement,
  KiteContextMenuElement,
  ContextMenuClick,
  ContextMenuAction,
  KitePointerAnchorElement,
  KiteChatMainElement,
  KiteChatMainDrop,
  KeyboardClick,
  KiteCustomKeyboardElement,
} from './components';
import {KiteMsgElement, MsgOutsideClick} from './kite-msg';

console.debug('kite-chat loaded');

const componentStyles = css`
  ${unsafeCSS(kiteChatStyles)}
`;

const CUSTOM_EVENT_INIT = {
  bubbles: true,
  composed: true,
  cancelable: true,
};

enum MsgActionType {
  SELECT = 'select',
  DELETE = 'delete',
  UNSELECT = 'unselect',
  EDIT = 'edit',
  COPY = 'copy',
  DOWNLOAD = 'download',
  SELECT_ALL = 'select-all',
  SHARE = 'share',
}

type TextData = {
  text: string;
}

type FileData = {
  file: File;
  batchId: string;
  totalFiles: number;
}

const MESSAGE_ACTION_LABEL = {
  [MsgActionType.SELECT]: 'Select message',
  [MsgActionType.DELETE]: 'Delete message',
  [MsgActionType.UNSELECT]: 'Unselect message',
  [MsgActionType.EDIT]: 'Edit message',
  [MsgActionType.COPY]: 'Copy to clipboard',
  [MsgActionType.SHARE]: 'Share message',
  [MsgActionType.DOWNLOAD]: 'Download file',
  [MsgActionType.SELECT_ALL]: 'Select all messages',
}

function getMessageActions(actions: MsgActionType[]): ContextMenuAction[] {
  return actions.map((action) => ({
    label: MESSAGE_ACTION_LABEL[action],
    value: action,
  }));
}

/**
 * KiteChat is an embeddable livechat component
 *
 * @fires {CustomEvent} kite-chat.show - Chat window opens
 * @fires {CustomEvent} kite-chat.hide - Chat window closes
 * @fires {CustomEvent} kite-chat.send - Outgoing message is sent
 * @fires {CustomEvent} kite-chat.delete - Chat message is deleted
 * @fires {CustomEvent} kite-chat.select - Chat message is selected
 * @fires {CustomEvent} kite-chat.screenshot - Tab screenshot
 * @attr {Boolean} open - displays chat window if true or only toggle button if false or missing
 * @attr {Boolean} editing - disables message editing actions if set to false 
 * @attr {"light" | "dark"} theme - defines kite chat theme, using prefers-color-scheme by default
 * @attr {string} heading - Chat dialog heading
 * @slot {"kite-msg" | "p"} - kite-chat component contains chat messages as nested subcomponents, allowing server-side rendering
 * @cssvar --kite-primary-color - accent color, styles toggle button, title bar, text selection, cursor
 * @cssvar --kite-secondary-color - accent contrast color, styles title, close button, toggle button icon color
 * @csspart toggle - The toggle button TODO implement
 */
@customElement('kite-chat')
export class KiteChatElement extends 
  ScreenshotMixin(
    NotificationContainerMixin(
      VisibilityMixin(
        SelectionContainerMixin(
          ScopedElementsMixin(
            LitElement 
          ),
          KiteMsgElement,
          {select: 'kite-chat.select'}
        ), 
        {show: 'kite-chat.show', hide: 'kite-chat.hide'}
      )
    ),
    {screenshot: 'kite-chat.screenshot'}
  ) {
  /**
   * @ignore
   */
  static scopedElements = {
    'kite-chat-header': KiteChatHeaderElement,
    'kite-chat-footer': KiteChatFooterElement,
    'kite-chat-main': KiteChatMainElement,
    'kite-pointer-anchor': KitePointerAnchorElement,
    'kite-context-menu': KiteContextMenuElement,
  };
  
  @property()
  heading = '🪁Kite chat';

  @property({type: Boolean})
  editing = true;

  @query('kite-chat-footer')
  private footer!: KiteChatFooterElement;

  @query('#kite-dialog')
  private dialog!: HTMLElement;

  @query('kite-pointer-anchor')
  private pointerAnchor!: KitePointerAnchorElement;

  @query('kite-context-menu')
  private contextMenu!: KiteContextMenuElement;

  @queryAssignedElements({selector: '[status]'})
  private sentMessageElements!: NodeListOf<KiteMsgElement>;

  @queryAssignedElements({selector: 'kite-custom-keyboard'})
  private keyboardElements!: NodeListOf<KiteCustomKeyboardElement>;

  private isSent(currentMsg: KiteMsgElement): boolean {
    return !![...this.sentMessageElements].find((msgElement) => (
      currentMsg.isEqualNode(msgElement)
    ));
  }

  private getFiles(currentMsg: KiteMsgElement) {
    const elements = currentMsg.querySelectorAll('kite-file');
    return elements.length !== 0 ? elements : undefined;
  }

  private getMsgContent(msg: KiteMsgElement) {
    const fileElements = this.getFiles(msg);
    return {
      text: msg.textContent?.trim() ?? '',
      files: fileElements && Array.from(fileElements).map(el => el.file).filter(file => !!file) as File[]|undefined,
    };
  }

  @state()
  private editMessage: KiteMsgElement|null = null;

  protected anchorController!: AnchorController;

  protected pointerAnchorController!: AnchorController;

  protected draggableController = new DraggableController(this, "#kite-toggle", this._toggleOpen.bind(this));

  protected timelineContainerController = new TimelineContainerController(this);

  protected clipboardController = new ClipboardController(this);

  protected webShareController = new WebShareController(this);

  constructor() {
    super();

    const flipFallbackClasses = ['fallback-1', 'fallback-2', 'fallback-3', 'fallback-4'];

    if (!CSS.supports('anchor-name', '--toggle')) {
        // The anchor-name property is not supported
        this.anchorController = new AnchorController(this,
          flipFallbackClasses, '.kite-toggle', '.kite-dialog'
        );
    }
    if (!CSS.supports('anchor-name', '--toggle')) {
      // The anchor-name property is not supported
      this.pointerAnchorController = new AnchorController(this,
        flipFallbackClasses, 'kite-pointer-anchor', 'kite-context-menu'
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
        })} outline-none border-none fixed p-0 z-40 flex origin-bottom flex-col rounded border shadow-lg transition-transform overflow-visible"
      >
        <kite-chat-header
          @kite-chat-header.cancel=${() => {
            this.unselectAll();
          }}
          @kite-chat-header.edit=${() => {
            this._edit(this.selectedElements[0]);
          }}
          @kite-chat-header.delete=${() => {
            this.selectedElements.forEach((msgElement) => {
              this._delete(msgElement);
            });
          }}
          @kite-chat-header.copy=${() => {
            const data = this.selectedElements.map((el) => this._copy(el));
            this.clipboardController.copyToClipboard(data);
            this.unselectAll();
          }}
          @kite-chat-header.close=${this._toggleOpen}
          .editable=${this.editing && this.selectedElements.length === 1 && this.isSent(this.selectedElements[0])}
          .selectedElementsCount=${this.selectedElements.length}
          .heading=${this.heading}
        >
        </kite-chat-header>
        <kite-chat-main
          @kite-chat-main.drop=${this._handleChange}
          @kite-msg.outsideclick=${this._contextMenu}
          @scroll=${() => this.contextMenu.hide()}
          class="relative flex flex-1 overflow-hidden flex-col-reverse bg-slate-300/50 snap-y overflow-y-auto outline-none border-none"
        >
          <div class="flex min-h-min flex-col flex-wrap items-start">
            <slot
              @kite-custom-keyboard.click=${this._handleCustomKeyboard}
            ></slot>
          </div>
        </kite-chat-main>
        <kite-chat-footer
          @kite-chat-footer.change=${this._handleChange}
          @kite-chat-footer.cancel=${() => this._edit(null)}
          .editMessage=${this.editMessage}
        >
        </kite-chat-footer>
        <kite-pointer-anchor>
        </kite-pointer-anchor>
        <kite-context-menu @kite-context-menu.click=${this._handleMenuClick}>
        </kite-context-menu>
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

  private _copy(msgElement: KiteMsgElement): ClipboardContent {
    return {
      data: this.getMsgContent(msgElement),
      htmlFormatter: async (data: ClipboardData) => {
        const contentDiv = document.createElement('div');
    
        const p = document.createElement('p');
        const msgType = msgElement.getAttribute('status') ? 'Sent' : 'Received';
        p.textContent = `${msgType}: ${data.text}`;
        contentDiv.appendChild(p);

        if(!data.files) return contentDiv.innerHTML;

        for(const file of data.files) {
          const p = document.createElement('p');
          p.innerHTML = await this.clipboardController.fileToHtml(file);
          contentDiv.appendChild(p);
        }
        return contentDiv.innerHTML;
      },
    };
  }

  private _edit(msgElement: KiteMsgElement|null) {
    this.editMessage = msgElement;
    this.unselectAll();
  }

  private _delete(msgElement: KiteMsgElement) {
    const {messageId} = msgElement;
    const message: KiteMsgDelete = {messageId};
    if (this._dispatchMsg({type: MsgOperation.delete, detail: message})) {
      this.removeMsg(messageId);
    }
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

  override _selectionCallback() {
    this.contextMenu.hide();
  }

  editMsg(messageId: string, msg: KiteMsg) {
    const msgElement = this.querySelector(
      `${KiteMsgElement.TAG}[messageId="${messageId}"]`
    ) as KiteMsgElement | undefined;
    if(!msgElement) {
      return;
    }
    const {messageId: newMessageId = messageId, timestamp = new Date(), status, edited} = msg;
    msgElement.messageId = newMessageId ?? msgElement.messageId;
    msgElement.timestamp = timestamp ?? msgElement.timestamp;
    msgElement.status = status ?? msgElement.status;
    msgElement.edited = edited ?? msgElement.edited;
    if (isPlaintextMsg(msg)) {
      msgElement.textContent = msg.text;
    } else {
      const fileElement = msgElement.querySelector('kite-file');
      if(!fileElement) {
        return;
      }
      fileElement.file = msg.file ?? fileElement.file;
    }
    requestAnimationFrame(() => {
      msgElement.scrollIntoView(false);
    });
  }

  private _handleChange(e: CustomEvent<KiteChatFooterChange|KiteChatMainDrop>) {
    this._send(e.detail);
  }

  private _send(data: TextData|FileData) {
    const message: KiteMsg = {
      messageId: this.editMessage ? this.editMessage.messageId : randomStringId(),
      timestamp: new Date(),
      status: MsgStatus.unknown,
      edited: !!this.editMessage,
      ...data,
    };
    if (this._dispatchMsg({type: MsgOperation.send, detail: message})) {
      if(this.editMessage) {
        this.editMsg(this.editMessage.messageId, message);
        this.editMessage = null;
      } else {
        this.appendMsg(message);
      }
    }
  }

  private _dispatchMsg({type, detail}: KiteMsgEvent): boolean {
    let e;

    switch(type) {
      case MsgOperation.send:
        e = new CustomEvent<KiteMsgSend>('kite-chat.send', {
          ...CUSTOM_EVENT_INIT,
          detail,
        });
      break;
      case MsgOperation.delete:
        e = new CustomEvent<KiteMsgDelete>('kite-chat.delete', {
          ...CUSTOM_EVENT_INIT,
          detail,
        });
      break;
    }

    this.dispatchEvent(e);
    return !e.defaultPrevented;
  }

  @eventOptions({capture: true})
  private _contextMenu(wrapperEvent: CustomEvent<MsgOutsideClick>) {
    const event = wrapperEvent.detail;
    if(event.defaultPrevented || this.selectedElements.length > 0) return;
    !this.contextMenu.open && event.preventDefault();
    const msgElement = (event.target as HTMLElement).closest(KiteMsgElement.TAG) as KiteMsgElement | null;
    if(!msgElement) {
      return;
    }
    const data = this.getMsgContent(msgElement);
    const actions = getMessageActions([
      MsgActionType.DELETE,
      ...(!data.files || this.webShareController.isSupportedFiles(data.files) ? [MsgActionType.SHARE] : []),
      ...(!data.files || this.clipboardController.isWriteSupported ? [MsgActionType.COPY] : []),
      ...(this.editing && this.isSent(msgElement) ? [MsgActionType.EDIT] : []),
      ...(data.files ? [MsgActionType.DOWNLOAD] : []),
      ...(msgElement.selected ? [MsgActionType.UNSELECT] : [MsgActionType.SELECT]),
      MsgActionType.SELECT_ALL,
    ]);
    this.pointerAnchor.init(event, msgElement);
    this.contextMenu.setActions(actions);
    this.contextMenu.show();
  }

  private _handleMenuClick(event: CustomEvent<ContextMenuClick>) {
    const msgElement = this.pointerAnchor.targetElement as KiteMsgElement;
    const action = event.detail.action;

    switch(action.value) {
      case MsgActionType.SELECT:
        this.select(msgElement);
        break;
      case MsgActionType.UNSELECT:
        this.unselect(msgElement);
        break;
      case MsgActionType.DELETE:
        this._delete(msgElement);
        break;
      case MsgActionType.EDIT:
        this._edit(msgElement);
        break;
      case MsgActionType.DOWNLOAD:
        this.getFiles(msgElement)?.forEach(fileElement => fileElement.download());
        break;
      case MsgActionType.SELECT_ALL:
        this.selectAll();
        break;
      case MsgActionType.COPY:
        this.clipboardController.copyToClipboard([{data: this.getMsgContent(msgElement)}]);
        break;
      case MsgActionType.SHARE:
        this.webShareController.share('Kite Chat', this.getMsgContent(msgElement));
        break;
    }
  }

  private _handleCustomKeyboard(e: CustomEvent<KeyboardClick>) {
    if (e.defaultPrevented) return;
    const {text} = e.detail;
    this._send({text});
  }

  /**
  * Appends a KiteMsg to the chat and optionally scrolls the new message into view.
  *
  * @param {KiteMsg} msg - The KiteMsg to append to the chat.
  * @param {boolean} eagerShow - If true, automatically shows the new message. Defaults to true.
  */
  appendMsg(msg: KiteMsg, eagerShow: boolean = true) {
    this.keyboardElements.forEach(el => el.hide());
    const {messageId = randomStringId(), timestamp = new Date(), status, edited}: KiteMsg = msg;
    const msgElement = document.createElement('kite-msg');
    msgElement.messageId = messageId;
    msgElement.timestamp = timestamp;
    msgElement.status = status;
    msgElement.edited = edited;
    if (isPlaintextMsg(msg)) {
      msgElement.textContent = msg.text;
    } else {
      const fileElement = document.createElement('kite-file');
      fileElement.file = msg.file;
      fileElement.slot = "file";
      msgElement.appendChild(fileElement);
    }
    this.appendChild(msgElement);
    eagerShow && this.show();
    requestAnimationFrame(() => {
      msgElement.scrollIntoView(false);
    });
  }


  appendKeyboard(markup: CustomKeyboardMarkup) {
    const {keyboard}: CustomKeyboardMarkup = markup;
    const inlineKeyboardElement = document.createElement('kite-custom-keyboard');
    keyboard.forEach((button) => {
      (button instanceof Object) && ('divider' in button) 
        ? inlineKeyboardElement.appendDivider() 
        : inlineKeyboardElement.appendButton(button);
    });
    this.appendChild(inlineKeyboardElement);
    inlineKeyboardElement.show();
    requestAnimationFrame(() => {
      inlineKeyboardElement.scrollIntoView(false);
    });
  }

  removeMsg(messageId: string) {
    const msgElement = this.querySelector(
      `${KiteMsgElement.TAG}[messageId="${messageId}"]`
    ) as KiteMsgElement | undefined;
    msgElement?.remove();
  }

  /**
   * @ignore
   */
  static override styles = [...[super.styles?? []], sharedStyles, componentStyles];
}

export type {
  KiteMsgSend,
  KiteMsgDelete,
  KiteMsgSelect,
};