import {TemplateResult, LitElement, html} from 'lit';
import {state, queryAssignedElements} from 'lit/decorators.js';
import {SelectableElement} from '../controllers';

/**
 * Type definition of a constructor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export declare class SelectionContainerInterface<T extends SelectableElement> {
    readonly selectedElements: Array<T>;
    _unselect(): void;
    _renderSelectionContainer(): TemplateResult<1>;
}

export const SelectionContainerMixin = <T extends Constructor<LitElement>, U extends SelectableElement>(
    superClass: T,
    selectedElementType: Constructor<U>
) => {
    class SelectionContainerElement extends superClass {
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

        @queryAssignedElements({selector: '[selected]'})
        _slotElements!: Array<U>;

        @state()
        selectedElements: Array<U> = [];

        private onSelected(e: Event) {
            const selectedElement = e.target as U;
            
            if(selectedElement && (e as CustomEvent).detail.selected) {
                this.selectedElements = [...this.selectedElements, selectedElement];
            } else {
                this.selectedElements = [...this.selectedElements.filter(el => !el.isEqualNode(selectedElement))];
            }
        }

        private handleSlotchange() {
            this.selectedElements = this.selectedElements.filter(el => this._slotElements.includes(el));
        }

        _renderSelectionContainer() {
            return html`<slot @slotchange=${this.handleSlotchange} @select=${this.onSelected}></slot>`;
        }

        _unselect() {
            [...this.selectedElements].forEach((element) => {
                element.unselect();
            });
        }
    }

    return SelectionContainerElement as Constructor<SelectionContainerInterface<U>> & T;
}