import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {VisibilityMixin} from '../../mixins';
import kiteContextmenuStyles from './kite-context-menu.css?inline';

const componentStyles = css`
  ${unsafeCSS(kiteContextmenuStyles)}
`;

const CUSTOM_EVENT_INIT = {
  bubbles: true,
  composed: true,
  cancelable: true,
};

export type ContextMenuAction = {
  label?: string;
  value: string;
}

export type ContextMenuClick = {
  action: ContextMenuAction;
}

@customElement('kite-context-menu')
export class KiteContextMenuElement extends 
  VisibilityMixin(
    LitElement, {show: 'kite-context-menu.show', hide: 'kite-context-menu.hide'}
  ) {

  @state()
  private _actions: ContextMenuAction[] = []; 

  override render() {
    return html`<ul @click=${this.handleClick}>${this._actions.map(({label, value}) => (
      html`<li id="${value}">${label ? label : value}</li>`
    ))}</ul>`;
  }

  private handleClick(e: MouseEvent) {
    if(!(e.target instanceof HTMLElement)) {
      return;
    }

    const detail = {
      action: {
        label: e.target.innerText,
        value: e.target.id,
      },
    }
    this.dispatchEvent(new CustomEvent('kite-context-menu.click', {
      ...CUSTOM_EVENT_INIT, 
      detail,
    }));
    this.hide();
  }

  setActions(actions: ContextMenuAction[]) {
    this._actions = actions;
  }

  private handleOuterClick(e: MouseEvent) {
    if(!((e.target as HTMLElement).isSameNode(this)) && this.open) {
      this.hide();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('mousedown', this.handleOuterClick.bind(this));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('mousedown', this.handleOuterClick.bind(this));
  }

  static override styles = componentStyles;
}