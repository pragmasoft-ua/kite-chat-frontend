/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 *
 */

import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import kiteMsgStyles from './kite-msg.css?inline';
import {randomStringId} from './random-string-id';
import {MsgStatus} from './kite-payload';

import {SelectionController} from './controllers';

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
  edited = false;

  protected selectionController = new SelectionController(this);

  select() {
    this.selected = true;
  }

  unselect() {
    this.selected = false;
  }

  override render() {
    return html` <div class="message-container"><slot></slot
      >${this._renderStatus()}${this._renderTimestamp()}</div>`;
  }

  private _renderStatus() {
    return this.status
      ? html`<span class="${MsgStatus[this.status]}"></span>`
      : null;
  }

  private _renderTimestamp() {
    return this.timestamp
      ? html`<time>${hhmmLocalizedFormat.format(this.timestamp)}</time>`
      : null;
  }
  static override styles = componentStyles;
}
