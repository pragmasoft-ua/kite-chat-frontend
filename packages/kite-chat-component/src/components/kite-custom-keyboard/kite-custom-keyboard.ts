import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ScopedElementsMixin} from '@open-wc/scoped-elements/lit-element.js';
import kiteKeyboardStyles from './kite-custom-keyboard.css?inline';
import {sharedStyles} from '../../shared-styles';
import {VisibilityMixin} from '../../mixins';
import {KeyboardButton} from '../../kite-payload';
import {KiteIconElement} from '../kite-icon';

const componentStyles = css`
  ${unsafeCSS(kiteKeyboardStyles)}
`;

const CUSTOM_EVENT_INIT = {
  bubbles: true,
  composed: false,
  cancelable: false,
};

@customElement('kite-custom-keyboard')
export class KiteCustomKeyboardElement extends  
  VisibilityMixin(
    ScopedElementsMixin(LitElement),
    {show: 'kite-custom-keyboard.show', hide: 'kite-custom-keyboard.hide'}
  ) {
  static scopedElements = {
    'kite-icon': KiteIconElement,
  };

  @property({type: Array})
  keyboard: KeyboardButton[][] = [];

  @property({type: Boolean, reflect: true})
  resize = false;

  override render() {
    if(!this.open) return;

    return html`
      ${this.keyboard.map(row =>
        html`
          <div class="row">
            ${row.map((button) => {
              if(typeof button === 'string') {
                return html`<button 
                  @pointerdown=${(event: Event) => event.preventDefault()}
                  @click=${() => this.handleButtonClick(button)}
                  >${button}</button>`;
              }
              if(button.url) {
                return html`<a href=${button.url} target="_blank" rel="noopener noreferrer" title=${button.url}
                  >${button.text}<kite-icon icon="arrow-left"></kite-icon>
                </a>`;
              }
              return html`<button 
                @pointerdown=${(event: Event) => event.preventDefault()}
                @click=${() => this.handleButtonClick(button.text, button.callbackData)}
              >${button.text}</button>`
            })}
          </div>
        `
      )}
    `;
  }

  protected handleButtonClick(text: string, callbackData?: string) {
    this.dispatchEvent(new CustomEvent('kite-custom-keyboard.click', {...CUSTOM_EVENT_INIT, detail: {text, callbackData}}));
  }

  static override styles = [sharedStyles, componentStyles];
}
