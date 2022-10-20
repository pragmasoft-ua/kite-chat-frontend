/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 *
 */

import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import humaneMsgStyles from './humane-msg.css?inline';
import {randomStringId} from './random-string-id';
import {MsgStatus} from './humane-payload';

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
 *  @attr status
 *  @attr timestamp
 *
 *  @slot - humane-msg component contains message text (possibly formatted)
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
  timestamp = hhmmLocalizedFormat.format(new Date());

  /**
   * Status of the outgoing message; Optional, if present, must be one of 'sent' | 'delivered' | 'read';
   * in this case message is formatted as an outgoing message
   */
  @property({reflect: true})
  status?: keyof typeof MsgStatus;

  override render() {
    return html` <slot></slot
      >${this._renderStatus()}${this._renderTimestamp()}`;
  }

  private _renderStatus() {
    return this.status ? html`<s class="${this.status}"></s>` : null;
  }

  private _renderTimestamp() {
    return this.timestamp ? html`<time>${this.timestamp}</time>` : null;
  }
  static override styles = componentStyles;
}
