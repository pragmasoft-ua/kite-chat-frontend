/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 *
 */

import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import kiteMsgStyles from './kite-msg.css?inline';
import {sharedStyles} from './shared-styles';
import {randomStringId} from './random-string-id';
import {MsgStatus} from './kite-payload';

const componentStyles = css`
  ${unsafeCSS(kiteMsgStyles)}
`;

// const relativeTimeFormat = new Intl.RelativeTimeFormat(
//   navigator.languages as string[],
//   {style: 'narrow', numeric: 'auto'}
// );

const hhmmLocalizedFormat = new Intl.DateTimeFormat(
  navigator.languages as string[],
  {
    hour: '2-digit',
    minute: '2-digit',
  }
);

const CUSTOM_EVENT_INIT = {
  bubbles: true,
  composed: true,
};

export type MsgOutsideClick = PointerEvent;

/**
 * Styled chat message component. Presence of the <pre>status</pre> attribute means outgoing message.
 *  @attr status
 *  @attr timestamp
 *
 *  @slot - kite-msg component contains message text (possibly formatted)
 */
@customElement(KiteMsgElement.TAG)
export class KiteMsgElement extends LitElement {
  static TAG = 'kite-msg';
  /**
   * Message id, optional, autogenerated with nanoid if not provided
   */
  @property({reflect: true})
  messageId = randomStringId();

  /**
   * Timestamp as an ISO formatted string; optional, defaults to current time
   */
  @property({
    reflect: true,
    converter: {
      toAttribute(value: Date) {
        return value.toISOString();
      },
      fromAttribute(value) {
        return value ? new Date(value) : null;
      },
    },
  })
  timestamp = new Date();

  /**
   * Status of the outgoing message; Optional, if present, must be one of 'sent' | 'delivered' | 'read';
   * in this case message is formatted as an outgoing message
   */
  @property({
    reflect: true,
    converter: {
      toAttribute(value?: MsgStatus) {
        return typeof value !== 'undefined' ? MsgStatus[value] : undefined;
      },
      fromAttribute(value) {
        if (!value) return;
        return MsgStatus[value as keyof typeof MsgStatus];
      },
    },
  })
  status?: MsgStatus;

  /**
   * Indicates whether the message is selected or not
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * Indicates whether the message was edited
   */
  @property({ type: Boolean, reflect: true })
  edited? = false;

  select() {
    this.selected = true;
  }

  unselect() {
    this.selected = false;
  }

  private handleClick(event: Event) {
    const path = event.composedPath();
    const isInsideMessageContainer = path.some((node) => node instanceof HTMLElement && node.classList.contains('message-container'));
  
    if (!isInsideMessageContainer) {
      // Click occurred on the host but not on .message-container
      this.dispatchEvent(new CustomEvent('kite-msg.outsideclick', {...CUSTOM_EVENT_INIT, detail: event}));
    }
  }  

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.handleClick.bind(this));
  }
  
  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.handleClick.bind(this));
  }

  override render() {
    return html` <div class="message-container"><slot></slot><span class="info-container">${this._renderStatus()}${this._renderTimestamp()}</span></div>`;
  }

  private _renderStatus() {
    return this.status
      ? html`<span class="status ${MsgStatus[this.status]}"></span>`
      : null;
  }

  private _renderTimestamp() {
    return this.timestamp
      ? html`<time>${hhmmLocalizedFormat.format(this.timestamp)}</time>`
      : null;
  }
  static override styles = [sharedStyles, componentStyles];
}
