/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 *
 */

import {LitElement, html, css, unsafeCSS, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import kiteToastStyles from './kite-toast-notification.css?inline';

import {
  NotificationType
} from '../../kite-payload';

const componentStyles = css`
  ${unsafeCSS(kiteToastStyles)}
`;

export enum NotificationState {
  NEW = "new",
  ACTIVE = "active",
  VIEWED = "viewed",
}

@customElement(KiteNotificationElement.TAG)
export class KiteNotificationElement extends LitElement {
  static TAG = 'kite-toast-notification';

  @property({ type: String }) message? = '';
  @property({ reflect: true, type: String }) type?: NotificationType = NotificationType.INFO;
  @property({ reflect: true, type: Boolean }) open? = false;
  @property({ reflect: true, type: String }) state?: NotificationState = NotificationState.NEW;
  @property({ type: Number }) duration? = null;

  override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('state') && this.state === NotificationState.ACTIVE) {
      this.duration && setTimeout(() => {
        this.dismiss();
      }, this.duration);
    }
  }

  dismiss() {
    this.state = NotificationState.VIEWED;
  }

  toggle() {
    this.open = !this.open;
  }

  override render() {
    return html`
      <span class="icon"></span>
      <div class="wrapper">
        <span class="toggle" @click=${this.toggle}>▶</span>
        <span class="message">${this.message}</span>
        <span class="close" @click=${this.dismiss}>✕</span>
      </div>
    `;
  }

  static override styles = componentStyles;
}
