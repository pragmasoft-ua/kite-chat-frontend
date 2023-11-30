import {LitElement, css, unsafeCSS, PropertyValues} from 'lit';
import {queryAssignedElements, query} from 'lit/decorators.js';
import {KiteNotification} from '../kite-payload';
import {KiteNotificationElement, NotificationState} from '../components';

/**
 * Type definition of a constructor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export declare class NotificationContainerInterface {
    appendNotification(notification: KiteNotification): void;
}

const NOTIFICATION_SLOT = 'notification';
const DEFAULT_DURATION = 5000;

export const NotificationContainerMixin = <T extends Constructor<LitElement>>(
    superClass: T,
    slotName = NOTIFICATION_SLOT,
) => {
    class NotificationContainerElement extends superClass {
        static styles = [
            ...[(superClass as unknown as typeof LitElement).styles ?? []],
            css`
                slot[name=${unsafeCSS(slotName)}]::slotted(*) {
                    position: absolute;
                    top: 0;
                    margin-inline: 0.2rem;
                    width: calc(100% - 2 * 0.2rem);
                    
                    z-index: 1;
                    transition: all 300ms ease-in-out;
                    transform: translateX(-100%);
                    opacity: 0;
                }
                slot[name=${unsafeCSS(slotName)}]::slotted([state="viewed"]) {
                    transform: translateX(100%);
                }
                slot[name=${unsafeCSS(slotName)}]::slotted([state="active"]) {
                    transform: translateX(0%);
                    opacity: 1;
                }
            `
        ]

        /**
         * Constructor that simply delegates to the super's constructor
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(..._params: any) {
            super();
        }

        @queryAssignedElements({slot: slotName})
        private _notificationSlotElements!: Array<KiteNotificationElement>;

        @query(`slot[name="${slotName}"]`)
        private _notificationSlot!: HTMLSlotElement;

        private handleSlotchange() {
            const current = this._notificationSlotElements
                .filter(el => el.state = NotificationState.NEW)
                .toReversed()[0];
            current && setTimeout(() => {
                current.state = NotificationState.ACTIVE;
            }, 0);
        }

        private handleTransitionend(e: TransitionEvent) {
            const current = (e.target as KiteNotificationElement);
            if(current?.state === NotificationState.VIEWED) {
                current.remove()
            }
        }

        override firstUpdated(changedProperties: PropertyValues<this>): void {
            super.firstUpdated(changedProperties);
            const slot = this._notificationSlot;
            slot.addEventListener('slotchange', this.handleSlotchange.bind(this));
            slot.addEventListener('transitionend', this.handleTransitionend.bind(this));
        }

        override disconnectedCallback(): void {
            super.disconnectedCallback();
            const slot = this._notificationSlot;
            slot.removeEventListener('slotchange', this.handleSlotchange.bind(this));
            slot.removeEventListener('transitionend', this.handleTransitionend.bind(this));
        }

        appendNotification(notification: KiteNotification) {
            const {message, type, duration} = notification;
            const notificationElement = document.createElement('kite-toast-notification') as KiteNotificationElement;
            notificationElement.message = message;
            notificationElement.type = type;
            notificationElement.duration = duration === "auto" ? DEFAULT_DURATION : duration;

            notificationElement.slot = slotName;
            this.appendChild(notificationElement);
        }
    }

    return NotificationContainerElement as Constructor<NotificationContainerInterface> & T;
}

export {KiteNotificationElement};