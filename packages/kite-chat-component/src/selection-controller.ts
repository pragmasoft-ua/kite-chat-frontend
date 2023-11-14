import { ReactiveControllerHost } from 'lit';

const SELECTION_THRESHOLD = 500;

const CUSTOM_EVENT_INIT = {
    bubbles: true,
    composed: true,
    cancelable: true,
};

type SelectableElement = HTMLElement & {
    selected: boolean;
}

export class SelectionController {
    private pressTimer: number | null = null;
    private ignored = false; 

    constructor( 
        private host: ReactiveControllerHost & SelectableElement, 
    ) {
        this.host.addController(this);
    }

    hostConnected() {
        this.host.addEventListener('mousedown', this.startSelection.bind(this));
        this.host.addEventListener('mouseup', this.endSelection.bind(this));
        this.host.addEventListener('mousemove', this.ignoreSelection.bind(this));
        // Touch events
        this.host.addEventListener('touchstart', this.startSelection.bind(this), { passive: true });
        this.host.addEventListener('touchend', this.endSelection.bind(this));
        this.host.addEventListener('touchmove', this.ignoreSelection.bind(this), { passive: true });
    }

    hostDisconnected() {
        this.host.removeEventListener('mousedown', this.startSelection.bind(this));
        this.host.removeEventListener('mouseup', this.endSelection.bind(this));
        this.host.removeEventListener('mousemove', this.ignoreSelection.bind(this));
        // Touch events
        this.host.removeEventListener('touchstart', this.startSelection.bind(this));
        this.host.removeEventListener('touchend', this.endSelection.bind(this));
        this.host.removeEventListener('touchmove', this.ignoreSelection.bind(this));
    }

    private startSelection() {
        this.pressTimer = setTimeout(() => {
            this.handleSelect(true);
            this.pressTimer = null;
        }, SELECTION_THRESHOLD);
        this.ignored = false;
    }

    private endSelection(e: MouseEvent|TouchEvent) {
        const isSelected = this.host.parentElement?.querySelector('[selected]');

        if (e instanceof TouchEvent) {
            e.cancelable && e.preventDefault();
        }
        if (!this.ignored && this.pressTimer !== null) {
            clearTimeout(this.pressTimer);
            this.handleSelect(isSelected ? !this.host.selected : false);
        }
    }

    private ignoreSelection() {
        if (this.pressTimer !== null) {
            clearTimeout(this.pressTimer);
            this.ignored = true;
        }
    }

    private handleSelect(selected: boolean) {
        this.host.selected = selected;
        this.host.dispatchEvent(new CustomEvent('select', {
            ...CUSTOM_EVENT_INIT,
            detail: { selected: selected },
        }));
    }

    select() {
        this.handleSelect(true);
    }

    unselect() {
        this.handleSelect(false);
    }
}