import {TemplateResult, LitElement, html} from 'lit';
import {query} from 'lit/decorators.js';

/**
 * Type definition of a constructor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T> = new (...args: any[]) => T;

export declare class FileInputInterface {
    fileInput: HTMLInputElement;
    _fileInputCallback(file: File): void;
    _renderFileInput(): TemplateResult<1>;
}

export const FileInputMixin = <T extends Constructor<LitElement>>(
    superClass: T
) => {
    class FileInputElement extends superClass {
        static styles = [
            ...[(superClass as unknown as typeof LitElement).styles ?? []]
        ]

        /**
         * Constructor that simply delegates to the super's constructor
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...params: any) {
            super();
        }

        @query('input[type="file"]')
        fileInput!: HTMLInputElement;

        private _onFileInput(event: Event) {
            const target = event.target as HTMLInputElement;
            const numFiles = target.files?.length ?? 0;
            for (let i = 0; i < numFiles; i++) {
                const file = target.files?.item(i);
                if (!file) continue;
                this._fileInputCallback(file);
            }
        }

        _fileInputCallback(file: File) {
            return;
        }

        _renderFileInput() {
            return html`
                <label>
                    <input
                        type="file"
                        class="hidden"
                        aria-hidden="true"
                        multiple
                        @change=${this._onFileInput}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-6 w-6 cursor-pointer opacity-50 hover:opacity-100"
                    >
                        <title>Attach file</title>
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
                        />
                    </svg>
                </label>
            `;
        }
    }

    return FileInputElement as Constructor<FileInputInterface> & T;
}