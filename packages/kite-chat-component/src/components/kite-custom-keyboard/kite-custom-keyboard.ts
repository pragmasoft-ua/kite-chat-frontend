import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {ScopedElementsMixin} from '@open-wc/scoped-elements/lit-element.js';
import kiteKeyboardStyles from './kite-custom-keyboard.css?inline';
import {sharedStyles} from '../../shared-styles';
import {VisibilityMixin} from '../../mixins';
import {KeyboardButton} from '../../kite-payload';
import {KiteIconElement} from '../kite-icon';
import {KiteCustomKeyboardButtonElement} from './kite-custom-keyboard-button';
import {KiteCustomKeyboardLinkElement} from './kite-custom-keyboard-link';

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

  @property({type: Boolean, reflect: true})
  resize = false;

  appendButton(button: KeyboardButton) {
    let btnElement: KiteCustomKeyboardButtonElement | KiteCustomKeyboardLinkElement;

    if (typeof button === 'string') {
      btnElement = this.createButtonElement(button);
    } else if (button.url) {
      btnElement = this.createLinkElement(button.text, button.url);
      btnElement.callbackData = button.callbackData;
    } else {
      btnElement = this.createButtonElement(button.text);
      btnElement.callbackData = button.callbackData;
    }

    this.appendChild(btnElement);
}

  private createButtonElement(text: string) {
      const btnElement = document.createElement('kite-custom-keyboard-button') as KiteCustomKeyboardButtonElement;
      btnElement.innerText = text;
      return btnElement;
  }

  private createLinkElement(text: string, url: string) {
      const btnElement = document.createElement('kite-custom-keyboard-link') as KiteCustomKeyboardLinkElement;
      btnElement.innerText = text;
      btnElement.url = url;
      return btnElement;
  }

  appendDivider() {
    const hrElement: HTMLHRElement = document.createElement('hr') as HTMLHRElement;
    this.appendChild(hrElement);
  }

  override render() {
    if(!this.open) return;

    return html`<slot @click=${this.handleButtonClick}></slot>`;
  }

  protected handleButtonClick(e: Event) {
    const target = e.target as HTMLElement;
    if(!(target instanceof KiteCustomKeyboardButtonElement) && !(target instanceof KiteCustomKeyboardLinkElement)) {
      return;
    }
    const detail = {
      text: target.innerText, 
      callbackData: target.callbackData
    };
    this.dispatchEvent(new CustomEvent('kite-custom-keyboard.click', {...CUSTOM_EVENT_INIT, detail}));
  }

  static override styles = [sharedStyles, componentStyles];
}
