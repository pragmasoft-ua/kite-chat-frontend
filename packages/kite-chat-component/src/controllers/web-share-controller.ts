import { ReactiveControllerHost } from 'lit';

export type WebShareData = {
    text: string;
    files?: File[];
}

// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#shareable_file_types
const allowedTypes = {
    'application/pdf': ['.pdf'],
    'audio/flac': ['.flac'],
    'audio/x-m4a': ['.m4a'],
    'audio/mpeg': ['.mp3', '.mpeg', '.mpg'],
    'audio/ogg': ['.oga', '.ogg', '.opus'],
    'audio/wav': ['.wav'],
    'audio/webm': ['.weba'],
    'image/avif': ['.avif'],
    'image/bmp': ['.bmp'],
    'image/gif': ['.gif'],
    'image/x-icon': ['.ico'],
    'image/jpeg': ['.jfif', '.jpeg', '.jpg', '.pjp', '.pjpeg'],
    'image/png': ['.png'],
    'image/svg+xml': ['.svg', '.svgz'],
    'image/tiff': ['.tif', '.tiff'],
    'image/webp': ['.webp'],
    'image/x-xbitmap': ['.xbm'],
    'text/css': ['.css'],
    'text/csv': ['.csv'],
    'text/html': ['.ehtml', '.htm', '.html', '.shtm', '.shtml'],
    'text/plain': ['.text', '.txt'],
    'video/mp4': ['.m4v', '.mp4'],
    'video/mpeg': ['.mpeg', '.mpg'],
    'video/ogg': ['.ogm', '.ogv'],
    'video/webm': ['.webm'],
};

export class WebShareController {
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

    isSupportedType(file: File): boolean {
        const extensions = allowedTypes[file.type as keyof typeof allowedTypes];
        if (!extensions || extensions.length === 0) {
            // Not supported
            return false;
        }

        const fileName = file.name.toLowerCase();
        return extensions.some(ext => fileName.endsWith(ext));
    }

    isSupported() {
        return !!navigator.canShare && !!navigator.share;
    }

    isSupportedFiles(files: File[]) {
        if (!this.isSupported() || files.some(file => !this.isSupportedType(file))) return false;
        return navigator.canShare({ files });
    }

    async share(title: string, data: WebShareData) {
        const shareData: ShareData = {
            title, 
            ...data,
        };
        return await navigator.share(shareData);
    }
}
