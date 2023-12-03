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

type ContextMenuPosition = {
  x: number;
  y: number;
}

export type ContextMenuAction = {
  label?: string;
  value: string;
}

export type ContextMenuClick = {
  target?: HTMLElement;
  action: ContextMenuAction;
}

@customElement('kite-context-menu')
export class KiteContextMenuElement extends 
  VisibilityMixin(
    LitElement, {show: 'kite-context-menu.show', hide: 'kite-context-menu.hide'}
  ) {
  override _visibilityCallback() {
    super._visibilityCallback();
    if (this.open) {
      this.showPopover();
    } else {
      this.hidePopover();
    }
  }

  private _targetElement?: HTMLElement; 

  @state()
  private _actions: ContextMenuAction[] = []; 

  constructor() {
    super();
    this.popover = "manual";
  }

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
      target: this._targetElement,
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

  setPosition(pos: ContextMenuPosition) {
    this.style.left = `${pos.x}px`;
    this.style.top = `${pos.y}px`;
  }

  init(event: MouseEvent, actions: ContextMenuAction[]) {
    const {x, y} = event;
    this._targetElement = event.target as HTMLElement;
    this._actions = actions;
    this.setPosition({x, y});
    this.show();
  }

  private handleOuterClick(e: MouseEvent) {
    if(!((e.target as HTMLElement).isSameNode(this)) && this.open) {
      this.hide();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('click', this.handleOuterClick.bind(this));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleOuterClick.bind(this));
  }

  static override styles = componentStyles;
}