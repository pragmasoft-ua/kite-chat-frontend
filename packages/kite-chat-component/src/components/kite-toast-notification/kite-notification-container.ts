import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {NotificationContainerMixin} from '../../mixins';

@customElement(KiteNotificationContainer.TAG)
export class KiteNotificationContainer extends NotificationContainerMixin(LitElement) {
  static TAG = 'kite-notification-container';

  override render() {
    return html`<slot></slot>`;
  }
}
