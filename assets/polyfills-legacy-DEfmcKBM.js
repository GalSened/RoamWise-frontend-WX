!(function () {
  'use strict';
  var t =
      'undefined' != typeof globalThis
        ? globalThis
        : 'undefined' != typeof window
          ? window
          : 'undefined' != typeof global
            ? global
            : 'undefined' != typeof self
              ? self
              : {},
    r = function (t) {
      return t && t.Math === Math && t;
    },
    e =
      r('object' == typeof globalThis && globalThis) ||
      r('object' == typeof window && window) ||
      r('object' == typeof self && self) ||
      r('object' == typeof t && t) ||
      r('object' == typeof t && t) ||
      (function () {
        return this;
      })() ||
      Function('return this')(),
    n = {},
    o = function (t) {
      try {
        return !!t();
      } catch (r) {
        return !0;
      }
    },
    i = !o(function () {
      return (
        7 !==
        Object.defineProperty({}, 1, {
          get: function () {
            return 7;
          },
        })[1]
      );
    }),
    a = !o(function () {
      var t = function () {}.bind();
      return 'function' != typeof t || t.hasOwnProperty('prototype');
    }),
    u = a,
    c = Function.prototype.call,
    f = u
      ? c.bind(c)
      : function () {
          return c.apply(c, arguments);
        },
    s = {},
    h = {}.propertyIsEnumerable,
    l = Object.getOwnPropertyDescriptor,
    p = l && !h.call({ 1: 2 }, 1);
  s.f = p
    ? function (t) {
        var r = l(this, t);
        return !!r && r.enumerable;
      }
    : h;
  var d,
    y,
    v = function (t, r) {
      return { enumerable: !(1 & t), configurable: !(2 & t), writable: !(4 & t), value: r };
    },
    g = a,
    w = Function.prototype,
    m = w.call,
    b = g && w.bind.bind(m, m),
    S = g
      ? b
      : function (t) {
          return function () {
            return m.apply(t, arguments);
          };
        },
    O = S,
    E = O({}.toString),
    x = O(''.slice),
    A = function (t) {
      return x(E(t), 8, -1);
    },
    j = o,
    T = A,
    I = Object,
    k = S(''.split),
    P = j(function () {
      return !I('z').propertyIsEnumerable(0);
    })
      ? function (t) {
          return 'String' === T(t) ? k(t, '') : I(t);
        }
      : I,
    C = function (t) {
      return null == t;
    },
    R = C,
    U = TypeError,
    B = function (t) {
      if (R(t)) throw new U("Can't call method on " + t);
      return t;
    },
    M = P,
    D = B,
    F = function (t) {
      return M(D(t));
    },
    _ = 'object' == typeof document && document.all,
    L =
      void 0 === _ && void 0 !== _
        ? function (t) {
            return 'function' == typeof t || t === _;
          }
        : function (t) {
            return 'function' == typeof t;
          },
    z = L,
    N = function (t) {
      return 'object' == typeof t ? null !== t : z(t);
    },
    H = e,
    W = L,
    $ = function (t, r) {
      return arguments.length < 2 ? ((e = H[t]), W(e) ? e : void 0) : H[t] && H[t][r];
      var e;
    },
    q = S({}.isPrototypeOf),
    J = e.navigator,
    V = J && J.userAgent,
    Y = V ? String(V) : '',
    G = e,
    K = Y,
    X = G.process,
    Z = G.Deno,
    Q = (X && X.versions) || (Z && Z.version),
    tt = Q && Q.v8;
  (tt && (y = (d = tt.split('.'))[0] > 0 && d[0] < 4 ? 1 : +(d[0] + d[1])),
    !y &&
      K &&
      (!(d = K.match(/Edge\/(\d+)/)) || d[1] >= 74) &&
      (d = K.match(/Chrome\/(\d+)/)) &&
      (y = +d[1]));
  var rt = y,
    et = rt,
    nt = o,
    ot = e.String,
    it =
      !!Object.getOwnPropertySymbols &&
      !nt(function () {
        var t = Symbol('symbol detection');
        return !ot(t) || !(Object(t) instanceof Symbol) || (!Symbol.sham && et && et < 41);
      }),
    at = it && !Symbol.sham && 'symbol' == typeof Symbol.iterator,
    ut = $,
    ct = L,
    ft = q,
    st = Object,
    ht = at
      ? function (t) {
          return 'symbol' == typeof t;
        }
      : function (t) {
          var r = ut('Symbol');
          return ct(r) && ft(r.prototype, st(t));
        },
    lt = String,
    pt = function (t) {
      try {
        return lt(t);
      } catch (r) {
        return 'Object';
      }
    },
    dt = L,
    yt = pt,
    vt = TypeError,
    gt = function (t) {
      if (dt(t)) return t;
      throw new vt(yt(t) + ' is not a function');
    },
    wt = gt,
    mt = C,
    bt = function (t, r) {
      var e = t[r];
      return mt(e) ? void 0 : wt(e);
    },
    St = f,
    Ot = L,
    Et = N,
    xt = TypeError,
    At = { exports: {} },
    jt = e,
    Tt = Object.defineProperty,
    It = function (t, r) {
      try {
        Tt(jt, t, { value: r, configurable: !0, writable: !0 });
      } catch (e) {
        jt[t] = r;
      }
      return r;
    },
    kt = e,
    Pt = It,
    Ct = '__core-js_shared__',
    Rt = (At.exports = kt[Ct] || Pt(Ct, {}));
  (Rt.versions || (Rt.versions = [])).push({
    version: '3.45.1',
    mode: 'global',
    copyright: '© 2014-2025 Denis Pushkarev (zloirock.ru)',
    license: 'https://github.com/zloirock/core-js/blob/v3.45.1/LICENSE',
    source: 'https://github.com/zloirock/core-js',
  });
  var Ut = At.exports,
    Bt = Ut,
    Mt = function (t, r) {
      return Bt[t] || (Bt[t] = r || {});
    },
    Dt = B,
    Ft = Object,
    _t = function (t) {
      return Ft(Dt(t));
    },
    Lt = _t,
    zt = S({}.hasOwnProperty),
    Nt =
      Object.hasOwn ||
      function (t, r) {
        return zt(Lt(t), r);
      },
    Ht = S,
    Wt = 0,
    $t = Math.random(),
    qt = Ht((1.1).toString),
    Jt = function (t) {
      return 'Symbol(' + (void 0 === t ? '' : t) + ')_' + qt(++Wt + $t, 36);
    },
    Vt = Mt,
    Yt = Nt,
    Gt = Jt,
    Kt = it,
    Xt = at,
    Zt = e.Symbol,
    Qt = Vt('wks'),
    tr = Xt ? Zt.for || Zt : (Zt && Zt.withoutSetter) || Gt,
    rr = function (t) {
      return (Yt(Qt, t) || (Qt[t] = Kt && Yt(Zt, t) ? Zt[t] : tr('Symbol.' + t)), Qt[t]);
    },
    er = f,
    nr = N,
    or = ht,
    ir = bt,
    ar = function (t, r) {
      var e, n;
      if ('string' === r && Ot((e = t.toString)) && !Et((n = St(e, t)))) return n;
      if (Ot((e = t.valueOf)) && !Et((n = St(e, t)))) return n;
      if ('string' !== r && Ot((e = t.toString)) && !Et((n = St(e, t)))) return n;
      throw new xt("Can't convert object to primitive value");
    },
    ur = TypeError,
    cr = rr('toPrimitive'),
    fr = function (t, r) {
      if (!nr(t) || or(t)) return t;
      var e,
        n = ir(t, cr);
      if (n) {
        if ((void 0 === r && (r = 'default'), (e = er(n, t, r)), !nr(e) || or(e))) return e;
        throw new ur("Can't convert object to primitive value");
      }
      return (void 0 === r && (r = 'number'), ar(t, r));
    },
    sr = fr,
    hr = ht,
    lr = function (t) {
      var r = sr(t, 'string');
      return hr(r) ? r : r + '';
    },
    pr = N,
    dr = e.document,
    yr = pr(dr) && pr(dr.createElement),
    vr = function (t) {
      return yr ? dr.createElement(t) : {};
    },
    gr = vr,
    wr =
      !i &&
      !o(function () {
        return (
          7 !==
          Object.defineProperty(gr('div'), 'a', {
            get: function () {
              return 7;
            },
          }).a
        );
      }),
    mr = i,
    br = f,
    Sr = s,
    Or = v,
    Er = F,
    xr = lr,
    Ar = Nt,
    jr = wr,
    Tr = Object.getOwnPropertyDescriptor;
  n.f = mr
    ? Tr
    : function (t, r) {
        if (((t = Er(t)), (r = xr(r)), jr))
          try {
            return Tr(t, r);
          } catch (e) {}
        if (Ar(t, r)) return Or(!br(Sr.f, t, r), t[r]);
      };
  var Ir = {},
    kr =
      i &&
      o(function () {
        return (
          42 !==
          Object.defineProperty(function () {}, 'prototype', { value: 42, writable: !1 }).prototype
        );
      }),
    Pr = N,
    Cr = String,
    Rr = TypeError,
    Ur = function (t) {
      if (Pr(t)) return t;
      throw new Rr(Cr(t) + ' is not an object');
    },
    Br = i,
    Mr = wr,
    Dr = kr,
    Fr = Ur,
    _r = lr,
    Lr = TypeError,
    zr = Object.defineProperty,
    Nr = Object.getOwnPropertyDescriptor,
    Hr = 'enumerable',
    Wr = 'configurable',
    $r = 'writable';
  Ir.f = Br
    ? Dr
      ? function (t, r, e) {
          if (
            (Fr(t),
            (r = _r(r)),
            Fr(e),
            'function' == typeof t && 'prototype' === r && 'value' in e && $r in e && !e[$r])
          ) {
            var n = Nr(t, r);
            n &&
              n[$r] &&
              ((t[r] = e.value),
              (e = {
                configurable: Wr in e ? e[Wr] : n[Wr],
                enumerable: Hr in e ? e[Hr] : n[Hr],
                writable: !1,
              }));
          }
          return zr(t, r, e);
        }
      : zr
    : function (t, r, e) {
        if ((Fr(t), (r = _r(r)), Fr(e), Mr))
          try {
            return zr(t, r, e);
          } catch (n) {}
        if ('get' in e || 'set' in e) throw new Lr('Accessors not supported');
        return ('value' in e && (t[r] = e.value), t);
      };
  var qr = Ir,
    Jr = v,
    Vr = i
      ? function (t, r, e) {
          return qr.f(t, r, Jr(1, e));
        }
      : function (t, r, e) {
          return ((t[r] = e), t);
        },
    Yr = { exports: {} },
    Gr = i,
    Kr = Nt,
    Xr = Function.prototype,
    Zr = Gr && Object.getOwnPropertyDescriptor,
    Qr = { CONFIGURABLE: Kr(Xr, 'name') && (!Gr || (Gr && Zr(Xr, 'name').configurable)) },
    te = L,
    re = Ut,
    ee = S(Function.toString);
  te(re.inspectSource) ||
    (re.inspectSource = function (t) {
      return ee(t);
    });
  var ne,
    oe,
    ie,
    ae = re.inspectSource,
    ue = L,
    ce = e.WeakMap,
    fe = ue(ce) && /native code/.test(String(ce)),
    se = Jt,
    he = Mt('keys'),
    le = function (t) {
      return he[t] || (he[t] = se(t));
    },
    pe = {},
    de = fe,
    ye = e,
    ve = N,
    ge = Vr,
    we = Nt,
    me = Ut,
    be = le,
    Se = pe,
    Oe = 'Object already initialized',
    Ee = ye.TypeError,
    xe = ye.WeakMap;
  if (de || me.state) {
    var Ae = me.state || (me.state = new xe());
    ((Ae.get = Ae.get),
      (Ae.has = Ae.has),
      (Ae.set = Ae.set),
      (ne = function (t, r) {
        if (Ae.has(t)) throw new Ee(Oe);
        return ((r.facade = t), Ae.set(t, r), r);
      }),
      (oe = function (t) {
        return Ae.get(t) || {};
      }),
      (ie = function (t) {
        return Ae.has(t);
      }));
  } else {
    var je = be('state');
    ((Se[je] = !0),
      (ne = function (t, r) {
        if (we(t, je)) throw new Ee(Oe);
        return ((r.facade = t), ge(t, je, r), r);
      }),
      (oe = function (t) {
        return we(t, je) ? t[je] : {};
      }),
      (ie = function (t) {
        return we(t, je);
      }));
  }
  var Te = {
      set: ne,
      get: oe,
      has: ie,
      enforce: function (t) {
        return ie(t) ? oe(t) : ne(t, {});
      },
      getterFor: function (t) {
        return function (r) {
          var e;
          if (!ve(r) || (e = oe(r)).type !== t)
            throw new Ee('Incompatible receiver, ' + t + ' required');
          return e;
        };
      },
    },
    Ie = S,
    ke = o,
    Pe = L,
    Ce = Nt,
    Re = i,
    Ue = Qr.CONFIGURABLE,
    Be = ae,
    Me = Te.enforce,
    De = Te.get,
    Fe = String,
    _e = Object.defineProperty,
    Le = Ie(''.slice),
    ze = Ie(''.replace),
    Ne = Ie([].join),
    He =
      Re &&
      !ke(function () {
        return 8 !== _e(function () {}, 'length', { value: 8 }).length;
      }),
    We = String(String).split('String'),
    $e = (Yr.exports = function (t, r, e) {
      ('Symbol(' === Le(Fe(r), 0, 7) && (r = '[' + ze(Fe(r), /^Symbol\(([^)]*)\).*$/, '$1') + ']'),
        e && e.getter && (r = 'get ' + r),
        e && e.setter && (r = 'set ' + r),
        (!Ce(t, 'name') || (Ue && t.name !== r)) &&
          (Re ? _e(t, 'name', { value: r, configurable: !0 }) : (t.name = r)),
        He && e && Ce(e, 'arity') && t.length !== e.arity && _e(t, 'length', { value: e.arity }));
      try {
        e && Ce(e, 'constructor') && e.constructor
          ? Re && _e(t, 'prototype', { writable: !1 })
          : t.prototype && (t.prototype = void 0);
      } catch (o) {}
      var n = Me(t);
      return (Ce(n, 'source') || (n.source = Ne(We, 'string' == typeof r ? r : '')), t);
    });
  Function.prototype.toString = $e(function () {
    return (Pe(this) && De(this).source) || Be(this);
  }, 'toString');
  var qe,
    Je = Yr.exports,
    Ve = L,
    Ye = Ir,
    Ge = Je,
    Ke = It,
    Xe = function (t, r, e, n) {
      n || (n = {});
      var o = n.enumerable,
        i = void 0 !== n.name ? n.name : r;
      if ((Ve(e) && Ge(e, i, n), n.global)) o ? (t[r] = e) : Ke(r, e);
      else {
        try {
          n.unsafe ? t[r] && (o = !0) : delete t[r];
        } catch (a) {}
        o
          ? (t[r] = e)
          : Ye.f(t, r, {
              value: e,
              enumerable: !1,
              configurable: !n.nonConfigurable,
              writable: !n.nonWritable,
            });
      }
      return t;
    },
    Ze = {},
    Qe = Math.ceil,
    tn = Math.floor,
    rn =
      Math.trunc ||
      function (t) {
        var r = +t;
        return (r > 0 ? tn : Qe)(r);
      },
    en = function (t) {
      var r = +t;
      return r != r || 0 === r ? 0 : rn(r);
    },
    nn = en,
    on = Math.max,
    an = Math.min,
    un = en,
    cn = Math.min,
    fn = function (t) {
      var r = un(t);
      return r > 0 ? cn(r, 9007199254740991) : 0;
    },
    sn = fn,
    hn = function (t) {
      return sn(t.length);
    },
    ln = F,
    pn = function (t, r) {
      var e = nn(t);
      return e < 0 ? on(e + r, 0) : an(e, r);
    },
    dn = hn,
    yn = {
      indexOf:
        ((qe = !1),
        function (t, r, e) {
          var n = ln(t),
            o = dn(n);
          if (0 === o) return !qe && -1;
          var i,
            a = pn(e, o);
          if (qe && r != r) {
            for (; o > a; ) if ((i = n[a++]) != i) return !0;
          } else for (; o > a; a++) if ((qe || a in n) && n[a] === r) return qe || a || 0;
          return !qe && -1;
        }),
    },
    vn = Nt,
    gn = F,
    wn = yn.indexOf,
    mn = pe,
    bn = S([].push),
    Sn = function (t, r) {
      var e,
        n = gn(t),
        o = 0,
        i = [];
      for (e in n) !vn(mn, e) && vn(n, e) && bn(i, e);
      for (; r.length > o; ) vn(n, (e = r[o++])) && (~wn(i, e) || bn(i, e));
      return i;
    },
    On = [
      'constructor',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf',
    ],
    En = Sn,
    xn = On.concat('length', 'prototype');
  Ze.f =
    Object.getOwnPropertyNames ||
    function (t) {
      return En(t, xn);
    };
  var An = {};
  An.f = Object.getOwnPropertySymbols;
  var jn = $,
    Tn = Ze,
    In = An,
    kn = Ur,
    Pn = S([].concat),
    Cn =
      jn('Reflect', 'ownKeys') ||
      function (t) {
        var r = Tn.f(kn(t)),
          e = In.f;
        return e ? Pn(r, e(t)) : r;
      },
    Rn = Nt,
    Un = Cn,
    Bn = n,
    Mn = Ir,
    Dn = o,
    Fn = L,
    _n = /#|\.prototype\./,
    Ln = function (t, r) {
      var e = Nn[zn(t)];
      return e === Wn || (e !== Hn && (Fn(r) ? Dn(r) : !!r));
    },
    zn = (Ln.normalize = function (t) {
      return String(t).replace(_n, '.').toLowerCase();
    }),
    Nn = (Ln.data = {}),
    Hn = (Ln.NATIVE = 'N'),
    Wn = (Ln.POLYFILL = 'P'),
    $n = Ln,
    qn = e,
    Jn = n.f,
    Vn = Vr,
    Yn = Xe,
    Gn = It,
    Kn = function (t, r, e) {
      for (var n = Un(r), o = Mn.f, i = Bn.f, a = 0; a < n.length; a++) {
        var u = n[a];
        Rn(t, u) || (e && Rn(e, u)) || o(t, u, i(r, u));
      }
    },
    Xn = $n,
    Zn = function (t, r) {
      var e,
        n,
        o,
        i,
        a,
        u = t.target,
        c = t.global,
        f = t.stat;
      if ((e = c ? qn : f ? qn[u] || Gn(u, {}) : qn[u] && qn[u].prototype))
        for (n in r) {
          if (
            ((i = r[n]),
            (o = t.dontCallGetSet ? (a = Jn(e, n)) && a.value : e[n]),
            !Xn(c ? n : u + (f ? '.' : '#') + n, t.forced) && void 0 !== o)
          ) {
            if (typeof i == typeof o) continue;
            Kn(i, o);
          }
          ((t.sham || (o && o.sham)) && Vn(i, 'sham', !0), Yn(e, n, i, t));
        }
    },
    Qn = A,
    to =
      Array.isArray ||
      function (t) {
        return 'Array' === Qn(t);
      },
    ro = i,
    eo = to,
    no = TypeError,
    oo = Object.getOwnPropertyDescriptor,
    io =
      ro &&
      !(function () {
        if (void 0 !== this) return !0;
        try {
          Object.defineProperty([], 'length', { writable: !1 }).length = 1;
        } catch (t) {
          return t instanceof TypeError;
        }
      })(),
    ao = TypeError,
    uo = _t,
    co = hn,
    fo = io
      ? function (t, r) {
          if (eo(t) && !oo(t, 'length').writable) throw new no('Cannot set read only .length');
          return (t.length = r);
        }
      : function (t, r) {
          return (t.length = r);
        },
    so = function (t) {
      if (t > 9007199254740991) throw ao('Maximum allowed index exceeded');
      return t;
    };
  Zn(
    {
      target: 'Array',
      proto: !0,
      arity: 1,
      forced:
        o(function () {
          return 4294967297 !== [].push.call({ length: 4294967296 }, 1);
        }) ||
        !(function () {
          try {
            Object.defineProperty([], 'length', { writable: !1 }).push();
          } catch (t) {
            return t instanceof TypeError;
          }
        })(),
    },
    {
      push: function (t) {
        var r = uo(this),
          e = co(r),
          n = arguments.length;
        so(e + n);
        for (var o = 0; o < n; o++) ((r[e] = arguments[o]), e++);
        return (fo(r, e), e);
      },
    }
  );
  var ho = Je,
    lo = Ir,
    po = function (t, r, e) {
      return (
        e.get && ho(e.get, r, { getter: !0 }),
        e.set && ho(e.set, r, { setter: !0 }),
        lo.f(t, r, e)
      );
    },
    yo = 'undefined' != typeof ArrayBuffer && 'undefined' != typeof DataView,
    vo = S,
    go = gt,
    wo = function (t, r, e) {
      try {
        return vo(go(Object.getOwnPropertyDescriptor(t, r)[e]));
      } catch (n) {}
    },
    mo = e,
    bo = wo,
    So = A,
    Oo = mo.ArrayBuffer,
    Eo = mo.TypeError,
    xo =
      (Oo && bo(Oo.prototype, 'byteLength', 'get')) ||
      function (t) {
        if ('ArrayBuffer' !== So(t)) throw new Eo('ArrayBuffer expected');
        return t.byteLength;
      },
    Ao = yo,
    jo = xo,
    To = e.DataView,
    Io = function (t) {
      if (!Ao || 0 !== jo(t)) return !1;
      try {
        return (new To(t), !1);
      } catch (r) {
        return !0;
      }
    },
    ko = i,
    Po = po,
    Co = Io,
    Ro = ArrayBuffer.prototype;
  ko &&
    !('detached' in Ro) &&
    Po(Ro, 'detached', {
      configurable: !0,
      get: function () {
        return Co(this);
      },
    });
  var Uo,
    Bo,
    Mo,
    Do,
    Fo = en,
    _o = fn,
    Lo = RangeError,
    zo = Io,
    No = TypeError,
    Ho = function (t) {
      if (zo(t)) throw new No('ArrayBuffer is detached');
      return t;
    },
    Wo = e,
    $o = Y,
    qo = A,
    Jo = function (t) {
      return $o.slice(0, t.length) === t;
    },
    Vo = Jo('Bun/')
      ? 'BUN'
      : Jo('Cloudflare-Workers')
        ? 'CLOUDFLARE'
        : Jo('Deno/')
          ? 'DENO'
          : Jo('Node.js/')
            ? 'NODE'
            : Wo.Bun && 'string' == typeof Bun.version
              ? 'BUN'
              : Wo.Deno && 'object' == typeof Deno.version
                ? 'DENO'
                : 'process' === qo(Wo.process)
                  ? 'NODE'
                  : Wo.window && Wo.document
                    ? 'BROWSER'
                    : 'REST',
    Yo = e,
    Go = 'NODE' === Vo,
    Ko = o,
    Xo = rt,
    Zo = Vo,
    Qo = e.structuredClone,
    ti =
      !!Qo &&
      !Ko(function () {
        if (
          ('DENO' === Zo && Xo > 92) ||
          ('NODE' === Zo && Xo > 94) ||
          ('BROWSER' === Zo && Xo > 97)
        )
          return !1;
        var t = new ArrayBuffer(8),
          r = Qo(t, { transfer: [t] });
        return 0 !== t.byteLength || 8 !== r.byteLength;
      }),
    ri = e,
    ei = function (t) {
      if (Go) {
        try {
          return Yo.process.getBuiltinModule(t);
        } catch (r) {}
        try {
          return Function('return require("' + t + '")')();
        } catch (r) {}
      }
    },
    ni = ti,
    oi = ri.structuredClone,
    ii = ri.ArrayBuffer,
    ai = ri.MessageChannel,
    ui = !1;
  if (ni)
    ui = function (t) {
      oi(t, { transfer: [t] });
    };
  else if (ii)
    try {
      (ai || ((Uo = ei('worker_threads')) && (ai = Uo.MessageChannel)),
        ai &&
          ((Bo = new ai()),
          (Mo = new ii(2)),
          (Do = function (t) {
            Bo.port1.postMessage(null, [t]);
          }),
          2 === Mo.byteLength && (Do(Mo), 0 === Mo.byteLength && (ui = Do))));
    } catch (Oy) {}
  var ci = e,
    fi = S,
    si = wo,
    hi = function (t) {
      if (void 0 === t) return 0;
      var r = Fo(t),
        e = _o(r);
      if (r !== e) throw new Lo('Wrong length or index');
      return e;
    },
    li = Ho,
    pi = xo,
    di = ui,
    yi = ti,
    vi = ci.structuredClone,
    gi = ci.ArrayBuffer,
    wi = ci.DataView,
    mi = Math.min,
    bi = gi.prototype,
    Si = wi.prototype,
    Oi = fi(bi.slice),
    Ei = si(bi, 'resizable', 'get'),
    xi = si(bi, 'maxByteLength', 'get'),
    Ai = fi(Si.getInt8),
    ji = fi(Si.setInt8),
    Ti =
      (yi || di) &&
      function (t, r, e) {
        var n,
          o = pi(t),
          i = void 0 === r ? o : hi(r),
          a = !Ei || !Ei(t);
        if ((li(t), yi && ((t = vi(t, { transfer: [t] })), o === i && (e || a)))) return t;
        if (o >= i && (!e || a)) n = Oi(t, 0, i);
        else {
          var u = e && !a && xi ? { maxByteLength: xi(t) } : void 0;
          n = new gi(i, u);
          for (var c = new wi(t), f = new wi(n), s = mi(i, o), h = 0; h < s; h++)
            ji(f, h, Ai(c, h));
        }
        return (yi || di(t), n);
      },
    Ii = Ti;
  Ii &&
    Zn(
      { target: 'ArrayBuffer', proto: !0 },
      {
        transfer: function () {
          return Ii(this, arguments.length ? arguments[0] : void 0, !0);
        },
      }
    );
  var ki = Ti;
  ki &&
    Zn(
      { target: 'ArrayBuffer', proto: !0 },
      {
        transferToFixedLength: function () {
          return ki(this, arguments.length ? arguments[0] : void 0, !1);
        },
      }
    );
  var Pi = q,
    Ci = TypeError,
    Ri = !o(function () {
      function t() {}
      return ((t.prototype.constructor = null), Object.getPrototypeOf(new t()) !== t.prototype);
    }),
    Ui = Nt,
    Bi = L,
    Mi = _t,
    Di = Ri,
    Fi = le('IE_PROTO'),
    _i = Object,
    Li = _i.prototype,
    zi = Di
      ? _i.getPrototypeOf
      : function (t) {
          var r = Mi(t);
          if (Ui(r, Fi)) return r[Fi];
          var e = r.constructor;
          return Bi(e) && r instanceof e ? e.prototype : r instanceof _i ? Li : null;
        },
    Ni = i,
    Hi = Ir,
    Wi = v,
    $i = function (t, r, e) {
      Ni ? Hi.f(t, r, Wi(0, e)) : (t[r] = e);
    },
    qi = {},
    Ji = Sn,
    Vi = On,
    Yi =
      Object.keys ||
      function (t) {
        return Ji(t, Vi);
      },
    Gi = i,
    Ki = kr,
    Xi = Ir,
    Zi = Ur,
    Qi = F,
    ta = Yi;
  qi.f =
    Gi && !Ki
      ? Object.defineProperties
      : function (t, r) {
          Zi(t);
          for (var e, n = Qi(r), o = ta(r), i = o.length, a = 0; i > a; )
            Xi.f(t, (e = o[a++]), n[e]);
          return t;
        };
  var ra,
    ea = $('document', 'documentElement'),
    na = Ur,
    oa = qi,
    ia = On,
    aa = pe,
    ua = ea,
    ca = vr,
    fa = 'prototype',
    sa = 'script',
    ha = le('IE_PROTO'),
    la = function () {},
    pa = function (t) {
      return '<' + sa + '>' + t + '</' + sa + '>';
    },
    da = function (t) {
      (t.write(pa('')), t.close());
      var r = t.parentWindow.Object;
      return ((t = null), r);
    },
    ya = function () {
      try {
        ra = new ActiveXObject('htmlfile');
      } catch (Oy) {}
      var t, r, e;
      ya =
        'undefined' != typeof document
          ? document.domain && ra
            ? da(ra)
            : ((r = ca('iframe')),
              (e = 'java' + sa + ':'),
              (r.style.display = 'none'),
              ua.appendChild(r),
              (r.src = String(e)),
              (t = r.contentWindow.document).open(),
              t.write(pa('document.F=Object')),
              t.close(),
              t.F)
          : da(ra);
      for (var n = ia.length; n--; ) delete ya[fa][ia[n]];
      return ya();
    };
  aa[ha] = !0;
  var va,
    ga,
    wa,
    ma =
      Object.create ||
      function (t, r) {
        var e;
        return (
          null !== t
            ? ((la[fa] = na(t)), (e = new la()), (la[fa] = null), (e[ha] = t))
            : (e = ya()),
          void 0 === r ? e : oa.f(e, r)
        );
      },
    ba = o,
    Sa = L,
    Oa = N,
    Ea = zi,
    xa = Xe,
    Aa = rr('iterator');
  [].keys && 'next' in (wa = [].keys()) && (ga = Ea(Ea(wa))) !== Object.prototype && (va = ga);
  var ja =
    !Oa(va) ||
    ba(function () {
      var t = {};
      return va[Aa].call(t) !== t;
    });
  (ja && (va = {}),
    Sa(va[Aa]) ||
      xa(va, Aa, function () {
        return this;
      }));
  var Ta = { IteratorPrototype: va },
    Ia = Zn,
    ka = e,
    Pa = function (t, r) {
      if (Pi(r, t)) return t;
      throw new Ci('Incorrect invocation');
    },
    Ca = Ur,
    Ra = L,
    Ua = zi,
    Ba = po,
    Ma = $i,
    Da = o,
    Fa = Nt,
    _a = Ta.IteratorPrototype,
    La = i,
    za = 'constructor',
    Na = 'Iterator',
    Ha = rr('toStringTag'),
    Wa = TypeError,
    $a = ka[Na],
    qa =
      !Ra($a) ||
      $a.prototype !== _a ||
      !Da(function () {
        $a({});
      }),
    Ja = function () {
      if ((Pa(this, _a), Ua(this) === _a))
        throw new Wa('Abstract class Iterator not directly constructable');
    },
    Va = function (t, r) {
      La
        ? Ba(_a, t, {
            configurable: !0,
            get: function () {
              return r;
            },
            set: function (r) {
              if ((Ca(this), this === _a)) throw new Wa("You can't redefine this property");
              Fa(this, t) ? (this[t] = r) : Ma(this, t, r);
            },
          })
        : (_a[t] = r);
    };
  (Fa(_a, Ha) || Va(Ha, Na),
    (!qa && Fa(_a, za) && _a[za] !== Object) || Va(za, Ja),
    (Ja.prototype = _a),
    Ia({ global: !0, constructor: !0, forced: qa }, { Iterator: Ja }));
  var Ya = function (t) {
      return { iterator: t, next: t.next, done: !1 };
    },
    Ga = Xe,
    Ka = f,
    Xa = Ur,
    Za = bt,
    Qa = function (t, r, e) {
      var n, o;
      Xa(t);
      try {
        if (!(n = Za(t, 'return'))) {
          if ('throw' === r) throw e;
          return e;
        }
        n = Ka(n, t);
      } catch (Oy) {
        ((o = !0), (n = Oy));
      }
      if ('throw' === r) throw e;
      if (o) throw n;
      return (Xa(n), e);
    },
    tu = Qa,
    ru = f,
    eu = ma,
    nu = Vr,
    ou = function (t, r, e) {
      for (var n in r) Ga(t, n, r[n], e);
      return t;
    },
    iu = Te,
    au = bt,
    uu = Ta.IteratorPrototype,
    cu = function (t, r) {
      return { value: t, done: r };
    },
    fu = Qa,
    su = function (t, r, e) {
      for (var n = t.length - 1; n >= 0; n--)
        if (void 0 !== t[n])
          try {
            e = tu(t[n].iterator, r, e);
          } catch (Oy) {
            ((r = 'throw'), (e = Oy));
          }
      if ('throw' === r) throw e;
      return e;
    },
    hu = rr('toStringTag'),
    lu = 'IteratorHelper',
    pu = 'WrapForValidIterator',
    du = 'normal',
    yu = 'throw',
    vu = iu.set,
    gu = function (t) {
      var r = iu.getterFor(t ? pu : lu);
      return ou(eu(uu), {
        next: function () {
          var e = r(this);
          if (t) return e.nextHandler();
          if (e.done) return cu(void 0, !0);
          try {
            var n = e.nextHandler();
            return e.returnHandlerResult ? n : cu(n, e.done);
          } catch (Oy) {
            throw ((e.done = !0), Oy);
          }
        },
        return: function () {
          var e = r(this),
            n = e.iterator;
          if (((e.done = !0), t)) {
            var o = au(n, 'return');
            return o ? ru(o, n) : cu(void 0, !0);
          }
          if (e.inner)
            try {
              fu(e.inner.iterator, du);
            } catch (Oy) {
              return fu(n, yu, Oy);
            }
          if (e.openIters)
            try {
              su(e.openIters, du);
            } catch (Oy) {
              return fu(n, yu, Oy);
            }
          return (n && fu(n, du), cu(void 0, !0));
        },
      });
    },
    wu = gu(!0),
    mu = gu(!1);
  nu(mu, hu, 'Iterator Helper');
  var bu = function (t, r, e) {
      var n = function (n, o) {
        (o ? ((o.iterator = n.iterator), (o.next = n.next)) : (o = n),
          (o.type = r ? pu : lu),
          (o.returnHandlerResult = !!e),
          (o.nextHandler = t),
          (o.counter = 0),
          (o.done = !1),
          vu(this, o));
      };
      return ((n.prototype = r ? wu : mu), n);
    },
    Su = Ur,
    Ou = Qa,
    Eu = function (t, r, e, n) {
      try {
        return n ? r(Su(e)[0], e[1]) : r(e);
      } catch (Oy) {
        Ou(t, 'throw', Oy);
      }
    },
    xu = function (t, r) {
      var e = 'function' == typeof Iterator && Iterator.prototype[t];
      if (e)
        try {
          e.call({ next: null }, r).next();
        } catch (Oy) {
          return !0;
        }
    },
    Au = e,
    ju = function (t, r) {
      var e = Au.Iterator,
        n = e && e.prototype,
        o = n && n[t],
        i = !1;
      if (o)
        try {
          o.call(
            {
              next: function () {
                return { done: !0 };
              },
              return: function () {
                i = !0;
              },
            },
            -1
          );
        } catch (Oy) {
          Oy instanceof r || (i = !1);
        }
      if (!i) return o;
    },
    Tu = Zn,
    Iu = f,
    ku = gt,
    Pu = Ur,
    Cu = Ya,
    Ru = bu,
    Uu = Eu,
    Bu = Qa,
    Mu = ju,
    Du = !xu('filter', function () {}),
    Fu = !Du && Mu('filter', TypeError),
    _u = Du || Fu,
    Lu = Ru(function () {
      for (var t, r, e = this.iterator, n = this.predicate, o = this.next; ; ) {
        if (((t = Pu(Iu(o, e))), (this.done = !!t.done))) return;
        if (((r = t.value), Uu(e, n, [r, this.counter++], !0))) return r;
      }
    });
  Tu(
    { target: 'Iterator', proto: !0, real: !0, forced: _u },
    {
      filter: function (t) {
        Pu(this);
        try {
          ku(t);
        } catch (Oy) {
          Bu(this, 'throw', Oy);
        }
        return Fu ? Iu(Fu, this, t) : new Lu(Cu(this), { predicate: t });
      },
    }
  );
  var zu = Zn,
    Nu = f,
    Hu = gt,
    Wu = Ur,
    $u = Ya,
    qu = bu,
    Ju = Eu,
    Vu = Qa,
    Yu = ju,
    Gu = !xu('map', function () {}),
    Ku = !Gu && Yu('map', TypeError),
    Xu = Gu || Ku,
    Zu = qu(function () {
      var t = this.iterator,
        r = Wu(Nu(this.next, t));
      if (!(this.done = !!r.done)) return Ju(t, this.mapper, [r.value, this.counter++], !0);
    });
  zu(
    { target: 'Iterator', proto: !0, real: !0, forced: Xu },
    {
      map: function (t) {
        Wu(this);
        try {
          Hu(t);
        } catch (Oy) {
          Vu(this, 'throw', Oy);
        }
        return Ku ? Nu(Ku, this, t) : new Zu($u(this), { mapper: t });
      },
    }
  );
  var Qu = A,
    tc = S,
    rc = function (t) {
      if ('Function' === Qu(t)) return tc(t);
    },
    ec = gt,
    nc = a,
    oc = rc(rc.bind),
    ic = {},
    ac = ic,
    uc = rr('iterator'),
    cc = Array.prototype,
    fc = {};
  fc[rr('toStringTag')] = 'z';
  var sc = '[object z]' === String(fc),
    hc = L,
    lc = A,
    pc = rr('toStringTag'),
    dc = Object,
    yc =
      'Arguments' ===
      lc(
        (function () {
          return arguments;
        })()
      ),
    vc = sc
      ? lc
      : function (t) {
          var r, e, n;
          return void 0 === t
            ? 'Undefined'
            : null === t
              ? 'Null'
              : 'string' ==
                  typeof (e = (function (t, r) {
                    try {
                      return t[r];
                    } catch (Oy) {}
                  })((r = dc(t)), pc))
                ? e
                : yc
                  ? lc(r)
                  : 'Object' === (n = lc(r)) && hc(r.callee)
                    ? 'Arguments'
                    : n;
        },
    gc = vc,
    wc = bt,
    mc = C,
    bc = ic,
    Sc = rr('iterator'),
    Oc = function (t) {
      if (!mc(t)) return wc(t, Sc) || wc(t, '@@iterator') || bc[gc(t)];
    },
    Ec = f,
    xc = gt,
    Ac = Ur,
    jc = pt,
    Tc = Oc,
    Ic = TypeError,
    kc = function (t, r) {
      return (
        ec(t),
        void 0 === r
          ? t
          : nc
            ? oc(t, r)
            : function () {
                return t.apply(r, arguments);
              }
      );
    },
    Pc = f,
    Cc = Ur,
    Rc = pt,
    Uc = function (t) {
      return void 0 !== t && (ac.Array === t || cc[uc] === t);
    },
    Bc = hn,
    Mc = q,
    Dc = function (t, r) {
      var e = arguments.length < 2 ? Tc(t) : r;
      if (xc(e)) return Ac(Ec(e, t));
      throw new Ic(jc(t) + ' is not iterable');
    },
    Fc = Oc,
    _c = Qa,
    Lc = TypeError,
    zc = function (t, r) {
      ((this.stopped = t), (this.result = r));
    },
    Nc = zc.prototype,
    Hc = function (t, r, e) {
      var n,
        o,
        i,
        a,
        u,
        c,
        f,
        s = e && e.that,
        h = !(!e || !e.AS_ENTRIES),
        l = !(!e || !e.IS_RECORD),
        p = !(!e || !e.IS_ITERATOR),
        d = !(!e || !e.INTERRUPTED),
        y = kc(r, s),
        v = function (t) {
          return (n && _c(n, 'normal'), new zc(!0, t));
        },
        g = function (t) {
          return h ? (Cc(t), d ? y(t[0], t[1], v) : y(t[0], t[1])) : d ? y(t, v) : y(t);
        };
      if (l) n = t.iterator;
      else if (p) n = t;
      else {
        if (!(o = Fc(t))) throw new Lc(Rc(t) + ' is not iterable');
        if (Uc(o)) {
          for (i = 0, a = Bc(t); a > i; i++) if ((u = g(t[i])) && Mc(Nc, u)) return u;
          return new zc(!1);
        }
        n = Dc(t, o);
      }
      for (c = l ? t.next : n.next; !(f = Pc(c, n)).done; ) {
        try {
          u = g(f.value);
        } catch (Oy) {
          _c(n, 'throw', Oy);
        }
        if ('object' == typeof u && u && Mc(Nc, u)) return u;
      }
      return new zc(!1);
    },
    Wc = Zn,
    $c = f,
    qc = Hc,
    Jc = gt,
    Vc = Ur,
    Yc = Ya,
    Gc = Qa,
    Kc = ju('some', TypeError);
  Wc(
    { target: 'Iterator', proto: !0, real: !0, forced: Kc },
    {
      some: function (t) {
        Vc(this);
        try {
          Jc(t);
        } catch (Oy) {
          Gc(this, 'throw', Oy);
        }
        if (Kc) return $c(Kc, this, t);
        var r = Yc(this),
          e = 0;
        return qc(
          r,
          function (r, n) {
            if (t(r, e++)) return n();
          },
          { IS_RECORD: !0, INTERRUPTED: !0 }
        ).stopped;
      },
    }
  );
  var Xc,
    Zc,
    Qc,
    tf = hn,
    rf = N,
    ef = function (t) {
      return rf(t) || null === t;
    },
    nf = String,
    of = TypeError,
    af = wo,
    uf = N,
    cf = B,
    ff = function (t) {
      if (ef(t)) return t;
      throw new of("Can't set " + nf(t) + ' as a prototype');
    },
    sf =
      Object.setPrototypeOf ||
      ('__proto__' in {}
        ? (function () {
            var t,
              r = !1,
              e = {};
            try {
              ((t = af(Object.prototype, '__proto__', 'set'))(e, []), (r = e instanceof Array));
            } catch (Oy) {}
            return function (e, n) {
              return (cf(e), ff(n), uf(e) ? (r ? t(e, n) : (e.__proto__ = n), e) : e);
            };
          })()
        : void 0),
    hf = yo,
    lf = i,
    pf = e,
    df = L,
    yf = N,
    vf = Nt,
    gf = vc,
    wf = Vr,
    mf = Xe,
    bf = po,
    Sf = zi,
    Of = sf,
    Ef = rr,
    xf = Jt,
    Af = Te.enforce,
    jf = Te.get,
    Tf = pf.Int8Array,
    If = Tf && Tf.prototype,
    kf = pf.Uint8ClampedArray,
    Pf = kf && kf.prototype,
    Cf = Tf && Sf(Tf),
    Rf = If && Sf(If),
    Uf = Object.prototype,
    Bf = pf.TypeError,
    Mf = Ef('toStringTag'),
    Df = xf('TYPED_ARRAY_TAG'),
    Ff = 'TypedArrayConstructor',
    _f = hf && !!Of && 'Opera' !== gf(pf.opera),
    Lf = {
      Int8Array: 1,
      Uint8Array: 1,
      Uint8ClampedArray: 1,
      Int16Array: 2,
      Uint16Array: 2,
      Int32Array: 4,
      Uint32Array: 4,
      Float32Array: 4,
      Float64Array: 8,
    },
    zf = { BigInt64Array: 8, BigUint64Array: 8 },
    Nf = function (t) {
      var r = Sf(t);
      if (yf(r)) {
        var e = jf(r);
        return e && vf(e, Ff) ? e[Ff] : Nf(r);
      }
    };
  for (Xc in Lf) (Qc = (Zc = pf[Xc]) && Zc.prototype) ? (Af(Qc)[Ff] = Zc) : (_f = !1);
  for (Xc in zf) (Qc = (Zc = pf[Xc]) && Zc.prototype) && (Af(Qc)[Ff] = Zc);
  if (
    (!_f || !df(Cf) || Cf === Function.prototype) &&
    ((Cf = function () {
      throw new Bf('Incorrect invocation');
    }),
    _f)
  )
    for (Xc in Lf) pf[Xc] && Of(pf[Xc], Cf);
  if ((!_f || !Rf || Rf === Uf) && ((Rf = Cf.prototype), _f))
    for (Xc in Lf) pf[Xc] && Of(pf[Xc].prototype, Rf);
  if ((_f && Sf(Pf) !== Rf && Of(Pf, Rf), lf && !vf(Rf, Mf)))
    for (Xc in (bf(Rf, Mf, {
      configurable: !0,
      get: function () {
        return yf(this) ? this[Df] : void 0;
      },
    }),
    Lf))
      pf[Xc] && wf(pf[Xc], Df, Xc);
  var Hf = {
      aTypedArray: function (t) {
        if (
          (function (t) {
            if (!yf(t)) return !1;
            var r = gf(t);
            return vf(Lf, r) || vf(zf, r);
          })(t)
        )
          return t;
        throw new Bf('Target is not a typed array');
      },
      exportTypedArrayMethod: function (t, r, e, n) {
        if (lf) {
          if (e)
            for (var o in Lf) {
              var i = pf[o];
              if (i && vf(i.prototype, t))
                try {
                  delete i.prototype[t];
                } catch (Oy) {
                  try {
                    i.prototype[t] = r;
                  } catch (a) {}
                }
            }
          (Rf[t] && !e) || mf(Rf, t, e ? r : (_f && If[t]) || r, n);
        }
      },
      getTypedArrayConstructor: Nf,
      TypedArrayPrototype: Rf,
    },
    Wf = function (t, r) {
      for (var e = tf(t), n = new r(e), o = 0; o < e; o++) n[o] = t[e - o - 1];
      return n;
    },
    $f = Hf.aTypedArray,
    qf = Hf.getTypedArrayConstructor;
  (0, Hf.exportTypedArrayMethod)('toReversed', function () {
    return Wf($f(this), qf(this));
  });
  var Jf = hn,
    Vf = gt,
    Yf = function (t, r, e) {
      for (var n = 0, o = arguments.length > 2 ? e : Jf(r), i = new t(o); o > n; ) i[n] = r[n++];
      return i;
    },
    Gf = Hf.aTypedArray,
    Kf = Hf.getTypedArrayConstructor,
    Xf = Hf.exportTypedArrayMethod,
    Zf = S(Hf.TypedArrayPrototype.sort);
  Xf('toSorted', function (t) {
    void 0 !== t && Vf(t);
    var r = Gf(this),
      e = Yf(Kf(r), r);
    return Zf(e, t);
  });
  var Qf = hn,
    ts = en,
    rs = RangeError,
    es = vc,
    ns = fr,
    os = TypeError,
    is = function (t, r, e, n) {
      var o = Qf(t),
        i = ts(e),
        a = i < 0 ? o + i : i;
      if (a >= o || a < 0) throw new rs('Incorrect index');
      for (var u = new r(o), c = 0; c < o; c++) u[c] = c === a ? n : t[c];
      return u;
    },
    as = function (t) {
      var r = es(t);
      return 'BigInt64Array' === r || 'BigUint64Array' === r;
    },
    us = en,
    cs = function (t) {
      var r = ns(t, 'number');
      if ('number' == typeof r) throw new os("Can't convert number to bigint");
      return BigInt(r);
    },
    fs = Hf.aTypedArray,
    ss = Hf.getTypedArrayConstructor,
    hs = Hf.exportTypedArrayMethod,
    ls = (function () {
      try {
        new Int8Array(1).with(2, {
          valueOf: function () {
            throw 8;
          },
        });
      } catch (Oy) {
        return 8 === Oy;
      }
    })(),
    ps =
      ls &&
      (function () {
        try {
          new Int8Array(1).with(-0.5, 1);
        } catch (Oy) {
          return !0;
        }
      })();
  hs(
    'with',
    {
      with: function (t, r) {
        var e = fs(this),
          n = us(t),
          o = as(e) ? cs(r) : +r;
        return is(e, ss(e), n, o);
      },
    }.with,
    !ls || ps
  );
  var ds = N,
    ys = String,
    vs = TypeError,
    gs = function (t) {
      if (void 0 === t || ds(t)) return t;
      throw new vs(ys(t) + ' is not an object or undefined');
    },
    ws = TypeError,
    ms = function (t) {
      if ('string' == typeof t) return t;
      throw new ws('Argument is not a string');
    },
    bs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    Ss = bs + '+/',
    Os = bs + '-_',
    Es = function (t) {
      for (var r = {}, e = 0; e < 64; e++) r[t.charAt(e)] = e;
      return r;
    },
    xs = { i2c: Ss, c2i: Es(Ss), i2cUrl: Os, c2iUrl: Es(Os) },
    As = TypeError,
    js = function (t) {
      var r = t && t.alphabet;
      if (void 0 === r || 'base64' === r || 'base64url' === r) return r || 'base64';
      throw new As('Incorrect `alphabet` option');
    },
    Ts = e,
    Is = S,
    ks = gs,
    Ps = ms,
    Cs = Nt,
    Rs = js,
    Us = Ho,
    Bs = xs.c2i,
    Ms = xs.c2iUrl,
    Ds = Ts.SyntaxError,
    Fs = Ts.TypeError,
    _s = Is(''.charAt),
    Ls = function (t, r) {
      for (var e = t.length; r < e; r++) {
        var n = _s(t, r);
        if (' ' !== n && '\t' !== n && '\n' !== n && '\f' !== n && '\r' !== n) break;
      }
      return r;
    },
    zs = function (t, r, e) {
      var n = t.length;
      n < 4 && (t += 2 === n ? 'AA' : 'A');
      var o = (r[_s(t, 0)] << 18) + (r[_s(t, 1)] << 12) + (r[_s(t, 2)] << 6) + r[_s(t, 3)],
        i = [(o >> 16) & 255, (o >> 8) & 255, 255 & o];
      if (2 === n) {
        if (e && 0 !== i[1]) throw new Ds('Extra bits');
        return [i[0]];
      }
      if (3 === n) {
        if (e && 0 !== i[2]) throw new Ds('Extra bits');
        return [i[0], i[1]];
      }
      return i;
    },
    Ns = function (t, r, e) {
      for (var n = r.length, o = 0; o < n; o++) t[e + o] = r[o];
      return e + n;
    },
    Hs = vc,
    Ws = TypeError,
    $s = function (t) {
      if ('Uint8Array' === Hs(t)) return t;
      throw new Ws('Argument is not an Uint8Array');
    },
    qs = Zn,
    Js = function (t, r, e, n) {
      (Ps(t), ks(r));
      var o = 'base64' === Rs(r) ? Bs : Ms,
        i = r ? r.lastChunkHandling : void 0;
      if (
        (void 0 === i && (i = 'loose'),
        'loose' !== i && 'strict' !== i && 'stop-before-partial' !== i)
      )
        throw new Fs('Incorrect `lastChunkHandling` option');
      e && Us(e.buffer);
      var a = t.length,
        u = e || [],
        c = 0,
        f = 0,
        s = '',
        h = 0;
      if (n)
        for (;;) {
          if ((h = Ls(t, h)) === a) {
            if (s.length > 0) {
              if ('stop-before-partial' === i) break;
              if ('loose' !== i) throw new Ds('Missing padding');
              if (1 === s.length)
                throw new Ds('Malformed padding: exactly one additional character');
              c = Ns(u, zs(s, o, !1), c);
            }
            f = a;
            break;
          }
          var l = _s(t, h);
          if ((++h, '=' === l)) {
            if (s.length < 2) throw new Ds('Padding is too early');
            if (((h = Ls(t, h)), 2 === s.length)) {
              if (h === a) {
                if ('stop-before-partial' === i) break;
                throw new Ds('Malformed padding: only one =');
              }
              '=' === _s(t, h) && (++h, (h = Ls(t, h)));
            }
            if (h < a) throw new Ds('Unexpected character after padding');
            ((c = Ns(u, zs(s, o, 'strict' === i), c)), (f = a));
            break;
          }
          if (!Cs(o, l)) throw new Ds('Unexpected character');
          var p = n - c;
          if ((1 === p && 2 === s.length) || (2 === p && 3 === s.length)) break;
          if (4 === (s += l).length && ((c = Ns(u, zs(s, o, !1), c)), (s = ''), (f = h), c === n))
            break;
        }
      return { bytes: u, read: f, written: c };
    },
    Vs = $s,
    Ys = e.Uint8Array,
    Gs =
      !Ys ||
      !Ys.prototype.setFromBase64 ||
      !(function () {
        var t = new Ys([255, 255, 255, 255, 255]);
        try {
          return void t.setFromBase64('', null);
        } catch (Oy) {}
        try {
          return void t.setFromBase64('a');
        } catch (Oy) {}
        try {
          t.setFromBase64('MjYyZg===');
        } catch (Oy) {
          return 50 === t[0] && 54 === t[1] && 50 === t[2] && 255 === t[3] && 255 === t[4];
        }
      })();
  Ys &&
    qs(
      { target: 'Uint8Array', proto: !0, forced: Gs },
      {
        setFromBase64: function (t) {
          Vs(this);
          var r = Js(t, arguments.length > 1 ? arguments[1] : void 0, this, this.length);
          return { read: r.read, written: r.written };
        },
      }
    );
  var Ks = e,
    Xs = S,
    Zs = Ks.Uint8Array,
    Qs = Ks.SyntaxError,
    th = Ks.parseInt,
    rh = Math.min,
    eh = /[^\da-f]/i,
    nh = Xs(eh.exec),
    oh = Xs(''.slice),
    ih = Zn,
    ah = ms,
    uh = $s,
    ch = Ho,
    fh = function (t, r) {
      var e = t.length;
      if (e % 2 != 0) throw new Qs('String should be an even number of characters');
      for (var n = r ? rh(r.length, e / 2) : e / 2, o = r || new Zs(n), i = 0, a = 0; a < n; ) {
        var u = oh(t, i, (i += 2));
        if (nh(eh, u)) throw new Qs('String should only contain hex characters');
        o[a++] = th(u, 16);
      }
      return { bytes: o, read: i };
    };
  e.Uint8Array &&
    ih(
      { target: 'Uint8Array', proto: !0 },
      {
        setFromHex: function (t) {
          (uh(this), ah(t), ch(this.buffer));
          var r = fh(t, this).read;
          return { read: r, written: r / 2 };
        },
      }
    );
  var sh = Zn,
    hh = e,
    lh = gs,
    ph = $s,
    dh = Ho,
    yh = js,
    vh = xs.i2c,
    gh = xs.i2cUrl,
    wh = S(''.charAt),
    mh = hh.Uint8Array,
    bh =
      !mh ||
      !mh.prototype.toBase64 ||
      !(function () {
        try {
          new mh().toBase64(null);
        } catch (Oy) {
          return !0;
        }
      })();
  mh &&
    sh(
      { target: 'Uint8Array', proto: !0, forced: bh },
      {
        toBase64: function () {
          var t = ph(this),
            r = arguments.length ? lh(arguments[0]) : void 0,
            e = 'base64' === yh(r) ? vh : gh,
            n = !!r && !!r.omitPadding;
          dh(this.buffer);
          for (
            var o,
              i = '',
              a = 0,
              u = t.length,
              c = function (t) {
                return wh(e, (o >> (6 * t)) & 63);
              };
            a + 2 < u;
            a += 3
          )
            ((o = (t[a] << 16) + (t[a + 1] << 8) + t[a + 2]), (i += c(3) + c(2) + c(1) + c(0)));
          return (
            a + 2 === u
              ? ((o = (t[a] << 16) + (t[a + 1] << 8)), (i += c(3) + c(2) + c(1) + (n ? '' : '=')))
              : a + 1 === u && ((o = t[a] << 16), (i += c(3) + c(2) + (n ? '' : '=='))),
            i
          );
        },
      }
    );
  var Sh = Zn,
    Oh = e,
    Eh = $s,
    xh = Ho,
    Ah = S((1.1).toString),
    jh = Oh.Uint8Array,
    Th =
      !jh ||
      !jh.prototype.toHex ||
      !(function () {
        try {
          return 'ffffffffffffffff' === new jh([255, 255, 255, 255, 255, 255, 255, 255]).toHex();
        } catch (Oy) {
          return !1;
        }
      })();
  jh &&
    Sh(
      { target: 'Uint8Array', proto: !0, forced: Th },
      {
        toHex: function () {
          (Eh(this), xh(this.buffer));
          for (var t = '', r = 0, e = this.length; r < e; r++) {
            var n = Ah(this[r], 16);
            t += 1 === n.length ? '0' + n : n;
          }
          return t;
        },
      }
    );
  var Ih = Zn,
    kh = f,
    Ph = Hc,
    Ch = gt,
    Rh = Ur,
    Uh = Ya,
    Bh = Qa,
    Mh = ju('forEach', TypeError);
  Ih(
    { target: 'Iterator', proto: !0, real: !0, forced: Mh },
    {
      forEach: function (t) {
        Rh(this);
        try {
          Ch(t);
        } catch (Oy) {
          Bh(this, 'throw', Oy);
        }
        if (Mh) return kh(Mh, this, t);
        var r = Uh(this),
          e = 0;
        Ph(
          r,
          function (r) {
            t(r, e++);
          },
          { IS_RECORD: !0 }
        );
      },
    }
  );
  var Dh = a,
    Fh = Function.prototype,
    _h = Fh.apply,
    Lh = Fh.call,
    zh =
      ('object' == typeof Reflect && Reflect.apply) ||
      (Dh
        ? Lh.bind(_h)
        : function () {
            return Lh.apply(_h, arguments);
          }),
    Nh = Zn,
    Hh = Hc,
    Wh = gt,
    $h = Ur,
    qh = Ya,
    Jh = Qa,
    Vh = ju,
    Yh = zh,
    Gh = TypeError,
    Kh = o(function () {
      [].keys().reduce(function () {}, void 0);
    }),
    Xh = !Kh && Vh('reduce', Gh);
  Nh(
    { target: 'Iterator', proto: !0, real: !0, forced: Kh || Xh },
    {
      reduce: function (t) {
        $h(this);
        try {
          Wh(t);
        } catch (Oy) {
          Jh(this, 'throw', Oy);
        }
        var r = arguments.length < 2,
          e = r ? void 0 : arguments[1];
        if (Xh) return Yh(Xh, this, r ? [t] : [t, e]);
        var n = qh(this),
          o = 0;
        if (
          (Hh(
            n,
            function (n) {
              (r ? ((r = !1), (e = n)) : (e = t(e, n, o)), o++);
            },
            { IS_RECORD: !0 }
          ),
          r)
        )
          throw new Gh('Reduce of empty iterator with no initial value');
        return e;
      },
    }
  );
  var Zh = vc,
    Qh = String,
    tl = function (t) {
      if ('Symbol' === Zh(t)) throw new TypeError('Cannot convert a Symbol value to a string');
      return Qh(t);
    },
    rl = TypeError,
    el = function (t, r) {
      if (t < r) throw new rl('Not enough arguments');
      return t;
    },
    nl = Xe,
    ol = S,
    il = tl,
    al = el,
    ul = URLSearchParams,
    cl = ul.prototype,
    fl = ol(cl.append),
    sl = ol(cl.delete),
    hl = ol(cl.forEach),
    ll = ol([].push),
    pl = new ul('a=1&a=2&b=3');
  (pl.delete('a', 1),
    pl.delete('b', void 0),
    pl + '' != 'a=2' &&
      nl(
        cl,
        'delete',
        function (t) {
          var r = arguments.length,
            e = r < 2 ? void 0 : arguments[1];
          if (r && void 0 === e) return sl(this, t);
          var n = [];
          (hl(this, function (t, r) {
            ll(n, { key: r, value: t });
          }),
            al(r, 1));
          for (var o, i = il(t), a = il(e), u = 0, c = 0, f = !1, s = n.length; u < s; )
            ((o = n[u++]), f || o.key === i ? ((f = !0), sl(this, o.key)) : c++);
          for (; c < s; ) ((o = n[c++]).key === i && o.value === a) || fl(this, o.key, o.value);
        },
        { enumerable: !0, unsafe: !0 }
      ));
  var dl = Xe,
    yl = S,
    vl = tl,
    gl = el,
    wl = URLSearchParams,
    ml = wl.prototype,
    bl = yl(ml.getAll),
    Sl = yl(ml.has),
    Ol = new wl('a=1');
  (!Ol.has('a', 2) && Ol.has('a', void 0)) ||
    dl(
      ml,
      'has',
      function (t) {
        var r = arguments.length,
          e = r < 2 ? void 0 : arguments[1];
        if (r && void 0 === e) return Sl(this, t);
        var n = bl(this, t);
        gl(r, 1);
        for (var o = vl(e), i = 0; i < n.length; ) if (n[i++] === o) return !0;
        return !1;
      },
      { enumerable: !0, unsafe: !0 }
    );
  var El = i,
    xl = S,
    Al = po,
    jl = URLSearchParams.prototype,
    Tl = xl(jl.forEach);
  El &&
    !('size' in jl) &&
    Al(jl, 'size', {
      get: function () {
        var t = 0;
        return (
          Tl(this, function () {
            t++;
          }),
          t
        );
      },
      configurable: !0,
      enumerable: !0,
    });
  var Il = f,
    kl = Ur,
    Pl = Ya,
    Cl = Oc,
    Rl = Zn,
    Ul = f,
    Bl = gt,
    Ml = Ur,
    Dl = Ya,
    Fl = function (t, r) {
      (r && 'string' == typeof t) || kl(t);
      var e = Cl(t);
      return Pl(kl(void 0 !== e ? Il(e, t) : t));
    },
    _l = bu,
    Ll = Qa,
    zl = ju,
    Nl = !xu('flatMap', function () {}),
    Hl = !Nl && zl('flatMap', TypeError),
    Wl = Nl || Hl,
    $l = _l(function () {
      for (var t, r, e = this.iterator, n = this.mapper; ; ) {
        if ((r = this.inner))
          try {
            if (!(t = Ml(Ul(r.next, r.iterator))).done) return t.value;
            this.inner = null;
          } catch (Oy) {
            Ll(e, 'throw', Oy);
          }
        if (((t = Ml(Ul(this.next, e))), (this.done = !!t.done))) return;
        try {
          this.inner = Fl(n(t.value, this.counter++), !1);
        } catch (Oy) {
          Ll(e, 'throw', Oy);
        }
      }
    });
  Rl(
    { target: 'Iterator', proto: !0, real: !0, forced: Wl },
    {
      flatMap: function (t) {
        Ml(this);
        try {
          Bl(t);
        } catch (Oy) {
          Ll(this, 'throw', Oy);
        }
        return Hl ? Ul(Hl, this, t) : new $l(Dl(this), { mapper: t, inner: null });
      },
    }
  );
  var ql = S,
    Jl = Set.prototype,
    Vl = { Set: Set, add: ql(Jl.add), has: ql(Jl.has), remove: ql(Jl.delete), proto: Jl },
    Yl = Vl.has,
    Gl = function (t) {
      return (Yl(t), t);
    },
    Kl = f,
    Xl = function (t, r, e) {
      for (var n, o, i = e ? t : t.iterator, a = t.next; !(n = Kl(a, i)).done; )
        if (void 0 !== (o = r(n.value))) return o;
    },
    Zl = S,
    Ql = Xl,
    tp = Vl.Set,
    rp = Vl.proto,
    ep = Zl(rp.forEach),
    np = Zl(rp.keys),
    op = np(new tp()).next,
    ip = function (t, r, e) {
      return e ? Ql({ iterator: np(t), next: op }, r) : ep(t, r);
    },
    ap = ip,
    up = Vl.Set,
    cp = Vl.add,
    fp = function (t) {
      var r = new up();
      return (
        ap(t, function (t) {
          cp(r, t);
        }),
        r
      );
    },
    sp =
      wo(Vl.proto, 'size', 'get') ||
      function (t) {
        return t.size;
      },
    hp = gt,
    lp = Ur,
    pp = f,
    dp = en,
    yp = Ya,
    vp = 'Invalid size',
    gp = RangeError,
    wp = TypeError,
    mp = Math.max,
    bp = function (t, r) {
      ((this.set = t), (this.size = mp(r, 0)), (this.has = hp(t.has)), (this.keys = hp(t.keys)));
    };
  bp.prototype = {
    getIterator: function () {
      return yp(lp(pp(this.keys, this.set)));
    },
    includes: function (t) {
      return pp(this.has, this.set, t);
    },
  };
  var Sp = function (t) {
      lp(t);
      var r = +t.size;
      if (r != r) throw new wp(vp);
      var e = dp(r);
      if (e < 0) throw new gp(vp);
      return new bp(t, e);
    },
    Op = Gl,
    Ep = fp,
    xp = sp,
    Ap = Sp,
    jp = ip,
    Tp = Xl,
    Ip = Vl.has,
    kp = Vl.remove,
    Pp = $,
    Cp = function (t) {
      return {
        size: t,
        has: function () {
          return !1;
        },
        keys: function () {
          return {
            next: function () {
              return { done: !0 };
            },
          };
        },
      };
    },
    Rp = function (t) {
      return {
        size: t,
        has: function () {
          return !0;
        },
        keys: function () {
          throw new Error('e');
        },
      };
    },
    Up = function (t, r) {
      var e = Pp('Set');
      try {
        new e()[t](Cp(0));
        try {
          return (new e()[t](Cp(-1)), !1);
        } catch (o) {
          if (!r) return !0;
          try {
            return (new e()[t](Rp(-1 / 0)), !1);
          } catch (Oy) {
            var n = new e();
            return (n.add(1), n.add(2), r(n[t](Rp(1 / 0))));
          }
        }
      } catch (Oy) {
        return !1;
      }
    },
    Bp = function (t) {
      var r = Op(this),
        e = Ap(t),
        n = Ep(r);
      return (
        xp(r) <= e.size
          ? jp(r, function (t) {
              e.includes(t) && kp(n, t);
            })
          : Tp(e.getIterator(), function (t) {
              Ip(n, t) && kp(n, t);
            }),
        n
      );
    },
    Mp = o;
  Zn(
    {
      target: 'Set',
      proto: !0,
      real: !0,
      forced:
        !Up('difference', function (t) {
          return 0 === t.size;
        }) ||
        Mp(function () {
          var t = {
              size: 1,
              has: function () {
                return !0;
              },
              keys: function () {
                var t = 0;
                return {
                  next: function () {
                    var e = t++ > 1;
                    return (r.has(1) && r.clear(), { done: e, value: 2 });
                  },
                };
              },
            },
            r = new Set([1, 2, 3, 4]);
          return 3 !== r.difference(t).size;
        }),
    },
    { difference: Bp }
  );
  var Dp = Gl,
    Fp = sp,
    _p = Sp,
    Lp = ip,
    zp = Xl,
    Np = Vl.Set,
    Hp = Vl.add,
    Wp = Vl.has,
    $p = o,
    qp = function (t) {
      var r = Dp(this),
        e = _p(t),
        n = new Np();
      return (
        Fp(r) > e.size
          ? zp(e.getIterator(), function (t) {
              Wp(r, t) && Hp(n, t);
            })
          : Lp(r, function (t) {
              e.includes(t) && Hp(n, t);
            }),
        n
      );
    };
  Zn(
    {
      target: 'Set',
      proto: !0,
      real: !0,
      forced:
        !Up('intersection', function (t) {
          return 2 === t.size && t.has(1) && t.has(2);
        }) ||
        $p(function () {
          return '3,2' !== String(Array.from(new Set([1, 2, 3]).intersection(new Set([3, 2]))));
        }),
    },
    { intersection: qp }
  );
  var Jp = Gl,
    Vp = Vl.has,
    Yp = sp,
    Gp = Sp,
    Kp = ip,
    Xp = Xl,
    Zp = Qa,
    Qp = function (t) {
      var r = Jp(this),
        e = Gp(t);
      if (Yp(r) <= e.size)
        return (
          !1 !==
          Kp(
            r,
            function (t) {
              if (e.includes(t)) return !1;
            },
            !0
          )
        );
      var n = e.getIterator();
      return (
        !1 !==
        Xp(n, function (t) {
          if (Vp(r, t)) return Zp(n, 'normal', !1);
        })
      );
    };
  Zn(
    {
      target: 'Set',
      proto: !0,
      real: !0,
      forced: !Up('isDisjointFrom', function (t) {
        return !t;
      }),
    },
    { isDisjointFrom: Qp }
  );
  var td = Gl,
    rd = sp,
    ed = ip,
    nd = Sp,
    od = function (t) {
      var r = td(this),
        e = nd(t);
      return (
        !(rd(r) > e.size) &&
        !1 !==
          ed(
            r,
            function (t) {
              if (!e.includes(t)) return !1;
            },
            !0
          )
      );
    };
  Zn(
    {
      target: 'Set',
      proto: !0,
      real: !0,
      forced: !Up('isSubsetOf', function (t) {
        return t;
      }),
    },
    { isSubsetOf: od }
  );
  var id = Gl,
    ad = Vl.has,
    ud = sp,
    cd = Sp,
    fd = Xl,
    sd = Qa,
    hd = function (t) {
      var r = id(this),
        e = cd(t);
      if (ud(r) < e.size) return !1;
      var n = e.getIterator();
      return (
        !1 !==
        fd(n, function (t) {
          if (!ad(r, t)) return sd(n, 'normal', !1);
        })
      );
    };
  Zn(
    {
      target: 'Set',
      proto: !0,
      real: !0,
      forced: !Up('isSupersetOf', function (t) {
        return !t;
      }),
    },
    { isSupersetOf: hd }
  );
  var ld = Gl,
    pd = fp,
    dd = Sp,
    yd = Xl,
    vd = Vl.add,
    gd = Vl.has,
    wd = Vl.remove,
    md = function (t) {
      try {
        var r = new Set(),
          e = {
            size: 0,
            has: function () {
              return !0;
            },
            keys: function () {
              return Object.defineProperty({}, 'next', {
                get: function () {
                  return (
                    r.clear(),
                    r.add(4),
                    function () {
                      return { done: !0 };
                    }
                  );
                },
              });
            },
          },
          n = r[t](e);
        return 1 === n.size && 4 === n.values().next().value;
      } catch (Oy) {
        return !1;
      }
    },
    bd = function (t) {
      var r = ld(this),
        e = dd(t).getIterator(),
        n = pd(r);
      return (
        yd(e, function (t) {
          gd(r, t) ? wd(n, t) : vd(n, t);
        }),
        n
      );
    },
    Sd = md;
  Zn(
    {
      target: 'Set',
      proto: !0,
      real: !0,
      forced: !Up('symmetricDifference') || !Sd('symmetricDifference'),
    },
    { symmetricDifference: bd }
  );
  var Od = Gl,
    Ed = Vl.add,
    xd = fp,
    Ad = Sp,
    jd = Xl,
    Td = function (t) {
      var r = Od(this),
        e = Ad(t).getIterator(),
        n = xd(r);
      return (
        jd(e, function (t) {
          Ed(n, t);
        }),
        n
      );
    },
    Id = md;
  Zn({ target: 'Set', proto: !0, real: !0, forced: !Up('union') || !Id('union') }, { union: Td });
  var kd = S,
    Pd = Nt,
    Cd = SyntaxError,
    Rd = parseInt,
    Ud = String.fromCharCode,
    Bd = kd(''.charAt),
    Md = kd(''.slice),
    Dd = kd(/./.exec),
    Fd = {
      '\\"': '"',
      '\\\\': '\\',
      '\\/': '/',
      '\\b': '\b',
      '\\f': '\f',
      '\\n': '\n',
      '\\r': '\r',
      '\\t': '\t',
    },
    _d = /^[\da-f]{4}$/i,
    Ld = /^[\u0000-\u001F]$/,
    zd = Zn,
    Nd = i,
    Hd = e,
    Wd = $,
    $d = S,
    qd = f,
    Jd = L,
    Vd = N,
    Yd = to,
    Gd = Nt,
    Kd = tl,
    Xd = hn,
    Zd = $i,
    Qd = o,
    ty = function (t, r) {
      for (var e = !0, n = ''; r < t.length; ) {
        var o = Bd(t, r);
        if ('\\' === o) {
          var i = Md(t, r, r + 2);
          if (Pd(Fd, i)) ((n += Fd[i]), (r += 2));
          else {
            if ('\\u' !== i) throw new Cd('Unknown escape sequence: "' + i + '"');
            var a = Md(t, (r += 2), r + 4);
            if (!Dd(_d, a)) throw new Cd('Bad Unicode escape at: ' + r);
            ((n += Ud(Rd(a, 16))), (r += 4));
          }
        } else {
          if ('"' === o) {
            ((e = !1), r++);
            break;
          }
          if (Dd(Ld, o)) throw new Cd('Bad control character in string literal at: ' + r);
          ((n += o), r++);
        }
      }
      if (e) throw new Cd('Unterminated string at: ' + r);
      return { value: n, end: r };
    },
    ry = it,
    ey = Hd.JSON,
    ny = Hd.Number,
    oy = Hd.SyntaxError,
    iy = ey && ey.parse,
    ay = Wd('Object', 'keys'),
    uy = Object.getOwnPropertyDescriptor,
    cy = $d(''.charAt),
    fy = $d(''.slice),
    sy = $d(/./.exec),
    hy = $d([].push),
    ly = /^\d$/,
    py = /^[1-9]$/,
    dy = /^[\d-]$/,
    yy = /^[\t\n\r ]$/,
    vy = function (t, r, e, n) {
      var o,
        i,
        a,
        u,
        c,
        f = t[r],
        s = n && f === n.value,
        h = s && 'string' == typeof n.source ? { source: n.source } : {};
      if (Vd(f)) {
        var l = Yd(f),
          p = s ? n.nodes : l ? [] : {};
        if (l)
          for (o = p.length, a = Xd(f), u = 0; u < a; u++)
            gy(f, u, vy(f, '' + u, e, u < o ? p[u] : void 0));
        else
          for (i = ay(f), a = Xd(i), u = 0; u < a; u++)
            ((c = i[u]), gy(f, c, vy(f, c, e, Gd(p, c) ? p[c] : void 0)));
      }
      return qd(e, t, r, f, h);
    },
    gy = function (t, r, e) {
      if (Nd) {
        var n = uy(t, r);
        if (n && !n.configurable) return;
      }
      void 0 === e ? delete t[r] : Zd(t, r, e);
    },
    wy = function (t, r, e, n) {
      ((this.value = t), (this.end = r), (this.source = e), (this.nodes = n));
    },
    my = function (t, r) {
      ((this.source = t), (this.index = r));
    };
  my.prototype = {
    fork: function (t) {
      return new my(this.source, t);
    },
    parse: function () {
      var t = this.source,
        r = this.skip(yy, this.index),
        e = this.fork(r),
        n = cy(t, r);
      if (sy(dy, n)) return e.number();
      switch (n) {
        case '{':
          return e.object();
        case '[':
          return e.array();
        case '"':
          return e.string();
        case 't':
          return e.keyword(!0);
        case 'f':
          return e.keyword(!1);
        case 'n':
          return e.keyword(null);
      }
      throw new oy('Unexpected character: "' + n + '" at: ' + r);
    },
    node: function (t, r, e, n, o) {
      return new wy(r, n, t ? null : fy(this.source, e, n), o);
    },
    object: function () {
      for (var t = this.source, r = this.index + 1, e = !1, n = {}, o = {}; r < t.length; ) {
        if (((r = this.until(['"', '}'], r)), '}' === cy(t, r) && !e)) {
          r++;
          break;
        }
        var i = this.fork(r).string(),
          a = i.value;
        ((r = i.end),
          (r = this.until([':'], r) + 1),
          (r = this.skip(yy, r)),
          (i = this.fork(r).parse()),
          Zd(o, a, i),
          Zd(n, a, i.value),
          (r = this.until([',', '}'], i.end)));
        var u = cy(t, r);
        if (',' === u) ((e = !0), r++);
        else if ('}' === u) {
          r++;
          break;
        }
      }
      return this.node(1, n, this.index, r, o);
    },
    array: function () {
      for (var t = this.source, r = this.index + 1, e = !1, n = [], o = []; r < t.length; ) {
        if (((r = this.skip(yy, r)), ']' === cy(t, r) && !e)) {
          r++;
          break;
        }
        var i = this.fork(r).parse();
        if ((hy(o, i), hy(n, i.value), (r = this.until([',', ']'], i.end)), ',' === cy(t, r)))
          ((e = !0), r++);
        else if (']' === cy(t, r)) {
          r++;
          break;
        }
      }
      return this.node(1, n, this.index, r, o);
    },
    string: function () {
      var t = this.index,
        r = ty(this.source, this.index + 1);
      return this.node(0, r.value, t, r.end);
    },
    number: function () {
      var t = this.source,
        r = this.index,
        e = r;
      if (('-' === cy(t, e) && e++, '0' === cy(t, e))) e++;
      else {
        if (!sy(py, cy(t, e))) throw new oy('Failed to parse number at: ' + e);
        e = this.skip(ly, e + 1);
      }
      if (
        ('.' === cy(t, e) && (e = this.skip(ly, e + 1)), 'e' === cy(t, e) || 'E' === cy(t, e)) &&
        (e++, ('+' !== cy(t, e) && '-' !== cy(t, e)) || e++, e === (e = this.skip(ly, e)))
      )
        throw new oy("Failed to parse number's exponent value at: " + e);
      return this.node(0, ny(fy(t, r, e)), r, e);
    },
    keyword: function (t) {
      var r = '' + t,
        e = this.index,
        n = e + r.length;
      if (fy(this.source, e, n) !== r) throw new oy('Failed to parse value at: ' + e);
      return this.node(0, t, e, n);
    },
    skip: function (t, r) {
      for (var e = this.source; r < e.length && sy(t, cy(e, r)); r++);
      return r;
    },
    until: function (t, r) {
      r = this.skip(yy, r);
      for (var e = cy(this.source, r), n = 0; n < t.length; n++) if (t[n] === e) return r;
      throw new oy('Unexpected character: "' + e + '" at: ' + r);
    },
  };
  var by = Qd(function () {
      var t,
        r = '9007199254740993';
      return (
        iy(r, function (r, e, n) {
          t = n.source;
        }),
        t !== r
      );
    }),
    Sy =
      ry &&
      !Qd(function () {
        return 1 / iy('-0 \t') != -1 / 0;
      });
  (zd(
    { target: 'JSON', stat: !0, forced: by },
    {
      parse: function (t, r) {
        return Sy && !Jd(r)
          ? iy(t)
          : (function (t, r) {
              t = Kd(t);
              var e = new my(t, 0),
                n = e.parse(),
                o = n.value,
                i = e.skip(yy, n.end);
              if (i < t.length)
                throw new oy(
                  'Unexpected extra character: "' + cy(t, i) + '" after the parsed data at: ' + i
                );
              return Jd(r) ? vy({ '': o }, '', r, n) : o;
            })(t, r);
      },
    }
  ),
    (function () {
      function r(t, r) {
        return (
          (r || '') +
          ' (SystemJS https://github.com/systemjs/systemjs/blob/main/docs/errors.md#' +
          t +
          ')'
        );
      }
      function e(t, r) {
        if ((-1 !== t.indexOf('\\') && (t = t.replace(x, '/')), '/' === t[0] && '/' === t[1]))
          return r.slice(0, r.indexOf(':') + 1) + t;
        if (
          ('.' === t[0] &&
            ('/' === t[1] ||
              ('.' === t[1] && ('/' === t[2] || (2 === t.length && (t += '/')))) ||
              (1 === t.length && (t += '/')))) ||
          '/' === t[0]
        ) {
          var e,
            n = r.slice(0, r.indexOf(':') + 1);
          if (
            ((e =
              '/' === r[n.length + 1]
                ? 'file:' !== n
                  ? (e = r.slice(n.length + 2)).slice(e.indexOf('/') + 1)
                  : r.slice(8)
                : r.slice(n.length + ('/' === r[n.length]))),
            '/' === t[0])
          )
            return r.slice(0, r.length - e.length - 1) + t;
          for (
            var o = e.slice(0, e.lastIndexOf('/') + 1) + t, i = [], a = -1, u = 0;
            u < o.length;
            u++
          )
            -1 !== a
              ? '/' === o[u] && (i.push(o.slice(a, u + 1)), (a = -1))
              : '.' === o[u]
                ? '.' !== o[u + 1] || ('/' !== o[u + 2] && u + 2 !== o.length)
                  ? '/' === o[u + 1] || u + 1 === o.length
                    ? (u += 1)
                    : (a = u)
                  : (i.pop(), (u += 2))
                : (a = u);
          return (-1 !== a && i.push(o.slice(a)), r.slice(0, r.length - e.length) + i.join(''));
        }
      }
      function n(t, r) {
        return e(t, r) || (-1 !== t.indexOf(':') ? t : e('./' + t, r));
      }
      function o(t, r, n, o, i) {
        for (var a in t) {
          var u = e(a, n) || a,
            s = t[a];
          if ('string' == typeof s) {
            var h = f(o, e(s, n) || s, i);
            h ? (r[u] = h) : c('W1', a, s);
          }
        }
      }
      function i(t, r, e) {
        var i;
        for (i in (t.imports && o(t.imports, e.imports, r, e, null), t.scopes || {})) {
          var a = n(i, r);
          o(t.scopes[i], e.scopes[a] || (e.scopes[a] = {}), r, e, a);
        }
        for (i in t.depcache || {}) e.depcache[n(i, r)] = t.depcache[i];
        for (i in t.integrity || {}) e.integrity[n(i, r)] = t.integrity[i];
      }
      function a(t, r) {
        if (r[t]) return t;
        var e = t.length;
        do {
          var n = t.slice(0, e + 1);
          if (n in r) return n;
        } while (-1 !== (e = t.lastIndexOf('/', e - 1)));
      }
      function u(t, r) {
        var e = a(t, r);
        if (e) {
          var n = r[e];
          if (null === n) return;
          if (!(t.length > e.length && '/' !== n[n.length - 1])) return n + t.slice(e.length);
          c('W2', e, n);
        }
      }
      function c(t, e, n) {
        console.warn(r(t, [n, e].join(', ')));
      }
      function f(t, r, e) {
        for (var n = t.scopes, o = e && a(e, n); o; ) {
          var i = u(r, n[o]);
          if (i) return i;
          o = a(o.slice(0, o.lastIndexOf('/')), n);
        }
        return u(r, t.imports) || (-1 !== r.indexOf(':') && r);
      }
      function s() {
        this[j] = {};
      }
      function h(t, e, n, o) {
        var i = t[j][e];
        if (i) return i;
        var a = [],
          u = Object.create(null);
        A && Object.defineProperty(u, A, { value: 'Module' });
        var c = Promise.resolve()
            .then(function () {
              return t.instantiate(e, n, o);
            })
            .then(
              function (n) {
                if (!n) throw Error(r(2, e));
                var o = n[1](
                  function (t, r) {
                    i.h = !0;
                    var e = !1;
                    if ('string' == typeof t) (t in u && u[t] === r) || ((u[t] = r), (e = !0));
                    else {
                      for (var n in t)
                        ((r = t[n]), (n in u && u[n] === r) || ((u[n] = r), (e = !0)));
                      t && t.__esModule && (u.__esModule = t.__esModule);
                    }
                    if (e)
                      for (var o = 0; o < a.length; o++) {
                        var c = a[o];
                        c && c(u);
                      }
                    return r;
                  },
                  2 === n[1].length
                    ? {
                        import: function (r, n) {
                          return t.import(r, e, n);
                        },
                        meta: t.createContext(e),
                      }
                    : void 0
                );
                return ((i.e = o.execute || function () {}), [n[0], o.setters || [], n[2] || []]);
              },
              function (t) {
                throw ((i.e = null), (i.er = t), t);
              }
            ),
          f = c.then(function (r) {
            return Promise.all(
              r[0].map(function (n, o) {
                var i = r[1][o],
                  a = r[2][o];
                return Promise.resolve(t.resolve(n, e)).then(function (r) {
                  var n = h(t, r, e, a);
                  return Promise.resolve(n.I).then(function () {
                    return (i && (n.i.push(i), (!n.h && n.I) || i(n.n)), n);
                  });
                });
              })
            ).then(function (t) {
              i.d = t;
            });
          });
        return (i = t[j][e] =
          {
            id: e,
            i: a,
            n: u,
            m: o,
            I: c,
            L: f,
            h: !1,
            d: void 0,
            e: void 0,
            er: void 0,
            E: void 0,
            C: void 0,
            p: void 0,
          });
      }
      function l(t, r, e, n) {
        if (!n[r.id])
          return (
            (n[r.id] = !0),
            Promise.resolve(r.L)
              .then(function () {
                return (
                  (r.p && null !== r.p.e) || (r.p = e),
                  Promise.all(
                    r.d.map(function (r) {
                      return l(t, r, e, n);
                    })
                  )
                );
              })
              .catch(function (t) {
                if (r.er) throw t;
                throw ((r.e = null), t);
              })
          );
      }
      function p(t, r) {
        return (r.C = l(t, r, r, {})
          .then(function () {
            return d(t, r, {});
          })
          .then(function () {
            return r.n;
          }));
      }
      function d(t, r, e) {
        function n() {
          try {
            var t = i.call(I);
            if (t)
              return (
                (t = t.then(
                  function () {
                    ((r.C = r.n), (r.E = null));
                  },
                  function (t) {
                    throw ((r.er = t), (r.E = null), t);
                  }
                )),
                (r.E = t)
              );
            ((r.C = r.n), (r.L = r.I = void 0));
          } catch (e) {
            throw ((r.er = e), e);
          }
        }
        if (!e[r.id]) {
          if (((e[r.id] = !0), !r.e)) {
            if (r.er) throw r.er;
            return r.E ? r.E : void 0;
          }
          var o,
            i = r.e;
          return (
            (r.e = null),
            r.d.forEach(function (n) {
              try {
                var i = d(t, n, e);
                i && (o = o || []).push(i);
              } catch (u) {
                throw ((r.er = u), u);
              }
            }),
            o ? Promise.all(o).then(n) : n()
          );
        }
      }
      function y() {
        [].forEach.call(document.querySelectorAll('script'), function (t) {
          if (!t.sp)
            if ('systemjs-module' === t.type) {
              if (((t.sp = !0), !t.src)) return;
              System.import('import:' === t.src.slice(0, 7) ? t.src.slice(7) : n(t.src, v)).catch(
                function (r) {
                  if (
                    r.message.indexOf(
                      'https://github.com/systemjs/systemjs/blob/main/docs/errors.md#3'
                    ) > -1
                  ) {
                    var e = document.createEvent('Event');
                    (e.initEvent('error', !1, !1), t.dispatchEvent(e));
                  }
                  return Promise.reject(r);
                }
              );
            } else if ('systemjs-importmap' === t.type) {
              t.sp = !0;
              var e = t.src
                ? (System.fetch || fetch)(t.src, {
                    integrity: t.integrity,
                    priority: t.fetchPriority,
                    passThrough: !0,
                  })
                    .then(function (t) {
                      if (!t.ok) throw Error(t.status);
                      return t.text();
                    })
                    .catch(function (e) {
                      return (
                        (e.message = r('W4', t.src) + '\n' + e.message),
                        console.warn(e),
                        'function' == typeof t.onerror && t.onerror(),
                        '{}'
                      );
                    })
                : t.innerHTML;
              C = C.then(function () {
                return e;
              }).then(function (e) {
                !(function (t, e, n) {
                  var o = {};
                  try {
                    o = JSON.parse(e);
                  } catch (u) {
                    console.warn(Error(r('W5')));
                  }
                  i(o, n, t);
                })(R, e, t.src || v);
              });
            }
        });
      }
      var v,
        g = 'undefined' != typeof Symbol,
        w = 'undefined' != typeof self,
        m = 'undefined' != typeof document,
        b = w ? self : t;
      if (m) {
        var S = document.querySelector('base[href]');
        S && (v = S.href);
      }
      if (!v && 'undefined' != typeof location) {
        var O = (v = location.href.split('#')[0].split('?')[0]).lastIndexOf('/');
        -1 !== O && (v = v.slice(0, O + 1));
      }
      var E,
        x = /\\/g,
        A = g && Symbol.toStringTag,
        j = g ? Symbol() : '@',
        T = s.prototype;
      ((T.import = function (t, r, e) {
        var n = this;
        return (
          r && 'object' == typeof r && ((e = r), (r = void 0)),
          Promise.resolve(n.prepareImport())
            .then(function () {
              return n.resolve(t, r, e);
            })
            .then(function (t) {
              var r = h(n, t, void 0, e);
              return r.C || p(n, r);
            })
        );
      }),
        (T.createContext = function (t) {
          var r = this;
          return {
            url: t,
            resolve: function (e, n) {
              return Promise.resolve(r.resolve(e, n || t));
            },
          };
        }),
        (T.register = function (t, r, e) {
          E = [t, r, e];
        }),
        (T.getRegister = function () {
          var t = E;
          return ((E = void 0), t);
        }));
      var I = Object.freeze(Object.create(null));
      b.System = new s();
      var k,
        P,
        C = Promise.resolve(),
        R = { imports: {}, scopes: {}, depcache: {}, integrity: {} },
        U = m;
      if (
        ((T.prepareImport = function (t) {
          return ((U || t) && (y(), (U = !1)), C);
        }),
        (T.getImportMap = function () {
          return JSON.parse(JSON.stringify(R));
        }),
        m && (y(), window.addEventListener('DOMContentLoaded', y)),
        (T.addImportMap = function (t, r) {
          i(t, r || v, R);
        }),
        m)
      ) {
        window.addEventListener('error', function (t) {
          ((M = t.filename), (D = t.error));
        });
        var B = location.origin;
      }
      T.createScript = function (t) {
        var r = document.createElement('script');
        ((r.async = !0), t.indexOf(B + '/') && (r.crossOrigin = 'anonymous'));
        var e = R.integrity[t];
        return (e && (r.integrity = e), (r.src = t), r);
      };
      var M,
        D,
        F = {},
        _ = T.register;
      ((T.register = function (t, r) {
        if (m && 'loading' === document.readyState && 'string' != typeof t) {
          var e = document.querySelectorAll('script[src]'),
            n = e[e.length - 1];
          if (n) {
            k = t;
            var o = this;
            P = setTimeout(function () {
              ((F[n.src] = [t, r]), o.import(n.src));
            });
          }
        } else k = void 0;
        return _.call(this, t, r);
      }),
        (T.instantiate = function (t, e) {
          var n = F[t];
          if (n) return (delete F[t], n);
          var o = this;
          return Promise.resolve(T.createScript(t)).then(function (n) {
            return new Promise(function (i, a) {
              (n.addEventListener('error', function () {
                a(Error(r(3, [t, e].join(', '))));
              }),
                n.addEventListener('load', function () {
                  if ((document.head.removeChild(n), M === t)) a(D);
                  else {
                    var r = o.getRegister(t);
                    (r && r[0] === k && clearTimeout(P), i(r));
                  }
                }),
                document.head.appendChild(n));
            });
          });
        }),
        (T.shouldFetch = function () {
          return !1;
        }),
        'undefined' != typeof fetch && (T.fetch = fetch));
      var L = T.instantiate,
        z = /^(text|application)\/(x-)?javascript(;|$)/;
      ((T.instantiate = function (t, e, n) {
        var o = this;
        return this.shouldFetch(t, e, n)
          ? this.fetch(t, { credentials: 'same-origin', integrity: R.integrity[t], meta: n }).then(
              function (n) {
                if (!n.ok) throw Error(r(7, [n.status, n.statusText, t, e].join(', ')));
                var i = n.headers.get('content-type');
                if (!i || !z.test(i)) throw Error(r(4, i));
                return n.text().then(function (r) {
                  return (
                    r.indexOf('//# sourceURL=') < 0 && (r += '\n//# sourceURL=' + t),
                    (0, eval)(r),
                    o.getRegister(t)
                  );
                });
              }
            )
          : L.apply(this, arguments);
      }),
        (T.resolve = function (t, n) {
          return (
            f(R, e(t, (n = n || v)) || t, n) ||
            (function (t, e) {
              throw Error(r(8, [t, e].join(', ')));
            })(t, n)
          );
        }));
      var N = T.instantiate;
      ((T.instantiate = function (t, r, e) {
        var n = R.depcache[t];
        if (n) for (var o = 0; o < n.length; o++) h(this, this.resolve(n[o], t), t);
        return N.call(this, t, r, e);
      }),
        w &&
          'function' == typeof importScripts &&
          (T.instantiate = function (t) {
            var r = this;
            return Promise.resolve().then(function () {
              return (importScripts(t), r.getRegister(t));
            });
          }));
    })());
})();
//# sourceMappingURL=polyfills-legacy-DEfmcKBM.js.map
