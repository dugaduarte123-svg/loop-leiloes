"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [6999], {
        89659: function(e, n, o) {
            var a = o(87462),
                t = o(45987),
                r = o(67294),
                i = o(86010),
                l = o(93871),
                c = o(1591),
                s = o(24896),
                d = o(17294),
                u = o(22318),
                p = r.forwardRef((function(e, n) {
                    var o = e.classes,
                        c = e.className,
                        p = e.color,
                        m = void 0 === p ? "primary" : p,
                        f = e.component,
                        g = void 0 === f ? "a" : f,
                        h = e.onBlur,
                        v = e.onFocus,
                        b = e.TypographyClasses,
                        Z = e.underline,
                        C = void 0 === Z ? "hover" : Z,
                        y = e.variant,
                        x = void 0 === y ? "inherit" : y,
                        z = (0, t.Z)(e, ["classes", "className", "color", "component", "onBlur", "onFocus", "TypographyClasses", "underline", "variant"]),
                        E = (0, s.Z)(),
                        k = E.isFocusVisible,
                        M = E.onBlurVisible,
                        L = E.ref,
                        S = r.useState(!1),
                        N = S[0],
                        w = S[1],
                        A = (0, d.Z)(n, L);
                    return r.createElement(u.Z, (0, a.Z)({
                        className: (0, i.Z)(o.root, o["underline".concat((0, l.Z)(C))], c, N && o.focusVisible, "button" === g && o.button),
                        classes: b,
                        color: m,
                        component: g,
                        onBlur: function(e) {
                            N && (M(), w(!1)), h && h(e)
                        },
                        onFocus: function(e) {
                            k(e) && w(!0), v && v(e)
                        },
                        ref: A,
                        variant: x
                    }, z))
                }));
            n.Z = (0, c.Z)({
                root: {},
                underlineNone: {
                    textDecoration: "none"
                },
                underlineHover: {
                    textDecoration: "none",
                    "&:hover": {
                        textDecoration: "underline"
                    }
                },
                underlineAlways: {
                    textDecoration: "underline"
                },
                button: {
                    position: "relative",
                    WebkitTapHighlightColor: "transparent",
                    backgroundColor: "transparent",
                    outline: 0,
                    border: 0,
                    margin: 0,
                    borderRadius: 0,
                    padding: 0,
                    cursor: "pointer",
                    userSelect: "none",
                    verticalAlign: "middle",
                    "-moz-appearance": "none",
                    "-webkit-appearance": "none",
                    "&::-moz-focus-inner": {
                        borderStyle: "none"
                    },
                    "&$focusVisible": {
                        outline: "auto"
                    }
                },
                focusVisible: {}
            }, {
                name: "MuiLink"
            })(p)
        },
        8936: function(e, n, o) {
            o.d(n, {
                Z: function() {
                    return y
                }
            });
            var a = o(45987),
                t = o(87462),
                r = o(67294),
                i = o(86010),
                l = o(59693),
                c = o(1591),
                s = o(79895),
                d = o(63786),
                u = (0, d.Z)(r.createElement("path", {
                    d: "M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"
                }), "SuccessOutlined"),
                p = (0, d.Z)(r.createElement("path", {
                    d: "M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"
                }), "ReportProblemOutlined"),
                m = (0, d.Z)(r.createElement("path", {
                    d: "M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                }), "ErrorOutline"),
                f = (0, d.Z)(r.createElement("path", {
                    d: "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"
                }), "InfoOutlined"),
                g = o(17694),
                h = o(17812),
                v = o(93871),
                b = {
                    success: r.createElement(u, {
                        fontSize: "inherit"
                    }),
                    warning: r.createElement(p, {
                        fontSize: "inherit"
                    }),
                    error: r.createElement(m, {
                        fontSize: "inherit"
                    }),
                    info: r.createElement(f, {
                        fontSize: "inherit"
                    })
                },
                Z = r.createElement(g.Z, {
                    fontSize: "small"
                }),
                C = r.forwardRef((function(e, n) {
                    var o = e.action,
                        l = e.children,
                        c = e.classes,
                        d = e.className,
                        u = e.closeText,
                        p = void 0 === u ? "Close" : u,
                        m = e.color,
                        f = e.icon,
                        g = e.iconMapping,
                        C = void 0 === g ? b : g,
                        y = e.onClose,
                        x = e.role,
                        z = void 0 === x ? "alert" : x,
                        E = e.severity,
                        k = void 0 === E ? "success" : E,
                        M = e.variant,
                        L = void 0 === M ? "standard" : M,
                        S = (0, a.Z)(e, ["action", "children", "classes", "className", "closeText", "color", "icon", "iconMapping", "onClose", "role", "severity", "variant"]);
                    return r.createElement(s.Z, (0, t.Z)({
                        role: z,
                        square: !0,
                        elevation: 0,
                        className: (0, i.Z)(c.root, c["".concat(L).concat((0, v.Z)(m || k))], d),
                        ref: n
                    }, S), !1 !== f ? r.createElement("div", {
                        className: c.icon
                    }, f || C[k] || b[k]) : null, r.createElement("div", {
                        className: c.message
                    }, l), null != o ? r.createElement("div", {
                        className: c.action
                    }, o) : null, null == o && y ? r.createElement("div", {
                        className: c.action
                    }, r.createElement(h.Z, {
                        size: "small",
                        "aria-label": p,
                        title: p,
                        color: "inherit",
                        onClick: y
                    }, Z)) : null)
                })),
                y = (0, c.Z)((function(e) {
                    var n = "light" === e.palette.type ? l._j : l.$n,
                        o = "light" === e.palette.type ? l.$n : l._j;
                    return {
                        root: (0, t.Z)({}, e.typography.body2, {
                            borderRadius: e.shape.borderRadius,
                            backgroundColor: "transparent",
                            display: "flex",
                            padding: "6px 16px"
                        }),
                        standardSuccess: {
                            color: n(e.palette.success.main, .6),
                            backgroundColor: o(e.palette.success.main, .9),
                            "& $icon": {
                                color: e.palette.success.main
                            }
                        },
                        standardInfo: {
                            color: n(e.palette.info.main, .6),
                            backgroundColor: o(e.palette.info.main, .9),
                            "& $icon": {
                                color: e.palette.info.main
                            }
                        },
                        standardWarning: {
                            color: n(e.palette.warning.main, .6),
                            backgroundColor: o(e.palette.warning.main, .9),
                            "& $icon": {
                                color: e.palette.warning.main
                            }
                        },
                        standardError: {
                            color: n(e.palette.error.main, .6),
                            backgroundColor: o(e.palette.error.main, .9),
                            "& $icon": {
                                color: e.palette.error.main
                            }
                        },
                        outlinedSuccess: {
                            color: n(e.palette.success.main, .6),
                            border: "1px solid ".concat(e.palette.success.main),
                            "& $icon": {
                                color: e.palette.success.main
                            }
                        },
                        outlinedInfo: {
                            color: n(e.palette.info.main, .6),
                            border: "1px solid ".concat(e.palette.info.main),
                            "& $icon": {
                                color: e.palette.info.main
                            }
                        },
                        outlinedWarning: {
                            color: n(e.palette.warning.main, .6),
                            border: "1px solid ".concat(e.palette.warning.main),
                            "& $icon": {
                                color: e.palette.warning.main
                            }
                        },
                        outlinedError: {
                            color: n(e.palette.error.main, .6),
                            border: "1px solid ".concat(e.palette.error.main),
                            "& $icon": {
                                color: e.palette.error.main
                            }
                        },
                        filledSuccess: {
                            color: "#fff",
                            fontWeight: e.typography.fontWeightMedium,
                            backgroundColor: e.palette.success.main
                        },
                        filledInfo: {
                            color: "#fff",
                            fontWeight: e.typography.fontWeightMedium,
                            backgroundColor: e.palette.info.main
                        },
                        filledWarning: {
                            color: "#fff",
                            fontWeight: e.typography.fontWeightMedium,
                            backgroundColor: e.palette.warning.main
                        },
                        filledError: {
                            color: "#fff",
                            fontWeight: e.typography.fontWeightMedium,
                            backgroundColor: e.palette.error.main
                        },
                        icon: {
                            marginRight: 12,
                            padding: "7px 0",
                            display: "flex",
                            fontSize: 22,
                            opacity: .9
                        },
                        message: {
                            padding: "8px 0"
                        },
                        action: {
                            display: "flex",
                            alignItems: "center",
                            marginLeft: "auto",
                            paddingLeft: 16,
                            marginRight: -8
                        }
                    }
                }), {
                    name: "MuiAlert"
                })(C)
        },
        17694: function(e, n, o) {
            var a = o(67294),
                t = o(63786);
            n.Z = (0, t.Z)(a.createElement("path", {
                d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            }), "Close")
        },
        66999: function(e, n, o) {
            o.r(n);
            var a = o(14924),
                t = o(85893),
                r = o(41120),
                i = o(43832),
                l = o(89659),
                c = o(8936),
                s = o(78470),
                d = o(41664),
                u = o.n(d),
                p = o(11163),
                m = o(24445),
                f = (0, r.Z)((function(e) {
                    return (0, a.Z)({
                        root: {
                            background: e.palette.error.light
                        },
                        alert: {
                            background: e.palette.error.light,
                            paddingRight: "unset",
                            paddingLeft: "unset",
                            fontSize: "12px"
                        }
                    }, e.breakpoints.up("sm"), {
                        alert: {
                            fontSize: "14px"
                        }
                    })
                }));
            n.default = function() {
                var e = f(),
                    n = (0, s.a)(),
                    o = n.session,
                    a = n.isAuthenticated;
                return (0, p.useRouter)().asPath.includes("/atualizar-conta") || !o || !a || o.step <= 5 ? null : (0, t.jsx)("aside", {
                    className: e.root,
                    children: (0, t.jsx)(i.Z, {
                        children: (0, t.jsxs)(c.Z, {
                            severity: "error",
                            className: e.alert,
                            children: ["Os dados da sua conta ainda n\xe3o foram validados,", " ", (0, t.jsx)(u(), {
                                passHref: !0,
                                href: (0, m.G)("")[o.step],
                                children: (0, t.jsx)(l.Z, {
                                    color: "error",
                                    children: "clique aqui para terminar o processo."
                                })
                            })]
                        })
                    })
                })
            }
        },
        24445: function(e, n, o) {
            o.d(n, {
                G: function() {
                    return a
                }
            });
            var a = function(e) {
                return {
                    1: "/cadastro",
                    2: "/cadastro/confirmar-sms",
                    3: "/cadastro/informacoes/participe-agora",
                    4: "/cadastro/confirmar-email",
                    5: e,
                    6: "/minha-conta/atualizar-conta/aviso",
                    7: "/minha-conta/atualizar-conta/validar-cadastro",
                    8: "/minha-conta/atualizar-conta/adicionar-documentacao"
                }
            }
        }
    }
]);