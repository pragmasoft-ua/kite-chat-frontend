import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import kiteLinkPreviewStyles from './kite-link-preview.css?inline';

const componentStyles = css`
  ${unsafeCSS(kiteLinkPreviewStyles)}
`;

@customElement('kite-link-preview')
export class KiteLinkPreviewElement extends LitElement {
  @property({type: String})
  url?: string;

  @property({type: String})
  imageUrl?: string;

  @property({type: String})
  heading?: string;

  @property({type: String})
  description?: string;

  override render() {
    if(!this.url) return;
    return html`
    <a href="${this.url}" target="_blank" rel="noopener noreferrer">
      ${this.imageUrl ? html`<img src="${this.imageUrl}" alt="Link Preview Image" />` : null}
      <div class="details">
        <h3>${this.heading}</h3>
        <p>${this.description}</p>
      </div>
    </a>
    `;
  }

  static override styles = componentStyles;
}