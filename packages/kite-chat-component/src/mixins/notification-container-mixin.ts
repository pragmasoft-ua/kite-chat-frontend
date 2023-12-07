import {LitElement, css, PropertyValues} from 'lit';
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

const DEFAULT_DURATION = 5000;

export const NotificationContainerMixin = <T extends Constructor<LitElement>>(
    superClass: T,
) => {
    class NotificationContainerElement extends superClass {
        static styles = [
            ...[(superClass as unknown as typeof LitElement).styles ?? []],
            css`
                ::slotted(kite-toast-notification) {
                    transition: all 300ms ease-in-out;
                    transform: translateX(-100%);
                    opacity: 0;
                }
                ::slotted(kite-toast-notification[state="viewed"]) {
                    transform: translateX(100%);
                }
                ::slotted(kite-toast-notification[state="active"]) {
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

        @queryAssignedElements({selector: 'kite-toast-notification'})
        private _notificationSlotElements!: Array<KiteNotificationElement>;

        @query(`slot`)
        private _defaultSlot!: HTMLSlotElement;

        private updateNotifications() {
            let currentElement: KiteNotificationElement|null = null;

            this._notificationSlotElements
                .filter(el => el.state === NotificationState.NEW || el.state === NotificationState.ACTIVE)
                .forEach((el) => {
                    if (el.state === NotificationState.NEW) {
                        const message = el.message;
                
                        if (message === currentElement?.message) {
                            currentElement && currentElement.collapsedCount++;
                            el.state = NotificationState.VIEWED;
                        } else {
                            currentElement = el;
                            setTimeout(() => (el.state = NotificationState.ACTIVE), 0);
                        }
                    }
                });
        }

        private handleNotificationSlotchange() {
            this.updateNotifications();
        }

        private handleNotificationTransitionend(e: TransitionEvent) {
            const current = (e.target as KiteNotificationElement);
            if(current?.state === NotificationState.VIEWED) {
                current.remove()
            }
        }

        override firstUpdated(changedProperties: PropertyValues<this>): void {
            super.firstUpdated(changedProperties);
            const slot = this._defaultSlot;
            this.updateNotifications();
            slot.addEventListener('slotchange', this.handleNotificationSlotchange.bind(this));
            slot.addEventListener('transitionend', this.handleNotificationTransitionend.bind(this));
        }

        override disconnectedCallback(): void {
            super.disconnectedCallback();
            const slot = this._defaultSlot;
            slot.removeEventListener('slotchange', this.handleNotificationSlotchange.bind(this));
            slot.removeEventListener('transitionend', this.handleNotificationTransitionend.bind(this));
        }

        appendNotification(notification: KiteNotification) {
            const {message, type, duration} = notification;
            const notificationElement = document.createElement('kite-toast-notification') as KiteNotificationElement;
            notificationElement.message = message;
            notificationElement.type = type;
            if(duration) {
                notificationElement.duration = duration === "auto" ? DEFAULT_DURATION : duration;
            }
            this.appendChild(notificationElement);
            requestAnimationFrame(() => {
                notificationElement.scrollIntoView(false);
            });
        }
    }

    return NotificationContainerElement as Constructor<NotificationContainerInterface> & T;
}

export {KiteNotificationElement};