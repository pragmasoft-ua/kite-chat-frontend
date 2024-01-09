import { ReactiveControllerHost } from 'lit';
import {KiteNotificationElement, NotificationState} from '../components';


export class NotificationContainerController {
    private handleSlotchangeBound: () => void;
    private handleTransitionendkBound: (e: TransitionEvent) => void;

    constructor(
        private host: ReactiveControllerHost & HTMLElement
    ) {
        this.host.addController(this);
    }

    get defaultSlot(): HTMLSlotElement|null {
        return this.host.shadowRoot?.querySelector('slot') as HTMLSlotElement|null;
    }

    get notificationSlotElements(): Array<KiteNotificationElement> {
        return Array.from(
            this.defaultSlot?.assignedElements().filter((node) => node.matches('kite-toast-notification')) as Array<HTMLElement>
        ) as Array<KiteNotificationElement>;
    }

    hostConnected() {
        this.handleSlotchangeBound = this.handleSlotchange.bind(this);
        this.handleTransitionendkBound = this.handleTransitionend.bind(this);
    }

    hostUpdate() {
        if (this.defaultSlot) {
            this.defaultSlot.removeEventListener('slotchange', this.handleSlotchangeBound);
            this.defaultSlot.removeEventListener('transitionend', this.handleTransitionendkBound);
        }
    }

    hostUpdated() {
        this.defaultSlot?.addEventListener('slotchange', this.handleSlotchangeBound);
        this.defaultSlot?.addEventListener('transitionend', this.handleTransitionendkBound);
    }

    private updateNotifications() {
        let currentElement: KiteNotificationElement|null = null;

        this.notificationSlotElements
            .filter(el => el.state === NotificationState.NEW || el.state === NotificationState.ACTIVE)
            .forEach((el) => {
                if (el.state === NotificationState.ACTIVE) {
                    currentElement = el;
                } else if (el.state === NotificationState.NEW) {
                    const {message, type} = el;
            
                    if (currentElement?.nextElementSibling?.isSameNode(el) && message === currentElement?.message && type === currentElement?.type) {
                        currentElement && currentElement.collapsedCount++;
                        this.host.removeChild(el);
                    } else {
                        currentElement = el;
                        setTimeout(() => (el.state = NotificationState.ACTIVE), 0);
                    }
                }
            });
    }

    private handleSlotchange() {
        this.updateNotifications();
    }

    private handleTransitionend(e: TransitionEvent) {
        const current = (e.target as KiteNotificationElement);
        if(current?.state === NotificationState.VIEWED) {
            current.remove()
        }
    }
}
