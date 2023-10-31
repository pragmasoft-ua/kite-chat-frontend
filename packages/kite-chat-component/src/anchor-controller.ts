import { ReactiveControllerHost } from 'lit';

type Anchor = {
    x: number; 
    y: number;
}

type Size = {
    width: string; 
    height: string;
}

export class AnchorController {
    private targetSelector = "[popovertarget]";
    private popoverSelector = "[popover]";

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
    }

    hostUpdated() {
        this.popoverElement.addEventListener('toggle', this.positionPopover.bind(this)); 
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
            const width = this.popoverSize?.width || `${popoverRect.width}px`;
            const height = this.popoverSize?.height || `${popoverRect.height}px`;
            const calculatePosition = () => {
                this.computePosition(this.targetElement).then(({ x, y }: Anchor) => {
                    Object.assign(this.popoverElement.style, {
                        margin: '0',
                        left: `calc(${x}px - ${width})`,
                        top: `calc(${y}px - ${height} - 1rem)`,
                    });
                });
            };
    
            // Use requestAnimationFrame to ensure synchronized calculation
            requestAnimationFrame(calculatePosition);
        }
    }
}