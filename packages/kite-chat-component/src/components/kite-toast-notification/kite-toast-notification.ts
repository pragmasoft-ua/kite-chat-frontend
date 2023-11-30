/**
 * @license
 * Copyright 2022 Dmytro Zemnytskyi <pragmasoft@gmail.com>
 * LGPLv3
 *
 */

import {LitElement, html, css, unsafeCSS, PropertyValues} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

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
  @property({ reflect: true, type: Number }) duration?: number;

  @query('.message')
  private _messageElement!: HTMLElement;
  @state()
  private _overflow = false;

  override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('state') && this.state === NotificationState.ACTIVE) {
      if(this.duration) {
        this.style.setProperty('--kite-notification-duration', `${this.duration}ms`);
        setTimeout(() => {
          this.dismiss();
        }, this.duration);
      }
    }
    
    if (changedProperties.has('message') && this._messageElement) {
      setTimeout(() => {
        this._overflow = this.isOverflow(this._messageElement);
      }, 0);
    }
  }

  private isOverflow(el: HTMLElement) {
    return el.scrollHeight > el.clientHeight;
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
      <div class="wrapper ${classMap({
          'overflow': this._overflow,
        })}">
        <span class="toggle" @click=${this.toggle}>▶</span>
        <span class="message">${this.message}</span>
        <span class="close" @click=${this.dismiss}>✕</span>
      </div>
    `;
  }

  static override styles = componentStyles;
}
