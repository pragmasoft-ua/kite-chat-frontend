import {ReactiveControllerHost, TemplateResult, html} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import type MarkdownIt from 'markdown-it';
import type HighlightJS from 'highlight.js';
import {markdownV2} from '../utils';

type MarkdownItType = typeof MarkdownIt;
type HighlightJSType = typeof HighlightJS;

const MARKDOWNIT_CDN = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/+esm';
const HIGHLIGHTJS_CDN = 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/+esm';

export class MdParserController {
    private mdParser: MarkdownIt|null = null;

    constructor(
        private host: ReactiveControllerHost & HTMLElement,
    ) {
        this.host.addController(this);
    }

    hostConnected() {
        this.loadModules();
    }

    hostDisconnected() {
        this.mdParser = null;
    }

    private async loadModules() {
        const {default: MarkdownIt}: {default: MarkdownItType} = await import(/* @vite-ignore */MARKDOWNIT_CDN);
        const {default: hljs}: {default: HighlightJSType} = await import(/* @vite-ignore */HIGHLIGHTJS_CDN);
        
        const md = MarkdownIt({
            html: false,
            linkify: true,
            typographer: false,
            breaks: true,
            highlight: function (str, language) {
                if (language && hljs.getLanguage(language)) {
                    try {
                        return hljs.highlight(str, {language}).value;
                    } catch (__) {
                        return '';
                    }
                }
            
                try {
                    return hljs.highlightAuto(str).value;
                } catch (__) {
                    return '';
                }
            },
        });
        
        md.use(markdownV2);
        
        this.mdParser = md;
        
        this.host.requestUpdate();
    }

    render(string: string): TemplateResult | null {
        if (!this.mdParser) return null;
    
        return  html`${unsafeHTML(this.mdParser.render(string))}`;
    }
}
