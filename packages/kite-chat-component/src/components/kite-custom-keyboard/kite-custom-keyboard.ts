import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import kiteKeyboardStyles from './kite-custom-keyboard.css?inline';
import {sharedStyles} from '../../shared-styles';
import {VisibilityMixin} from '../../mixins';
import {KeyboardButton} from '../../kite-payload';

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
    LitElement,
    {show: 'kite-custom-keyboard.show', hide: 'kite-custom-keyboard.hide'}
  ) {
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
            ${row.map(button =>
              html`<button 
                @pointerdown=${(event: Event) => event.preventDefault()}
                @click=${() => {
                  typeof button === 'string'
                    ? this.handleButtonClick(button)
                    : this.handleButtonClick(button.text, button.callbackData);
                }}
              >${typeof button === 'string' ? button : button.text}</button>`
            )}
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
