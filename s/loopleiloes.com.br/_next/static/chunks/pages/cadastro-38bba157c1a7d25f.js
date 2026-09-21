(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [7788], {
        46730: function(e, o, r) {
            (window.__NEXT_P = window.__NEXT_P || []).push(["/cadastro", function() {
                return r(49615)
            }])
        },
        24097: function(e, o, r) {
            "use strict";
            var i = r(13040),
                n = r(7258);
            n.setLocale({
                mixed: {
                    required: "Campo obrigat\xf3rio.",
                    oneOf: "O campo $path."
                },
                string: {
                    email: "O campo deve ser um e-mail v\xe1lido.",
                    min: "O campo ${path} deve ter no m\xednimo ${min} caracteres.",
                    length: "Todos os digitos devem ser preenchidos."
                }
            }), n.addMethod(n.string, "cellphone", (function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "O campo deve ser um celular v\xe1lido.";
                return this.matches(/^\([1-9]{2}\) 9[1-9][0-9]{3}-[0-9]{4}$/, e)
            })), n.addMethod(n.string, "cpf", (function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "O campo deve ser um CPF v\xe1lido.";
                return this.test("is-cpf", e, (function(e) {
                    return !e || (0, i.cy)(e)
                }))
            })), n.addMethod(n.string, "cnpj", (function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "O campo deve ser um CNPJ v\xe1lido.";
                return this.test("is-cnpj", e, (function(e) {
                    return !e || (0, i.es)(e)
                }))
            })), o.Z = n
        },
        19209: function(e, o, r) {
            "use strict";
            var i;
            r.d(o, {
                    L: function() {
                        return i
                    }
                }),
                function(e) {
                    e.ID = "LOOPLEILOES_USER"
                }(i || (i = {}))
        },
        30306: function(e, o, r) {
            "use strict";
            r.d(o, {
                $1: function() {
                    return t
                },
                d8: function() {
                    return n
                }
            });
            var i = r(10253),
                n = function(e, o, r, i) {
                    var n = a(e, o, r);
                    i ? i.setHeader("Set-Cookie", n) : document.cookie = n
                },
                t = function(e) {
                    return e ? e.cookies : l(document.cookie)
                },
                a = function(e, o, r) {
                    var i = "".concat(e, "=").concat(o, ";");
                    if (!r) return i;
                    var n, t, a = r.expires ? " expires=".concat(r.expires.toUTCString(), ";") : "",
                        l = " path=".concat(null !== (n = r.path) && void 0 !== n ? n : "/", ";"),
                        s = r.httpOnly ? " httponly;" : "",
                        d = r.secure ? " secure;" : "",
                        c = " samesite=".concat(null !== (t = r.sameSite) && void 0 !== t ? t : "lax", " ;");
                    return "".concat(i).concat(a).concat(l).concat(s).concat(c).concat(d)
                },
                l = function(e) {
                    return e.split("; ").reduce((function(e, o) {
                        var r = (0, i.Z)(o.split("="), 2),
                            n = r[0],
                            t = r[1];
                        return e[n] = t, e
                    }), {})
                }
        },
        70325: function(e, o, r) {
            "use strict";
            r.d(o, {
                D: function() {
                    return a
                }
            });
            var i = r(24196),
                n = r(11163),
                t = r(88767),
                a = function(e) {
                    var o = (0, n.useRouter)(),
                        r = null !== e && void 0 !== e ? e : Number(o.query.lotId),
                        a = (0, t.useQuery)(["getLotDetails", {
                            id: r
                        }], (function() {
                            return function(e) {
                                return i.eE.get("/auction/lots/".concat(e))
                            }(r).then((function(e) {
                                return e.data
                            }))
                        }));
                    return {
                        lot: a.data
                    }
                }
        },
        57139: function(e, o, r) {
            "use strict";
            r.d(o, {
                W: function() {
                    return t
                }
            });
            var i = r(67294),
                n = r(78470),
                t = function(e) {
                    var o = e.eventName,
                        r = e.dataLayer,
                        t = e.autoDispatch,
                        a = void 0 === t || t,
                        l = (0, n.a)().isLoading,
                        s = (0, i.useRef)(!1),
                        d = (0, i.useCallback)((function(e) {
                            return console.log("".concat(o, "-manualDispatch"), null !== e && void 0 !== e ? e : r), document.dispatchEvent(new CustomEvent(o, {
                                detail: null !== e && void 0 !== e ? e : r
                            }))
                        }), [r, o]);
                    return (0, i.useEffect)((function() {
                        if (!l) {
                            var e = function() {
                                console.log(o)
                            };
                            return document.addEventListener(o, e), window.objDataLayer = r, a && !s.current && (d(), s.current = !0),
                                function() {
                                    document.removeEventListener(o, e)
                                }
                        }
                    }), [o, r, a, d, l]), {
                        dispatchEvent: d
                    }
                }
        },
        55435: function(e, o, r) {
            "use strict";
            r.d(o, {
                Dp: function() {
                    return f
                },
                MX: function() {
                    return m
                },
                Q3: function() {
                    return x
                },
                QX: function() {
                    return g
                },
                Qs: function() {
                    return p
                },
                Qz: function() {
                    return Z
                },
                k0: function() {
                    return b
                },
                v9: function() {
                    return h
                },
                z5: function() {
                    return v
                }
            });
            var i = r(26042),
                n = r(69396),
                t = r(78470),
                a = r(2568),
                l = r.n(a),
                s = r(11163),
                d = r(67294),
                c = r(70325),
                u = function() {
                    var e = (0, s.useRouter)(),
                        o = (0, t.a)(),
                        r = o.session,
                        i = o.isAuthenticated,
                        n = e.query,
                        a = n.idcmp,
                        c = n.icmpint,
                        u = n.icid,
                        m = n.lkid,
                        p = (0, d.useMemo)((function() {
                            return (null === r || void 0 === r ? void 0 : r.email) ? l()(r.email) : void 0
                        }), [null === r || void 0 === r ? void 0 : r.email]);
                    return (0, d.useMemo)((function() {
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
                                    idcmp: a,
                                    icmpint: c,
                                    icid: u,
                                    lkid: m
                                }
                            },
                            user: {
                                loginStatus: i ? "1" : "2",
                                loginId: p
                            }
                        }
                    }), [a, c, u, m, i, p])
                },
                m = function() {
                    var e = u();
                    return (0, d.useMemo)((function() {
                        return (0, n.Z)((0, i.Z)({}, e), {
                            page: (0, n.Z)((0, i.Z)({}, e.page), {
                                pageType: "loop-leilao-lp",
                                pageName: "/webmotors/leilao/loopcarros/lp",
                                pageNameTier1: "leilao",
                                pageNameTier2: "lp"
                            })
                        })
                    }), [e])
                },
                p = function() {
                    var e = u();
                    return (0, d.useMemo)((function() {
                        return (0, n.Z)((0, i.Z)({}, e), {
                            page: (0, n.Z)((0, i.Z)({}, e.page), {
                                pageType: "loop-leilao-homepage",
                                pageName: "/webmotors/leilao/loopcarros/homepage",
                                pageNameTier1: "leilao",
                                pageNameTier2: "homepage"
                            })
                        })
                    }), [e])
                },
                g = function() {
                    var e = u();
                    return (0, d.useMemo)((function() {
                        return (0, n.Z)((0, i.Z)({}, e), {
                            page: (0, n.Z)((0, i.Z)({}, e.page), {
                                pageType: "loop-leilao-eventos",
                                pageName: "/webmotors/leilao/loopcarros/eventos",
                                pageNameTier1: "leilao",
                                pageNameTier2: "eventos"
                            })
                        })
                    }), [e])
                },
                f = function() {
                    var e = u();
                    return (0, d.useMemo)((function() {
                        return (0, n.Z)((0, i.Z)({}, e), {
                            page: (0, n.Z)((0, i.Z)({}, e.page), {
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
                    var e = u();
                    return (0, d.useMemo)((function() {
                        return (0, n.Z)((0, i.Z)({}, e), {
                            page: (0, n.Z)((0, i.Z)({}, e.page), {
                                pageType: "loop-leilao-como-vender",
                                pageName: "/webmotors/leilao/loopcarros/como-vender",
                                pageNameTier1: "leilao",
                                pageNameTier2: "como-vender"
                            })
                        })
                    }), [e])
                },
                h = function() {
                    var e = u();
                    return (0, d.useMemo)((function() {
                        return (0, n.Z)((0, i.Z)({}, e), {
                            page: (0, n.Z)((0, i.Z)({}, e.page), {
                                pageType: "loop-leilao-login",
                                pageName: "/webmotors/leilao/loopcarros/login",
                                pageNameTier1: "leilao",
                                pageNameTier2: "login"
                            })
                        })
                    }), [e])
                },
                x = function() {
                    var e = u();
                    return (0, d.useMemo)((function() {
                        return (0, n.Z)((0, i.Z)({}, e), {
                            page: (0, n.Z)((0, i.Z)({}, e.page), {
                                pageType: "loop-leilao-cadastro",
                                pageName: "/webmotors/leilao/loopcarros/cadastro",
                                pageNameTier1: "leilao",
                                pageNameTier2: "cadastro"
                            })
                        })
                    }), [e])
                },
                Z = function() {
                    var e = u(),
                        o = (0, c.D)().lot,
                        r = o.inspectionInfo.map((function(e) {
                            return e.label
                        })),
                        t = o.inspectionInfo.map((function(e) {
                            return e.label
                        }));
                    return (0, d.useMemo)((function() {
                        return (0, n.Z)((0, i.Z)({}, e), {
                            page: (0, n.Z)((0, i.Z)({}, e.page), {
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
                                    id: r,
                                    name: t
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
                    }), [e, o.mainInfo, o.vehicle, r, t])
                },
                b = function() {
                    var e = u(),
                        o = (0, s.useRouter)().query.slug;
                    return (0, d.useMemo)((function() {
                        return (0, n.Z)((0, i.Z)({}, e), {
                            page: (0, n.Z)((0, i.Z)({}, e.page), {
                                pageType: "loop-leilao-".concat(o),
                                pageName: "/webmotors/leilao/loopcarros/".concat(o),
                                pageNameTier1: "leilao",
                                pageNameTier2: "conteudo"
                            })
                        })
                    }), [e, o])
                }
        },
        19422: function(e, o, r) {
            "use strict";
            r.r(o);
            var i = r(85893),
                n = r(9008),
                t = r.n(n);
            o.default = function(e) {
                var o = e.pageTitle,
                    r = void 0 === o ? "Leil\xe3o de Carros | Loop Leil\xf5es" : o,
                    n = e.pageDescription,
                    a = void 0 === n ? "Saiba mais sobre o ve\xedculo e fa\xe7a o seu lance!" : n,
                    l = e.pageUrl,
                    s = e.pageImage,
                    d = void 0 === s ? "https://objectstorage.sa-saopaulo-1.oraclecloud.com/n/loopbrasil/b/assets/o/loop/logo-loop.svg" : s,
                    c = e.children;
                return (0, i.jsxs)(t(), {
                    children: [(0, i.jsx)("title", {
                        children: r
                    }), (0, i.jsx)("meta", {
                        name: "description",
                        content: a
                    }), (0, i.jsx)("meta", {
                        property: "og:title",
                        content: r
                    }), (0, i.jsx)("meta", {
                        property: "og:type",
                        content: "website"
                    }), l ? (0, i.jsx)("meta", {
                        property: "og:url",
                        content: l
                    }) : null, (0, i.jsx)("meta", {
                        property: "og:image",
                        content: d
                    }), (0, i.jsx)("meta", {
                        property: "og:site_name",
                        content: "Loop Leil\xf5es"
                    }), (0, i.jsx)("link", {
                        rel: "canonical",
                        href: l
                    }), c]
                })
            }
        },
        49615: function(e, o, r) {
            "use strict";
            r.r(o), r.d(o, {
                default: function() {
                    return de
                }
            });
            var i = r(85893),
                n = r(47568),
                t = r(26042),
                a = r(69396),
                l = r(10253),
                s = r(70655),
                d = r(52770),
                c = r(41749),
                u = r(22318),
                m = r(9669),
                p = r.n(m),
                g = r(57139),
                f = r(55435),
                v = r(67294),
                h = r(34853),
                x = r(95496),
                Z = r(25862),
                b = r(11163),
                j = r(87536),
                T = r(24097),
                C = r(85394),
                y = r(5001),
                w = r(7292),
                q = r(13040),
                P = r(20387),
                N = T.Z.object({
                    type: T.Z.string().label("Tipo de registro"),
                    name: T.Z.string().required().label("raz\xe3o social"),
                    document: T.Z.string().cnpj().required().label("CNPJ"),
                    phone: T.Z.string().cellphone().required().label("celular"),
                    phoneConfirmation: T.Z.string().oneOf([T.Z.ref("phone"), null], "Os campos de celular devem ser iguais.").required().label("confirmar celular"),
                    cep: T.Z.string().required().test("is-valid-cep", "O campo CEP deve ser um CEP v\xe1lido.", q.cT).label("CEP"),
                    street: T.Z.string().required().label("endere\xe7o"),
                    number: T.Z.string().required().label("N\xba"),
                    district: T.Z.string().required().label("bairro"),
                    complement: T.Z.string().label("complemento"),
                    state: T.Z.string().required().label("estado"),
                    city: T.Z.string().required().label("cidade"),
                    email: T.Z.string().email().required().label("e-mail"),
                    emailConfirmation: T.Z.string().email().oneOf([T.Z.ref("email"), null], "Os campos de email devem ser iguais.").required().label("confirmar e-mail"),
                    password: T.Z.string().min(6).required().label("senha"),
                    passwordConfirmation: T.Z.string().min(6).oneOf([T.Z.ref("password"), null], "Os campos de senha devem ser iguais.").required().label("confirmar senha"),
                    hasAcceptedEmails: T.Z.bool(),
                    hasAcceptedTerms: T.Z.bool().oneOf([!0], "Para prosseguir com o cadastro voc\xea deve aceitar nossos termos."),
                    documentFront: T.Z.mixed().test("required", "Os campos de arquivo s\xe3o obrigat\xf3rios.", (function(e) {
                        return (null === e || void 0 === e ? void 0 : e.length) > 0
                    })).test("fileType", "Arquivo deve ser do tipo PDF, JPG, PNG ou JPEG", (0, P.g)(["application/pdf", "image/jpeg", "image/png", "image/jpg"])).test("fileSize", "Arquivo excede o limite de 30mb.", (function(e) {
                        return !(null === e || void 0 === e ? void 0 : e.length) || e[0].size <= 3e7
                    })).label("arquivo"),
                    documentSelfie: T.Z.mixed().test("required", "Os campos de arquivo s\xe3o obrigat\xf3rios.", (function(e) {
                        return (null === e || void 0 === e ? void 0 : e.length) > 0
                    })).test("fileType", "Arquivo deve ser do tipo PDF, JPG, PNG ou JPEG", (0, P.g)(["application/pdf", "image/jpeg", "image/png", "image/jpg"])).test("fileSize", "Arquivo excede o limite de 30mb.", (function(e) {
                        return !(null === e || void 0 === e ? void 0 : e.length) || e[0].size <= 3e7
                    })).label("arquivo"),
                    proofOfResidence: T.Z.mixed().test("required", "Os campos de arquivo s\xe3o obrigat\xf3rios.", (function(e) {
                        return (null === e || void 0 === e ? void 0 : e.length) > 0
                    })).test("fileType", "Arquivo deve ser do tipo PDF, JPG, PNG ou JPEG", (0, P.g)(["application/pdf", "image/jpeg", "image/png", "image/jpg"])).test("fileSize", "Arquivo excede o limite de 30mb.", (function(e) {
                        return !(null === e || void 0 === e ? void 0 : e.length) || e[0].size <= 3e7
                    })).label("arquivo"),
                    socialContract: T.Z.mixed().test("required", "Os campos de arquivo s\xe3o obrigat\xf3rios.", (function(e) {
                        return (null === e || void 0 === e ? void 0 : e.length) > 0
                    })).test("fileType", "Arquivo deve ser do tipo PDF, JPG, PNG ou JPEG", (0, P.g)(["application/pdf", "image/jpeg", "image/png", "image/jpg"])).test("fileSize", "Arquivo excede o limite de 30mb.", (function(e) {
                        return !(null === e || void 0 === e ? void 0 : e.length) || e[0].size <= 3e7
                    })).label("arquivo"),
                    cnpjCard: T.Z.mixed().test("required", "Os campos de arquivo s\xe3o obrigat\xf3rios.", (function(e) {
                        return (null === e || void 0 === e ? void 0 : e.length) > 0
                    })).test("fileType", "Arquivo deve ser do tipo PDF, JPG, PNG ou JPEG", (0, P.g)(["application/pdf", "image/jpeg", "image/png", "image/jpg"])).test("fileSize", "Arquivo excede o limite de 30mb.", (function(e) {
                        return !(null === e || void 0 === e ? void 0 : e.length) || e[0].size <= 3e7
                    })).label("arquivo")
                }),
                O = T.Z.object({
                    type: T.Z.string().label("Tipo de registro"),
                    name: T.Z.string().required().label("nome").nullable(),
                    dateOfBirth: T.Z.string().required().test("is-valid-date", "O campo ${path} deve ser uma data v\xe1lida.", (function(e) {
                        return (0, w.q)(e)
                    })).test("is-future-date", "O campo ${path} deve ser uma data v\xe1lida.", (function(e) {
                        return (0, w.C)(e)
                    })).test("is-eighteen-years-old", "Voc\xea deve ter mais de 18 anos para se cadastrar.", (function(e) {
                        if (!e) return !0;
                        var o = (0, C.default)(e, "dd/MM/yyyy", new Date),
                            r = new Date;
                        return (0, y.Z)(r, o) >= 18
                    })).label("nascimento"),
                    phone: T.Z.string().cellphone().required().label("celular"),
                    phoneConfirmation: T.Z.string().oneOf([T.Z.ref("phone"), null], "Os campos de celular devem ser iguais.").required().label("confirmar celular"),
                    document: T.Z.string().cpf().required().label("CPF"),
                    cep: T.Z.string().required().test("is-valid-cep", "O campo CEP deve ser um CEP v\xe1lido.", q.cT).label("CEP"),
                    street: T.Z.string().required().label("endere\xe7o"),
                    district: T.Z.string().required().label("bairro"),
                    complement: T.Z.string().label("complemento"),
                    state: T.Z.string().required().label("estado"),
                    city: T.Z.string().required().label("cidade"),
                    number: T.Z.string().required().label("N\xba"),
                    email: T.Z.string().email().required().label("e-mail"),
                    emailConfirmation: T.Z.string().email().oneOf([T.Z.ref("email"), null], "Os campos de email devem ser iguais.").required().label("confirmar e-mail"),
                    password: T.Z.string().min(6).required().label("senha"),
                    passwordConfirmation: T.Z.string().min(6).oneOf([T.Z.ref("password"), null], "Os campos de senha devem ser iguais.").required().label("confirmar senha"),
                    hasAcceptedEmails: T.Z.bool(),
                    hasAcceptedTerms: T.Z.bool().oneOf([!0], "Para prosseguir com o cadastro voc\xea deve aceitar nossos termos."),
                    documentFront: T.Z.mixed().test("required", "Os campos de arquivo s\xe3o obrigat\xf3rios.", (function(e) {
                        return (null === e || void 0 === e ? void 0 : e.length) > 0
                    })).test("fileType", "Arquivo deve ser do tipo PDF, JPG, PNG ou JPEG", (0, P.g)(["application/pdf", "image/jpeg", "image/png", "image/jpg"])).test("fileSize", "Arquivo excede o limite de 30mb.", (function(e) {
                        return !(null === e || void 0 === e ? void 0 : e.length) || e[0].size <= 3e7
                    })).label("arquivo"),
                    documentSelfie: T.Z.mixed().test("required", "Os campos de arquivo s\xe3o obrigat\xf3rios.", (function(e) {
                        return (null === e || void 0 === e ? void 0 : e.length) > 0
                    })).test("fileType", "Arquivo deve ser do tipo PDF, JPG, PNG ou JPEG", (0, P.g)(["application/pdf", "image/jpeg", "image/png", "image/jpg"])).test("fileSize", "Arquivo excede o limite de 30mb.", (function(e) {
                        return !(null === e || void 0 === e ? void 0 : e.length) || e[0].size <= 3e7
                    })).label("arquivo"),
                    proofOfResidence: T.Z.mixed().test("required", "Os campos de arquivo s\xe3o obrigat\xf3rios.", (function(e) {
                        return (null === e || void 0 === e ? void 0 : e.length) > 0
                    })).test("fileType", "Arquivo deve ser do tipo PDF, JPG, PNG ou JPEG", (0, P.g)(["application/pdf", "image/jpeg", "image/png", "image/jpg"])).test("fileSize", "Arquivo excede o limite de 30mb.", (function(e) {
                        return !(null === e || void 0 === e ? void 0 : e.length) || e[0].size <= 3e7
                    })).label("arquivo")
                }),
                B = T.Z.lazy((function(e) {
                    return "pj" === e.type ? N : O
                })),
                E = (T.Z.string().length(4).matches(/^\d+$/, "Campo deve conter apenas n\xfameros.").required().label("c\xf3digo"), r(99534)),
                S = r(30553),
                A = r(80797),
                D = r(30585),
                I = (0, v.forwardRef)((function(e, o) {
                    var r = e.helperText,
                        n = e.error,
                        l = (0, E.Z)(e, ["helperText", "error"]);
                    return (0, i.jsxs)(i.Fragment, {
                        children: [(0, i.jsx)(S.Z, (0, a.Z)((0, t.Z)({}, l), {
                            control: (0, i.jsx)(A.Z, {}),
                            inputRef: o
                        })), r ? (0, i.jsx)(D.Z, {
                            error: n,
                            children: r
                        }) : null]
                    })
                }));
            I.displayName = "CheckboxBool";
            var L = I,
                k = r(74047),
                G = r(45623),
                F = r(41120),
                M = r(63457),
                z = r(68468),
                R = r(22624),
                J = r(2296),
                _ = r(90754),
                U = r(68688),
                V = function() {
                    var e, o, r, n, a, l, s, d, u, m, p, g, f, v, h, x, Z, b, T, C, y = (0, j.Gc)(),
                        w = y.register,
                        q = y.control,
                        P = y.formState.errors,
                        N = (0, j.bc)({
                            control: q,
                            name: "emailConfirmation"
                        }).field,
                        O = (0, j.bc)({
                            control: q,
                            name: "email"
                        }).field;
                    return (0, i.jsxs)(i.Fragment, {
                        children: [(0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Raz\xe3o Social",
                                error: Boolean(P.name),
                                helperText: null === (e = P.name) || void 0 === e ? void 0 : e.message
                            }, w("name")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 9,
                            children: (0, i.jsx)(R.Z, (0, t.Z)({
                                label: "CNPJ",
                                mask: "99.999.999/9999-99",
                                error: Boolean(P.document),
                                helperText: null === (o = P.document) || void 0 === o ? void 0 : o.message
                            }, w("document")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 3,
                            children: (0, i.jsx)(R.Z, (0, t.Z)({
                                label: "CEP",
                                mask: "99999-999",
                                error: Boolean(P.cep),
                                helperText: null === (r = P.cep) || void 0 === r ? void 0 : r.message
                            }, w("cep")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 7,
                            md: 9,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Endere\xe7o",
                                error: Boolean(P.street),
                                helperText: null === (n = P.street) || void 0 === n ? void 0 : n.message
                            }, w("street")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 5,
                            md: 3,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "N\xba",
                                error: Boolean(P.number),
                                helperText: null === (a = P.number) || void 0 === a ? void 0 : a.message
                            }, w("number")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 6,
                            md: 4,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Complemento",
                                error: Boolean(P.complement),
                                helperText: null === (l = P.complement) || void 0 === l ? void 0 : l.message,
                                inputProps: {
                                    maxLength: 50
                                }
                            }, w("complement")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 6,
                            md: 8,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Bairro",
                                error: Boolean(P.district),
                                helperText: null === (s = P.district) || void 0 === s ? void 0 : s.message
                            }, w("district")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Cidade",
                                error: Boolean(P.city),
                                helperText: null === (d = P.city) || void 0 === d ? void 0 : d.message
                            }, w("city")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(J.Z, (0, t.Z)({
                                label: "Estado",
                                error: Boolean(P.state),
                                helperText: null === (u = P.state) || void 0 === u ? void 0 : u.message
                            }, w("state")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(R.Z, (0, t.Z)({
                                label: "Celular",
                                mask: "(99) 99999-9999",
                                error: Boolean(P.phone),
                                helperText: null === (m = P.phone) || void 0 === m ? void 0 : m.message
                            }, w("phone")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(R.Z, (0, t.Z)({
                                label: "Confirmar celular",
                                mask: "(99) 99999-9999",
                                error: Boolean(P.phoneConfirmation),
                                helperText: null === (p = P.phoneConfirmation) || void 0 === p ? void 0 : p.message
                            }, w("phoneConfirmation")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "e-mail",
                                onPaste: function(e) {
                                    return e.preventDefault()
                                },
                                error: Boolean(P.email),
                                helperText: null === (g = P.email) || void 0 === g ? void 0 : g.message,
                                autoComplete: "email"
                            }, O))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Confirmar e-mail",
                                onPaste: function(e) {
                                    return e.preventDefault()
                                },
                                error: Boolean(P.emailConfirmation),
                                helperText: null === (f = P.emailConfirmation) || void 0 === f ? void 0 : f.message,
                                autoComplete: "email"
                            }, N))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(_.Z, (0, t.Z)({
                                label: "Senha",
                                error: Boolean(P.password),
                                helperText: null === (v = P.password) || void 0 === v ? void 0 : v.message,
                                autoComplete: "new-password"
                            }, w("password")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(_.Z, (0, t.Z)({
                                label: "Confirmar Senha",
                                error: Boolean(P.passwordConfirmation),
                                helperText: null === (h = P.passwordConfirmation) || void 0 === h ? void 0 : h.message,
                                autoComplete: "new-password"
                            }, w("passwordConfirmation")))
                        }), (0, i.jsxs)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: [(0, i.jsx)(U.Z, (0, t.Z)({
                                label: "Documento",
                                accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps",
                                error: Boolean(P.documentFront),
                                helperText: null === (x = P.documentFront) || void 0 === x ? void 0 : x.message
                            }, w("documentFront"))), (0, i.jsx)(D.Z, {
                                children: "Documento do propriet\xe1rio RG, CPF, CNH ou procura\xe7\xe3o caso n\xe3o for o propriet\xe1rio."
                            })]
                        }), (0, i.jsxs)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: [(0, i.jsx)(U.Z, (0, t.Z)({
                                label: "Foto com documento",
                                accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps",
                                error: Boolean(P.documentSelfie),
                                helperText: null === (Z = P.documentSelfie) || void 0 === Z ? void 0 : Z.message
                            }, w("documentSelfie"))), (0, i.jsx)(D.Z, {
                                children: "Uma selfie sua segurando seu documento com sua foto."
                            })]
                        }), (0, i.jsxs)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: [(0, i.jsx)(U.Z, (0, t.Z)({
                                label: "Contrato Social",
                                accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps",
                                error: Boolean(P.socialContract),
                                helperText: null === (b = P.socialContract) || void 0 === b ? void 0 : b.message
                            }, w("socialContract"))), (0, i.jsx)(D.Z, {
                                children: "Ultima atualiza\xe7\xe3o do contrato social da empresa."
                            })]
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(U.Z, (0, t.Z)({
                                label: "Cart\xe3o CNPJ",
                                accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps",
                                error: Boolean(P.cnpjCard),
                                helperText: null === (T = P.cnpjCard) || void 0 === T ? void 0 : T.message
                            }, w("cnpjCard")))
                        }), (0, i.jsxs)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: [(0, i.jsx)(U.Z, (0, t.Z)({
                                label: "Comprovante de endere\xe7o",
                                accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps",
                                error: Boolean(P.proofOfResidence),
                                helperText: null === (C = P.proofOfResidence) || void 0 === C ? void 0 : C.message
                            }, w("proofOfResidence"))), (0, i.jsx)(D.Z, {
                                children: "Contas de consumo (\xe1gua, luz, internet), faturas de banco ou de cart\xe3o de cr\xe9dito, IPTU ou IPVA."
                            })]
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            children: (0, i.jsxs)(D.Z, {
                                children: ["A libera\xe7\xe3o do seu usu\xe1rio para envio de lances ser\xe1 efetivada ap\xf3s conclus\xe3o do seu cadastro e aprova\xe7\xe3o dos documentos enviados no per\xedodo de ", (0, i.jsx)("b", {
                                    children: "72 horas em dias \xfateis"
                                }), "."]
                            })
                        })]
                    })
                },
                $ = function() {
                    var e, o, r, n, a, l, s, d, u, m, p, g, f, v, h, x, Z, b, T, C = (0, j.Gc)(),
                        y = C.register,
                        w = C.control,
                        q = C.formState.errors,
                        P = (0, j.bc)({
                            control: w,
                            name: "emailConfirmation"
                        }).field,
                        N = (0, j.bc)({
                            control: w,
                            name: "email"
                        }).field;
                    return (0, i.jsxs)(i.Fragment, {
                        children: [(0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Nome completo",
                                error: Boolean(q.name),
                                helperText: null === (e = q.name) || void 0 === e ? void 0 : e.message
                            }, y("name")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(R.Z, (0, t.Z)({
                                label: "Nascimento",
                                mask: "99/99/9999",
                                error: Boolean(q.dateOfBirth),
                                helperText: null === (o = q.dateOfBirth) || void 0 === o ? void 0 : o.message
                            }, y("dateOfBirth")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 6,
                            md: 6,
                            children: (0, i.jsx)(R.Z, (0, t.Z)({
                                label: "CPF",
                                mask: "999.999.999-99",
                                error: Boolean(q.document),
                                helperText: null === (r = q.document) || void 0 === r ? void 0 : r.message
                            }, y("document")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 6,
                            md: 4,
                            children: (0, i.jsx)(R.Z, (0, t.Z)({
                                label: "CEP",
                                mask: "99999-999",
                                error: Boolean(q.cep),
                                helperText: null === (n = q.cep) || void 0 === n ? void 0 : n.message
                            }, y("cep")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 8,
                            md: 8,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Endere\xe7o",
                                error: Boolean(q.street),
                                helperText: null === (a = q.street) || void 0 === a ? void 0 : a.message
                            }, y("street")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 4,
                            md: 2,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "N\xba",
                                error: Boolean(q.number),
                                helperText: null === (l = q.number) || void 0 === l ? void 0 : l.message
                            }, y("number")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 4,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Complemento",
                                error: Boolean(q.complement),
                                helperText: null === (s = q.complement) || void 0 === s ? void 0 : s.message,
                                inputProps: {
                                    maxLength: 50
                                }
                            }, y("complement")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Bairro",
                                error: Boolean(q.district),
                                helperText: null === (d = q.district) || void 0 === d ? void 0 : d.message
                            }, y("district")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 8,
                            md: 8,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Cidade",
                                error: Boolean(q.city),
                                helperText: null === (u = q.city) || void 0 === u ? void 0 : u.message
                            }, y("city")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 4,
                            md: 4,
                            children: (0, i.jsx)(J.Z, (0, t.Z)({
                                label: "Estado",
                                error: Boolean(q.state),
                                helperText: null === (m = q.state) || void 0 === m ? void 0 : m.message
                            }, y("state")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(R.Z, (0, t.Z)({
                                label: "Celular",
                                mask: "(99) 99999-9999",
                                error: Boolean(q.phone),
                                helperText: null === (p = q.phone) || void 0 === p ? void 0 : p.message
                            }, y("phone")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(R.Z, (0, t.Z)({
                                label: "Confirmar celular",
                                mask: "(99) 99999-9999",
                                error: Boolean(q.phoneConfirmation),
                                helperText: null === (g = q.phoneConfirmation) || void 0 === g ? void 0 : g.message
                            }, y("phoneConfirmation")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "e-mail",
                                error: Boolean(q.email),
                                helperText: null === (f = q.email) || void 0 === f ? void 0 : f.message,
                                autoComplete: "email"
                            }, N))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(z.Z, (0, t.Z)({
                                label: "Confirmar e-mail",
                                onPaste: function(e) {
                                    return e.preventDefault()
                                },
                                error: Boolean(q.emailConfirmation),
                                helperText: null === (v = q.emailConfirmation) || void 0 === v ? void 0 : v.message,
                                autoComplete: "email"
                            }, P))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(_.Z, (0, t.Z)({
                                label: "Senha",
                                error: Boolean(q.password),
                                helperText: null === (h = q.password) || void 0 === h ? void 0 : h.message,
                                autoComplete: "new-password"
                            }, y("password")))
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: (0, i.jsx)(_.Z, (0, t.Z)({
                                label: "Confirmar Senha",
                                error: Boolean(q.passwordConfirmation),
                                helperText: null === (x = q.passwordConfirmation) || void 0 === x ? void 0 : x.message,
                                autoComplete: "new-password"
                            }, y("passwordConfirmation")))
                        }), (0, i.jsxs)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: [(0, i.jsx)(U.Z, (0, t.Z)({
                                label: "Documento",
                                accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps",
                                error: Boolean(q.documentFront),
                                helperText: null === (Z = q.documentFront) || void 0 === Z ? void 0 : Z.message
                            }, y("documentFront"))), (0, i.jsx)(D.Z, {
                                children: "Frente do seu RG, CPF, CNH ou Certid\xe3o de casamento."
                            })]
                        }), (0, i.jsxs)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: [(0, i.jsx)(U.Z, (0, t.Z)({
                                label: "Foto com documento",
                                accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps",
                                error: Boolean(q.documentSelfie),
                                helperText: null === (b = q.documentSelfie) || void 0 === b ? void 0 : b.message
                            }, y("documentSelfie"))), (0, i.jsx)(D.Z, {
                                children: "Uma selfie sua segurando seu documento com sua foto."
                            })]
                        }), (0, i.jsxs)(c.Z, {
                            item: !0,
                            xs: 12,
                            md: 6,
                            children: [(0, i.jsx)(U.Z, (0, t.Z)({
                                label: "Comprovante de resid\xeancia",
                                accept: "image/jpeg,image/gif,image/png,application/pdf,image/x-eps",
                                error: Boolean(q.proofOfResidence),
                                helperText: null === (T = q.proofOfResidence) || void 0 === T ? void 0 : T.message
                            }, y("proofOfResidence"))), (0, i.jsx)(D.Z, {
                                children: "Contas de consumo (\xe1gua, luz, internet), faturas de banco ou de cart\xe3o de cr\xe9dito, IPTU ou IPVA."
                            })]
                        }), (0, i.jsx)(c.Z, {
                            item: !0,
                            xs: 12,
                            children: (0, i.jsxs)(D.Z, {
                                children: ["A libera\xe7\xe3o do seu usu\xe1rio para envio de lances ser\xe1 efetivada ap\xf3s conclus\xe3o do seu cadastro e aprova\xe7\xe3o dos documentos enviados no per\xedodo de ", (0, i.jsx)("b", {
                                    children: "72 horas em dias \xfateis"
                                }), "."]
                            })
                        })]
                    })
                },
                Q = r(89659),
                H = (0, v.forwardRef)((function(e, o) {
                    return (0, i.jsx)(L, (0, t.Z)({
                        ref: o,
                        label: (0, i.jsxs)("span", {
                            children: ["Aceito os", " ", (0, i.jsx)(Q.Z, {
                                href: "/conteudo/termos-de-uso-e-consentimento-de-condicoes-de-navegacao",
                                color: "inherit",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: "termos e condi\xe7\xf5es do Loop Leil\xf5es"
                            })]
                        })
                    }, e))
                })),
                X = (0, F.Z)((function() {
                    return {
                        type: {
                            display: "flex",
                            flexDirection: "row",
                            marginBottom: "16px",
                            "& > *:not(:last-child)": {
                                marginRight: "64px"
                            }
                        },
                        form: {
                            marginBottom: "24px"
                        },
                        errorContainer: {
                            width: "100%",
                            maxHeight: "160px"
                        }
                    }
                })),
                W = [{
                    value: "pf",
                    label: "Pessoa F\xedsica"
                }, {
                    value: "pj",
                    label: "Pessoa Jur\xeddica"
                }, {
                    value: "revendedor",
                    label: "Revendedor"
                }],
                Y = function(e) {
                    var o, r = e.onSubmit,
                        n = e.isLoading,
                        a = X(),
                        l = (0, j.Gc)(),
                        s = l.register,
                        d = l.watch,
                        u = l.control,
                        m = l.handleSubmit,
                        p = l.formState,
                        g = p.errors,
                        f = p.isSubmitting,
                        v = (0, M.Z)("(max-width: 1020px)"),
                        h = (0, M.Z)("(max-width: 1600px)"),
                        x = d("type"),
                        Z = (0, j.bc)({
                            control: u,
                            name: "hasAcceptedTerms"
                        }).field;
                    return (0, i.jsxs)("form", {
                        id: "user-registration",
                        className: a.form,
                        onSubmit: m(r),
                        children: [(0, i.jsx)(k.Z, (0, t.Z)({
                            defaultValue: "pf",
                            className: a.type,
                            options: W
                        }, s("type"))), (0, i.jsxs)(c.Z, {
                            container: !0,
                            justifyContent: "space-between",
                            spacing: v ? 2 : h ? 4 : 3,
                            children: ["pj" === x ? (0, i.jsx)(V, {}) : (0, i.jsx)($, {}), (0, i.jsxs)(c.Z, {
                                container: !0,
                                item: !0,
                                xs: 12,
                                direction: "column",
                                children: [(0, i.jsx)(L, (0, t.Z)({
                                    label: "Quero receber ofertas e not\xedcias"
                                }, s("hasAcceptedEmails"))), (0, i.jsx)(H, (0, t.Z)({
                                    error: Boolean(g.hasAcceptedTerms),
                                    helperText: null === (o = g.hasAcceptedTerms) || void 0 === o ? void 0 : o.message,
                                    checked: Z.value
                                }, Z))]
                            }), (0, i.jsx)(c.Z, {
                                container: !0,
                                item: !0,
                                justifyContent: "center",
                                children: (0, i.jsx)(G.Z, {
                                    loading: f || n,
                                    type: "submit",
                                    children: "Continuar"
                                })
                            })]
                        })]
                    })
                },
                K = function(e) {
                    var o = e.onSubmit,
                        r = e.isLoading,
                        n = (0, b.useRouter)().query,
                        l = n.email,
                        s = n.utm_medium,
                        d = n.utm_source,
                        c = (0, j.cI)({
                            resolver: (0, x.X)(B),
                            shouldUnregister: !0,
                            defaultValues: {
                                type: "pf",
                                hasAcceptedEmails: !1,
                                hasAcceptedTerms: !1,
                                email: "",
                                emailConfirmation: ""
                            }
                        });
                    c.watch("type");
                    return (0, v.useEffect)((function() {
                        c.reset({
                            email: l,
                            emailConfirmation: l,
                            hasAcceptedTerms: "lp" === s
                        })
                    }), [c, l, s]), (0, v.useEffect)((function() {
                        c.reset({}, {
                            keepValues: !0
                        })
                    }), [c]), (0, i.jsx)(j.RV, (0, a.Z)((0, t.Z)({}, c), {
                        children: (0, i.jsx)(Y, {
                            onSubmit: function(e) {
                                var r = localStorage.getItem("groupId"),
                                    i = (0, a.Z)((0, t.Z)({}, e), {
                                        origin: d,
                                        dateOfBirth: e.dateOfBirth ? (0, Z.O)(e.dateOfBirth) : null,
                                        groupId: r
                                    });
                                o(i)
                            },
                            isLoading: r
                        })
                    }))
                },
                ee = r(20264),
                oe = r(19209),
                re = r(88767),
                ie = r(30306),
                ne = r(24196),
                te = function() {
                    var e = (0, b.useRouter)(),
                        o = (0, f.Q3)(),
                        r = (0, g.W)({
                            eventName: "inicioCadastroLoop",
                            dataLayer: o,
                            autoDispatch: !1
                        }).dispatchEvent,
                        i = (0, re.useMutation)((function(e) {
                            return function(e) {
                                return ne.P$.post("/captcha", e)
                            }({
                                captcha: e.captcha
                            })
                        }), {
                            onSuccess: function(e, o) {
                                n.mutate(o.formData)
                            },
                            onError: function(e) {
                                (0, ee.Tb)(e, {
                                    tags: {
                                        form: "registration"
                                    }
                                })
                            }
                        }),
                        n = (0, re.useMutation)((function(e) {
                            return function(e) {
                                return ne.eE.post("/auction/users", e)
                            }(e).then((function(e) {
                                return e.data
                            }))
                        }), {
                            onSuccess: function(i) {
                                var n = new Date,
                                    l = n.getTime() + 345600;
                                n.setTime(l);
                                r((0, a.Z)((0, t.Z)({}, o), {
                                    user: (0, a.Z)((0, t.Z)({}, o.user), {
                                        tipoCadastro: {
                                            pf: "1",
                                            pj: "2",
                                            revendedor: "3"
                                        }[i.type]
                                    })
                                })), (0, ie.d8)(oe.L.ID, i.id, {
                                    expires: n
                                }), localStorage.removeItem("groupId"), e.push("/cadastro/confirmar-sms")
                            },
                            onError: function(e) {
                                (0, ee.Tb)(e, {
                                    tags: {
                                        form: "registration"
                                    }
                                })
                            }
                        });
                    return (0, a.Z)((0, t.Z)({}, i), {
                        isLoading: i.isLoading || n.isLoading,
                        isError: i.isError || n.isError,
                        error: i.error || n.error
                    })
                };
            var ae = function(e) {
                    var o = new FormData;
                    return Object.keys(e).forEach((function(r) {
                        var i, n = e[r];
                        "boolean" !== typeof n ? n && ("object" === typeof(i = n) && Boolean(null === i || void 0 === i ? void 0 : i[0]) ? o.append(r, n[0]) : o.append(r, n)) : o.append(r, n.toString())
                    })), o
                },
                le = function() {
                    var e, o = (0, v.useRef)(null),
                        r = te(),
                        m = (0, l.Z)(v.useState(!1), 2),
                        x = m[0],
                        Z = m[1],
                        b = (0, f.Q3)();
                    (0, g.W)({
                        eventName: "customPageView",
                        dataLayer: b
                    });
                    var j, T = function() {
                        var e = (0, n.Z)((function(e) {
                            var i, n, l, d, c, u;
                            return (0, s.__generator)(this, (function(s) {
                                switch (s.label) {
                                    case 0:
                                        return o.current ? (Z(!0), window.scrollTo(0, 0), [4, o.current.executeAsync().then((function(e) {
                                            return Z(!1), e
                                        }))]) : [2];
                                    case 1:
                                        return i = s.sent(), c = (0, a.Z)((0, t.Z)({}, e), {
                                            phone: e.phone.replace(/\D/g, ""),
                                            phoneConfirmation: e.phoneConfirmation.replace(/\D/g, ""),
                                            groupId: null !== (n = e.groupId) && void 0 !== n ? n : "1",
                                            dateOfBirth: null !== (l = e.dateOfBirth) && void 0 !== l ? l : "1991-01-01",
                                            complement: null !== (d = e.complement) && void 0 !== d ? d : null
                                        }), u = ae(c), i && r.mutate({
                                            formData: u,
                                            captcha: i
                                        }), o.current.reset(), [2]
                                }
                            }))
                        }));
                        return function(o) {
                            return e.apply(this, arguments)
                        }
                    }();
                    return (0, i.jsxs)(c.Z, {
                        container: !0,
                        justifyContent: "center",
                        style: {
                            marginTop: "24px"
                        },
                        children: [(0, i.jsxs)(c.Z, {
                            item: !0,
                            xs: 10,
                            md: 8,
                            lg: 6,
                            xl: 5,
                            component: "section",
                            children: [(0, i.jsx)(u.Z, {
                                variant: "h1",
                                children: "Cadastro"
                            }), (0, i.jsx)(u.Z, {
                                variant: "h5",
                                component: "h2",
                                gutterBottom: !0,
                                children: "Inscreva-se para participar dos eventos e receber ofertas exclusivas."
                            }), (0, i.jsx)(h.Z, {
                                ref: o,
                                size: "invisible",
                                sitekey: null !== (j = "6LcTBYodAAAAAO5TGIMlGiPAlHyV6pkHNUexgtau") ? j : ""
                            }), (0, i.jsx)(K, {
                                isLoading: r.isLoading || x,
                                onSubmit: T
                            })]
                        }), r.isError && p().isAxiosError(r.error) ? (0, i.jsx)(d.Z, {
                            error: null === (e = r.error.response) || void 0 === e ? void 0 : e.data
                        }) : null]
                    })
                },
                se = r(19422),
                de = function() {
                    var e = "".concat("https://www.loopleiloes.com.br", "/cadastro");
                    return (0, i.jsxs)(i.Fragment, {
                        children: [(0, i.jsx)(se.default, {
                            pageTitle: "Cadastro | Loop Leil\xf5es",
                            pageDescription: "Crie sua conta no leil\xe3o de carros online e presencial Loop.",
                            pageUrl: e
                        }), (0, i.jsx)(le, {})]
                    })
                }
        },
        7292: function(e, o, r) {
            "use strict";
            r.d(o, {
                C: function() {
                    return l
                },
                q: function() {
                    return a
                }
            });
            var i = r(10253),
                n = r(12274),
                t = r(85394),
                a = function(e) {
                    return !e || (0, n.default)((0, t.default)(e, "dd/MM/yyyy", new Date))
                },
                l = function(e) {
                    if (!e) return !1;
                    var o = (0, i.Z)(e.split("/").map((function(e) {
                            return Number(e)
                        })), 3),
                        r = o[0],
                        n = o[1],
                        t = o[2],
                        a = new Date;
                    return new Date(t, n - 1, r) < a
                }
        },
        13040: function(e, o, r) {
            "use strict";
            r.d(o, {
                cT: function() {
                    return t
                },
                cy: function() {
                    return i
                },
                es: function() {
                    return n
                }
            });
            var i = function(e) {
                    if (!e) return !1;
                    var o = 0,
                        r = 0,
                        i = e.replace(/\D/g, "");
                    if ("00000000000" === i) return !1;
                    for (var n = 1; n <= 9; n++) o += parseInt(i.substring(n - 1, n), 10) * (11 - n);
                    if (10 !== (r = 10 * o % 11) && 11 !== r || (r = 0), r !== parseInt(i.substring(9, 10), 10)) return !1;
                    o = 0;
                    for (var t = 1; t <= 10; t++) o += parseInt(i.substring(t - 1, t), 10) * (12 - t);
                    return 10 !== (r = 10 * o % 11) && 11 !== r || (r = 0), r === parseInt(i.substring(10, 11), 10)
                },
                n = function(e) {
                    if (!e) return !1;
                    var o = e.replace(/\D/g, "");
                    if (14 !== o.length) return !1;
                    if (o.split("").every((function(e) {
                            return e === o[0]
                        }))) return !1;
                    for (var r = o.length - 2, i = o.substring(0, r), n = o.substring(r), t = 0, a = r - 7, l = r; l >= 1; l--) t += parseInt(i[r - l], 10) * a--, a < 2 && (a = 9);
                    var s = t % 11 < 2 ? 0 : 11 - t % 11;
                    if (s.toString() !== n[0]) return !1;
                    r += 1, i = o.substring(0, r), t = 0, a = r - 7;
                    for (var d = r; d >= 1; d--) t += parseInt(i.charAt(r - d), 10) * a--, a < 2 && (a = 9);
                    return (s = t % 11 < 2 ? 0 : 11 - t % 11) === parseInt(n.charAt(1), 10)
                },
                t = function(e) {
                    if (!e) return !1;
                    if (e.includes("_")) return !1;
                    var o = parseInt(e.replace("-", ""), 10);
                    return o >= 1e6 && o <= 99999999
                }
        },
        20387: function(e, o, r) {
            "use strict";
            r.d(o, {
                g: function() {
                    return n
                }
            });
            var i = r(10253),
                n = function(e) {
                    return function(o) {
                        var r = (0, i.Z)(o, 1)[0];
                        if (!r) return !0;
                        var n = r.type;
                        return e.includes(n)
                    }
                }
        }
    },
    function(e) {
        e.O(0, [2093, 1211, 7258, 5496, 5171, 2624, 4911, 9774, 2888, 179], (function() {
            return o = 46730, e(e.s = o);
            var o
        }));
        var o = e.O();
        _N_E = o
    }
]);