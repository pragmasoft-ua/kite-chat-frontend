import { ReactiveControllerHost } from 'lit';

type Anchor = {
    left: number; 
    right: number;
    top: number; 
    bottom: number;
}

export class AnchorController {
    private handleToggleBound: () => void;
    private targetObserver: MutationObserver;

    constructor(
        private host: ReactiveControllerHost & HTMLElement, 
        private anchorName: string,
        private fallbackClassList: Array<string>,
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

            resolve(targetRect);
        });
    }

    positionPopover() {
        if (this.popoverElement && this.targetElement) {
            // Use requestAnimationFrame to ensure synchronized calculation
            requestAnimationFrame(() => {
                this.computePosition(this.targetElement).then(({ left, right, top, bottom }: Anchor) => {
                    if(this.anchorName) {
                        const properties = {
                            [`${this.anchorName}-left`]: left,
                            [`${this.anchorName}-right`]: right,
                            [`${this.anchorName}-top`]: top,
                            [`${this.anchorName}-bottom`]: bottom
                        };
                        Object.entries(properties).forEach(([property, value]) => (
                            this.popoverElement.style.setProperty(property, `${value}px`)
                        ));
                    }
                });
            });
            if (this.fallbackClassList) {
                const classList = [...this.fallbackClassList].reverse();
                classList.forEach(className => this.popoverElement.classList.remove(className));
                let isOverflowing = true;
    
                const applyNextClass = () => {
                    const lastClass = classList.pop();
                    this.popoverElement.classList.add(lastClass);
    
                    const computedStyles = window.getComputedStyle(this.popoverElement);
                    const left = parseFloat(computedStyles.left);
                    const right = parseFloat(computedStyles.right);
                    const top = parseFloat(computedStyles.top);
                    const bottom = parseFloat(computedStyles.bottom);

                    isOverflowing = ((left < 0) || (right > window.innerWidth) || (top < 0) || (bottom > window.innerHeight));

                    if (isOverflowing && classList.length > 0) {
                        applyNextClass();
                    }
                };
                applyNextClass();
            }
        }
    }
}