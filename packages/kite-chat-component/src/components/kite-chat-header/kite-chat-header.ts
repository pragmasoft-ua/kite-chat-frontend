/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {sharedStyles} from '../../shared-styles';

import headerStyles from './kite-chat-header.css?inline';


const CUSTOM_EVENT_INIT = {
  bubbles: true,
  composed: false,
  cancelable: false,
};

const componentStyles = css`
  ${unsafeCSS(headerStyles)}
`;

type HeaderActions = 'cancel' | 'edit' | 'delete' | 'close' | 'screenshot';

/**
 * KiteChat component header
 *
 * @fires {CustomEvent} kite-chat-header.cancel
 * @fires {CustomEvent} kite-chat-header.edit
 * @fires {CustomEvent} kite-chat-header.delete
 * @fires {CustomEvent} kite-chat-header.close
 * @fires {CustomEvent} kite-chat-header.screenshot
 */
@customElement('kite-chat-header')
export class KiteChatHeaderElement extends LitElement {
  @property()
  heading = '🪁Kite chat';

  @state()
  selectedElementsCount: number = 0;

  editable: boolean = false;

  private _handleAction(action: HeaderActions) {
    const eventName = `kite-chat-header.${action}`;
    this.dispatchEvent(new CustomEvent(eventName, CUSTOM_EVENT_INIT));
  }

  override render() {
    if(this.selectedElementsCount === 0) {
      return html`
        <h3 class="kite-title flex-1">${this.heading}</h3>
        <span
          title="Take a screenshot"
          class="cursor-pointer rounded-full bg-white bg-opacity-0 p-1.5 leading-none hover:bg-opacity-30"
          @click="${() => this._handleAction('screenshot')}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-screenshot w-[1.2em] h-[1.2em]" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 19a2 2 0 0 1 -2 -2" />
              <path d="M5 13v-2" />
              <path d="M5 7a2 2 0 0 1 2 -2" />
              <path d="M11 5h2" />
              <path d="M17 5a2 2 0 0 1 2 2" />
              <path d="M19 11v2" />
              <path d="M19 17v4" />
              <path d="M21 19h-4" />
              <path d="M13 19h-2" />
            </svg>
          </span
        >
        <span
          data-close
          title="Close"
          class="cursor-pointer rounded-full bg-white bg-opacity-0 py-2 px-2.5 leading-none hover:bg-opacity-30"
          @click="${() => this._handleAction('close')}"
          >✕</span
        >
      `;
    }

    return html`
      <span
        data-cancel
        title="Cancel"
        class="cursor-pointer rounded-full bg-white bg-opacity-0 p-1 leading-none hover:bg-opacity-30"
        @click="${() => this._handleAction('cancel')}"
        ><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" />
        </svg></span
      >
      <span class="flex-1">${this.selectedElementsCount} selected</span>
        ${
          this.editable ? html`
            <span
              data-edit
              title="Edit"
              class="cursor-pointer h-full aspect-square rounded-full bg-white bg-opacity-0 py-1 px-1.5 leading-none hover:bg-opacity-30"
              @click="${() => this._handleAction('edit')}"
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
          @click="${() => this._handleAction('delete')}"
        >
        <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 50 50">
          <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z"></path>
        </svg>
      </span>
    `;
  }

  static override styles = [sharedStyles, componentStyles];
}
