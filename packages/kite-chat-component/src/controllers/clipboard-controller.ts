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
        
        if(data instanceof File) {
            blob = new Blob([data], { type: data.type });
            blobUrl = URL.createObjectURL(blob);
            navigator.clipboard.writeText(blobUrl);
        } else {
            navigator.clipboard.writeText(data);
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
