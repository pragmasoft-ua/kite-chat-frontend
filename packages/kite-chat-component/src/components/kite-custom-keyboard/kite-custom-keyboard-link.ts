import {html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {KiteCustomKeyboardButtonElement} from './kite-custom-keyboard-button';
import {ScopedElementsMixin} from '@open-wc/scoped-elements/lit-element.js';
import kiteKeyboardLinkStyles from './kite-custom-keyboard-link.css?inline';
import {sharedStyles} from '../../shared-styles';
import {KiteIconElement} from '../kite-icon';

const componentStyles = css`
  ${unsafeCSS(kiteKeyboardLinkStyles)}
`;

@customElement('kite-custom-keyboard-link')
export class KiteCustomKeyboardLinkElement extends ScopedElementsMixin(KiteCustomKeyboardButtonElement) {
  static scopedElements = {
    'kite-icon': KiteIconElement,
  };

  @property({type: String})
  url = '';

  override render() {
    return html`<a href=${this.url} target="_blank" rel="noopener noreferrer" title=${this.url}
      ><slot></slot><kite-icon icon="arrow-left"></kite-icon>
    </a>`;
  }

  static override styles = [...(super.styles), sharedStyles, componentStyles];
}
