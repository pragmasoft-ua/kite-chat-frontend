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

/**
 * @attr {Boolean} open - displays full message if true or only first line if false or missing
 * @attr {number} duration - setting notification active state duration in ms, ignored if missing
 * @attr {"new" | "active" | "viewed"} state - defines notification state, using prefers-color-scheme by default
 * @attr {number} collapsedCount - displays collapsed messages count if bigger than one
 * @attr {"info" | "warning" | "error" | "success"} type - setting the notification style
 * @cssvar --kite-notification-bg - notification message background color
 * @cssvar --kite-notification-success - success accent color, styles notification border and icon background
 * @cssvar --kite-notification-error - error accent color, styles notification border and icon background
 * @cssvar --kite-notification-warning - warning accent color, styles notification border and icon background
 * @cssvar --kite-notification-info - info accent color, styles notification border and icon background
 */
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
        ${this.type === NotificationType.WARNING ? html`<svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-alert-triangle' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M12 9v4' /><path d='M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z' /><path d='M12 16h.01' /></svg>` : null}
        ${this.type === NotificationType.INFO ? html`<svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-info-circle' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0' /><path d='M12 9h.01' /><path d='M11 12h1v4h1' /></svg>` : null}
        ${this.type === NotificationType.SUCCESS ? html`<svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-mood-check' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M20.925 13.163a8.998 8.998 0 0 0 -8.925 -10.163a9 9 0 0 0 0 18' /><path d='M9 10h.01' /><path d='M15 10h.01' /><path d='M9.5 15c.658 .64 1.56 1 2.5 1s1.842 -.36 2.5 -1' /><path d='M15 19l2 2l4 -4' /></svg>` : null}
        ${this.type === NotificationType.ERROR ? html`<svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-bug' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M9 9v-1a3 3 0 0 1 6 0v1' /><path d='M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1 -10 0v-3a6 6 0 0 1 1 -3' /><path d='M3 13l4 0' /><path d='M17 13l4 0' /><path d='M12 20l0 -6' /><path d='M4 19l3.35 -2' /><path d='M20 19l-3.35 -2' /><path d='M4 7l3.75 2.4' /><path d='M20 7l-3.75 2.4' /></svg>` : null}
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
