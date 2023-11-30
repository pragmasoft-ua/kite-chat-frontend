import {TemplateResult, LitElement, html, css} from 'lit';
import {queryAssignedElements} from 'lit/decorators.js';
import {KiteNotification} from '../kite-payload';
import {KiteNotificationElement, NotificationState} from '../components';

/**
 * Type definition of a constructor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export declare class NotificationContainerInterface {
    appendNotification(notification: KiteNotification): void;
    _renderNotificationContainer(): TemplateResult<1>;
}

const NOTIFICATION_SLOT = 'notification';

export const NotificationContainerMixin = <T extends Constructor<LitElement>>(
    superClass: T,
) => {
    class NotificationContainerElement extends superClass {
        static styles = [
            ...[(superClass as unknown as typeof LitElement).styles ?? []],
            css`
                slot[name="notification"]::slotted(*) {
                    position: absolute;
                    top: 0;
                    margin-inline: 0.2rem;
                    width: calc(100% - 2 * 0.2rem);
                    
                    z-index: 1;
                    transition: all 300ms ease-in-out;
                    transform: translateX(-100%);
                    opacity: 0;
                }
                slot[name="notification"]::slotted([state="viewed"]) {
                    transform: translateX(100%);
                }
                slot[name="notification"]::slotted([state="active"]) {
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

        @queryAssignedElements({slot: NOTIFICATION_SLOT})
        _notificationSlotElements!: Array<KiteNotificationElement>;

        _renderNotificationContainer() {
            return html`<slot
                name=${NOTIFICATION_SLOT}
                @transitionend=${(e: TransitionEvent) => {
                    const current = (e.target as KiteNotificationElement);
                    if(current?.state === NotificationState.VIEWED) {
                        current.remove()
                    }
                }}
                @slotchange=${() => {
                    const current = this._notificationSlotElements.toReversed()[0];
                    current && setTimeout(() => {
                        current.state = NotificationState.ACTIVE;
                    }, 0);
                }}
            ></slot>`;
        }

        appendNotification(notification: KiteNotification) {
            const {message, type} = notification;
            const notificationElement = document.createElement('kite-toast-notification') as KiteNotificationElement;
            notificationElement.message = message;
            notificationElement.type = type;

            notificationElement.slot = NOTIFICATION_SLOT;
            this.appendChild(notificationElement);
        }
    }

    return NotificationContainerElement as Constructor<NotificationContainerInterface> & T;
}

export {KiteNotificationElement};