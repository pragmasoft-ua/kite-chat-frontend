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

export type ClipboardContent = {
    data: ClipboardData;
    htmlFormatter?: (rawData: ClipboardData) => Promise<string>;
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

    private async getHtmlData(data: ClipboardContent[]) {
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

    async copyToClipboard(content: ClipboardContent[]) {
        const getFileNames = (files: File[]) => files?.map((file) => file.name || 'file').join(',');

        const data = content.map(item => item.data);
        const textData = data.map(item => `${item.text} ${item.files && getFileNames(item.files)}`);
        const fileData = data.map(item => item.files).flat().filter(file => !!file) as File[];

        const plainText = textData.join('\n');

        navigator.clipboard.writeText(plainText); 

        if(!this.isWriteSupported) return;

        const clipboardData: Partial<Record<SupportedTypes, string | Blob>> = {
            [SupportedTypes.TEXT_PLAIN]: this.getTextData(plainText),
            [SupportedTypes.TEXT_HTML]: await this.getHtmlData(content),
        };

        const images = fileData.filter(file => this.isImage(file));
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

    private async loadImageAsync(img: HTMLImageElement): Promise<void> {
        return new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = (error) => reject(error);
        });
    }

    async fileToHtml(file: File): Promise<string> {
        if(file?.type.startsWith('image')) {
            const img = document.createElement('img');
            img.src = `data:${file.type};base64,${await this.convertToBase64(file)}`;

            await this.loadImageAsync(img);

            const aspectRatio = img.width / img.height;
            const desiredWidth = 300;
            const desiredHeight = Math.round(desiredWidth / aspectRatio);
            img.width = desiredWidth;
            img.height = desiredHeight;

            return img.outerHTML;
        } else {
            const anchor = document.createElement('a');
            anchor.href = `data:${file.type};base64,${await this.convertToBase64(file)}`;
            anchor.download = file.name;
            anchor.textContent = file.name || 'file';
            return anchor.outerHTML;
        }
    }

    private async defaultHtmlFormatter(data: ClipboardData): Promise<string> {
        const contentDiv = document.createElement('div');

        if(data.text) {
            const p = document.createElement('p');
            p.textContent = data.text;
            contentDiv.appendChild(p);
        }
        if(!data.files) return contentDiv.innerHTML;

        for(const file of data.files) {
            const p = document.createElement('p');
            p.innerHTML = await this.fileToHtml(file);
            contentDiv.appendChild(p);
        }
        return contentDiv.innerHTML;
    }

    private async constructHtmlContent(content: ClipboardContent[]) {
        const contentDiv = document.createElement('div');
    
        for(const item of content) {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = item.htmlFormatter
                ? await item.htmlFormatter(item.data) 
                : await this.defaultHtmlFormatter(item.data);
            contentDiv.appendChild(itemDiv);
        }

        return contentDiv.innerHTML;
    }
}
