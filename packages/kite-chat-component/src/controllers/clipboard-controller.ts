import { ReactiveControllerHost } from 'lit';

enum SupportedTypes {
    TEXT_PLAIN = 'text/plain',
    TEXT_HTML = 'text/html',
    IMAGE_PNG = 'image/png',
}

export type ClipboardData = {
    text: string;
    files?: File[];
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

    get isWriteSupported() {
        //Not supported in firefox
        return !!navigator.clipboard && !!navigator.clipboard.write;
    }

    private isImage(file: File) {
        return file.type.startsWith('image');
    }

    private getTextData(string: string) {
        return new Blob([string], {type: SupportedTypes.TEXT_PLAIN});
    }

    private async getImageData(file: File): Promise<Blob|null> {
        const blobPart = file.type === SupportedTypes.IMAGE_PNG ? file : await this.toPNG(file);
        if(!blobPart) return null;
        return new Blob([blobPart], {type: SupportedTypes.IMAGE_PNG});
    }

    private async getHtmlData(data: (string|File)[]) {
        return new Blob([await this.constructHtmlContent(data)], {type: SupportedTypes.TEXT_HTML});
    }

    private async toPNG(file: File): Promise<File|null> {
        const img = document.createElement('img');
        const objectURL = URL.createObjectURL(file);
    
        return new Promise((resolve) => {
            img.onload = async () => {
                const canvas = new OffscreenCanvas(img.width, img.height);
                const ctx = canvas.getContext('2d');
    
                if (!ctx) {
                    resolve(null);
                    return; 
                }
    
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
    
                const blob = await canvas.convertToBlob();
                blob ? resolve(new File([blob], 'image.png', { type: 'image/png' })) : resolve(null);
    
    
                URL.revokeObjectURL(objectURL);
            };
    
            img.src = objectURL;
        });
    }
    private getText(data: (string | File)[]) {
        return data.filter(item => !(item instanceof File)).join('\n');
    }

    async copyToClipboard(data: (string | File)[]) {
        const plainText = this.getText(data);

        navigator.clipboard.writeText(plainText); 

        if(!this.isWriteSupported) return;

        const files = data.filter(item => (item instanceof File)) as File[];   

        const clipboardData: Partial<Record<SupportedTypes, string | Blob>> = {
            [SupportedTypes.TEXT_PLAIN]: this.getTextData(plainText),
            [SupportedTypes.TEXT_HTML]: await this.getHtmlData(data),
        };

        const images = files.filter(file => this.isImage(file));
        if(images.length === 1) {
            const imageFile = await this.getImageData(images[0]);
            imageFile && (clipboardData[SupportedTypes.IMAGE_PNG] = imageFile);
        }
        
        await navigator.clipboard.write([new ClipboardItem(clipboardData)]);
    }

    pasteFromClipboard(e: ClipboardEvent): ClipboardData|null {
        if(!e.clipboardData) return null;
        const text = e.clipboardData.getData(SupportedTypes.TEXT_PLAIN);
        const files = Array.from(e.clipboardData.items)
            .filter(item => item.kind === 'file')
            .map(item => item.getAsFile())
            .filter(item => !!item) as File[];
        return {text, files};
    }

    private convertToBase64(file: File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string|null)?.split(',')[1]);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }
    
    private async constructHtmlContent(data: (string | File)[]) {
        const contentDiv = document.createElement('div');
    
        for(const item of data) {
            if(item instanceof File) {
                if(item.type.startsWith('image')) {
                    const img = document.createElement('img');
                    img.src = `data:${item.type};base64,${await this.convertToBase64(item)}`;
                    contentDiv.appendChild(img);
                } else {
                    const p = document.createElement('p');
                    const anchor = document.createElement('a');
                    anchor.href = `data:${item.type};base64,${await this.convertToBase64(item)}`;
                    anchor.download = item.name;
                    anchor.textContent = item.name || 'file';
                    p.appendChild(anchor);
                    contentDiv.appendChild(p);
                }
            } else if(typeof item === 'string') {
                const p = document.createElement('p');
                p.textContent = item;
                contentDiv.appendChild(p);
            }
        }

        return contentDiv.innerHTML;
    }
}
