import {LitElement, PropertyValues} from 'lit';
import {queryAssignedElements, query} from 'lit/decorators.js';
import {KiteDateDivider} from '../components';
import {formatDate} from '../utils';

/**
 * Type definition of a constructor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export declare class TimelineContainerInterface {

}

export type TimestampElement = HTMLElement & {
    timestamp: string;
}

export const TimelineContainerMixin = <T extends Constructor<LitElement>>(
    superClass: T,
) => {
    class TimelineContainerElement extends superClass {
        static styles = [
            ...[(superClass as unknown as typeof LitElement).styles ?? []]
        ]

        /**
         * Constructor that simply delegates to the super's constructor
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(..._params: any) {
            super();
        }

        @queryAssignedElements()
        private _defaultSlotElements!: Array<TimestampElement|KiteDateDivider>;

        @query(`slot:not([name])`)
        private _defaultSlot!: HTMLSlotElement;

        private removeDivider() {
            const dividers = this._defaultSlotElements.filter((el) => el instanceof KiteDateDivider) as KiteDateDivider[];
        
            for (const divider of dividers) {
                const index = this._defaultSlotElements.indexOf(divider);
                const nextElement = this._defaultSlotElements[index + 1] as TimestampElement | undefined;
        
                if (nextElement) {
                    const nextElementDate = nextElement.timestamp ? formatDate(new Date(nextElement.timestamp)) : null;
                    if (nextElementDate !== divider.date) {
                        this.removeChild(divider);
                    }
                } else {
                    this.removeChild(divider);
                }
            }
        }

        private appendDivider() {
            const lastDivider = this._defaultSlotElements.findLastIndex((el) => el instanceof KiteDateDivider);
            const toUpdate = [...this._defaultSlotElements].splice(lastDivider + 1) as Array<TimestampElement>;
            let currentDate: string | null = (this._defaultSlotElements[lastDivider] as KiteDateDivider|undefined)?.date ?? null;
            for(const el of toUpdate) {
                const date = el.timestamp ? new Date(el.timestamp) : new Date();
                const formatted = formatDate(date);
        
                if (currentDate !== formatted) {
                    currentDate = formatted;
                    const divider = document.createElement('kite-date-divider') as KiteDateDivider;
                    divider.date = currentDate ?? '';
                    this.insertBefore(divider, el);
                    return;
                }
            }
        }

        private handleTimelineSlotchange() {
            this.removeDivider();
            this.appendDivider();
        }

        override firstUpdated(changedProperties: PropertyValues<this>): void {
            super.firstUpdated(changedProperties);
            const slot = this._defaultSlot;
            slot.addEventListener('slotchange', this.handleTimelineSlotchange.bind(this));
        }

        override disconnectedCallback(): void {
            super.disconnectedCallback();
            const slot = this._defaultSlot;
            slot.removeEventListener('slotchange', this.handleTimelineSlotchange.bind(this));
        }

    }

    return TimelineContainerElement as Constructor<TimelineContainerInterface> & T;
}

export {KiteDateDivider};