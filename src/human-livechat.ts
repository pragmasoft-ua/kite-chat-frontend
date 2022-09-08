/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {sharedStyles} from './shared-styles';
import {classMap} from 'lit/directives/class-map.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('human-livechat')
export class HumanLivechat extends LitElement {
  /**
   * opens chat dialog
   */
  @property({type: Boolean, reflect: true})
  open = false;

  /**
   * The number of times the button has been clicked.
   */
  @property({reflect: true})
  dialogTitle = '👩🏻/human';

  override render() {
    return html`
      <div class="human">
        <div
          title="Show live chat dialog"
          class="human-toggle fixed right-4 bottom-4 z-30 h-12 w-12 cursor-pointer rounded-full bg-primary-color p-2 text-white shadow hover:text-opacity-80"
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
          class="human-dialog ${classMap({
            'scale-y-100': this.open,
            'scale-y-0': !this.open,
          })} fixed right-4 bottom-20 z-40 flex h-[30rem] w-[20rem] origin-bottom flex-col rounded border border-neutral-200 bg-white text-black shadow-lg transition-transform selection:bg-primary-color selection:text-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-white/95"
        >
          <header
            class="flex h-12 select-none flex-row items-center justify-between rounded-t bg-primary-color p-2 text-white/95"
          >
            <h3 class="human-title flex-1">${this.dialogTitle}</h3>
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
            ></textarea>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6 cursor-pointer opacity-50 hover:opacity-100"
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

  static override styles = [
    sharedStyles,
    css`
      .human-dialog > main {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%23aaa' fill-opacity='0.2' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E");
      }

      .human-dialog textarea {
        scrollbar-width: thin;
      }

      .human-dialog textarea::-webkit-scrollbar {
        width: 3px;
        height: 3px;
      }

      .human-dialog textarea::-webkit-scrollbar-track {
        background: transparent;
      }

      .human-dialog textarea::-webkit-scrollbar-thumb {
        background-color: theme('colors.neutral.500') / 50;
        border-radius: 3px;
        border: transparent;
      }

      @media (max-width: 22rem) {
        .human-dialog {
          width: 98vw;
          right: 1vw;
        }
      }

      @media (max-height: 35rem) {
        .human-dialog {
          height: 98vh;
          width: 98vw;
          max-width: 30rem;
          right: 1vmin;
          bottom: 1vmin;
        }
      }

      .msg {
        max-width: 80%;
        position: relative;
        clear: both;
        margin-top: 0.375rem /* 6px */;
        margin-bottom: 0.375rem /* 6px */;
        display: block;
        scroll-snap-align: start;
        scroll-margin-top: 0.25rem /* 4px */;
        scroll-margin-bottom: 0.25rem /* 4px */;
        border-radius: 0.25rem /* 4px */;
        padding-left: 0.5rem /* 8px */;
        padding-right: 0.5rem /* 8px */;
        padding-top: 0.25rem /* 4px */;
        padding-bottom: 0.25rem /* 4px */;
        text-align: left;
        --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1),
          0 1px 2px -1px rgb(0 0 0 / 0.1);
        --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
          0 1px 2px -1px var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
          var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
      }

      .in {
        background: white;
        float: left;
      }

      .out {
        background: theme('colors.stone.200');
        float: right;
      }

      .in::before,
      .out::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        top: 0;
        border: 10px solid transparent;
      }

      .in::before {
        left: -0.375rem;
        border-top-color: white;
      }

      .out::before {
        right: -0.375rem;
        border-top-color: theme('colors.stone.200');
      }

      .in::after,
      .out::after {
        content: attr(data-time);
        opacity: 60%;
        font-size: 0.875rem;
        position: relative;
        margin: 0.25rem;
        float: right;
        bottom: -0.375rem;
        right: -0.5rem;
      }

      .out::after {
        margin-right: 1.5rem;
      }

      .msg > span {
        position: absolute;
        bottom: 0;
        right: 0.5rem;
        font-size: 0.5rem;
        letter-spacing: -0.125rem;
      }

      .msg > span.read::after {
        content: '✓✓';
        color: theme('colors.blue.500');
      }

      .msg > span.delivered::after {
        content: '✓✓';
        color: theme('colors.neutral.500');
      }

      .msg > span.sent::after {
        content: '✓';
        color: theme('colors.neutral.500');
      }

      @media (prefers-color-scheme: dark) {
        .in {
          background: theme('colors.neutral.800');
        }

        .out {
          background: theme('colors.stone.600');
        }

        .in::before {
          border-top-color: theme('colors.neutral.800');
        }

        .out::before {
          border-top-color: theme('colors.stone.600');
        }

        .msg > span.delivered::after,
        .msg > span.sent::after {
          color: theme('colors.neutral.200');
        }
      }
    `,
  ];

  private _toggleOpen() {
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent(this.open ? 'show' : 'hide'));
  }

  hide() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('hide'));
  }

  show() {
    this.open = true;
    this.dispatchEvent(new CustomEvent('show'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'human-livechat': HumanLivechat;
  }
}
