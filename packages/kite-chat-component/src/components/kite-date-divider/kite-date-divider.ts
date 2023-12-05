import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {formatDate} from '../../utils';

import kiteDividerStyles from './kite-date-divider.css?inline';

const componentStyles = css`
  ${unsafeCSS(kiteDividerStyles)}
`;

@customElement('kite-date-divider')
export class KiteDateDivider extends LitElement {
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

  override render() {
    return html`${formatDate(this.timestamp)}`;
  }

  static override styles = componentStyles;
}