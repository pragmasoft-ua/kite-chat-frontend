import {LitElement, html, css, unsafeCSS} from 'lit';
import kiteAnchorStyles from './kite-pointer-anchor.css?inline';

const componentStyles = css`
  ${unsafeCSS(kiteAnchorStyles)}
`;

type AnchorPosition = {
  x: number;
  y: number;
}

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

  init(event: MouseEvent, targetElement?: HTMLElement) {
    const {x, y} = event;
    this.targetElement = targetElement ? targetElement : event.target as HTMLElement;
    const parentRect = this.parentElement?.getBoundingClientRect();
    if (parentRect) {
      const relativeX = x - parentRect.left;
      const relativeY = y - parentRect.top;

      this.setPosition({ x: relativeX, y: relativeY });
    }
  }

  static override styles = componentStyles;
}