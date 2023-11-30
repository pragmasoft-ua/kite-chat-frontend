import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {formatDate} from '../../utils';

import kiteDividerStyles from './kite-date-divider.css?inline';

const componentStyles = css`
  ${unsafeCSS(kiteDividerStyles)}
`;

@customElement('kite-date-divider')
export class KiteDateDivider extends LitElement {
  @property({ reflect: true, type: String }) date?: string;

  constructor(date: string) {
    super();
    if(!date) {
      this.date = formatDate(new Date());
    }
  }

  override render() {
    return html`${this.date}`;
  }

  static override styles = componentStyles;
}