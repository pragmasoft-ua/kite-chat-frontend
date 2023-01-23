/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {sharedStyles} from './shared-styles';

import kiteChatStyles from './kite-chat.css?inline';
import {randomStringId} from './random-string-id';
import {PayloadMsg, MsgStatus} from './kite-payload';

console.debug('kite-chat loaded');

const componentStyles = css`
  ${unsafeCSS(kiteChatStyles)}
`;

/**
 * KiteChat is an embeddable livechat component
 *
 * @fires {CustomEvent} kite-chat.show - Chat window opens
 * @fires {CustomEvent} kite-chat.hide - Chat window closes
 * @attr {Boolean} open - displays chat window if true or only toggle button if false or missing
 * @slot {"kite-msg" | "p"} - kite-chat component contains chat messages as nested subcomponents, allowing server-side rendering
 * @cssvar --kite-primary-color - accent color, styles toggle button, title bar, text selection, cursor
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

  @state()
  private sendEnabled = false;

  override render() {
    return html`
      <div class="kite">
        <div
          title="Show live chat dialog"
          class="kite-toggle bg-primary-color fixed right-4 bottom-4 z-30 h-12 w-12 cursor-pointer rounded-full p-2 text-white shadow hover:text-opacity-80"
          @click="${this._toggleOpen}"
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
          class="kite-dialog ${classMap({
            'scale-y-100': this.open,
            'scale-y-0': !this.open,
          })} selection:bg-primary-color fixed right-4 bottom-20 z-40 flex h-[30rem] w-[20rem] origin-bottom flex-col rounded border border-neutral-200 bg-white text-black shadow-lg transition-transform selection:text-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-white/95"
        >
          <header
            class="bg-primary-color flex h-12 select-none flex-row items-center justify-between rounded-t p-2 text-white/95"
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
          <main class="flex-1 snap-y overflow-y-auto bg-slate-300/50 p-2">
            <slot></slot>
          </main>
          <footer class="flex items-start gap-1 rounded-b p-2">
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
              @click=${this._send}
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
    if (this.open) {
      const e = new CustomEvent('kite-chat.hide', {
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      this.dispatchEvent(e);
      if (!e.defaultPrevented) {
        this.hide();
      }
    } else {
      const e = new CustomEvent('kite-chat.show', {
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      this.dispatchEvent(e);
      if (!e.defaultPrevented) {
        this.show();
      }
    }
  }

  private _send() {
    if (this.textarea.value?.length > 0) {
      const payload = this.textarea.value;
      const status = MsgStatus.unknown;
      const timestamp = new Date();
      const messageId = randomStringId();
      const e = new CustomEvent<PayloadMsg<string>>('kite-chat.send', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          messageId,
          status,
          timestamp,
          payload,
        },
      });
      this.dispatchEvent(e);
      if (e.defaultPrevented) {
        return;
      }
      this.insertAdjacentHTML(
        'beforeend',
        `<kite-msg status="${status}" messageId="${messageId}" timestamp="${timestamp}">${payload}</kite-msg>`
      );
      this.lastElementChild?.scrollIntoView(false);
      this.textarea.value = '';
      this.textarea.focus();
      this._handleEnabled();
    }
  }

  private _handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      this._send();
    }
  }

  private _handleEnabled() {
    this.sendEnabled = this.textarea.value.length > 0;
  }

  hide() {
    this.open = false;
  }

  show() {
    this.open = true;
    this.textarea.focus();
  }

  incoming(
    text: string,
    messageId = randomStringId(),
    timestamp = new Date().toISOString()
  ) {
    this.insertAdjacentHTML(
      'beforeend',
      `<kite-msg messageId="${messageId}" timestamp="${timestamp}">${text}</kite-msg>`
    );
    this.lastElementChild?.scrollIntoView(false);
    this.show();
  }

  static override styles = [sharedStyles, componentStyles];
}
