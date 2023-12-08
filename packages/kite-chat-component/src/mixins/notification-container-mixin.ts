import {LitElement, css} from 'lit';
import {KiteNotification} from '../kite-payload';
import {KiteNotificationElement} from '../components';
import {NotificationContainerController} from '../controllers';

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

        protected notificationContainerController = new NotificationContainerController(this);

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