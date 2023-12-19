import { ReactiveControllerHost } from 'lit';

export class ClipboardController {
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

    copyToClipboard(data: string | File) {
        let blob: Blob;
        let blobUrl: string;
        
        switch (true) {
            case typeof data === 'string':
                navigator.clipboard.writeText(data);
                break;
            case data instanceof File:
                blob = new Blob([data], { type: data.type });
                blobUrl = URL.createObjectURL(blob);
                navigator.clipboard.writeText(blobUrl);
                break;
            default:
                return;
        }
    }

    pasteFromClipboard(callback: (data: string | File | null) => void) {
        navigator.clipboard.readText().then(async (text) => {
            if (text.startsWith('blob:')) {
                const response = await fetch(text);
                const blob = await response.blob();
                const file = new File([blob], 'pastedFile', { type: blob.type });
                callback(file);
            } else {
                callback(text);
            }
        });
    }
}
