(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [5405], {
        9570: function(e, t, n) {
            "use strict";
            var a = n(87462),
                o = n(45987),
                i = n(67294),
                r = n(86010),
                s = n(1591),
                c = n(59693),
                l = n(93871),
                d = n(56608),
                u = i.forwardRef((function(e, t) {
                    var n = e.classes,
                        s = e.className,
                        c = e.color,
                        u = void 0 === c ? "secondary" : c,
                        p = e.edge,
                        m = void 0 !== p && p,
                        h = e.size,
                        x = void 0 === h ? "medium" : h,
                        g = (0, o.Z)(e, ["classes", "className", "color", "edge", "size"]),
                        v = i.createElement("span", {
                            className: n.thumb
                        });
                    return i.createElement("span", {
                        className: (0, r.Z)(n.root, s, {
                            start: n.edgeStart,
                            end: n.edgeEnd
                        }[m], "small" === x && n["size".concat((0, l.Z)(x))])
                    }, i.createElement(d.Z, (0, a.Z)({
                        type: "checkbox",
                        icon: v,
                        checkedIcon: v,
                        classes: {
                            root: (0, r.Z)(n.switchBase, n["color".concat((0, l.Z)(u))]),
                            input: n.input,
                            checked: n.checked,
                            disabled: n.disabled
                        },
                        ref: t
                    }, g)), i.createElement("span", {
                        className: n.track
                    }))
                }));
            t.Z = (0, s.Z)((function(e) {
                return {
                    root: {
                        display: "inline-flex",
                        width: 58,
                        height: 38,
                        overflow: "hidden",
                        padding: 12,
                        boxSizing: "border-box",
                        position: "relative",
                        flexShrink: 0,
                        zIndex: 0,
                        verticalAlign: "middle",
                        "@media print": {
                            colorAdjust: "exact"
                        }
                    },
                    edgeStart: {
                        marginLeft: -8
                    },
                    edgeEnd: {
                        marginRight: -8
                    },
                    switchBase: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        color: "light" === e.palette.type ? e.palette.grey[50] : e.palette.grey[400],
                        transition: e.transitions.create(["left", "transform"], {
                            duration: e.transitions.duration.shortest
                        }),
                        "&$checked": {
                            transform: "translateX(20px)"
                        },
                        "&$disabled": {
                            color: "light" === e.palette.type ? e.palette.grey[400] : e.palette.grey[800]
                        },
                        "&$checked + $track": {
                            opacity: .5
                        },
                        "&$disabled + $track": {
                            opacity: "light" === e.palette.type ? .12 : .1
                        }
                    },
                    colorPrimary: {
                        "&$checked": {
                            color: e.palette.primary.main,
                            "&:hover": {
                                backgroundColor: (0, c.Fq)(e.palette.primary.main, e.palette.action.hoverOpacity),
                                "@media (hover: none)": {
                                    backgroundColor: "transparent"
                                }
                            }
                        },
                        "&$disabled": {
                            color: "light" === e.palette.type ? e.palette.grey[400] : e.palette.grey[800]
                        },
                        "&$checked + $track": {
                            backgroundColor: e.palette.primary.main
                        },
                        "&$disabled + $track": {
                            backgroundColor: "light" === e.palette.type ? e.palette.common.black : e.palette.common.white
                        }
                    },
                    colorSecondary: {
                        "&$checked": {
                            color: e.palette.secondary.main,
                            "&:hover": {
                                backgroundColor: (0, c.Fq)(e.palette.secondary.main, e.palette.action.hoverOpacity),
                                "@media (hover: none)": {
                                    backgroundColor: "transparent"
                                }
                            }
                        },
                        "&$disabled": {
                            color: "light" === e.palette.type ? e.palette.grey[400] : e.palette.grey[800]
                        },
                        "&$checked + $track": {
                            backgroundColor: e.palette.secondary.main
                        },
                        "&$disabled + $track": {
                            backgroundColor: "light" === e.palette.type ? e.palette.common.black : e.palette.common.white
                        }
                    },
                    sizeSmall: {
                        width: 40,
                        height: 24,
                        padding: 7,
                        "& $thumb": {
                            width: 16,
                            height: 16
                        },
                        "& $switchBase": {
                            padding: 4,
                            "&$checked": {
                                transform: "translateX(16px)"
                            }
                        }
                    },
                    checked: {},
                    disabled: {},
                    input: {
                        left: "-100%",
                        width: "300%"
                    },
                    thumb: {
                        boxShadow: e.shadows[1],
                        backgroundColor: "currentColor",
                        width: 20,
                        height: 20,
                        borderRadius: "50%"
                    },
                    track: {
                        height: "100%",
                        width: "100%",
                        borderRadius: 7,
                        zIndex: -1,
                        transition: e.transitions.create(["opacity", "background-color"], {
                            duration: e.transitions.duration.shortest
                        }),
                        backgroundColor: "light" === e.palette.type ? e.palette.common.black : e.palette.common.white,
                        opacity: "light" === e.palette.type ? .38 : .3
                    }
                }
            }), {
                name: "MuiSwitch"
            })(u)
        },
        91790: function(e, t, n) {
            "use strict";
            var a = n(64836),
                o = n(75263);
            t.Z = void 0;
            var i = o(n(67294)),
                r = (0, a(n(2108)).default)(i.createElement("path", {
                    d: "M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41l-6.58-6.6a.9959.9959 0 00-1.41 0c-.39.39-.39 1.02 0 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z"
                }), "ArrowForwardRounded");
            t.Z = r
        },
        85976: function(e, t, n) {
            "use strict";
            var a = n(64836),
                o = n(75263);
            t.Z = void 0;
            var i = o(n(67294)),
                r = (0, a(n(2108)).default)(i.createElement("path", {
                    d: "M12 4H5C3.34 4 2 5.34 2 7v8c0 1.66 1.34 3 3 3l-1 1v1h1l2-2.03L9 18v-5H4V5.98L13 6v2h2V7c0-1.66-1.34-3-3-3zM5 14c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm15.57-4.34c-.14-.4-.52-.66-.97-.66h-7.19c-.46 0-.83.26-.98.66L10 13.77l.01 5.51c0 .38.31.72.69.72h.62c.38 0 .68-.38.68-.76V18h8v1.24c0 .38.31.76.69.76h.61c.38 0 .69-.34.69-.72l.01-1.37v-4.14l-1.43-4.11zm-8.16.34h7.19l1.03 3h-9.25l1.03-3zM12 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
                }), "Commute");
            t.Z = r
        },
        10306: function(e, t, n) {
            "use strict";
            var a = n(64836),
                o = n(75263);
            t.Z = void 0;
            var i = o(n(67294)),
                r = (0, a(n(2108)).default)(i.createElement("path", {
                    d: "M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"
                }), "DesktopWindows");
            t.Z = r
        },
        4262: function(e, t, n) {
            "use strict";
            var a = n(64836),
                o = n(75263);
            t.Z = void 0;
            var i = o(n(67294)),
                r = (0, a(n(2108)).default)(i.createElement("path", {
                    d: "M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"
                }), "DriveEta");
            t.Z = r
        },
        97480: function(e, t, n) {
            "use strict";
            var a = n(64836),
                o = n(75263);
            t.Z = void 0;
            var i = o(n(67294)),
                r = (0, a(n(2108)).default)(i.createElement("path", {
                    d: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"
                }), "Event");
            t.Z = r
        },
        22074: function(e, t, n) {
            "use strict";
            var a = n(64836),
                o = n(75263);
            t.Z = void 0;
            var i = o(n(67294)),
                r = (0, a(n(2108)).default)(i.createElement("path", {
                    d: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                }), "LocalShipping");
            t.Z = r
        },
        67911: function(e, t, n) {
            "use strict";
            var a = n(64836),
                o = n(75263);
            t.Z = void 0;
            var i = o(n(67294)),
                r = (0, a(n(2108)).default)(i.createElement("path", {
                    d: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5l1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
                }), "LocalShippingOutlined");
            t.Z = r
        },
        30913: function(e, t, n) {
            "use strict";
            var a = n(64836),
                o = n(75263);
            t.Z = void 0;
            var i = o(n(67294)),
                r = (0, a(n(2108)).default)(i.createElement("path", {
                    d: "M17.5 10c-.03 0-.05.01-.08.01L13.41 6H9v2h3.59l2 2h-8.1C4.01 10 2 12.02 2 14.5 2 16.99 4.01 19 6.5 19c2.22 0 4.06-1.62 4.42-3.73L13.04 14c-.02.17-.04.33-.04.5 0 2.49 2.01 4.5 4.5 4.5s4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm-8.66 5.26C8.52 16.27 7.58 17 6.47 17c-1.38 0-2.5-1.12-2.5-2.5S5.09 12 6.47 12c1.12 0 2.05.74 2.37 1.75H6v1.5l2.84.01zM17.47 17c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                }), "Motorcycle");
            t.Z = r
        },
        24155: function(e, t, n) {
            "use strict";
            var a = n(64836),
                o = n(75263);
            t.Z = void 0;
            var i = o(n(67294)),
                r = (0, a(n(2108)).default)(i.createElement(i.Fragment, null, i.createElement("path", {
                    d: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"
                }), i.createElement("circle", {
                    cx: "12",
                    cy: "9",
                    r: "2.5"
                })), "RoomOutlined");
            t.Z = r
        },
        48312: function(e, t, n) {
            (window.__NEXT_P = window.__NEXT_P || []).push(["/", function() {
                return n(29546)
            }])
        },
        48728: function(e, t, n) {
            "use strict";
            n.d(t, {
                q: function() {
                    return o
                }
            });
            var a = n(24196),
                o = function(e) {
                    return a.eE.post("/search/leilao", e).then((function(e) {
                        return e.data
                    }))
                }
        },
        12981: function(e, t, n) {
            "use strict";
            n.d(t, {
                Z: function() {
                    return C
                }
            });
            var a = n(14924),
                o = n(85893),
                i = n(41120),
                r = n(43832),
                s = n(67294),
                c = n(26042),
                l = n(69396),
                d = n(59009),
                u = n(67265),
                p = n(22318),
                m = n(4262),
                h = n(41664),
                x = n.n(h),
                g = (0, i.Z)((function(e) {
                    return (0, a.Z)({
                        root: {
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            width: "fit-content",
                            padding: e.spacing(.5)
                        },
                        circle: {
                            width: e.spacing(6),
                            height: e.spacing(6),
                            marginBottom: e.spacing(.5),
                            border: "2px solid #fff",
                            position: "relative",
                            boxShadow: "0px 0px 0px 2px ".concat(e.palette.grey[200]),
                            "&[data-current=true]": {
                                boxShadow: "0px 0px 0px 2px ".concat(e.palette.primary.light)
                            },
                            "&[data-live=true]": {
                                boxShadow: "0px 0px 0px 2px ".concat(e.palette.success.main)
                            }
                        },
                        selected: {
                            "& $circle": {
                                boxShadow: "0px 0px 0px 2px #000"
                            },
                            "& .MuiTypography-root": {
                                fontWeight: 600,
                                color: e.palette.text.primary
                            }
                        },
                        imageWrapper: {
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            "& > img": {
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "50%",
                                overflow: "hidden"
                            }
                        },
                        liveText: {
                            color: e.palette.text.primary
                        },
                        badge: {
                            background: e.palette.success.main,
                            whiteSpace: "nowrap",
                            right: "57%",
                            fontSize: "10px"
                        }
                    }, e.breakpoints.up("md"), {
                        circle: {
                            width: e.spacing(9),
                            height: e.spacing(9)
                        },
                        badge: {
                            right: "50%",
                            fontSize: "12px"
                        }
                    })
                })),
                v = function(e) {
                    var t = e.url,
                        n = e.image,
                        a = e.description,
                        i = e.number,
                        r = e.isLive,
                        s = e.isSelected,
                        h = e.isCurrent,
                        v = g(),
                        f = s ? "".concat(v.root, " ").concat(v.selected) : v.root,
                        j = r ? "Ver V\xeddeo" : h ? "Lote atual" : "Lote ".concat(i);
                    return (0, o.jsx)(x(), {
                        prefetch: !1,
                        href: t,
                        children: (0, o.jsxs)("a", (0, l.Z)((0, c.Z)({
                            className: f,
                            href: t,
                            "aria-label": "link para o evento ao vivo"
                        }, r ? {
                            target: "_blank",
                            rel: "noreferrer"
                        } : {}), {
                            children: [(0, o.jsx)(d.Z, {
                                color: "primary",
                                overlap: "circular",
                                badgeContent: (0, o.jsx)("span", {
                                    children: "AO VIVO"
                                }),
                                classes: {
                                    anchorOriginBottomRightCircular: v.badge
                                },
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "right"
                                },
                                invisible: !r,
                                children: (0, o.jsx)(u.Z, {
                                    "data-current": h,
                                    "data-live": r,
                                    className: v.circle,
                                    alt: a,
                                    src: "".concat("https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/KwUyhjEv9VxIWkPo_Ql7FUmLthg8HKxwThZvvaed7_Tqz9QfJfwrzzgt_3EIvqRG/n/loopbrasil/b/vehicle-photos/o", "/").concat("xs", "/").concat(n),
                                    children: (0, o.jsx)(m.Z, {})
                                })
                            }), (0, o.jsx)(p.Z, {
                                variant: "caption",
                                align: "center",
                                color: r ? "textPrimary" : "textSecondary",
                                children: j
                            })]
                        }))
                    })
                },
                f = n(63457),
                j = n(71911),
                b = n(30719),
                Z = function(e) {
                    var t = e.position,
                        n = e.isSelected,
                        a = e.children,
                        i = (0, b.oc)();
                    return (0, s.useEffect)((function() {
                        n && i.slideTo(t)
                    }), [t, n, i]), (0, o.jsx)(o.Fragment, {
                        children: a
                    })
                },
                y = (n(30933), n(92), n(68770), n(30706), n(13390), (0, i.Z)((function(e) {
                    return (0, a.Z)({
                        root: {
                            display: "flex",
                            maxWidth: "100%"
                        },
                        slider: {
                            "& .swiper-slide": {
                                width: "auto"
                            }
                        },
                        prev: {
                            width: e.spacing(4),
                            cursor: "pointer",
                            marginRight: e.spacing(2)
                        },
                        next: {
                            width: e.spacing(4),
                            cursor: "pointer",
                            marginLeft: e.spacing(2)
                        }
                    }, e.breakpoints.up("md"), {
                        slider: {
                            "& .swiper-wrapper": {
                                padding: e.spacing(1, 0)
                            },
                            "& .swiper-scrollbar": {
                                bottom: "0px",
                                "& .swiper-scrollbar-drag": {
                                    background: "#00000040"
                                }
                            }
                        }
                    })
                }))),
                w = function(e) {
                    var t = e.lots,
                        n = e.selectedLot,
                        a = e.currentLot,
                        i = y(),
                        r = (0, s.useRef)(null),
                        c = (0, f.Z)("(min-width: 960px)"),
                        l = !c || (null === t || void 0 === t ? void 0 : t.length) < 10,
                        d = function(e) {
                            var t = r.current;
                            if (t) {
                                var n = "prev" === e ? t.activeIndex - 8 : t.activeIndex + 8;
                                t.slideTo(n)
                            }
                        };
                    return (0, o.jsxs)("div", {
                        className: i.root,
                        children: [l ? null : (0, o.jsx)("img", {
                            src: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Farrow-prev.svg",
                            alt: "retornar lotes",
                            className: i.prev,
                            onClick: function() {
                                return d("prev")
                            },
                            onKeyDown: function(e) {
                                var t = e.key;
                                "Enter" !== t && " " !== t || d("prev")
                            }
                        }), (0, o.jsx)(b.tq, {
                            className: i.slider,
                            slidesPerView: "auto",
                            modules: [j.LW, j.Rv],
                            scrollbar: !!c && {
                                draggable: !0
                            },
                            freeMode: !0,
                            spaceBetween: 8,
                            loop: !1,
                            onInit: function(e) {
                                return r.current = e
                            },
                            children: t.map((function(e, t) {
                                return (0, o.jsx)(b.o5, {
                                    children: (0, o.jsx)(Z, {
                                        isSelected: e.id === n,
                                        position: t,
                                        children: (0, o.jsx)(v, {
                                            description: e.description,
                                            image: e.vehicle.image,
                                            number: e.number,
                                            url: e.url,
                                            isSelected: e.id === n,
                                            isCurrent: e.id === a
                                        }, e.id)
                                    })
                                }, e.id)
                            }))
                        }), l ? null : (0, o.jsx)("img", {
                            src: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Farrow-next.svg",
                            alt: "pr\xf3ximos lotes",
                            onClick: function() {
                                return d("next")
                            },
                            onKeyDown: function(e) {
                                var t = e.key;
                                "Enter" !== t && " " !== t || d("next")
                            },
                            className: i.next
                        })]
                    })
                },
                N = (0, i.Z)((function(e) {
                    return {
                        root: {
                            borderBottom: "1px solid ".concat(e.palette.grey[200]),
                            padding: e.spacing(1, 0),
                            marginBottom: e.spacing(1)
                        },
                        container: {
                            display: "grid",
                            gridTemplateColumns: "".concat(e.spacing(11), "px calc(100% - ").concat(e.spacing(11), "px)")
                        },
                        currentLot: (0, a.Z)({
                            alignSelf: "center",
                            marginRight: e.spacing(1)
                        }, e.breakpoints.up("md"), {
                            paddingTop: e.spacing(.5)
                        })
                    }
                })),
                k = function(e) {
                    var t = e.lots,
                        n = e.divider,
                        a = e.selected,
                        i = e.current,
                        s = e.hasLiveVideo,
                        c = N();
                    return (0, o.jsx)("section", {
                        className: n ? c.root : "",
                        children: (0, o.jsxs)(r.Z, {
                            className: s ? c.container : "",
                            children: [s && i ? (0, o.jsx)("div", {
                                className: c.currentLot,
                                children: (0, o.jsx)(v, {
                                    isCurrent: !0,
                                    isLive: !0,
                                    description: i.lot.description,
                                    url: "https://www.youtube.com/@LoopCarros/live",
                                    image: i.lot.vehicle.image
                                })
                            }) : null, (0, o.jsx)(w, {
                                selectedLot: a,
                                lots: t,
                                currentLot: null === i || void 0 === i ? void 0 : i.index
                            })]
                        })
                    })
                },
                C = s.memo(k)
        },
        83730: function(e, t, n) {
            "use strict";
            var a = n(85893),
                o = (0, n(41120).Z)((function(e) {
                    return {
                        sectionTag: {
                            color: e.palette.primary.main,
                            fontSize: "10px",
                            fontWeight: 500,
                            letterSpacing: "1px",
                            marginBottom: "10px"
                        }
                    }
                }));
            t.Z = function(e) {
                var t = e.tag,
                    n = o();
                return (0, a.jsx)("span", {
                    className: n.sectionTag,
                    children: t.toUpperCase()
                })
            }
        },
        11067: function(e, t, n) {
            "use strict";
            var a = n(85893),
                o = n(41120),
                i = n(22318),
                r = (0, o.Z)((function(e) {
                    return {
                        root: {
                            alignItems: "center",
                            backgroundColor: e.palette.text.primary,
                            borderRadius: e.shape.borderRadius,
                            color: "#fff",
                            display: "flex",
                            padding: "4px 8px"
                        },
                        icon: {
                            height: "12px",
                            marginRight: "4px",
                            width: "12px"
                        },
                        text: {
                            color: "#fff",
                            fontSize: "12px"
                        }
                    }
                }));
            t.Z = function(e) {
                var t = e.Icon,
                    n = e.text,
                    o = r();
                return (0, a.jsxs)("div", {
                    className: o.root,
                    children: [(0, a.jsx)(t, {
                        className: o.icon
                    }), (0, a.jsx)(i.Z, {
                        variant: "h5",
                        className: o.text,
                        children: n
                    })]
                })
            }
        },
        35322: function(e, t, n) {
            "use strict";
            n.d(t, {
                Z: function() {
                    return x
                }
            });
            var a = n(26042),
                o = n(85893),
                i = n(68468),
                r = n(16204),
                s = n(88995),
                c = n(53437),
                l = n(69396),
                d = n(29815),
                u = n(48728),
                p = n(88767),
                m = function(e, t) {
                    var n = {
                        size: 0,
                        query: {
                            bool: {
                                must: []
                            }
                        },
                        aggs: {
                            brands: {
                                terms: {
                                    size: 1e4,
                                    field: "brand.keyword"
                                }
                            },
                            composite_brand_model: {
                                composite: {
                                    size: 1e4,
                                    sources: [{
                                        brand: {
                                            terms: {
                                                field: "brand.keyword"
                                            }
                                        }
                                    }, {
                                        model: {
                                            terms: {
                                                field: "model.keyword"
                                            }
                                        }
                                    }]
                                }
                            }
                        }
                    };
                    return "all" !== e && n.query.bool.must.push({
                        term: {
                            category: e
                        }
                    }), t || n.query.bool.must.push({
                        exists: {
                            field: "event.id"
                        }
                    }), n
                },
                h = n(67294),
                x = function(e) {
                    var t, n, x, g = e.category,
                        v = e.usePublicStock,
                        f = void 0 !== v && v,
                        j = e.onSelected,
                        b = e.InputProps,
                        Z = e.className,
                        y = (0, h.useState)(""),
                        w = y[0],
                        N = y[1],
                        k = (0, h.useState)(!1),
                        C = k[0],
                        S = k[1],
                        L = (t = g, n = f, x = {
                            enabled: C
                        }, (0, p.useQuery)(["ad", {
                            type: t,
                            publicStock: n
                        }], (function() {
                            return (0, u.q)(m(t, n))
                        }), (0, l.Z)((0, a.Z)({}, x), {
                            select: function(e) {
                                var t = e.aggregations,
                                    n = t.brands.buckets.map((function(e) {
                                        return {
                                            key: e.key,
                                            brand: e.key,
                                            type: "marca"
                                        }
                                    })),
                                    a = t.composite_brand_model.buckets.map((function(e) {
                                        return {
                                            key: "".concat(e.key.brand, " ").concat(e.key.model),
                                            model: e.key.model,
                                            brand: e.key.brand,
                                            type: "modelo"
                                        }
                                    }));
                                return (0, d.Z)(n).concat((0, d.Z)(a))
                            }
                        }))).data;
                    return (0, o.jsx)(c.ZP, {
                        className: Z,
                        openOnFocus: !1,
                        onFocus: function() {
                            return S(!0)
                        },
                        open: w.length >= 2,
                        options: L || [],
                        groupBy: function(e) {
                            return e.type
                        },
                        getOptionLabel: function(e) {
                            return e.key.toLowerCase()
                        },
                        noOptionsText: "N\xe3o temos essa marca ou modelo.",
                        clearOnBlur: !0,
                        popupIcon: (0, o.jsx)(s.Z, {}),
                        onChange: function(e, t, n) {
                            return null === j || void 0 === j ? void 0 : j(t, n)
                        },
                        renderTags: function(e, t) {
                            return e.map((function(e, n) {
                                return (0, o.jsx)(r.Z, (0, a.Z)({
                                    variant: "outlined",
                                    label: e.key
                                }, t({
                                    index: n
                                })), e.key)
                            }))
                        },
                        onInputChange: function(e, t, n) {
                            N("reset" === n ? "" : t)
                        },
                        renderInput: function(e) {
                            return (0, o.jsx)(i.Z, (0, a.Z)({
                                variant: "outlined",
                                placeholder: "Digite a marca ou modelo"
                            }, b, e))
                        }
                    })
                }
        },
        88079: function(e, t, n) {
            "use strict";
            var a = n(85893);
            t.Z = function(e) {
                var t = e.className;
                return (0, a.jsx)("svg", {
                    role: "presentation",
                    width: 60,
                    height: 60,
                    className: t,
                    viewBox: "0 0 60 60",
                    children: (0, a.jsx)("g", {
                        clipPath: "url(#prefix__a)",
                        children: (0, a.jsx)("path", {
                            d: "M9.882 41.86l4.558-17a20.8 20.8 0 0025.452-14.612l17 4.558A38.4 38.4 0 019.882 41.86z",
                            fill: "#ff5876"
                        })
                    })
                })
            }
        },
        86404: function(e, t, n) {
            "use strict";
            var a = n(85893);
            t.Z = function(e) {
                var t = e.className;
                return (0, a.jsx)("svg", {
                    role: "presentation",
                    width: 151,
                    height: 29,
                    className: t,
                    viewBox: "0 0 151 29",
                    children: (0, a.jsxs)("g", {
                        clipPath: "url(#prefix__a)",
                        children: [(0, a.jsx)("path", {
                            d: "M.022-.185v.261C.233.055 21.201-1.916 35.27 9.101c1.173.92 2.407 1.955 3.713 3.051 7.853 6.6 18.584 15.578 36.318 15.831a3.954 3.954 0 00.753 0c17.733-.253 28.463-9.235 36.319-15.831 1.3-1.1 2.537-2.131 3.71-3.051C130.152-1.919 151.339.112 151.339.112v-.3c-.062-.006-1.828 0-4.687 0",
                            fill: "#fff"
                        }), (0, a.jsx)("path", {
                            d: "M82.283 8.574l-6.727 6.729-6.735-6.736a.659.659 0 00-.453-.17.622.622 0 00-.438.2.636.636 0 00.006.869l7.179 7.177a.532.532 0 00.212.121.611.611 0 00.241.049.635.635 0 00.441-.179l7.165-7.167a.63.63 0 000-.893.645.645 0 00-.891 0z",
                            fill: "#1e2126"
                        })]
                    })
                })
            }
        },
        30306: function(e, t, n) {
            "use strict";
            n.d(t, {
                $1: function() {
                    return i
                },
                d8: function() {
                    return o
                }
            });
            var a = n(10253),
                o = function(e, t, n, a) {
                    var o = r(e, t, n);
                    a ? a.setHeader("Set-Cookie", o) : document.cookie = o
                },
                i = function(e) {
                    return e ? e.cookies : s(document.cookie)
                },
                r = function(e, t, n) {
                    var a = "".concat(e, "=").concat(t, ";");
                    if (!n) return a;
                    var o, i, r = n.expires ? " expires=".concat(n.expires.toUTCString(), ";") : "",
                        s = " path=".concat(null !== (o = n.path) && void 0 !== o ? o : "/", ";"),
                        c = n.httpOnly ? " httponly;" : "",
                        l = n.secure ? " secure;" : "",
                        d = " samesite=".concat(null !== (i = n.sameSite) && void 0 !== i ? i : "lax", " ;");
                    return "".concat(a).concat(r).concat(s).concat(c).concat(d).concat(l)
                },
                s = function(e) {
                    return e.split("; ").reduce((function(e, t) {
                        var n = (0, a.Z)(t.split("="), 2),
                            o = n[0],
                            i = n[1];
                        return e[o] = i, e
                    }), {})
                }
        },
        13181: function(e, t, n) {
            "use strict";
            n.d(t, {
                m: function() {
                    return u
                }
            });
            var a = n(47568),
                o = n(26042),
                i = n(70655),
                r = n(24196),
                s = n(29598),
                c = n(78470),
                l = n(88767),
                d = function() {
                    var e = (0, a.Z)((function(e) {
                        var t;
                        return (0, i.__generator)(this, (function(n) {
                            return t = e.api, [2, (0, r.Nv)("get", "/auction/users/account", void 0, t).then((function(e) {
                                return e.data
                            }))]
                        }))
                    }));
                    return function(t) {
                        return e.apply(this, arguments)
                    }
                }(),
                u = function(e) {
                    var t = (0, c.a)().isAuthenticated;
                    return (0, l.useQuery)(s.R.getUserAccount(), (function() {
                        return d({
                            data: void 0
                        })
                    }), (0, o.Z)({
                        enabled: t
                    }, e))
                }
        },
        24454: function(e, t, n) {
            "use strict";
            var a = n(85893),
                o = (0, n(41120).Z)((function(e) {
                    return {
                        root: {
                            width: "100%",
                            color: "#fff",
                            position: "absolute",
                            top: 0,
                            right: 0,
                            borderRadius: e.spacing(1, 1, 0, 0),
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: 500,
                            padding: "1px",
                            backgroundColor: e.palette.primary.main
                        },
                        live: {
                            backgroundColor: e.palette.success.main
                        }
                    }
                }));
            t.Z = function(e) {
                var t = e.status,
                    n = o();
                return "live" === t ? (0, a.jsx)("div", {
                    className: "".concat(n.root, " ").concat(n.live),
                    children: "Leil\xe3o em preg\xe3o"
                }) : (0, a.jsx)("div", {
                    className: n.root,
                    children: "Evento em loteamento"
                })
            }
        },
        28964: function(e, t, n) {
            "use strict";
            var a = n(85893),
                o = n(41120),
                i = n(41749),
                r = n(43832),
                s = n(86404),
                c = (0, o.Z)((function(e) {
                    return {
                        root: {
                            marginBottom: "92px"
                        },
                        background: {
                            backgroundColor: e.palette.grey[50],
                            maxWidth: "1400px",
                            paddingTop: "48px",
                            paddingBottom: "40px",
                            width: "100%",
                            position: "relative"
                        },
                        goutUp: {
                            position: "absolute",
                            top: "0",
                            left: "0",
                            right: "0",
                            margin: "0 auto"
                        }
                    }
                }));
            t.Z = function(e) {
                var t = e.children,
                    n = c();
                return (0, a.jsx)(i.Z, {
                    container: !0,
                    justifyContent: "center",
                    component: "section",
                    className: n.root,
                    children: (0, a.jsxs)("div", {
                        className: n.background,
                        children: [(0, a.jsx)(s.Z, {
                            className: n.goutUp
                        }), (0, a.jsx)(r.Z, {
                            children: t
                        })]
                    })
                })
            }
        },
        78262: function(e, t, n) {
            "use strict";
            n.d(t, {
                Z: function() {
                    return b
                }
            });
            var a = n(85893),
                o = n(63457),
                i = n(71062),
                r = n(71911),
                s = n(24196),
                c = n(29598),
                l = n(88767),
                d = function() {
                    var e = (0, l.useQuery)(c.R.getNewsList(), (function() {
                        return function() {
                            var e = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).hasLimit;
                            return s.K5.get("/noticias".concat(e ? "?_limit=4" : "")).then((function(e) {
                                return e.data
                            }))
                        }({
                            hasLimit: !0
                        })
                    }), {
                        refetchOnMount: !1
                    });
                    return e
                },
                u = n(22318),
                p = n(282),
                m = n(41120),
                h = n(25675),
                x = n.n(h),
                g = (0, m.Z)((function(e) {
                    return {
                        container: {
                            backgroundColor: "#fff",
                            border: "1px solid ".concat(e.palette.grey[200]),
                            borderRadius: e.shape.borderRadius,
                            display: "flex",
                            flexDirection: "column",
                            height: "450px",
                            overflow: "hidden"
                        },
                        category: {
                            alignItems: "center",
                            backgroundColor: e.palette.primary.light,
                            borderRadius: e.spacing(.5),
                            color: "#fff",
                            display: "flex",
                            fontSize: "12px",
                            fontWeight: 600,
                            height: e.spacing(3),
                            justifyContent: "center",
                            margin: e.spacing(3),
                            padding: "0 ".concat(e.spacing(2), "px"),
                            position: "absolute",
                            width: "auto"
                        },
                        imageContainer: {
                            marginBottom: e.spacing(2)
                        },
                        image: {
                            objectFit: "cover"
                        },
                        textsContainer: {
                            display: "flex",
                            flexDirection: "column",
                            height: "60%",
                            justifyContent: "space-between",
                            padding: "0 ".concat(e.spacing(3), "px")
                        },
                        title: {
                            marginBottom: e.spacing(.5),
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        },
                        threeDots: {
                            color: e.palette.primary.light,
                            fontSize: e.spacing(3),
                            fontWeight: 600,
                            letterSpacing: e.spacing(.5)
                        },
                        buttonContainer: {
                            position: "relative",
                            height: "100%"
                        },
                        buttonLink: {
                            bottom: 0,
                            left: 0,
                            position: "absolute",
                            textDecoration: "none"
                        },
                        button: {
                            fontSize: e.spacing(1.5),
                            height: e.spacing(4),
                            marginBottom: e.spacing(3),
                            width: e.spacing(10)
                        }
                    }
                })),
                v = function(e) {
                    var t = e.news,
                        n = g(),
                        o = t.image.formats ? t.image.formats.small : t.image;
                    return (0, a.jsxs)("div", {
                        className: n.container,
                        id: "NewsCard",
                        children: [(0, a.jsx)("div", {
                            className: n.imageContainer,
                            children: (0, a.jsx)(x(), {
                                src: "".concat("https://strapi.loopbrasil.com").concat(o.url),
                                alt: t.image.alternativeText,
                                height: 200,
                                width: 400,
                                className: n.image,
                                loading: "lazy"
                            })
                        }), (0, a.jsxs)("div", {
                            className: n.textsContainer,
                            children: [(0, a.jsxs)("div", {
                                children: [(0, a.jsx)(u.Z, {
                                    variant: "h3",
                                    className: n.title,
                                    children: t.title
                                }), (0, a.jsx)(u.Z, {
                                    variant: "body2",
                                    children: t.meta.description
                                })]
                            }), (0, a.jsx)("span", {
                                className: n.threeDots,
                                children: "..."
                            }), (0, a.jsx)("div", {
                                className: n.buttonContainer,
                                children: (0, a.jsx)("a", {
                                    href: "/noticias/".concat(t.SEO_URL),
                                    className: n.buttonLink,
                                    id: "read_more_link",
                                    children: (0, a.jsx)(p.Z, {
                                        id: "read_more_button",
                                        type: "button",
                                        color: "secondary",
                                        variant: "contained",
                                        size: "small",
                                        className: n.button,
                                        children: "LEIA MAIS"
                                    })
                                })
                            })]
                        })]
                    })
                },
                f = n(66895),
                j = n(28964),
                b = function() {
                    var e = (0, o.Z)("(max-width: 960px)"),
                        t = (0, o.Z)("(max-width: 600px)"),
                        n = d().data,
                        s = t ? 1 : e ? 2 : 3;
                    return n ? (0, a.jsxs)(j.Z, {
                        children: [(0, a.jsx)(f.Z, {
                            tag: "not\xedcias",
                            children: "Acompanhe as novidades"
                        }), (0, a.jsx)(i.Z, {
                            settings: {
                                slidesPerView: s,
                                spaceBetween: 16,
                                modules: [r.tl],
                                pagination: {
                                    clickable: !0
                                }
                            },
                            children: n.reverse().map((function(e) {
                                return (0, a.jsx)(v, {
                                    news: e
                                }, e.SEO_URL)
                            }))
                        })]
                    }) : null
                }
        },
        66895: function(e, t, n) {
            "use strict";
            var a = n(85893),
                o = n(41120),
                i = n(22318),
                r = n(83730),
                s = (0, o.Z)((function() {
                    return {
                        title: {
                            lineHeight: "28px"
                        }
                    }
                }));
            t.Z = function(e) {
                var t = e.tag,
                    n = e.children,
                    o = s();
                return (0, a.jsxs)("div", {
                    children: [(0, a.jsx)(r.Z, {
                        tag: t
                    }), (0, a.jsx)(i.Z, {
                        variant: "h2",
                        className: o.title,
                        gutterBottom: !0,
                        children: n
                    })]
                })
            }
        },
        51791: function(e, t, n) {
            "use strict";
            n.d(t, {
                R: function() {
                    return o
                }
            });
            var a = n(67294),
                o = function(e, t) {
                    var n = (0, a.useRef)(!0),
                        o = (0, a.useState)("function" === typeof t ? t() : t),
                        i = o[0],
                        r = o[1];
                    return (0, a.useEffect)((function() {
                        n.current && (r(function(e, t) {
                            if (!localStorage) return "function" === typeof t ? t() : t;
                            var n = localStorage.getItem(e);
                            if (n) try {
                                return JSON.parse(n)
                            } catch (a) {
                                localStorage.removeItem(e)
                            }
                            return "function" === typeof t ? t() : t
                        }(e, t)), n.current = !1)
                    }), [e, t]), (0, a.useEffect)((function() {
                        localStorage.setItem(e, JSON.stringify(i))
                    }), [e, i]), [i, r]
                }
        },
        42530: function(e, t, n) {
            "use strict";
            n.d(t, {
                s: function() {
                    return i
                }
            });
            var a = n(67294),
                o = (0, n(67642).ZP)("wss://ws.loopbrasil.com/auction", {
                    transports: ["websocket"],
                    reconnection: !0,
                    autoConnect: !1
                }),
                i = function() {
                    return (0, a.useEffect)((function() {
                        if (o) {
                            o.connected || o.connect();
                            return function() {
                                o.disconnect()
                            }
                        }
                    }), []), o
                }
        },
        29546: function(e, t, n) {
            "use strict";
            n.r(t), n.d(t, {
                __N_SSG: function() {
                    return Qt
                },
                default: function() {
                    return Ut
                }
            });
            var a = n(85893),
                o = n(38197),
                i = n(57139),
                r = n(55435),
                s = n(41120),
                c = n(43832),
                l = n(41749),
                d = n(78470),
                u = n(66895),
                p = n(83516),
                m = n(63457),
                h = n(71062),
                x = n(71911),
                g = n(14924),
                v = n(26042),
                f = n(69396),
                j = n(2094),
                b = n(24454),
                Z = n(34362),
                y = n(67294),
                w = (0, n(63786).Z)(y.createElement("path", {
                    d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                }), "Star"),
                N = n(11067),
                k = (0, s.Z)((function(e) {
                    return {
                        root: {
                            display: "flex",
                            zIndex: 1,
                            gap: e.spacing(.5),
                            position: "absolute",
                            right: e.spacing(3),
                            top: e.spacing(3)
                        }
                    }
                })),
                C = function(e) {
                    var t = e.featured,
                        n = e.inRepasse,
                        o = k();
                    return n ? (0, a.jsx)("div", {
                        className: o.root,
                        children: (0, a.jsx)(N.Z, {
                            Icon: Z.Z,
                            text: "Lotes em repasse"
                        })
                    }) : t ? (0, a.jsx)("div", {
                        className: o.root,
                        children: (0, a.jsx)(N.Z, {
                            Icon: w,
                            text: "Destaque"
                        })
                    }) : null
                },
                S = n(22318),
                L = n(42674),
                z = n(67911),
                R = n(42764),
                _ = n(25862),
                E = n(10306),
                B = n(24155),
                I = (0, s.Z)((function(e) {
                    return {
                        root: {
                            alignItems: "center",
                            display: "inline-flex"
                        },
                        icon: {
                            height: e.spacing(2),
                            marginRight: e.spacing(1),
                            width: e.spacing(2)
                        }
                    }
                })),
                M = function(e) {
                    var t = e.type,
                        n = e.location,
                        o = I();
                    return "online" === t ? (0, a.jsxs)("div", {
                        className: o.root,
                        children: [(0, a.jsx)(E.Z, {
                            className: o.icon,
                            "data-testid": "pc"
                        }), (0, a.jsx)("span", {
                            children: "Online"
                        })]
                    }) : (0, a.jsxs)("div", {
                        className: o.root,
                        children: [(0, a.jsx)(B.Z, {
                            className: o.icon,
                            "data-testid": "maps"
                        }), (0, a.jsx)("span", {
                            children: n
                        })]
                    })
                },
                T = (0, s.Z)((function(e) {
                    return {
                        root: {
                            fontWeight: 500,
                            marginBottom: e.spacing(3)
                        },
                        dateTime: {
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: e.spacing(2)
                        },
                        container: {
                            alignItems: "center",
                            display: "inline-flex"
                        },
                        icon: {
                            height: e.spacing(2),
                            marginRight: e.spacing(1),
                            width: e.spacing(2)
                        },
                        title: {
                            fontWeight: 600,
                            marginBottom: e.spacing(4)
                        },
                        footer: {
                            borderTop: "1px solid ".concat(e.palette.grey[200]),
                            paddingTop: e.spacing(3)
                        }
                    }
                })),
                F = function(e) {
                    var t = e.event,
                        n = T();
                    return (0, a.jsxs)("div", {
                        children: [(0, a.jsx)("div", {
                            children: (0, a.jsx)(S.Z, {
                                variant: "h5",
                                className: n.title,
                                children: t.title
                            })
                        }), (0, a.jsxs)("div", {
                            className: n.root,
                            children: [(0, a.jsxs)("div", {
                                className: n.dateTime,
                                children: [(0, a.jsxs)("div", {
                                    className: n.container,
                                    children: [(0, a.jsx)(L.Z, {
                                        className: n.icon
                                    }), (0, _.o)(t.date)]
                                }), (0, a.jsxs)("div", {
                                    className: n.container,
                                    children: [(0, a.jsx)(R.Z, {
                                        className: n.icon
                                    }), t.time]
                                })]
                            }), (0, a.jsxs)("div", {
                                className: n.container,
                                children: [(0, a.jsx)(z.Z, {
                                    className: n.icon
                                }), t.numberOfLots, " ve\xedculos"]
                            })]
                        }), (0, a.jsx)("div", {
                            className: n.footer,
                            children: (0, a.jsx)(M, {
                                type: t.type,
                                location: t.location
                            })
                        })]
                    })
                },
                q = (0, s.Z)((function(e) {
                    return (0, g.Z)({
                        root: {
                            border: "1px solid ".concat(e.palette.grey[200]),
                            borderRadius: e.shape.borderRadius,
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            width: "100%"
                        },
                        card: {
                            backgroundColor: "#FFF",
                            borderRadius: e.shape.borderRadius,
                            height: "308px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-around",
                            padding: "24px",
                            transition: ".2s linear"
                        },
                        link: {
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: e.palette.grey[50]
                            }
                        },
                        logo: {
                            width: "100px",
                            height: "36px",
                            marginBottom: "8px"
                        }
                    }, e.breakpoints.up("md"), {
                        root: {
                            minWidth: "260px"
                        }
                    })
                })),
                O = function(e) {
                    var t = e.containerProps,
                        n = e.className,
                        o = e.event,
                        i = e.featured,
                        r = q(),
                        s = (0, d.a)().isAuthenticated,
                        c = o.lotInAuction && !o.inRepasse,
                        l = "listagem_parcial" === o.status;
                    if (0 === o.numberOfLots || "em_loteamento_nao_liberado" === o.status) return (0, a.jsxs)("div", (0, f.Z)((0, v.Z)({}, t), {
                        className: "".concat(r.root, " ").concat(null === t || void 0 === t ? void 0 : t.className),
                        children: [(0, a.jsx)(b.Z, {
                            status: "allotment"
                        }), (0, a.jsx)(C, {
                            featured: i
                        }), (0, a.jsxs)("div", {
                            className: "".concat(r.card, " ").concat(n),
                            children: [(0, a.jsx)("div", {
                                className: r.logo,
                                children: (0, a.jsx)(j.Z, {
                                    id: o.principalId,
                                    description: o.principalDescription
                                })
                            }), (0, a.jsx)(F, {
                                event: o
                            })]
                        })]
                    }));
                    var u = o.inRepasse && o.hasLotInRepasse ? "/eventos/".concat(o.slug, "/").concat(o.id, "?status=repasse").concat(s ? "&nps=vai" : "") : o.lotInAuction ? o.lotInAuctionUrl : "/eventos/".concat(o.slug, "/").concat(o.id).concat(s ? "?nps=vai" : "");
                    return l ? (0, a.jsxs)("div", (0, f.Z)((0, v.Z)({}, t), {
                        className: "".concat(r.root, " ").concat(null === t || void 0 === t ? void 0 : t.className),
                        children: [(0, a.jsx)(b.Z, {
                            status: "allotment"
                        }), (0, a.jsx)("a", {
                            href: u,
                            children: (0, a.jsxs)("div", {
                                className: "".concat(r.card, " ").concat(r.link, " ").concat(n),
                                children: [(0, a.jsx)("div", {
                                    className: r.logo,
                                    children: (0, a.jsx)(j.Z, {
                                        id: o.principalId,
                                        description: o.principalDescription
                                    })
                                }), (0, a.jsx)(F, {
                                    event: o
                                })]
                            })
                        })]
                    })) : (0, a.jsxs)("div", (0, f.Z)((0, v.Z)({}, t), {
                        className: "".concat(r.root, " ").concat(null === t || void 0 === t ? void 0 : t.className),
                        children: [c ? (0, a.jsx)(b.Z, {
                            status: "live"
                        }) : (0, a.jsx)(C, {
                            featured: i,
                            inRepasse: o.inRepasse && o.hasLotInRepasse
                        }), (0, a.jsx)("a", {
                            href: u,
                            children: (0, a.jsxs)("div", {
                                className: "".concat(r.card, " ").concat(r.link, " ").concat(n),
                                children: [(0, a.jsx)("div", {
                                    className: r.logo,
                                    children: (0, a.jsx)(j.Z, {
                                        id: o.principalId,
                                        description: o.principalDescription
                                    })
                                }), (0, a.jsx)(F, {
                                    event: o
                                })]
                            })
                        })]
                    }))
                },
                A = (0, s.Z)((function(e) {
                    return {
                        root: {
                            padding: e.spacing(4),
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            "& > div:first-child": {
                                width: "120px",
                                height: "unset",
                                margin: "auto ".concat(e.spacing(3), "px auto 0"),
                                flexGrow: "0"
                            },
                            "& > div:last-child": {
                                flex: "1",
                                marginTop: e.spacing(4)
                            }
                        },
                        container: {
                            maxWidth: e.spacing(80),
                            height: "100%"
                        }
                    }
                })),
                P = function(e) {
                    var t = A();
                    return (0, a.jsx)(O, (0, v.Z)({
                        containerProps: {
                            className: t.container
                        },
                        className: t.root
                    }, e))
                },
                V = function(e) {
                    var t = e.events,
                        n = (0, m.Z)("(max-width: 960px)"),
                        o = (0, m.Z)("(max-width: 600px)"),
                        i = o || n ? 4 : 3,
                        r = o ? 1 : 2,
                        s = t.flatMap((function(e, t) {
                            return t > i ? [] : e
                        })),
                        c = {
                            slidesPerView: r,
                            spaceBetween: 16,
                            modules: [x.tl],
                            pagination: {
                                clickable: !0
                            }
                        };
                    return o || n ? (0, a.jsx)(h.Z, {
                        settings: c,
                        children: s.map((function(e) {
                            return (0, a.jsx)(O, {
                                event: e,
                                featured: e.isFeatured
                            }, e.id)
                        }))
                    }) : s.length > 2 ? (0, a.jsx)(l.Z, {
                        container: !0,
                        direction: "row",
                        wrap: "nowrap",
                        spacing: 2,
                        children: s.map((function(e) {
                            return (0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                children: (0, a.jsx)(O, {
                                    event: e,
                                    featured: e.isFeatured
                                })
                            }, e.id)
                        }))
                    }) : (0, a.jsx)(l.Z, {
                        container: !0,
                        direction: "row",
                        wrap: "nowrap",
                        spacing: 4,
                        children: s.map((function(e) {
                            return (0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                children: (0, a.jsx)(P, {
                                    event: e,
                                    featured: e.isFeatured
                                })
                            }, e.id)
                        }))
                    })
                },
                D = n(11557),
                W = n(58365),
                H = (0, s.Z)((function(e) {
                    return {
                        sliderTag: {
                            borderRadius: e.shape.borderRadius,
                            marginTop: e.spacing(1)
                        },
                        event: {
                            borderRadius: e.shape.borderRadius
                        }
                    }
                })),
                $ = function() {
                    var e = (0, m.Z)("(max-width: 600px)"),
                        t = (0, m.Z)("(max-width: 960px)"),
                        n = (0, m.Z)("(max-width: 1250px)"),
                        o = H();
                    return e ? (0, a.jsxs)(a.Fragment, {
                        children: [(0, a.jsx)(W.Z, {
                            className: o.event,
                            variant: "rect",
                            height: 306,
                            width: "100%"
                        }), (0, a.jsx)(l.Z, {
                            container: !0,
                            justifyContent: "center",
                            children: (0, a.jsx)(W.Z, {
                                variant: "text",
                                height: "40px",
                                width: "86px",
                                className: o.sliderTag
                            })
                        })]
                    }) : t ? (0, a.jsxs)(l.Z, {
                        container: !0,
                        justifyContent: "space-between",
                        children: [(0, a.jsx)(W.Z, {
                            className: o.event,
                            variant: "rect",
                            height: 306,
                            width: "48%"
                        }), (0, a.jsx)(W.Z, {
                            className: o.event,
                            variant: "rect",
                            height: 306,
                            width: "48%"
                        }), (0, a.jsx)(l.Z, {
                            container: !0,
                            justifyContent: "center",
                            children: (0, a.jsx)(W.Z, {
                                variant: "text",
                                height: "40px",
                                width: "86px",
                                className: o.sliderTag
                            })
                        })]
                    }) : n ? (0, a.jsxs)(l.Z, {
                        container: !0,
                        justifyContent: "space-between",
                        children: [(0, a.jsx)(W.Z, {
                            className: o.event,
                            variant: "rect",
                            height: 306,
                            width: "31%"
                        }), (0, a.jsx)(W.Z, {
                            className: o.event,
                            variant: "rect",
                            height: 306,
                            width: "31%"
                        }), (0, a.jsx)(W.Z, {
                            className: o.event,
                            variant: "rect",
                            height: 306,
                            width: "31%"
                        }), (0, a.jsx)(l.Z, {
                            container: !0,
                            justifyContent: "center",
                            children: (0, a.jsx)(W.Z, {
                                variant: "text",
                                height: "40px",
                                width: "86px",
                                className: o.sliderTag
                            })
                        })]
                    }) : (0, a.jsxs)(l.Z, {
                        container: !0,
                        direction: "row",
                        wrap: "nowrap",
                        spacing: 4,
                        justifyContent: "space-between",
                        children: [(0, a.jsx)(l.Z, {
                            item: !0,
                            xs: 12,
                            children: (0, a.jsx)(W.Z, {
                                className: o.event,
                                variant: "rect",
                                height: 306,
                                width: "100%"
                            })
                        }), (0, a.jsx)(l.Z, {
                            item: !0,
                            xs: 12,
                            children: (0, a.jsx)(W.Z, {
                                className: o.event,
                                variant: "rect",
                                height: 306,
                                width: "100%"
                            })
                        })]
                    })
                },
                Q = (0, s.Z)((function() {
                    return {
                        root: {
                            marginBottom: "32px",
                            position: "relative",
                            zIndex: 1
                        },
                        rowButton: {
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "24px"
                        }
                    }
                })),
                U = function() {
                    var e = Q(),
                        t = (0, d.a)().isAuthenticated,
                        n = (0, p.b)(),
                        o = "/eventos".concat(t ? "?nps=vai" : "");
                    return n.isLoading || n.isIdle ? (0, a.jsxs)(c.Z, {
                        component: "section",
                        className: e.root,
                        children: [(0, a.jsx)(u.Z, {
                            tag: "leil\xe3o",
                            children: "Eventos"
                        }), (0, a.jsx)($, {}), (0, a.jsx)(l.Z, {
                            container: !0,
                            justifyContent: "flex-end",
                            className: e.rowButton,
                            children: (0, a.jsx)(D.Z, {
                                href: o,
                                children: "Ver mais eventos"
                            })
                        })]
                    }) : n.isError || 0 === n.data.length ? null : (0, a.jsxs)(c.Z, {
                        component: "section",
                        className: e.root,
                        children: [(0, a.jsx)(u.Z, {
                            tag: "leil\xe3o",
                            children: "Eventos"
                        }), (0, a.jsx)(V, {
                            events: n.data
                        }), (0, a.jsx)(l.Z, {
                            container: !0,
                            justifyContent: "flex-end",
                            className: e.rowButton,
                            children: (0, a.jsx)(D.Z, {
                                href: o,
                                children: "Ver mais eventos"
                            })
                        })]
                    })
                },
                G = n(28964),
                J = n(25675),
                K = n.n(J),
                X = (0, s.Z)((function(e) {
                    return {
                        card: {
                            background: "#fff",
                            borderRadius: e.shape.borderRadius,
                            border: "1px solid ".concat(e.palette.grey[200]),
                            padding: "0px ".concat(e.spacing(2), "px"),
                            height: "100%"
                        },
                        client: {
                            display: "flex",
                            padding: "8px 0",
                            borderBottom: "1px solid ".concat(e.palette.grey[200])
                        },
                        clientName: {
                            fontWeight: 500,
                            marginBottom: e.spacing(.5)
                        },
                        picture: {
                            marginRight: e.spacing(1),
                            "& img": {
                                borderRadius: "50%"
                            }
                        },
                        depoiment: {
                            padding: "".concat(e.spacing(2), "px ").concat(e.spacing(1), "px"),
                            position: "relative"
                        }
                    }
                })),
                Y = function(e) {
                    var t = e.picture,
                        n = e.name,
                        o = e.description,
                        i = e.depoiment,
                        r = X();
                    return (0, a.jsxs)("div", {
                        className: r.card,
                        children: [(0, a.jsxs)("div", {
                            className: r.client,
                            children: [(0, a.jsx)("div", {
                                className: r.picture,
                                children: (0, a.jsx)(K(), {
                                    src: t,
                                    alt: "foto de ".concat(n),
                                    height: 80,
                                    width: 80
                                })
                            }), (0, a.jsxs)(l.Z, {
                                container: !0,
                                direction: "column",
                                justifyContent: "center",
                                children: [(0, a.jsx)(S.Z, {
                                    variant: "h5",
                                    className: r.clientName,
                                    children: n
                                }), (0, a.jsx)(S.Z, {
                                    variant: "caption",
                                    children: o
                                })]
                            })]
                        }), (0, a.jsx)("div", {
                            className: r.depoiment,
                            children: (0, a.jsx)("span", {
                                children: i
                            })
                        })]
                    })
                },
                ee = (0, s.Z)((function() {
                    return {
                        slider: {
                            "& .swiper-slide": {
                                height: "auto"
                            }
                        }
                    }
                })),
                te = [{
                    picture: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-depoiments-5.jpg",
                    name: "Jos\xe9 Felix",
                    description: "F\xe3 de carteirinha",
                    depoiment: "\u201dA Loop tem uma m\xe1quina, uma ferramenta fora do normal! Sou cliente de diversos outros leil\xf5es e nenhum tem uma plataforma que funciona assim.\u201d"
                }, {
                    picture: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-depoiments-2.jpg",
                    name: "Marcelo Constante",
                    description: "Comprou mais de 150 carros",
                    depoiment: "\u201dGosto bastante do portal. A vistoria de voc\xeas passa uma confian\xe7a muito grande, para comprar o ve\xedculo sem v\xea-lo. N\xe3o conhe\xe7o o p\xe1tio e j\xe1 comprei mais de 150 carros confiando nas informa\xe7\xf5es das vistorias.\u201d"
                }, {
                    picture: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-depoiments-4.jpg",
                    name: "Marlon Loureiro",
                    description: "Grande lojista do sul",
                    depoiment: "\u201dA Loop tem pre\xe7o e para mim n\xe3o \xe9 t\xe3o concorrido. Preciso de pre\xe7o porque trabalho no giro. Tem bastante carro bom!\u201d"
                }, {
                    picture: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-depoiments-1.jpg",
                    name: "Robson de Oliveira",
                    description: "Novo cliente do leil\xe3o",
                    depoiment: "\u201dAp\xf3s conhecer a Loop, perdi o medo de comprar em leil\xe3o. Minha f\xe1milia e eu estamos super felizes com o carro. Viajamos no quarto dia ap\xf3s a compra.\u201d"
                }],
                ne = function() {
                    var e = ee(),
                        t = (0, m.Z)("(max-width: 960px)"),
                        n = {
                            slidesPerView: (0, m.Z)("(max-width: 600px)") ? 1 : t ? 2 : 4,
                            spaceBetween: 16,
                            modules: [x.tl],
                            pagination: {
                                clickable: !0
                            }
                        };
                    return (0, a.jsxs)(G.Z, {
                        children: [(0, a.jsx)(u.Z, {
                            tag: "leil\xe3o",
                            children: "Veja os depoimentos dos nossos clientes"
                        }), (0, a.jsx)(h.Z, {
                            className: e.slider,
                            settings: n,
                            children: te.map((function(e) {
                                return (0, a.jsx)(Y, (0, v.Z)({}, e), e.name)
                            }))
                        })]
                    })
                },
                ae = n(82285),
                oe = n(95477),
                ie = n(64566),
                re = n(47568),
                se = n(70655),
                ce = n(24196),
                le = n(29598),
                de = n(88767),
                ue = function() {
                    var e = (0, re.Z)((function(e) {
                        return (0, se.__generator)(this, (function(t) {
                            return [2, Promise.resolve(window.__FEATURED_LOTS__ || [])]
                        }))
                    }));
                    return function(t) {
                        return e.apply(this, arguments)
                    }
                }(),
                pe = n(57313),
                me = function(e) {
                    var t = e.list;
                    return (0, a.jsx)(l.Z, {
                        container: !0,
                        spacing: 2,
                        children: t.map((function(e) {
                            return (0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                sm: 6,
                                md: 3,
                                children: (0, a.jsx)(pe.Z, {
                                    showLink: !0,
                                    lot: e
                                })
                            }, e.url)
                        }))
                    })
                },
                he = (0, s.Z)((function(e) {
                    return {
                        sliderTag: {
                            borderRadius: e.shape.borderRadius,
                            marginTop: e.spacing(1)
                        },
                        lot: {
                            borderRadius: e.shape.borderRadius
                        }
                    }
                })),
                xe = function() {
                    var e = he(),
                        t = (0, m.Z)("(max-width: 600px)"),
                        n = (0, m.Z)("(max-width: 960px)");
                    return t ? (0, a.jsxs)(l.Z, {
                        container: !0,
                        spacing: 2,
                        children: [(0, a.jsx)(l.Z, {
                            item: !0,
                            xs: 12,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 328
                            })
                        }), (0, a.jsx)(l.Z, {
                            item: !0,
                            xs: 12,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 328
                            })
                        }), (0, a.jsx)(l.Z, {
                            item: !0,
                            xs: 12,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 328
                            })
                        }), (0, a.jsx)(l.Z, {
                            item: !0,
                            xs: 12,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 328
                            })
                        })]
                    }) : n ? (0, a.jsxs)(l.Z, {
                        container: !0,
                        spacing: 2,
                        children: [(0, a.jsx)(l.Z, {
                            item: !0,
                            xs: 6,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 328
                            })
                        }), (0, a.jsx)(l.Z, {
                            item: !0,
                            xs: 6,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 328
                            })
                        }), (0, a.jsx)(l.Z, {
                            item: !0,
                            xs: 6,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 328
                            })
                        }), (0, a.jsx)(l.Z, {
                            item: !0,
                            xs: 6,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 328
                            })
                        })]
                    }) : (0, a.jsxs)(l.Z, {
                        container: !0,
                        spacing: 2,
                        children: [(0, a.jsx)(l.Z, {
                            item: !0,
                            md: 3,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 500
                            })
                        }), (0, a.jsx)(l.Z, {
                            item: !0,
                            md: 3,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 500
                            })
                        }), (0, a.jsx)(l.Z, {
                            item: !0,
                            md: 3,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 500
                            })
                        }), (0, a.jsx)(l.Z, {
                            item: !0,
                            md: 3,
                            children: (0, a.jsx)(W.Z, {
                                className: e.lot,
                                variant: "rect",
                                height: 500
                            })
                        })]
                    })
                },
                ge = (0, s.Z)((function(e) {
                    return {
                        root: (0, g.Z)({
                            position: "relative",
                            maxHeight: "100%",
                            overflow: "hidden",
                            marginBottom: e.spacing(-60),
                            zIndex: 0
                        }, e.breakpoints.up("sm"), {
                            marginBottom: e.spacing(-20)
                        }),
                        enabled: {
                            marginBottom: e.spacing(10)
                        },
                        fade: (0, g.Z)({
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            height: "720px",
                            width: "100%",
                            zIndex: 2,
                            backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff 10%)",
                            display: "flex",
                            justifyContent: "center",
                            transition: "all 0.3s ease-in-out"
                        }, e.breakpoints.up("sm"), {
                            height: "480px",
                            backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff 30%)",
                            alignItems: "center"
                        }),
                        wrapper: (0, g.Z)({
                            marginTop: e.spacing(18)
                        }, e.breakpoints.up("sm"), {
                            marginTop: "unset"
                        }),
                        seeMoreButton: {
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "24px",
                            fontWeight: 600,
                            color: e.palette.primary.main,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            transition: "all 0.3s ease-in-out",
                            "& svg": {
                                height: "48px",
                                width: "48px"
                            },
                            "&:hover": {
                                color: e.palette.primary.dark,
                                paddingTop: e.spacing(2)
                            }
                        }
                    }
                })),
                ve = function() {
                    var e = (0, y.useState)(2),
                        t = e[0],
                        n = e[1],
                        o = function(e) {
                            var t = e.rows,
                                n = (0, d.a)(),
                                a = n.isLoading,
                                o = n.session;
                            return (0, de.useQuery)(le.R.getFeaturedLots(null === o || void 0 === o ? void 0 : o.id, t), (function() {
                                return ue(t)
                            }), {
                                enabled: !a,
                                keepPreviousData: !0
                            })
                        }({
                            rows: t
                        }),
                        i = ge();
                    if (o.isLoading || o.isIdle) return (0, a.jsxs)(c.Z, {
                        className: "".concat(i.root, " ").concat(i.enabled),
                        children: [(0, a.jsx)(u.Z, {
                            tag: "leil\xe3o",
                            children: "Ofertas dispon\xedveis"
                        }), (0, a.jsx)(xe, {})]
                    });
                    if (o.isError || !o.data.length) return null;
                    if (o.data.length < 4) return (0, a.jsxs)(c.Z, {
                        className: "".concat(i.root, " ").concat(i.enabled),
                        children: [(0, a.jsx)(u.Z, {
                            tag: "leil\xe3o",
                            children: "Ofertas dispon\xedveis"
                        }), (0, a.jsx)(me, {
                            list: o.data
                        })]
                    });
                    var r = 4 * t < o.data.length || 5 === t;
                    return (0, a.jsxs)(c.Z, {
                        className: "".concat(i.root, " ").concat(r ? i.enabled : ""),
                        children: [(0, a.jsx)(u.Z, {
                            tag: "leil\xe3o",
                            children: "Ofertas dispon\xedveis"
                        }), (0, a.jsx)(me, {
                            list: o.data
                        }), (0, a.jsx)(ae.Z, {
                            timeout: 200,
                            in: !r,
                            direction: "up",
                            children: (0, a.jsx)("div", {
                                className: i.fade,
                                children: (0, a.jsx)("div", {
                                    className: i.wrapper,
                                    children: o.isFetching ? (0, a.jsx)(oe.Z, {}) : (0, a.jsxs)("button", {
                                        type: "button",
                                        className: i.seeMoreButton,
                                        onClick: function() {
                                            return n((function(e) {
                                                return e + 1
                                            }))
                                        },
                                        children: ["Ver mais ve\xedculos", (0, a.jsx)(ie.Z, {
                                            fontSize: "large"
                                        })]
                                    })
                                })
                            })
                        })]
                    })
                },
                fe = (n(65519), function() {
                    var e = (0, re.Z)((function() {
                        return (0, se.__generator)(this, (function(e) {
                            return [2, ce.K5.get("/banners-leilao").then((function(e) {
                                return e.data
                            }))]
                        }))
                    }));
                    return function() {
                        return e.apply(this, arguments)
                    }
                }()),
                je = n(41664),
                be = n.n(je),
                Ze = (0, s.Z)({
                    root: {
                        width: "100%"
                    }
                }),
                ye = function(e) {
                    var t = e.index,
                        n = e.mobile,
                        o = e.mobileLarge,
                        i = e.desktop,
                        r = e.desktopLarge,
                        s = e.description,
                        c = Ze(),
                        l = function(e) {
                            return "".concat("https://strapi.loopbrasil.com").concat(e)
                        };
                    return (0, a.jsxs)("picture", {
                        draggable: !1,
                        children: [(0, a.jsx)("source", {
                            media: "(min-width: 1200px)",
                            srcSet: l(r.url),
                            draggable: !1
                        }), (0, a.jsx)("source", {
                            media: "(min-width: 600px)",
                            srcSet: l(i.url),
                            draggable: !1
                        }), (0, a.jsx)("source", {
                            media: "(min-width: 380px)",
                            srcSet: l(n.url),
                            draggable: !1
                        }), (0, a.jsx)("img", {
                            loading: t ? "lazy" : "eager",
                            src: l(o.url),
                            alt: s || "",
                            draggable: !1,
                            className: c.root
                        })]
                    })
                },
                we = function(e) {
                    var t = e.index,
                        n = e.link,
                        o = e.desktop,
                        i = e.desktopLarge,
                        r = e.mobile,
                        s = e.mobileLarge,
                        c = e.description;
                    return n ? n.includes("https") ? (0, a.jsx)("a", {
                        href: n,
                        children: (0, a.jsx)(ye, {
                            index: t,
                            desktop: o,
                            desktopLarge: i,
                            mobile: r,
                            mobileLarge: s,
                            description: c
                        })
                    }) : (0, a.jsx)(be(), {
                        href: n,
                        passHref: !0,
                        children: (0, a.jsx)("a", {
                            href: n,
                            children: (0, a.jsx)(ye, {
                                index: t,
                                desktop: o,
                                desktopLarge: i,
                                mobile: r,
                                mobileLarge: s,
                                description: c
                            })
                        })
                    }) : (0, a.jsx)(ye, {
                        index: t,
                        desktop: o,
                        desktopLarge: i,
                        mobile: r,
                        mobileLarge: s,
                        description: c
                    })
                },
                Ne = (0, s.Z)((function(e) {
                    return {
                        slider: {
                            zIndex: 0,
                            "& .swiper-wrapper": {
                                paddingBottom: "unset"
                            },
                            "& .swiper-pagination": {
                                right: e.spacing(4),
                                left: "unset",
                                background: "unset",
                                border: "unset",
                                bottom: e.spacing(4)
                            },
                            "& .swiper-pagination-bullet": {
                                backgroundColor: "transparent",
                                border: "2px solid ".concat(e.palette.primary.light)
                            },
                            "& .swiper-pagination-bullet-active": {
                                backgroundColor: e.palette.primary.main
                            },
                            "& .slick-dots li.slick-active button:before": {
                                border: "1px solid ".concat(e.palette.primary.light)
                            }
                        }
                    }
                })),
                ke = function() {
                    var e = Ne(),
                        t = (0, de.useQuery)(le.R.getBanners(), fe, {
                            refetchOnMount: !1
                        }),
                        n = {
                            rewind: !0,
                            autoplay: {
                                delay: 1e4
                            },
                            slidesPerView: 1,
                            modules: [x.tl, x.pt],
                            pagination: {
                                clickable: !0
                            }
                        };
                    return t.isLoading || t.isError || t.isIdle ? null : (0, a.jsx)(h.Z, {
                        settings: n,
                        className: e.slider,
                        children: t.data.banners.map((function(e, t) {
                            return (0, a.jsx)(we, (0, v.Z)({
                                index: t
                            }, e), e.id)
                        }))
                    })
                },
                Ce = (0, s.Z)((function(e) {
                    return {
                        root: {
                            width: "100%",
                            marginBottom: e.spacing(4)
                        }
                    }
                })),
                Se = function() {
                    var e = Ce();
                    return (0, a.jsx)("div", {
                        className: e.root,
                        children: (0, a.jsx)(ke, {})
                    })
                },
                Le = n(10253),
                ze = n(12981),
                Re = function() {
                    return Promise.resolve(window.__LIVE_EVENTS__ || null)
                },
                _e = (0, s.Z)((function(e) {
                    return (0, g.Z)({
                        root: {
                            backgroundColor: e.palette.grey[50],
                            borderRadius: e.shape.borderRadius,
                            padding: "8px",
                            marginBottom: "24px"
                        },
                        circleContainer: {
                            alignItems: "center",
                            backgroundColor: e.palette.success.light,
                            borderRadius: "50%",
                            display: "flex",
                            height: "16px",
                            justifyContent: "center",
                            marginRight: "8px",
                            width: "16px"
                        },
                        circle: {
                            backgroundColor: e.palette.success.main,
                            borderRadius: "50%",
                            height: "4px",
                            width: "4px"
                        },
                        title: {
                            color: e.palette.success.main,
                            fontSize: "12px",
                            fontWeight: 500,
                            marginRight: "8px"
                        },
                        eventTitle: {
                            fontSize: "12px",
                            fontWeight: 400
                        }
                    }, e.breakpoints.up("md"), {
                        root: {
                            borderRadius: 0,
                            flexDirection: "row",
                            padding: "8px"
                        },
                        circleContainer: {
                            height: "24px",
                            width: "24px"
                        },
                        circle: {
                            height: "8px",
                            width: "8px"
                        },
                        title: {
                            fontSize: "14px",
                            marginRight: "8px"
                        },
                        eventTitle: {
                            fontSize: "14px"
                        }
                    })
                })),
                Ee = function(e) {
                    var t = e.title,
                        n = e.location,
                        o = _e();
                    return (0, a.jsxs)(l.Z, {
                        container: !0,
                        justifyContent: "center",
                        alignItems: "center",
                        className: o.root,
                        children: [(0, a.jsx)("div", {
                            className: o.circleContainer,
                            children: (0, a.jsx)("div", {
                                className: o.circle
                            })
                        }), (0, a.jsx)("span", {
                            className: o.title,
                            children: "ACONTECENDO AGORA: "
                        }), (0, a.jsx)("h2", {
                            className: o.eventTitle,
                            id: "live_event_title",
                            children: "".concat(t, " | ").concat(n)
                        })]
                    })
                },
                Be = (0, s.Z)((function(e) {
                    return {
                        root: (0, g.Z)({
                            margin: e.spacing(1, 0),
                            overflow: "hidden"
                        }, e.breakpoints.up("md"), {
                            border: "1px solid ".concat(e.palette.grey.A200),
                            borderRadius: "8px"
                        }),
                        navigator: {
                            borderBottom: "1px solid ".concat(e.palette.grey[50]),
                            display: "flex",
                            flexDirection: "column"
                        }
                    }
                })),
                Ie = function() {
                    var e, t, n = Be(),
                        o = function() {
                            var e = (0, d.a)().session;
                            return (0, de.useQuery)(le.R.getLiveEvent(null === e || void 0 === e ? void 0 : e.id), Re)
                        }();
                    if (o.isLoading || o.isError || o.isIdle || !o.data) return null;
                    var i = (0, Le.Z)(o.data.lots.filter((function(e) {
                            return e.id === o.data.currentLot
                        })), 1)[0],
                        r = null === (e = o.data) || void 0 === e ? void 0 : e.lots,
                        s = {
                            lot: i,
                            index: null === (t = o.data) || void 0 === t ? void 0 : t.currentLot
                        },
                        l = o.data.currentLot && "presencial_online" === o.data.type;
                    return (0, a.jsx)(c.Z, {
                        children: (0, a.jsx)("div", {
                            className: n.root,
                            children: (0, a.jsxs)("div", {
                                className: n.navigator,
                                children: [(0, a.jsx)(Ee, {
                                    title: o.data.title,
                                    location: "online" === o.data.type ? "Online" : o.data.location
                                }), (0, a.jsx)(ze.Z, {
                                    selected: o.data.currentLot,
                                    current: s,
                                    lots: r,
                                    hasLiveVideo: Boolean(l)
                                })]
                            })
                        })
                    })
                },
                Me = n(5566),
                Te = n(17812),
                Fe = n(80366),
                qe = n(30306),
                Oe = (0, s.Z)((function(e) {
                    return {
                        root: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        },
                        wrapper: {
                            position: "relative"
                        },
                        close: {
                            position: "absolute",
                            color: e.palette.grey[50],
                            zIndex: 1,
                            top: 8,
                            right: 8
                        }
                    }
                })),
                Ae = function() {
                    var e = Oe(),
                        t = (0, y.useState)(!1),
                        n = t[0],
                        o = t[1];
                    (0, y.useEffect)((function() {
                        (0, qe.$1)().modalAntiScam || o(!0)
                    }), []);
                    var i = function() {
                        o(!1);
                        var e = new Date;
                        e.setDate(e.getDate() + 7), (0, qe.d8)("modalAntiScam", "true", {
                            path: "/",
                            expires: e
                        })
                    };
                    return (0, a.jsx)(Me.Z, {
                        className: e.root,
                        open: n,
                        onKeyUp: function(e) {
                            "Escape" === e.key && i()
                        },
                        children: (0, a.jsxs)("div", {
                            className: e.wrapper,
                            children: [(0, a.jsx)(Te.Z, {
                                className: e.close,
                                onClick: i,
                                children: (0, a.jsx)(Fe.Z, {})
                            }), (0, a.jsx)("div", {
                                children: (0, a.jsx)("img", {
                                    src: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fmodal-anti-golpe.png?v=20260921-4",
                                    alt: "Modal de aviso anti-golpes"
                                })
                            })]
                        })
                    })
                },
                Pe = n(81304),
                Ve = n(45623),
                De = n(13181),
                We = function() {
                    var e = (0, re.Z)((function() {
                        return (0, se.__generator)(this, (function(e) {
                            return [2, ce.eE.put("/auction/users/viewed-modal").then((function(e) {
                                return e.data
                            }))]
                        }))
                    }));
                    return function() {
                        return e.apply(this, arguments)
                    }
                }(),
                He = "has-seen-waiting-approval",
                $e = function() {
                    var e = (0, d.a)().isAuthenticated,
                        t = (0, y.useState)(!1),
                        n = t[0],
                        a = t[1],
                        o = function() {
                            var e = (0, de.useQueryClient)();
                            return (0, de.useMutation)(le.R.putViewedModal(), We, {
                                onSuccess: function() {
                                    e.invalidateQueries(le.R.getUserAccount())
                                }
                            })
                        }(),
                        i = (0, De.m)(),
                        r = i.data,
                        s = i.isLoading,
                        c = (null === r || void 0 === r ? void 0 : r.documentation) || {
                            issue: null,
                            status: "approved",
                            hasUploadedAllDocuments: !0,
                            hasSeenModal: !0,
                            documents: []
                        };
                    (0, y.useEffect)((function() {
                        var t = localStorage.getItem(He);
                        s || t && "waitingApproval" === c.status && (!c.issue || " " === c.issue) || a(e)
                    }), [e, c.status, s, c.issue]);
                    var l = function() {
                        a(!1)
                    };
                    return (0, f.Z)((0, v.Z)({}, c), {
                        handleModalSeen: function() {
                            o.mutate(), l()
                        },
                        isOpen: n,
                        handleClose: l,
                        handleHasSeenWaitingApproval: function() {
                            localStorage.setItem(He, "true"), l()
                        }
                    })
                },
                Qe = function() {
                    var e = $e();
                    return e.issue && " " !== e.issue ? (0, a.jsxs)(Pe.Z, {
                        onClose: e.handleClose,
                        open: e.isOpen,
                        title: "Documento Reprovado!",
                        children: [(0, a.jsx)(S.Z, {
                            gutterBottom: !0,
                            children: "Verifique os motivos e apontamentos para realizar o ajuste e garantir maior seguran\xe7a na sua compra!"
                        }), (0, a.jsx)(be(), {
                            href: "/minha-conta/alterar-documentos",
                            passHref: !0,
                            children: (0, a.jsx)(Ve.Z, {
                                children: "Ajustar cadastro"
                            })
                        })]
                    }) : null
                },
                Ue = n(78262),
                Ge = n(88079),
                Je = (0, s.Z)((function(e) {
                    var t;
                    return t = {
                        title: {
                            marginBottom: e.spacing(3)
                        },
                        item: {
                            marginBottom: e.spacing(3),
                            lineHeight: "".concat(e.spacing(3), "px")
                        },
                        partner: {
                            maxWidth: e.spacing(25)
                        },
                        partnerLogo: {
                            marginBottom: e.spacing(2),
                            "& > img": {
                                height: "28px",
                                maxWidth: "unset"
                            }
                        }
                    }, (0, g.Z)(t, e.breakpoints.up("sm"), {
                        partnerContainer: {
                            "& > *:not(:last-child)": {
                                marginRight: e.spacing(4)
                            }
                        }
                    }), (0, g.Z)(t, e.breakpoints.up("lg"), {
                        item: {
                            marginBottom: "unset"
                        },
                        partnerContainer: {
                            "& > *:not(:last-child)": {
                                marginRight: e.spacing(8)
                            }
                        }
                    }), t
                })),
                Ke = function() {
                    var e = Je();
                    return (0, a.jsxs)("section", {
                        children: [(0, a.jsx)(S.Z, {
                            variant: "h4",
                            className: e.title,
                            children: "Somos uma empresa:"
                        }), (0, a.jsxs)(l.Z, {
                            container: !0,
                            className: e.partnerContainer,
                            children: [(0, a.jsxs)(l.Z, {
                                item: !0,
                                xs: 12,
                                md: 6,
                                className: e.partner,
                                children: [(0, a.jsx)("div", {
                                    className: e.partnerLogo,
                                    children: (0, a.jsx)("img", {
                                        src: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fpartners-Webmotors-black.png",
                                        alt: "webmotors"
                                    })
                                }), (0, a.jsx)(S.Z, {
                                    variant: "body2",
                                    className: e.item,
                                    children: "A Webmotors, o maior portal de compra e venda de carros e de not\xedcias automobil\xedsticas do Brasil"
                                })]
                            }), (0, a.jsxs)(l.Z, {
                                item: !0,
                                xs: 12,
                                md: 6,
                                className: e.partner,
                                children: [(0, a.jsx)("div", {
                                    className: e.partnerLogo,
                                    children: (0, a.jsx)("img", {
                                        src: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Festapar-black.png",
                                        alt: "estapar"
                                    })
                                }), (0, a.jsx)(S.Z, {
                                    variant: "body2",
                                    className: e.item,
                                    children: "A maior empresa de estacionamentos da Am\xe9rica Latina"
                                })]
                            })]
                        })]
                    })
                };
            var Xe = function() {
                    return (0, a.jsxs)("svg", {
                        role: "presentation",
                        xmlns: "http://www.w3.org/2000/svg",
                        width: 19.424,
                        height: 19.269,
                        viewBox: "0 0 19.424 19.269",
                        children: [(0, a.jsx)("defs", {
                            children: (0, a.jsx)("style", {
                                children: ".prefix__b{fill:none;stroke:#ff5876;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.1px}"
                            })
                        }), (0, a.jsx)("path", {
                            className: "prefix__b",
                            fill: "unset",
                            d: "M18.646 8.85v.822a8.934 8.934 0 11-5.3-8.165"
                        }), (0, a.jsx)("path", {
                            className: "prefix__b",
                            d: "M18.647 2.525l-8.934 8.943-2.68-2.681"
                        })]
                    })
                },
                Ye = (0, s.Z)((function(e) {
                    return (0, g.Z)({
                        title: {
                            marginBottom: "24px"
                        },
                        item: {
                            marginLeft: "16px"
                        }
                    }, e.breakpoints.up("md"), {
                        root: {
                            marginTop: "-64px"
                        }
                    })
                })),
                et = function() {
                    var e = Ye();
                    return (0, a.jsxs)("section", {
                        className: e.root,
                        children: [(0, a.jsx)(S.Z, {
                            variant: "h4",
                            className: e.title,
                            children: "Para sua seguran\xe7a oferecemos:"
                        }), (0, a.jsxs)(l.Z, {
                            container: !0,
                            direction: "column",
                            component: "ul",
                            spacing: 2,
                            children: [(0, a.jsxs)(l.Z, {
                                container: !0,
                                item: !0,
                                xs: 12,
                                md: 6,
                                alignItems: "center",
                                component: "li",
                                children: [(0, a.jsx)(Xe, {}), (0, a.jsx)(S.Z, {
                                    variant: "body2",
                                    className: e.item,
                                    children: "Visita\xe7\xe3o de ve\xedculos"
                                })]
                            }), (0, a.jsxs)(l.Z, {
                                container: !0,
                                item: !0,
                                xs: 12,
                                md: 6,
                                alignItems: "center",
                                component: "li",
                                children: [(0, a.jsx)(Xe, {}), (0, a.jsx)(S.Z, {
                                    variant: "body2",
                                    className: e.item,
                                    children: "Autenticidade verificada"
                                })]
                            }), (0, a.jsxs)(l.Z, {
                                container: !0,
                                item: !0,
                                xs: 12,
                                md: 6,
                                alignItems: "center",
                                component: "li",
                                children: [(0, a.jsx)(Xe, {}), (0, a.jsx)(S.Z, {
                                    variant: "body2",
                                    className: e.item,
                                    children: "Boleto no nome da Loop"
                                })]
                            })]
                        })]
                    })
                },
                tt = (0, s.Z)((function(e) {
                    return (0, g.Z)({
                        root: {
                            marginBottom: "80px",
                            position: "relative"
                        },
                        textContainer: {
                            marginBottom: "32px"
                        },
                        curveContainer: {
                            position: "relative"
                        },
                        curve: {
                            height: "64px",
                            position: "absolute",
                            right: "20%",
                            transform: "rotate(-15deg)",
                            width: "64px"
                        }
                    }, e.breakpoints.up("md"), {
                        textContainer: {
                            marginBottom: "32px",
                            paddingRight: "120px"
                        },
                        curve: {
                            right: "30%",
                            bottom: "-24px"
                        }
                    })
                })),
                nt = function() {
                    var e = tt();
                    return (0, a.jsxs)(c.Z, {
                        component: "section",
                        className: e.root,
                        children: [(0, a.jsx)(u.Z, {
                            tag: "Loop",
                            children: "Comprar na Loop \xe9 seguro"
                        }), (0, a.jsxs)(l.Z, {
                            container: !0,
                            direction: "row",
                            children: [(0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                md: 6,
                                className: e.textContainer,
                                children: (0, a.jsxs)(S.Z, {
                                    variant: "body2",
                                    children: ["A ", (0, a.jsx)("b", {
                                        children: "Loop"
                                    }), " \xe9 uma empresa ", (0, a.jsx)("b", {
                                        children: "Webmotors"
                                    }), " e ", (0, a.jsx)("b", {
                                        children: "Estapar"
                                    }), ", somos uma plataforma completa para voc\xea que quer ", (0, a.jsx)("b", {
                                        children: "comprar"
                                    }), " e", " ", (0, a.jsx)("b", {
                                        children: "vender"
                                    }), " seu ", (0, a.jsx)("b", {
                                        children: "carro"
                                    }), ". Nosso estoque \xe9 composto por ve\xedculos recuperados de bancos al\xe9m de ve\xedculos de frotas e montadoras."]
                                })
                            }), (0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                md: 6,
                                children: (0, a.jsx)(Ke, {})
                            }), (0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                md: 6,
                                children: (0, a.jsx)(et, {})
                            })]
                        }), (0, a.jsx)(Ge.Z, {
                            className: e.curve
                        })]
                    })
                },
                at = n(29815),
                ot = n(79895),
                it = n(30553),
                rt = n(9570),
                st = n(55517),
                ct = n(35322),
                lt = n(51791),
                dt = n(11163),
                ut = n(48728),
                pt = {
                    size: 0,
                    query: {
                        bool: {
                            must: [{
                                exists: {
                                    field: "event.id"
                                }
                            }]
                        }
                    },
                    aggs: {
                        event: {
                            terms: {
                                field: "event.date",
                                order: {
                                    _term: "asc"
                                }
                            }
                        }
                    }
                },
                mt = function(e, t, n) {
                    var a = {
                        size: 0,
                        query: {
                            bool: {
                                must: [],
                                must_not: []
                            }
                        }
                    };
                    return "all" !== e && a.query.bool.must.push({
                        term: {
                            category: e
                        }
                    }), n ? (a.query.bool.must_not = [{
                        exists: {
                            field: "event.id"
                        }
                    }], a) : (a.query.bool.must.push({
                        exists: {
                            field: "event.id"
                        }
                    }), t.length > 0 && t.forEach((function(e) {
                        a.query.bool.must_not.push({
                            term: {
                                "event.date": e
                            }
                        })
                    })), a)
                },
                ht = n(57821),
                xt = n(41423),
                gt = n(85976),
                vt = n(4262),
                ft = n(22074),
                jt = n(30913),
                bt = n(9607),
                Zt = n(50743),
                yt = n(61201),
                wt = n(6562),
                Nt = n(80797),
                kt = (0, s.Z)((function(e) {
                    return {
                        root: {
                            margin: "16px 24px 0px !important",
                            borderRadius: e.shape.borderRadius,
                            "&:before": {
                                content: "unset"
                            }
                        },
                        label: (0, g.Z)({
                            fontSize: "12px"
                        }, e.breakpoints.up("sm"), {
                            fontSize: "14px"
                        }),
                        summary: {
                            color: e.palette.grey[500]
                        }
                    }
                })),
                Ct = function(e) {
                    var t = e.eventList,
                        n = void 0 === t ? [] : t,
                        o = e.unchecked,
                        i = e.onChange,
                        r = kt();
                    return !!(null === n || void 0 === n ? void 0 : n.length) ? (0, a.jsxs)(bt.Z, {
                        className: r.root,
                        variant: "outlined",
                        children: [(0, a.jsx)(Zt.Z, {
                            expandIcon: (0, a.jsx)(ie.Z, {}),
                            className: r.summary,
                            children: "Selecionar evento"
                        }), (0, a.jsx)(yt.Z, {
                            children: (0, a.jsx)(wt.Z, {
                                children: n.map((function(e) {
                                    return (0, a.jsx)(it.Z, {
                                        checked: !o.includes(e.date),
                                        label: "Evento dia ".concat((0, _.o)(e.date)),
                                        classes: {
                                            label: r.label
                                        },
                                        control: (0, a.jsx)(Nt.Z, {
                                            color: "primary",
                                            onChange: i,
                                            value: e.date
                                        })
                                    }, e.date)
                                }))
                            })
                        })]
                    }) : null
                },
                St = n(52387),
                Lt = n(97480),
                zt = (0, s.Z)((function(e) {
                    return {
                        popover: {
                            padding: e.spacing(2, 3),
                            borderTopRightRadius: 0
                        }
                    }
                })),
                Rt = function(e) {
                    var t = e.eventList,
                        n = void 0 === t ? [] : t,
                        o = e.unchecked,
                        i = e.onChange,
                        r = zt(),
                        s = (0, y.useState)(null),
                        c = s[0],
                        l = s[1],
                        d = c ? "events-popover" : void 0;
                    if (!!!(null === n || void 0 === n ? void 0 : n.length)) return null;
                    return (0, a.jsxs)(a.Fragment, {
                        children: [(0, a.jsx)(xt.Z, {
                            "aria-describedby": d,
                            className: c ? "Mui-selected" : "",
                            icon: (0, a.jsx)(Lt.Z, {}),
                            label: "Eventos",
                            value: "event",
                            onClick: function(e) {
                                l(e.currentTarget)
                            }
                        }), (0, a.jsx)(St.ZP, {
                            id: d,
                            open: !!c,
                            anchorEl: c,
                            onClose: function() {
                                l(null)
                            },
                            anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "right"
                            },
                            transformOrigin: {
                                vertical: "top",
                                horizontal: "right"
                            },
                            classes: {
                                paper: r.popover
                            },
                            children: (0, a.jsx)(wt.Z, {
                                children: n.map((function(e) {
                                    return (0, a.jsx)(it.Z, {
                                        checked: !o.includes(e.date),
                                        label: "Evento dia ".concat((0, _.o)(e.date), " (").concat(e.quantity, ")"),
                                        control: (0, a.jsx)(Nt.Z, {
                                            color: "primary",
                                            onChange: i,
                                            value: e.date
                                        })
                                    }, e.date)
                                }))
                            })
                        })]
                    })
                },
                _t = (0, s.Z)((function(e) {
                    var t;
                    return {
                        tabs: (t = {
                            display: "flex",
                            background: "#E9ECEE",
                            "& .MuiTab-root": {
                                transition: "all 0.3s ease",
                                height: "50px",
                                minHeight: "50px",
                                width: "fit-content"
                            },
                            "& .MuiTab-wrapper": {
                                flexDirection: "row",
                                gap: e.spacing(1),
                                fontSize: "18px",
                                fontWeight: "bold"
                            },
                            "& .Mui-selected": {
                                background: "#fff",
                                boxShadow: "0px 0px 4px #00000029"
                            }
                        }, (0, g.Z)(t, e.breakpoints.down("sm"), {
                            width: "100%",
                            "& .MuiTabs-root": {
                                width: "100%"
                            },
                            "& .MuiTab-wrapper": {
                                fontSize: "14px"
                            }
                        }), (0, g.Z)(t, e.breakpoints.down("xs"), {
                            "& .MuiSvgIcon-root": {
                                display: "none"
                            }
                        }), t),
                        divider: {
                            boxShadow: "0px -3px 4px #00000059",
                            height: "1px"
                        }
                    }
                })),
                Et = function(e) {
                    var t = e.selected,
                        n = e.onTabChange,
                        o = e.onEventChange,
                        i = e.filteredEvents,
                        r = e.eventList,
                        s = void 0 === r ? [] : r,
                        c = _t();
                    return (0, m.Z)((function(e) {
                        return e.breakpoints.down("sm")
                    })) ? (0, a.jsxs)(y.Fragment, {
                        children: [(0, a.jsx)("div", {
                            className: c.tabs,
                            children: (0, a.jsxs)(ht.Z, {
                                variant: "fullWidth",
                                indicatorColor: "primary",
                                value: t,
                                onChange: n,
                                children: [(0, a.jsx)(xt.Z, {
                                    icon: (0, a.jsx)(gt.Z, {}),
                                    label: "Todos",
                                    value: "all"
                                }), (0, a.jsx)(xt.Z, {
                                    icon: (0, a.jsx)(vt.Z, {}),
                                    label: "Carros",
                                    value: "Leve"
                                }), (0, a.jsx)(xt.Z, {
                                    icon: (0, a.jsx)(jt.Z, {}),
                                    label: "Motos",
                                    value: "Moto"
                                }), (0, a.jsx)(xt.Z, {
                                    icon: (0, a.jsx)(ft.Z, {}),
                                    label: "Pesados",
                                    value: "Pesado"
                                })]
                            })
                        }), (0, a.jsx)("div", {
                            className: c.divider
                        }), (0, a.jsx)(Ct, {
                            unchecked: i,
                            eventList: s,
                            onChange: o
                        })]
                    }, 0) : (0, a.jsxs)(y.Fragment, {
                        children: [(0, a.jsxs)("div", {
                            className: c.tabs,
                            children: [(0, a.jsxs)(ht.Z, {
                                variant: "standard",
                                indicatorColor: "primary",
                                value: t,
                                onChange: n,
                                children: [(0, a.jsx)(xt.Z, {
                                    icon: (0, a.jsx)(gt.Z, {}),
                                    label: "Todos",
                                    value: "all"
                                }), (0, a.jsx)(xt.Z, {
                                    icon: (0, a.jsx)(vt.Z, {}),
                                    label: "Carros",
                                    value: "Leve"
                                }), (0, a.jsx)(xt.Z, {
                                    icon: (0, a.jsx)(jt.Z, {}),
                                    label: "Motos",
                                    value: "Moto"
                                }), (0, a.jsx)(xt.Z, {
                                    icon: (0, a.jsx)(ft.Z, {}),
                                    label: "Pesados",
                                    value: "Pesado"
                                })]
                            }), (0, a.jsx)(Rt, {
                                unchecked: i,
                                eventList: s,
                                onChange: o
                            })]
                        }), (0, a.jsx)("div", {
                            className: c.divider
                        })]
                    }, 1)
                },
                Bt = (0, s.Z)((function(e) {
                    var t;
                    return {
                        root: {
                            position: "relative",
                            zIndex: 1,
                            marginBottom: e.spacing(4)
                        },
                        paper: {
                            backgroundColor: "#F7F7F8",
                            boxShadow: "0px 0px 4px #00000029"
                        },
                        container: {
                            padding: e.spacing(2, 3, 1)
                        },
                        input: {
                            "& .MuiOutlinedInput-root": {
                                height: "64px",
                                borderRadius: "6px",
                                background: "#fff"
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "#707070 0.5px solid !important"
                            }
                        },
                        button: (t = {}, (0, g.Z)(t, e.breakpoints.down("xs"), {
                            width: "100%",
                            height: "48px"
                        }), (0, g.Z)(t, "height", "100%"), (0, g.Z)(t, "width", "240px"), t),
                        stockChoice: (0, g.Z)({}, e.breakpoints.down("xs"), {
                            display: "flex",
                            flexDirection: "column"
                        }),
                        recent: {
                            display: "flex",
                            alignItems: "center",
                            gap: e.spacing(2),
                            "& span": {
                                color: "#79828D",
                                fontWeight: "bold"
                            },
                            "& .MuiDivider-root": {
                                flexGrow: 1
                            }
                        },
                        recentChoice: {
                            display: "grid",
                            gridAutoFlow: "column",
                            gap: e.spacing(1.5),
                            overflowX: "auto",
                            justifyContent: "flex-start"
                        },
                        recentButton: {
                            background: "#fff",
                            border: "".concat(e.palette.grey[200], " 0.2px solid"),
                            color: e.palette.grey[600],
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            fontSize: "12px",
                            "&:hover": {
                                background: e.palette.grey[400],
                                color: e.palette.text.primary
                            }
                        }
                    }
                })),
                It = function() {
                    var e = Bt(),
                        t = (0, dt.useRouter)(),
                        n = (0, y.useState)(!0),
                        o = n[0],
                        i = n[1],
                        r = (0, y.useState)("all"),
                        s = r[0],
                        d = r[1],
                        u = (0, y.useState)([]),
                        p = u[0],
                        m = u[1],
                        h = (0, Le.Z)((0, lt.R)("search-history", []), 2),
                        x = h[0],
                        g = h[1],
                        v = function(e, t) {
                            return (0, de.useQuery)(["stockQuantity", {
                                category: e,
                                filteredEvents: t
                            }], (0, re.Z)((function() {
                                var n, a, o, i, r;
                                return (0, se.__generator)(this, (function(s) {
                                    switch (s.label) {
                                        case 0:
                                            return [4, Promise.all([(0, ut.q)(mt(e, t, !0)), (0, ut.q)(pt), (0, ut.q)(mt(e, t, !1))])];
                                        case 1:
                                            return a = Le.Z.apply(void 0, [s.sent(), 3]), o = a[0], i = a[1], r = a[2], [2, {
                                                publicStock: o.hits.total.value,
                                                eventStock: r.hits.total.value,
                                                events: null === (n = i.aggregations) || void 0 === n ? void 0 : n.event.buckets.map((function(e) {
                                                    return {
                                                        date: e.key_as_string,
                                                        quantity: e.doc_count
                                                    }
                                                }))
                                            }]
                                    }
                                }))
                            })), {
                                keepPreviousData: !0
                            })
                        }(s, p),
                        f = v.data,
                        j = function(e, t, n) {
                            var a = "";
                            return "all" !== e && (a += "tipo=".concat(e, "&")), t || (a += "evento_data=2077-01-01&"), n.length > 0 && n.forEach((function(e) {
                                a += "evento_data=".concat(e, "&")
                            })), a
                        }(s, o, p),
                        b = function(e) {
                            return "marca" === e.type ? t.push("/estoque?marca=".concat(e.key)) : t.push("/estoque?marca=".concat(e.brand, "&modelo=").concat(e.model))
                        };
                    return (0, a.jsx)(c.Z, {
                        className: e.root,
                        children: (0, a.jsxs)(ot.Z, {
                            className: e.paper,
                            children: [(0, a.jsx)(Et, {
                                eventList: null === f || void 0 === f ? void 0 : f.events,
                                filteredEvents: p,
                                selected: s,
                                onTabChange: function(e, t) {
                                    return d(t)
                                },
                                onEventChange: function(e, t) {
                                    m(t ? p.filter((function(t) {
                                        return t !== e.target.value
                                    })) : (0, at.Z)(p).concat([e.target.value]))
                                }
                            }), (0, a.jsxs)(l.Z, {
                                container: !0,
                                spacing: 2,
                                className: e.container,
                                children: [(0, a.jsx)(l.Z, {
                                    item: !0,
                                    xs: 12,
                                    sm: 7,
                                    md: 9,
                                    children: (0, a.jsx)(ct.Z, {
                                        category: s,
                                        usePublicStock: o,
                                        InputProps: {
                                            className: e.input
                                        },
                                        onSelected: function(e, t) {
                                            "select-option" === t && e && (x.some((function(t) {
                                                return t.key === e.key
                                            })) || g((function(t) {
                                                return x.length < 5 ? [e].concat((0, at.Z)(t)) : [e].concat((0, at.Z)(t.slice(0, 4)))
                                            })), b(e))
                                        }
                                    })
                                }), (0, a.jsx)(l.Z, {
                                    item: !0,
                                    xs: 12,
                                    sm: 5,
                                    md: 3,
                                    children: (0, a.jsx)(be(), {
                                        href: "/estoque?".concat(j),
                                        passHref: !0,
                                        children: (0, a.jsxs)(Ve.Z, {
                                            className: e.button,
                                            href: "/estoque",
                                            children: ["Ver ve\xedculos (", o && f ? f.eventStock + f.publicStock : null === f || void 0 === f ? void 0 : f.eventStock, ")"]
                                        })
                                    })
                                }), (0, a.jsxs)(l.Z, {
                                    item: !0,
                                    className: e.stockChoice,
                                    children: [(0, a.jsx)(it.Z, {
                                        label: (0, a.jsx)(S.Z, {
                                            color: "primary",
                                            style: {
                                                fontWeight: "bold"
                                            },
                                            children: "Estoque n\xe3o loteado"
                                        }),
                                        color: "primary",
                                        control: (0, a.jsx)(rt.Z, {
                                            color: "primary"
                                        }),
                                        checked: o,
                                        onChange: function(e, t) {
                                            return i(t)
                                        }
                                    }), (0, a.jsxs)(S.Z, {
                                        variant: "caption",
                                        children: ["Desejo ver tamb\xe9m os ", (0, a.jsx)("strong", {
                                            children: null === f || void 0 === f ? void 0 : f.publicStock
                                        }), " ", "ve\xedculos que ser\xe3o loteados em eventos futuros"]
                                    })]
                                }), (0, a.jsxs)(l.Z, {
                                    item: !0,
                                    xs: 12,
                                    className: e.recent,
                                    children: [(0, a.jsx)("span", {
                                        children: "Buscas recentes"
                                    }), (0, a.jsx)(st.Z, {})]
                                }), (0, a.jsx)(l.Z, {
                                    item: !0,
                                    xs: 12,
                                    className: e.recentChoice,
                                    children: x.map((function(t) {
                                        return (0, a.jsx)(Ve.Z, {
                                            color: "default",
                                            className: e.recentButton,
                                            onClick: function() {
                                                return b(t)
                                            },
                                            children: t.key
                                        }, t.key)
                                    }))
                                })]
                            })]
                        })
                    })
                },
                Mt = n(91790),
                Tt = n(83730),
                Ft = (0, s.Z)((function(e) {
                    return (0, g.Z)({
                        root: {
                            border: "1px solid ".concat(e.palette.grey[200]),
                            borderRadius: e.shape.borderRadius,
                            padding: e.spacing(3),
                            cursor: "pointer",
                            height: "100%",
                            "&:hover": {
                                backgroundColor: e.palette.grey[50],
                                "& img": {
                                    transform: "translateY(8%)",
                                    transition: ".1s"
                                },
                                "& #link-circle": {
                                    backgroundColor: e.palette.text.primary,
                                    border: "1px solid ".concat(e.palette.text.primary),
                                    color: "#fff",
                                    transition: ".1s"
                                }
                            }
                        },
                        image: {
                            marginBottom: e.spacing(3),
                            transition: ".1s"
                        },
                        container: {
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "space-between"
                        },
                        title: {
                            fontWeight: 600
                        },
                        linkCircle: {
                            alignItems: "center",
                            border: "1px solid ".concat(e.palette.grey[200]),
                            borderRadius: "50%",
                            color: e.palette.primary.main,
                            cursor: "pointer",
                            display: "flex",
                            height: e.spacing(5),
                            justifyContent: "center",
                            width: e.spacing(5)
                        },
                        description: {
                            color: e.palette.grey[500]
                        }
                    }, e.breakpoints.up("md"), {
                        root: {
                            marginRight: e.spacing(2)
                        }
                    })
                })),
                qt = function(e) {
                    var t = e.id,
                        n = e.image,
                        o = e.tag,
                        i = e.title,
                        r = e.description,
                        s = e.url,
                        c = Ft();
                    return (0, a.jsx)("a", {
                        href: s,
                        target: "_blank",
                        rel: "noreferrer",
                        className: c.linkContainer,
                        children: (0, a.jsxs)("div", {
                            className: c.root,
                            id: t,
                            children: [(0, a.jsx)(K(), {
                                alt: i,
                                id: "".concat(t, "_image"),
                                src: n,
                                loading: "lazy",
                                width: 236,
                                height: 110,
                                className: c.image
                            }), (0, a.jsxs)("div", {
                                className: c.container,
                                children: [(0, a.jsxs)("div", {
                                    children: [(0, a.jsx)(Tt.Z, {
                                        tag: o
                                    }), (0, a.jsx)(S.Z, {
                                        variant: "h3",
                                        className: c.title,
                                        children: i
                                    })]
                                }), (0, a.jsx)("div", {
                                    className: c.linkCircle,
                                    id: "link-circle",
                                    children: (0, a.jsx)(Mt.Z, {
                                        style: {
                                            fontSize: "24px"
                                        }
                                    })
                                })]
                            }), (0, a.jsx)(S.Z, {
                                variant: "body2",
                                className: c.description,
                                children: r
                            })]
                        })
                    })
                },
                Ot = (0, s.Z)((function(e) {
                    return (0, g.Z)({
                        root: {
                            marginBottom: "30px"
                        },
                        cardContainer: {
                            marginBottom: "32px"
                        },
                        dots: {
                            display: "none"
                        }
                    }, e.breakpoints.up("md"), {
                        root: {
                            marginBottom: "80px",
                            position: "relative"
                        },
                        dots: {
                            display: "block",
                            bottom: e.spacing(-9),
                            right: e.spacing(0),
                            position: "absolute"
                        }
                    })
                })),
                At = function() {
                    var e = Ot();
                    return (0, a.jsxs)(c.Z, {
                        component: "section",
                        className: e.root,
                        children: [(0, a.jsx)(u.Z, {
                            tag: "Loop",
                            children: "Solu\xe7\xf5es Loop"
                        }), (0, a.jsx)(S.Z, {
                            variant: "h3",
                            paragraph: !0,
                            children: "Quero comprar"
                        }), (0, a.jsxs)(l.Z, {
                            container: !0,
                            className: e.cardContainer,
                            spacing: 2,
                            children: [(0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                md: 4,
                                children: (0, a.jsx)(qt, {
                                    id: "compre_no_loop_carros",
                                    image: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-car-1.png",
                                    tag: "Solu\xe7\xe3o para PF",
                                    title: "Compre no Loop Carros",
                                    url: "https://loopcarros.com.br/comprar-um-carro",
                                    description: "Fa\xe7a o melhor neg\xf3cio comprando seu pr\xf3ximo carro com a gente."
                                })
                            }), (0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                md: 4,
                                children: (0, a.jsx)(qt, {
                                    id: "compre_na_revenda",
                                    image: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-car-2.png",
                                    tag: "Solu\xe7\xe3o para PJ",
                                    title: "Compre na Revenda",
                                    url: "https://looprevenda.com.br/",
                                    description: "Abaste\xe7a o estoque da sua loja com as melhores op\xe7\xf5es de ve\xedculos usados."
                                })
                            }), (0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                md: 4,
                                children: (0, a.jsx)(qt, {
                                    id: "compre_no_leilao",
                                    image: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-car-3.png",
                                    tag: "Solu\xe7\xe3o para PF e PJ",
                                    title: "Compre no Leil\xe3o",
                                    url: "/eventos",
                                    description: "Abaste\xe7a o estoque da sua loja com as melhores op\xe7\xf5es de ve\xedculos usados."
                                })
                            })]
                        }), (0, a.jsx)(S.Z, {
                            variant: "h3",
                            paragraph: !0,
                            children: "Quero vender"
                        }), (0, a.jsxs)(l.Z, {
                            container: !0,
                            className: e.cardContainer,
                            spacing: 2,
                            children: [(0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                md: 4,
                                children: (0, a.jsx)(qt, {
                                    id: "venda_loop_carros",
                                    image: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-car-4.png",
                                    tag: "Solu\xe7\xe3o para PF",
                                    title: "Venda Loop Carros",
                                    url: "https://loopcarros.com.br/",
                                    description: "Quer vender seu carro e n\xe3o se preocupar com nada? Cuidamos de tudo para voc\xea."
                                })
                            }), (0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                md: 4,
                                children: (0, a.jsx)(qt, {
                                    id: "venda_sua_frota",
                                    image: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-car-5.png",
                                    tag: "Solu\xe7\xe3o para PJ",
                                    title: "Venda sua Frota",
                                    url: "/venda-sua-frota",
                                    description: "Precisa vender sua frota? Criamos eventos personalizados."
                                })
                            }), (0, a.jsx)(l.Z, {
                                item: !0,
                                xs: 12,
                                md: 4,
                                children: (0, a.jsx)(qt, {
                                    id: "venda_no_leilao",
                                    image: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-car-6.png",
                                    tag: "Solu\xe7\xe3o para PF",
                                    title: "Venda no Leil\xe3o",
                                    url: "https://loopcarros.com.br/vender-meu-carro",
                                    description: "Fazemos seu ve\xedculo ser a estrela do leil\xe3o."
                                })
                            })]
                        }), (0, a.jsx)("div", {
                            className: e.dots,
                            children: (0, a.jsx)(K(), {
                                src: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao%2Fhome-pontos-vermelho.png",
                                alt: "",
                                width: 100,
                                height: 75
                            })
                        })]
                    })
                },
                Pt = n(282),
                Vt = (0, s.Z)((function(e) {
                    return (0, g.Z)({
                        root: {
                            marginBottom: "80px",
                            position: "relative"
                        },
                        imageContainer: {
                            marginBottom: e.spacing(4),
                            "& img": {
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: e.shape.borderRadius
                            }
                        },
                        textContainer: {
                            display: "flex",
                            flexDirection: "column",
                            gap: e.spacing(1.5)
                        },
                        contentGrid: {
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            marginBottom: e.spacing(2),
                            columnGap: "120px",
                            rowGap: e.spacing(2)
                        },
                        recruitment: {
                            display: "flex",
                            flexDirection: "column",
                            gap: e.spacing(1.5)
                        },
                        button: {
                            marginTop: e.spacing(2),
                            width: "fit-content",
                            alignSelf: "flex-start"
                        }
                    }, e.breakpoints.up("md"), {
                        contentGrid: {
                            gridTemplateColumns: "1fr 1fr",
                            rowGap: e.spacing(4)
                        },
                        imageContainer: {
                            marginBottom: 0
                        }
                    })
                })),
                Dt = function() {
                    var e = Vt();
                    return (0, a.jsxs)(c.Z, {
                        component: "section",
                        className: e.root,
                        children: [(0, a.jsx)(u.Z, {
                            tag: "Leil\xe3o",
                            children: "Transpar\xeancia e Estrutura para Leiloeiros"
                        }), (0, a.jsxs)("div", {
                            className: e.contentGrid,
                            children: [(0, a.jsx)("div", {
                                className: e.imageContainer,
                                children: (0, a.jsx)("img", {
                                    src: "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/leilao/patio-imigrantes.jpg",
                                    alt: ""
                                })
                            }), (0, a.jsxs)("div", {
                                className: e.textContainer,
                                children: [(0, a.jsx)(S.Z, {
                                    variant: "body2",
                                    children: "A Loop \xe9 uma empresa que disponibiliza toda a infraestrutura necess\xe1ria para que leiloeiros credenciados possam conduzir seus leil\xf5es com seguran\xe7a e efici\xeancia."
                                }), (0, a.jsx)(S.Z, {
                                    variant: "body2",
                                    children: "Nossa especialidade \xe9 oferecer um espa\xe7o moderno e seguro para armazenamento e organiza\xe7\xe3o dos ve\xedculos, garantindo que estejam protegidos at\xe9 o momento do leil\xe3o."
                                }), (0, a.jsx)(S.Z, {
                                    variant: "body2",
                                    children: "Realizamos os leil\xf5es diretamente e fornecemos suporte essencial para que os leiloeiros tenham as melhores condi\xe7\xf5es para desempenhar seu trabalho. Trabalhamos exclusivamente com profissionais credenciados pela JUCESP, garantindo credibilidade e conformidade em todas as etapas do processo."
                                }), (0, a.jsx)(S.Z, {
                                    variant: "body2",
                                    children: "Se voc\xea \xe9 leiloeiro e busca uma estrutura confi\xe1vel para realizar seus preg\xf5es, ou deseja comprar ou vender ve\xedculos em um ambiente organizado e seguro, a Loop \xe9 a escolha certa!"
                                })]
                            }), (0, a.jsxs)("div", {
                                className: e.textContainer,
                                children: [(0, a.jsxs)(S.Z, {
                                    variant: "body2",
                                    children: ["Se voc\xea ", (0, a.jsx)("strong", {
                                        children: "\xe9 leiloeiro"
                                    }), " e busca uma", " ", (0, a.jsx)("strong", {
                                        children: "estrutura confi\xe1vel"
                                    }), " para realizar seus preg\xf5es, ou deseja comprar ou vender ve\xedculos em um ambiente organizado e seguro, a Loop \xe9 a escolha certa!"]
                                }), (0, a.jsx)(Pt.Z, {
                                    variant: "outlined",
                                    color: "primary",
                                    size: "small",
                                    href: "https://dwrld.share.hsforms.com/2dxvwma2SSQKWPzh99VH-eg",
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: e.button,
                                    children: "Saiba mais"
                                })]
                            })]
                        })]
                    })
                },
                Wt = n(42530),
                Ht = function() {
                    var e = (0, r.Qs)();
                    return (0, i.W)({
                            eventName: "customPageView",
                            dataLayer: e
                        }),
                        function() {
                            var e = (0, Wt.s)(),
                                t = (0, de.useQueryClient)(),
                                n = (0, d.a)().session;
                            (0, y.useEffect)((function() {
                                return null === e || void 0 === e || e.on("auction/next-lot", (function() {
                                        t.invalidateQueries(le.R.getFeaturedLots(null === n || void 0 === n ? void 0 : n.id)), t.invalidateQueries(le.R.getLiveEvent())
                                    })), null === e || void 0 === e || e.on("auction/finish", (function() {
                                        t.invalidateQueries(le.R.getLiveEvent())
                                    })),
                                    function() {
                                        null === e || void 0 === e || e.off("auction/next-lot"), null === e || void 0 === e || e.off("auction/finish")
                                    }
                            }), [e, t, null === n || void 0 === n ? void 0 : n.id])
                        }(), (0, a.jsxs)("main", {
                            children: [(0, a.jsx)(Ie, {}), (0, a.jsx)(Se, {}), (0, a.jsx)(It, {}), (0, a.jsx)(ve, {}), (0, a.jsx)(U, {}), (0, a.jsx)(nt, {}), (0, a.jsx)(Dt, {}), (0, a.jsx)(ne, {}), (0, a.jsx)(At, {}), (0, a.jsx)(Ue.Z, {}), (0, a.jsx)(o.Z, {}), (0, a.jsx)(Ae, {}), (0, a.jsx)(Qe, {})]
                        })
                },
                $t = n(19422),
                Qt = !0,
                Ut = function() {
                    var e = "".concat("https://www.loopleiloes.com.br", "/");
                    return (0, a.jsxs)(a.Fragment, {
                        children: [(0, a.jsx)($t.default, {
                            pageTitle: "Leil\xe3o de carros online e presencial: compre seu carro na Loop",
                            pageDescription: "Compre o seu carro com transpar\xeancia, comodidade e rapidez no leil\xe3o de carros da Loop. Ve\xedculos vistoriados e servi\xe7o de documenta\xe7\xe3o completa.",
                            pageUrl: e
                        }), (0, a.jsx)(Ht, {})]
                    })
                }
        },
        65519: function() {},
        30706: function() {},
        13390: function() {}
    },
    function(e) {
        e.O(0, [2093, 1211, 8041, 4366, 5171, 6480, 2905, 926, 2052, 3344, 696, 947, 356, 9774, 2888, 179], (function() {
            return t = 48312, e(e.s = t);
            var t
        }));
        var t = e.O();
        _N_E = t
    }
]);
