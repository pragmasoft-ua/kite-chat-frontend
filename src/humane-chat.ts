/// <reference path="./parcel.d.ts"/>
/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import {LitElement, html, css, unsafeCSS, render} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {sharedStyles} from './shared-styles';
import {classMap} from 'lit/directives/class-map.js';

import humaneChatStyles from 'bundle-text:./humane-chat.css';

const componentStyles = css`
  ${unsafeCSS(humaneChatStyles)}
`;

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('humane-chat')
export class HumaneChat extends LitElement {
  /**
   * opens chat dialog
   */
  @property({type: Boolean, reflect: true})
  open = false;

  @query('textarea')
  textarea!: HTMLTextAreaElement;

  @query('main')
  main!: HTMLElement;

  @state()
  private sendEnabled = false;

  override render() {
    return html`
      <div class="humane">
        <div
          title="Show live chat dialog"
          class="humane-toggle fixed right-4 bottom-4 z-30 h-12 w-12 cursor-pointer rounded-full bg-primary-color p-2 text-white shadow hover:text-opacity-80"
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
          class="humane-dialog ${classMap({
            'scale-y-100': this.open,
            'scale-y-0': !this.open,
          })} fixed right-4 bottom-20 z-40 flex h-[30rem] w-[20rem] origin-bottom flex-col rounded border border-neutral-200 bg-white text-black shadow-lg transition-transform selection:bg-primary-color selection:text-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-white/95"
        >
          <header
            class="flex h-12 select-none flex-row items-center justify-between rounded-t bg-primary-color p-2 text-white/95"
          >
            <h3 class="humane-title flex-1">${this.title || '👩🏻/humanee'}</h3>
            <span
              data-close
              title="Close"
              class="cursor-pointer rounded-full bg-white bg-opacity-0 py-2 px-2.5 leading-none hover:bg-opacity-30"
              @click="${this.hide}"
              >✕</span
            >
          </header>
          <main class="flex-1 snap-y overflow-y-auto bg-slate-300/50 p-2">
            <p data-time="4:20 PM" class="msg in">Hi</p>
            <p data-time="4:20 PM" class="msg out">
              Hello<span class="read"></span>
            </p>
            <p data-time="4:20 PM" class="msg in">
              Have you heard about Coding and Stuff
            </p>
            <p data-time="4:21 PM" class="msg out">
              Yeah I know, they post awesome coding tutorials<span
                class="delivered"
              ></span>
            </p>
            <p data-time="4:21 PM" class="msg in">
              But did you know they have a youtube channel?
            </p>
            <p data-time="4:21 PM" class="msg out">
              Yeah I also subscribed to their channel<span class="sent"></span>
            </p>
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
              rows="1"
              placeholder="Type a message"
              class="max-h-24 min-h-[1.5rem] flex-1 resize-y border-none bg-transparent caret-primary-color outline-none"
              @input=${this._handleEnabled}
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
              <title>Send</title>
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
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent(this.open ? 'show' : 'hide'));
  }

  private _send() {
    console.log(`send ${this.textarea.value}`);
    this.insertAdjacentHTML(
      'beforeend',
      `<p data-time="00:00 AM" class="msg out">${this.textarea.value}</p>`
    );
    this.textarea.value = '';
    this._handleEnabled();
  }

  private _handleEnabled() {
    this.sendEnabled = this.textarea.value.length > 0;
  }

  hide() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('hide'));
  }

  show() {
    this.open = true;
    this.dispatchEvent(new CustomEvent('show'));
  }

  static override styles = [sharedStyles, componentStyles];
}
