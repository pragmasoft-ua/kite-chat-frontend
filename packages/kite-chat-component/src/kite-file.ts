/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 *
 */

import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import prettyBytes from 'pretty-bytes';

import kiteFileStyles from './kite-file.css?inline';

const componentStyles = css`
  ${unsafeCSS(kiteFileStyles)}
`;

const dataURItoFile = (dataURI: string) => {
  const [schema, type, encoding, data] = dataURI.split(/[:;,]+/);

  if (schema !== 'data' || encoding !== 'base64') {
    throw new Error('only data uri with base64 encoding is supported');
  }
  const byteString = atob(data);

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], '', {type});
};

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
  @property({
    reflect: false,
  })
  name = 'File';

  /**
   * file, sent from the chat or received by the chat
   */
  @property({
    attribute: 'src',
    reflect: false,
    converter: {
      fromAttribute: (value) => {
        if (!value) return null;
        return dataURItoFile(value);
      },
    },
  })
  file?: File;

  @query('a')
  private downloadAnchor!: HTMLAnchorElement;

  download() {
    this.downloadAnchor.click();
  }

  override render() {
    if (!this.file) return;
    const href = URL.createObjectURL(this.file);
    const name = this.file.name || this.name;
    if (this.file.type.startsWith('image')) {
      const preview = html`<img src="${href}" alt="${name}" />`;
      return html`<a href="${href}" download="${name}">${preview}</a>`;
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
      return html`<a href="${href}" download="${name}">${preview}</a>
        ${name}
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
