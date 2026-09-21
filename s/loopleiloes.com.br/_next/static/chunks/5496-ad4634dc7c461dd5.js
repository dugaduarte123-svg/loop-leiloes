"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [5496], {
        95496: function(e, t, r) {
            r.d(t, {
                X: function() {
                    return o
                }
            });
            var s = r(87536),
                a = function(e, t, r) {
                    if (e && "reportValidity" in e) {
                        var a = (0, s.U2)(r, t);
                        e.setCustomValidity(a && a.message || ""), e.reportValidity()
                    }
                },
                n = function(e, t) {
                    var r = function(r) {
                        var s = t.fields[r];
                        s && s.ref && "reportValidity" in s.ref ? a(s.ref, r, e) : s.refs && s.refs.forEach((function(t) {
                            return a(t, r, e)
                        }))
                    };
                    for (var s in t.fields) r(s)
                },
                i = function(e, t) {
                    t.shouldUseNativeValidation && n(e, t);
                    var r = {};
                    for (var a in e) {
                        var i = (0, s.U2)(t.fields, a);
                        (0, s.t8)(r, a, Object.assign(e[a], {
                            ref: i && i.ref
                        }))
                    }
                    return r
                },
                o = function(e, t, r) {
                    return void 0 === t && (t = {}), void 0 === r && (r = {}),
                        function(o, u, l) {
                            try {
                                return Promise.resolve(function(s, i) {
                                    try {
                                        var c = (t.context, Promise.resolve(e["sync" === r.mode ? "validateSync" : "validate"](o, Object.assign({
                                            abortEarly: !1
                                        }, t, {
                                            context: u
                                        }))).then((function(e) {
                                            return l.shouldUseNativeValidation && n({}, l), {
                                                values: r.rawValues ? o : e,
                                                errors: {}
                                            }
                                        })))
                                    } catch (a) {
                                        return i(a)
                                    }
                                    return c && c.then ? c.then(void 0, i) : c
                                }(0, (function(e) {
                                    if (!e.inner) throw e;
                                    return {
                                        values: {},
                                        errors: i((t = e, r = !l.shouldUseNativeValidation && "all" === l.criteriaMode, (t.inner || []).reduce((function(e, t) {
                                            if (e[t.path] || (e[t.path] = {
                                                    message: t.message,
                                                    type: t.type
                                                }), r) {
                                                var a = e[t.path].types,
                                                    n = a && a[t.type];
                                                e[t.path] = (0, s.KN)(t.path, r, e, t.type, n ? [].concat(n, t.message) : t.message)
                                            }
                                            return e
                                        }), {})), l)
                                    };
                                    var t, r
                                })))
                            } catch (a) {
                                return Promise.reject(a)
                            }
                        }
                }
        },
        87536: function(e, t, r) {
            r.d(t, {
                Gc: function() {
                    return E
                },
                KN: function() {
                    return $
                },
                Qr: function() {
                    return I
                },
                RV: function() {
                    return j
                },
                U2: function() {
                    return y
                },
                bc: function() {
                    return W
                },
                cI: function() {
                    return De
                },
                t8: function() {
                    return G
                }
            });
            var s = r(67294),
                a = e => "checkbox" === e.type,
                n = e => e instanceof Date,
                i = e => null == e;
            const o = e => "object" === typeof e;
            var u = e => !i(e) && !Array.isArray(e) && o(e) && !n(e),
                l = e => u(e) && e.target ? a(e.target) ? e.target.checked : e.target.value : e,
                c = (e, t) => e.has((e => e.substring(0, e.search(/\.\d+(\.|$)/)) || e)(t)),
                d = e => Array.isArray(e) ? e.filter(Boolean) : [],
                f = e => void 0 === e,
                y = (e, t, r) => {
                    if (!t || !u(e)) return r;
                    const s = d(t.split(/[,[\].]+?/)).reduce(((e, t) => i(e) ? e : e[t]), e);
                    return f(s) || s === e ? f(e[t]) ? r : e[t] : s
                };
            const m = "blur",
                h = "focusout",
                g = "change",
                v = "onBlur",
                p = "onChange",
                b = "onSubmit",
                _ = "onTouched",
                V = "all",
                w = "max",
                A = "min",
                F = "maxLength",
                S = "minLength",
                k = "pattern",
                x = "required",
                D = "validate",
                C = s.createContext(null),
                E = () => s.useContext(C),
                j = e => {
                    const {
                        children: t,
                        ...r
                    } = e;
                    return s.createElement(C.Provider, {
                        value: r
                    }, t)
                };
            var O = (e, t, r, s = !0) => {
                    const a = {};
                    for (const n in e) Object.defineProperty(a, n, {
                        get: () => {
                            const a = n;
                            return t[a] !== V && (t[a] = !s || V), r && (r[a] = !0), e[a]
                        }
                    });
                    return a
                },
                U = e => u(e) && !Object.keys(e).length,
                N = (e, t, r) => {
                    const {
                        name: s,
                        ...a
                    } = e;
                    return U(a) || Object.keys(a).length >= Object.keys(t).length || Object.keys(a).find((e => t[e] === (!r || V)))
                },
                T = e => Array.isArray(e) ? e : [e],
                B = (e, t, r) => r && t ? e === t : !e || !t || e === t || T(e).some((e => e && (e.startsWith(t) || t.startsWith(e))));

            function L(e) {
                const t = s.useRef(e);
                t.current = e, s.useEffect((() => {
                    const r = !e.disabled && t.current.subject.subscribe({
                        next: t.current.callback
                    });
                    return () => (e => {
                        e && e.unsubscribe()
                    })(r)
                }), [e.disabled])
            }
            var M = e => "string" === typeof e,
                R = (e, t, r, s) => {
                    const a = Array.isArray(e);
                    return M(e) ? (s && t.watch.add(e), y(r, e)) : a ? e.map((e => (s && t.watch.add(e), y(r, e)))) : (s && (t.watchAll = !0), r)
                },
                q = e => "function" === typeof e,
                P = e => {
                    for (const t in e)
                        if (q(e[t])) return !0;
                    return !1
                };

            function W(e) {
                const t = E(),
                    {
                        name: r,
                        control: a = t.control,
                        shouldUnregister: n
                    } = e,
                    i = c(a._names.array, r),
                    o = function(e) {
                        const t = E(),
                            {
                                control: r = t.control,
                                name: a,
                                defaultValue: n,
                                disabled: i,
                                exact: o
                            } = e || {},
                            l = s.useRef(a);
                        l.current = a;
                        const c = s.useCallback((e => {
                            if (B(l.current, e.name, o)) {
                                const t = R(l.current, r._names, e.values || r._formValues);
                                y(f(l.current) || u(t) && !P(t) ? { ...t
                                } : Array.isArray(t) ? [...t] : f(t) ? n : t)
                            }
                        }), [r, o, n]);
                        L({
                            disabled: i,
                            subject: r._subjects.watch,
                            callback: c
                        });
                        const [d, y] = s.useState(f(n) ? r._getWatch(a) : n);
                        return s.useEffect((() => {
                            r._removeUnmounted()
                        })), d
                    }({
                        control: a,
                        name: r,
                        defaultValue: y(a._formValues, r, y(a._defaultValues, r, e.defaultValue)),
                        exact: !0
                    }),
                    d = function(e) {
                        const t = E(),
                            {
                                control: r = t.control,
                                disabled: a,
                                name: n,
                                exact: i
                            } = e || {},
                            [o, u] = s.useState(r._formState),
                            l = s.useRef({
                                isDirty: !1,
                                dirtyFields: !1,
                                touchedFields: !1,
                                isValidating: !1,
                                isValid: !1,
                                errors: !1
                            }),
                            c = s.useRef(n),
                            d = s.useRef(!0);
                        return c.current = n, L({
                            disabled: a,
                            callback: s.useCallback((e => d.current && B(c.current, e.name, i) && N(e, l.current) && u({ ...r._formState,
                                ...e
                            })), [r, i]),
                            subject: r._subjects.state
                        }), s.useEffect((() => (d.current = !0, () => {
                            d.current = !1
                        })), []), O(o, r._proxyFormState, l.current, !1)
                    }({
                        control: a,
                        name: r
                    }),
                    h = s.useRef(a.register(r, { ...e.rules,
                        value: o
                    }));
                return s.useEffect((() => {
                    const e = (e, t) => {
                        const r = y(a._fields, e);
                        r && (r._f.mount = t)
                    };
                    return e(r, !0), () => {
                        const t = a._options.shouldUnregister || n;
                        (i ? t && !a._stateFlags.action : t) ? a.unregister(r): e(r, !1)
                    }
                }), [r, a, i, n]), {
                    field: {
                        name: r,
                        value: o,
                        onChange: s.useCallback((e => {
                            h.current.onChange({
                                target: {
                                    value: l(e),
                                    name: r
                                },
                                type: g
                            })
                        }), [r]),
                        onBlur: s.useCallback((() => {
                            h.current.onBlur({
                                target: {
                                    value: y(a._formValues, r),
                                    name: r
                                },
                                type: m
                            })
                        }), [r, a]),
                        ref: s.useCallback((e => {
                            const t = y(a._fields, r);
                            e && t && e.focus && (t._f.ref = {
                                focus: () => e.focus(),
                                select: () => e.select(),
                                setCustomValidity: t => e.setCustomValidity(t),
                                reportValidity: () => e.reportValidity()
                            })
                        }), [r, a._fields])
                    },
                    formState: d,
                    fieldState: Object.defineProperties({}, {
                        invalid: {
                            get: () => !!y(d.errors, r)
                        },
                        isDirty: {
                            get: () => !!y(d.dirtyFields, r)
                        },
                        isTouched: {
                            get: () => !!y(d.touchedFields, r)
                        },
                        error: {
                            get: () => y(d.errors, r)
                        }
                    })
                }
            }
            const I = e => e.render(W(e));
            var $ = (e, t, r, s, a) => t ? { ...r[e],
                    types: { ...r[e] && r[e].types ? r[e].types : {},
                        [s]: a || !0
                    }
                } : {},
                H = e => /^\w*$/.test(e),
                K = e => d(e.replace(/["|']|\]/g, "").split(/\.|\[/));

            function G(e, t, r) {
                let s = -1;
                const a = H(t) ? [t] : K(t),
                    n = a.length,
                    i = n - 1;
                for (; ++s < n;) {
                    const t = a[s];
                    let n = r;
                    if (s !== i) {
                        const r = e[t];
                        n = u(r) || Array.isArray(r) ? r : isNaN(+a[s + 1]) ? {} : []
                    }
                    e[t] = n, e = e[t]
                }
                return e
            }
            const Q = (e, t, r) => {
                for (const s of r || Object.keys(e)) {
                    const r = y(e, s);
                    if (r) {
                        const {
                            _f: e,
                            ...s
                        } = r;
                        if (e && t(e.name)) {
                            if (e.ref.focus && f(e.ref.focus())) break;
                            if (e.refs) {
                                e.refs[0].focus();
                                break
                            }
                        } else u(s) && Q(s, t)
                    }
                }
            };
            var X = (e, t, r) => !r && (t.watchAll || t.watch.has(e) || [...t.watch].some((t => e.startsWith(t) && /^\.\w+/.test(e.slice(t.length)))));
            var z = "undefined" !== typeof window && "undefined" !== typeof window.HTMLElement && "undefined" !== typeof document;

            function J(e) {
                let t;
                const r = Array.isArray(e);
                if (e instanceof Date) t = new Date(e);
                else if (e instanceof Set) t = new Set(e);
                else {
                    if (z && (e instanceof Blob || e instanceof FileList) || !r && !u(e)) return e;
                    t = r ? [] : {};
                    for (const r in e) {
                        if (q(e[r])) {
                            t = e;
                            break
                        }
                        t[r] = J(e[r])
                    }
                }
                return t
            }

            function Y(e, t) {
                const r = H(t) ? [t] : K(t),
                    s = 1 == r.length ? e : function(e, t) {
                        const r = t.slice(0, -1).length;
                        let s = 0;
                        for (; s < r;) e = f(e) ? s++ : e[t[s++]];
                        return e
                    }(e, r),
                    a = r[r.length - 1];
                let n;
                s && delete s[a];
                for (let i = 0; i < r.slice(0, -1).length; i++) {
                    let t, s = -1;
                    const a = r.slice(0, -(i + 1)),
                        o = a.length - 1;
                    for (i > 0 && (n = e); ++s < a.length;) {
                        const r = a[s];
                        t = t ? t[r] : e[r], o === s && (u(t) && U(t) || Array.isArray(t) && !t.filter((e => !f(e))).length) && (n ? delete n[r] : delete e[r]), n = t
                    }
                }
                return e
            }

            function Z() {
                let e = [];
                return {
                    get observers() {
                        return e
                    },
                    next: t => {
                        for (const r of e) r.next(t)
                    },
                    subscribe: t => (e.push(t), {
                        unsubscribe: () => {
                            e = e.filter((e => e !== t))
                        }
                    }),
                    unsubscribe: () => {
                        e = []
                    }
                }
            }
            var ee = e => i(e) || !o(e);

            function te(e, t) {
                if (ee(e) || ee(t)) return e === t;
                if (n(e) && n(t)) return e.getTime() === t.getTime();
                const r = Object.keys(e),
                    s = Object.keys(t);
                if (r.length !== s.length) return !1;
                for (const a of r) {
                    const r = e[a];
                    if (!s.includes(a)) return !1;
                    if ("ref" !== a) {
                        const e = t[a];
                        if (n(r) && n(e) || u(r) && u(e) || Array.isArray(r) && Array.isArray(e) ? !te(r, e) : r !== e) return !1
                    }
                }
                return !0
            }
            var re = e => ({
                    isOnSubmit: !e || e === b,
                    isOnBlur: e === v,
                    isOnChange: e === p,
                    isOnAll: e === V,
                    isOnTouch: e === _
                }),
                se = e => "boolean" === typeof e,
                ae = e => "file" === e.type,
                ne = e => {
                    const t = e ? e.ownerDocument : 0;
                    return e instanceof(t && t.defaultView ? t.defaultView.HTMLElement : HTMLElement)
                },
                ie = e => "select-multiple" === e.type,
                oe = e => "radio" === e.type,
                ue = e => ne(e) && e.isConnected;

            function le(e, t = {}) {
                const r = Array.isArray(e);
                if (u(e) || r)
                    for (const s in e) Array.isArray(e[s]) || u(e[s]) && !P(e[s]) ? (t[s] = Array.isArray(e[s]) ? [] : {}, le(e[s], t[s])) : i(e[s]) || (t[s] = !0);
                return t
            }

            function ce(e, t, r) {
                const s = Array.isArray(e);
                if (u(e) || s)
                    for (const a in e) Array.isArray(e[a]) || u(e[a]) && !P(e[a]) ? f(t) || ee(r[a]) ? r[a] = Array.isArray(e[a]) ? le(e[a], []) : { ...le(e[a])
                    } : ce(e[a], i(t) ? {} : t[a], r[a]) : r[a] = !te(e[a], t[a]);
                return r
            }
            var de = (e, t) => ce(e, t, le(t));
            const fe = {
                    value: !1,
                    isValid: !1
                },
                ye = {
                    value: !0,
                    isValid: !0
                };
            var me = e => {
                    if (Array.isArray(e)) {
                        if (e.length > 1) {
                            const t = e.filter((e => e && e.checked && !e.disabled)).map((e => e.value));
                            return {
                                value: t,
                                isValid: !!t.length
                            }
                        }
                        return e[0].checked && !e[0].disabled ? e[0].attributes && !f(e[0].attributes.value) ? f(e[0].value) || "" === e[0].value ? ye : {
                            value: e[0].value,
                            isValid: !0
                        } : ye : fe
                    }
                    return fe
                },
                he = (e, {
                    valueAsNumber: t,
                    valueAsDate: r,
                    setValueAs: s
                }) => f(e) ? e : t ? "" === e || i(e) ? NaN : +e : r && M(e) ? new Date(e) : s ? s(e) : e;
            const ge = {
                isValid: !1,
                value: null
            };
            var ve = e => Array.isArray(e) ? e.reduce(((e, t) => t && t.checked && !t.disabled ? {
                isValid: !0,
                value: t.value
            } : e), ge) : ge;

            function pe(e) {
                const t = e.ref;
                if (!(e.refs ? e.refs.every((e => e.disabled)) : t.disabled)) return ae(t) ? t.files : oe(t) ? ve(e.refs).value : ie(t) ? [...t.selectedOptions].map((({
                    value: e
                }) => e)) : a(t) ? me(e.refs).value : he(f(t.value) ? e.ref.value : t.value, e)
            }
            var be = e => e instanceof RegExp,
                _e = e => f(e) ? void 0 : be(e) ? e.source : u(e) ? be(e.value) ? e.value.source : e.value : e;

            function Ve(e, t, r) {
                const s = y(e, r);
                if (s || H(r)) return {
                    error: s,
                    name: r
                };
                const a = r.split(".");
                for (; a.length;) {
                    const s = a.join("."),
                        n = y(t, s),
                        i = y(e, s);
                    if (n && !Array.isArray(n) && r !== s) return {
                        name: r
                    };
                    if (i && i.type) return {
                        name: s,
                        error: i
                    };
                    a.pop()
                }
                return {
                    name: r
                }
            }
            var we = e => M(e) || s.isValidElement(e);

            function Ae(e, t, r = "validate") {
                if (we(e) || Array.isArray(e) && e.every(we) || se(e) && !e) return {
                    type: r,
                    message: we(e) ? e : "",
                    ref: t
                }
            }
            var Fe = e => u(e) && !be(e) ? e : {
                    value: e,
                    message: ""
                },
                Se = async (e, t, r, s) => {
                    const {
                        ref: n,
                        refs: o,
                        required: l,
                        maxLength: c,
                        minLength: d,
                        min: f,
                        max: y,
                        pattern: m,
                        validate: h,
                        name: g,
                        valueAsNumber: v,
                        mount: p,
                        disabled: b
                    } = e._f;
                    if (!p || b) return {};
                    const _ = o ? o[0] : n,
                        V = e => {
                            s && _.reportValidity && (_.setCustomValidity(se(e) ? "" : e || " "), _.reportValidity())
                        },
                        C = {},
                        E = oe(n),
                        j = a(n),
                        O = E || j,
                        N = (v || ae(n)) && !n.value || "" === t || Array.isArray(t) && !t.length,
                        T = $.bind(null, g, r, C),
                        B = (e, t, r, s = F, a = S) => {
                            const i = e ? t : r;
                            C[g] = {
                                type: e ? s : a,
                                message: i,
                                ref: n,
                                ...T(e ? s : a, i)
                            }
                        };
                    if (l && (!O && (N || i(t)) || se(t) && !t || j && !me(o).isValid || E && !ve(o).isValid)) {
                        const {
                            value: e,
                            message: t
                        } = we(l) ? {
                            value: !!l,
                            message: l
                        } : Fe(l);
                        if (e && (C[g] = {
                                type: x,
                                message: t,
                                ref: _,
                                ...T(x, t)
                            }, !r)) return V(t), C
                    }
                    if (!N && (!i(f) || !i(y))) {
                        let e, s;
                        const a = Fe(y),
                            o = Fe(f);
                        if (i(t) || isNaN(t)) {
                            const r = n.valueAsDate || new Date(t);
                            M(a.value) && (e = r > new Date(a.value)), M(o.value) && (s = r < new Date(o.value))
                        } else {
                            const r = n.valueAsNumber || +t;
                            i(a.value) || (e = r > a.value), i(o.value) || (s = r < o.value)
                        }
                        if ((e || s) && (B(!!e, a.message, o.message, w, A), !r)) return V(C[g].message), C
                    }
                    if ((c || d) && !N && M(t)) {
                        const e = Fe(c),
                            s = Fe(d),
                            a = !i(e.value) && t.length > e.value,
                            n = !i(s.value) && t.length < s.value;
                        if ((a || n) && (B(a, e.message, s.message), !r)) return V(C[g].message), C
                    }
                    if (m && !N && M(t)) {
                        const {
                            value: e,
                            message: s
                        } = Fe(m);
                        if (be(e) && !t.match(e) && (C[g] = {
                                type: k,
                                message: s,
                                ref: n,
                                ...T(k, s)
                            }, !r)) return V(s), C
                    }
                    if (h)
                        if (q(h)) {
                            const e = Ae(await h(t), _);
                            if (e && (C[g] = { ...e,
                                    ...T(D, e.message)
                                }, !r)) return V(e.message), C
                        } else if (u(h)) {
                        let e = {};
                        for (const s in h) {
                            if (!U(e) && !r) break;
                            const a = Ae(await h[s](t), _, s);
                            a && (e = { ...a,
                                ...T(s, a.message)
                            }, V(a.message), r && (C[g] = e))
                        }
                        if (!U(e) && (C[g] = {
                                ref: _,
                                ...e
                            }, !r)) return C
                    }
                    return V(!0), C
                };
            const ke = {
                mode: b,
                reValidateMode: p,
                shouldFocusError: !0
            };

            function xe(e = {}) {
                let t, r = { ...ke,
                        ...e
                    },
                    s = {
                        isDirty: !1,
                        isValidating: !1,
                        dirtyFields: {},
                        isSubmitted: !1,
                        submitCount: 0,
                        touchedFields: {},
                        isSubmitting: !1,
                        isSubmitSuccessful: !1,
                        isValid: !1,
                        errors: {}
                    },
                    o = {},
                    u = J(r.defaultValues) || {},
                    g = r.shouldUnregister ? {} : J(u),
                    v = {
                        action: !1,
                        mount: !1,
                        watch: !1
                    },
                    p = {
                        mount: new Set,
                        unMount: new Set,
                        array: new Set,
                        watch: new Set
                    },
                    b = 0,
                    _ = {};
                const w = {
                        isDirty: !1,
                        dirtyFields: !1,
                        touchedFields: !1,
                        isValidating: !1,
                        isValid: !1,
                        errors: !1
                    },
                    A = {
                        watch: Z(),
                        array: Z(),
                        state: Z()
                    },
                    F = re(r.mode),
                    S = re(r.reValidateMode),
                    k = r.criteriaMode === V,
                    x = async e => {
                        let t = !1;
                        return w.isValid && (t = r.resolver ? U((await j()).errors) : await O(o, !0), e || t === s.isValid || (s.isValid = t, A.state.next({
                            isValid: t
                        }))), t
                    },
                    D = (e, t, r, s) => {
                        const a = y(o, e);
                        if (a) {
                            const n = y(g, e, f(r) ? y(u, e) : r);
                            f(n) || s && s.defaultChecked || t ? G(g, e, t ? n : pe(a._f)) : L(e, n), v.mount && x()
                        }
                    },
                    C = (e, t, r, a, n) => {
                        let i = !1;
                        const o = {
                                name: e
                            },
                            l = y(s.touchedFields, e);
                        if (w.isDirty) {
                            const e = s.isDirty;
                            s.isDirty = o.isDirty = N(), i = e !== o.isDirty
                        }
                        if (w.dirtyFields && (!r || a)) {
                            const r = y(s.dirtyFields, e);
                            te(y(u, e), t) ? Y(s.dirtyFields, e) : G(s.dirtyFields, e, !0), o.dirtyFields = s.dirtyFields, i = i || r !== y(s.dirtyFields, e)
                        }
                        return r && !l && (G(s.touchedFields, e, r), o.touchedFields = s.touchedFields, i = i || w.touchedFields && l !== r), i && n && A.state.next(o), i ? o : {}
                    },
                    E = async (r, a, n, i) => {
                        const o = y(s.errors, r),
                            u = w.isValid && s.isValid !== a;
                        var l;
                        if (e.delayError && n ? (l = () => ((e, t) => {
                                G(s.errors, e, t), A.state.next({
                                    errors: s.errors
                                })
                            })(r, n), t = e => {
                                clearTimeout(b), b = window.setTimeout(l, e)
                            }, t(e.delayError)) : (clearTimeout(b), t = null, n ? G(s.errors, r, n) : Y(s.errors, r)), (n ? !te(o, n) : o) || !U(i) || u) {
                            const e = { ...i,
                                ...u ? {
                                    isValid: a
                                } : {},
                                errors: s.errors,
                                name: r
                            };
                            s = { ...s,
                                ...e
                            }, A.state.next(e)
                        }
                        _[r]--, w.isValidating && !Object.values(_).some((e => e)) && (A.state.next({
                            isValidating: !1
                        }), _ = {})
                    },
                    j = async e => r.resolver ? await r.resolver({ ...g
                    }, r.context, ((e, t, r, s) => {
                        const a = {};
                        for (const n of e) {
                            const e = y(t, n);
                            e && G(a, n, e._f)
                        }
                        return {
                            criteriaMode: r,
                            names: [...e],
                            fields: a,
                            shouldUseNativeValidation: s
                        }
                    })(e || p.mount, o, r.criteriaMode, r.shouldUseNativeValidation)) : {},
                    O = async (e, t, a = {
                        valid: !0
                    }) => {
                        for (const n in e) {
                            const i = e[n];
                            if (i) {
                                const {
                                    _f: e,
                                    ...n
                                } = i;
                                if (e) {
                                    const n = await Se(i, y(g, e.name), k, r.shouldUseNativeValidation);
                                    if (n[e.name] && (a.valid = !1, t)) break;
                                    t || (n[e.name] ? G(s.errors, e.name, n[e.name]) : Y(s.errors, e.name))
                                }
                                n && await O(n, t, a)
                            }
                        }
                        return a.valid
                    },
                    N = (e, t) => (e && t && G(g, e, t), !te(H(), u)),
                    B = (e, t, r) => {
                        const s = { ...v.mount ? g : f(t) ? u : M(e) ? {
                                [e]: t
                            } : t
                        };
                        return R(e, p, s, r)
                    },
                    L = (e, t, r = {}) => {
                        const s = y(o, e);
                        let n = t;
                        if (s) {
                            const r = s._f;
                            r && (!r.disabled && G(g, e, he(t, r)), n = z && ne(r.ref) && i(t) ? "" : t, ie(r.ref) ? [...r.ref.options].forEach((e => e.selected = n.includes(e.value))) : r.refs ? a(r.ref) ? r.refs.length > 1 ? r.refs.forEach((e => !e.disabled && (e.checked = Array.isArray(n) ? !!n.find((t => t === e.value)) : n === e.value))) : r.refs[0] && (r.refs[0].checked = !!n) : r.refs.forEach((e => e.checked = e.value === n)) : ae(r.ref) ? r.ref.value = "" : (r.ref.value = n, r.ref.type || A.watch.next({
                                name: e
                            })))
                        }(r.shouldDirty || r.shouldTouch) && C(e, n, r.shouldTouch, r.shouldDirty, !0), r.shouldValidate && $(e)
                    },
                    P = (e, t, r) => {
                        for (const s in t) {
                            const a = t[s],
                                i = `${e}.${s}`,
                                u = y(o, i);
                            !p.array.has(e) && ee(a) && (!u || u._f) || n(a) ? L(i, a, r) : P(i, a, r)
                        }
                    },
                    W = (e, t, r = {}) => {
                        const a = y(o, e),
                            n = p.array.has(e),
                            l = J(t);
                        G(g, e, l), n ? (A.array.next({
                            name: e,
                            values: g
                        }), (w.isDirty || w.dirtyFields) && r.shouldDirty && (s.dirtyFields = de(u, g), A.state.next({
                            name: e,
                            dirtyFields: s.dirtyFields,
                            isDirty: N(e, l)
                        }))) : !a || a._f || i(l) ? L(e, l, r) : P(e, l, r), X(e, p) && A.state.next({}), A.watch.next({
                            name: e
                        })
                    },
                    I = async e => {
                        const a = e.target;
                        let n = a.name;
                        const i = y(o, n);
                        if (i) {
                            let c, d;
                            const f = a.type ? pe(i._f) : l(e),
                                v = e.type === m || e.type === h,
                                b = !((u = i._f).mount && (u.required || u.min || u.max || u.maxLength || u.minLength || u.pattern || u.validate)) && !r.resolver && !y(s.errors, n) && !i._f.deps || ((e, t, r, s, a) => !a.isOnAll && (!r && a.isOnTouch ? !(t || e) : (r ? s.isOnBlur : a.isOnBlur) ? !e : !(r ? s.isOnChange : a.isOnChange) || e))(v, y(s.touchedFields, n), s.isSubmitted, S, F),
                                V = X(n, p, v);
                            G(g, n, f), v ? (i._f.onBlur && i._f.onBlur(e), t && t(0)) : i._f.onChange && i._f.onChange(e);
                            const w = C(n, f, v, !1),
                                D = !U(w) || V;
                            if (!v && A.watch.next({
                                    name: n,
                                    type: e.type
                                }), b) return D && A.state.next({
                                name: n,
                                ...V ? {} : w
                            });
                            if (!v && V && A.state.next({}), _[n] = (_[n], 1), A.state.next({
                                    isValidating: !0
                                }), r.resolver) {
                                const {
                                    errors: e
                                } = await j([n]), t = Ve(s.errors, o, n), r = Ve(e, o, t.name || n);
                                c = r.error, n = r.name, d = U(e)
                            } else c = (await Se(i, y(g, n), k, r.shouldUseNativeValidation))[n], d = await x(!0);
                            i._f.deps && $(i._f.deps), E(n, d, c, w)
                        }
                        var u
                    },
                    $ = async (e, t = {}) => {
                        let a, n;
                        const i = T(e);
                        if (A.state.next({
                                isValidating: !0
                            }), r.resolver) {
                            const t = await (async e => {
                                const {
                                    errors: t
                                } = await j();
                                if (e)
                                    for (const r of e) {
                                        const e = y(t, r);
                                        e ? G(s.errors, r, e) : Y(s.errors, r)
                                    } else s.errors = t;
                                return t
                            })(f(e) ? e : i);
                            a = U(t), n = e ? !i.some((e => y(t, e))) : a
                        } else e ? (n = (await Promise.all(i.map((async e => {
                            const t = y(o, e);
                            return await O(t && t._f ? {
                                [e]: t
                            } : t)
                        })))).every(Boolean), (n || s.isValid) && x()) : n = a = await O(o);
                        return A.state.next({ ...!M(e) || w.isValid && a !== s.isValid ? {} : {
                                name: e
                            },
                            ...r.resolver ? {
                                isValid: a
                            } : {},
                            errors: s.errors,
                            isValidating: !1
                        }), t.shouldFocus && !n && Q(o, (e => y(s.errors, e)), e ? i : p.mount), n
                    },
                    H = e => {
                        const t = { ...u,
                            ...v.mount ? g : {}
                        };
                        return f(e) ? t : M(e) ? y(t, e) : e.map((e => y(t, e)))
                    },
                    K = (e, t) => ({
                        invalid: !!y((t || s).errors, e),
                        isDirty: !!y((t || s).dirtyFields, e),
                        isTouched: !!y((t || s).touchedFields, e),
                        error: y((t || s).errors, e)
                    }),
                    le = (e, t = {}) => {
                        for (const a of e ? T(e) : p.mount) p.mount.delete(a), p.array.delete(a), y(o, a) && (t.keepValue || (Y(o, a), Y(g, a)), !t.keepError && Y(s.errors, a), !t.keepDirty && Y(s.dirtyFields, a), !t.keepTouched && Y(s.touchedFields, a), !r.shouldUnregister && !t.keepDefaultValue && Y(u, a));
                        A.watch.next({}), A.state.next({ ...s,
                            ...t.keepDirty ? {
                                isDirty: N()
                            } : {}
                        }), !t.keepIsValid && x()
                    },
                    ce = (e, t = {}) => {
                        let s = y(o, e);
                        const n = se(t.disabled);
                        return G(o, e, {
                            _f: { ...s && s._f ? s._f : {
                                    ref: {
                                        name: e
                                    }
                                },
                                name: e,
                                mount: !0,
                                ...t
                            }
                        }), p.mount.add(e), s ? n && G(g, e, t.disabled ? void 0 : y(g, e, pe(s._f))) : D(e, !0, t.value), { ...n ? {
                                disabled: t.disabled
                            } : {},
                            ...r.shouldUseNativeValidation ? {
                                required: !!t.required,
                                min: _e(t.min),
                                max: _e(t.max),
                                minLength: _e(t.minLength),
                                maxLength: _e(t.maxLength),
                                pattern: _e(t.pattern)
                            } : {},
                            name: e,
                            onChange: I,
                            onBlur: I,
                            ref: n => {
                                if (n) {
                                    ce(e, t), s = y(o, e);
                                    const r = f(n.value) && n.querySelectorAll && n.querySelectorAll("input,select,textarea")[0] || n,
                                        i = (e => oe(e) || a(e))(r),
                                        l = s._f.refs || [];
                                    if (i ? l.find((e => e === r)) : r === s._f.ref) return;
                                    G(o, e, {
                                        _f: { ...s._f,
                                            ...i ? {
                                                refs: [...l.filter(ue), r, ...Array.isArray(y(u, e)) ? [{}] : []],
                                                ref: {
                                                    type: r.type,
                                                    name: e
                                                }
                                            } : {
                                                ref: r
                                            }
                                        }
                                    }), D(e, !1, void 0, r)
                                } else s = y(o, e, {}), s._f && (s._f.mount = !1), (r.shouldUnregister || t.shouldUnregister) && (!c(p.array, e) || !v.action) && p.unMount.add(e)
                            }
                        }
                    };
                return {
                    control: {
                        register: ce,
                        unregister: le,
                        getFieldState: K,
                        _executeSchema: j,
                        _getWatch: B,
                        _getDirty: N,
                        _updateValid: x,
                        _removeUnmounted: () => {
                            for (const e of p.unMount) {
                                const t = y(o, e);
                                t && (t._f.refs ? t._f.refs.every((e => !ue(e))) : !ue(t._f.ref)) && le(e)
                            }
                            p.unMount = new Set
                        },
                        _updateFieldArray: (e, t = [], r, a, n = !0, i = !0) => {
                            if (a && r) {
                                if (v.action = !0, i && Array.isArray(y(o, e))) {
                                    const t = r(y(o, e), a.argA, a.argB);
                                    n && G(o, e, t)
                                }
                                if (w.errors && i && Array.isArray(y(s.errors, e))) {
                                    const t = r(y(s.errors, e), a.argA, a.argB);
                                    n && G(s.errors, e, t), ((e, t) => {
                                        !d(y(e, t)).length && Y(e, t)
                                    })(s.errors, e)
                                }
                                if (w.touchedFields && i && Array.isArray(y(s.touchedFields, e))) {
                                    const t = r(y(s.touchedFields, e), a.argA, a.argB);
                                    n && G(s.touchedFields, e, t)
                                }
                                w.dirtyFields && (s.dirtyFields = de(u, g)), A.state.next({
                                    isDirty: N(e, t),
                                    dirtyFields: s.dirtyFields,
                                    errors: s.errors,
                                    isValid: s.isValid
                                })
                            } else G(g, e, t)
                        },
                        _getFieldArray: t => d(y(v.mount ? g : u, t, e.shouldUnregister ? y(u, t, []) : [])),
                        _subjects: A,
                        _proxyFormState: w,
                        get _fields() {
                            return o
                        },
                        get _formValues() {
                            return g
                        },
                        get _stateFlags() {
                            return v
                        },
                        set _stateFlags(e) {
                            v = e
                        },
                        get _defaultValues() {
                            return u
                        },
                        get _names() {
                            return p
                        },
                        set _names(e) {
                            p = e
                        },
                        get _formState() {
                            return s
                        },
                        set _formState(e) {
                            s = e
                        },
                        get _options() {
                            return r
                        },
                        set _options(e) {
                            r = { ...r,
                                ...e
                            }
                        }
                    },
                    trigger: $,
                    register: ce,
                    handleSubmit: (e, t) => async a => {
                        a && (a.preventDefault && a.preventDefault(), a.persist && a.persist());
                        let n = !0,
                            i = J(g);
                        A.state.next({
                            isSubmitting: !0
                        });
                        try {
                            if (r.resolver) {
                                const {
                                    errors: e,
                                    values: t
                                } = await j();
                                s.errors = e, i = t
                            } else await O(o);
                            U(s.errors) ? (A.state.next({
                                errors: {},
                                isSubmitting: !0
                            }), await e(i, a)) : (t && await t({ ...s.errors
                            }, a), r.shouldFocusError && Q(o, (e => y(s.errors, e)), p.mount))
                        } catch (u) {
                            throw n = !1, u
                        } finally {
                            s.isSubmitted = !0, A.state.next({
                                isSubmitted: !0,
                                isSubmitting: !1,
                                isSubmitSuccessful: U(s.errors) && n,
                                submitCount: s.submitCount + 1,
                                errors: s.errors
                            })
                        }
                    },
                    watch: (e, t) => q(e) ? A.watch.subscribe({
                        next: r => e(B(void 0, t), r)
                    }) : B(e, t, !0),
                    setValue: W,
                    getValues: H,
                    reset: (t, r = {}) => {
                        const a = t || u,
                            n = J(a),
                            i = t && !U(t) ? n : u;
                        if (r.keepDefaultValues || (u = a), !r.keepValues) {
                            if (r.keepDirtyValues)
                                for (const e of p.mount) y(s.dirtyFields, e) ? G(i, e, y(g, e)) : W(e, y(i, e));
                            else {
                                if (z && f(t))
                                    for (const e of p.mount) {
                                        const t = y(o, e);
                                        if (t && t._f) {
                                            const e = Array.isArray(t._f.refs) ? t._f.refs[0] : t._f.ref;
                                            try {
                                                ne(e) && e.closest("form").reset();
                                                break
                                            } catch (l) {}
                                        }
                                    }
                                o = {}
                            }
                            g = e.shouldUnregister ? r.keepDefaultValues ? J(u) : {} : n, A.array.next({
                                values: i
                            }), A.watch.next({
                                values: i
                            })
                        }
                        p = {
                            mount: new Set,
                            unMount: new Set,
                            array: new Set,
                            watch: new Set,
                            watchAll: !1,
                            focus: ""
                        }, v.mount = !w.isValid || !!r.keepIsValid, v.watch = !!e.shouldUnregister, A.state.next({
                            submitCount: r.keepSubmitCount ? s.submitCount : 0,
                            isDirty: r.keepDirty || r.keepDirtyValues ? s.isDirty : !(!r.keepDefaultValues || te(t, u)),
                            isSubmitted: !!r.keepIsSubmitted && s.isSubmitted,
                            dirtyFields: r.keepDirty || r.keepDirtyValues ? s.dirtyFields : r.keepDefaultValues && t ? de(u, t) : {},
                            touchedFields: r.keepTouched ? s.touchedFields : {},
                            errors: r.keepErrors ? s.errors : {},
                            isSubmitting: !1,
                            isSubmitSuccessful: !1
                        })
                    },
                    resetField: (e, t = {}) => {
                        y(o, e) && (f(t.defaultValue) ? W(e, y(u, e)) : (W(e, t.defaultValue), G(u, e, t.defaultValue)), t.keepTouched || Y(s.touchedFields, e), t.keepDirty || (Y(s.dirtyFields, e), s.isDirty = t.defaultValue ? N(e, y(u, e)) : N()), t.keepError || (Y(s.errors, e), w.isValid && x()), A.state.next({ ...s
                        }))
                    },
                    clearErrors: e => {
                        e ? T(e).forEach((e => Y(s.errors, e))) : s.errors = {}, A.state.next({
                            errors: s.errors
                        })
                    },
                    unregister: le,
                    setError: (e, t, r) => {
                        const a = (y(o, e, {
                            _f: {}
                        })._f || {}).ref;
                        G(s.errors, e, { ...t,
                            ref: a
                        }), A.state.next({
                            name: e,
                            errors: s.errors,
                            isValid: !1
                        }), r && r.shouldFocus && a && a.focus && a.focus()
                    },
                    setFocus: (e, t = {}) => {
                        const r = y(o, e)._f,
                            s = r.refs ? r.refs[0] : r.ref;
                        s.focus(), t.shouldSelect && s.select()
                    },
                    getFieldState: K
                }
            }

            function De(e = {}) {
                const t = s.useRef(),
                    [r, a] = s.useState({
                        isDirty: !1,
                        isValidating: !1,
                        dirtyFields: {},
                        isSubmitted: !1,
                        submitCount: 0,
                        touchedFields: {},
                        isSubmitting: !1,
                        isSubmitSuccessful: !1,
                        isValid: !1,
                        errors: {}
                    });
                t.current ? t.current.control._options = e : t.current = { ...xe(e),
                    formState: r
                };
                const n = t.current.control,
                    i = s.useCallback((e => {
                        N(e, n._proxyFormState, !0) && (n._formState = { ...n._formState,
                            ...e
                        }, a({ ...n._formState
                        }))
                    }), [n]);
                return L({
                    subject: n._subjects.state,
                    callback: i
                }), s.useEffect((() => {
                    n._stateFlags.mount || (n._proxyFormState.isValid && n._updateValid(), n._stateFlags.mount = !0), n._stateFlags.watch && (n._stateFlags.watch = !1, n._subjects.state.next({})), n._removeUnmounted()
                })), t.current.formState = O(r, n._proxyFormState), t.current
            }
        }
    }
]);