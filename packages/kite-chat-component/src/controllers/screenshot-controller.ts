import { ReactiveControllerHost } from 'lit';
import type { default as Html2canvas } from 'html2canvas';

type CapturingOptions = {
    x: number,
    y: number,
    width: number,
    height: number,
}

const HTML2CANVAS_CDN = "https://unpkg.com/html2canvas/dist/html2canvas.esm.js";

export class ScreenshotController {
    private host: ReactiveControllerHost & HTMLElement;

    constructor(host: ReactiveControllerHost & HTMLElement) {
        this.host = host;
        this.host.addController(this);
    }

    hostConnected() {
        return;
    }

    hostDisconnected() {
        return;
    }

    captureScreen(callback: (file: File) => void): void {
        const options = {
            x: window.scrollX,
            y: window.scrollY,
            width: window.innerWidth,
            height: window.innerHeight,
        };
        this.capture(document.documentElement, callback, options);
    }

    async capture(elementToCapture: HTMLElement, callback: (file: File) => void, capturingOptions: CapturingOptions): Promise<void> {
        // Import html2canvas module dynamically
        const {default: html2canvas}: {default: typeof Html2canvas} = await import(/* @vite-ignore */ HTML2CANVAS_CDN);

        const resultingType = 'image/png';
        const options = {
            logging: false,
            ...capturingOptions,
        }
    
        const canvas = await html2canvas(elementToCapture, options);
    
        canvas.toBlob((blob) => {
            if (blob) {
                callback(new File([blob], `${(new Date()).toISOString()}.png`, { type: resultingType }));
            } else {
                console.error('Failed to convert canvas to Blob.');
            }
        });
    }
}
