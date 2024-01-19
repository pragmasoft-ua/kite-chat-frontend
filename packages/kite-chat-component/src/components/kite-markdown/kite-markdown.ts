import {LitElement, html, css, unsafeCSS} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {customElement, property} from 'lit/decorators.js';
import type MarkdownIt from 'markdown-it';
import type HighlightJS from 'highlight.js';
import {markdownV2} from '../../utils';

import kiteMarkdownStyles from './kite-markdown.css?inline';

const componentStyles = css`
  ${unsafeCSS(kiteMarkdownStyles)}
`;

type MarkdownItType = typeof MarkdownIt;
type HighlightJSType = typeof HighlightJS;

const MARKDOWNIT_CDN = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/+esm';
const HIGHLIGHTJS_CDN = 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/+esm';
const STYLES_LIGHT_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/a11y-light.min.css';
const STYLES_DARK_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/a11y-dark.min.css';

@customElement('kite-markdown')
export class KiteMarkdownElement extends LitElement {
  @property({type: String}) theme?: 'light' | 'dark';

  private get stylesURL() {
    const prefersLightMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return (this.theme === 'light' || this.theme === 'dark') 
      ? this.theme === 'light' ? STYLES_LIGHT_CDN : STYLES_DARK_CDN
      : prefersLightMode ? STYLES_LIGHT_CDN : STYLES_DARK_CDN;
  }

  constructor() {
    super();
    this.loadModules();
  }

  private mdParser?: MarkdownIt;

  private async loadModules() {
    const {default: MarkdownIt}: {default: MarkdownItType} = await import(/* @vite-ignore */MARKDOWNIT_CDN);
    const {default: hljs}: {default: HighlightJSType} = await import(/* @vite-ignore */HIGHLIGHTJS_CDN);
    
    const md = MarkdownIt({
      html: false,
      linkify: false,
      typographer: false,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
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
    
    this.requestUpdate();
  }

  override render() {
    return html`
      <link rel="stylesheet" href=${this.stylesURL}/>
      <slot .hidden=${!!this.mdParser} @slotchange=${this.handleSlotChange}></slot>${unsafeHTML(this.parseMarkdown())}
    `;
  }

  private parseMarkdown(): string | null {
    if (!this.mdParser) return null;

    const slot = this.shadowRoot?.querySelector('slot');
    const nodes = slot?.assignedNodes() ?? [];

    const markdownText = nodes
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.nodeValue)
      .join('');

    return this.mdParser.render(markdownText);
  }

  private handleSlotChange() {
    this.requestUpdate();
  }


  static override styles = componentStyles;
}