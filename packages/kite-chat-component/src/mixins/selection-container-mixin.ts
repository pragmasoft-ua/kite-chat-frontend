import {LitElement} from 'lit';
import {state} from 'lit/decorators.js';
import {
    SelectionContainerController, 
    SelectableElement,
    SelectionEventNames,
} from '../controllers';

/**
 * Type definition of a constructor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export interface SelectableElementConstructor<T> extends Constructor<T> {
    TAG: string;
}

export declare class SelectionContainerInterface<T extends SelectableElement> {
    readonly selectedElements: Array<T>;
    select(el: T): void;
    unselect(el: T): void;
    unselectAll(): void;
}

export const SelectionContainerMixin = <T extends Constructor<LitElement>, U extends SelectableElement>(
    superClass: T,
    _selectedElementType: SelectableElementConstructor<U>,
    eventNames: SelectionEventNames,
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

        @state()
        selectedElements: Array<U> = [];

        protected selectionContainerController = new SelectionContainerController<U>(this, _selectedElementType.TAG, eventNames);
        
        unselect(el: HTMLElement) {
            if (!(el instanceof _selectedElementType)) return;
            //el.unselect();
            //this.selectionContainerController.handleSelected(el);
        }

        select(el: HTMLElement) {
            if (!(el instanceof _selectedElementType)) return;
            //el.select();
            //this.selectionContainerController.handleSelected(el);
        }

        unselectAll() {
            this.selectedElements.forEach((element) => element.unselect());
            this.selectedElements = [];
        }
    }
    return SelectionContainerElement as Constructor<SelectionContainerInterface<U>> & T;
}