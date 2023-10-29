/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = window, et = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, it = Symbol(), st = /* @__PURE__ */ new WeakMap();
let bt = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== it)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (et && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = st.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && st.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const O = (i) => new bt(typeof i == "string" ? i : i + "", void 0, it), L = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((r, o, s) => r + ((n) => {
    if (n._$cssResult$ === !0)
      return n.cssText;
    if (typeof n == "number")
      return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + i[s + 1], i[0]);
  return new bt(e, i, it);
}, Et = (i, t) => {
  et ? i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet) : t.forEach((e) => {
    const r = document.createElement("style"), o = I.litNonce;
    o !== void 0 && r.setAttribute("nonce", o), r.textContent = e.cssText, i.appendChild(r);
  });
}, nt = et ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules)
    e += r.cssText;
  return O(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var K;
const j = window, at = j.trustedTypes, St = at ? at.emptyScript : "", lt = j.reactiveElementPolyfillSupport, Q = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? St : null;
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
} }, yt = (i, t) => t !== i && (t == t || i == i), Y = { attribute: !0, type: String, converter: Q, reflect: !1, hasChanged: yt };
let E = class extends HTMLElement {
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
    return this.elementProperties.forEach((e, r) => {
      const o = this._$Ep(r, e);
      o !== void 0 && (this._$Ev.set(o, r), t.push(o));
    }), t;
  }
  static createProperty(t, e = Y) {
    if (e.state && (e.attribute = !1), this.finalize(), this.elementProperties.set(t, e), !e.noAccessor && !this.prototype.hasOwnProperty(t)) {
      const r = typeof t == "symbol" ? Symbol() : "__" + t, o = this.getPropertyDescriptor(t, r, e);
      o !== void 0 && Object.defineProperty(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    return { get() {
      return this[e];
    }, set(o) {
      const s = this[t];
      this[e] = o, this.requestUpdate(t, s, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || Y;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return !1;
    this.finalized = !0;
    const t = Object.getPrototypeOf(this);
    if (t.finalize(), t.h !== void 0 && (this.h = [...t.h]), this.elementProperties = new Map(t.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const e = this.properties, r = [...Object.getOwnPropertyNames(e), ...Object.getOwnPropertySymbols(e)];
      for (const o of r)
        this.createProperty(o, e[o]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const o of r)
        e.unshift(nt(o));
    } else
      t !== void 0 && e.push(nt(t));
    return e;
  }
  static _$Ep(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  u() {
    var t;
    this._$E_ = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (t = this.constructor.h) === null || t === void 0 || t.forEach((e) => e(this));
  }
  addController(t) {
    var e, r;
    ((e = this._$ES) !== null && e !== void 0 ? e : this._$ES = []).push(t), this.renderRoot !== void 0 && this.isConnected && ((r = t.hostConnected) === null || r === void 0 || r.call(t));
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
    return Et(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var t;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var r;
      return (r = e.hostConnected) === null || r === void 0 ? void 0 : r.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var r;
      return (r = e.hostDisconnected) === null || r === void 0 ? void 0 : r.call(e);
    });
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$EO(t, e, r = Y) {
    var o;
    const s = this.constructor._$Ep(t, r);
    if (s !== void 0 && r.reflect === !0) {
      const n = (((o = r.converter) === null || o === void 0 ? void 0 : o.toAttribute) !== void 0 ? r.converter : Q).toAttribute(e, r.type);
      this._$El = t, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$El = null;
    }
  }
  _$AK(t, e) {
    var r;
    const o = this.constructor, s = o._$Ev.get(t);
    if (s !== void 0 && this._$El !== s) {
      const n = o.getPropertyOptions(s), l = typeof n.converter == "function" ? { fromAttribute: n.converter } : ((r = n.converter) === null || r === void 0 ? void 0 : r.fromAttribute) !== void 0 ? n.converter : Q;
      this._$El = s, this[s] = l.fromAttribute(e, n.type), this._$El = null;
    }
  }
  requestUpdate(t, e, r) {
    let o = !0;
    t !== void 0 && (((r = r || this.constructor.getPropertyOptions(t)).hasChanged || yt)(this[t], e) ? (this._$AL.has(t) || this._$AL.set(t, e), r.reflect === !0 && this._$El !== t && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t, r))) : o = !1), !this.isUpdatePending && o && (this._$E_ = this._$Ej());
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
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((o, s) => this[s] = o), this._$Ei = void 0);
    let e = !1;
    const r = this._$AL;
    try {
      e = this.shouldUpdate(r), e ? (this.willUpdate(r), (t = this._$ES) === null || t === void 0 || t.forEach((o) => {
        var s;
        return (s = o.hostUpdate) === null || s === void 0 ? void 0 : s.call(o);
      }), this.update(r)) : this._$Ek();
    } catch (o) {
      throw e = !1, this._$Ek(), o;
    }
    e && this._$AE(r);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach((r) => {
      var o;
      return (o = r.hostUpdated) === null || o === void 0 ? void 0 : o.call(r);
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
    this._$EC !== void 0 && (this._$EC.forEach((e, r) => this._$EO(r, this[r], e)), this._$EC = void 0), this._$Ek();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
E.finalized = !0, E.elementProperties = /* @__PURE__ */ new Map(), E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, lt == null || lt({ ReactiveElement: E }), ((K = j.reactiveElementVersions) !== null && K !== void 0 ? K : j.reactiveElementVersions = []).push("1.6.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var G;
const D = window, S = D.trustedTypes, ct = S ? S.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, tt = "$lit$", m = `lit$${(Math.random() + "").slice(9)}$`, $t = "?" + m, Ct = `<${$t}>`, _ = document, U = () => _.createComment(""), z = (i) => i === null || typeof i != "object" && typeof i != "function", xt = Array.isArray, Tt = (i) => xt(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", q = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ht = /-->/g, dt = />/g, b = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, ut = /"/g, _t = /^(?:script|style|textarea|title)$/i, Pt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), w = Pt(1), k = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), gt = /* @__PURE__ */ new WeakMap(), y = _.createTreeWalker(_, 129, null, !1);
function kt(i, t) {
  if (!Array.isArray(i) || !i.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return ct !== void 0 ? ct.createHTML(t) : t;
}
const Ut = (i, t) => {
  const e = i.length - 1, r = [];
  let o, s = t === 2 ? "<svg>" : "", n = P;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let c, h, d = -1, u = 0;
    for (; u < a.length && (n.lastIndex = u, h = n.exec(a), h !== null); )
      u = n.lastIndex, n === P ? h[1] === "!--" ? n = ht : h[1] !== void 0 ? n = dt : h[2] !== void 0 ? (_t.test(h[2]) && (o = RegExp("</" + h[2], "g")), n = b) : h[3] !== void 0 && (n = b) : n === b ? h[0] === ">" ? (n = o ?? P, d = -1) : h[1] === void 0 ? d = -2 : (d = n.lastIndex - h[2].length, c = h[1], n = h[3] === void 0 ? b : h[3] === '"' ? ut : pt) : n === ut || n === pt ? n = b : n === ht || n === dt ? n = P : (n = b, o = void 0);
    const g = n === b && i[l + 1].startsWith("/>") ? " " : "";
    s += n === P ? a + Ct : d >= 0 ? (r.push(c), a.slice(0, d) + tt + a.slice(d) + m + g) : a + m + (d === -2 ? (r.push(void 0), l) : g);
  }
  return [kt(i, s + (i[e] || "<?>") + (t === 2 ? "</svg>" : "")), r];
};
class M {
  constructor({ strings: t, _$litType$: e }, r) {
    let o;
    this.parts = [];
    let s = 0, n = 0;
    const l = t.length - 1, a = this.parts, [c, h] = Ut(t, e);
    if (this.el = M.createElement(c, r), y.currentNode = this.el.content, e === 2) {
      const d = this.el.content, u = d.firstChild;
      u.remove(), d.append(...u.childNodes);
    }
    for (; (o = y.nextNode()) !== null && a.length < l; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) {
          const d = [];
          for (const u of o.getAttributeNames())
            if (u.endsWith(tt) || u.startsWith(m)) {
              const g = h[n++];
              if (d.push(u), g !== void 0) {
                const At = o.getAttribute(g.toLowerCase() + tt).split(m), H = /([.?@])?(.*)/.exec(g);
                a.push({ type: 1, index: s, name: H[2], strings: At, ctor: H[1] === "." ? Mt : H[1] === "?" ? Nt : H[1] === "@" ? Bt : F });
              } else
                a.push({ type: 6, index: s });
            }
          for (const u of d)
            o.removeAttribute(u);
        }
        if (_t.test(o.tagName)) {
          const d = o.textContent.split(m), u = d.length - 1;
          if (u > 0) {
            o.textContent = S ? S.emptyScript : "";
            for (let g = 0; g < u; g++)
              o.append(d[g], U()), y.nextNode(), a.push({ type: 2, index: ++s });
            o.append(d[u], U());
          }
        }
      } else if (o.nodeType === 8)
        if (o.data === $t)
          a.push({ type: 2, index: s });
        else {
          let d = -1;
          for (; (d = o.data.indexOf(m, d + 1)) !== -1; )
            a.push({ type: 7, index: s }), d += m.length - 1;
        }
      s++;
    }
  }
  static createElement(t, e) {
    const r = _.createElement("template");
    return r.innerHTML = t, r;
  }
}
function C(i, t, e = i, r) {
  var o, s, n, l;
  if (t === k)
    return t;
  let a = r !== void 0 ? (o = e._$Co) === null || o === void 0 ? void 0 : o[r] : e._$Cl;
  const c = z(t) ? void 0 : t._$litDirective$;
  return (a == null ? void 0 : a.constructor) !== c && ((s = a == null ? void 0 : a._$AO) === null || s === void 0 || s.call(a, !1), c === void 0 ? a = void 0 : (a = new c(i), a._$AT(i, e, r)), r !== void 0 ? ((n = (l = e)._$Co) !== null && n !== void 0 ? n : l._$Co = [])[r] = a : e._$Cl = a), a !== void 0 && (t = C(i, a._$AS(i, t.values), a, r)), t;
}
class zt {
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
    const { el: { content: r }, parts: o } = this._$AD, s = ((e = t == null ? void 0 : t.creationScope) !== null && e !== void 0 ? e : _).importNode(r, !0);
    y.currentNode = s;
    let n = y.nextNode(), l = 0, a = 0, c = o[0];
    for (; c !== void 0; ) {
      if (l === c.index) {
        let h;
        c.type === 2 ? h = new N(n, n.nextSibling, this, t) : c.type === 1 ? h = new c.ctor(n, c.name, c.strings, this, t) : c.type === 6 && (h = new Ht(n, this, t)), this._$AV.push(h), c = o[++a];
      }
      l !== (c == null ? void 0 : c.index) && (n = y.nextNode(), l++);
    }
    return y.currentNode = _, s;
  }
  v(t) {
    let e = 0;
    for (const r of this._$AV)
      r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class N {
  constructor(t, e, r, o) {
    var s;
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = o, this._$Cp = (s = o == null ? void 0 : o.isConnected) === null || s === void 0 || s;
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
    t = C(this, t, e), z(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== k && this._(t) : t._$litType$ !== void 0 ? this.g(t) : t.nodeType !== void 0 ? this.$(t) : Tt(t) ? this.T(t) : this._(t);
  }
  k(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  $(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.k(t));
  }
  _(t) {
    this._$AH !== p && z(this._$AH) ? this._$AA.nextSibling.data = t : this.$(_.createTextNode(t)), this._$AH = t;
  }
  g(t) {
    var e;
    const { values: r, _$litType$: o } = t, s = typeof o == "number" ? this._$AC(t) : (o.el === void 0 && (o.el = M.createElement(kt(o.h, o.h[0]), this.options)), o);
    if (((e = this._$AH) === null || e === void 0 ? void 0 : e._$AD) === s)
      this._$AH.v(r);
    else {
      const n = new zt(s, this), l = n.u(this.options);
      n.v(r), this.$(l), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = gt.get(t.strings);
    return e === void 0 && gt.set(t.strings, e = new M(t)), e;
  }
  T(t) {
    xt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, o = 0;
    for (const s of t)
      o === e.length ? e.push(r = new N(this.k(U()), this.k(U()), this, this.options)) : r = e[o], r._$AI(s), o++;
    o < e.length && (this._$AR(r && r._$AB.nextSibling, o), e.length = o);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var r;
    for ((r = this._$AP) === null || r === void 0 || r.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const o = t.nextSibling;
      t.remove(), t = o;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cp = t, (e = this._$AP) === null || e === void 0 || e.call(this, t));
  }
}
class F {
  constructor(t, e, r, o, s) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = p;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t, e = this, r, o) {
    const s = this.strings;
    let n = !1;
    if (s === void 0)
      t = C(this, t, e, 0), n = !z(t) || t !== this._$AH && t !== k, n && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = s[0], a = 0; a < s.length - 1; a++)
        c = C(this, l[r + a], e, a), c === k && (c = this._$AH[a]), n || (n = !z(c) || c !== this._$AH[a]), c === p ? t = p : t !== p && (t += (c ?? "") + s[a + 1]), this._$AH[a] = c;
    }
    n && !o && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Mt extends F {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
const Ot = S ? S.emptyScript : "";
class Nt extends F {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    t && t !== p ? this.element.setAttribute(this.name, Ot) : this.element.removeAttribute(this.name);
  }
}
class Bt extends F {
  constructor(t, e, r, o, s) {
    super(t, e, r, o, s), this.type = 5;
  }
  _$AI(t, e = this) {
    var r;
    if ((t = (r = C(this, t, e, 0)) !== null && r !== void 0 ? r : p) === k)
      return;
    const o = this._$AH, s = t === p && o !== p || t.capture !== o.capture || t.once !== o.once || t.passive !== o.passive, n = t !== p && (o === p || s);
    s && this.element.removeEventListener(this.name, this, o), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e, r;
    typeof this._$AH == "function" ? this._$AH.call((r = (e = this.options) === null || e === void 0 ? void 0 : e.host) !== null && r !== void 0 ? r : this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ht {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const mt = D.litHtmlPolyfillSupport;
mt == null || mt(M, N), ((G = D.litHtmlVersions) !== null && G !== void 0 ? G : D.litHtmlVersions = []).push("2.8.0");
const It = (i, t, e) => {
  var r, o;
  const s = (r = e == null ? void 0 : e.renderBefore) !== null && r !== void 0 ? r : t;
  let n = s._$litPart$;
  if (n === void 0) {
    const l = (o = e == null ? void 0 : e.renderBefore) !== null && o !== void 0 ? o : null;
    s._$litPart$ = n = new N(t.insertBefore(U(), l), l, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var W, Z;
class $ extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t, e;
    const r = super.createRenderRoot();
    return (t = (e = this.renderOptions).renderBefore) !== null && t !== void 0 || (e.renderBefore = r.firstChild), r;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = It(e, this.renderRoot, this.renderOptions);
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
    return k;
  }
}
$.finalized = !0, $._$litElement$ = !0, (W = globalThis.litElementHydrateSupport) === null || W === void 0 || W.call(globalThis, { LitElement: $ });
const wt = globalThis.litElementPolyfillSupport;
wt == null || wt({ LitElement: $ });
((Z = globalThis.litElementVersions) !== null && Z !== void 0 ? Z : globalThis.litElementVersions = []).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = (i) => (t) => typeof t == "function" ? ((e, r) => (customElements.define(e, r), r))(i, t) : ((e, r) => {
  const { kind: o, elements: s } = r;
  return { kind: o, elements: s, finisher(n) {
    customElements.define(e, n);
  } };
})(i, t);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Rt = (i, t) => t.kind === "method" && t.descriptor && !("value" in t.descriptor) ? { ...t, finisher(e) {
  e.createProperty(t.key, i);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: t.key, initializer() {
  typeof t.initializer == "function" && (this[t.key] = t.initializer.call(this));
}, finisher(e) {
  e.createProperty(t.key, i);
} };
function v(i) {
  return (t, e) => e !== void 0 ? ((r, o, s) => {
    o.constructor.createProperty(s, r);
  })(i, t, e) : Rt(i, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function jt(i) {
  return v({ ...i, state: !0 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dt = ({ finisher: i, descriptor: t }) => (e, r) => {
  var o;
  if (r === void 0) {
    const s = (o = e.originalKey) !== null && o !== void 0 ? o : e.key, n = t != null ? { kind: "method", placement: "prototype", key: s, descriptor: t(e.key) } : { ...e, key: s };
    return i != null && (n.finisher = function(l) {
      i(l, s);
    }), n;
  }
  {
    const s = e.constructor;
    t !== void 0 && Object.defineProperty(e, r, t(r)), i == null || i(s, r);
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Lt(i, t) {
  return Dt({ descriptor: (e) => {
    const r = { get() {
      var o, s;
      return (s = (o = this.renderRoot) === null || o === void 0 ? void 0 : o.querySelector(i)) !== null && s !== void 0 ? s : null;
    }, enumerable: !0, configurable: !0 };
    if (t) {
      const o = typeof e == "symbol" ? Symbol() : "__" + e;
      r.get = function() {
        var s, n;
        return this[o] === void 0 && (this[o] = (n = (s = this.renderRoot) === null || s === void 0 ? void 0 : s.querySelector(i)) !== null && n !== void 0 ? n : null), this[o];
      };
    }
    return r;
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
const Ft = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, Vt = (i) => (...t) => ({ _$litDirective$: i, values: t });
class Kt {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, r) {
    this._$Ct = t, this._$AM = e, this._$Ci = r;
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
const ft = Vt(class extends Kt {
  constructor(i) {
    var t;
    if (super(i), i.type !== Ft.ATTRIBUTE || i.name !== "class" || ((t = i.strings) === null || t === void 0 ? void 0 : t.length) > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(i) {
    return " " + Object.keys(i).filter((t) => i[t]).join(" ") + " ";
  }
  update(i, [t]) {
    var e, r;
    if (this.it === void 0) {
      this.it = /* @__PURE__ */ new Set(), i.strings !== void 0 && (this.nt = new Set(i.strings.join(" ").split(/\s/).filter((s) => s !== "")));
      for (const s in t)
        t[s] && !(!((e = this.nt) === null || e === void 0) && e.has(s)) && this.it.add(s);
      return this.render(t);
    }
    const o = i.element.classList;
    this.it.forEach((s) => {
      s in t || (o.remove(s), this.it.delete(s));
    });
    for (const s in t) {
      const n = !!t[s];
      n === this.it.has(s) || !((r = this.nt) === null || r === void 0) && r.has(s) || (n ? (o.add(s), this.it.add(s)) : (o.remove(s), this.it.delete(s)));
    }
    return k;
  }
}), Yt = `*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.pointer-events-none{pointer-events:none}.static{position:static}.fixed{position:fixed}.bottom-20{bottom:5rem}.bottom-4{bottom:1rem}.right-4{right:1rem}.z-30{z-index:30}.z-40{z-index:40}.flex{display:flex}.hidden{display:none}.h-12{height:3rem}.h-6{height:1.5rem}.h-\\[30rem\\]{height:30rem}.max-h-24{max-height:6rem}.min-h-\\[1\\.5rem\\]{min-height:1.5rem}.min-h-min{min-height:min-content}.w-12{width:3rem}.w-6{width:1.5rem}.w-\\[20rem\\]{width:20rem}.flex-1{flex:1 1 0%}.origin-bottom{transform-origin:bottom}.scale-y-0{--tw-scale-y: 0;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.scale-y-100{--tw-scale-y: 1;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.select-none{-webkit-user-select:none;user-select:none}.resize-y{resize:vertical}.snap-y{scroll-snap-type:y var(--tw-scroll-snap-strictness)}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-col-reverse{flex-direction:column-reverse}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.overflow-y-auto{overflow-y:auto}.whitespace-nowrap{white-space:nowrap}.rounded{border-radius:.25rem}.rounded-full{border-radius:9999px}.rounded-b{border-bottom-right-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-t{border-top-left-radius:.25rem;border-top-right-radius:.25rem}.border{border-width:1px}.border-none{border-style:none}.bg-primary-color{background-color:var(--kite-primary-color, rgb(0 128 192))}.bg-slate-300\\/50{background-color:#cbd5e180}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}.bg-opacity-0{--tw-bg-opacity: 0}.p-2{padding:.5rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-2\\.5{padding-left:.625rem;padding-right:.625rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.leading-none{line-height:1}.text-secondary-color{color:var(--kite-secondary-color, rgb(255 255 255 / .95))}.caret-primary-color{caret-color:var(--kite-primary-color, rgb(0 128 192))}.opacity-100{opacity:1}.opacity-30{opacity:.3}.opacity-50{opacity:.5}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.outline-none{outline:2px solid transparent;outline-offset:2px}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.selection\\:bg-primary-color *::selection{background-color:var(--kite-primary-color, rgb(0 128 192))}.selection\\:text-white *::selection{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.selection\\:bg-primary-color::selection{background-color:var(--kite-primary-color, rgb(0 128 192))}.selection\\:text-white::selection{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.hover\\:bg-opacity-30:hover{--tw-bg-opacity: .3}.hover\\:text-opacity-80:hover{--tw-text-opacity: .8}.hover\\:opacity-100:hover{opacity:1}
`, Gt = L`
  ${O(Yt)}
`, qt = `textarea,main{scrollbar-width:thin}textarea::-webkit-scrollbar,main::-webkit-scrollbar{width:3px;height:3px}textarea::-webkit-scrollbar-track,main::-webkit-scrollbar-track{background:transparent}textarea::-webkit-scrollbar-thumb,main::-webkit-scrollbar-thumb{background-color:#737373}.kite-dialog>main{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%23aaa' fill-opacity='0.2' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E")}@media (max-width: 22rem){.kite-dialog{width:98vw;right:1vw}}@media (max-height: 35rem){.kite-dialog{height:98vh;width:98vw;max-width:30rem;right:1vmin;bottom:1vmin}}:host(:not([theme="dark"])){--kite-msg-bg: white;--kite-msg-border: white;--kite-msg-sent-bg: #d6d3d1;--kite-msg-sent-border: #d6d3d1}:host([theme="dark"]){--kite-msg-bg: #262626;--kite-msg-border: #292524;--kite-msg-sent-bg: #525252;--kite-msg-sent-border: #57534e}:host(:not([theme="dark"])) .kite-dialog{--tw-border-opacity: 1;border-color:rgb(229 229 229 / var(--tw-border-opacity));--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity));--tw-text-opacity: 1;color:rgb(0 0 0 / var(--tw-text-opacity))}:host([theme="dark"]) .kite-dialog{--tw-border-opacity: 1;border-color:rgb(82 82 82 / var(--tw-border-opacity));--tw-bg-opacity: 1;background-color:rgb(38 38 38 / var(--tw-bg-opacity));color:#fffffff2}@media (prefers-color-scheme: dark){:host(:not([theme="light"])){--kite-msg-bg: #262626;--kite-msg-border: #292524;--kite-msg-sent-bg: #525252;--kite-msg-sent-border: #57534e}:host(:not([theme="light"])) .kite-dialog{--tw-border-opacity: 1;border-color:rgb(82 82 82 / var(--tw-border-opacity));--tw-bg-opacity: 1;background-color:rgb(38 38 38 / var(--tw-bg-opacity));color:#fffffff2}}
`, Wt = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let Zt = (i) => crypto.getRandomValues(new Uint8Array(i)), Jt = (i, t, e) => {
  let r = (2 << Math.log(i.length - 1) / Math.LN2) - 1, o = -~(1.6 * r * t / i.length);
  return (s = t) => {
    let n = "";
    for (; ; ) {
      let l = e(o), a = o;
      for (; a--; )
        if (n += i[l[a] & r] || "", n.length === s)
          return n;
    }
  };
}, Xt = (i, t = 21) => Jt(i, t, Zt);
const Qt = Wt.replace("-", ""), R = Xt(Qt, 10);
var T = /* @__PURE__ */ ((i) => (i[i.unknown = 0] = "unknown", i[i.sent = 1] = "sent", i[i.delivered = 2] = "delivered", i[i.read = 3] = "read", i))(T || {});
function te(i) {
  return i.text !== void 0;
}
function $e(i) {
  return i.file !== void 0;
}
var ee = Object.defineProperty, ie = Object.getOwnPropertyDescriptor, B = (i, t, e, r) => {
  for (var o = r > 1 ? void 0 : r ? ie(t, e) : t, s = i.length - 1, n; s >= 0; s--)
    (n = i[s]) && (o = (r ? n(t, e, o) : n(o)) || o);
  return r && o && ee(t, e, o), o;
};
console.debug("kite-chat loaded");
const re = L`
  ${O(qt)}
`, X = {
  bubbles: !0,
  composed: !0,
  cancelable: !0
};
let A = class extends $ {
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
          class="kite-dialog ${ft({
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
              class="${ft({
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
        messageId: R(),
        timestamp: /* @__PURE__ */ new Date(),
        status: T.unknown,
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
    var r, o;
    const t = i.target, e = ((r = t.files) == null ? void 0 : r.length) ?? 0;
    for (let s = 0; s < e; s++) {
      const n = (o = t.files) == null ? void 0 : o.item(s);
      if (!n)
        continue;
      const l = {
        messageId: R(),
        timestamp: /* @__PURE__ */ new Date(),
        status: T.unknown,
        file: n
      };
      this._dispatchMsg(l) && this.appendMsg(l);
    }
  }
  _dispatchMsg(i) {
    const t = new CustomEvent("kite-chat.send", {
      ...X,
      detail: i
    });
    return this.dispatchEvent(t), !t.defaultPrevented;
  }
  hide() {
    if (!this.open)
      return;
    const i = new CustomEvent("kite-chat.hide", X);
    this.dispatchEvent(i), i.defaultPrevented || (this.open = !1);
  }
  show() {
    if (this.open)
      return;
    const i = new CustomEvent("kite-chat.show", X);
    this.dispatchEvent(i), i.defaultPrevented || (this.open = !0, this.textarea.focus());
  }
  appendMsg(i) {
    const { messageId: t = R(), timestamp: e = /* @__PURE__ */ new Date(), status: r } = i, o = document.createElement("kite-msg");
    if (o.messageId = t, o.timestamp = e, o.status = r, te(i))
      o.innerText = i.text;
    else {
      const { file: s } = i, n = document.createElement("kite-file");
      n.file = s, o.appendChild(n);
    }
    this.appendChild(o), o.scrollIntoView(!1), this.show();
  }
};
A.styles = [Gt, re];
B([
  v({ type: Boolean, reflect: !0 })
], A.prototype, "open", 2);
B([
  v()
], A.prototype, "heading", 2);
B([
  Lt("textarea")
], A.prototype, "textarea", 2);
B([
  jt()
], A.prototype, "sendEnabled", 2);
A = B([
  rt("kite-chat")
], A);
const oe = `:host{max-width:80%;position:relative;margin-top:.375rem;margin-bottom:.375rem;display:block;-webkit-user-select:text;user-select:text;scroll-snap-align:end;scroll-margin-top:.25rem;scroll-margin-bottom:.25rem;white-space:pre-line;overflow-wrap:break-word;border-radius:.25rem;padding:.25rem .5rem;text-align:left;--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}:host *::selection{background-color:var(--kite-primary-color, rgb(0 128 192));--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}:host::selection{background-color:var(--kite-primary-color, rgb(0 128 192));--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}:host(:not([status])){background:var(--kite-msg-bg, white)}:host([status]){background:var(--kite-msg-sent-bg, #d6d3d1);align-self:flex-end}:host:before{content:"";position:absolute;width:0;height:0;top:0;border:10px solid transparent}:host(:not([status])):before{left:-.375rem;border-top-color:var(--kite-msg-border, white)}:host([status]):before{right:-.375rem;border-top-color:var(--kite-msg-sent-border, #d6d3d1)}time{opacity:60%;font-size:.875rem;position:relative;margin:.25rem;float:right;bottom:-.375rem;right:-.5rem;-webkit-user-select:none;user-select:none}:host([status]) time{margin-right:1.5rem}span{text-decoration:none;position:absolute;bottom:0;right:.5em;letter-spacing:-.3em;-webkit-user-select:none;user-select:none;color:#737373}span.read:after,span.delivered:after{color:var(--kite-primary-color, rgb(0 128 192))}span.sent:after,span.delivered:after{content:"✓"}span.read:after{content:"✓✓"}span{--tw-text-opacity: 1;color:rgb(229 229 229 / var(--tw-text-opacity))}
`;
var se = Object.defineProperty, ne = Object.getOwnPropertyDescriptor, V = (i, t, e, r) => {
  for (var o = r > 1 ? void 0 : r ? ne(t, e) : t, s = i.length - 1, n; s >= 0; s--)
    (n = i[s]) && (o = (r ? n(t, e, o) : n(o)) || o);
  return r && o && se(t, e, o), o;
};
const ae = L`
  ${O(oe)}
`, le = new Intl.DateTimeFormat(
  navigator.languages,
  {
    hour: "2-digit",
    minute: "2-digit"
  }
);
let f = class extends $ {
  constructor() {
    super(...arguments), this.messageId = R(), this.timestamp = /* @__PURE__ */ new Date();
  }
  render() {
    return w` <slot></slot
      >${this._renderStatus()}${this._renderTimestamp()}`;
  }
  _renderStatus() {
    return this.status ? w`<span class="${T[this.status]}"></span>` : null;
  }
  _renderTimestamp() {
    return this.timestamp ? w`<time>${le.format(this.timestamp)}</time>` : null;
  }
};
f.TAG = "kite-msg";
f.styles = ae;
V([
  v({ reflect: !0 })
], f.prototype, "messageId", 2);
V([
  v({
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
], f.prototype, "timestamp", 2);
V([
  v({
    reflect: !0,
    converter: {
      toAttribute(i) {
        return typeof i < "u" ? T[i] : void 0;
      },
      fromAttribute(i) {
        if (i)
          return T[i];
      }
    }
  })
], f.prototype, "status", 2);
f = V([
  rt(f.TAG)
], f);
const ce = [
  "B",
  "kB",
  "MB",
  "GB",
  "TB",
  "PB",
  "EB",
  "ZB",
  "YB"
], he = [
  "B",
  "KiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB"
], de = [
  "b",
  "kbit",
  "Mbit",
  "Gbit",
  "Tbit",
  "Pbit",
  "Ebit",
  "Zbit",
  "Ybit"
], pe = [
  "b",
  "kibit",
  "Mibit",
  "Gibit",
  "Tibit",
  "Pibit",
  "Eibit",
  "Zibit",
  "Yibit"
], vt = (i, t, e) => {
  let r = i;
  return typeof t == "string" || Array.isArray(t) ? r = i.toLocaleString(t, e) : (t === !0 || e !== void 0) && (r = i.toLocaleString(void 0, e)), r;
};
function ue(i, t) {
  if (!Number.isFinite(i))
    throw new TypeError(`Expected a finite number, got ${typeof i}: ${i}`);
  t = {
    bits: !1,
    binary: !1,
    space: !0,
    ...t
  };
  const e = t.bits ? t.binary ? pe : de : t.binary ? he : ce, r = t.space ? " " : "";
  if (t.signed && i === 0)
    return ` 0${r}${e[0]}`;
  const o = i < 0, s = o ? "-" : t.signed ? "+" : "";
  o && (i = -i);
  let n;
  if (t.minimumFractionDigits !== void 0 && (n = { minimumFractionDigits: t.minimumFractionDigits }), t.maximumFractionDigits !== void 0 && (n = { maximumFractionDigits: t.maximumFractionDigits, ...n }), i < 1) {
    const h = vt(i, t.locale, n);
    return s + h + r + e[0];
  }
  const l = Math.min(Math.floor(t.binary ? Math.log(i) / Math.log(1024) : Math.log10(i) / 3), e.length - 1);
  i /= (t.binary ? 1024 : 1e3) ** l, n || (i = i.toPrecision(3));
  const a = vt(Number(i), t.locale, n), c = e[l];
  return s + a + r + c;
}
const ge = `img{max-width:98%;padding:1%}a{color:var(--kite-primary-color, rgb(0 128 192))}
`;
var me = Object.defineProperty, we = Object.getOwnPropertyDescriptor, ot = (i, t, e, r) => {
  for (var o = r > 1 ? void 0 : r ? we(t, e) : t, s = i.length - 1, n; s >= 0; s--)
    (n = i[s]) && (o = (r ? n(t, e, o) : n(o)) || o);
  return r && o && me(t, e, o), o;
};
const fe = L`
  ${O(ge)}
`, ve = (i) => {
  const [t, e, r, o] = i.split(/[:;,]+/);
  if (t !== "data" || r !== "base64")
    throw new Error("only data uri with base64 encoding is supported");
  const s = atob(o), n = new ArrayBuffer(s.length), l = new Uint8Array(n);
  for (let a = 0; a < s.length; a++)
    l[a] = s.charCodeAt(a);
  return new File([n], "", { type: e });
};
let x = class extends $ {
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
          >(${ue(this.file.size)})</data
        >`;
    }
  }
};
x.TAG = "kite-file";
x.styles = fe;
ot([
  v({
    reflect: !1
  })
], x.prototype, "name", 2);
ot([
  v({
    attribute: "src",
    reflect: !1,
    converter: {
      fromAttribute: (i) => i ? ve(i) : null
    }
  })
], x.prototype, "file", 2);
x = ot([
  rt(x.TAG)
], x);
export {
  A as KiteChatElement,
  x as KiteFileElement,
  f as KiteMsgElement,
  T as MsgStatus,
  $e as isFileMsg,
  te as isPlaintextMsg,
  ue as prettyBytes,
  R as randomStringId
};
