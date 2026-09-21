"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [356], {
        1197: function(e, a, i) {
            var n = i(64836),
                t = i(75263);
            a.Z = void 0;
            var o = t(i(67294)),
                r = (0, n(i(2108)).default)(o.createElement("path", {
                    d: "M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z"
                }), "ArrowForwardIos");
            a.Z = r
        },
        71062: function(e, a, i) {
            var n = i(14924),
                t = i(26042),
                o = i(69396),
                r = i(85893),
                s = i(41120),
                c = i(30719),
                l = (i(30933), i(68770), (0, s.Z)((function(e) {
                    return (0, n.Z)({
                        slider: {
                            overflow: "hidden",
                            "& .swiper-wrapper": {
                                paddingBottom: e.spacing(6)
                            },
                            "& .swiper-pagination": {
                                bottom: "0px",
                                right: "0px",
                                left: "0px",
                                margin: "auto",
                                width: "fit-content",
                                padding: e.spacing(.5, 1),
                                background: "white",
                                borderRadius: e.spacing(2),
                                border: "1px solid ".concat(e.palette.grey[200])
                            },
                            "& .swiper-pagination-bullet": {
                                width: e.spacing(1),
                                height: e.spacing(1),
                                background: e.palette.grey[400],
                                margin: "".concat(e.spacing(0, 1), " !important")
                            },
                            "& .swiper-pagination-bullet-active": {
                                background: e.palette.primary.light
                            }
                        }
                    }, e.breakpoints.up("md"), {
                        slider: {
                            "& .swiper-pagination-bullet": {
                                width: "10px",
                                height: "10px"
                            }
                        }
                    })
                })));
            a.Z = function(e) {
                var a = e.children,
                    i = e.settings,
                    n = e.className,
                    s = l(),
                    d = (0, t.Z)({}, i);
                return (0, r.jsx)(c.tq, (0, o.Z)((0, t.Z)({}, d), {
                    className: "".concat(s.slider, " ").concat(n),
                    children: a.map((function(e, a) {
                        return (0, r.jsx)(c.o5, {
                            children: e
                        }, a)
                    }))
                }))
            }
        },
        57313: function(e, a, i) {
            i.d(a, {
                Z: function() {
                    return z
                }
            });
            var n = i(14924),
                t = i(85893),
                o = i(41120),
                r = i(41749),
                s = i(22318),
                c = i(55517),
                l = i(282),
                d = i(18438),
                p = i(78470),
                u = i(41664),
                m = i.n(u),
                g = i(52225),
                h = (0, o.Z)((function(e) {
                    return {
                        imageContainer: {
                            position: "relative",
                            backgroundColor: e.palette.grey[50],
                            borderRadius: e.shape.borderRadius,
                            border: "1px solid ".concat(e.palette.grey[200]),
                            margin: "0 auto ".concat(e.spacing(2), "px"),
                            overflow: "hidden",
                            width: "100%"
                        },
                        financing: {
                            alignItems: "center",
                            backgroundColor: "#fff",
                            border: "1px solid #00000029",
                            borderRadius: e.shape.borderRadius,
                            display: "flex",
                            fontSize: "12px",
                            justifyContent: "center",
                            left: e.spacing(1),
                            padding: "0 ".concat(e.spacing(1), "px"),
                            position: "absolute",
                            top: e.spacing(1),
                            zIndex: 1
                        },
                        image: {
                            height: "auto",
                            width: "100%",
                            objectFit: "cover",
                            zIndex: 0
                        },
                        ipva: (0, n.Z)({
                            position: "absolute",
                            zIndex: 1,
                            bottom: e.spacing(2),
                            right: e.spacing(2)
                        }, e.breakpoints.down("sm"), {
                            width: "46px"
                        })
                    }
                })),
                x = function(e) {
                    var a = e.image,
                        i = e.number,
                        n = e.alt,
                        o = e.isFinancing,
                        r = e.hasIpvaPaid,
                        s = h(),
                        c = "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fplaceholder.webp";
                    return (0, t.jsxs)("div", {
                        className: s.imageContainer,
                        children: [o ? (0, t.jsx)("div", {
                            className: s.financing,
                            children: "Financiamento"
                        }) : null, (0, t.jsx)("img", {
                            className: s.image,
                            alt: n,
                            id: "lot_".concat(i, "_image"),
                            src: a ? "".concat("https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/KwUyhjEv9VxIWkPo_Ql7FUmLthg8HKxwThZvvaed7_Tqz9QfJfwrzzgt_3EIvqRG/n/loopbrasil/b/vehicle-photos/o", "/").concat("sm", "/").concat(a) : c,
                            height: 244,
                            width: 320,
                            onError: function(e) {
                                e.target.src = c
                            }
                        }), r ? (0, t.jsx)("img", {
                            width: 64,
                            className: s.ipva,
                            src: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2FhasIpvaPaid2026.png",
                            alt: "Este lote tem IPVA pago"
                        }) : null]
                    })
                },
                f = (0, o.Z)((function(e) {
                    return {
                        root: (0, n.Z)({}, e.breakpoints.down("sm"), {
                            justifyContent: "unset",
                            gap: "8px"
                        }),
                        tag: {
                            border: "1px solid ".concat(e.palette.grey[200]),
                            borderRadius: e.shape.borderRadius,
                            padding: "".concat(e.spacing(.5), "px ").concat(e.spacing(1), "px")
                        }
                    }
                })),
                v = function(e) {
                    var a = e.sku,
                        i = e.number,
                        n = f();
                    return (0, t.jsxs)(r.Z, {
                        container: !0,
                        className: n.root,
                        justifyContent: "space-between",
                        children: [(0, t.jsxs)(s.Z, {
                            variant: "caption",
                            className: n.tag,
                            children: ["Lote ", i.toString().padStart(2, "0")]
                        }), (0, t.jsxs)(s.Z, {
                            variant: "caption",
                            className: n.tag,
                            children: ["C\xf3d. Ve\xedculo: ", a]
                        })]
                    })
                },
                b = {
                    aberto_para_lance: {
                        description: "Aberto para Lance",
                        color: "#619725"
                    },
                    evento_aberto: {
                        description: "Evento Aberto",
                        color: "#619725"
                    },
                    vendido: {
                        description: "Vendido",
                        color: "#48A060"
                    },
                    nao_vendido: {
                        description: "N\xe3o Vendido",
                        color: "#F3123C"
                    },
                    condicional: {
                        description: "Condicional",
                        color: "#F5B801"
                    },
                    dou_lhe_uma: {
                        description: "Dou-lhe Uma",
                        color: "#FFD700"
                    },
                    dou_lhe_duas: {
                        description: "Dou-lhe Duas",
                        color: "#FF8C00"
                    },
                    dou_lhe_tres: {
                        description: "Dou-lhe Tr\xeas",
                        color: "#FF6600"
                    },
                    repasse: {
                        description: "Repasse",
                        color: "#979797"
                    },
                    repasse_com_lance: {
                        description: "Repasse com Lance",
                        color: "#979797"
                    },
                    retirado: {
                        description: "Retirado",
                        color: "#979797"
                    },
                    cancelado: {
                        description: "Cancelado",
                        color: "#232323"
                    },
                    listagem_parcial: {
                        description: "Listagem em Andamento",
                        color: "#F5B801"
                    }
                },
                j = function(e) {
                    var a, i = e.status,
                        n = null !== (a = b[i]) && void 0 !== a ? a : {
                            description: "Status desconhecido",
                            color: "#979797"
                        };
                    return (0, t.jsx)("div", {
                        style: {
                            color: n.color
                        },
                        children: n.description
                    })
                },
                Z = i(10253),
                w = i(23855),
                y = i(51085),
                _ = i(33913),
                k = (0, o.Z)((function(e) {
                    return {
                        root: {
                            padding: e.spacing(.5),
                            background: e.palette.grey[50],
                            borderRadius: e.shape.borderRadius,
                            textAlign: "center",
                            fontSize: "12px"
                        }
                    }
                })),
                N = function(e) {
                    var a = e.timeEstimate,
                        i = k(),
                        n = (0, Z.Z)(a.split(" "), 2),
                        o = n[0],
                        r = n[1],
                        s = (0, Z.Z)(o.split("-"), 3),
                        c = (s[0], s[1]),
                        l = s[2],
                        d = (0, Z.Z)(r.split(":"), 2),
                        p = d[0],
                        u = d[1],
                        m = (0, w.default)(a),
                        g = (0, y.Z)(m);
                    return (0, _.Z)(m) ? null : g ? (0, t.jsxs)("div", {
                        className: i.root,
                        children: ["Lote em preg\xe3o \xe0s ", "".concat(p, "h").concat(u)]
                    }) : (0, t.jsxs)("div", {
                        className: i.root,
                        children: ["Lote em preg\xe3o dia ", "".concat(l, "/").concat(c, " \xe0s ").concat(p, "h").concat(u)]
                    })
                },
                C = (0, o.Z)((function(e) {
                    return {
                        nameContainer: (0, n.Z)({
                            display: "-webkit-box",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginBottom: e.spacing(2),
                            whiteSpace: "normal",
                            "-webkitBoxOrient": "vertical",
                            "-webkitLineClamp": 2
                        }, e.breakpoints.up("md"), {
                            height: e.spacing(7),
                            marginBottom: e.spacing(3)
                        }),
                        name: (0, n.Z)({
                            fontWeight: 600,
                            fontSize: "14px"
                        }, e.breakpoints.up("md"), {
                            fontSize: "16px"
                        })
                    }
                })),
                F = function(e) {
                    var a = e.brand,
                        i = e.model,
                        n = e.version,
                        o = C(),
                        r = "".concat(a, " ").concat(i);
                    return (0, t.jsxs)("div", {
                        className: o.nameContainer,
                        children: [(0, t.jsx)(s.Z, {
                            variant: "h5",
                            component: "h3",
                            className: o.name,
                            children: r
                        }), (0, t.jsx)(s.Z, {
                            variant: "body2",
                            children: n
                        })]
                    })
                },
                I = (0, o.Z)((function(e) {
                    return {
                        root: (0, n.Z)({
                            position: "relative",
                            cursor: "pointer",
                            display: "flex",
                            minHeight: "100%",
                            minWidth: "250px"
                        }, e.breakpoints.up("md"), {
                            minWidth: "unset"
                        }),
                        container: (0, n.Z)({
                            backgroundColor: "#fff",
                            border: "1px solid ".concat(e.palette.grey[200]),
                            borderRadius: e.shape.borderRadius,
                            padding: e.spacing(1),
                            display: "grid",
                            gridTemplateAreas: "\n    'meta meta'\n    'image info'\n    'image info'",
                            gridTemplateColumns: "146px 1fr",
                            gap: e.spacing(1.5),
                            width: "100%",
                            "& > div > *:not(:last-child)": {
                                marginBottom: e.spacing(1)
                            }
                        }, e.breakpoints.up("md"), {
                            flex: "1",
                            display: "flex",
                            gap: "8px",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            padding: e.spacing(2),
                            width: "unset"
                        }),
                        meta: {
                            gridArea: "meta"
                        },
                        image: {
                            gridArea: "image"
                        },
                        info: {
                            gridArea: "info",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        },
                        favorite: (0, n.Z)({
                            position: "absolute",
                            top: e.spacing(1),
                            right: e.spacing(1),
                            zIndex: 2
                        }, e.breakpoints.up("md"), {
                            top: e.spacing(3),
                            right: e.spacing(3)
                        }),
                        button: {
                            height: "48px",
                            fontSize: "13px",
                            marginTop: e.spacing(1)
                        }
                    }
                })),
                R = [166359],
                z = function(e) {
                    var a = e.lot,
                        i = e.isEventIncomplete,
                        n = e.showLink,
                        o = e.className,
                        u = I(),
                        h = "".concat(a.vehicle.brand, " ").concat(a.vehicle.model),
                        f = (0, p.a)().isAuthenticated;
                    return (0, t.jsxs)("div", {
                        className: "".concat(u.root, " ").concat(o),
                        id: "lot_".concat(a.number, "_card"),
                        children: [(0, t.jsx)("div", {
                            className: u.favorite,
                            children: (0, t.jsx)(g.Z, {
                                eventId: a.eventId,
                                lot: a.id
                            })
                        }), (0, t.jsx)(m(), {
                            prefetch: !1,
                            href: "".concat(a.url).concat(f ? "?nps=vai" : ""),
                            passHref: !0,
                            children: (0, t.jsxs)("a", {
                                href: "".concat(a.url).concat(f ? "?nps=vai" : ""),
                                className: u.container,
                                children: [(0, t.jsxs)("div", {
                                    className: u.image,
                                    children: [(0, t.jsx)(x, {
                                        alt: h,
                                        hasIpvaPaid: a.vehicle.ipvaPaid && a.eventId >= 2535 || R.includes(a.id),
                                        isFinancing: a.isFinancing,
                                        number: a.number,
                                        image: a.vehicle.image
                                    }), "aberto_para_lance" === a.status ? (0, t.jsx)(N, {
                                        timeEstimate: a.estimatedStartTime
                                    }) : null]
                                }), (0, t.jsx)("div", {
                                    className: u.meta,
                                    children: (0, t.jsx)(v, {
                                        number: a.number,
                                        sku: a.vehicle.id
                                    })
                                }), (0, t.jsxs)("div", {
                                    className: u.info,
                                    children: [(0, t.jsx)(F, {
                                        brand: a.vehicle.brand,
                                        model: a.vehicle.model,
                                        version: a.vehicle.version
                                    }), (0, t.jsxs)(r.Z, {
                                        container: !0,
                                        justifyContent: "space-between",
                                        children: [(0, t.jsxs)(s.Z, {
                                            variant: "caption",
                                            children: [a.vehicle.manufactureYear, "/", a.vehicle.modelYear]
                                        }), (0, t.jsxs)(s.Z, {
                                            variant: "caption",
                                            children: ["Km ", (0, d.uf)(a.vehicle.mileage)]
                                        })]
                                    }), (0, t.jsx)(j, {
                                        status: i ? "listagem_parcial" : a.status
                                    }), (0, t.jsxs)("div", {
                                        children: [(0, t.jsx)(c.Z, {
                                            light: !0,
                                            style: {
                                                marginBottom: "8px"
                                            }
                                        }), (0, t.jsxs)(r.Z, {
                                            container: !0,
                                            justifyContent: "space-between",
                                            children: [(0, t.jsx)("span", {
                                                children: "Lance inicial:"
                                            }), (0, t.jsx)("span", {
                                                children: a.lastBid ? "R$ ".concat((0, d.uf)(a.lastBid)) : "Sem lance atual"
                                            })]
                                        }), n ? (0, t.jsx)(l.Z, {
                                            variant: "contained",
                                            color: "primary",
                                            component: "span",
                                            className: u.button,
                                            disableElevation: !0,
                                            fullWidth: !0,
                                            children: "Dar lance agora"
                                        }) : null]
                                    })]
                                })]
                            })
                        })]
                    })
                }
        },
        11557: function(e, a, i) {
            var n = i(85893),
                t = i(41120),
                o = i(22318),
                r = i(1197),
                s = i(41664),
                c = i.n(s),
                l = (0, t.Z)((function(e) {
                    return {
                        typography: {
                            alignItems: "center",
                            color: e.palette.primary.main,
                            display: "inline-flex",
                            textDecoration: "unset",
                            "& svg": {
                                marginLeft: "4px"
                            }
                        }
                    }
                }));
            a.Z = function(e) {
                var a = e.href,
                    i = e.children,
                    t = l();
                return (0, n.jsx)(c(), {
                    href: a,
                    passHref: !0,
                    children: (0, n.jsxs)(o.Z, {
                        className: t.typography,
                        variant: "subtitle2",
                        component: "a",
                        children: [i, (0, n.jsx)(r.Z, {
                            fontSize: "inherit"
                        })]
                    })
                })
            }
        }
    }
]);