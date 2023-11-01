import { ReactiveControllerHost } from 'lit';

type Position = {
    x: number;
    y: number;
}

export class DraggableController {
    private isDragging = false;
    private clickOccurred = false;
    private current: Position;
    private initial: Position;
    private offset: Position;
    private clickThreshold = 5;

    private handleMouseDownBound: (event: MouseEvent) => void;
    private handleClickBound: () => void;

    constructor(
        private host: ReactiveControllerHost & HTMLElement,
        private targetSelector = "#draggable",
        private onTargetClick: () => void,
    ) {
        this.host.addController(this);
    }

    get targetElement(): HTMLElement {
        return this.host.shadowRoot?.querySelector(this.targetSelector) as HTMLElement;
    }

    hostConnected() {
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.handleMouseDownBound = this.handleMouseDown.bind(this);
        this.handleClickBound = this.handleClick.bind(this);
    }

    hostUpdate() {
        if (this.targetElement) {
            this.targetElement.removeEventListener('mousedown', this.handleMouseDownBound);
            this.targetElement.removeEventListener('click', this.handleClickBound);
        }
    }

    hostUpdated() {
        this.targetElement.addEventListener('mousedown', this.handleMouseDownBound);
        this.targetElement.addEventListener('click', this.handleClickBound);
    }

    hostDisconnected() {
        window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
        window.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    private handleClick() {
        if (!(this.isMoved())) {
            this.onTargetClick?.();
        }
    }

    private isMoved() {
        const delta = { x: Math.abs(this.current.x - this.initial.x), y: Math.abs(this.current.y - this.initial.y) };
        return delta.x > this.clickThreshold || delta.y > this.clickThreshold;
    }

    private handleMouseDown(event: MouseEvent) {
        if (this.targetElement) {
            this.clickOccurred = true;
            const rect = this.targetElement.getBoundingClientRect();
            this.initial = { x: event.clientX, y: event.clientY };
            this.offset = { x: this.initial.x - rect.left, y: this.initial.y - rect.top };
            this.current = this.initial;
        }
    }

    private handleMouseMove(event: MouseEvent) {
        if (this.clickOccurred && !this.isDragging) {
            this.current = { x: event.clientX, y: event.clientY };
            if (this.isMoved()) {
                this.isDragging = true;
                this.targetElement.style.cursor = 'grabbing';
            }
        }

        if (this.isDragging && this.targetElement) {
            this.targetElement.style.left = `${event.clientX - this.offset.x}px`;
            this.targetElement.style.top = `${event.clientY - this.offset.y}px`;
            this.current = {x: event.clientX, y: event.clientY};
        }
    }

    private handleMouseUp() {
        this.targetElement.style.cursor = 'pointer';

        this.isDragging = false;
        this.clickOccurred = false;
    }
}
