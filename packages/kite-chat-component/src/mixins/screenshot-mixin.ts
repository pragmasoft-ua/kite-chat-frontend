import {LitElement} from 'lit';

import {
    ScreenshotController,
} from '../controllers';

/**
 * Type definition of a constructor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;


type EventNames = {
    screenshot: string;
}

export type ScreenshotEvent = {
    file: File;
}

const CUSTOM_EVENT_INIT = {
    bubbles: true,
    composed: true,
    cancelable: true,
};

export declare class ScreenshotInterface {
    screenshot(): void;
}

export const ScreenshotMixin = <T extends Constructor<LitElement>>(
    superClass: T,
    eventNames: EventNames
) => {
    class ScreenshotElement extends superClass {
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

        protected screenshotController = new ScreenshotController(this);

        screenshot() {
            this.screenshotController.captureScreen((file) => {
                const detail: ScreenshotEvent = {file};
                const e = new CustomEvent(eventNames.screenshot, {...CUSTOM_EVENT_INIT, detail});
                this.dispatchEvent(e);
            });
        }
    }

    return ScreenshotElement as Constructor<ScreenshotInterface> & T;
}