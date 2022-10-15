function t(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}(()=>{var e,o;function r(t){return t&&t.__esModule?t.default:t}let i;var s;function n(t,e,o,r){var i,s=arguments.length,n=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,o,r);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(n=(s<3?i(n):s>3?i(e,o,n):i(e,o))||n);return s>3&&n&&Object.defineProperty(e,o,n),n}(s=i||(i={}))[s.CONNECTED=0]="CONNECTED",s[s.DISCONNECTED=1]="DISCONNECTED",s[s.ERROR=2]="ERROR",s[s.PLAINTEXT=3]="PLAINTEXT",Object.create,Object.create;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const a=window,l=a.ShadowRoot&&(void 0===a.ShadyCSS||a.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,c=Symbol(),h=new WeakMap;class d{get styleSheet(){let t=this.o;const e=this.t;if(l&&void 0===t){const o=void 0!==e&&1===e.length;o&&(t=h.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&h.set(e,t))}return t}toString(){return this.cssText}constructor(t,e,o){if(this._$cssResult$=!0,o!==c)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}}const p=t=>new d("string"==typeof t?t:t+"",void 0,c),u=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,o,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[r+1]),t[0]);return new d(o,t,c)},m=l?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return p(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var v;const g=window,f=g.trustedTypes,b=f?f.emptyScript:"",w=g.reactiveElementPolyfillSupport,y={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=null!==t;break;case Number:o=null===t?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch(t){o=null}}return o}},$=(t,e)=>e!==t&&(e==e||t==t),x={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$};class _ extends HTMLElement{static addInitializer(t){var e;null!==(e=this.h)&&void 0!==e||(this.h=[]),this.h.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,o)=>{const r=this._$Ep(o,e);void 0!==r&&(this._$Ev.set(r,o),t.push(r))})),t}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const o="symbol"==typeof t?Symbol():"__"+t,r=this.getPropertyDescriptor(t,o,e);void 0!==r&&Object.defineProperty(this.prototype,t,r)}}static getPropertyDescriptor(t,e,o){return{get(){return this[e]},set(r){const i=this[t];this[e]=r,this.requestUpdate(t,i,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||x}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const o of e)this.createProperty(o,t[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const t of o)e.unshift(m(t))}else void 0!==t&&e.push(m(t));return e}static _$Ep(t,e){const o=e.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,o;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(o=t.hostConnected)||void 0===o||o.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{l?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const o=document.createElement("style"),r=a.litNonce;void 0!==r&&o.setAttribute("nonce",r),o.textContent=e.cssText,t.appendChild(o)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$EO(t,e,o=x){var r;const i=this.constructor._$Ep(t,o);if(void 0!==i&&!0===o.reflect){const s=(void 0!==(null===(r=o.converter)||void 0===r?void 0:r.toAttribute)?o.converter:y).toAttribute(e,o.type);this._$El=t,null==s?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(t,e){var o;const r=this.constructor,i=r._$Ev.get(t);if(void 0!==i&&this._$El!==i){const t=r.getPropertyOptions(i),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(o=t.converter)||void 0===o?void 0:o.fromAttribute)?t.converter:y;this._$El=i,this[i]=s.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,o){let r=!0;void 0!==t&&(((o=o||this.constructor.getPropertyOptions(t)).hasChanged||$)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===o.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,o))):r=!1),!this.isUpdatePending&&r&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const o=this._$AL;try{e=this.shouldUpdate(o),e?(this.willUpdate(o),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(o)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(o)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var E;_.finalized=!0,_.elementProperties=new Map,_.elementStyles=[],_.shadowRootOptions={mode:"open"},null==w||w({ReactiveElement:_}),(null!==(v=g.reactiveElementVersions)&&void 0!==v?v:g.reactiveElementVersions=[]).push("1.4.1");const A=window,k=A.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,C=`lit$${(Math.random()+"").slice(9)}$`,N="?"+C,O=`<${N}>`,T=document,I=(t="")=>T.createComment(t),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,U=/>/g,H=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),D=/'/g,j=/"/g,L=/^(?:script|style|textarea|title)$/i,B=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),V=B(1),X=(B(2),Symbol.for("lit-noChange")),q=Symbol.for("lit-nothing"),W=new WeakMap,K=T.createTreeWalker(T,129,null,!1);class Y{static createElement(t,e){const o=T.createElement("template");return o.innerHTML=t,o}constructor({strings:t,_$litType$:e},o){let r;this.parts=[];let i=0,s=0;const n=t.length-1,a=this.parts,[l,c]=((t,e)=>{const o=t.length-1,r=[];let i,s=2===e?"<svg>":"",n=R;for(let e=0;e<o;e++){const o=t[e];let a,l,c=-1,h=0;for(;h<o.length&&(n.lastIndex=h,l=n.exec(o),null!==l);)h=n.lastIndex,n===R?"!--"===l[1]?n=M:void 0!==l[1]?n=U:void 0!==l[2]?(L.test(l[2])&&(i=RegExp("</"+l[2],"g")),n=H):void 0!==l[3]&&(n=H):n===H?">"===l[0]?(n=null!=i?i:R,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?H:'"'===l[3]?j:D):n===j||n===D?n=H:n===M||n===U?n=R:(n=H,i=void 0);const d=n===H&&t[e+1].startsWith("/>")?" ":"";s+=n===R?o+O:c>=0?(r.push(a),o.slice(0,c)+"$lit$"+o.slice(c)+C+d):o+C+(-2===c?(r.push(void 0),e):d)}const a=s+(t[o]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==S?S.createHTML(a):a,r]})(t,e);if(this.el=Y.createElement(l,o),K.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(r=K.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes()){const t=[];for(const e of r.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(C)){const o=c[s++];if(t.push(e),void 0!==o){const t=r.getAttribute(o.toLowerCase()+"$lit$").split(C),e=/([.?@])?(.*)/.exec(o);a.push({type:1,index:i,name:e[2],strings:t,ctor:"."===e[1]?Q:"?"===e[1]?et:"@"===e[1]?ot:G})}else a.push({type:6,index:i})}for(const e of t)r.removeAttribute(e)}if(L.test(r.tagName)){const t=r.textContent.split(C),e=t.length-1;if(e>0){r.textContent=k?k.emptyScript:"";for(let o=0;o<e;o++)r.append(t[o],I()),K.nextNode(),a.push({type:2,index:++i});r.append(t[e],I())}}}else if(8===r.nodeType)if(r.data===N)a.push({type:2,index:i});else{let t=-1;for(;-1!==(t=r.data.indexOf(C,t+1));)a.push({type:7,index:i}),t+=C.length-1}i++}}}function F(t,e,o=t,r){var i,s,n,a;if(e===X)return e;let l=void 0!==r?null===(i=o._$Co)||void 0===i?void 0:i[r]:o._$Cl;const c=P(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(s=null==l?void 0:l._$AO)||void 0===s||s.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,o,r)),void 0!==r?(null!==(n=(a=o)._$Co)&&void 0!==n?n:a._$Co=[])[r]=l:o._$Cl=l),void 0!==l&&(e=F(t,l._$AS(t,e.values),l,r)),e}class J{get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var e;const{el:{content:o},parts:r}=this._$AD,i=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:T).importNode(o,!0);K.currentNode=i;let s=K.nextNode(),n=0,a=0,l=r[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new Z(s,s.nextSibling,this,t):1===l.type?e=new l.ctor(s,l.name,l.strings,this,t):6===l.type&&(e=new rt(s,this,t)),this.u.push(e),l=r[++a]}n!==(null==l?void 0:l.index)&&(s=K.nextNode(),n++)}return i}p(t){let e=0;for(const o of this.u)void 0!==o&&(void 0!==o.strings?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}constructor(t,e){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=e}}class Z{get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=F(this,t,e),P(t)?t===q||null==t||""===t?(this._$AH!==q&&this._$AR(),this._$AH=q):t!==this._$AH&&t!==X&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this.g(t)}O(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}g(t){this._$AH!==q&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){var e;const{values:o,_$litType$:r}=t,i="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=Y.createElement(r.h,this.options)),r);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===i)this._$AH.p(o);else{const t=new J(i,this),e=t.v(this.options);t.p(o),this.T(e),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new Y(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,r=0;for(const i of t)r===e.length?e.push(o=new Z(this.O(I()),this.O(I()),this,this.options)):o=e[r],o._$AI(i),r++;r<e.length&&(this._$AR(o&&o._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var o;for(null===(o=this._$AP)||void 0===o||o.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cm=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}constructor(t,e,o,r){var i;this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=r,this._$Cm=null===(i=null==r?void 0:r.isConnected)||void 0===i||i}}class G{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,o,r){const i=this.strings;let s=!1;if(void 0===i)t=F(this,t,e,0),s=!P(t)||t!==this._$AH&&t!==X,s&&(this._$AH=t);else{const r=t;let n,a;for(t=i[0],n=0;n<i.length-1;n++)a=F(this,r[o+n],e,n),a===X&&(a=this._$AH[n]),s||(s=!P(a)||a!==this._$AH[n]),a===q?t=q:t!==q&&(t+=(null!=a?a:"")+i[n+1]),this._$AH[n]=a}s&&!r&&this.j(t)}j(t){t===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}constructor(t,e,o,r,i){this.type=1,this._$AH=q,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=i,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=q}}class Q extends G{j(t){this.element[this.name]=t===q?void 0:t}constructor(){super(...arguments),this.type=3}}const tt=k?k.emptyScript:"";class et extends G{j(t){t&&t!==q?this.element.setAttribute(this.name,tt):this.element.removeAttribute(this.name)}constructor(){super(...arguments),this.type=4}}class ot extends G{_$AI(t,e=this){var o;if((t=null!==(o=F(this,t,e,0))&&void 0!==o?o:q)===X)return;const r=this._$AH,i=t===q&&r!==q||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==q&&(r===q||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,o;"function"==typeof this._$AH?this._$AH.call(null!==(o=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==o?o:this.element,t):this._$AH.handleEvent(t)}constructor(t,e,o,r,i){super(t,e,o,r,i),this.type=5}}class rt{get _$AU(){return this._$AM._$AU}_$AI(t){F(this,t)}constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}}const it=A.litHtmlPolyfillSupport;null==it||it(Y,Z),(null!==(E=A.litHtmlVersions)&&void 0!==E?E:A.litHtmlVersions=[]).push("2.4.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var st,nt;class at extends _{createRenderRoot(){var t,e;const o=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=o.firstChild),o}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,o)=>{var r,i;const s=null!==(r=null==o?void 0:o.renderBefore)&&void 0!==r?r:e;let n=s._$litPart$;if(void 0===n){const t=null!==(i=null==o?void 0:o.renderBefore)&&void 0!==i?i:null;s._$litPart$=n=new Z(e.insertBefore(I(),t),t,void 0,null!=o?o:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return X}constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}}at.finalized=!0,at._$litElement$=!0,null===(st=globalThis.litElementHydrateSupport)||void 0===st||st.call(globalThis,{LitElement:at});const lt=globalThis.litElementPolyfillSupport;null==lt||lt({LitElement:at}),(null!==(nt=globalThis.litElementVersions)&&void 0!==nt?nt:globalThis.litElementVersions=[]).push("3.2.2");
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:o,elements:r}=e;return{kind:o,elements:r,finisher(e){customElements.define(t,e)}}})(t,e),ht=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(o){o.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(o){o.createProperty(e.key,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;function dt(t){return(e,o)=>void 0!==o?((t,e,o)=>{e.constructor.createProperty(o,t)})(t,e,o):ht(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function pt(t,e){return(({finisher:t,descriptor:e})=>(o,r)=>{var i;if(void 0===r){const r=null!==(i=o.originalKey)&&void 0!==i?i:o.key,s=null!=e?{kind:"method",placement:"prototype",key:r,descriptor:e(o.key)}:{...o,key:r};return null!=t&&(s.finisher=function(e){t(e,r)}),s}{const i=o.constructor;void 0!==e&&Object.defineProperty(o,r,e(r)),null==t||t(i,r)}})({descriptor:o=>{const r={get(){var e,o;return null!==(o=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==o?o:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof o?Symbol():"__"+o;r.get=function(){var o,r;return void 0===this[e]&&(this[e]=null!==(r=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(t))&&void 0!==r?r:null),this[e]}}return r}})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ut;null===(ut=window.HTMLSlotElement)||void 0===ut||ut.prototype.assignedElements;const mt=u`
  ${p(r('*,:before,:after{box-sizing:border-box;border:0 solid #e5e7eb}:before,:after{--tw-content:""}html{-webkit-text-size-adjust:100%;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}body{line-height:inherit;margin:0}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:#0000;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{margin:0;padding:0;list-style:none}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}*,:before,:after,::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#3b82f680;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.pointer-events-none{pointer-events:none}.static{position:static}.fixed{position:fixed}.right-4{right:1rem}.bottom-4{bottom:1rem}.bottom-20{bottom:5rem}.z-30{z-index:30}.z-40{z-index:40}.flex{display:flex}.h-12{height:3rem}.h-\\[30rem\\]{height:30rem}.h-6{height:1.5rem}.max-h-24{max-height:6rem}.min-h-\\[1\\.5rem\\]{min-height:1.5rem}.w-12{width:3rem}.w-\\[20rem\\]{width:20rem}.w-6{width:1.5rem}.flex-1{flex:1}.origin-bottom{transform-origin:bottom}.scale-y-100{--tw-scale-y:1;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y))}.scale-y-0{--tw-scale-y:0;transform:translate(var(--tw-translate-x),var(--tw-translate-y))rotate(var(--tw-rotate))skewX(var(--tw-skew-x))skewY(var(--tw-skew-y))scaleX(var(--tw-scale-x))scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.select-none{-webkit-user-select:none;user-select:none}.resize-y{resize:vertical}.snap-y{scroll-snap-type:y var(--tw-scroll-snap-strictness)}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.overflow-y-auto{overflow-y:auto}.rounded-full{border-radius:9999px}.rounded{border-radius:.25rem}.rounded-t{border-top-left-radius:.25rem;border-top-right-radius:.25rem}.rounded-b{border-bottom-left-radius:.25rem;border-bottom-right-radius:.25rem}.border{border-width:1px}.border-none{border-style:none}.border-neutral-200{--tw-border-opacity:1;border-color:rgb(229 229 229/var(--tw-border-opacity))}.bg-primary-color{background-color:var(--humane-primary-color,#2563eb)}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.bg-slate-300\\/50{background-color:#cbd5e180}.bg-transparent{background-color:#0000}.bg-opacity-0{--tw-bg-opacity:0}.p-2{padding:.5rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.px-2\\.5{padding-left:.625rem;padding-right:.625rem}.px-2{padding-left:.5rem;padding-right:.5rem}.leading-none{line-height:1}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.text-black{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity))}.text-white\\/95{color:#fffffff2}.caret-primary-color{caret-color:var(--humane-primary-color,#2563eb)}.opacity-50{opacity:.5}.opacity-100{opacity:1}.opacity-30{opacity:.3}.shadow{--tw-shadow:0 1px 3px 0 #0000001a,0 1px 2px -1px #0000001a;--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px #0000001a,0 4px 6px -4px #0000001a;--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-none{outline-offset:2px;outline:2px solid #0000}.transition-transform{transition-property:transform;transition-duration:.15s;transition-timing-function:cubic-bezier(.4,0,.2,1)}.selection\\:bg-primary-color ::selection{background-color:var(--humane-primary-color,#2563eb)}.selection\\:text-white ::selection{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.selection\\:bg-primary-color::selection{background-color:var(--humane-primary-color,#2563eb)}.selection\\:text-white::selection{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:bg-opacity-30:hover{--tw-bg-opacity:.3}.hover\\:text-opacity-80:hover{--tw-text-opacity:.8}.hover\\:opacity-100:hover{opacity:1}@media (prefers-color-scheme:dark){.dark\\:border-neutral-600{--tw-border-opacity:1;border-color:rgb(82 82 82/var(--tw-border-opacity))}.dark\\:bg-neutral-800{--tw-bg-opacity:1;background-color:rgb(38 38 38/var(--tw-bg-opacity))}.dark\\:text-white\\/95{color:#fffffff2}}'))}
`,vt=1;class gt{get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}constructor(t){}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ft=(bt=class extends gt{render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){var o,r;if(void 0===this.nt){this.nt=new Set,void 0!==t.strings&&(this.st=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!(null===(o=this.st)||void 0===o?void 0:o.has(t))&&this.nt.add(t);return this.render(e)}const i=t.element.classList;this.nt.forEach((t=>{t in e||(i.remove(t),this.nt.delete(t))}));for(const t in e){const o=!!e[t];o===this.nt.has(t)||(null===(r=this.st)||void 0===r?void 0:r.has(t))||(o?(i.add(t),this.nt.add(t)):(i.remove(t),this.nt.delete(t)))}return X}constructor(t){var e;if(super(t),t.type!==vt||"class"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}},(...t)=>({_$litDirective$:bt,values:t}));var bt;const wt=(t=10)=>((t=21)=>{let e="",o=t;for(;o--;)e+="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict"[64*Math.random()|0];return e})(t);let yt;var $t;($t=yt||(yt={}))[$t.unknown=0]="unknown",$t[$t.sent=1]="sent",$t[$t.delivered=2]="delivered",$t[$t.read=3]="read",console.debug("humane-chat loaded");const xt=u`
  ${p(r("textarea{scrollbar-width:thin}textarea::-webkit-scrollbar{width:3px;height:3px}textarea::-webkit-scrollbar-track{background:0 0}textarea::-webkit-scrollbar-thumb{background-color:#737373/50;border:#0000;border-radius:3px}.humane-dialog>main{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%23aaa' fill-opacity='0.2' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E\")}@media (max-width:22rem){.humane-dialog{width:98vw;right:1vw}}@media (max-height:35rem){.humane-dialog{height:98vh;width:98vw;max-width:30rem;bottom:1vmin;right:1vmin}}"))}
`;let _t=(e=class extends at{render(){return V`
      <div class="humane">
        <div
          title="Show live chat dialog"
          class="humane-toggle fixed right-4 bottom-4 z-30 h-12 w-12 cursor-pointer rounded-full bg-primary-color p-2 text-white shadow hover:text-opacity-80"
          @click="${this._toggleOpen}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
        </div>
        <div
          class="humane-dialog ${ft({"scale-y-100":this.open,"scale-y-0":!this.open})} fixed right-4 bottom-20 z-40 flex h-[30rem] w-[20rem] origin-bottom flex-col rounded border border-neutral-200 bg-white text-black shadow-lg transition-transform selection:bg-primary-color selection:text-white dark:border-neutral-600 dark:bg-neutral-800 dark:text-white/95"
        >
          <header
            class="flex h-12 select-none flex-row items-center justify-between rounded-t bg-primary-color p-2 text-white/95"
          >
            <h3 class="humane-title flex-1">${this.title||"👩🏻/humane"}</h3>
            <span
              data-close
              title="Close"
              class="cursor-pointer rounded-full bg-white bg-opacity-0 py-2 px-2.5 leading-none hover:bg-opacity-30"
              @click="${this._toggleOpen}"
              >✕</span
            >
          </header>
          <main class="flex-1 snap-y overflow-y-auto bg-slate-300/50 p-2">
            <slot></slot>
          </main>
          <footer class="flex items-start gap-1 rounded-b p-2">
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

            <textarea
              required
              rows="1"
              autocomplete="on"
              spellcheck="true"
              wrap="soft"
              placeholder="Type a message"
              class="max-h-24 min-h-[1.5rem] flex-1 resize-y border-none bg-transparent caret-primary-color outline-none"
              @input=${this._handleEnabled}
              @keyup=${this._handleKeyUp}
            ></textarea>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="${ft({"opacity-50":this.sendEnabled,"hover:opacity-100":this.sendEnabled,"cursor-pointer":this.sendEnabled,"opacity-30":!this.sendEnabled,"pointer-events-none":!this.sendEnabled})} h-6 w-6"
              @click=${this._send}
            >
              <title>Send (Ctrl+↩)</title>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </footer>
        </div>
      </div>
    `}_toggleOpen(){if(this.open){const t=new CustomEvent("humane-chat.hide",{bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(t),t.defaultPrevented||this.hide()}else{const t=new CustomEvent("humane-chat.show",{bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(t),t.defaultPrevented||this.show()}}_send(){if(this.textarea.value?.length>0){const t=this.textarea.value,e=yt.unknown,o=new Date,r=wt(),i=new CustomEvent("humane-chat.send",{bubbles:!0,composed:!0,cancelable:!0,detail:{chatId:this.chatId,userId:this.userId,msgId:r,status:e,timestamp:o,payload:t}});if(this.dispatchEvent(i),i.defaultPrevented)return;this.insertAdjacentHTML("beforeend",`<humane-msg status="${e}" msgId="${r}" timestamp="${o}">${t}</humane-msg>`),this.lastElementChild?.scrollIntoView(),this.textarea.value="",this.textarea.focus(),this._handleEnabled()}}_handleKeyUp(t){"Enter"===t.key&&t.ctrlKey&&(t.preventDefault(),this._send())}_handleEnabled(){this.sendEnabled=this.textarea.value.length>0}hide(){this.open=!1}show(){this.open=!0,this.textarea.focus()}incoming(t,e=wt(),o=(new Date).toISOString()){this.insertAdjacentHTML("beforeend",`<humane-msg msgId="${e}" timestamp="${o}">${t}</humane-msg>`),this.show(),this.lastElementChild?.scrollIntoView()}constructor(...t){super(...t),this.userId=`humane-user-${wt()}`,this.chatId=`humane-chat-${wt()}`,this.open=!1,this.sendEnabled=!1}},t(e,"styles",[mt,xt]),e);n([dt({reflect:!0})],_t.prototype,"userId",void 0),n([dt({reflect:!0})],_t.prototype,"chatId",void 0),n([dt({type:Boolean,reflect:!0})],_t.prototype,"open",void 0),n([pt("textarea")],_t.prototype,"textarea",void 0),n([pt("main")],_t.prototype,"main",void 0),n([dt({state:!0})],_t.prototype,"sendEnabled",void 0),_t=n([ct("humane-chat")],_t),console.debug("humane-msg loaded");const Et=u`
  ${p(r(':host{max-width:80%;clear:both;scroll-snap-align:end;white-space:pre-line;text-align:left;--tw-shadow:0 1px 3px 0 #0000001a,0 1px 2px -1px #0000001a;--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);border-radius:.25rem;margin-top:.375rem;margin-bottom:.375rem;padding:.25rem .5rem;scroll-margin-top:.25rem;scroll-margin-bottom:.25rem;display:block;position:relative}:host ::selection,:host::selection{background-color:var(--humane-primary-color,#2563eb);--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}:host(:not([status])){float:left;background:#fff}:host([status]){float:right;background:#e7e5e4}:host:before{content:"";width:0;height:0;border:10px solid #0000;position:absolute;top:0}:host(:not([status])):before{border-top-color:#fff;left:-.375rem}:host([status]):before{border-top-color:#e7e5e4;right:-.375rem}time{opacity:.6;float:right;margin:.25rem;font-size:.875rem;position:relative;bottom:-.375rem;right:-.5rem}:host([status]) time{margin-right:1.5rem}s{letter-spacing:-.125rem;font-size:.5rem;text-decoration:none;position:absolute;bottom:0;right:.5rem}s.read:after{content:"✓✓";color:#3b82f6}s.delivered:after{content:"✓✓";color:#737373}s.sent:after{content:"✓";color:#737373}@media (prefers-color-scheme:dark){:host(:not([status])){background:#262626}:host([status]){background:#57534e}:host(:not([status])):before{border-top-color:#262626}:host([status]):before{border-top-color:#57534e}s{color:#e5e5e5}}'))}
`,At=new Intl.DateTimeFormat(navigator.languages,{hour:"2-digit",minute:"2-digit"});let kt=(o=class extends at{render(){return V` <slot></slot
      >${this._renderStatus()}${this._renderTimestamp()}`}_renderStatus(){return this.status?V`<s class="${this.status}"></s>`:null}_renderTimestamp(){return this.timestamp?V`<time>${this.timestamp}</time>`:null}constructor(...t){super(...t),this.msgId=wt(),this.timestamp=At.format(new Date)}},t(o,"styles",Et),o);n([dt({reflect:!0})],kt.prototype,"msgId",void 0),n([dt({converter(t){const e=new Date;if(t){const o=Date.parse(t);if(isNaN(o))return t;e.setTime(o)}return At.format(e)}})],kt.prototype,"timestamp",void 0),n([dt({reflect:!0})],kt.prototype,"status",void 0),kt=n([ct("humane-msg")],kt);const St=wt();var Ct;console.debug("Install sharedWorker"),Ct=URL.createObjectURL(new Blob(['(()=>{let e;var o;(o=e||(e={}))[o.CONNECTED=0]="CONNECTED",o[o.DISCONNECTED=1]="DISCONNECTED",o[o.ERROR=2]="ERROR",o[o.PLAINTEXT=3]="PLAINTEXT",console.log("loaded","/api/chat/frontend");const s=new Map;function n(e){s.delete(e)}self.onconnect=o=>{console.log("onconnect");const t=o.ports[0];t.onmessage=o=>{const c=o.data;if(!c)throw new Error("no payload");switch(console.debug("onmessage",JSON.stringify(c)),c.type){case e.PLAINTEXT:!function(e){s.forEach(((o,s)=>{if(s!=e.userId)try{o.postMessage(e)}catch(e){console.error(e),n(s)}}))}(c);break;case e.CONNECTED:!function(o,n){s.set(o,n),n.postMessage({type:e.CONNECTED,userId:o})}(c.userId,t);break;case e.DISCONNECTED:n(c.userId)}}}})();']));const Nt=new SharedWorker(Ct,{name:"👩🏻/humane chat worker"});Nt.port.onmessage=t=>{const e=t.data;if(!e)throw new Error("no payload");switch(e.type){case i.PLAINTEXT:r=e,console.log("Incoming",r.payload,r.msgId,r.timestamp.toISOString());break;case i.CONNECTED:o=e,console.log("Connected",o.userId);break;case i.ERROR:!function(t){console.error(t.code,t.reason)}(e)}var o,r},addEventListener("beforeunload",(()=>Nt.port.postMessage({type:i.DISCONNECTED,userId:St}))),Nt.port.start(),Nt.port.postMessage({type:i.CONNECTED,userId:St})})();const e=t=>{const e=document.querySelector(t);if(!e)throw new Error(`Element '${t}' is missing`);return e},o=e("humane-chat"),r=e("textarea"),i=e("#send"),s=e("#open"),n=e("#close"),a=e("#colorpicker"),l=e("section#outgoing"),c=document.documentElement;document.addEventListener("humane-chat.send",(t=>{const e=t.detail;l.insertAdjacentHTML("beforeend",`<p>${e.timestamp.toISOString()}: ${e.payload}</p>`)})),i.addEventListener("click",(()=>o.incoming(r.value))),s.addEventListener("click",(()=>o.show())),n.addEventListener("click",(()=>o.hide())),a.addEventListener("input",(t=>{const e=t.target.value;c.style.setProperty("--humane-primary-color",e)}));
//# sourceMappingURL=index.9675d65e.js.map
