/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 *
 */

import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import prettyBytes from 'pretty-bytes';

import kiteFileStyles from './kite-file.css?inline';

const componentStyles = css`
  ${unsafeCSS(kiteFileStyles)}
`;

/**
 *  File component allows previewing and saving file message.
 *
 *  @property file File
 */
@customElement(KiteFileElement.TAG)
export class KiteFileElement extends LitElement {
  static TAG = 'kite-file';

  /**
   * file, sent from the chat or received by the chat
   */
  @property({attribute: false})
  file: File;

  override render() {
    if (!this.file) return;
    const href = URL.createObjectURL(this.file);
    if (this.file.type.startsWith('image')) {
      const preview = html`<img src="${href}" alt="${this.file.name}" />`;
      return html`<a href="${href}" download="${this.file.name}"
        >${preview}</a
      >`;
    } else {
      const preview = html`<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1"
        stroke="currentColor"
        width="2em"
        height="2em"
      >
        <title>File</title>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
        />
      </svg>`;
      return html`<a href="${href}" download="${this.file.name}">${preview}</a>
        ${this.file.name}
        <data
          class="whitespace-nowrap"
          value="${this.file.size}"
          aria-label="size"
          >(${prettyBytes(this.file.size)})</data
        >`;
    }
  }

  static override styles = componentStyles;
}
