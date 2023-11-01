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
        event.preventDefault();
        this.start({ x: event.clientX, y: event.clientY });
    }

    private handleMouseMove(event: MouseEvent) {
        event.preventDefault();
        this.move({ x: event.clientX, y: event.clientY });
    }

    private start(position: Position) {
        if (this.targetElement) {
            this.clickOccurred = true;
            const rect = this.targetElement.getBoundingClientRect();
            this.initial = position;
            this.offset = { x: this.initial.x - rect.left, y: this.initial.y - rect.top };
            this.current = this.initial;
        }
    }

    private move(position: Position) {
        if (this.clickOccurred && !this.isDragging) {
            this.current = position;
            if (this.isMoved()) {
                this.isDragging = true;
                this.targetElement.style.cursor = 'grabbing';
            }
        }

        if (this.isDragging) {
            this.current = position;
            this.targetElement.style.left = `${this.current.x - this.offset.x}px`;
            this.targetElement.style.top = `${this.current.y - this.offset.y}px`;
        }
    }

    private end() {
        this.isDragging = false;
        this.clickOccurred = false;
    }

    private handleMouseUp() {
        this.targetElement.style.cursor = 'pointer';
        this.end();
    }
}
