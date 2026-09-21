"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [947], {
        34362: function(e, o, n) {
            var t = n(67294),
                a = n(63786);
            o.Z = (0, a.Z)(t.createElement("path", {
                d: "M5.2496 8.0688l2.83-2.8268 14.134 14.15-2.83 2.8268zM9.4857 3.8272l2.828-2.8288 5.6576 5.656-2.828 2.8288zM.9989 12.3147l2.8284-2.8284L9.484 15.143l-2.8284 2.8284zM1 21h12v2H1z"
            }), "Gavel")
        },
        35946: function(e, o, n) {
            n.d(o, {
                Dy: function() {
                    return r
                },
                Tc: function() {
                    return i
                },
                oE: function() {
                    return a
                }
            });
            var t = n(24196),
                a = function(e) {
                    return t.eE.get("/auction/events/".concat(e, "/bookmarks"))
                },
                r = function(e) {
                    return t.eE.post("/auction/lots/".concat(e, "/bookmarks"))
                },
                i = function(e) {
                    return t.eE.delete("/auction/lots/".concat(e, "/bookmarks"))
                }
        },
        52225: function(e, o, n) {
            var t = n(85893),
                a = n(41120),
                r = n(17812),
                i = n(90770),
                c = n(7838),
                u = n(78470),
                l = n(27366),
                s = n(5152),
                p = n.n(s),
                m = n(67294),
                d = p()((function() {
                    return Promise.all([n.e(2093), n.e(1211), n.e(7258), n.e(5496), n.e(6408), n.e(5502), n.e(1390)]).then(n.bind(n, 65502))
                }), {
                    loadableGenerated: {
                        webpack: function() {
                            return [65502]
                        }
                    },
                    ssr: !1
                }),
                f = (0, a.Z)((function(e) {
                    return {
                        root: {
                            background: e.palette.text.primary,
                            color: e.palette.grey[100],
                            "&:hover": {
                                background: e.palette.text.secondary
                            }
                        },
                        rootWhite: {
                            background: "#fff",
                            "&:hover": {
                                background: e.palette.grey[100]
                            }
                        },
                        iconWhite: {
                            "& path": {
                                color: e.palette.grey[200]
                            }
                        }
                    }
                }));
            o.Z = function(e) {
                var o = e.lot,
                    n = e.color,
                    a = void 0 === n ? "black" : n,
                    s = e.eventId,
                    p = f(),
                    g = (0, l.S)(s),
                    v = (0, u.a)().isAuthenticated,
                    h = (0, m.useState)(!1),
                    b = h[0],
                    x = h[1],
                    k = (0, m.useState)(!1),
                    y = k[0],
                    Z = k[1];
                (0, m.useEffect)((function() {
                    "undefined" !== typeof g.data.isBookmarked[o] && Z(g.data.isBookmarked[o])
                }), [g.data.isBookmarked, o]);
                return (0, t.jsxs)(t.Fragment, {
                    children: [(0, t.jsx)(r.Z, {
                        disabled: g.isLoading,
                        onClick: function() {
                            return v ? (Z((function(e) {
                                return !e
                            })), y ? g.removeBookmark(o) : void g.addBookmark(o)) : x(!0)
                        },
                        size: "small",
                        className: "black" === a ? p.root : p.rootWhite,
                        children: y ? (0, t.jsx)(i.Z, {
                            color: "primary",
                            fontSize: "small"
                        }) : (0, t.jsx)(c.Z, {
                            className: "white" === a ? p.iconWhite : "",
                            fontSize: "small"
                        })
                    }), b ? (0, t.jsx)(d, {
                        onClose: function() {
                            return x(!1)
                        }
                    }) : null]
                })
            }
        },
        38197: function(e, o, n) {
            n.d(o, {
                Z: function() {
                    return m
                }
            });
            var t = n(10253),
                a = n(85893),
                r = n(41120),
                i = n(43832),
                c = n(41749),
                u = n(282),
                l = n(24196),
                s = n(67294),
                p = (0, r.Z)((function(e) {
                    return {
                        root: {
                            background: e.palette.text.primary,
                            padding: "".concat(e.spacing(4), "px 0px"),
                            position: "relative",
                            zIndex: 1,
                            marginBottom: "-".concat(e.spacing(3), "px")
                        },
                        item: {
                            display: "flex",
                            marginBottom: e.spacing(3)
                        },
                        text: {
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: 500,
                            alignSelf: "center"
                        },
                        newsForm: {
                            display: "flex",
                            flexDirection: "row"
                        },
                        emailInput: {
                            border: "none",
                            borderRadius: "".concat(e.spacing(1), "px 0 0 ").concat(e.spacing(1), "px"),
                            color: e.palette.text.primary,
                            fontSize: "14px",
                            paddingLeft: e.spacing(1),
                            width: "inherit"
                        },
                        submitButton: {
                            borderRadius: "0 ".concat(e.spacing(1), "px ").concat(e.spacing(1), "px 0"),
                            fontSize: "14px",
                            height: "auto",
                            padding: "".concat(e.spacing(1), "px ").concat(e.spacing(4), "px")
                        },
                        "@media (min-width: 960px)": {
                            root: {
                                padding: "".concat(e.spacing(4), "px ").concat(e.spacing(5), "px")
                            },
                            text: {
                                fontSize: "16px"
                            },
                            item: {
                                marginBottom: "0"
                            },
                            emailInput: {
                                fontSize: "16px",
                                paddingLeft: e.spacing(3)
                            },
                            submitButton: {
                                fontSize: "16px",
                                padding: "".concat(e.spacing(1), "px ").concat(e.spacing(4), "px")
                            }
                        }
                    }
                })),
                m = function() {
                    var e = (0, t.Z)(s.useState(""), 2),
                        o = e[0],
                        n = e[1],
                        r = (0, t.Z)(s.useState(!1), 2),
                        m = r[0],
                        d = r[1],
                        f = p();
                    return (0, a.jsx)("section", {
                        className: f.root,
                        children: (0, a.jsx)(i.Z, {
                            children: (0, a.jsxs)(c.Z, {
                                container: !0,
                                children: [(0, a.jsx)(c.Z, {
                                    item: !0,
                                    xs: 12,
                                    md: 8,
                                    className: f.item,
                                    children: (0, a.jsxs)("p", {
                                        className: f.text,
                                        children: ["Receba as melhores ofertas antes de todo mundo! Inscreva-se em nossa ", (0, a.jsx)("span", {
                                            style: {
                                                fontWeight: "bold"
                                            },
                                            children: "NEWSLETTER"
                                        }), ":"]
                                    })
                                }), (0, a.jsxs)(c.Z, {
                                    item: !0,
                                    container: !0,
                                    direction: "row",
                                    wrap: "nowrap",
                                    xs: 12,
                                    md: 4,
                                    component: "form",
                                    onSubmit: function(e) {
                                        e.preventDefault(), "" !== o ? (d(!0), function(e) {
                                            return l.em.post("/post-officer/newsletter/subscribe", {
                                                email: e
                                            })
                                        }(o).then((function() {
                                            alert("Email cadastrado com sucesso"), n(""), d(!1)
                                        })).catch((function() {
                                            alert("N\xe3o foi poss\xedvel cadastrar o email"), d(!1)
                                        }))) : alert("Preencha o campo com um email v\xe1lido.")
                                    },
                                    className: f.item,
                                    children: [(0, a.jsx)("input", {
                                        type: "text",
                                        className: f.emailInput,
                                        placeholder: "E-mail",
                                        value: o,
                                        onChange: function(e) {
                                            return n(e.target.value)
                                        }
                                    }), (0, a.jsx)(u.Z, {
                                        className: f.submitButton,
                                        variant: "contained",
                                        type: "submit",
                                        color: "primary",
                                        disabled: m,
                                        children: m ? "Aguarde..." : "Assinar"
                                    })]
                                })]
                            })
                        })
                    })
                }
        },
        70325: function(e, o, n) {
            n.d(o, {
                D: function() {
                    return i
                }
            });
            var t = n(24196),
                a = n(11163),
                r = n(88767),
                i = function(e) {
                    var o = (0, a.useRouter)(),
                        n = null !== e && void 0 !== e ? e : Number(o.query.lotId),
                        i = (0, r.useQuery)(["getLotDetails", {
                            id: n
                        }], (function() {
                            return function(e) {
                                return t.eE.get("/auction/lots/".concat(e))
                            }(n).then((function(e) {
                                return e.data
                            }))
                        }));
                    return {
                        lot: i.data
                    }
                }
        },
        18438: function(e, o, n) {
            n.d(o, {
                rl: function() {
                    return r
                },
                uf: function() {
                    return t
                },
                xG: function() {
                    return a
                }
            });
            var t = function(e) {
                    return new Intl.NumberFormat("pt-BR", {
                        style: "decimal"
                    }).format(e)
                },
                a = function(e) {
                    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                    return e ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: o,
                        maximumFractionDigits: o
                    }).format(e) : ""
                },
                r = function(e) {
                    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                    return new Intl.NumberFormat("pt-BR", {
                        style: "percent",
                        minimumFractionDigits: o,
                        maximumFractionDigits: o
                    }).format(e)
                }
        },
        57139: function(e, o, n) {
            n.d(o, {
                W: function() {
                    return r
                }
            });
            var t = n(67294),
                a = n(78470),
                r = function(e) {
                    var o = e.eventName,
                        n = e.dataLayer,
                        r = e.autoDispatch,
                        i = void 0 === r || r,
                        c = (0, a.a)().isLoading,
                        u = (0, t.useRef)(!1),
                        l = (0, t.useCallback)((function(e) {
                            return console.log("".concat(o, "-manualDispatch"), null !== e && void 0 !== e ? e : n), document.dispatchEvent(new CustomEvent(o, {
                                detail: null !== e && void 0 !== e ? e : n
                            }))
                        }), [n, o]);
                    return (0, t.useEffect)((function() {
                        if (!c) {
                            var e = function() {
                                console.log(o)
                            };
                            return document.addEventListener(o, e), window.objDataLayer = n, i && !u.current && (l(), u.current = !0),
                                function() {
                                    document.removeEventListener(o, e)
                                }
                        }
                    }), [o, n, i, l, c]), {
                        dispatchEvent: l
                    }
                }
        },
        27366: function(e, o, n) {
            n.d(o, {
                S: function() {
                    return l
                }
            });
            var t = n(29598),
                a = n(11163),
                r = n(67294),
                i = n(88767),
                c = n(35946),
                u = n(78470),
                l = function(e) {
                    var o = (0, a.useRouter)(),
                        n = Number(o.query.eventId),
                        l = e || n,
                        s = (0, i.useQueryClient)(),
                        p = (0, u.a)(),
                        m = p.isAuthenticated,
                        d = p.session,
                        f = (0, i.useQuery)(t.R.getEventBookmarks(l, null === d || void 0 === d ? void 0 : d.id), (function() {
                            return (0, c.oE)(l)
                        }), {
                            enabled: Boolean(l) && m,
                            refetchOnMount: !1
                        }),
                        g = f.data,
                        v = f.isLoading,
                        h = (0, r.useCallback)((function() {
                            return s.invalidateQueries(t.R.getEventBookmarks(l))
                        }), [l, s]),
                        b = (0, i.useMutation)(t.R.deleteBookmark(), (function(e) {
                            return (0, c.Tc)(e)
                        }), {
                            onSuccess: h
                        }),
                        x = (0, i.useMutation)(t.R.postBookmark(), (function(e) {
                            return (0, c.Dy)(e)
                        }), {
                            onSuccess: h
                        }),
                        k = (0, r.useCallback)((function(e) {
                            x.mutate(e)
                        }), [x]),
                        y = (0, r.useCallback)((function(e) {
                            b.mutate(e)
                        }), [b]);
                    return {
                        data: (null === g || void 0 === g ? void 0 : g.data) || {
                            isBookmarked: {}
                        },
                        isLoading: v || x.isLoading || b.isLoading,
                        addBookmark: k,
                        removeBookmark: y
                    }
                }
        },
        55435: function(e, o, n) {
            n.d(o, {
                Dp: function() {
                    return g
                },
                MX: function() {
                    return m
                },
                Q3: function() {
                    return b
                },
                QX: function() {
                    return f
                },
                Qs: function() {
                    return d
                },
                Qz: function() {
                    return x
                },
                k0: function() {
                    return k
                },
                v9: function() {
                    return h
                },
                z5: function() {
                    return v
                }
            });
            var t = n(26042),
                a = n(69396),
                r = n(78470),
                i = n(2568),
                c = n.n(i),
                u = n(11163),
                l = n(67294),
                s = n(70325),
                p = function() {
                    var e = (0, u.useRouter)(),
                        o = (0, r.a)(),
                        n = o.session,
                        t = o.isAuthenticated,
                        a = e.query,
                        i = a.idcmp,
                        s = a.icmpint,
                        p = a.icid,
                        m = a.lkid,
                        d = (0, l.useMemo)((function() {
                            return (null === n || void 0 === n ? void 0 : n.email) ? c()(n.email) : void 0
                        }), [null === n || void 0 === n ? void 0 : n.email]);
                    return (0, l.useMemo)((function() {
                        return {
                            site: {
                                domain: "www.loopleiloes.com.br",
                                country: "brasil",
                                server: "web",
                                environment: "leilao",
                                clientType: "pf",
                                platform: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent) ? "mobile" : "desktop"
                            },
                            page: {
                                flowType: "leilao",
                                url: window.location.href,
                                trackingCode: {
                                    idcmp: i,
                                    icmpint: s,
                                    icid: p,
                                    lkid: m
                                }
                            },
                            user: {
                                loginStatus: t ? "1" : "2",
                                loginId: d
                            }
                        }
                    }), [i, s, p, m, t, d])
                },
                m = function() {
                    var e = p();
                    return (0, l.useMemo)((function() {
                        return (0, a.Z)((0, t.Z)({}, e), {
                            page: (0, a.Z)((0, t.Z)({}, e.page), {
                                pageType: "loop-leilao-lp",
                                pageName: "/webmotors/leilao/loopcarros/lp",
                                pageNameTier1: "leilao",
                                pageNameTier2: "lp"
                            })
                        })
                    }), [e])
                },
                d = function() {
                    var e = p();
                    return (0, l.useMemo)((function() {
                        return (0, a.Z)((0, t.Z)({}, e), {
                            page: (0, a.Z)((0, t.Z)({}, e.page), {
                                pageType: "loop-leilao-homepage",
                                pageName: "/webmotors/leilao/loopcarros/homepage",
                                pageNameTier1: "leilao",
                                pageNameTier2: "homepage"
                            })
                        })
                    }), [e])
                },
                f = function() {
                    var e = p();
                    return (0, l.useMemo)((function() {
                        return (0, a.Z)((0, t.Z)({}, e), {
                            page: (0, a.Z)((0, t.Z)({}, e.page), {
                                pageType: "loop-leilao-eventos",
                                pageName: "/webmotors/leilao/loopcarros/eventos",
                                pageNameTier1: "leilao",
                                pageNameTier2: "eventos"
                            })
                        })
                    }), [e])
                },
                g = function() {
                    var e = p();
                    return (0, l.useMemo)((function() {
                        return (0, a.Z)((0, t.Z)({}, e), {
                            page: (0, a.Z)((0, t.Z)({}, e.page), {
                                pageType: "loop-leilao-eventos-resultado-de-busca",
                                pageName: "/webmotors/leilao/loopcarros/eventos/resultado",
                                pageNameTier1: "leilao",
                                pageNameTier2: "eventos",
                                pageNameTier3: "resultado"
                            })
                        })
                    }), [e])
                },
                v = function() {
                    var e = p();
                    return (0, l.useMemo)((function() {
                        return (0, a.Z)((0, t.Z)({}, e), {
                            page: (0, a.Z)((0, t.Z)({}, e.page), {
                                pageType: "loop-leilao-como-vender",
                                pageName: "/webmotors/leilao/loopcarros/como-vender",
                                pageNameTier1: "leilao",
                                pageNameTier2: "como-vender"
                            })
                        })
                    }), [e])
                },
                h = function() {
                    var e = p();
                    return (0, l.useMemo)((function() {
                        return (0, a.Z)((0, t.Z)({}, e), {
                            page: (0, a.Z)((0, t.Z)({}, e.page), {
                                pageType: "loop-leilao-login",
                                pageName: "/webmotors/leilao/loopcarros/login",
                                pageNameTier1: "leilao",
                                pageNameTier2: "login"
                            })
                        })
                    }), [e])
                },
                b = function() {
                    var e = p();
                    return (0, l.useMemo)((function() {
                        return (0, a.Z)((0, t.Z)({}, e), {
                            page: (0, a.Z)((0, t.Z)({}, e.page), {
                                pageType: "loop-leilao-cadastro",
                                pageName: "/webmotors/leilao/loopcarros/cadastro",
                                pageNameTier1: "leilao",
                                pageNameTier2: "cadastro"
                            })
                        })
                    }), [e])
                },
                x = function() {
                    var e = p(),
                        o = (0, s.D)().lot,
                        n = o.inspectionInfo.map((function(e) {
                            return e.label
                        })),
                        r = o.inspectionInfo.map((function(e) {
                            return e.label
                        }));
                    return (0, l.useMemo)((function() {
                        return (0, a.Z)((0, t.Z)({}, e), {
                            page: (0, a.Z)((0, t.Z)({}, e.page), {
                                pageType: "loop-leilao-eventos-veiculo",
                                pageName: "/webmotors/leilao/loopcarros/eventos/veiculo",
                                pageNameTier1: "leilao",
                                pageNameTier2: "eventos",
                                pageNameTier3: "veiculo"
                            }),
                            vehicle: {
                                type: {
                                    id: "Moto" === o.vehicle.category ? "2" : "1",
                                    name: "Moto" === o.vehicle.category ? "moto" : "carro"
                                },
                                gearshift: {
                                    id: o.mainInfo.transmission,
                                    name: o.mainInfo.transmission
                                },
                                kilometre: {
                                    value: o.mainInfo.mileage,
                                    rounded: 1e3 * Math.ceil(o.mainInfo.mileage / 1e3)
                                },
                                color: {
                                    external: {
                                        id: o.mainInfo.color,
                                        name: o.mainInfo.color
                                    }
                                },
                                make: {
                                    id: o.vehicle.brand,
                                    name: o.vehicle.brand
                                },
                                model: {
                                    id: o.vehicle.model,
                                    name: o.vehicle.model
                                },
                                version: {
                                    name: "" === o.vehicle.version ? o.vehicle.model : o.vehicle.version
                                },
                                opcional: {
                                    id: n,
                                    name: r
                                },
                                year: {
                                    manufacture: {
                                        value: o.mainInfo.yearManufacture
                                    },
                                    model: {
                                        value: o.mainInfo.yearModel
                                    }
                                }
                            }
                        })
                    }), [e, o.mainInfo, o.vehicle, n, r])
                },
                k = function() {
                    var e = p(),
                        o = (0, u.useRouter)().query.slug;
                    return (0, l.useMemo)((function() {
                        return (0, a.Z)((0, t.Z)({}, e), {
                            page: (0, a.Z)((0, t.Z)({}, e.page), {
                                pageType: "loop-leilao-".concat(o),
                                pageName: "/webmotors/leilao/loopcarros/".concat(o),
                                pageNameTier1: "leilao",
                                pageNameTier2: "conteudo"
                            })
                        })
                    }), [e, o])
                }
        },
        19422: function(e, o, n) {
            n.r(o);
            var t = n(85893),
                a = n(9008),
                r = n.n(a);
            o.default = function(e) {
                var o = e.pageTitle,
                    n = void 0 === o ? "Leil\xe3o de Carros | Loop Leil\xf5es" : o,
                    a = e.pageDescription,
                    i = void 0 === a ? "Saiba mais sobre o ve\xedculo e fa\xe7a o seu lance!" : a,
                    c = e.pageUrl,
                    u = e.pageImage,
                    l = void 0 === u ? "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/loop/logo-loop.svg" : u,
                    s = e.children;
                return (0, t.jsxs)(r(), {
                    children: [(0, t.jsx)("title", {
                        children: n
                    }), (0, t.jsx)("meta", {
                        name: "description",
                        content: i
                    }), (0, t.jsx)("meta", {
                        property: "og:title",
                        content: n
                    }), (0, t.jsx)("meta", {
                        property: "og:type",
                        content: "website"
                    }), c ? (0, t.jsx)("meta", {
                        property: "og:url",
                        content: c
                    }) : null, (0, t.jsx)("meta", {
                        property: "og:image",
                        content: l
                    }), (0, t.jsx)("meta", {
                        property: "og:site_name",
                        content: "Loop Leil\xf5es"
                    }), (0, t.jsx)("link", {
                        rel: "canonical",
                        href: c
                    }), s]
                })
            }
        }
    }
]);