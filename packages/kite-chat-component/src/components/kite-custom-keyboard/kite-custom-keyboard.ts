import {LitElement, PropertyValues, html, css, unsafeCSS} from 'lit';
import {property} from 'lit/decorators.js';
import kiteKeyboardStyles from './kite-custom-keyboard.css?inline';
import {sharedStyles} from '../../shared-styles';
import {VisibilityMixin} from '../../mixins';

const componentStyles = css`
  ${unsafeCSS(kiteKeyboardStyles)}
`;

const CUSTOM_EVENT_INIT = {
  bubbles: true,
  composed: false,
  cancelable: false,
};

export class KiteCustomKeyboardElement extends  
  VisibilityMixin(
    LitElement,
    {show: 'kite-custom-keyboard.show', hide: 'kite-custom-keyboard.hide'}
  ) {
  @property({type: Array})
  keyboard: string[][] = [];

  @property({type: Boolean, reflect: true})
  resize = false;

  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    if (changedProperties.has('keyboard')) {
      const maxRowLength = this.keyboard.length && Math.max(...this.keyboard.map(row => row.length));
      this.style.setProperty('--max-row-length', maxRowLength.toString());
    }
  }

  override render() {
    if(!this.open) return;

    return html`
      ${this.keyboard.map(row =>
        html`
          <div class="row">
            ${row.map(button =>
              html`<button 
                @pointerdown=${(event: Event) => event.preventDefault()}
                @pointerup=${() => {
                  this.handleButtonClick(button);
                }}
              >${button}</button>`
            )}
          </div>
        `
      )}
    `;
  }

  protected handleButtonClick(text: string) {
    this.dispatchEvent(new CustomEvent('kite-custom-keyboard.click', {...CUSTOM_EVENT_INIT, detail: {text}}));
  }

  static override styles = [sharedStyles, componentStyles];
}
