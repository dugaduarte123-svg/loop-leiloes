! function() {
    "use strict";
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

    function t(e, t) {
        return e(t = {
            exports: {}
        }, t.exports), t.exports
    }
    var n = function(e) {
            return e && e.Math == Math && e
        },
        r = n("object" == typeof globalThis && globalThis) || n("object" == typeof window && window) || n("object" == typeof self && self) || n("object" == typeof e && e) || Function("return this")(),
        o = function(e) {
            try {
                return !!e()
            } catch (e) {
                return !0
            }
        },
        i = !o((function() {
            return 7 != Object.defineProperty({}, 1, {
                get: function() {
                    return 7
                }
            })[1]
        })),
        s = {}.propertyIsEnumerable,
        a = Object.getOwnPropertyDescriptor,
        c = {
            f: a && !s.call({
                1: 2
            }, 1) ? function(e) {
                var t = a(this, e);
                return !!t && t.enumerable
            } : s
        },
        u = function(e, t) {
            return {
                enumerable: !(1 & e),
                configurable: !(2 & e),
                writable: !(4 & e),
                value: t
            }
        },
        d = {}.toString,
        h = function(e) {
            return d.call(e).slice(8, -1)
        },
        l = "".split,
        f = o((function() {
            return !Object("z").propertyIsEnumerable(0)
        })) ? function(e) {
            return "String" == h(e) ? l.call(e, "") : Object(e)
        } : Object,
        p = function(e) {
            if (null == e) throw TypeError("Can't call method on " + e);
            return e
        },
        b = function(e) {
            return f(p(e))
        },
        m = function(e) {
            return "object" == typeof e ? null !== e : "function" == typeof e
        },
        g = function(e, t) {
            if (!m(e)) return e;
            var n, r;
            if (t && "function" == typeof(n = e.toString) && !m(r = n.call(e))) return r;
            if ("function" == typeof(n = e.valueOf) && !m(r = n.call(e))) return r;
            if (!t && "function" == typeof(n = e.toString) && !m(r = n.call(e))) return r;
            throw TypeError("Can't convert object to primitive value")
        },
        y = {}.hasOwnProperty,
        w = function(e, t) {
            return y.call(e, t)
        },
        v = r.document,
        k = m(v) && m(v.createElement),
        $ = function(e) {
            return k ? v.createElement(e) : {}
        },
        S = !i && !o((function() {
            return 7 != Object.defineProperty($("div"), "a", {
                get: function() {
                    return 7
                }
            }).a
        })),
        E = Object.getOwnPropertyDescriptor,
        x = {
            f: i ? E : function(e, t) {
                e = b(e);
                t = g(t, !0);
                if (S) try {
                    return E(e, t)
                } catch (e) {}
                if (w(e, t)) return u(!c.f.call(e, t), e[t])
            }
        },
        O = function(e) {
            if (!m(e)) throw TypeError(String(e) + " is not an object");
            return e
        },
        I = Object.defineProperty,
        T = {
            f: i ? I : function(e, t, n) {
                O(e);
                t = g(t, !0);
                O(n);
                if (S) try {
                    return I(e, t, n)
                } catch (e) {}
                if ("get" in n || "set" in n) throw TypeError("Accessors not supported");
                "value" in n && (e[t] = n.value);
                return e
            }
        },
        L = i ? function(e, t, n) {
            return T.f(e, t, u(1, n))
        } : function(e, t, n) {
            e[t] = n;
            return e
        },
        _ = function(e, t) {
            try {
                L(r, e, t)
            } catch (n) {
                r[e] = t
            }
            return t
        },
        j = "__core-js_shared__",
        C = r[j] || _(j, {}),
        M = Function.toString;
    "function" != typeof C.inspectSource && (C.inspectSource = function(e) {
        return M.call(e)
    });
    var q, P, R, W = C.inspectSource,
        N = r.WeakMap,
        A = "function" == typeof N && /native code/.test(W(N)),
        F = !1,
        H = t((function(e) {
            (e.exports = function(e, t) {
                return C[e] || (C[e] = void 0 !== t ? t : {})
            })("versions", []).push({
                version: "3.6.5",
                mode: F ? "pure" : "global",
                copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
            })
        })),
        U = 0,
        z = Math.random(),
        D = function(e) {
            return "Symbol(" + String(void 0 === e ? "" : e) + ")_" + (++U + z).toString(36)
        },
        B = H("keys"),
        V = function(e) {
            return B[e] || (B[e] = D(e))
        },
        J = {},
        Q = r.WeakMap,
        X = function(e) {
            return R(e) ? P(e) : q(e, {})
        },
        G = function(e) {
            return function(t) {
                var n;
                if (!m(t) || (n = P(t)).type !== e) throw TypeError("Incompatible receiver, " + e + " required");
                return n
            }
        };
    if (A) {
        var K = new Q,
            Y = K.get,
            Z = K.has,
            ee = K.set;
        q = function(e, t) {
            ee.call(K, e, t);
            return t
        };
        P = function(e) {
            return Y.call(K, e) || {}
        };
        R = function(e) {
            return Z.call(K, e)
        }
    } else {
        var te = V("state");
        J[te] = !0;
        q = function(e, t) {
            L(e, te, t);
            return t
        };
        P = function(e) {
            return w(e, te) ? e[te] : {}
        };
        R = function(e) {
            return w(e, te)
        }
    }
    var ne = {
            set: q,
            get: P,
            has: R,
            enforce: X,
            getterFor: G
        },
        re = (ne.set, ne.get, ne.has, ne.enforce, ne.getterFor, t((function(e) {
            var t = ne.get,
                n = ne.enforce,
                o = String(String).split("String");
            (e.exports = function(e, t, i, s) {
                var a = !!s && !!s.unsafe,
                    c = !!s && !!s.enumerable,
                    u = !!s && !!s.noTargetGet;
                if ("function" == typeof i) {
                    "string" != typeof t || w(i, "name") || L(i, "name", t);
                    n(i).source = o.join("string" == typeof t ? t : "")
                }
                if (e !== r) {
                    a ? !u && e[t] && (c = !0) : delete e[t];
                    c ? e[t] = i : L(e, t, i)
                } else c ? e[t] = i : _(t, i)
            })(Function.prototype, "toString", (function() {
                return "function" == typeof this && t(this).source || W(this)
            }))
        }))),
        oe = r,
        ie = function(e) {
            return "function" == typeof e ? e : void 0
        },
        se = function(e, t) {
            return arguments.length < 2 ? ie(oe[e]) || ie(r[e]) : oe[e] && oe[e][t] || r[e] && r[e][t]
        },
        ae = Math.ceil,
        ce = Math.floor,
        ue = function(e) {
            return isNaN(e = +e) ? 0 : (e > 0 ? ce : ae)(e)
        },
        de = Math.min,
        he = function(e) {
            return e > 0 ? de(ue(e), 9007199254740991) : 0
        },
        le = Math.max,
        fe = Math.min,
        pe = function(e, t) {
            var n = ue(e);
            return n < 0 ? le(n + t, 0) : fe(n, t)
        },
        be = function(e) {
            return function(t, n, r) {
                var o, i = b(t),
                    s = he(i.length),
                    a = pe(r, s);
                if (e && n != n) {
                    for (; s > a;)
                        if ((o = i[a++]) != o) return !0
                } else
                    for (; s > a; a++)
                        if ((e || a in i) && i[a] === n) return e || a || 0;
                return !e && -1
            }
        },
        me = {
            includes: be(!0),
            indexOf: be(!1)
        },
        ge = (me.includes, me.indexOf, me.indexOf),
        ye = function(e, t) {
            var n, r = b(e),
                o = 0,
                i = [];
            for (n in r) !w(J, n) && w(r, n) && i.push(n);
            for (; t.length > o;) w(r, n = t[o++]) && (~ge(i, n) || i.push(n));
            return i
        },
        we = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"],
        ve = we.concat("length", "prototype"),
        ke = {
            f: Object.getOwnPropertyNames || function(e) {
                return ye(e, ve)
            }
        },
        $e = {
            f: Object.getOwnPropertySymbols
        },
        Se = se("Reflect", "ownKeys") || function(e) {
            var t = ke.f(O(e)),
                n = $e.f;
            return n ? t.concat(n(e)) : t
        },
        Ee = function(e, t) {
            for (var n = Se(t), r = T.f, o = x.f, i = 0; i < n.length; i++) {
                var s = n[i];
                w(e, s) || r(e, s, o(t, s))
            }
        },
        xe = /#|\.prototype\./,
        Oe = function(e, t) {
            var n = Te[Ie(e)];
            return n == _e || n != Le && ("function" == typeof t ? o(t) : !!t)
        },
        Ie = Oe.normalize = function(e) {
            return String(e).replace(xe, ".").toLowerCase()
        },
        Te = Oe.data = {},
        Le = Oe.NATIVE = "N",
        _e = Oe.POLYFILL = "P",
        je = Oe,
        Ce = x.f,
        Me = function(e, t) {
            var n, o, i, s, a, c = e.target,
                u = e.global,
                d = e.stat;
            if (n = u ? r : d ? r[c] || _(c, {}) : (r[c] || {}).prototype)
                for (o in t) {
                    s = t[o];
                    i = e.noTargetGet ? (a = Ce(n, o)) && a.value : n[o];
                    if (!je(u ? o : c + (d ? "." : "#") + o, e.forced) && void 0 !== i) {
                        if (typeof s == typeof i) continue;
                        Ee(s, i)
                    }(e.sham || i && i.sham) && L(s, "sham", !0);
                    re(n, o, s, e)
                }
        },
        qe = Object.keys || function(e) {
            return ye(e, we)
        },
        Pe = function(e) {
            return Object(p(e))
        },
        Re = Object.assign,
        We = Object.defineProperty,
        Ne = !Re || o((function() {
            if (i && 1 !== Re({
                    b: 1
                }, Re(We({}, "a", {
                    enumerable: !0,
                    get: function() {
                        We(this, "b", {
                            value: 3,
                            enumerable: !1
                        })
                    }
                }), {
                    b: 2
                })).b) return !0;
            var e = {},
                t = {},
                n = Symbol(),
                r = "abcdefghijklmnopqrst";
            e[n] = 7;
            r.split("").forEach((function(e) {
                t[e] = e
            }));
            return 7 != Re({}, e)[n] || qe(Re({}, t)).join("") != r
        })) ? function(e, t) {
            for (var n = Pe(e), r = arguments.length, o = 1, s = $e.f, a = c.f; r > o;)
                for (var u, d = f(arguments[o++]), h = s ? qe(d).concat(s(d)) : qe(d), l = h.length, p = 0; l > p;) {
                    u = h[p++];
                    i && !a.call(d, u) || (n[u] = d[u])
                }
            return n
        } : Re;
    Me({
        target: "Object",
        stat: !0,
        forced: Object.assign !== Ne
    }, {
        assign: Ne
    });
    var Ae = !!Object.getOwnPropertySymbols && !o((function() {
            return !String(Symbol())
        })),
        Fe = Ae && !Symbol.sham && "symbol" == typeof Symbol.iterator,
        He = H("wks"),
        Ue = r.Symbol,
        ze = Fe ? Ue : Ue && Ue.withoutSetter || D,
        De = function(e) {
            w(He, e) || (Ae && w(Ue, e) ? He[e] = Ue[e] : He[e] = ze("Symbol." + e));
            return He[e]
        },
        Be = De("match"),
        Ve = function(e) {
            var t;
            return m(e) && (void 0 !== (t = e[Be]) ? !!t : "RegExp" == h(e))
        },
        Je = function() {
            var e = O(this),
                t = "";
            e.global && (t += "g");
            e.ignoreCase && (t += "i");
            e.multiline && (t += "m");
            e.dotAll && (t += "s");
            e.unicode && (t += "u");
            e.sticky && (t += "y");
            return t
        },
        Qe = De("replace"),
        Xe = RegExp.prototype;
    Me({
        target: "String",
        proto: !0
    }, {
        replaceAll: function e(t, n) {
            var r, o, i, s, a, c, u, d, h = p(this);
            if (null != t) {
                if ((r = Ve(t)) && !~String(p("flags" in Xe ? t.flags : Je.call(t))).indexOf("g")) throw TypeError("`.replaceAll` does not allow non-global regexes");
                if (void 0 !== (o = t[Qe])) return o.call(t, h, n);
                if (F && r) return String(h).replace(t, n)
            }
            i = String(h);
            if ("" === (s = String(t))) return e.call(i, /(?:)/g, n);
            a = i.split(s);
            if ("function" != typeof n) return a.join(String(n));
            u = (c = a[0]).length;
            for (d = 1; d < a.length; d++) {
                c += String(n(s, u, i));
                u += s.length + a[d].length;
                c += a[d]
            }
            return c
        }
    })
}();
! function() {
    "use strict";
    const e = "na1";

    function t(t = "") {
        return t && t !== e ? `-${t}` : ""
    }
    const n = () => location,
        r = /^.*hsappstatic\.net\/feedback-web-renderer-ui\/static-(\d+(?:-\w+-?)*\.\d+).*$/,
        o = [].slice.call(document.getElementsByTagName("script")).map((e => e.src)).filter((e => r.test(e)))[0],
        i = o && r.exec(o) ? r.exec(o)[1] : "unknown",
        s = (/hubspot\.com$/.test(n().host), URL.createObjectURL(new Blob([])).slice(-36).replace(/-/g, "")),
        a = (document.location.pathname.indexOf("nps"), n().href, e => {
            if (!e || "" === e) return null;
            const t = e.split("/");
            return `${t[0]}//${t[2]}`
        }),
        c = (e, t) => `${encodeURIComponent(e)}=${encodeURIComponent(t)}`,
        u = e => Object.keys(e).reduce(((t, n) => {
            const r = e[n];
            return [...t, ...Array.isArray(r) ? r.map((e => c(n, e))) : [c(n, r)]]
        }), []).join("&"),
        d = "PREVIEW_EDITOR",
        h = "PREVIEW_UI",
        l = "FETCHER",
        f = "UI",
        p = "change-expand",
        b = "expand",
        m = "focus",
        g = "hide",
        y = "load-survey",
        w = "location-change",
        v = "ready",
        k = "reset",
        $ = "resize-popup",
        S = "setup",
        E = "show",
        x = "fetched",
        O = "update",
        I = "load-config-only",
        T = "config-fetched",
        L = "show-loaded-config";
    var _ = e => {
            let t = !0,
                n = [];
            const r = (...e) => {
                n.forEach((t => {
                    t(...e)
                }))
            };
            return o => {
                t && 0 === n.length && (t = e(r));
                n.push(o);
                return () => {
                    const e = n.length;
                    n = n.filter((e => e !== o));
                    t && 0 === n.length && e > 0 && t()
                }
            }
        },
        j = (e, t, n = {}) => _((r => {
            e.addEventListener(t, r, n);
            return () => {
                e.removeEventListener(t, r, n)
            }
        }));
    const C = e => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        M = (e, t) => {
            const n = a(e);
            if (null === n) return () => {};
            const r = new RegExp(`^${C(n)}$`),
                o = j(window, "message");
            return e => o((({
                data: n,
                origin: o,
                source: i
            }) => {
                if (!n || !r.test(o)) return;
                let s;
                try {
                    s = JSON.parse(n)
                } catch (e) {
                    return
                }
                const {
                    payload: a,
                    type: c
                } = s;
                if (!a || c !== R) return;
                const {
                    channel: u,
                    payload: {
                        messageType: d,
                        payload: h
                    }
                } = a;
                u === t && e(d, h, o, i)
            }))
        },
        q = e => M(document.referrer, e),
        P = (e, t) => M(e.src, t);
    const R = "hubspot-servicehub-feedback",
        W = (e, t, n) => (r, o) => {
            t.postMessage(JSON.stringify({
                payload: {
                    channel: e,
                    payload: {
                        messageType: r,
                        payload: o
                    }
                },
                type: R
            }), n || "*")
        },
        N = (e, t) => W(t, e.contentWindow, e.src),
        A = e => W(e, window.parent, document.referrer),
        F = (e, t, n) => {
            const r = P(e, t),
                o = N(e, t),
                i = r((e => {
                    if (e === v) {
                        n({
                            sender: o,
                            subscribe: r
                        });
                        i()
                    }
                }))
        };
    var H = (e, t) => _((n => {
        const r = setInterval(n, e);
        return () => {
            t && t();
            clearInterval(r)
        }
    }));
    const U = (e, t) => e === t;
    var z = ((e, t = U, n = 1e3) => {
        let r, o = !0;
        const i = H(n, (() => {
            o = !0
        }));
        return n => i((() => {
            const i = e();
            if (!t(i, r)) {
                o || n(i);
                r = i
            }
            o = !1
        }))
    })((() => location.href));
    const D = "live-preview",
        B = "preview",
        V = "standard",
        J = "feedback-web",
        Q = `${J}-fetcher`,
        X = `${J}-ui`,
        G = (e, t) => {
            Object.keys(t).forEach((n => {
                e.setAttribute(n, t[n])
            }));
            return e
        },
        K = (e, t = {}) => G(document.createElement(e), t),
        Y = (e, t) => {
            const n = (e.childNodes || {})[0];
            if (n) {
                e.insertBefore(t, n);
                return e
            }
            e.appendChild(t);
            return e
        },
        Z = e => e.replace(/(^ *| *$)/g, "").replace(/ +/g, " "),
        ee = (e, t) => {
            e.className = Z(`${e.className} ${t}`)
        },
        te = (e, t) => {
            e.className = Z(e.className.replace(new RegExp(t, "g"), ""))
        },
        ne = .4,
        re = 350,
        oe = re + 200,
        ie = 480,
        se = 450,
        ae = Math.max(ie, re, oe, se),
        ce = 416,
        ue = 420,
        de = 544,
        he = 768,
        le = 600,
        fe = "hs-feedback-ui",
        pe = "hs-feedback-fetcher",
        be = "hs-feedback-extended-width",
        me = "hs-feedback-shown",
        ge = "hs-feedback-slid-out",
        ye = "hs-feedback-expanded",
        we = (e, t) => `\n  @keyframes feedback-slide-in-${e} {\n    from {transform: translate(0, ${100*t}%);}\n    to {transform: translate(0, 0);}\n  }\n\n  @keyframes feedback-slide-out-${e} {\n    from {transform: translate(0, 0);}\n    to {transform: translate(0, ${100*t}%);}\n  }\n\n  #${fe}.${e} {\n    animation-name: feedback-slide-in-${e};\n  }\n\n  #${fe}.${e}.${ge} {\n    animation-name: feedback-slide-out-${e};\n    animation-fill-mode: forwards;\n  }\n`,
        ve = `\n  #${fe} {\n    animation-duration: ${ne}s;\n    animation-timing-function: ease-out;\n    display: none;\n    height: 0;\n    overflow: hidden;\n    position: fixed;\n    z-index: 2147483647;\n    max-width: 100%;\n  }\n\n  .hubspot.space-sword #${fe} {\n    /* TODO: replace the 1211 with z-index token once available from Trellis (issue: https://git.hubteam.com/HubSpot/foundations-theming/issues/233) */\n    z-index: ${window.hsFeedbackWebZIndex||1211};\n  }\n\n  #${fe}.${me} {\n    display: block;\n  }\n\n  #${pe} {\n    display: none\n  }\n\n  ${we("hs-feedback-left",1)}\n  ${we("hs-feedback-right",1)}\n  ${we("hs-feedback-top",-1)}\n\n  #${fe} > iframe {\n    width: 100%;\n    height: 100%;\n  }\n\n  #${fe}:not(.hs-feedback-top) {\n    bottom: 0;\n  }\n\n  #${fe}.hs-feedback-left {\n    left: 0;\n  }\n\n  #${fe}.hs-feedback-right {\n    right: 0;\n  }\n\n  .zorse #${fe}:not(.hs-feedback-top) {\n    bottom: 6px;\n  }\n\n  .zorse #${fe}.hs-feedback-right {\n    right: 0;\n  }\n\n  #${fe}.hs-feedback-top {\n    left: 0;\n    top: 0;\n    width: 100%;\n  }\n\n  #${fe}.hs-feedback-nps:not(.hs-feedback-top) {\n    width: ${ie}px;\n  }\n\n  #${fe}.hs-feedback-csat:not(.hs-feedback-top) {\n    width: ${re}px;\n  }\n\n  #${fe}.hs-feedback-csat.${be}:not(.hs-feedback-top) {\n    width: ${oe}px;\n  }\n\n  #${fe}.hs-feedback-csat:not(.hs-feedback-top):not(.${ye}):not(.hs-feedback-mobile) {\n    width: ${se}px;\n  }\n\n  #${fe}.hs-feedback-csat.${be}:not(.hs-feedback-top) {\n    width: ${oe}px !important;\n  }\n\n  #${fe}.preview.hs-feedback-csat.hs-feedback-callout:not(.${ye}):not(.hs-feedback-top) {\n    width: ${se}px !important;\n  }\n\n  #${fe}:not(.preview):not(.hs-feedback-callout):not(.hs-feedback-top):not(.hs-feedback-desktop),\n  #${fe}.${ye}:not(.preview):not(.hs-feedback-top):not(.hs-feedback-desktop) {\n    width: 100% !important;\n  }\n\n  @media only screen and (max-width: ${le}px) {\n    #${fe}.preview:not(.hs-feedback-top),\n    #${fe}.${ye}.preview:not(.hs-feedback-top) {\n      width: 100% !important;\n    }\n  }\n\n  #${fe}.${me} ~ #tally-widget-container,\n  #${fe}.${me} ~ #wootric-modal {\n    display: none !important;\n  }\n\n  /* hide all popups in the same position as us */\n  #${fe}.hs-feedback-right.${me}:not(.hs-feedback-mobile) ~ #hubspot-messages-iframe-container,\n  #${fe}.hs-feedback-right.${me}:not(.hs-feedback-mobile) ~ .leadinModal-theme-bottom-right-corner,\n  #${fe}.hs-feedback-left.${me}:not(.hs-feedback-mobile)  ~ .leadinModal-theme-bottom-left-corner,\n  #${fe}.hs-feedback-top.${me}:not(.hs-feedback-mobile)   ~ .leadinModal-theme-top {\n    display: none !important;\n  }\n\n  /* hide leadflows when we're tablet-stretched across from them */\n  @media only screen and (min-width: ${de}px) and (max-width: ${Math.max(he,ae+ue)}px) {\n    #${fe}.hs-feedback-left.${me}  ~ .leadinModal-theme-bottom-right-corner,\n    #${fe}.hs-feedback-right.${me} ~ .leadinModal-theme-bottom-left-corner {\n      display: none !important;\n    }\n  }\n\n  /* hide messages when we're tablet-stretched across from them */\n  @media only screen and (max-width: ${Math.max(he,ae+ce)}px) {\n    #${fe}.hs-feedback-left.${me} ~ #hubspot-messages-iframe-container {\n      display: none !important;\n    }\n  }\n\n\n  /* repeat above rules for small screens when we're set to display on mobile */\n  #${fe}.hs-feedback-mobile.hs-feedback-right.${me}:not(.hs-feedback-no-mobile) ~ #hubspot-messages-iframe-container,\n  #${fe}.hs-feedback-mobile.hs-feedback-left.${me}:not(.hs-feedback-no-mobile)  ~ #hubspot-messages-iframe-container,\n  #${fe}.hs-feedback-mobile.hs-feedback-right.${me}:not(.hs-feedback-no-mobile) ~ .leadinModal-theme-bottom-right-corner,\n  #${fe}.hs-feedback-mobile.hs-feedback-left.${me}:not(.hs-feedback-no-mobile)  ~ .leadinModal-theme-bottom-left-corner,\n  #${fe}.hs-feedback-mobile.hs-feedback-top.${me}:not(.hs-feedback-no-mobile)   ~ .leadinModal-theme-top,\n  #${fe}.hs-feedback-mobile.hs-feedback-left.${me}:not(.hs-feedback-no-mobile)  ~ .leadinModal-theme-bottom-right-corner,\n  #${fe}.hs-feedback-mobile.hs-feedback-right.${me}:not(.hs-feedback-no-mobile) ~ .leadinModal-theme-bottom-left-corner {\n    display: none !important;\n  }\n\n  /* don't display us on small screens if we're set to not display on mobile */\n  #${fe}.hs-feedback-mobile.hs-feedback-no-mobile {\n    display: none;\n  }\n`,
        ke = A(l),
        $e = 1e3,
        Se = () => {
            const e = document.querySelector("#isc-zorse-widget") || document.querySelector("#chat-widget"),
                t = document.getElementById("hs-feedback-ui");
            if (e) {
                const n = e.children[0];
                if (n) {
                    const e = n.clientWidth + 20;
                    t && (t.style.marginRight = `${e}px`)
                }
            } else t && (t.style.marginRight = "0px")
        };
    class Ee {
        constructor() {
            this.setFetcher = e => {
                this.fetcher = e;
                this._runQueuedEvents();
                return this
            };
            this.initialiseUI = ({
                iframe: e,
                parent: t,
                sender: n
            }) => {
                this.iframe = e;
                this.sendToIframe = n;
                this.iframeWrapper = t;
                this._runQueuedEvents();
                setInterval(Se, 100)
            };
            this._runQueuedEvents = () => {
                const e = this.queuedEvents;
                this.queuedEvents = [];
                e.forEach((e => e(this)))
            };
            this._onSurveyLoaded = e => {
                this._setMetaData(e);
                this.onSurveyLoad && this.onSurveyLoad(e)
            };
            this._queueEvent = e => {
                this.queuedEvents.push(e);
                return this
            };
            this._push = e => {
                this._queueEvent(e);
                this.fetcher && this._runQueuedEvents()
            };
            this._setSurveyLanguage = e => {
                this.surveyLanguage = e.config.language
            };
            this._setMetaData = e => {
                this._setSurveyLanguage(e);
                this.config = e;
                return this
            };
            this._onConfigLoaded = e => {
                this._setMetaData(e);
                this.onConfigLoaded && this.onConfigLoaded(e);
                return this
            };
            this.hide = () => {
                if (!this.iframeWrapper) return this._queueEvent(this.hide);
                ee(this.iframeWrapper, ge);
                window.setTimeout((() => {
                    te(this.iframeWrapper, me)
                }), 500);
                return this
            };
            this.show = () => {
                if (!this.iframeWrapper) return this._queueEvent(this.show);
                te(this.iframeWrapper, ge);
                ee(this.iframeWrapper, me);
                return this
            };
            this.expand = () => {
                if (!this.iframeWrapper) return this._queueEvent(this.expand);
                ee(this.iframeWrapper, ye);
                this.sendToIframe(p, !0);
                return this
            };
            this.minimize = () => {
                if (!this.iframeWrapper) return this._queueEvent(this.minimize);
                te(this.iframeWrapper, ye);
                this.sendToIframe(p, !1);
                return this
            };
            this.reset = () => {
                if (!this.iframeWrapper) return this._queueEvent(this.reset);
                this.sendToIframe(k, !1);
                return this
            };
            this.showOnMouseLeave = (e = !1) => {
                const t = () => {
                    e && this.expand();
                    this.show();
                    document.removeEventListener("mouseleave", t)
                };
                document.addEventListener("mouseleave", t);
                return this
            };
            this.showOnScroll = (e = !1) => {
                const t = Math.max(document.body.offsetHeight, document.body.scrollHeight),
                    n = .5 * (t - window.innerHeight),
                    r = () => {
                        e && this.expand();
                        this.show()
                    };
                if (t === window.innerHeight) {
                    setTimeout(r, $e);
                    return this
                }
                const o = () => {
                    const e = document.body.scrollTop || window.pageYOffset;
                    if (window.innerHeight + e > n) {
                        r();
                        document.removeEventListener("scroll", o)
                    }
                };
                document.addEventListener("scroll", o);
                return this
            };
            this.loadConfigOnly = (e, t) => {
                if (!this.fetcher) return this._queueEvent((() => this.loadConfigOnly(e, t)));
                this.fetcher(I, {
                    surveyType: e,
                    surveyId: t
                });
                return this
            };
            this.loadSurvey = (e, t) => {
                if (!this.fetcher) return this._queueEvent((() => this.loadSurvey(e, t)));
                this.fetcher(y, {
                    surveyType: e,
                    surveyId: t
                });
                return this
            };
            this.showSurvey = e => {
                if (!this.fetcher) return this._queueEvent((() => this.showSurvey()));
                if (!e) return this;
                this.fetcher(L, e);
                return this
            };
            this.checkIsLanguageValid = e => e === this.surveyLanguage;
            this.renderSurvey = () => {
                if (!this.config) return this._queueEvent((() => this.renderSurvey()));
                ke(x, this.config);
                return this
            };
            this.getSurveyConfig = () => this.config;
            this.fetcher = null;
            this.onSurveyLoad = null;
            this._onReady = null;
            this.iframeWrapper = null;
            this.iframe = null;
            this.sendToIframe = null;
            this.onConfigLoaded = null;
            this.surveyLanguage = null;
            this.config = null;
            this.queuedEvents = window.onHsFeedbackReady || [];
            window.hsFeedback = this;
            window.onHsFeedbackReady = {
                push: this._push
            }
        }
    }
    var xe = Ee;
    var Oe = e => {
        const t = document.querySelector(`script[${e}]`);
        return t ? t.getAttribute(e) : null
    };
    const Ie = "hsWebSurveyPreview",
        Te = "hsWebSurveyTestId",
        Le = "data-hubspot-feedback-portal-id",
        _e = "data-hubspot-feedback-customer-portal-id",
        je = "data-hubspot-feedback-env",
        Ce = "data-hubspot-feedback-hubspot-app",
        Me = "data-hubspot-feedback-hubspot-email",
        qe = "data-hubspot-feedback-user-lang",
        Pe = "data-hubspot-feedback-client-load-only",
        Re = "data-hsjs-hublet",
        We = {},
        Ne = window.location.hash,
        Ae = window.location.search;
    (() => {
        if (Ne.length > 0) {
            const e = Ne.split("?");
            if (e.length > 1) return `?${e[1]}`
        }
        return Ae
    })().replace(/[(?|&)]([^=]+)=([^&#]+)/g, ((e, t, n) => {
        We[t] = n
    }));
    const Fe = e => {
        try {
            return "true" === localStorage.getItem(e)
        } catch (e) {
            return !1
        }
    };

    function He() {
        return window.location.hostname.split(".")[0].split("-")[1] || ""
    }
    const Ue = Oe(je),
        ze = Oe(Le),
        De = Oe(_e),
        Be = We[Ie],
        Ve = We[Te],
        Je = Boolean(window.feedbackTestPage) || Boolean(Be),
        Qe = Boolean(window.hsFeedbackPreview),
        Xe = Boolean(Oe(Ce)),
        Ge = Oe(Me),
        Ke = Oe(qe),
        Ye = Oe(Re) || He(),
        Ze = "true" === Oe(Pe),
        et = Fe("LOCAL_RENDERER"),
        tt = /MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split("MSIE")[1]) < 11,
        nt = /bot|python-requests|hubspot|phantomjs|bingpreview/i.test(navigator.userAgent);
    /hsWebSurveyTestId/.test(document.referrer);
    if (et) {
        const e = document.querySelector("body"),
            t = document.createElement("div");
        t.setAttribute("class", "UIRibbon-sc-1wnhcos-0 hwuPWx");
        t.innerText = "Web renderer local";
        t.style.top = "130px";
        t.style.zIndex = 5;
        e.appendChild(t)
    }
    const rt = document.head || document.getElementsByTagName("head")[0],
        ot = e => {
            const t = document.createElement("style");
            t.type = "text/css";
            t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e));
            return t
        };
    var it = (e, t, {
        onerror: n,
        headers: r = {},
        withCredentials: o = !1,
        data: i = {}
    } = {}) => {
        const s = new XMLHttpRequest;
        s.onreadystatechange = () => {
            if (s.readyState === XMLHttpRequest.DONE) {
                const {
                    responseText: e,
                    status: r
                } = s;
                if (r >= 200 && r < 300) {
                    const n = e ? JSON.parse(e) : {};
                    t(n)
                } else n && n(s)
            }
        };
        s.open("POST", e);
        o && (s.withCredentials = !0);
        Object.keys(r).forEach((e => {
            s.setRequestHeader(e, r[e])
        }));
        s.send(JSON.stringify(i))
    };
    const st = (e = window.document.cookie) => {
            const t = /csrf.app=([^;]+);?/.exec(e);
            return t && t[1]
        },
        at = () => ({
            Accept: "application/json, text/javascript, */*; q=0.01",
            "Content-type": "application/json",
            "X-HubSpot-CSRF-hubspotapi": st()
        }),
        ct = e => `hubspot${e?"qa":""}.com/feedback-proxy`,
        ut = {
            ["NPS"]: 1,
            ["CSAT"]: 3
        },
        dt = () => location,
        ht = () => {
            try {
                return window.top.innerWidth
            } catch (e) {
                return innerWidth
            }
        };
    (e => {
        rt.appendChild(ot(e))
    })(ve);
    const lt = window._hsq = window._hsq || [],
        ft = {
            portalId: ze,
            isPreview: Qe,
            isTest: Je
        },
        pt = t(Ye),
        bt = `https://${Qe&&/local/.test(dt().origin)||et?"local":"app"}${pt}.hubspot${"prod"===Ue?"":"qa"}.com`,
        mt = {};
    let gt, yt = "";
    window.hsFeedbackLoaded || (gt = new xe);
    const wt = ct("prod" !== Ue),
        vt = (e, t = (() => {})) => {
            it(`${`https://api${pt}.${wt}/v1`}/survey-config/CSAT/${e}/shown?${u({bundleVersion:i,portalId:De||ze})}`, t, {
                headers: at(),
                withCredentials: !0
            })
        },
        kt = (e, t = (() => {})) => {
            try {
                const n = `https://api${pt}.hubspot${"prod"===Ue?"":"qa"}.com`,
                    r = dt(),
                    o = new URL(r.href);
                it(`${n}/nudge/tracking/v1/nudge-event?portalId=${ze}`, t, {
                    headers: at(),
                    withCredentials: !0,
                    data: {
                        nudgeEvents: [{
                            app_name: o.pathname.split("/").filter(Boolean)[0] || "",
                            event_timestamp: Date.now(),
                            from_automated_test: document.cookie.includes("hs_selenium"),
                            locale: document.documentElement.lang || "en-us",
                            nudge: {
                                type: "POPUP_CSAT",
                                title: e || "no-title",
                                id: "csat-feedback-survey"
                            },
                            session_id: window.hubspot && window.hubspot.sessionId || "",
                            type: "EXTERNAL_RENDERED",
                            url: `${o.host}${o.pathname}`,
                            xpath: ""
                        }]
                    }
                })
            } catch (e) {}
        },
        $t = (e, t) => {
            switch (e) {
                case x:
                    yt = t && t.config && t.config.question || "";
                    Lt(f, S, {
                        mode: V,
                        payload: {
                            isHubspot: Xe,
                            portalId: ze,
                            response: t,
                            pageTitle: document.title,
                            pageUrl: location.href,
                            utk: ft.utk,
                            windowWidth: ht(),
                            hublet: Ye,
                            clientLoadOnly: Ze
                        }
                    });
                    gt._onSurveyLoaded(t);
                    break;
                case T:
                    gt._onConfigLoaded(t)
            }
        },
        St = () => {
            const e = mt[f];
            return e && e.data && e.data.parent.className.indexOf(me) >= 0
        },
        Et = A(d),
        xt = e => () => {
            e(O, {
                pageTitle: document.title,
                pageUrl: dt().href,
                windowWidth: ht()
            })
        },
        Ot = {
            FETCHER: {
                onInit: ({
                    sender: e
                }) => {
                    z((t => {
                        St() || e(w, t)
                    }))
                },
                handleMessages: $t,
                parentAttrs: {
                    id: pe,
                    title: "submit hubspot feedback"
                },
                path: Q
            },
            UI: {
                onInit: e => {
                    const {
                        sender: t
                    } = e, n = xt(t);
                    z(n);
                    j(window, "resize")(n);
                    j(document, "focus")((() => {
                        t(m)
                    }));
                    gt.initialiseUI(e);
                    return {
                        client: gt
                    }
                },
                handleMessages: (e, t) => {
                    Tt(f, (({
                        parent: n
                    }) => {
                        switch (e) {
                            case E:
                                {
                                    const {
                                        classes: e,
                                        displayOnScroll: r,
                                        surveyId: o,
                                        surveyLanguage: i,
                                        surveyType: s,
                                        userLocale: a
                                    } = t;
                                    if (Xe && i !== (Ke || a) || window.disabledHsPopups && window.disabledHsPopups.indexOf("FEEDBACK") > -1) return;
                                    const c = [...e, ...Qe ? ["preview"] : []].join(" ").toLowerCase();Be || void 0 === o || lt.push(["trackFeedbackView", {
                                        surveyId: o,
                                        surveyType: s
                                    }]);n.baseClasses = c;n.className = c;r ? gt.showOnScroll() : gt.show();
                                    if (s === ut.CSAT && Xe) {
                                        vt(o);
                                        kt(yt)
                                    }
                                    break
                                }
                            case b:
                                t ? ee(n, ye) : te(n, ye);
                                Et(e, t);
                                break;
                            case g:
                                gt.hide();
                                setTimeout((() => {
                                    n.className = n.baseClasses
                                }), 1e3);
                                break;
                            case $:
                                {
                                    const {
                                        newHeight: e,
                                        newWidth: r
                                    } = t;n.style.width = r ? `${r}px` : null;n.style.height = `${e}px`;
                                    break
                                }
                            default:
                                Et(e, t)
                        }
                    }))
                },
                parentAttrs: {
                    id: fe,
                    title: "submit hubspot feedback"
                },
                path: X
            }
        },
        It = e => {
            const {
                path: t,
                parentAttrs: n
            } = Ot[e], r = K("iframe", {
                frameborder: 0,
                title: "Submit HubSpot product feedback",
                src: `${bt}/${t}`
            }), o = K("div", n);
            Y(o, r);
            Y(document.body, o);
            return [r, o]
        },
        Tt = (e, t) => {
            if (mt[e]) {
                mt[e](t);
                return
            }
            const n = [t];
            mt[e] = e => {
                n.push(e)
            };
            const [r, o] = It(e);
            F(r, e, (({
                sender: t,
                subscribe: i
            }) => {
                const {
                    handleMessages: s,
                    onInit: a
                } = Ot[e];
                i(s);
                let c = {
                    frame: r,
                    parent: o,
                    subscribe: i,
                    sender: t
                };
                c = Object.assign({}, c, a(c) || {});
                const u = e => {
                    e(c)
                };
                mt[e] = u;
                u.data = c;
                n.forEach(mt[e])
            }))
        },
        Lt = (e, t, n = {}) => {
            Tt(e, (({
                sender: e
            }) => {
                e(t, n)
            }))
        },
        _t = ({
            frame: e
        }) => {
            const t = N(e, h);
            q(d)(t);
            Et(v)
        };
    if (!nt && !tt && !window.hsFeedbackLoaded)
        if (Be || Qe) {
            let e, t = {
                pageUrl: dt().href
            };
            Tt(f, (n => {
                const {
                    sender: r
                } = n;
                if (Be) {
                    e = D;
                    t = {
                        livePreviewId: Ve
                    }
                } else {
                    e = B;
                    _t(n)
                }
                r(S, {
                    mode: e,
                    hublet: Ye,
                    clientLoadOnly: Ze,
                    windowWidth: ht(),
                    payload: Object.assign({}, ft, t)
                })
            }))
        } else if (Xe) {
        ft.hsEmail = Ge;
        Tt(l, (({
            sender: e
        }) => {
            e(S, {
                email: Ge,
                portalId: De,
                pageUrl: dt().href,
                targetPortalId: ze,
                isHubspot: Xe,
                hublet: Ye,
                clientLoadOnly: Ze
            });
            gt.setFetcher(e)
        }))
    } else lt.push(["addCookieListener", e => {
        if (!e) return;
        const t = e.split(".")[1];
        ft.utk = t;
        Tt(l, (e => {
            const {
                sender: n
            } = e;
            n(S, {
                pageUrl: dt().href,
                portalId: ze,
                utk: t,
                hublet: Ye,
                clientLoadOnly: Ze
            });
            gt.setFetcher(n)
        }))
    }]);
    window.hsFeedbackLoaded = !0
}();
//# sourceMappingURL=//static.hsappstatic.net/feedback-web-renderer-ui/static-1.30691/bundles/popupInjector.js.map