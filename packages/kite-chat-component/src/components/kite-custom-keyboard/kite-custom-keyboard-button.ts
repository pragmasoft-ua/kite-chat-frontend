import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import kiteKeyboardButtonStyles from './kite-custom-keyboard-button.css?inline';
import {sharedStyles} from '../../shared-styles';

const componentStyles = css`
  ${unsafeCSS(kiteKeyboardButtonStyles)}
`;

@customElement('kite-custom-keyboard-button')
export class KiteCustomKeyboardButtonElement extends LitElement {
  @property({type: String})
  callbackData?: string;

  override render() {
    return html`<button><slot></slot></button>`;
  }

  static override styles = [sharedStyles, componentStyles];
}
