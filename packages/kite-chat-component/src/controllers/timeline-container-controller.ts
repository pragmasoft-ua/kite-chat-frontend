import {ReactiveControllerHost} from 'lit';
import {KiteDateDivider} from '../components';

export type TimestampElement = HTMLElement & {
    timestamp: string;
}

type TimelineElement = TimestampElement|KiteDateDivider;

export class TimelineContainerController {
    private handleSlotchangeBound: () => void;

    constructor(
        private host: ReactiveControllerHost & HTMLElement
    ) {
        this.host.addController(this);
    }

    get defaultSlot(): HTMLSlotElement|null {
        return this.host.shadowRoot?.querySelector('slot') as HTMLSlotElement|null;
    }

    get timelineSlotElements(): Array<TimelineElement> {
        return this.defaultSlot?.assignedElements().filter((node) => (node as TimelineElement)?.timestamp) as Array<TimelineElement>;
    }

    hostConnected() {
        this.handleSlotchangeBound = this.handleSlotchange.bind(this);
    }

    hostUpdate() {
        if (this.defaultSlot) {
            this.defaultSlot.removeEventListener('slotchange', this.handleSlotchangeBound);
        }
    }

    hostUpdated() {
        this.defaultSlot?.addEventListener('slotchange', this.handleSlotchangeBound);
    }

    private removeDivider() {
        const dividers = this.timelineSlotElements.filter((el) => el instanceof KiteDateDivider) as KiteDateDivider[];
    
        for (const divider of dividers) {
            const index = this.timelineSlotElements.indexOf(divider);
            const nextElement = this.timelineSlotElements[index + 1] as TimestampElement | undefined;
    
            if (nextElement) {
                const nextElementDate = new Date(nextElement.timestamp).getDate();
                const dividerElementDate = new Date(divider.timestamp).getDate();
                if (nextElementDate !== dividerElementDate) {
                    this.host.removeChild(divider);
                }
            } else {
                this.host.removeChild(divider);
            }
        }
    }

    private appendDivider() {
        const lastDivider = this.timelineSlotElements.findLastIndex((el) => el instanceof KiteDateDivider);
        const toUpdate = [...this.timelineSlotElements].splice(lastDivider + 1) as Array<TimestampElement>;
        const currentElement = this.timelineSlotElements[lastDivider] as KiteDateDivider|undefined;
        let currentDate = currentElement ? new Date(currentElement.timestamp) : new Date();
        for(const el of toUpdate) {
            if(!el.timestamp) continue;
            const date = new Date(el.timestamp);
            
            if (currentDate.getDate() !== date.getDate()) {
                currentDate = date;
                const divider = document.createElement('kite-date-divider') as KiteDateDivider;
                divider.timestamp = currentDate;
                this.host.insertBefore(divider, el);
                return;
            }
        }
    }

    private handleSlotchange() {
        this.removeDivider();
        this.appendDivider();
    }
}
