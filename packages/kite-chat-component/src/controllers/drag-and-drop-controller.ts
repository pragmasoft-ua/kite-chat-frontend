import { ReactiveControllerHost } from 'lit';

export class DragAngDropController {
    constructor(
        private host: ReactiveControllerHost & HTMLElement,
        private callback: (files: FileList) => void
    ) {
        this.host.addController(this);
    }

    hostConnected() {
        this.host.removeEventListener('drop', this.handleDrop.bind(this));
        this.host.removeEventListener('dragover', this.handleDragOver.bind(this));
    }

    hostUpdate() {
    }

    hostUpdated() {
        this.host.addEventListener('drop', this.handleDrop.bind(this));
        this.host.addEventListener('dragover', this.handleDragOver.bind(this));
    }

    hostDisconnected() {
        return;
    }

    private handleDragOver(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer && (event.dataTransfer.dropEffect = 'copy');
    }

    private handleDrop(event: DragEvent) {
        event.preventDefault();

        const files = event.dataTransfer?.files;

        if (files && files.length > 0) {
            this.callback(files);
        }
    }
}
