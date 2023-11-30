import {LitElement, PropertyValues} from 'lit';
import {queryAssignedElements} from 'lit/decorators.js';
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
        private _defaultSlotElements!: Array<TimestampElement>;

        // To use with :host-context(.multiselect)
        /*  override updated(changedProperties: PropertyValues<this>): void {
            super.updated(changedProperties);

            if (changedProperties.has('selectedElements')) {
                this.classList.toggle('multiselect', this.selectedElements.length > 0);
            }
        } */

        override async firstUpdated(changedProperties: PropertyValues<this>) {
            super.firstUpdated(changedProperties);
            let currentDate: string | null = null;
            for (const el of this._defaultSlotElements) {
                const formatted = formatDate(new Date(el.timestamp));
                
                if (currentDate !== formatted) {
                    currentDate = formatted;
                    const divider = document.createElement('kite-date-divider') as KiteDateDivider;
                    divider.date = currentDate ?? '';
                    this.insertBefore(divider, el);
                }
            }
        }

        override disconnectedCallback() {
            super.disconnectedCallback();
        }
    }

    return TimelineContainerElement as Constructor<TimelineContainerInterface> & T;
}