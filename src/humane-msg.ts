/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 *
 * @slot - humane-msg component contains message text (possibly formatted)
 */

import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import humaneMsgStyles from 'bundle-text:./humane-msg.css';
import {randomStringId} from './random-string-id';
import {MsgStatus} from './humane-types';

console.debug('humane-msg loaded');

const componentStyles = css`
  ${unsafeCSS(humaneMsgStyles)}
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
 */
@customElement('humane-msg')
export class HumaneMsgElement extends LitElement {
  /**
   * Message id, optional, autogenerated with nanoid if not provided
   */
  @property({reflect: true})
  msgId = randomStringId();

  /**
   * Timestamp as an ISO formatted string; optional, defaults to current time
   */
  @property({
    converter(value) {
      const d = new Date();
      if (value) {
        const ms = Date.parse(value);
        if (!isNaN(ms)) {
          d.setTime(ms);
        } else {
          return value;
        }
      }
      return hhmmLocalizedFormat.format(d);
    },
  })
  datetime = hhmmLocalizedFormat.format(new Date());

  /**
   * Status of the outgoing message; Optional, if present, must be one of 'sent' | 'delivered' | 'read';
   * in this case message is formatted as an outgoing message
   */
  @property({reflect: true})
  status?: MsgStatus;

  override render() {
    return html` <slot></slot
      >${this._renderStatus()}${this._renderTimestamp()}`;
  }

  private _renderStatus() {
    return this.status ? html`<s class="${this.status}"></s>` : null;
  }

  private _renderTimestamp() {
    return this.datetime ? html`<time>${this.datetime}</time>` : null;
  }
  static override styles = componentStyles;
}
