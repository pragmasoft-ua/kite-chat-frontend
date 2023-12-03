import { ReactiveControllerHost } from 'lit';

type Rect = {
    left: number; 
    right: number;
    top: number; 
    bottom: number;
    width: number; 
    height: number; 
}

const ANCHOR_PROPERTY_PREFIX = '--anchor';
const ELEMENT_PROPERTY_PREFIX = '--element';

export class AnchorController {
    private handleToggleBound: () => void;
    private targetObserver: MutationObserver;

    constructor(
        private host: ReactiveControllerHost & HTMLElement, 
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

    computePosition(targetElement: HTMLElement): Promise<Rect> {
        return new Promise((resolve) => {
            const targetRect = targetElement.getBoundingClientRect();

            resolve(targetRect);
        });
    }

    positionPopover() {
        if (!this.popoverElement || !this.targetElement) {
            return;
        }
        const parentRect = this.targetElement.parentElement?.getBoundingClientRect();

        // Use requestAnimationFrame to ensure synchronized calculation
        requestAnimationFrame(() => {
            this.computePosition(this.targetElement).then(({ left, right, top, bottom }: Rect) => {
                const anchorProperties = !parentRect ? {
                    [`${ANCHOR_PROPERTY_PREFIX}-left`]: left,
                    [`${ANCHOR_PROPERTY_PREFIX}-right`]: right,
                    [`${ANCHOR_PROPERTY_PREFIX}-top`]: top,
                    [`${ANCHOR_PROPERTY_PREFIX}-bottom`]: bottom
                } : {
                    [`${ANCHOR_PROPERTY_PREFIX}-left`]: left - parentRect.left,
                    [`${ANCHOR_PROPERTY_PREFIX}-right`]: right - parentRect.left,
                    [`${ANCHOR_PROPERTY_PREFIX}-top`]: top - parentRect.top,
                    [`${ANCHOR_PROPERTY_PREFIX}-bottom`]: bottom - parentRect.top
                };
                Object.entries(anchorProperties).forEach(([property, value]) => (
                    this.popoverElement.style.setProperty(property, `${value}px`)
                ));
            });
            this.computePosition(this.popoverElement).then(({ width, height }: Rect) => {
                const elementProperties = {
                    [`${ELEMENT_PROPERTY_PREFIX}-width`]: width,
                    [`${ELEMENT_PROPERTY_PREFIX}-height`]: height,
                };
                Object.entries(elementProperties).forEach(([property, value]) => (
                    this.popoverElement.style.setProperty(property, `${value}px`)
                ));
            });
        });
        requestAnimationFrame(() => {
            if (!this.fallbackClassList) {
                return;
            }
            const classList = [...this.fallbackClassList].reverse();
            classList.forEach(className => this.popoverElement.classList.remove(className));
            let isOverflowing = true;

            const applyNextClass = () => {
                const lastClass = classList.pop();
                if(!lastClass) {
                    return;
                }
                this.popoverElement.classList.add(lastClass);
    
                const computedStyles = window.getComputedStyle(this.popoverElement);
                const left = parseFloat(computedStyles.left);
                const right = parseFloat(computedStyles.right);
                const top = parseFloat(computedStyles.top);
                const bottom = parseFloat(computedStyles.bottom);

                isOverflowing = (
                    (left < 0) || 
                    (right > (!parentRect ? window.innerWidth : parentRect.width)) || 
                    (top < 0) || 
                    (bottom > (!parentRect ? window.innerHeight : parentRect.height))
                );

                if (isOverflowing && classList.length > 0) {
                    applyNextClass();
                }
            };
            applyNextClass();
        });
    }
}