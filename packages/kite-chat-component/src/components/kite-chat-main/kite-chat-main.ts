import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {randomStringId} from '../../random-string-id';
import {DragAngDropController} from '../../controllers';

const CUSTOM_EVENT_INIT = {
  bubbles: true,
  composed: false,
  cancelable: false,
};

type DropFile = {
  file: File;
  batchId: string;
  totalFiles: number;
}

export type KiteChatMainDrop = DropFile;

/**
 * @fires {CustomEvent} kite-chat-main.drop
 */
@customElement('kite-chat-main')
export class KiteChatMainElement extends LitElement {
  protected dragAndDropController = new DragAngDropController(this, this.handleDrop.bind(this));

  private handleDrop(files: FileList) {
    const batchId = randomStringId();
    for(const file of files) {
      this.dispatchEvent(new CustomEvent<KiteChatMainDrop>('kite-chat-main.drop', {
        ...CUSTOM_EVENT_INIT,
        detail: {
          file,
          batchId,
          totalFiles: files.length,
        }
      }))
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}
