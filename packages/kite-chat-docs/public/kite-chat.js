/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = window, et = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, it = Symbol(), nt = /* @__PURE__ */ new WeakMap();
let xt = class {
  constructor(t, e, o) {
    if (this._$cssResult$ = !0, o !== it)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (et && t === void 0) {
      const o = e !== void 0 && e.length === 1;
      o && (t = nt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), o && nt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const _ = (i) => new xt(typeof i == "string" ? i : i + "", void 0, it), X = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((o, r, s) => o + ((n) => {
    if (n._$cssResult$ === !0)
      return n.cssText;
    if (typeof n == "number")
      return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[s + 1], i[0]);
  return new xt(e, i, it);
}, Vt = (i, t) => {
  et ? i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet) : t.forEach((e) => {
    const o = document.createElement("style"), r = R.litNonce;
    r !== void 0 && o.setAttribute("nonce", r), o.textContent = e.cssText, i.appendChild(o);
  });
}, lt = et ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const o of t.cssRules)
    e += o.cssText;
  return _(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var O;
const z = window, at = z.trustedTypes, Lt = at ? at.emptyScript : "", dt = z.reactiveElementPolyfillSupport, D = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Lt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Zt = (i, t) => t !== i && (t == t || i == i), P = { attribute: !0, type: String, converter: D, reflect: !1, hasChanged: Zt };
let N = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this.u();
  }
  static addInitializer(t) {
    var e;
    this.finalize(), ((e = this.h) !== null && e !== void 0 ? e : this.h = []).push(t);
  }
  static get observedAttributes() {
    this.finalize();
    const t = [];
    return this.elementProperties.forEach((e, o) => {
      const r = this._$Ep(o, e);
      r !== void 0 && (this._$Ev.set(r, o), t.push(r));
    }), t;
  }
  static createProperty(t, e = P) {
    if (e.state && (e.attribute = !1), this.finalize(), this.elementProperties.set(t, e), !e.noAccessor && !this.prototype.hasOwnProperty(t)) {
      const o = typeof t == "symbol" ? Symbol() : "__" + t, r = this.getPropertyDescriptor(t, o, e);
      r !== void 0 && Object.defineProperty(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, o) {
    return { get() {
      return this[e];
    }, set(r) {
      const s = this[t];
      this[e] = r, this.requestUpdate(t, s, o);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || P;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return !1;
    this.finalized = !0;
    const t = Object.getPrototypeOf(this);
    if (t.finalize(), t.h !== void 0 && (this.h = [...t.h]), this.elementProperties = new Map(t.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const e = this.properties, o = [...Object.getOwnPropertyNames(e), ...Object.getOwnPropertySymbols(e)];
      for (const r of o)
        this.createProperty(r, e[r]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const o = new Set(t.flat(1 / 0).reverse());
      for (const r of o)
        e.unshift(lt(r));
    } else
      t !== void 0 && e.push(lt(t));
    return e;
  }
  static _$Ep(t, e) {
    const o = e.attribute;
    return o === !1 ? void 0 : typeof o == "string" ? o : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  u() {
    var t;
    this._$E_ = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (t = this.constructor.h) === null || t === void 0 || t.forEach((e) => e(this));
  }
  addController(t) {
    var e, o;
    ((e = this._$ES) !== null && e !== void 0 ? e : this._$ES = []).push(t), this.renderRoot !== void 0 && this.isConnected && ((o = t.hostConnected) === null || o === void 0 || o.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.splice(this._$ES.indexOf(t) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t, e) => {
      this.hasOwnProperty(e) && (this._$Ei.set(e, this[e]), delete this[e]);
    });
  }
  createRenderRoot() {
    var t;
    const e = (t = this.shadowRoot) !== null && t !== void 0 ? t : this.attachShadow(this.constructor.shadowRootOptions);
    return Vt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var t;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var o;
      return (o = e.hostConnected) === null || o === void 0 ? void 0 : o.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var o;
      return (o = e.hostDisconnected) === null || o === void 0 ? void 0 : o.call(e);
    });
  }
  attributeChangedCallback(t, e, o) {
    this._$AK(t, o);
  }
  _$EO(t, e, o = P) {
    var r;
    const s = this.constructor._$Ep(t, o);
    if (s !== void 0 && o.reflect === !0) {
      const n = (((r = o.converter) === null || r === void 0 ? void 0 : r.toAttribute) !== void 0 ? o.converter : D).toAttribute(e, o.type);
      this._$El = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$El = null;
    }
  }
  _$AK(t, e) {
    var o;
    const r = this.constructor, s = r._$Ev.get(t);
    if (s !== void 0 && this._$El !== s) {
      const n = r.getPropertyOptions(s), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((o = n.converter) === null || o === void 0 ? void 0 : o.fromAttribute) !== void 0 ? n.converter : D;
      this._$El = s, this[s] = a.fromAttribute(e, n.type), this._$El = null;
    }
  }
  requestUpdate(t, e, o) {
    let r = !0;
    t !== void 0 && (((o = o || this.constructor.getPropertyOptions(t)).hasChanged || Zt)(this[t], e) ? (this._$AL.has(t) || this._$AL.set(t, e), o.reflect === !0 && this._$El !== t && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t, o))) : r = !1), !this.isUpdatePending && r && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((r, s) => this[s] = r), this._$Ei = void 0);
    let e = !1;
    const o = this._$AL;
    try {
      e = this.shouldUpdate(o), e ? (this.willUpdate(o), (t = this._$ES) === null || t === void 0 || t.forEach((r) => {
        var s;
        return (s = r.hostUpdate) === null || s === void 0 ? void 0 : s.call(r);
      }), this.update(o)) : this._$Ek();
    } catch (r) {
      throw e = !1, this._$Ek(), r;
    }
    e && this._$AE(o);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach((o) => {
      var r;
      return (r = o.hostUpdated) === null || r === void 0 ? void 0 : r.call(o);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$EC !== void 0 && (this._$EC.forEach((e, o) => this._$EO(o, this[o], e)), this._$EC = void 0), this._$Ek();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
N.finalized = !0, N.elementProperties = /* @__PURE__ */ new Map(), N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, dt == null || dt({ ReactiveElement: N }), ((O = z.reactiveElementVersions) !== null && O !== void 0 ? O : z.reactiveElementVersions = []).push("1.6.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var F;
const Y = window, E = Y.trustedTypes, ct = E ? E.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, q = "$lit$", v = `lit$${(Math.random() + "").slice(9)}$`, St = "?" + v, Ct = `<${St}>`, G = document, L = () => G.createComment(""), C = (i) => i === null || typeof i != "object" && typeof i != "function", Gt = Array.isArray, _t = (i) => Gt(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", M = `[ 	
\f\r]`, W = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ht = /-->/g, pt = />/g, k = RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ut = /'/g, bt = /"/g, $t = /^(?:script|style|textarea|title)$/i, At = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), w = At(1), $ = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), mt = /* @__PURE__ */ new WeakMap(), x = G.createTreeWalker(G, 129, null, !1);
function It(i, t) {
  if (!Array.isArray(i) || !i.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return ct !== void 0 ? ct.createHTML(t) : t;
}
const Tt = (i, t) => {
  const e = i.length - 1, o = [];
  let r, s = t === 2 ? "<svg>" : "", n = W;
  for (let a = 0; a < e; a++) {
    const l = i[a];
    let d, c, h = -1, u = 0;
    for (; u < l.length && (n.lastIndex = u, c = n.exec(l), c !== null); )
      u = n.lastIndex, n === W ? c[1] === "!--" ? n = ht : c[1] !== void 0 ? n = pt : c[2] !== void 0 ? ($t.test(c[2]) && (r = RegExp("</" + c[2], "g")), n = k) : c[3] !== void 0 && (n = k) : n === k ? c[0] === ">" ? (n = r ?? W, h = -1) : c[1] === void 0 ? h = -2 : (h = n.lastIndex - c[2].length, d = c[1], n = c[3] === void 0 ? k : c[3] === '"' ? bt : ut) : n === bt || n === ut ? n = k : n === ht || n === pt ? n = W : (n = k, r = void 0);
    const m = n === k && i[a + 1].startsWith("/>") ? " " : "";
    s += n === W ? l + Ct : h >= 0 ? (o.push(d), l.slice(0, h) + q + l.slice(h) + v + m) : l + v + (h === -2 ? (o.push(void 0), a) : m);
  }
  return [It(i, s + (i[e] || "<?>") + (t === 2 ? "</svg>" : "")), o];
};
let tt = class Nt {
  constructor({ strings: t, _$litType$: e }, o) {
    let r;
    this.parts = [];
    let s = 0, n = 0;
    const a = t.length - 1, l = this.parts, [d, c] = Tt(t, e);
    if (this.el = Nt.createElement(d, o), x.currentNode = this.el.content, e === 2) {
      const h = this.el.content, u = h.firstChild;
      u.remove(), h.append(...u.childNodes);
    }
    for (; (r = x.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) {
          const h = [];
          for (const u of r.getAttributeNames())
            if (u.endsWith(q) || u.startsWith(v)) {
              const m = c[n++];
              if (h.push(u), m !== void 0) {
                const Wt = r.getAttribute(m.toLowerCase() + q).split(v), T = /([.?@])?(.*)/.exec(m);
                l.push({ type: 1, index: s, name: T[2], strings: Wt, ctor: T[1] === "." ? zt : T[1] === "?" ? Xt : T[1] === "@" ? Kt : K });
              } else
                l.push({ type: 6, index: s });
            }
          for (const u of h)
            r.removeAttribute(u);
        }
        if ($t.test(r.tagName)) {
          const h = r.textContent.split(v), u = h.length - 1;
          if (u > 0) {
            r.textContent = E ? E.emptyScript : "";
            for (let m = 0; m < u; m++)
              r.append(h[m], L()), x.nextNode(), l.push({ type: 2, index: ++s });
            r.append(h[u], L());
          }
        }
      } else if (r.nodeType === 8)
        if (r.data === St)
          l.push({ type: 2, index: s });
        else {
          let h = -1;
          for (; (h = r.data.indexOf(v, h + 1)) !== -1; )
            l.push({ type: 7, index: s }), h += v.length - 1;
        }
      s++;
    }
  }
  static createElement(t, e) {
    const o = G.createElement("template");
    return o.innerHTML = t, o;
  }
};
function U(i, t, e = i, o) {
  var r, s, n, a;
  if (t === $)
    return t;
  let l = o !== void 0 ? (r = e._$Co) === null || r === void 0 ? void 0 : r[o] : e._$Cl;
  const d = C(t) ? void 0 : t._$litDirective$;
  return (l == null ? void 0 : l.constructor) !== d && ((s = l == null ? void 0 : l._$AO) === null || s === void 0 || s.call(l, !1), d === void 0 ? l = void 0 : (l = new d(i), l._$AT(i, e, o)), o !== void 0 ? ((n = (a = e)._$Co) !== null && n !== void 0 ? n : a._$Co = [])[o] = l : e._$Cl = l), l !== void 0 && (t = U(i, l._$AS(i, t.values), l, o)), t;
}
let Rt = class {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    var e;
    const { el: { content: o }, parts: r } = this._$AD, s = ((e = t == null ? void 0 : t.creationScope) !== null && e !== void 0 ? e : G).importNode(o, !0);
    x.currentNode = s;
    let n = x.nextNode(), a = 0, l = 0, d = r[0];
    for (; d !== void 0; ) {
      if (a === d.index) {
        let c;
        d.type === 2 ? c = new ot(n, n.nextSibling, this, t) : d.type === 1 ? c = new d.ctor(n, d.name, d.strings, this, t) : d.type === 6 && (c = new Bt(n, this, t)), this._$AV.push(c), d = r[++l];
      }
      a !== (d == null ? void 0 : d.index) && (n = x.nextNode(), a++);
    }
    return x.currentNode = G, s;
  }
  v(t) {
    let e = 0;
    for (const o of this._$AV)
      o !== void 0 && (o.strings !== void 0 ? (o._$AI(t, o, e), e += o.strings.length - 2) : o._$AI(t[e])), e++;
  }
}, ot = class Et {
  constructor(t, e, o, r) {
    var s;
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = o, this.options = r, this._$Cp = (s = r == null ? void 0 : r.isConnected) === null || s === void 0 || s;
  }
  get _$AU() {
    var t, e;
    return (e = (t = this._$AM) === null || t === void 0 ? void 0 : t._$AU) !== null && e !== void 0 ? e : this._$Cp;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = U(this, t, e), C(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== $ && this._(t) : t._$litType$ !== void 0 ? this.g(t) : t.nodeType !== void 0 ? this.$(t) : _t(t) ? this.T(t) : this._(t);
  }
  k(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  $(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.k(t));
  }
  _(t) {
    this._$AH !== p && C(this._$AH) ? this._$AA.nextSibling.data = t : this.$(G.createTextNode(t)), this._$AH = t;
  }
  g(t) {
    var e;
    const { values: o, _$litType$: r } = t, s = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = tt.createElement(It(r.h, r.h[0]), this.options)), r);
    if (((e = this._$AH) === null || e === void 0 ? void 0 : e._$AD) === s)
      this._$AH.v(o);
    else {
      const n = new Rt(s, this), a = n.u(this.options);
      n.v(o), this.$(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = mt.get(t.strings);
    return e === void 0 && mt.set(t.strings, e = new tt(t)), e;
  }
  T(t) {
    Gt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let o, r = 0;
    for (const s of t)
      r === e.length ? e.push(o = new Et(this.k(L()), this.k(L()), this, this.options)) : o = e[r], o._$AI(s), r++;
    r < e.length && (this._$AR(o && o._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var o;
    for ((o = this._$AP) === null || o === void 0 || o.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const r = t.nextSibling;
      t.remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cp = t, (e = this._$AP) === null || e === void 0 || e.call(this, t));
  }
};
class K {
  constructor(t, e, o, r, s) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = s, o.length > 2 || o[0] !== "" || o[1] !== "" ? (this._$AH = Array(o.length - 1).fill(new String()), this.strings = o) : this._$AH = p;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t, e = this, o, r) {
    const s = this.strings;
    let n = !1;
    if (s === void 0)
      t = U(this, t, e, 0), n = !C(t) || t !== this._$AH && t !== $, n && (this._$AH = t);
    else {
      const a = t;
      let l, d;
      for (t = s[0], l = 0; l < s.length - 1; l++)
        d = U(this, a[o + l], e, l), d === $ && (d = this._$AH[l]), n || (n = !C(d) || d !== this._$AH[l]), d === p ? t = p : t !== p && (t += (d ?? "") + s[l + 1]), this._$AH[l] = d;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
let zt = class extends K {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
};
const Yt = E ? E.emptyScript : "";
let Xt = class extends K {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    t && t !== p ? this.element.setAttribute(this.name, Yt) : this.element.removeAttribute(this.name);
  }
}, Kt = class extends K {
  constructor(t, e, o, r, s) {
    super(t, e, o, r, s), this.type = 5;
  }
  _$AI(t, e = this) {
    var o;
    if ((t = (o = U(this, t, e, 0)) !== null && o !== void 0 ? o : p) === $)
      return;
    const r = this._$AH, s = t === p && r !== p || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== p && (r === p || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e, o;
    typeof this._$AH == "function" ? this._$AH.call((o = (e = this.options) === null || e === void 0 ? void 0 : e.host) !== null && o !== void 0 ? o : this.element, t) : this._$AH.handleEvent(t);
  }
}, Bt = class {
  constructor(t, e, o) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = o;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    U(this, t);
  }
};
const gt = Y.litHtmlPolyfillSupport;
gt == null || gt(tt, ot), ((F = Y.litHtmlVersions) !== null && F !== void 0 ? F : Y.litHtmlVersions = []).push("2.8.0");
const Ot = (i, t, e) => {
  var o, r;
  const s = (o = e == null ? void 0 : e.renderBefore) !== null && o !== void 0 ? o : t;
  let n = s._$litPart$;
  if (n === void 0) {
    const a = (r = e == null ? void 0 : e.renderBefore) !== null && r !== void 0 ? r : null;
    s._$litPart$ = n = new ot(t.insertBefore(L(), a), a, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var j, H;
class Z extends N {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t, e;
    const o = super.createRenderRoot();
    return (t = (e = this.renderOptions).renderBefore) !== null && t !== void 0 || (e.renderBefore = o.firstChild), o;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ot(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!1);
  }
  render() {
    return $;
  }
}
Z.finalized = !0, Z._$litElement$ = !0, (j = globalThis.litElementHydrateSupport) === null || j === void 0 || j.call(globalThis, { LitElement: Z });
const vt = globalThis.litElementPolyfillSupport;
vt == null || vt({ LitElement: Z });
((H = globalThis.litElementVersions) !== null && H !== void 0 ? H : globalThis.litElementVersions = []).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = (i) => (t) => typeof t == "function" ? ((e, o) => (customElements.define(e, o), o))(i, t) : ((e, o) => {
  const { kind: r, elements: s } = o;
  return { kind: r, elements: s, finisher(n) {
    customElements.define(e, n);
  } };
})(i, t);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pt = (i, t) => t.kind === "method" && t.descriptor && !("value" in t.descriptor) ? { ...t, finisher(e) {
  e.createProperty(t.key, i);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: t.key, initializer() {
  typeof t.initializer == "function" && (this[t.key] = t.initializer.call(this));
}, finisher(e) {
  e.createProperty(t.key, i);
} };
function f(i) {
  return (t, e) => e !== void 0 ? ((o, r, s) => {
    r.constructor.createProperty(s, o);
  })(i, t, e) : Pt(i, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ft(i) {
  return f({ ...i, state: !0 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Mt = ({ finisher: i, descriptor: t }) => (e, o) => {
  var r;
  if (o === void 0) {
    const s = (r = e.originalKey) !== null && r !== void 0 ? r : e.key, n = t != null ? { kind: "method", placement: "prototype", key: s, descriptor: t(e.key) } : { ...e, key: s };
    return i != null && (n.finisher = function(a) {
      i(a, s);
    }), n;
  }
  {
    const s = e.constructor;
    t !== void 0 && Object.defineProperty(e, o, t(o)), i == null || i(s, o);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function jt(i, t) {
  return Mt({ descriptor: (e) => {
    const o = { get() {
      var r, s;
      return (s = (r = this.renderRoot) === null || r === void 0 ? void 0 : r.querySelector(i)) !== null && s !== void 0 ? s : null;
    }, enumerable: !0, configurable: !0 };
    if (t) {
      const r = typeof e == "symbol" ? Symbol() : "__" + e;
      o.get = function() {
        var s, n;
        return this[r] === void 0 && (this[r] = (n = (s = this.renderRoot) === null || s === void 0 ? void 0 : s.querySelector(i)) !== null && n !== void 0 ? n : null), this[r];
      };
    }
    return o;
  } });
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var J;
((J = window.HTMLSlotElement) === null || J === void 0 ? void 0 : J.prototype.assignedElements) != null;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ht = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, Jt = (i) => (...t) => ({ _$litDirective$: i, values: t });
class Qt {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, o) {
    this._$Ct = t, this._$AM = e, this._$Ci = o;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wt = Jt(class extends Qt {
  constructor(i) {
    var t;
    if (super(i), i.type !== Ht.ATTRIBUTE || i.name !== "class" || ((t = i.strings) === null || t === void 0 ? void 0 : t.length) > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(i) {
    return " " + Object.keys(i).filter((t) => i[t]).join(" ") + " ";
  }
  update(i, [t]) {
    var e, o;
    if (this.it === void 0) {
      this.it = /* @__PURE__ */ new Set(), i.strings !== void 0 && (this.nt = new Set(i.strings.join(" ").split(/\s/).filter((s) => s !== "")));
      for (const s in t)
        t[s] && !(!((e = this.nt) === null || e === void 0) && e.has(s)) && this.it.add(s);
      return this.render(t);
    }
    const r = i.element.classList;
    this.it.forEach((s) => {
      s in t || (r.remove(s), this.it.delete(s));
    });
    for (const s in t) {
      const n = !!t[s];
      n === this.it.has(s) || !((o = this.nt) === null || o === void 0) && o.has(s) || (n ? (r.add(s), this.it.add(s)) : (r.remove(s), this.it.delete(s)));
    }
    return $;
  }
}), Dt = `*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.pointer-events-none{pointer-events:none}.static{position:static}.fixed{position:fixed}.bottom-20{bottom:5rem}.bottom-4{bottom:1rem}.right-4{right:1rem}.z-30{z-index:30}.z-40{z-index:40}.flex{display:flex}.hidden{display:none}.h-12{height:3rem}.h-6{height:1.5rem}.h-\\[30rem\\]{height:30rem}.max-h-24{max-height:6rem}.min-h-\\[1\\.5rem\\]{min-height:1.5rem}.min-h-min{min-height:min-content}.w-12{width:3rem}.w-6{width:1.5rem}.w-\\[20rem\\]{width:20rem}.flex-1{flex:1 1 0%}.origin-bottom{transform-origin:bottom}.scale-y-0{--tw-scale-y: 0;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.scale-y-100{--tw-scale-y: 1;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.select-none{-webkit-user-select:none;user-select:none}.resize-y{resize:vertical}.snap-y{scroll-snap-type:y var(--tw-scroll-snap-strictness)}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-col-reverse{flex-direction:column-reverse}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.overflow-y-auto{overflow-y:auto}.whitespace-nowrap{white-space:nowrap}.rounded{border-radius:.25rem}.rounded-full{border-radius:9999px}.rounded-b{border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-t{border-top-left-radius:.25rem;border-top-right-radius:.25rem}.border{border-width:1px}.border-none{border-style:none}.bg-primary-color{background-color:var(--kite-primary-color, rgb(0 128 192))}.bg-slate-300\\/50{background-color:#cbd5e180}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.bg-opacity-0{--tw-bg-opacity: 0}.p-2{padding:.5rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-2\\.5{padding-left:.625rem;padding-right:.625rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.leading-none{line-height:1}.text-secondary-color{color:var(--kite-secondary-color, rgb(255 255 255 / .95))}.caret-primary-color{caret-color:var(--kite-primary-color, rgb(0 128 192))}.opacity-100{opacity:1}.opacity-30{opacity:.3}.opacity-50{opacity:.5}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.outline-none{outline:2px solid transparent;outline-offset:2px}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.selection\\:bg-primary-color *::selection{background-color:var(--kite-primary-color, rgb(0 128 192))}.selection\\:text-white *::selection{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.selection\\:bg-primary-color::selection{background-color:var(--kite-primary-color, rgb(0 128 192))}.selection\\:text-white::selection{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.hover\\:bg-opacity-30:hover{--tw-bg-opacity: .3}.hover\\:text-opacity-80:hover{--tw-text-opacity: .8}.hover\\:opacity-100:hover{opacity:1}
`, qt = X`
  ${_(Dt)}
`, te = `textarea,main{scrollbar-width:thin}textarea::-webkit-scrollbar,main::-webkit-scrollbar{width:3px;height:3px}textarea::-webkit-scrollbar-track,main::-webkit-scrollbar-track{background:transparent}textarea::-webkit-scrollbar-thumb,main::-webkit-scrollbar-thumb{background-color:#737373}.kite-dialog>main{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%23aaa' fill-opacity='0.2' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E")}@media (max-width: 22rem){.kite-dialog{width:98vw;right:1vw}}@media (max-height: 35rem){.kite-dialog{height:98vh;width:98vw;max-width:30rem;right:1vmin;bottom:1vmin}}:host(:not([theme="dark"])){--kite-msg-bg: white;--kite-msg-border: white;--kite-msg-sent-bg: #d6d3d1;--kite-msg-sent-border: #d6d3d1}:host([theme="dark"]){--kite-msg-bg: #262626;--kite-msg-border: #292524;--kite-msg-sent-bg: #525252;--kite-msg-sent-border: #57534e}:host(:not([theme="dark"])) .kite-dialog{--tw-border-opacity: 1;border-color:rgb(229 229 229 / var(--tw-border-opacity));--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));--tw-text-opacity: 1;color:rgb(0 0 0 / var(--tw-text-opacity))}:host([theme="dark"]) .kite-dialog{--tw-border-opacity: 1;border-color:rgb(82 82 82 / var(--tw-border-opacity));--tw-bg-opacity: 1;background-color:rgb(38 38 38 / var(--tw-bg-opacity));color:#fffffff2}@media (prefers-color-scheme: dark){:host(:not([theme="light"])){--kite-msg-bg: #262626;--kite-msg-border: #292524;--kite-msg-sent-bg: #525252;--kite-msg-sent-border: #57534e}:host(:not([theme="light"])) .kite-dialog{--tw-border-opacity: 1;border-color:rgb(82 82 82 / var(--tw-border-opacity));--tw-bg-opacity: 1;background-color:rgb(38 38 38 / var(--tw-bg-opacity));color:#fffffff2}}
`, ee = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let ie = (i) => crypto.getRandomValues(new Uint8Array(i)), oe = (i, t, e) => {
  let o = (2 << Math.log(i.length - 1) / Math.LN2) - 1, r = -~(1.6 * o * t / i.length);
  return (s = t) => {
    let n = "";
    for (; ; ) {
      let a = e(r), l = r;
      for (; l--; )
        if (n += i[a[l] & o] || "", n.length === s)
          return n;
    }
  };
}, re = (i, t = 21) => oe(i, t, ie);
const se = ee.replace("-", ""), V = re(se, 10);
var I = /* @__PURE__ */ ((i) => (i[i.unknown = 0] = "unknown", i[i.sent = 1] = "sent", i[i.delivered = 2] = "delivered", i[i.read = 3] = "read", i))(I || {});
function Ut(i) {
  return i.text !== void 0;
}
function ne(i) {
  return i.file !== void 0;
}
var le = Object.defineProperty, ae = Object.getOwnPropertyDescriptor, A = (i, t, e, o) => {
  for (var r = o > 1 ? void 0 : o ? ae(t, e) : t, s = i.length - 1, n; s >= 0; s--)
    (n = i[s]) && (r = (o ? n(t, e, r) : n(r)) || r);
  return o && r && le(t, e, r), r;
};
console.debug("kite-chat loaded");
const de = X`
  ${_(te)}
`, Q = {
  bubbles: !0,
  composed: !0,
  cancelable: !0
};
let y = class extends Z {
  constructor() {
    super(...arguments), this.open = !1, this.heading = "🪁Kite chat", this.sendEnabled = !1;
  }
  render() {
    return w`
      <div class="kite">
        <div
          title="Show live chat dialog"
          class="kite-toggle bg-primary-color fixed right-4 bottom-4 z-30 h-12 w-12 cursor-pointer rounded-full p-2 text-secondary-color shadow hover:text-opacity-80"
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
          class="kite-dialog ${wt({
      "scale-y-100": this.open,
      "scale-y-0": !this.open
    })} selection:bg-primary-color fixed right-4 bottom-20 z-40 flex h-[30rem] w-[20rem] origin-bottom flex-col rounded border shadow-lg transition-transform selection:text-white"
        >
          <header
            class="bg-primary-color flex h-12 select-none flex-row items-center justify-between rounded-t p-2 text-secondary-color"
          >
            <h3 class="kite-title flex-1">${this.heading}</h3>
            <span
              data-close
              title="Close"
              class="cursor-pointer rounded-full bg-white bg-opacity-0 py-2 px-2.5 leading-none hover:bg-opacity-30"
              @click="${this._toggleOpen}"
              >✕</span
            >
          </header>
          <main
            class="flex flex-1 snap-y flex-col-reverse overflow-y-auto bg-slate-300/50 p-2"
          >
            <div class="flex min-h-min flex-col flex-wrap items-start">
              <slot></slot>
            </div>
          </main>
          <footer class="flex items-start gap-1 rounded-b p-2">
            <label>
              <input
                type="file"
                class="hidden"
                aria-hidden="true"
                multiple
                @change=${this._sendFile}
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
            <textarea
              required
              rows="1"
              autocomplete="on"
              spellcheck="true"
              wrap="soft"
              placeholder="Type a message"
              class="caret-primary-color max-h-24 min-h-[1.5rem] flex-1 resize-y border-none bg-transparent outline-none"
              @input=${this._handleEnabled}
              @keyup=${this._handleKeyUp}
            ></textarea>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="${wt({
      "opacity-50": this.sendEnabled,
      "hover:opacity-100": this.sendEnabled,
      "cursor-pointer": this.sendEnabled,
      "opacity-30": !this.sendEnabled,
      "pointer-events-none": !this.sendEnabled
    })} h-6 w-6"
              @click=${this._sendText}
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
    `;
  }
  _toggleOpen() {
    this.open ? this.hide() : this.show();
  }
  _sendText() {
    var i;
    if (((i = this.textarea.value) == null ? void 0 : i.length) > 0) {
      const t = {
        messageId: V(),
        timestamp: /* @__PURE__ */ new Date(),
        status: I.unknown,
        text: this.textarea.value
      };
      this._dispatchMsg(t) && (this.appendMsg(t), this.textarea.value = "", this.textarea.focus(), this._handleEnabled());
    }
  }
  _handleKeyUp(i) {
    i.key === "Enter" && i.ctrlKey && (i.preventDefault(), this._sendText());
  }
  _handleEnabled() {
    this.sendEnabled = this.textarea.value.length > 0;
  }
  _sendFile(i) {
    var t, e;
    const o = i.target, r = ((t = o.files) == null ? void 0 : t.length) ?? 0;
    for (let s = 0; s < r; s++) {
      const n = (e = o.files) == null ? void 0 : e.item(s);
      if (!n)
        continue;
      const a = {
        messageId: V(),
        timestamp: /* @__PURE__ */ new Date(),
        status: I.unknown,
        file: n
      };
      this._dispatchMsg(a) && this.appendMsg(a);
    }
  }
  _dispatchMsg(i) {
    const t = new CustomEvent("kite-chat.send", {
      ...Q,
      detail: i
    });
    return this.dispatchEvent(t), !t.defaultPrevented;
  }
  hide() {
    if (!this.open)
      return;
    const i = new CustomEvent("kite-chat.hide", Q);
    this.dispatchEvent(i), i.defaultPrevented || (this.open = !1);
  }
  show() {
    if (this.open)
      return;
    const i = new CustomEvent("kite-chat.show", Q);
    this.dispatchEvent(i), i.defaultPrevented || (this.open = !0, this.textarea.focus());
  }
  appendMsg(i) {
    const { messageId: t = V(), timestamp: e = /* @__PURE__ */ new Date(), status: o } = i, r = document.createElement("kite-msg");
    if (r.messageId = t, r.timestamp = e, r.status = o, Ut(i))
      r.innerText = i.text;
    else {
      const { file: s } = i, n = document.createElement("kite-file");
      n.file = s, r.appendChild(n);
    }
    this.appendChild(r), r.scrollIntoView(!1), this.show();
  }
};
y.styles = [qt, de];
A([
  f({ type: Boolean, reflect: !0 })
], y.prototype, "open", 2);
A([
  f()
], y.prototype, "heading", 2);
A([
  jt("textarea")
], y.prototype, "textarea", 2);
A([
  Ft()
], y.prototype, "sendEnabled", 2);
y = A([
  rt("kite-chat")
], y);
const ce = `:host{max-width:80%;position:relative;margin-top:.375rem;margin-bottom:.375rem;display:block;-webkit-user-select:text;user-select:text;scroll-snap-align:end;scroll-margin-top:.25rem;scroll-margin-bottom:.25rem;white-space:pre-line;overflow-wrap:break-word;border-radius:.25rem;padding:.25rem .5rem;text-align:left;--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}:host *::selection{background-color:var(--kite-primary-color, rgb(0 128 192));--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}:host::selection{background-color:var(--kite-primary-color, rgb(0 128 192));--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}:host(:not([status])){background:var(--kite-msg-bg, white)}:host([status]){background:var(--kite-msg-sent-bg, #d6d3d1);align-self:flex-end}:host:before{content:"";position:absolute;width:0;height:0;top:0;border:10px solid transparent}:host(:not([status])):before{left:-.375rem;border-top-color:var(--kite-msg-border, white)}:host([status]):before{right:-.375rem;border-top-color:var(--kite-msg-sent-border, #d6d3d1)}time{opacity:60%;font-size:.875rem;position:relative;margin:.25rem;float:right;bottom:-.375rem;right:-.5rem;-webkit-user-select:none;user-select:none}:host([status]) time{margin-right:1.5rem}span{text-decoration:none;position:absolute;bottom:0;right:.5em;letter-spacing:-.3em;-webkit-user-select:none;user-select:none;color:#737373}span.read:after,span.delivered:after{color:var(--kite-primary-color, rgb(0 128 192))}span.sent:after,span.delivered:after{content:"✓"}span.read:after{content:"✓✓"}span{--tw-text-opacity: 1;color:rgb(229 229 229 / var(--tw-text-opacity))}
`;
var he = Object.defineProperty, pe = Object.getOwnPropertyDescriptor, B = (i, t, e, o) => {
  for (var r = o > 1 ? void 0 : o ? pe(t, e) : t, s = i.length - 1, n; s >= 0; s--)
    (n = i[s]) && (r = (o ? n(t, e, r) : n(r)) || r);
  return o && r && he(t, e, r), r;
};
const ue = X`
  ${_(ce)}
`, be = new Intl.DateTimeFormat(
  navigator.languages,
  {
    hour: "2-digit",
    minute: "2-digit"
  }
);
let g = class extends Z {
  constructor() {
    super(...arguments), this.messageId = V(), this.timestamp = /* @__PURE__ */ new Date();
  }
  render() {
    return w` <slot></slot
      >${this._renderStatus()}${this._renderTimestamp()}`;
  }
  _renderStatus() {
    return this.status ? w`<span class="${I[this.status]}"></span>` : null;
  }
  _renderTimestamp() {
    return this.timestamp ? w`<time>${be.format(this.timestamp)}</time>` : null;
  }
};
g.TAG = "kite-msg";
g.styles = ue;
B([
  f({ reflect: !0 })
], g.prototype, "messageId", 2);
B([
  f({
    reflect: !0,
    converter: {
      toAttribute(i) {
        return i.toISOString();
      },
      fromAttribute(i) {
        return i ? new Date(i) : null;
      }
    }
  })
], g.prototype, "timestamp", 2);
B([
  f({
    reflect: !0,
    converter: {
      toAttribute(i) {
        return typeof i < "u" ? I[i] : void 0;
      },
      fromAttribute(i) {
        if (i)
          return I[i];
      }
    }
  })
], g.prototype, "status", 2);
g = B([
  rt(g.TAG)
], g);
const me = [
  "B",
  "kB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
], ge = [
  "B",
  "KiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB"
], ve = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit"
], we = [
  "b",
  "kibit",
  "Mibit",
  "Gibit",
  "Tibit",
  "Pibit",
  "Eibit",
  "Zibit",
  "Yibit"
], yt = (i, t, e) => {
  let o = i;
  return typeof t == "string" || Array.isArray(t) ? o = i.toLocaleString(t, e) : (t === !0 || e !== void 0) && (o = i.toLocaleString(void 0, e)), o;
};
function ye(i, t) {
  if (!Number.isFinite(i))
    throw new TypeError(`Expected a finite number, got ${typeof i}: ${i}`);
  t = {
    bits: !1,
    binary: !1,
    space: !0,
    ...t
  };
  const e = t.bits ? t.binary ? we : ve : t.binary ? ge : me, o = t.space ? " " : "";
  if (t.signed && i === 0)
    return ` 0${o}${e[0]}`;
  const r = i < 0, s = r ? "-" : t.signed ? "+" : "";
  r && (i = -i);
  let n;
  if (t.minimumFractionDigits !== void 0 && (n = { minimumFractionDigits: t.minimumFractionDigits }), t.maximumFractionDigits !== void 0 && (n = { maximumFractionDigits: t.maximumFractionDigits, ...n }), i < 1) {
    const c = yt(i, t.locale, n);
    return s + c + o + e[0];
  }
  const a = Math.min(Math.floor(t.binary ? Math.log(i) / Math.log(1024) : Math.log10(i) / 3), e.length - 1);
  i /= (t.binary ? 1024 : 1e3) ** a, n || (i = i.toPrecision(3));
  const l = yt(Number(i), t.locale, n), d = e[a];
  return s + l + o + d;
}
const fe = `img{max-width:98%;padding:1%}a{color:var(--kite-primary-color, rgb(0 128 192))}
`;
var ke = Object.defineProperty, xe = Object.getOwnPropertyDescriptor, st = (i, t, e, o) => {
  for (var r = o > 1 ? void 0 : o ? xe(t, e) : t, s = i.length - 1, n; s >= 0; s--)
    (n = i[s]) && (r = (o ? n(t, e, r) : n(r)) || r);
  return o && r && ke(t, e, r), r;
};
const Ze = X`
  ${_(fe)}
`, Se = (i) => {
  const [t, e, o, r] = i.split(/[:;,]+/);
  if (t !== "data" || o !== "base64")
    throw new Error("only data uri with base64 encoding is supported");
  const s = atob(r), n = new ArrayBuffer(s.length), a = new Uint8Array(n);
  for (let l = 0; l < s.length; l++)
    a[l] = s.charCodeAt(l);
  return new File([n], "", { type: e });
};
let S = class extends Z {
  constructor() {
    super(...arguments), this.name = "File";
  }
  render() {
    if (!this.file)
      return;
    const i = URL.createObjectURL(this.file), t = this.file.name || this.name;
    if (this.file.type.startsWith("image")) {
      const e = w`<img src="${i}" alt="${t}" />`;
      return w`<a href="${i}" download="${t}">${e}</a>`;
    } else {
      const e = w`<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1"
        stroke="currentColor"
        width="2em"
        height="2em"
      >
        <title>File</title>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
        />
      </svg>`;
      return w`<a href="${i}" download="${t}">${e}</a>
        ${t}
        <data
          class="whitespace-nowrap"
          value="${this.file.size}"
          aria-label="size"
          >(${ye(this.file.size)})</data
        >`;
    }
  }
};
S.TAG = "kite-file";
S.styles = Ze;
st([
  f({
    reflect: !1
  })
], S.prototype, "name", 2);
st([
  f({
    attribute: "src",
    reflect: !1,
    converter: {
      fromAttribute: (i) => i ? Se(i) : null
    }
  })
], S.prototype, "file", 2);
S = st([
  rt(S.TAG)
], S);
var b = /* @__PURE__ */ ((i) => (i.JOIN = "JOIN", i.OK = "OK", i.ERROR = "ERR", i.ACK = "ACK", i.PLAINTEXT = "TXT", i.FILE = "FILE", i.BIN = "BIN", i.UPLOAD = "UPL", i.CONNECTED = "TAB+", i.DISCONNECTED = "TAB-", i.ONLINE = "ONLINE", i.OFFLINE = "OFFLINE", i.PING = "PING", i.PONG = "PONG", i))(b || {});
const Ge = "data:application/javascript;base64,KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIGYoZSxuKXtpZighZSl0aHJvdyBuZXcgRXJyb3Iobil9Y2xhc3MgdyBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKG4sbyl7c3VwZXIobiksdGhpcy5zdGF0dXM9b319dmFyIHk9KGU9PihlW2UudW5rbm93bj0wXT0idW5rbm93biIsZVtlLnNlbnQ9MV09InNlbnQiLGVbZS5kZWxpdmVyZWQ9Ml09ImRlbGl2ZXJlZCIsZVtlLnJlYWQ9M109InJlYWQiLGUpKSh5fHx7fSksdD0oZT0+KGUuSk9JTj0iSk9JTiIsZS5PSz0iT0siLGUuRVJST1I9IkVSUiIsZS5BQ0s9IkFDSyIsZS5QTEFJTlRFWFQ9IlRYVCIsZS5GSUxFPSJGSUxFIixlLkJJTj0iQklOIixlLlVQTE9BRD0iVVBMIixlLkNPTk5FQ1RFRD0iVEFCKyIsZS5ESVNDT05ORUNURUQ9IlRBQi0iLGUuT05MSU5FPSJPTkxJTkUiLGUuT0ZGTElORT0iT0ZGTElORSIsZS5QSU5HPSJQSU5HIixlLlBPTkc9IlBPTkciLGUpKSh0fHx7fSk7Y29uc3QgdT1lPT5uPT5uLnJlZHVjZSgobyxpLGQpPT57Y29uc3QgYT1lW2RdLG09VVthXSx3ZT1tP20oaSk6aTtyZXR1cm4gb1thXT13ZSxvfSx7fSksST1lPT5uPT5lLnJlZHVjZSgobyxpKT0+e2NvbnN0IGQ9bltpXSxhPUdbaV0sbT1hP2EoZCk6ZDtyZXR1cm4gby5wdXNoKG0pLG99LFtdKSxVPXt0aW1lc3RhbXA6ZT0+bmV3IERhdGUoZSl9LEc9e3RpbWVzdGFtcDplPT5lLnRvSVNPU3RyaW5nKCksZW5kcG9pbnQ6ZT0+bmV3IFVSTChlKS5zZWFyY2hQYXJhbXMuZ2V0KCJjIil9LEs9WyJ0eXBlIiwibWVtYmVySWQiLCJtZW1iZXJOYW1lIiwiZW5kcG9pbnQiXSxXPVsidHlwZSIsIm1lc3NhZ2VJZCIsImRlc3RpYXRpb25NZXNzYWdlSWQiLCJ0aW1lc3RhbXAiXSxNPVsidHlwZSIsInJlYXNvbiIsImNvZGUiXSxoPVsidHlwZSIsIm1lc3NhZ2VJZCIsInRleHQiLCJ0aW1lc3RhbXAiXSxBPVsidHlwZSIsIm1lc3NhZ2VJZCIsInVybCIsImZpbGVOYW1lIiwiZmlsZVR5cGUiLCJmaWxlU2l6ZSIsInRpbWVzdGFtcCJdLHY9WyJ0eXBlIiwibWVzc2FnZUlkIiwiZmlsZU5hbWUiLCJmaWxlVHlwZSIsImZpbGVTaXplIiwidGltZXN0YW1wIl0sQj1bInR5cGUiLCJtZXNzYWdlSWQiLCJjYW5vbmljYWxVcmkiLCJ1cGxvYWRVcmkiXSxMPVsidHlwZSJdLHo9TCxKPUwseD17W3QuQUNLXTp1KFcpLFt0Lk9LXTp1KEopLFt0LkVSUk9SXTp1KE0pLFt0LlBMQUlOVEVYVF06dShoKSxbdC5VUExPQURdOnUoQiksW3QuQklOXTp1KEEpLFt0LlBPTkddOnUoeil9LFg9e1t0LkpPSU5dOkkoSyksW3QuUExBSU5URVhUXTpJKGgpLFt0LlVQTE9BRF06SSh2KSxbdC5CSU5dOkkoQSksW3QuUElOR106SShMKX0scT1lPT57Y29uc3Qgbj1KU09OLnBhcnNlKGUpO2lmKCFBcnJheS5pc0FycmF5KG4pKXRocm93IG5ldyBFcnJvcigiQmFkIG1lc3NhZ2UiKTtjb25zdCBvPW5bMF0saT14W29dO2lmKCFpKXRocm93IG5ldyBFcnJvcigiVW5zdXBwb3J0ZWQgZGVjb2RlciBmb3IgbWVzc2FnZSB0eXBlICIrbyk7cmV0dXJuIGkobil9LCQ9ZT0+e2NvbnN0IG49ZS50eXBlLG89WFtuXTtpZighbyl0aHJvdyBuZXcgRXJyb3IoIlVuc3VwcG9ydGVkIGVuY29kZXIgZm9yIG1lc3NhZ2UgdHlwZSAiK24pO2NvbnN0IGk9byhlKTtyZXR1cm4gSlNPTi5zdHJpbmdpZnkoaSl9LEg9ImsxdGUuY2hhdC52MSIsUT0xZTMsYz0iazF0ZSB3b3JrZXIiLFY9NjAqMWUzLEM9Mio2MCoxZTMsXz0zO2xldCBzLHI9bnVsbDtjb25zdCBnPW5ldyBBcnJheSxwPW5ldyBBcnJheSxFPW5ldyBTZXQ7bGV0IGI9bnVsbDtjb25zdCBsPShlLG4pPT57Zm9yKGNvbnN0IG8gb2YgRSlvIT09biYmby5wb3N0TWVzc2FnZShlKX0sVD1lPT5nLmZpbmRMYXN0KG49Pm4ubWVzc2FnZUlkPT09ZSk7bGV0IE89c2VsZi5uYXZpZ2F0b3Iub25MaW5lO2NvbnNvbGUubG9nKGMsImNyZWF0ZWQiLE8/Im9ubGluZSI6Im9mZmxpbmUiKTtsZXQgUz0wLFk9MCxSPTA7c2VsZi5vbmNvbm5lY3Q9aixzZWxmLm9ub2ZmbGluZT1uZSxzZWxmLm9ub25saW5lPWVlO2Z1bmN0aW9uIGooZSl7Y29uc3Qgbj1lLnBvcnRzWzBdO24ub25tZXNzYWdlPVosbi5vbm1lc3NhZ2VlcnJvcj1jb25zb2xlLmVycm9yLEUuYWRkKG4pLGNvbnNvbGUuZGVidWcoYywidGFiIGNvbm5lY3RlZCIsRS5zaXplKSxuLnBvc3RNZXNzYWdlKHt0eXBlOnQuQ09OTkVDVEVELG1lc3NhZ2VIaXN0b3J5Omd9KX1mdW5jdGlvbiBaKGUpe2NvbnN0IG49ZS50YXJnZXQsbz1lLmRhdGE7c3dpdGNoKGYoISFvLCJNaXNzaW5nIHBheWxvYWQiKSxjb25zb2xlLmRlYnVnKGMsInRhYiBtZXNzYWdlIixKU09OLnN0cmluZ2lmeShvKSksby50eXBlKXtjYXNlIHQuSk9JTjpzZShvKTticmVhaztjYXNlIHQuUExBSU5URVhUOm9lKG8sbik7YnJlYWs7Y2FzZSB0LkZJTEU6dGUobyxuKTticmVhaztjYXNlIHQuRElTQ09OTkVDVEVEOmNlKG4pO2JyZWFrfX1mdW5jdGlvbiBlZSgpe2lmKGNvbnNvbGUubG9nKGMsIndlbnQgb25saW5lIiksTz0hMCxFLnNpemU9PT0wKXtjb25zb2xlLmxvZyhjLCJubyB0YWJzIG9wZW4iKTtyZXR1cm59cC5sZW5ndGg+MD8oY29uc29sZS5sb2coYywib3V0Z29pbmcgcXVldWUgaGFzIG1lc3NhZ2VzLCB0cmlnZ2VyIHdzIHJlY29ubmVjdGlvbiIpLE4oKSk6ciE9bnVsbCYmci5lYWdlcmx5Q29ubmVjdCYmKGNvbnNvbGUubG9nKGMsImVhZ2VybHlDb25uZWN0IGlzIHRydWUsIHRyaWdnZXIgd3MgcmVjb25uZWN0aW9uIiksTigpKX1mdW5jdGlvbiBuZSgpe2NvbnNvbGUubG9nKGMsIndlbnQgb2ZmbGluZSIpLE89ITEsKHM9PW51bGw/dm9pZCAwOnMucmVhZHlTdGF0ZSk9PT0ocz09bnVsbD92b2lkIDA6cy5PUEVOKSYmKGNvbnNvbGUud2FybigidW5leHBlY3RlZCBzdGF0ZSwgd3MgaXMgb3BlbiB3aGlsZSBvZmZsaW5lLCBjbG9zaW5nIGl0Iikscz09bnVsbHx8cy5jbG9zZSgpKSxzPW51bGx9ZnVuY3Rpb24gb2UoZSxuKXtnLnB1c2goZSksbChlLG4pLEQoZSl9ZnVuY3Rpb24gdGUoZSxuKXtnLnB1c2goZSksbChlLG4pO2NvbnN0IG89e3R5cGU6dC5VUExPQUQsbWVzc2FnZUlkOmUubWVzc2FnZUlkLGZpbGVOYW1lOmUuZmlsZS5uYW1lLGZpbGVUeXBlOmUuZmlsZS50eXBlLGZpbGVTaXplOmUuZmlsZS5zaXplLHRpbWVzdGFtcDplLnRpbWVzdGFtcH07RChvKX1mdW5jdGlvbiBzZShlKXtyPXI/P2Usci5lYWdlcmx5Q29ubmVjdD1yLmVhZ2VybHlDb25uZWN0Pz9lLmVhZ2VybHlDb25uZWN0LGYoci5lbmRwb2ludD09PWUuZW5kcG9pbnQsIkNhbm5vdCB1c2UgZGlmZmVyZW50IGNoYXQgZW5kcG9pbnRzIGZvciB0aGUgc2FtZSBkb21haW4iKSwhcyYmci5lYWdlcmx5Q29ubmVjdCYmTigpfWZ1bmN0aW9uIGNlKGUpe2UuY2xvc2UoKSxFLmRlbGV0ZShlKTtjb25zdCBuPUUuc2l6ZTtjb25zb2xlLmRlYnVnKGMsYG9uVGFiRGlzY29ubmVjdGVkIHJlbWFpbmVkICR7bn0gdGFic2ApLG49PT0wJiZGKCl9ZnVuY3Rpb24gRihlPSJhbGwgYWN0aXZlIHRhYnMgY2xvc2VkIil7cz09bnVsbHx8cy5jbG9zZShRLGUpfWZ1bmN0aW9uIE4oKXtjb25zb2xlLmxvZyhjLCJ3cyBjb25uZWN0aW5nLi4iLFkrKyksZighIXIsIk1pc3Npbmcgd2Vic29ja2V0IGNvbm5lY3Rpb24gY29uZmlndXJhdGlvbiIpO2NvbnN0IGU9ci5lbmRwb2ludDtzPW5ldyBXZWJTb2NrZXQoZSxIKSxzLm9ubWVzc2FnZT1pZSxzLm9ub3Blbj1yZSxzLm9uY2xvc2U9YWUscy5vbmVycm9yPWxlfWZ1bmN0aW9uIGllKGUpe2NvbnN0IG49ZS5kYXRhO2NvbnNvbGUuZGVidWcoYywid3MgcmVjZWl2ZWQiLG4pO2NvbnN0IG89cShuKTtzd2l0Y2goby50eXBlKXtjYXNlIHQuUExBSU5URVhUOmZlKG8pO2JyZWFrO2Nhc2UgdC5CSU46dWUobyk7YnJlYWs7Y2FzZSB0LlVQTE9BRDpFZShvKTticmVhaztjYXNlIHQuQUNLOmdlKG8pO2JyZWFrO2Nhc2UgdC5PSzpkZSgpO2JyZWFrO2Nhc2UgdC5FUlJPUjpOZShvKTticmVhaztjYXNlIHQuUE9ORzptZSgpO2JyZWFrfX1mdW5jdGlvbiByZSgpe2NvbnNvbGUuZGVidWcoYywid3MgY29ubmVjdGVkIiksUz1EYXRlLm5vdygpLGYoISFyLCJubyBwZW5kaW5nIGpvaW5DaGFubmVsIG1lc3NhZ2UiKSxQKHIpLFI9RGF0ZS5ub3coKSxiPXNldEludGVydmFsKEllLEMpfWZ1bmN0aW9uIGFlKGUpe2ImJihjbGVhckludGVydmFsKGIpLGI9bnVsbCk7Y29uc3Qgbj1TP0RhdGUubm93KCktUzowO2lmKGNvbnNvbGUuZGVidWcoYyxgd3MgZGlzY29ubmVjdGVkLCBzZXNzaW9uIGR1cmF0aW9uICR7TWF0aC5yb3VuZChuKjYwLzFlMyl9IG1pbnV0ZXNgLGUpLGwoe3R5cGU6dC5PRkZMSU5FLHNlc3Npb25EdXJhdGlvbk1zOm59KSwhTyl7Y29uc29sZS53YXJuKGMsIm9mZmxpbmUsIGRvIG5vdCByZWNvbm5lY3QiKSxzPW51bGw7cmV0dXJufWlmKEUuc2l6ZT09PTApe2NvbnNvbGUud2FybihjLCJubyBvcGVuIHRhYnMsIGRvIG5vdCByZWNvbm5lY3QiKSxzPW51bGw7cmV0dXJufWNvbnN0IG89Vi1uO28+MD8oY29uc29sZS5kZWJ1ZyhjLCJzY2hlZHVsZSByZWNvbm5lY3QiLG8pLHNldFRpbWVvdXQoTixvKSk6TigpfWZ1bmN0aW9uIGxlKGUpe2NvbnNvbGUuZGVidWcoYywib25Xc0Vycm9yIixlKX1mdW5jdGlvbiBkZSgpe2NvbnNvbGUuZGVidWcoYywid3Mgam9pbmVkIiksaygpLGwoe3R5cGU6dC5PTkxJTkV9KX1mdW5jdGlvbiBmZShlKXtnLnB1c2goZSksbChlKX1hc3luYyBmdW5jdGlvbiB1ZShlKXt0cnl7Y29uc3Qgbj1hd2FpdCBwZShlLnVybCksbz17Li4uZSx0eXBlOnQuRklMRSxmaWxlOm59O2cucHVzaChvKSxsKG8pfWNhdGNoKG4pe24gaW5zdGFuY2VvZiB3P2woe3R5cGU6dC5FUlJPUixyZWFzb246bi5tZXNzYWdlLGNvZGU6bi5zdGF0dXN9KTpjb25zb2xlLmVycm9yKG4pfX1hc3luYyBmdW5jdGlvbiBFZShlKXt0cnl7Y29uc3R7Y2Fub25pY2FsVXJpOm4sdXBsb2FkVXJpOm8sbWVzc2FnZUlkOml9PWUsZD1UKGkpLGE9ZD09bnVsbD92b2lkIDA6ZC5maWxlO2YoISFhLGBObyBmaWxlIGluICR7aX1gKSxhd2FpdCBPZShvPz9uLGEpO2NvbnN0IG09e3R5cGU6dC5CSU4sbWVzc2FnZUlkOmksdXJsOm4sZmlsZU5hbWU6YS5uYW1lLGZpbGVTaXplOmEuc2l6ZSxmaWxlVHlwZTphLnR5cGUsdGltZXN0YW1wOmQudGltZXN0YW1wfTtEKG0pfWNhdGNoKG4pe24gaW5zdGFuY2VvZiB3P2woe3R5cGU6dC5FUlJPUixyZWFzb246bi5tZXNzYWdlLGNvZGU6bi5zdGF0dXN9KTpuIGluc3RhbmNlb2YgRXJyb3I/bCh7dHlwZTp0LkVSUk9SLHJlYXNvbjpuLm1lc3NhZ2UsY29kZTowfSk6Y29uc29sZS5lcnJvcihuKX19ZnVuY3Rpb24gZ2UoZSl7Y29uc3Qgbj1UKGUubWVzc2FnZUlkKTtuPyhuLm1lc3NhZ2VJZD1lLmRlc3RpYXRpb25NZXNzYWdlSWQsbi5zdGF0dXM9eS5kZWxpdmVyZWQpOmNvbnNvbGUud2FybihjLCJVbmV4cGVjdGVkIEFjayIsZS5tZXNzYWdlSWQpLGwoZSl9ZnVuY3Rpb24gTmUoZSl7Y29uc29sZS5lcnJvcihjLGUuY29kZSxlLnJlYXNvbil9ZnVuY3Rpb24gbWUoKXtjb25zb2xlLmRlYnVnKCJwb25nIiksUj1EYXRlLm5vdygpfWZ1bmN0aW9uIFAoZSl7ZighIXMsIk5vIFdlYnNvY2tldCBjb25uZWN0aW9uIiksZihzLnJlYWR5U3RhdGU9PT1zLk9QRU4sIldlYnNvY2tldCBpcyBub3QgcmVhZHkiKSxjb25zb2xlLmRlYnVnKGMsIndzIHNlbmQiLGUpO2NvbnN0IG49JChlKTtzLnNlbmQobil9ZnVuY3Rpb24gaygpe2xldCBlPXAubGVuZ3RoO2lmKCEoZTw9MCkpZm9yKGNvbnNvbGUuZGVidWcoYywiZmx1c2ggcXVldWUiLGUpO2UtLSA+MDspe2NvbnN0IG49cFswXTtQKG4pLHAuc2hpZnQoKX19ZnVuY3Rpb24gRChlKXtwLnB1c2goZSkscz9zLnJlYWR5U3RhdGU9PT1zLk9QRU4mJmsoKTpPJiZOKCl9ZnVuY3Rpb24gSWUoKXtEYXRlLm5vdygpLVI+QypfJiZGKGBtaXNzZWQgJHtffSBwb25ncywgcmVjb25uZWN0YCksUCh7dHlwZTp0LlBJTkd9KX1hc3luYyBmdW5jdGlvbiBwZShlKXtjb25zdCBuPWF3YWl0IGZldGNoKGUpO2lmKG4ub2spe2NvbnN0IG89YXdhaXQgbi5ibG9iKCksaT1uZXcgVVJMKGUpLnBhdGhuYW1lO3JldHVybiBuZXcgRmlsZShbb10saSx7bGFzdE1vZGlmaWVkOkRhdGUubm93KCksdHlwZTpvLnR5cGV9KX1lbHNlIHRocm93IG5ldyB3KGF3YWl0IG4udGV4dCgpLG4uc3RhdHVzKX1hc3luYyBmdW5jdGlvbiBPZShlLG4pe2NvbnN0IG89YXdhaXQgZmV0Y2goZSx7bWV0aG9kOiJQVVQiLGhlYWRlcnM6eyJDb250ZW50LVR5cGUiOm4udHlwZX0sYm9keTpufSk7aWYoIW8ub2spdGhyb3cgbmV3IHcoYXdhaXQgby50ZXh0KCksby5zdGF0dXMpfX0pKCk7Cg==";
function ft(i, t) {
  if (!i)
    throw new Error(t);
}
const $e = {
  eagerlyConnect: !1,
  createIfMissing: !0,
  open: !1
}, kt = "KITE_USER_ID";
class Ce {
  constructor(t) {
    this.opts = Object.assign({}, $e, t), this.opts.userId || (this.opts.userId = this.persistentRandomId()), console.debug("new KiteChat", JSON.stringify(this.opts)), console.debug("origin", location.origin), console.debug("meta.url.origin", new URL(import.meta.url).origin), this.element = this.findOrCreateElement(
      this.opts.createIfMissing
    ), this.connect();
  }
  connect() {
    console.debug("connect");
    const t = this.onWorkerMessage.bind(this), e = new SharedWorker(Ge), o = new URL(this.opts.endpoint);
    ft(
      o.protocol.toLocaleLowerCase().startsWith("ws"),
      "ws and wss protocols are only supported for the endpoint url"
    ), ft(
      o.searchParams.has("c"),
      "enpoint url should have c=<channel name> required query parameter"
    ), e.port.onmessage = t, e.port.onmessageerror = this.onDeliveryError.bind(this), e.addEventListener("error", this.onWorkerError.bind(this)), e.port.start();
    const r = {
      type: b.JOIN,
      endpoint: this.opts.endpoint,
      // DOMException: URL object could not be cloned
      memberId: this.opts.userId,
      memberName: this.opts.userName,
      eagerlyConnect: this.opts.eagerlyConnect
    };
    e.port.postMessage(r), this.kiteWorker = e;
  }
  disconnect() {
    this.kiteWorker && (console.debug("disconnect"), this.kiteWorker && this.kiteWorker.port.postMessage({
      type: b.DISCONNECTED
    }), this.kiteWorker.port.close(), this.kiteWorker = null);
  }
  persistentRandomId() {
    let t = localStorage.getItem(kt);
    return t || (t = V(), localStorage.setItem(kt, t)), t;
  }
  onOutgoingMessage(t) {
    const { detail: e } = t;
    let o = null;
    if (Ut(e))
      o = {
        ...e,
        type: b.PLAINTEXT
      };
    else if (ne(e))
      o = {
        ...e,
        type: b.FILE
      };
    else
      throw new Error("Unexpected payload type " + JSON.stringify(e));
    if (!this.kiteWorker)
      throw new Error("Not connected");
    console.debug("outgoing", o), this.kiteWorker.port.postMessage(o);
  }
  onElementShow() {
    console.debug("onElementShow");
  }
  findOrCreateElement(t) {
    let e = document.querySelector("kite-chat");
    if (!e) {
      if (!t)
        return null;
      e = new y(), e.open = this.opts.open, document.body.appendChild(e);
    }
    return e.addEventListener(
      "kite-chat.send",
      this.onOutgoingMessage.bind(this)
    ), e.addEventListener("kite-chat.show", this.onElementShow.bind(this)), e;
  }
  onWorkerMessage(t) {
    const e = t.data;
    if (console.debug("onWorkerMessage", JSON.stringify(e)), !e)
      throw new Error("no payload in incoming message");
    switch (e.type) {
      case b.CONNECTED:
        this.onConnected(e);
        break;
      case b.PLAINTEXT:
      case b.FILE:
        this.onContentMessage(e);
        break;
      case b.ACK:
        this.onMessageAck(e);
        break;
      case b.ERROR:
        this.onErrorMessage(e);
        break;
      case b.ONLINE:
      case b.OFFLINE:
        this.log(e);
        break;
    }
  }
  onContentMessage(t) {
    var e;
    console.debug("onContentMessage", t.messageId, t.timestamp), (e = this.element) == null || e.appendMsg(t);
  }
  onConnected(t) {
    console.debug("connected", t);
    const { messageHistory: e } = t;
    if (this.element)
      for (const o of e)
        this.element.appendMsg(o);
  }
  onMessageAck(t) {
    console.debug("onMessageAck", t);
    const e = document.querySelector(
      `${g.TAG}[messageId="${t.messageId}"]`
    );
    e && (e.messageId = t.destiationMessageId, e.status = I.delivered);
  }
  onErrorMessage(t) {
    console.error(t.code, t.reason);
  }
  onDeliveryError(t) {
    console.error("Cannot deliver message ", t);
  }
  onWorkerError(t) {
    throw this.kiteWorker = null, new Error(
      `Worker initialization error '${t.message}': ${t.filename}(${t.lineno}:${t.colno}). ${t.error}`
    );
  }
  /**
   * TODO replace with UI change
   * @deprecated temporary, replace with UI change
   * @param msg
   */
  log(t) {
    console.log(JSON.stringify(t));
  }
}
export {
  Ce as KiteChat,
  y as KiteChatElement,
  S as KiteFileElement,
  g as KiteMsgElement,
  I as MsgStatus,
  ne as isFileMsg,
  Ut as isPlaintextMsg,
  ye as prettyBytes,
  V as randomStringId
};
