import { ReactiveControllerHost } from 'lit';

enum SupportedFileTypes {
    IMAGE_PNG = 'image/png',
}

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

    get isFilesSupported() {
        //Not supported in firefox
        return !!navigator.clipboard && !!navigator.clipboard.write;
    }

    isSupportedFile(file: File) {
        return this.isFilesSupported 
            && Object.values(SupportedFileTypes).includes(file.type as SupportedFileTypes);
    }

    async copyToClipboard(data: string | File) {        
        if(data instanceof File) {
            if(!this.isSupportedFile(data)) return;
            const clipboardItem = new ClipboardItem({
                [data.type]: new Blob([data], {type: data.type})
            });
            await navigator.clipboard.write([clipboardItem]);
        } else {
            navigator.clipboard.writeText(data);
        }
    }

    async pasteFromClipboard(e: ClipboardEvent) {
        if(!e.clipboardData) return null;
        for(const item of e.clipboardData.items) {
            if (item.kind === "file") {
                return item.getAsFile();
            }
        }
        for(const item of e.clipboardData.items) {
            return await new Promise<string>((resolve) => {
                item.getAsString((str) => resolve(str));
            });
        }
        return null;
    }
}
