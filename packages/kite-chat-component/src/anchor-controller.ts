import { ReactiveControllerHost } from 'lit';

type Anchor = {
    x: number; 
    y: number;
}

type Variables = {
    x: string;
    y: string;
}

export class AnchorController {
    private handleToggleBound: () => void;
    private targetObserver: MutationObserver;

    constructor(
        private host: ReactiveControllerHost & HTMLElement, 
        private variables: Variables | null = null,
        private targetSelector = "[popovertarget]",
        private popoverSelector = "[popover]",
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
            // Use requestAnimationFrame to ensure synchronized calculation
            requestAnimationFrame(() => {
                this.computePosition(this.targetElement).then(({ x, y }: Anchor) => {
                    if(this.variables) {
                        this.popoverElement.style.setProperty(this.variables.x, `${x}px`);
                        this.variables && this.popoverElement.style.setProperty(this.variables.y, `${y}px`);
                    }
                });
            });
        }
    }
}