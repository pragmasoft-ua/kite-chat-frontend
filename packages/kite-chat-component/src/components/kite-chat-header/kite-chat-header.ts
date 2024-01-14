/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 */

import {LitElement, html, css, unsafeCSS} from 'lit';
import {property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {sharedStyles} from '../../shared-styles';
import {ScopedElementsMixin} from '@open-wc/scoped-elements/lit-element.js';
import {KiteIconElement} from '../kite-icon';

import headerStyles from './kite-chat-header.css?inline';


const CUSTOM_EVENT_INIT = {
  bubbles: true,
  composed: false,
  cancelable: false,
};

const componentStyles = css`
  ${unsafeCSS(headerStyles)}
`;

type HeaderActions = 'cancel' | 'edit' | 'delete' | 'close' | 'copy';

/**
 * KiteChat component header
 *
 * @fires {CustomEvent} kite-chat-header.cancel
 * @fires {CustomEvent} kite-chat-header.edit
 * @fires {CustomEvent} kite-chat-header.delete
 * @fires {CustomEvent} kite-chat-header.close
 * @fires {CustomEvent} kite-chat-header.copy
 */
export class KiteChatHeaderElement extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'kite-icon': KiteIconElement,
  };

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
        <kite-icon data-close icon="close" title="Close" class="icon" @click="${() => this._handleAction('close')}"></kite-icon>
      `;
    }

    return html`
      <kite-icon data-cancel icon="arrow-left" title="Cancel" class="icon" @click="${() => this._handleAction('cancel')}"></kite-icon>
      <span class="flex-1">${this.selectedElementsCount} selected</span>
      <kite-icon data-copy icon="copy" title="Copy" class="icon" @click="${() => this._handleAction('copy')}"></kite-icon>
      <kite-icon data-edit icon="edit" title="Edit" class="icon ${classMap({'hidden': !this.editable})}" @click="${() => this._handleAction('edit')}"></kite-icon>
      <kite-icon data-delete icon="delete" title="Delete" class="icon" @click="${() => this._handleAction('delete')}"></kite-icon>
    `;
  }

  static override styles = [sharedStyles, componentStyles];
}
