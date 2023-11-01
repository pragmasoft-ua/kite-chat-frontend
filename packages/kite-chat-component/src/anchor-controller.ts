import { ReactiveControllerHost } from 'lit';

type Anchor = {
    x: number; 
    y: number;
}

type Size = {
    height?: string;
    margin?: string;
    gap?: string;
}

export class AnchorController {
    private targetSelector = "[popovertarget]";
    private popoverSelector = "[popover]";
    private handleToggleBound: () => void;
    private targetObserver: MutationObserver;

    constructor(
        private host: ReactiveControllerHost & HTMLElement, 
        private popoverSize: Size | null = null,
    ) {
        this.host.addController(this);
    }

    get popoverElement(): HTMLElement {
        return this.host.shadowRoot?.querySelector(this.popoverSelector) as HTMLElement;
    }

    get targetElement(): HTMLElement {
        return this.host.shadowRoot?.querySelector(this.targetSelector) as HTMLElement;
    }

    hostConnected() {
        window.addEventListener('resize', this.positionPopover.bind(this));
        this.handleToggleBound = this.positionPopover.bind(this);
        this.targetObserver = new MutationObserver(this.positionPopover.bind(this));
    }

    hostUpdate() {
        if (this.popoverElement) {
            this.targetObserver.disconnect();
            this.popoverElement.removeEventListener('toggle', this.handleToggleBound);
        }
    }

    hostUpdated() {
        this.positionPopover();
        this.popoverElement.addEventListener('toggle', this.handleToggleBound); 
        this.targetObserver.observe(this.targetElement, { attributes: true, childList: true, subtree: true });
    }

    hostDisconnected() {
        window.removeEventListener('resize', this.positionPopover.bind(this));
    }

    computePosition(targetElement: HTMLElement): Promise<Anchor> {
        return new Promise((resolve) => {
            const targetRect = targetElement.getBoundingClientRect();

            const x = targetRect.right;
            const y = targetRect.top;

            resolve({ x, y });
        });
    }

    positionPopover() {
        if (this.popoverElement && this.targetElement) {
            const popoverRect = this.popoverElement.getBoundingClientRect();
            const targetRect = this.targetElement.getBoundingClientRect();
            const width = `${popoverRect.width}px`;
            const height = this.popoverSize?.height ?? `${popoverRect.height}px`;
            const margin = this.popoverSize?.margin ?? '0';
            const gap = this.popoverSize?.gap ?? '0';
            const maxHeight = `calc(100dvh - ${targetRect.height}px - ${margin} * 2 - ${gap})`;
            const maxWidth = `calc(100vw - ${margin} * 2)`;
            
            const calculatePosition = () => {
                this.computePosition(this.targetElement).then(({ x, y }: Anchor) => {
                    Object.assign(this.popoverElement.style, {
                        margin: '0',
                        left: `calc(${x}px - min(${width}, ${maxWidth})`,
                        top: `calc(${y}px - min(${height}, ${maxHeight}) - ${gap})`,
                        maxHeight,
                        maxWidth,
                    });
                });
            };
        
            // Use requestAnimationFrame to ensure synchronized calculation
            requestAnimationFrame(calculatePosition);
        }
    }
}