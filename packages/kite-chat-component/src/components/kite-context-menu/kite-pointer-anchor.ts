import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement} from 'lit/decorators.js';
import kiteAnchorStyles from './kite-pointer-anchor.css?inline';

const componentStyles = css`
  ${unsafeCSS(kiteAnchorStyles)}
`;

type AnchorPosition = {
  x: number;
  y: number;
}

@customElement('kite-pointer-anchor')
export class KitePointerAnchorElement extends LitElement {
  targetElement?: HTMLElement;

  override connectedCallback(): void {
    super.connectedCallback();
  }

  override render() {
    return html``;
  }

  setPosition(pos: AnchorPosition) {
    this.style.left = `${pos.x}px`;
    this.style.top = `${pos.y}px`;
  }

  init(event: MouseEvent) {
    const {x, y} = event;
    this.targetElement = event.target as HTMLElement;
    const parentRect = this.parentElement?.getBoundingClientRect();
    if (parentRect) {
      const relativeX = x - parentRect.left;
      const relativeY = y - parentRect.top;

      this.setPosition({ x: relativeX, y: relativeY });
    }
  }

  static override styles = componentStyles;
}