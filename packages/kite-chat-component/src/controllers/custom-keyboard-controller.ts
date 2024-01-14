import { ReactiveControllerHost } from 'lit';

export type KeyboardElement = HTMLElement & {
    open: boolean;
    show: () => void;
    hide: () => void;
    _toggleOpen: () => void;
}

export class CustomKeyboardController {
    private handleInputFocusBound: () => void;
    private handleInputBlurBound: () => void;
    private readonly disabledMode = "none";
    public defaultKeyboard = true;

    constructor(
        private host: ReactiveControllerHost & HTMLElement,
        private inputSelector = "textarea",
        private keyboardSelector = "kite-custom-keyboard",
        private defaultMode = "text",
    ) {
        this.host.addController(this);
    }

    get inputElement(): HTMLElement {
        return this.host.shadowRoot?.querySelector(this.inputSelector) as HTMLElement;
    }

    get keyboardElement(): KeyboardElement {
        return this.host.shadowRoot?.querySelector(this.keyboardSelector) as KeyboardElement;
    }

    get currentMode(): string {
        return this.defaultKeyboard ? this.defaultMode : this.disabledMode;
    }

    hostConnected() {
        this.handleInputFocusBound = this.handleInputFocus.bind(this);
        this.handleInputBlurBound = this.handleInputBlur.bind(this);
    }

    hostUpdate() {
        if(this.inputElement) {
            this.inputElement.removeEventListener('focus', this.handleInputFocusBound);
            this.inputElement.removeEventListener('blur', this.handleInputBlurBound);
        }
    }

    hostUpdated() {
        this.inputElement.setAttribute("inputmode", this.currentMode);
        this.inputElement.addEventListener('focus', this.handleInputFocusBound);
        this.inputElement.addEventListener('blur', this.handleInputBlurBound);
    }

    hostDisconnected() {
        return;
    }

    toggle() {
        this.setMode(!this.defaultKeyboard);
    }

    setMode(defaultKeyboard: boolean) {
        this.defaultKeyboard = defaultKeyboard;
        !this.defaultKeyboard
            ? this.keyboardElement.show() 
            : this.keyboardElement.hide();
        this.inputElement.setAttribute("inputmode", this.currentMode);
        this.host.requestUpdate();
    }

    private handleInputFocus() {
        !this.defaultKeyboard && this.keyboardElement.show();
    }

    private handleInputBlur() {
        !this.defaultKeyboard && this.keyboardElement.hide();
    }
}
