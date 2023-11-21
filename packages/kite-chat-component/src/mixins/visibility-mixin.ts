import {PropertyValues, LitElement} from 'lit';
import {property} from 'lit/decorators.js';

/**
 * Type definition of a constructor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

type EventNames = {
    hide: string;
    show: string;
}

const CUSTOM_EVENT_INIT = {
    bubbles: true,
    composed: true,
    cancelable: true,
};

export declare class VisibilityInterface {
    readonly open: boolean
    show(): void;
    hide(): void;
    _toggleOpen(): void;
    _visibilityCallback(): void
}

export const VisibilityMixin = <T extends Constructor<LitElement>>(
    superClass: T,
    eventNames: EventNames
) => {
    class VisibilityElement extends superClass {
        static styles = [
            ...[(superClass as unknown as typeof LitElement).styles ?? []]
        ]

        /**
         * Constructor that simply delegates to the super's constructor
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...params: any) {
            super();
        }

        @property({type: Boolean, reflect: true})
        open = false;

        hide() {
            if (!this.open) {
                return;
            }
            const e = new CustomEvent(eventNames.hide, CUSTOM_EVENT_INIT);
            this.dispatchEvent(e);
            if (!e.defaultPrevented) {
                this.open = false;
            }
        }

        show() {
            if (this.open) {
                return;
            }
            const e = new CustomEvent(eventNames.show, CUSTOM_EVENT_INIT);
            this.dispatchEvent(e);
            if (!e.defaultPrevented) {
                this.open = true;
            }
        }

        _toggleOpen() {
            this.open ? this.hide() : this.show();
        }

        override updated(changedProperties: PropertyValues<this>): void {
            super.updated(changedProperties);

            this._visibilityCallback();
        }

        override firstUpdated(changedProperties: PropertyValues<this>): void {
            super.firstUpdated(changedProperties);

            if (changedProperties.has('open')) {
                this._visibilityCallback();
            }
        }

        _visibilityCallback() {
            return;
        }
    }

    return VisibilityElement as Constructor<VisibilityInterface> & T;
}