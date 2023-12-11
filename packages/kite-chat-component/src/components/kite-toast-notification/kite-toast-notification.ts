/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 *
 */

import {LitElement, html, css, unsafeCSS, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {formatNumberWithAbbreviation as formatNumber} from '../../utils';

import kiteToastStyles from './kite-toast-notification.css?inline';

import {
  NotificationType
} from '../../kite-payload';
import {sharedStyles} from '../../shared-styles';

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
  @property({ reflect: true, type: Number }) duration?: number;
  @property({ reflect: true, type: Number }) collapsedCount: number = 1;

  override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('state') && this.state === NotificationState.ACTIVE) {
      if(this.duration) {
        this.style.setProperty('--kite-notification-duration', `${this.duration}ms`);
        setTimeout(() => {
          this.dismiss();
        }, this.duration);
      }
    }
  }

  dismiss() {
    this.state = NotificationState.VIEWED;
  }

  toggle() {
    this.open = !this.open;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.toggle.bind(this));
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.toggle.bind(this));
  }

  override render() {
    return html`
      <span class="icon">
        <span class="collapsed ${classMap({'hidden': this.collapsedCount < 2 || !this.open})}">${formatNumber(this.collapsedCount)}</span>
      </span>
      <div class="wrapper">
        <span class="message ${classMap({'break-all': !this.open})}">${this.message}</span>
        <span class="close" @click=${(e: MouseEvent) => {
          e.stopPropagation();
          this.dismiss();
        }}>✕</span>
      </div>
    `;
  }

  static override styles = [componentStyles, sharedStyles];
}
