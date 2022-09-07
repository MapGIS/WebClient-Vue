!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t =
        "undefined" != typeof globalThis
          ? globalThis
          : t || self).rasterTileLayer = e());
})(this, function () {
  "use strict";
  Object.freeze = function (t) {
    return t;
  };
  var t =
    Object.create ||
    (function () {
      function t() {}
      return function (e) {
        return (t.prototype = e), new t();
      };
    })();
  var e = /\{ *([\w_-]+) *\}/g;
  var i =
      Array.isArray ||
      function (t) {
        return "[object Array]" === Object.prototype.toString.call(t);
      },
    r = 3.141592653589793,
    o = 6378245,
    a = 0.006693421622965943,
    n = (3e3 * r) / 180;
  function s(t, e, i) {
    var o = (r / 180) * e,
      a = Math.pow(2, i);
    return [
      parseInt(((t + 180) / 360) * a),
      parseInt(((1 - Math.asinh(Math.tan(o)) / r) / 2) * a),
    ];
  }
  function h(t, e) {
    if (i(t)) {
      var r = t[0];
      (e = t[1]), (t = r);
    }
    if (t instanceof Object) {
      r = t.lng;
      (e = t.lat), (t = r);
    }
    var o,
      a,
      s,
      h,
      l,
      u,
      p =
        ((o = t - 0.0065),
        (a = e - 0.006),
        (s = Math.sqrt(o * o + a * a) - 2e-5 * Math.sin(a * n)),
        (h = Math.atan2(a, o) - 3e-6 * Math.cos(o * n)),
        (l = s * Math.cos(h)),
        (u = s * Math.sin(h)),
        { lng: l, lat: u });
    return c(p.lng, p.lat);
  }
  function l(t, e) {
    if (i(t)) {
      var r = t[0];
      (e = t[1]), (t = r);
    }
    if (t instanceof Object) {
      r = t.lng;
      (e = t.lat), (t = r);
    }
    var o,
      a,
      s,
      h,
      l,
      c,
      p = u(t, e);
    return (
      (o = p.lng),
      (a = p.lat),
      (s = Math.sqrt(o * o + a * a) + 2e-5 * Math.sin(a * n)),
      (h = Math.atan2(a, o) + 3e-6 * Math.cos(o * n)),
      (l = s * Math.cos(h) + 0.0065),
      (c = s * Math.sin(h) + 0.006),
      { lng: l, lat: c }
    );
  }
  function u(t, e) {
    if (i(t)) {
      var n = t[0];
      (e = t[1]), (t = n);
    }
    if (t instanceof Object) {
      n = t.lng;
      (e = t.lat), (t = n);
    }
    var s = p(t - 105, e - 35),
      h = f(t - 105, e - 35),
      l = (e / 180) * r,
      u = Math.sin(l);
    u = 1 - a * u * u;
    var c = Math.sqrt(u);
    return (
      (s = (180 * s) / (((o * (1 - a)) / (u * c)) * r)),
      { lng: t + (h = (180 * h) / ((o / c) * Math.cos(l) * r)), lat: e + s }
    );
  }
  function c(t, e) {
    if (i(t)) {
      var n = t[0];
      (e = t[1]), (t = n);
    }
    if (t instanceof Object) {
      n = t.lng;
      (e = t.lat), (t = n);
    }
    var s = (function (t, e) {
      var i = p(t - 105, e - 35),
        n = f(t - 105, e - 35),
        s = (e / 180) * r,
        h = Math.sin(s);
      h = 1 - a * h * h;
      var l = Math.sqrt(h);
      return (
        (i = (180 * i) / (((o * (1 - a)) / (h * l)) * r)),
        (n = (180 * n) / ((o / l) * Math.cos(s) * r)),
        { lng: t + n, lat: e + i }
      );
    })(t, e);
    return { lng: 2 * t - s.lng, lat: 2 * e - s.lat };
  }
  function p(t, e) {
    var i =
      2 * t -
      100 +
      3 * e +
      0.2 * e * e +
      0.1 * t * e +
      0.2 * Math.sqrt(Math.abs(t));
    return (
      (i += (2 * (20 * Math.sin(6 * t * r) + 20 * Math.sin(2 * t * r))) / 3),
      (i += (2 * (20 * Math.sin(e * r) + 40 * Math.sin((e / 3) * r))) / 3),
      (i +=
        (2 * (160 * Math.sin((e / 12) * r) + 320 * Math.sin((e * r) / 30))) / 3)
    );
  }
  function f(t, e) {
    var i =
      300 +
      t +
      2 * e +
      0.1 * t * t +
      0.1 * t * e +
      0.1 * Math.sqrt(Math.abs(t));
    return (
      (i += (2 * (20 * Math.sin(6 * t * r) + 20 * Math.sin(2 * t * r))) / 3),
      (i += (2 * (20 * Math.sin(t * r) + 40 * Math.sin((t / 3) * r))) / 3),
      (i +=
        (2 * (150 * Math.sin((t / 12) * r) + 300 * Math.sin((t / 30) * r))) / 3)
    );
  }
  function m(t, e) {
    for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    return t;
  }
  function g(t) {
    return "string" == typeof t;
  }
  var d = void 0,
    v = null;
  function M(t, e) {
    isNaN(t) && ((t = Ib(t)), (t = isNaN(t) ? 0 : t)),
      g(t) && (t = parseFloat(t)),
      isNaN(e) && ((e = Ib(e)), (e = isNaN(e) ? 0 : e)),
      g(e) && (e = parseFloat(e)),
      (this.lng = t),
      (this.lat = e);
  }
  function x(t, e) {
    (this.x = t || 0), (this.y = e || 0), (this.x = this.x), (this.y = this.y);
  }
  function _() {}
  function y() {}
  (M.TL = function (t) {
    return t && 180 >= t.lng && -180 <= t.lng && 74 >= t.lat && -74 <= t.lat;
  }),
    (M.prototype.lb = function (t) {
      return t && this.lat == t.lat && this.lng == t.lng;
    }),
    (x.prototype.lb = function (t) {
      return t && t.x == this.x && t.y == this.y;
    }),
    (_.prototype.nh = function () {
      aa("lngLatToPoint方法未实现");
    }),
    (_.prototype.wi = function () {
      aa("pointToLngLat方法未实现");
    }),
    (y.prototype = new _()),
    m(y, {
      $O: 6370996.81,
      lG: [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0],
      Au: [75, 60, 45, 30, 15, 0],
      fP: [
        [
          1.410526172116255e-8, 898305509648872e-20, -1.9939833816331,
          200.9824383106796, -187.2403703815547, 91.6087516669843,
          -23.38765649603339, 2.57121317296198, -0.03801003308653, 17337981.2,
        ],
        [
          -7.435856389565537e-9, 8983055097726239e-21, -0.78625201886289,
          96.32687599759846, -1.85204757529826, -59.36935905485877,
          47.40033549296737, -16.50741931063887, 2.28786674699375, 10260144.86,
        ],
        [
          -3.030883460898826e-8, 898305509983578e-20, 0.30071316287616,
          59.74293618442277, 7.357984074871, -25.38371002664745,
          13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37,
        ],
        [
          -1.981981304930552e-8, 8983055099779535e-21, 0.03278182852591,
          40.31678527705744, 0.65659298677277, -4.44255534477492,
          0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06,
        ],
        [
          3.09191371068437e-9, 8983055096812155e-21, 6995724062e-14,
          23.10934304144901, -0.00023663490511, -0.6321817810242,
          -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4,
        ],
        [
          2.890871144776878e-9, 8983055095805407e-21, -3.068298e-8,
          7.47137025468032, -353937994e-14, -0.02145144861037, -1234426596e-14,
          0.00010322952773, -323890364e-14, 826088.5,
        ],
      ],
      iG: [
        [
          -0.0015702102444, 111320.7020616939, 0x60e374c3105a3,
          -0x24bb4115e2e164, 0x5cc55543bb0ae8, -0x7ce070193f3784,
          0x5e7ca61ddf8150, -0x261a578d8b24d0, 0x665d60f3742ca, 82.5,
        ],
        [
          0.0008277824516172526, 111320.7020463578, 647795574.6671607,
          -4082003173.641316, 10774905663.51142, -15171875531.51559,
          12053065338.62167, -5124939663.577472, 913311935.9512032, 67.5,
        ],
        [
          0.00337398766765, 111320.7020202162, 4481351.045890365,
          -23393751.19931662, 79682215.47186455, -115964993.2797253,
          97236711.15602145, -43661946.33752821, 8477230.501135234, 52.5,
        ],
        [
          0.00220636496208, 111320.7020209128, 51751.86112841131,
          3796837.749470245, 992013.7397791013, -1221952.21711287,
          1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5,
        ],
        [
          -0.0003441963504368392, 111320.7020576856, 278.2353980772752,
          2485758.690035394, 6070.750963243378, 54821.18345352118,
          9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5,
        ],
        [
          -0.0003218135878613132, 111320.7020701615, 0.00369383431289,
          823725.6402795718, 0.46104986909093, 2351.343141331292,
          1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45,
        ],
      ],
      Z1: function (t, e) {
        return t && e && (t = this.Fb(t))
          ? ((i = this.Tk(t.lng)),
            (r = this.Tk(t.lat)),
            (e = this.Fb(e))
              ? this.Pe(i, this.Tk(e.lng), r, this.Tk(e.lat))
              : 0)
          : 0;
        var i, r;
      },
      Vo: function (t, e) {
        return t && e
          ? ((t.lng = this.JD(t.lng, -180, 180)),
            (t.lat = this.ND(t.lat, -74, 74)),
            (e.lng = this.JD(e.lng, -180, 180)),
            (e.lat = this.ND(e.lat, -74, 74)),
            this.Pe(
              this.Tk(t.lng),
              this.Tk(e.lng),
              this.Tk(t.lat),
              this.Tk(e.lat)
            ))
          : 0;
      },
      Fb: function (t) {
        if (t === v || t === d) return new M(0, 0);
        var e, i;
        e = new M(Math.abs(t.lng), Math.abs(t.lat));
        for (var r = 0; r < this.lG.length; r++)
          if (e.lat >= this.lG[r]) {
            i = this.fP[r];
            break;
          }
        return new M((t = this.gK(t, i)).lng.toFixed(6), t.lat.toFixed(6));
      },
      Eb: function (t) {
        if (
          t === v ||
          t === d ||
          180 < t.lng ||
          -180 > t.lng ||
          90 < t.lat ||
          -90 > t.lat
        )
          return new M(0, 0);
        var e, i;
        (t.lng = this.JD(t.lng, -180, 180)),
          (t.lat = this.ND(t.lat, -74, 74)),
          (e = new M(t.lng, t.lat));
        for (var r = 0; r < this.Au.length; r++)
          if (e.lat >= this.Au[r]) {
            i = this.iG[r];
            break;
          }
        if (!i)
          for (r = 0; r < this.Au.length; r++)
            if (e.lat <= -this.Au[r]) {
              i = this.iG[r];
              break;
            }
        return new M((t = this.gK(t, i)).lng.toFixed(2), t.lat.toFixed(2));
      },
      gK: function (t, e) {
        if (t && e) {
          var i = e[0] + e[1] * Math.abs(t.lng),
            r = Math.abs(t.lat) / e[9];
          r =
            e[2] +
            e[3] * r +
            e[4] * r * r +
            e[5] * r * r * r +
            e[6] * r * r * r * r +
            e[7] * r * r * r * r * r +
            e[8] * r * r * r * r * r * r;
          return new M(
            (i = i * (0 > t.lng ? -1 : 1)),
            (r = r * (0 > t.lat ? -1 : 1))
          );
        }
      },
      Pe: function (t, e, i, r) {
        return (
          this.$O *
          Math.acos(
            Math.sin(i) * Math.sin(r) +
              Math.cos(i) * Math.cos(r) * Math.cos(e - t)
          )
        );
      },
      Tk: function (t) {
        return (Math.PI * t) / 180;
      },
      Z3: function (t) {
        return (180 * t) / Math.PI;
      },
      ND: function (t, e, i) {
        return (
          e != v && (t = Math.max(t, e)), i != v && (t = Math.min(t, i)), t
        );
      },
      JD: function (t, e, i) {
        for (; t > i; ) t -= i - e;
        for (; t < e; ) t += i - e;
        return t;
      },
    }),
    m(y.prototype, {
      Jm: function (t) {
        return y.Eb(t);
      },
      nh: function (t) {
        return new x((t = y.Eb(t)).lng, t.lat);
      },
      qh: function (t) {
        return y.Fb(t);
      },
      wi: function (t) {
        return (t = new M(t.x, t.y)), y.Fb(t);
      },
      fc: function (t, e, i, r, o) {
        if (t)
          return (
            (t = this.Jm(t, o)),
            (e = this.Lc(e)),
            new x(
              Math.round((t.lng - i.lng) / e + r.width / 2),
              Math.round((i.lat - t.lat) / e + r.height / 2)
            )
          );
      },
      zb: function (t, e, i, r, o) {
        if (t)
          return (
            (e = this.Lc(e)),
            this.qh(
              new M(
                i.lng + e * (t.x - r.width / 2),
                i.lat - e * (t.y - r.height / 2)
              ),
              o
            )
          );
      },
      Lc: function (t) {
        return Math.pow(2, 18 - t);
      },
    });
  var b = y.prototype;
  !(function (t, e) {
    for (var i in e) t[i] = e[i];
  })(b, { lngLatToPoint: b.nh, pointToLngLat: b.wi });
  let T = { Point: M, Pixel: x, MercatorProjection: y };
  class w {
    constructor(t, e) {
      (this.levelMax = t),
        (this.levelMin = e),
        (this.projection = new T.MercatorProjection());
    }
    _getRetain(t) {
      return Math.pow(2, t - 18);
    }
    getResolution(t, e) {
      return Math.pow(2, 18 - e) * Math.cos(t);
    }
    lnglatToPoint(t, e) {
      let i = new T.Point(t, e),
        r = this.projection.lngLatToPoint(i);
      return { pointX: r.x, pointY: r.y };
    }
    pointToLnglat(t, e) {
      let i = new T.Pixel(t, e),
        r = this.projection.pointToLngLat(i);
      return { lng: r.lng, lat: r.lat };
    }
    _lngToTileX(t, e) {
      let i = this.lnglatToPoint(t, 0);
      return Math.floor((i.pointX * this._getRetain(e)) / 256);
    }
    _latToTileY(t, e) {
      let i = this.lnglatToPoint(0, t);
      return Math.floor((i.pointY * this._getRetain(e)) / 256);
    }
    lnglatToTile(t, e, i) {
      return [this._lngToTileX(t, i), this._latToTileY(e, i)];
    }
    _lngToPixelX(t, e) {
      let i = this._lngToTileX(t, e),
        r = this.lnglatToPoint(t, 0);
      return Math.floor(r.pointX * this._getRetain(e) - 256 * i);
    }
    _latToPixelY(t, e) {
      let i = this._latToTileY(t, e),
        r = this.lnglatToPoint(0, t);
      return Math.floor(r.pointY * this._getRetain(e) - 256 * i);
    }
    lnglatToPixel(t, e, i) {
      return {
        pixelX: this._lngToPixelX(t, i),
        pixelY: this._latToPixelY(e, i),
      };
    }
    _pixelXToLng(t, e, i) {
      let r = (256 * e + t) / this._getRetain(i);
      return this.pointToLnglat(r, 0).lng;
    }
    _pixelYToLat(t, e, i) {
      let r = (256 * e + t) / this._getRetain(i);
      return this.pointToLnglat(0, r).lat;
    }
    pixelToLnglat(t, e, i, r, o) {
      let a = (256 * i + t) / this._getRetain(o),
        n = (256 * r + e) / this._getRetain(o),
        s = this.pointToLnglat(a, n);
      return [s.lng, s.lat];
    }
  }
  function P(t, e) {
    if (!(t instanceof e))
      throw new TypeError("Cannot call a class as a function");
  }
  function z(t, e) {
    for (var i = 0; i < e.length; i++) {
      var r = e[i];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(t, r.key, r);
    }
  }
  function j(t, e, i) {
    return (
      e && z(t.prototype, e),
      i && z(t, i),
      Object.defineProperty(t, "prototype", { writable: !1 }),
      t
    );
  }
  function S(t) {
    "@babel/helpers - typeof";
    return (S =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              "function" == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          })(t);
  }
  function L(t) {
    if (void 0 === t)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    return t;
  }
  function A(t) {
    return (A = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function E(t, e) {
    return (E = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return (t.__proto__ = e), t;
        })(t, e);
  }
  function F(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var i = 0, r = new Array(e); i < e; i++) r[i] = t[i];
    return r;
  }
  function R(t, e) {
    return (
      (function (t) {
        if (Array.isArray(t)) return t;
      })(t) ||
      (function (t, e) {
        var i =
          null == t
            ? null
            : ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
              t["@@iterator"];
        if (null != i) {
          var r,
            o,
            a = [],
            n = !0,
            s = !1;
          try {
            for (
              i = i.call(t);
              !(n = (r = i.next()).done) &&
              (a.push(r.value), !e || a.length !== e);
              n = !0
            );
          } catch (t) {
            (s = !0), (o = t);
          } finally {
            try {
              n || null == i.return || i.return();
            } finally {
              if (s) throw o;
            }
          }
          return a;
        }
      })(t, e) ||
      (function (t, e) {
        if (t) {
          if ("string" == typeof t) return F(t, e);
          var i = Object.prototype.toString.call(t).slice(8, -1);
          return (
            "Object" === i && t.constructor && (i = t.constructor.name),
            "Map" === i || "Set" === i
              ? Array.from(t)
              : "Arguments" === i ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)
              ? F(t, e)
              : void 0
          );
        }
      })(t, e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  var C,
    N = 1e-6,
    D = "undefined" != typeof Float32Array ? Float32Array : Array;
  function O(t, e, i) {
    var r = e[0],
      o = e[1],
      a = e[2],
      n = e[3];
    return (
      (t[0] = i[0] * r + i[4] * o + i[8] * a + i[12] * n),
      (t[1] = i[1] * r + i[5] * o + i[9] * a + i[13] * n),
      (t[2] = i[2] * r + i[6] * o + i[10] * a + i[14] * n),
      (t[3] = i[3] * r + i[7] * o + i[11] * a + i[15] * n),
      t
    );
  }
  function k(t, e) {
    var i,
      r,
      o,
      a = O([], e, t);
    return (
      (i = a),
      (r = a),
      (o = 1 / a[3]),
      (i[0] = r[0] * o),
      (i[1] = r[1] * o),
      (i[2] = r[2] * o),
      (i[3] = r[3] * o),
      a
    );
  }
  function I(t, e, i) {
    var r = e[0],
      o = e[1],
      a = e[2],
      n = e[3],
      s = e[4],
      h = e[5],
      l = e[6],
      u = e[7],
      c = e[8],
      p = e[9],
      f = e[10],
      m = e[11],
      g = e[12],
      d = e[13],
      v = e[14],
      M = e[15],
      x = i[0],
      _ = i[1],
      y = i[2],
      b = i[3];
    return (
      (t[0] = x * r + _ * s + y * c + b * g),
      (t[1] = x * o + _ * h + y * p + b * d),
      (t[2] = x * a + _ * l + y * f + b * v),
      (t[3] = x * n + _ * u + y * m + b * M),
      (x = i[4]),
      (_ = i[5]),
      (y = i[6]),
      (b = i[7]),
      (t[4] = x * r + _ * s + y * c + b * g),
      (t[5] = x * o + _ * h + y * p + b * d),
      (t[6] = x * a + _ * l + y * f + b * v),
      (t[7] = x * n + _ * u + y * m + b * M),
      (x = i[8]),
      (_ = i[9]),
      (y = i[10]),
      (b = i[11]),
      (t[8] = x * r + _ * s + y * c + b * g),
      (t[9] = x * o + _ * h + y * p + b * d),
      (t[10] = x * a + _ * l + y * f + b * v),
      (t[11] = x * n + _ * u + y * m + b * M),
      (x = i[12]),
      (_ = i[13]),
      (y = i[14]),
      (b = i[15]),
      (t[12] = x * r + _ * s + y * c + b * g),
      (t[13] = x * o + _ * h + y * p + b * d),
      (t[14] = x * a + _ * l + y * f + b * v),
      (t[15] = x * n + _ * u + y * m + b * M),
      t
    );
  }
  function U(t, e, i) {
    var r,
      o,
      a,
      n,
      s,
      h,
      l,
      u,
      c,
      p,
      f,
      m,
      g = i[0],
      d = i[1],
      v = i[2];
    return (
      e === t
        ? ((t[12] = e[0] * g + e[4] * d + e[8] * v + e[12]),
          (t[13] = e[1] * g + e[5] * d + e[9] * v + e[13]),
          (t[14] = e[2] * g + e[6] * d + e[10] * v + e[14]),
          (t[15] = e[3] * g + e[7] * d + e[11] * v + e[15]))
        : ((r = e[0]),
          (o = e[1]),
          (a = e[2]),
          (n = e[3]),
          (s = e[4]),
          (h = e[5]),
          (l = e[6]),
          (u = e[7]),
          (c = e[8]),
          (p = e[9]),
          (f = e[10]),
          (m = e[11]),
          (t[0] = r),
          (t[1] = o),
          (t[2] = a),
          (t[3] = n),
          (t[4] = s),
          (t[5] = h),
          (t[6] = l),
          (t[7] = u),
          (t[8] = c),
          (t[9] = p),
          (t[10] = f),
          (t[11] = m),
          (t[12] = r * g + s * d + c * v + e[12]),
          (t[13] = o * g + h * d + p * v + e[13]),
          (t[14] = a * g + l * d + f * v + e[14]),
          (t[15] = n * g + u * d + m * v + e[15])),
      t
    );
  }
  function X(t, e, i) {
    var r = i[0],
      o = i[1],
      a = i[2];
    return (
      (t[0] = e[0] * r),
      (t[1] = e[1] * r),
      (t[2] = e[2] * r),
      (t[3] = e[3] * r),
      (t[4] = e[4] * o),
      (t[5] = e[5] * o),
      (t[6] = e[6] * o),
      (t[7] = e[7] * o),
      (t[8] = e[8] * a),
      (t[9] = e[9] * a),
      (t[10] = e[10] * a),
      (t[11] = e[11] * a),
      (t[12] = e[12]),
      (t[13] = e[13]),
      (t[14] = e[14]),
      (t[15] = e[15]),
      t
    );
  }
  Math.hypot ||
    (Math.hypot = function () {
      for (var t = 0, e = arguments.length; e--; )
        t += arguments[e] * arguments[e];
      return Math.sqrt(t);
    }),
    (C = new D(4)),
    D != Float32Array && ((C[0] = 0), (C[1] = 0), (C[2] = 0), (C[3] = 0));
  var B = function (t, e, i, r, o) {
    var a,
      n = 1 / Math.tan(e / 2);
    return (
      (t[0] = n / i),
      (t[1] = 0),
      (t[2] = 0),
      (t[3] = 0),
      (t[4] = 0),
      (t[5] = n),
      (t[6] = 0),
      (t[7] = 0),
      (t[8] = 0),
      (t[9] = 0),
      (t[11] = -1),
      (t[12] = 0),
      (t[13] = 0),
      (t[15] = 0),
      null != o && o !== 1 / 0
        ? ((a = 1 / (r - o)), (t[10] = (o + r) * a), (t[14] = 2 * o * r * a))
        : ((t[10] = -1), (t[14] = -2 * r)),
      t
    );
  };
  function Z(t, e) {
    var i = t[0],
      r = t[1],
      o = t[2],
      a = t[3],
      n = t[4],
      s = t[5],
      h = t[6],
      l = t[7],
      u = t[8],
      c = t[9],
      p = t[10],
      f = t[11],
      m = t[12],
      g = t[13],
      d = t[14],
      v = t[15],
      M = e[0],
      x = e[1],
      _ = e[2],
      y = e[3],
      b = e[4],
      T = e[5],
      w = e[6],
      P = e[7],
      z = e[8],
      j = e[9],
      S = e[10],
      L = e[11],
      A = e[12],
      E = e[13],
      F = e[14],
      R = e[15];
    return (
      Math.abs(i - M) <= N * Math.max(1, Math.abs(i), Math.abs(M)) &&
      Math.abs(r - x) <= N * Math.max(1, Math.abs(r), Math.abs(x)) &&
      Math.abs(o - _) <= N * Math.max(1, Math.abs(o), Math.abs(_)) &&
      Math.abs(a - y) <= N * Math.max(1, Math.abs(a), Math.abs(y)) &&
      Math.abs(n - b) <= N * Math.max(1, Math.abs(n), Math.abs(b)) &&
      Math.abs(s - T) <= N * Math.max(1, Math.abs(s), Math.abs(T)) &&
      Math.abs(h - w) <= N * Math.max(1, Math.abs(h), Math.abs(w)) &&
      Math.abs(l - P) <= N * Math.max(1, Math.abs(l), Math.abs(P)) &&
      Math.abs(u - z) <= N * Math.max(1, Math.abs(u), Math.abs(z)) &&
      Math.abs(c - j) <= N * Math.max(1, Math.abs(c), Math.abs(j)) &&
      Math.abs(p - S) <= N * Math.max(1, Math.abs(p), Math.abs(S)) &&
      Math.abs(f - L) <= N * Math.max(1, Math.abs(f), Math.abs(L)) &&
      Math.abs(m - A) <= N * Math.max(1, Math.abs(m), Math.abs(A)) &&
      Math.abs(g - E) <= N * Math.max(1, Math.abs(g), Math.abs(E)) &&
      Math.abs(d - F) <= N * Math.max(1, Math.abs(d), Math.abs(F)) &&
      Math.abs(v - R) <= N * Math.max(1, Math.abs(v), Math.abs(R))
    );
  }
  function G(t, e, i) {
    return (t[0] = e[0] + i[0]), (t[1] = e[1] + i[1]), t;
  }
  function Y(t, e) {
    if (!t)
      throw new Error(e || "viewport-mercator-project: assertion failed.");
  }
  !(function () {
    var t,
      e = ((t = new D(2)), D != Float32Array && ((t[0] = 0), (t[1] = 0)), t);
  })(),
    (function () {
      var t,
        e =
          ((t = new D(3)),
          D != Float32Array && ((t[0] = 0), (t[1] = 0), (t[2] = 0)),
          t);
    })();
  var q = Math.PI,
    K = q / 4,
    W = q / 180,
    J = 180 / q,
    V = 512,
    H = 4003e4,
    $ = 1.5;
  function Q(t) {
    return Math.pow(2, t);
  }
  function tt(t, e) {
    var i = R(t, 2),
      r = i[0],
      o = i[1];
    Y(Number.isFinite(r) && Number.isFinite(e)),
      Y(Number.isFinite(o) && o >= -90 && o <= 90, "invalid latitude");
    var a = o * W;
    return [
      ((e *= V) * (r * W + q)) / (2 * q),
      (e * (q - Math.log(Math.tan(K + 0.5 * a)))) / (2 * q),
    ];
  }
  function et(t, e) {
    var i = R(t, 2),
      r = i[0],
      o = i[1],
      a = (r / (e *= V)) * (2 * q) - q,
      n = 2 * (Math.atan(Math.exp(q - (o / e) * (2 * q))) - K);
    return [a * J, n * J];
  }
  function it(t) {
    var e,
      i,
      r,
      o,
      a,
      n,
      s,
      h,
      l,
      u,
      c,
      p,
      f,
      m = t.height,
      g = t.pitch,
      d = t.bearing,
      v = t.altitude,
      M = t.center,
      x = void 0 === M ? null : M,
      _ = t.flipY,
      y = void 0 !== _ && _,
      b = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    return (
      U(b, b, [0, 0, -v]),
      X(b, b, [1, 1, 1 / m]),
      (e = b),
      (i = b),
      (r = -g * W),
      (o = Math.sin(r)),
      (a = Math.cos(r)),
      (n = i[4]),
      (s = i[5]),
      (h = i[6]),
      (l = i[7]),
      (u = i[8]),
      (c = i[9]),
      (p = i[10]),
      (f = i[11]),
      i !== e &&
        ((e[0] = i[0]),
        (e[1] = i[1]),
        (e[2] = i[2]),
        (e[3] = i[3]),
        (e[12] = i[12]),
        (e[13] = i[13]),
        (e[14] = i[14]),
        (e[15] = i[15])),
      (e[4] = n * a + u * o),
      (e[5] = s * a + c * o),
      (e[6] = h * a + p * o),
      (e[7] = l * a + f * o),
      (e[8] = u * a - n * o),
      (e[9] = c * a - s * o),
      (e[10] = p * a - h * o),
      (e[11] = f * a - l * o),
      (function (t, e, i) {
        var r = Math.sin(i),
          o = Math.cos(i),
          a = e[0],
          n = e[1],
          s = e[2],
          h = e[3],
          l = e[4],
          u = e[5],
          c = e[6],
          p = e[7];
        e !== t &&
          ((t[8] = e[8]),
          (t[9] = e[9]),
          (t[10] = e[10]),
          (t[11] = e[11]),
          (t[12] = e[12]),
          (t[13] = e[13]),
          (t[14] = e[14]),
          (t[15] = e[15])),
          (t[0] = a * o + l * r),
          (t[1] = n * o + u * r),
          (t[2] = s * o + c * r),
          (t[3] = h * o + p * r),
          (t[4] = l * o - a * r),
          (t[5] = u * o - n * r),
          (t[6] = c * o - s * r),
          (t[7] = p * o - h * r);
      })(b, b, d * W),
      y && X(b, b, [1, -1, 1]),
      x &&
        U(
          b,
          b,
          (function (t, e) {
            return (t[0] = -e[0]), (t[1] = -e[1]), (t[2] = -e[2]), t;
          })([], x)
        ),
      b
    );
  }
  function rt(t) {
    var e = t.width,
      i = t.height,
      r = t.pitch,
      o = (function (t) {
        var e = t.width,
          i = t.height,
          r = t.altitude,
          o = void 0 === r ? $ : r,
          a = t.pitch,
          n = void 0 === a ? 0 : a,
          s = t.nearZMultiplier,
          h = void 0 === s ? 1 : s,
          l = t.farZMultiplier,
          u = void 0 === l ? 1 : l,
          c = n * W,
          p = Math.atan(0.5 / o),
          f = (Math.sin(p) * o) / Math.sin(Math.PI / 2 - c - p),
          m = Math.cos(Math.PI / 2 - c) * f + o;
        return {
          fov: 2 * Math.atan(i / 2 / o),
          aspect: e / i,
          focalDistance: o,
          near: h,
          far: m * u,
        };
      })({
        width: e,
        height: i,
        altitude: t.altitude,
        pitch: r,
        nearZMultiplier: t.nearZMultiplier,
        farZMultiplier: t.farZMultiplier,
      }),
      a = o.fov,
      n = o.aspect,
      s = o.near,
      h = o.far;
    return B([], a, n, s, h);
  }
  function ot(t, e) {
    var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
      r = R(t, 3),
      o = r[0],
      a = r[1],
      n = r[2];
    if (
      (Y(Number.isFinite(o) && Number.isFinite(a), "invalid pixel coordinate"),
      Number.isFinite(n))
    )
      return k(e, [o, a, n, 1]);
    var s = k(e, [o, a, 0, 1]),
      h = k(e, [o, a, 1, 1]),
      l = s[2],
      u = h[2];
    return (function (t, e, i, r) {
      var o = e[0],
        a = e[1];
      return (t[0] = o + r * (i[0] - o)), (t[1] = a + r * (i[1] - a)), t;
    })([], s, h, l === u ? 0 : ((i || 0) - l) / (u - l));
  }
  var at = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    nt = (function () {
      function t() {
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          i = e.width,
          r = e.height,
          o = e.viewMatrix,
          a = void 0 === o ? at : o,
          n = e.projectionMatrix,
          s = void 0 === n ? at : n;
        P(this, t),
          (this.width = i || 1),
          (this.height = r || 1),
          (this.scale = 1),
          (this.pixelsPerMeter = 1),
          (this.viewMatrix = a),
          (this.projectionMatrix = s);
        var h = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        I(h, h, this.projectionMatrix),
          I(h, h, this.viewMatrix),
          (this.viewProjectionMatrix = h);
        var l = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        X(l, l, [this.width / 2, -this.height / 2, 1]),
          U(l, l, [1, -1, 0]),
          I(l, l, this.viewProjectionMatrix);
        var u,
          c,
          p,
          f,
          m,
          g,
          d,
          v,
          M,
          x,
          _,
          y,
          b,
          T,
          w,
          z,
          j,
          S,
          L,
          A,
          E,
          F,
          R,
          C,
          N,
          D,
          O,
          k,
          B,
          Z,
          G,
          Y =
            ((u = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
            (p = (c = l)[0]),
            (f = c[1]),
            (m = c[2]),
            (g = c[3]),
            (d = c[4]),
            (v = c[5]),
            (M = c[6]),
            (x = c[7]),
            (_ = c[8]),
            (y = c[9]),
            (b = c[10]),
            (T = c[11]),
            (w = c[12]),
            (z = c[13]),
            (j = c[14]),
            (S = c[15]),
            (G =
              (L = p * v - f * d) * (Z = b * S - T * j) -
              (A = p * M - m * d) * (B = y * S - T * z) +
              (E = p * x - g * d) * (k = y * j - b * z) +
              (F = f * M - m * v) * (O = _ * S - T * w) -
              (R = f * x - g * v) * (D = _ * j - b * w) +
              (C = m * x - g * M) * (N = _ * z - y * w))
              ? ((G = 1 / G),
                (u[0] = (v * Z - M * B + x * k) * G),
                (u[1] = (m * B - f * Z - g * k) * G),
                (u[2] = (z * C - j * R + S * F) * G),
                (u[3] = (b * R - y * C - T * F) * G),
                (u[4] = (M * O - d * Z - x * D) * G),
                (u[5] = (p * Z - m * O + g * D) * G),
                (u[6] = (j * E - w * C - S * A) * G),
                (u[7] = (_ * C - b * E + T * A) * G),
                (u[8] = (d * B - v * O + x * N) * G),
                (u[9] = (f * O - p * B - g * N) * G),
                (u[10] = (w * R - z * E + S * L) * G),
                (u[11] = (y * E - _ * R - T * L) * G),
                (u[12] = (v * D - d * k - M * N) * G),
                (u[13] = (p * k - f * D + m * N) * G),
                (u[14] = (z * A - w * F - j * L) * G),
                (u[15] = (_ * F - y * A + b * L) * G),
                u)
              : null);
        if (!Y) throw new Error("Pixel project matrix not invertible");
        (this.pixelProjectionMatrix = l),
          (this.pixelUnprojectionMatrix = Y),
          (this.equals = this.equals.bind(this)),
          (this.project = this.project.bind(this)),
          (this.unproject = this.unproject.bind(this)),
          (this.projectPosition = this.projectPosition.bind(this)),
          (this.unprojectPosition = this.unprojectPosition.bind(this)),
          (this.projectFlat = this.projectFlat.bind(this)),
          (this.unprojectFlat = this.unprojectFlat.bind(this));
      }
      return (
        j(t, [
          {
            key: "equals",
            value: function (e) {
              return (
                e instanceof t &&
                e.width === this.width &&
                e.height === this.height &&
                Z(e.projectionMatrix, this.projectionMatrix) &&
                Z(e.viewMatrix, this.viewMatrix)
              );
            },
          },
          {
            key: "project",
            value: function (t) {
              var e = (
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {}
                ).topLeft,
                i = void 0 === e || e,
                r = (function (t, e) {
                  var i = R(t, 3),
                    r = i[0],
                    o = i[1],
                    a = i[2],
                    n = void 0 === a ? 0 : a;
                  return (
                    Y(
                      Number.isFinite(r) &&
                        Number.isFinite(o) &&
                        Number.isFinite(n)
                    ),
                    k(e, [r, o, n, 1])
                  );
                })(this.projectPosition(t), this.pixelProjectionMatrix),
                o = R(r, 2),
                a = o[0],
                n = o[1],
                s = i ? n : this.height - n;
              return 2 === t.length ? [a, s] : [a, s, r[2]];
            },
          },
          {
            key: "unproject",
            value: function (t) {
              var e =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                i = e.topLeft,
                r = void 0 === i || i,
                o = e.targetZ,
                a = R(t, 3),
                n = a[0],
                s = a[1],
                h = a[2],
                l = r ? s : this.height - s,
                u = o && o * this.pixelsPerMeter,
                c = ot([n, l, h], this.pixelUnprojectionMatrix, u),
                p = R(this.unprojectPosition(c), 3),
                f = p[0],
                m = p[1],
                g = p[2];
              return Number.isFinite(h)
                ? [f, m, g]
                : Number.isFinite(o)
                ? [f, m, o]
                : [f, m];
            },
          },
          {
            key: "projectPosition",
            value: function (t) {
              var e = R(this.projectFlat(t), 2);
              return [e[0], e[1], (t[2] || 0) * this.pixelsPerMeter];
            },
          },
          {
            key: "unprojectPosition",
            value: function (t) {
              var e = R(this.unprojectFlat(t), 2);
              return [e[0], e[1], (t[2] || 0) / this.pixelsPerMeter];
            },
          },
          {
            key: "projectFlat",
            value: function (t) {
              return (
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : this.scale,
                t
              );
            },
          },
          {
            key: "unprojectFlat",
            value: function (t) {
              return (
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : this.scale,
                t
              );
            },
          },
        ]),
        t
      );
    })();
  function st(t) {
    var e = t.width,
      i = t.height,
      r = t.bounds,
      o = t.minExtent,
      a = void 0 === o ? 0 : o,
      n = t.maxZoom,
      s = void 0 === n ? 24 : n,
      h = t.padding,
      l = void 0 === h ? 0 : h,
      u = t.offset,
      c = void 0 === u ? [0, 0] : u,
      p = R(r, 2),
      f = R(p[0], 2),
      m = f[0],
      g = f[1],
      d = R(p[1], 2),
      v = d[0],
      M = d[1];
    if (Number.isFinite(l)) {
      l = { top: l, bottom: l, left: l, right: l };
    } else Y(Number.isFinite(l.top) && Number.isFinite(l.bottom) && Number.isFinite(l.left) && Number.isFinite(l.right));
    var x = new ht({ width: e, height: i, longitude: 0, latitude: 0, zoom: 0 }),
      _ = x.project([m, M]),
      y = x.project([v, g]),
      b = [
        Math.max(Math.abs(y[0] - _[0]), a),
        Math.max(Math.abs(y[1] - _[1]), a),
      ],
      T = [
        e - l.left - l.right - 2 * Math.abs(c[0]),
        i - l.top - l.bottom - 2 * Math.abs(c[1]),
      ];
    Y(T[0] > 0 && T[1] > 0);
    var w = T[0] / b[0],
      P = T[1] / b[1],
      z = (l.right - l.left) / 2 / w,
      j = (l.bottom - l.top) / 2 / P,
      S = [(y[0] + _[0]) / 2 + z, (y[1] + _[1]) / 2 + j],
      L = x.unproject(S),
      A = x.zoom + Math.log2(Math.abs(Math.min(w, P)));
    return { longitude: L[0], latitude: L[1], zoom: Math.min(A, s) };
  }
  var ht = (function (t) {
    function e() {
      var t,
        i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        r = i.width,
        o = i.height,
        a = i.latitude,
        n = void 0 === a ? 0 : a,
        s = i.longitude,
        h = void 0 === s ? 0 : s,
        l = i.zoom,
        u = void 0 === l ? 0 : l,
        c = i.pitch,
        p = void 0 === c ? 0 : c,
        f = i.bearing,
        m = void 0 === f ? 0 : f,
        g = i.altitude,
        d = void 0 === g ? 1.5 : g,
        v = i.nearZMultiplier,
        M = i.farZMultiplier;
      P(this, e), (r = r || 1), (o = o || 1);
      var x = Q(u);
      d = Math.max(0.75, d);
      var _ = tt([h, n], x);
      _[2] = 0;
      var y = rt({
          width: r,
          height: o,
          pitch: p,
          bearing: m,
          altitude: d,
          nearZMultiplier: v || 1 / o,
          farZMultiplier: M || 1.01,
        }),
        b = it({
          height: o,
          center: _,
          pitch: p,
          bearing: m,
          altitude: d,
          flipY: !0,
        });
      return (
        ((t = (function (t, e) {
          if (e && ("object" === S(e) || "function" == typeof e)) return e;
          if (void 0 !== e)
            throw new TypeError(
              "Derived constructors may only return object or undefined"
            );
          return L(t);
        })(
          this,
          A(e).call(this, {
            width: r,
            height: o,
            viewMatrix: b,
            projectionMatrix: y,
          })
        )).latitude = n),
        (t.longitude = h),
        (t.zoom = u),
        (t.pitch = p),
        (t.bearing = m),
        (t.altitude = d),
        (t.scale = x),
        (t.center = _),
        (t.pixelsPerMeter = (function (t) {
          var e = t.latitude,
            i = t.longitude,
            r = t.zoom,
            o = t.scale,
            a = t.highPrecision,
            n = void 0 !== a && a;
          (o = void 0 !== o ? o : Q(r)),
            Y(Number.isFinite(e) && Number.isFinite(i) && Number.isFinite(o));
          var s = {},
            h = V * o,
            l = Math.cos(e * W),
            u = h / 360,
            c = u / l,
            p = h / H / l;
          if (
            ((s.pixelsPerMeter = [p, -p, p]),
            (s.metersPerPixel = [1 / p, -1 / p, 1 / p]),
            (s.pixelsPerDegree = [u, -c, p]),
            (s.degreesPerPixel = [1 / u, -1 / c, 1 / p]),
            n)
          ) {
            var f = (W * Math.tan(e * W)) / l,
              m = (u * f) / 2,
              g = (h / H) * f,
              d = (g / c) * p;
            (s.pixelsPerDegree2 = [0, -m, g]), (s.pixelsPerMeter2 = [d, 0, d]);
          }
          return s;
        })(L(L(t))).pixelsPerMeter[2]),
        Object.freeze(L(L(t))),
        t
      );
    }
    return (
      (function (t, e) {
        if ("function" != typeof e && null !== e)
          throw new TypeError(
            "Super expression must either be null or a function"
          );
        (t.prototype = Object.create(e && e.prototype, {
          constructor: { value: t, writable: !0, configurable: !0 },
        })),
          Object.defineProperty(t, "prototype", { writable: !1 }),
          e && E(t, e);
      })(e, nt),
      j(e, [
        {
          key: "projectFlat",
          value: function (t) {
            return tt(
              t,
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : this.scale
            );
          },
        },
        {
          key: "unprojectFlat",
          value: function (t) {
            return et(
              t,
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : this.scale
            );
          },
        },
        {
          key: "getMapCenterByLngLatPosition",
          value: function (t) {
            var e,
              i,
              r = t.lngLat,
              o = ot(t.pos, this.pixelUnprojectionMatrix),
              a = G(
                [],
                tt(r, this.scale),
                (((e = [])[0] = -(i = o)[0]), (e[1] = -i[1]), e)
              );
            return et(G([], this.center, a), this.scale);
          },
        },
        {
          key: "getLocationAtPoint",
          value: function (t) {
            var e = t.lngLat,
              i = t.pos;
            return this.getMapCenterByLngLatPosition({ lngLat: e, pos: i });
          },
        },
        {
          key: "fitBounds",
          value: function (t) {
            var i =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              r = this.width,
              o = this.height,
              a = st(Object.assign({ width: r, height: o, bounds: t }, i));
            return new e({
              width: r,
              height: o,
              longitude: a.longitude,
              latitude: a.latitude,
              zoom: a.zoom,
            });
          },
        },
      ]),
      e
    );
  })();
  const lt = Math.PI / 180,
    ut = 512,
    ct = 4003e4;
  function pt(t) {
    return Math.pow(2, t);
  }
  class ft {
    constructor(e, i, r) {
      (this.id = e),
        (this.type = "custom"),
        (this.renderingMode = "2d"),
        (this.url = i),
        (this.options = {
          subdomains: null,
          minZoom: 3,
          maxZoom: 18,
          tileType: "xyz",
        }),
        (function (e, i) {
          for (var r in (e.hasOwnProperty("options") ||
            (e.options = e.options ? t(e.options) : {}),
          i))
            e.options[r] = i[r] || e.options[r];
          e.options;
        })(this, r),
        this.program,
        (this.showTiles = []),
        (this.tileCache = {}),
        (this.gridCache = {}),
        this.matrix,
        this.map,
        this.isLayerShow,
        (this.transformBaidu = new w());
    }
    onAdd(t, e) {
      this.map = t;
      var i = e.createShader(e.VERTEX_SHADER);
      e.shaderSource(
        i,
        "uniform mat4 u_matrix;attribute vec2 a_pos;attribute vec2 a_TextCoord;varying vec2 v_TextCoord;const float TILE_SIZE = 512.0;const float PI = 3.1415926536;const float WORLD_SCALE = TILE_SIZE / (PI * 2.0);uniform float u_project_scale;uniform bool u_is_offset;uniform vec3 u_pixels_per_degree;uniform vec3 u_pixels_per_degree2;uniform vec3 u_pixels_per_meter;uniform vec2 u_viewport_center;uniform vec4 u_viewport_center_projection;uniform vec2 u_viewport_size;float project_scale(float meters) {    return meters * u_pixels_per_meter.z;}vec3 project_scale(vec3 position) {    return position * u_pixels_per_meter;}vec2 project_mercator(vec2 lnglat) {    float x = lnglat.x;    return vec2(    radians(x) + PI, PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5))    );}vec4 project_offset(vec4 offset) {    float dy = offset.y;    dy = clamp(dy, -1., 1.);    vec3 pixels_per_unit = u_pixels_per_degree + u_pixels_per_degree2 * dy;    return vec4(offset.xyz * pixels_per_unit, offset.w);}vec4 project_position(vec4 position) {    if (u_is_offset) {        float X = position.x - u_viewport_center.x;        float Y = position.y - u_viewport_center.y;        return project_offset(vec4(X, Y, position.z, position.w));    }    else {        return vec4(        project_mercator(position.xy) * WORLD_SCALE * u_project_scale, project_scale(position.z), position.w        );    }}vec4 project_to_clipping_space(vec3 position) {    vec4 project_pos = project_position(vec4(position, 1.0));    return u_matrix * project_pos + u_viewport_center_projection;}void main() {   vec4 project_pos = project_position(vec4(a_pos, 0.0, 1.0));   gl_Position = u_matrix * project_pos + u_viewport_center_projection;   v_TextCoord = a_TextCoord;}"
      ),
        e.compileShader(i);
      var r = e.createShader(e.FRAGMENT_SHADER);
      e.shaderSource(
        r,
        "precision mediump float;uniform sampler2D u_Sampler; varying vec2 v_TextCoord; void main() {   gl_FragColor = texture2D(u_Sampler, v_TextCoord);}"
      ),
        e.compileShader(r),
        (this.program = e.createProgram()),
        e.attachShader(this.program, i),
        e.attachShader(this.program, r),
        e.linkProgram(this.program),
        (this.a_Pos = e.getAttribLocation(this.program, "a_pos")),
        (this.a_TextCoord = e.getAttribLocation(this.program, "a_TextCoord")),
        (this.isLayerShow = !0),
        t.on("move", () => {
          this.isLayerShow && this.update(e, t);
        }),
        this.update(e, t);
    }
    update(t, e) {
      var i,
        r,
        o,
        a = e.getCenter(),
        n = e.getBounds();
      if ("xyz" === this.options.tileType) {
        i = parseInt(e.getZoom() + 1.4);
        var h = u(n.getNorthWest()),
          c = u(n.getSouthEast());
        (r = s(h.lng, h.lat, i)), (o = s(c.lng, c.lat, i));
      } else if ("bd09" === this.options.tileType) {
        i = parseInt(e.getZoom() + 1.8);
        var p = l(n.getSouthWest()),
          f = l(n.getNorthEast());
        (r = this.transformBaidu.lnglatToTile(p.lng, p.lat, i)),
          (o = this.transformBaidu.lnglatToTile(f.lng, f.lat, i));
      }
      for (var m = [], g = r[0]; g <= o[0]; g++)
        for (var d = r[1]; d <= o[1]; d++) {
          var v = { x: g, y: d, z: i };
          m.push(v),
            this.addGridCache(v, 0, 0),
            g === o[0] && this.addGridCache(v, 1, 0),
            d === o[1] && this.addGridCache(v, 0, 1),
            g === o[0] && d === o[1] && this.addGridCache(v, 1, 1);
        }
      if ("xyz" === this.options.tileType) var M = s(a.lng, a.lat, i);
      else
        "bd09" === this.options.tileType &&
          (M = this.transformBaidu.lnglatToTile(a.lng, a.lat, i));
      for (var v of (m.sort(
        (t, e) => this.tileDistance(t, M) - this.tileDistance(e, M)
      ),
      (this.showTiles = []),
      m))
        if (this.tileCache[this.createTileKey(v)])
          this.showTiles.push(this.tileCache[this.createTileKey(v)]);
        else {
          var x = this.createTile(t, v);
          this.showTiles.push(x), (this.tileCache[this.createTileKey(v)] = x);
        }
    }
    addGridCache(t, e, i) {
      var o = this.createTileKey(t.x + e, t.y + i, t.z);
      this.gridCache[o] ||
        ("xyz" === this.options.tileType
          ? (this.gridCache[o] = c(
              (function (t, e, i) {
                let o = Math.pow(2, i);
                return [
                  (t / o) * 360 - 180,
                  (180 * Math.atan(Math.sinh(r * (1 - (2 * e) / o)))) / r,
                ];
              })(t.x + e, t.y + i, t.z)
            ))
          : "bd09" === this.options.tileType &&
            (this.gridCache[o] = h(
              this.transformBaidu.pixelToLnglat(0, 0, t.x + e, t.y + i, t.z)
            )));
    }
    tileDistance(t, e) {
      return Math.sqrt(Math.pow(t.x - e[0], 2) + Math.pow(t.y - e[1], 2));
    }
    createTileKey(t, e, i) {
      return t instanceof Object
        ? t.z + "/" + t.x + "/" + t.y
        : i + "/" + t + "/" + e;
    }
    createTile(t, i) {
      var r,
        o,
        a,
        n,
        s,
        h,
        l =
          ((r = this.url),
          (o = {
            s: this.options.subdomains[
              Math.abs(i.x + i.y) % this.options.subdomains.length
            ],
            x: i.x,
            y: i.y,
            z: i.z,
          }),
          r.replace(e, function (t, e) {
            var i = o[e];
            if (void 0 === i)
              throw new Error("No value provided for variable " + t);
            return "function" == typeof i && (i = i(o)), i;
          })),
        u = { xyz: i };
      "xyz" === this.options.tileType
        ? ((a = this.gridCache[this.createTileKey(i)]),
          (n = this.gridCache[this.createTileKey(i.x + 1, i.y, i.z)]),
          (s = this.gridCache[this.createTileKey(i.x, i.y + 1, i.z)]),
          (h = this.gridCache[this.createTileKey(i.x + 1, i.y + 1, i.z)]))
        : "bd09" === this.options.tileType &&
          ((a = this.gridCache[this.createTileKey(i.x, i.y + 1, i.z)]),
          (n = this.gridCache[this.createTileKey(i.x + 1, i.y + 1, i.z)]),
          (s = this.gridCache[this.createTileKey(i)]),
          (h = this.gridCache[this.createTileKey(i.x + 1, i.y, i.z)]));
      var c = new Float32Array([
          a.lng,
          a.lat,
          0,
          1,
          s.lng,
          s.lat,
          0,
          0,
          n.lng,
          n.lat,
          1,
          1,
          h.lng,
          h.lat,
          1,
          0,
        ]),
        p = c.BYTES_PER_ELEMENT,
        f = t.createBuffer();
      t.bindBuffer(t.ARRAY_BUFFER, f),
        t.bufferData(t.ARRAY_BUFFER, c, t.STATIC_DRAW),
        (u.buffer = f),
        (u.PosParam = { size: 2, stride: 4 * p, offset: 0 }),
        (u.TextCoordParam = { size: 2, stride: 4 * p, offset: 2 * p });
      var m = new Image();
      return (
        (m.onload = () => {
          (u.texture = t.createTexture()),
            t.bindTexture(t.TEXTURE_2D, u.texture),
            t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, 1),
            t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, m),
            (u.isLoad = !0),
            this.map.triggerRepaint();
        }),
        (m.crossOrigin = !0),
        (m.src = l),
        u
      );
    }
    render(t, e) {
      if (
        !(
          this.map.getZoom() < this.options.minZoom ||
          this.map.getZoom() > this.options.maxZoom
        )
      )
        for (var i of ((this.matrix = e),
        t.useProgram(this.program),
        this.showTiles))
          if (i.isLoad) {
            t.bindTexture(t.TEXTURE_2D, i.texture),
              t.activeTexture(t.TEXTURE0),
              t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR),
              t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
              t.texParameteri(
                t.TEXTURE_2D,
                t.TEXTURE_WRAP_T,
                t.MIRRORED_REPEAT
              );
            var r = t.getUniformLocation(this.program, "u_Sampler");
            t.uniform1i(r, 0),
              t.bindBuffer(t.ARRAY_BUFFER, i.buffer),
              t.vertexAttribPointer(
                this.a_Pos,
                i.PosParam.size,
                t.FLOAT,
                !1,
                i.PosParam.stride,
                i.PosParam.offset
              ),
              t.vertexAttribPointer(
                this.a_TextCoord,
                i.TextCoordParam.size,
                t.FLOAT,
                !1,
                i.TextCoordParam.stride,
                i.TextCoordParam.offset
              ),
              t.enableVertexAttribArray(this.a_Pos),
              t.enableVertexAttribArray(this.a_TextCoord),
              this.setVertex(t),
              t.enable(t.BLEND),
              t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA),
              t.drawArrays(t.TRIANGLE_STRIP, 0, 4);
          }
    }
    setVertex(t) {
      const e = this.map.getZoom(),
        i = this.map.getBearing(),
        r = this.map.getPitch(),
        o = this.map.getCenter(),
        a = new ht({
          width: t.drawingBufferWidth,
          height: t.drawingBufferHeight,
          longitude: o.lng,
          latitude: o.lat,
          zoom: e,
          pitch: r,
          bearing: i,
        }),
        {
          viewProjectionMatrix: n,
          projectionMatrix: s,
          viewMatrix: h,
          viewMatrixUncentered: l,
        } = a;
      let u = {
        u_matrix: n,
        u_point_size: this.pointSize,
        u_is_offset: !1,
        u_pixels_per_degree: [0, 0, 0],
        u_pixels_per_degree2: [0, 0, 0],
        u_viewport_center: [0, 0],
        u_pixels_per_meter: [0, 0, 0],
        u_project_scale: pt(e),
        u_viewport_center_projection: [0, 0, 0, 0],
      };
      if (e > 12) {
        const { pixelsPerDegree: t, pixelsPerDegree2: i } = (function (t) {
            let {
              latitude: e = 0,
              zoom: i = 1,
              scale: r,
              highPrecision: o = !1,
            } = t;
            r = void 0 !== r ? r : pt(i);
            const a = {},
              n = ut * r * window.devicePixelRatio,
              s = Math.cos(e * lt),
              h = n / 360,
              l = h / s,
              u = n / ct / s;
            if (
              ((a.pixelsPerMeter = [u, -u, u]),
              (a.metersPerPixel = [1 / u, -1 / u, 1 / u]),
              (a.pixelsPerDegree = [h, -l, u]),
              (a.degreesPerPixel = [1 / h, -1 / l, 1 / u]),
              o)
            ) {
              const t = (lt * Math.tan(e * lt)) / s,
                i = (h * t) / 2,
                r = (n / ct) * t,
                o = (r / l) * u;
              (a.pixelsPerDegree2 = [0, -i, r]),
                (a.pixelsPerMeter2 = [o, 0, o]);
            }
            return a;
          })({ longitude: o.lng, latitude: o.lat, zoom: e, highPrecision: !0 }),
          r = a.projectFlat(
            [Math.fround(o.lng), Math.fround(o.lat)],
            Math.pow(2, e)
          ),
          c = O([], [r[0], r[1], 0, 1], n);
        let p = I([], s, l || h);
        (p = I([], p, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0])),
          (u.u_matrix = p),
          (u.u_is_offset = !0),
          (u.u_viewport_center = [Math.fround(o.lng), Math.fround(o.lat)]),
          (u.u_viewport_center_projection = c),
          (u.u_pixels_per_degree = t && t.map((t) => Math.fround(t))),
          (u.u_pixels_per_degree2 = i && i.map((t) => Math.fround(t)));
      }
      t.uniformMatrix4fv(
        t.getUniformLocation(this.program, "u_matrix"),
        !1,
        u.u_matrix
      ),
        t.uniform1f(
          t.getUniformLocation(this.program, "u_project_scale"),
          u.u_project_scale
        ),
        t.uniform1i(
          t.getUniformLocation(this.program, "u_is_offset"),
          u.u_is_offset ? 1 : 0
        ),
        t.uniform3fv(
          t.getUniformLocation(this.program, "u_pixels_per_degree"),
          u.u_pixels_per_degree
        ),
        t.uniform3fv(
          t.getUniformLocation(this.program, "u_pixels_per_degree2"),
          u.u_pixels_per_degree2
        ),
        t.uniform3fv(
          t.getUniformLocation(this.program, "u_pixels_per_meter"),
          u.u_pixels_per_meter
        ),
        t.uniform2fv(
          t.getUniformLocation(this.program, "u_viewport_center"),
          u.u_viewport_center
        ),
        t.uniform4fv(
          t.getUniformLocation(this.program, "u_viewport_center_projection"),
          u.u_viewport_center_projection
        );
    }
    onRemove(t, e) {
      this.isLayerShow = !1;
    }
  }
  return function (t, e, i) {
    var r,
      o = i || {},
      a = {
        TianDiTu: {
          Normal: {
            Map: "http://t{s}.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion:
              "http://t{s}.tianditu.com/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={key}",
            minzoom: 0,
            maxzoom: 18,
          },
          Satellite: {
            Map: "http://t{s}.tianditu.com/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion:
              "http://t{s}.tianditu.com/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={key}",
            minzoom: 0,
            maxzoom: 18,
          },
          Terrain: {
            Map: "http://t{s}.tianditu.com/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion:
              "http://t{s}.tianditu.com/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk={key}",
            minzoom: 0,
            maxzoom: 14,
          },
          Subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
          key: "",
        },
        GaoDe: {
          Normal: {
            Map: "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
            minzoom: 3,
            maxzoom: 18,
          },
          Normal_NoTag: {
            Map: "https://wprd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&scl=1&ltype=11&x={x}&y={y}&z={z}",
            minzoom: 3,
            maxzoom: 18,
          },
          Satellite: {
            Map: "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
            Annotion:
              "http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
            minzoom: 3,
            maxzoom: 18,
          },
          Subdomains: ["1", "2", "3", "4"],
        },
        Baidu: {
          Normal: {
            Map: "//online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1",
          },
          Satellite: {
            Map: "//shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
            Annotion:
              "//online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl&v=020",
          },
          Subdomains: "0123456789",
          tileType: "bd09",
        },
        Geoq: {
          Normal: {
            Map: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
            PurplishBlue:
              "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
            Gray: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
            Warm: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
            minzoom: 3,
            maxzoom: 16,
          },
          Subdomains: [],
        },
        OSM: {
          Normal: {
            Map: "//{s}.tile.osm.org/{z}/{x}/{y}.png",
            minzoom: 0,
            maxzoom: 18,
          },
          Subdomains: ["a", "b", "c"],
        },
        Custom: {
          WMTS: { URL: "custom/{z}/{x}/{y}.png", minzoom: 0, maxzoom: 20 },
          TMS: { URL: "custom/{z}/{x}/{y}.png", minzoom: 0, maxzoom: 20 },
          Subdomains: ["0", "1", "2", "3"],
        },
      },
      n = e.split("."),
      s = n[0],
      h = n[1],
      l = n[2],
      u = a[s][h][l],
      c = a[s].Subdomains,
      p = a[s][h].minzoom,
      f = a[s][h].maxzoom,
      m = a[s].tileType;
    if (
      ("Custom" === s &&
        ((u = o.url ? o.url : u),
        (p = o.minzoom ? o.minzoom : 0),
        (f = o.maxzoom ? o.maxzoom : 20),
        (m = o.scheme ? o.scheme : "xyz")),
      "TianDiTu" === s || "OSM" === s)
    ) {
      var g = o.key || a[s].key,
        d = [];
      for (var v of c) d.push(u.replace("{s}", v).replace("{key}", g));
      r = {
        id: t,
        type: "raster",
        source: {
          type: "raster",
          tiles: d,
          tileSize: 256,
          minzoom: p,
          maxzoom: f,
        },
      };
    } else r = new ft(t, u, { subdomains: c, minZoom: p, maxZoom: f, tileType: m });
    return r;
  };
});
