import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {VisibilityMixin} from '../../mixins';
import kiteContextmenuStyles from './kite-context-menu.css?inline';
import {sharedStyles} from '../../shared-styles';

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
    return html`
      <ul class="list-none p-0 m-0">
        ${this._actions.map(({ label, value }) => html`
          <li id="${value}" class="px-2 py-2.5 cursor-pointer flex items-center hover:bg-gray-300" @click=${this.handleClick}>
            ${label ? label : value}
          </li>`
        )}
      </ul>
    `;
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

  private handleOuterClick(e: MouseEvent|TouchEvent) {
    if(!((e.target as HTMLElement).isSameNode(this)) && this.open) {
      this.hide();
      e.preventDefault();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.parentElement?.addEventListener('click', this.handleOuterClick.bind(this), { capture: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.parentElement?.removeEventListener('click', this.handleOuterClick.bind(this));
  }

  static override styles = [sharedStyles, componentStyles];
}