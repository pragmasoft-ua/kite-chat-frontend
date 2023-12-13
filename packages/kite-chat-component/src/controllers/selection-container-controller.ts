import {ReactiveControllerHost} from 'lit';
import {vibrate, VibrationPattern} from '../utils';

type SelectableContainer<U> = HTMLElement & {
    selectedElements: Array<U>;
}

export type Select = {
    target: SelectableElement;
    isSelected: boolean;
    allSelected: SelectableElement[];
}

export type SelectableElement = HTMLElement & {
    selected: boolean;
    select(): void;
    unselect(): void;
}

export type SelectionEventNames = {
    select: string;
}

const SELECTION_THRESHOLD = 500;

const CUSTOM_EVENT_INIT = {
    bubbles: true,
    composed: true,
    cancelable: true,
};

export class SelectionContainerController<U extends SelectableElement> {
    private handleSlotchangeBound: () => void;
    private handleSelectionStartBound: (e: MouseEvent|TouchEvent) => void;
    private handleSelectionEndBound: (e: MouseEvent|TouchEvent) => void;
    private handleIgnoreSelectionBound: () => void;
    private handleClickBound: (e: MouseEvent) => void;
    private pressTimer: number | null = null;
    private ignored = false;
    private selectionFlag = false;

    constructor(
        private host: ReactiveControllerHost & SelectableContainer<U>,
        private selectedElementTag: string,
        private eventNames: SelectionEventNames,
        private selectionCallback?: () => void
    ) {
        this.host.addController(this);
    }

    get defaultSlot(): HTMLSlotElement|null {
        return this.host.shadowRoot?.querySelector('slot') as HTMLSlotElement|null;
    }

    get selectableSlotElements(): Array<U> {
        return this.defaultSlot?.assignedElements().filter((node) => node.matches(this.selectedElementTag)) as Array<U>;
    }

    get selectedSlotElements(): Array<U> {
        return this.selectableSlotElements?.filter((node) => node.selected) as Array<U>;
    }

    private get isTouchscreen() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    hostConnected() {
        this.handleSlotchangeBound = this.handleSlotchange.bind(this);
        this.handleSelectionStartBound = this.handleSelectionStart.bind(this);
        this.handleSelectionEndBound = this.handleSelectionEnd.bind(this);
        this.handleIgnoreSelectionBound = this.handleIgnoreSelection.bind(this);
        this.handleClickBound = this.handleClick.bind(this);
    }

    hostUpdate() {
        if (this.defaultSlot) {
            this.defaultSlot.removeEventListener('slotchange', this.handleSlotchangeBound);
            if(this.isTouchscreen) {
                this.defaultSlot.removeEventListener('touchstart', this.handleSelectionStartBound);
                this.defaultSlot.removeEventListener('touchmove', this.handleIgnoreSelectionBound);
                this.defaultSlot.removeEventListener('touchend', this.handleSelectionEndBound);
            } else {
                this.defaultSlot.removeEventListener('mousedown', this.handleSelectionStartBound);
                this.defaultSlot.removeEventListener('mouseup', this.handleSelectionEndBound);
                this.defaultSlot.removeEventListener('mousemove', this.handleIgnoreSelectionBound);
            }
            this.defaultSlot.removeEventListener('click', this.handleClickBound);
        }
    }

    hostUpdated() {
        this.defaultSlot?.addEventListener('slotchange', this.handleSlotchangeBound);
        if(this.isTouchscreen) {
            this.defaultSlot?.addEventListener('touchstart', this.handleSelectionStartBound, { passive: true });
            this.defaultSlot?.addEventListener('touchmove', this.handleIgnoreSelectionBound, { passive: true });
            this.defaultSlot?.addEventListener('touchend', this.handleSelectionEndBound);
        } else {
            this.defaultSlot?.addEventListener('mousedown', this.handleSelectionStartBound);
            this.defaultSlot?.addEventListener('mouseup', this.handleSelectionEndBound);
            this.defaultSlot?.addEventListener('mousemove', this.handleIgnoreSelectionBound);
        }
        this.defaultSlot?.addEventListener('click', this.handleClickBound, { capture: true });
    }

    private _updateSelected(selectedElement: SelectableElement) {
        if(selectedElement.selected) {
            if(this.host.selectedElements.length === 1) {
                const range = this.getRange(this.host.selectedElements[0], selectedElement);
                range.forEach(el => el.select());
                this.host.selectedElements = [...range];
            } else {
                this.host.selectedElements = [...this.host.selectedElements, selectedElement as U];
            }
        } else {
            this.host.selectedElements = [...this.host.selectedElements.filter(el => !selectedElement.isEqualNode(el))];
        }
    }

    private getRange(startEl: SelectableElement, endEl: SelectableElement) {
        const startIndex = this.selectableSlotElements.indexOf(startEl as U);
        const endIndex = this.selectableSlotElements.indexOf(endEl as U);
        const [min, max] = [startIndex, endIndex].sort((a, b) => a - b);
        return this.selectableSlotElements.slice(min, max + 1);
    }

    private _isMultiselect(selectableElement: SelectableElement) {
        return this.selectedSlotElements.length > (selectableElement.selected ? 1 : 0);
    }

    handleSelected(selectedElement: SelectableElement) {
        const detail : Select = {
            target: selectedElement,
            isSelected: selectedElement.selected,
            allSelected: this.host.selectedElements as SelectableElement[],
        };
        const e = new CustomEvent(this.eventNames.select, {...CUSTOM_EVENT_INIT, detail});
        this.host.dispatchEvent(e);
        if (!e.defaultPrevented) {
            this._updateSelected(selectedElement);
            this.selectionFlag = true;
            this.selectionCallback && this.selectionCallback();
        }
    }

    private getSelectable(target: HTMLElement|EventTarget|null): U | null {
        return (target as HTMLElement).closest(this.selectedElementTag);
    }

    private handleSlotchange() {
        this.host.selectedElements = this.host.selectedElements.filter(el => this.selectedSlotElements.includes(el));
    }

    private handleSelectionStart(e: MouseEvent|TouchEvent) {
        const selectableElement = this.getSelectable(e.target);
        if (!selectableElement) return;
        this.pressTimer = setTimeout(() => {
            selectableElement.selected = !selectableElement.selected;
            vibrate(VibrationPattern.LONG_PRESS);
            this.handleSelected(selectableElement);
            this.pressTimer = null;
        }, SELECTION_THRESHOLD);
        this.ignored = false;
    }

    private handleSelectionEnd(e: MouseEvent|TouchEvent) {
        const selectableElement = this.getSelectable(e.target);
        if (selectableElement && !this.ignored && this.pressTimer !== null) {
            clearTimeout(this.pressTimer);
            vibrate(VibrationPattern.SHORT_PRESS);
            const select = this._isMultiselect(selectableElement) ? !selectableElement.selected : false;
            if(selectableElement.selected !== select) {
                selectableElement.selected = select;
                this.handleSelected(selectableElement);
            }
        }
    }

    private handleIgnoreSelection() {
        if (!this.pressTimer) return;
        clearTimeout(this.pressTimer);
        this.ignored = true;
    }

    private handleClick(e: MouseEvent) {
        if (this.selectionFlag) {
            e.preventDefault();
        }
        this.selectionFlag = false;
    }
}
