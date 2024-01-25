import {LitElement, html, css, unsafeCSS} from 'lit';
import {state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
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
  submenu?: ContextMenuAction[];
}

export type ContextMenuClick = {
  action: ContextMenuAction;
  subaction?: ContextMenuAction;
}

export class KiteContextMenuElement extends 
  VisibilityMixin(
    LitElement, {show: 'kite-context-menu.show', hide: 'kite-context-menu.hide'}
  ) {
  private static current: KiteContextMenuElement|null = null;

  @state()
  private _actions: ContextMenuAction[] = []; 

  @state()
  private _openSubmenuIndex: number = -1;

  override render() {
    const currentAction = this._actions[this._openSubmenuIndex];
    return html`
      <ul>
        ${this._actions.map((action, index) => {
          const { label, value, submenu } = action;
          return html`
          <li
            class="${classMap({"active": this._openSubmenuIndex === index})}" 
            @click=${(e: MouseEvent) => {
              e.stopPropagation();
              this._openSubmenuIndex = submenu && this._openSubmenuIndex !== index ? index : -1;
              !submenu && this.handleClick(action);
            }}>
            ${label ? label : value}
          </li>
        `})}
      </ul>
      ${currentAction?.submenu ? html`<ul class="absolute bottom-0 left-[100%]">${
        currentAction.submenu.map((subaction) => {
          const { label, value } = subaction;
          return html`
          <li
            @click=${(e: MouseEvent) => {
              e.stopPropagation();
              this.handleClick(currentAction, subaction);
            }}
          >
            ${label ? label : value}
          </li>
        `})}</ul>` 
      : null}
    `;
  }

  private handleClick(action: ContextMenuAction, subaction?:ContextMenuAction) {
    const detail = {
      action: {
        label: action.label,
        value: action.value,
      },
      subaction: subaction && {
        label: subaction.label,
        value: subaction.value,
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

  override show() {
    KiteContextMenuElement.current?.hide();
    KiteContextMenuElement.current = this;
    super.show();
  }

  override hide(): void {
    this._openSubmenuIndex = -1;
    super.hide();
  }

  private handleOuterClick(e: Event) {
    if(e.defaultPrevented) return;
    this.hide();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.body.addEventListener('click', this.handleOuterClick.bind(this));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.body.removeEventListener('click', this.handleOuterClick.bind(this));
  }

  static override styles = [sharedStyles, componentStyles];
}