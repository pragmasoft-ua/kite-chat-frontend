import {LitElement, PropertyValues} from 'lit';
import {state, queryAssignedElements, query} from 'lit/decorators.js';
import { vibrate } from '../utils';

/**
 * Type definition of a constructor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export declare class SelectionContainerInterface<T extends SelectableElement> {
    readonly selectedElements: Array<T>;
    unselectAll(): void;
}

export type SelectableElement = HTMLElement & {
    selected: boolean;
    multiselect: boolean;
    select(): void;
    unselect(): void;
}

const SELECTION_THRESHOLD = 500;

export const SelectionContainerMixin = <T extends Constructor<LitElement>, U extends SelectableElement>(
    superClass: T,
    _selectedElementType: Constructor<U>
) => {
    class SelectionContainerElement extends superClass {
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

        @queryAssignedElements({selector: '[selected]'})
        private _selectedSlotElements!: Array<U>;

        @query(`slot:not([name])`)
        private _defaultSlot!: HTMLSlotElement;

        @state()
        selectedElements: Array<U> = [];

        private pressTimer: number | null = null;
        private ignored = false; 

        private onSelected(selectedElement: SelectableElement) {
            if(selectedElement && selectedElement.selected) {
                this.selectedElements = [...this.selectedElements, selectedElement as U];
            } else {
                this.selectedElements = [...this.selectedElements.filter(el => !el.isEqualNode(selectedElement))];
            }
        }

        private handleSlotchange() {
            this.selectedElements = this.selectedElements.filter(el => this._selectedSlotElements.includes(el));
        }

        // To use with :host-context(.multiselect)
        /*  override updated(changedProperties: PropertyValues<this>): void {
            super.updated(changedProperties);

            if (changedProperties.has('selectedElements')) {
                this.classList.toggle('multiselect', this.selectedElements.length > 0);
            }
        } */

        override firstUpdated(changedProperties: PropertyValues<this>): void {
            super.firstUpdated(changedProperties);
            const slot = this._defaultSlot;
            slot.addEventListener('slotchange', this.handleSlotchange.bind(this));
            slot.addEventListener('mousedown', this.startSelection.bind(this));
            slot.addEventListener('mouseup', this.endSelection.bind(this));
            slot.addEventListener('mousemove', this.ignoreSelection.bind(this));
            slot.addEventListener('touchstart', this.startSelection.bind(this), {passive: true});
            slot.addEventListener('touchmove', this.ignoreSelection.bind(this), {passive: true});
            slot.addEventListener('touchend', this.endSelection.bind(this));
            slot.addEventListener('mouseover', this.handleMouseOver.bind(this));
            slot.addEventListener('mouseout', this.handleMouseOut.bind(this));
        }

        override disconnectedCallback() {
            super.disconnectedCallback();
            const slot = this._defaultSlot;
            slot.removeEventListener('slotchange', this.handleSlotchange.bind(this));
            slot.removeEventListener('mousedown', this.startSelection.bind(this));
            slot.removeEventListener('mouseup', this.endSelection.bind(this));
            slot.removeEventListener('mousemove', this.ignoreSelection.bind(this));
            slot.removeEventListener('touchstart', this.startSelection.bind(this));
            slot.removeEventListener('touchmove', this.ignoreSelection.bind(this));
            slot.removeEventListener('touchend', this.endSelection.bind(this));
            slot.removeEventListener('mouseover', this.handleMouseOver.bind(this));
            slot.removeEventListener('mouseout', this.handleMouseOut.bind(this));
        }

        private startSelection(e: MouseEvent|TouchEvent) {
            if (!(e.target instanceof _selectedElementType)) {
                return;
            }
            const selectableElement = e.target as SelectableElement;
            this.pressTimer = setTimeout(() => {
                selectableElement.selected = !selectableElement.selected;
                vibrate('LONG_PRESS');
                this.onSelected(selectableElement);
                this.pressTimer = null;
            }, SELECTION_THRESHOLD);
            this.ignored = false;
        }
    
        private endSelection(e: MouseEvent|TouchEvent) {
            if (e instanceof TouchEvent) {
                e.cancelable && e.preventDefault();
            }
            if (!(e.target instanceof _selectedElementType)) {
                return;
            }
            const selectableElement = e.target as SelectableElement;
            if (!this.ignored && this.pressTimer !== null) {
                clearTimeout(this.pressTimer);
                const isMultiselect = this._selectedSlotElements.filter(el => !el.isEqualNode(selectableElement)).length > 0;
                selectableElement.selected = isMultiselect ? !selectableElement.selected : false;
                vibrate('SHORT_PRESS');
                this.onSelected(selectableElement);
            }
        }

        private ignoreSelection() {
            if (this.pressTimer !== null) {
                clearTimeout(this.pressTimer);
                this.ignored = true;
            }
        }

        unselectAll() {
            [...this.selectedElements].forEach((element) => {
                element.unselect();
            });
            this.selectedElements = [];
        }

        // GET RID OF IT WHEN :host-context() supported
        private handleMouseOver(e: MouseEvent) {
            if (!(e.target instanceof _selectedElementType)) {
                return;
            }
            const selectableElement = e.target as SelectableElement;
            selectableElement.multiselect = this._selectedSlotElements.filter(el => !el.isEqualNode(selectableElement)).length > 0;
        }

        private handleMouseOut(e: MouseEvent) {
            if (!(e.target instanceof _selectedElementType)) {
                return;
            }
            const selectableElement = e.target as SelectableElement;
            selectableElement.multiselect = false;
        }
    }

    return SelectionContainerElement as Constructor<SelectionContainerInterface<U>> & T;
}