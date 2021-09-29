(() => {
  "use strict";
  var e = {
      d: (t, n) => {
        for (var r in n)
          e.o(n, r) &&
            !e.o(t, r) &&
            Object.defineProperty(t, r, { enumerable: !0, get: n[r] });
      },
      o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
      r: e => {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }
    },
    t = {};
  e.r(t), e.d(t, { Layer: () => U, LayerType: () => l, LoadStatus: () => a });
  var n = (window.Zondy = window.Zondy || {});
  (n.Event = n.Event || {}),
    (n.Object = n.Object || {}),
    (n.Object.ContourAnalyse = n.Object.ContourAnalyse || {}),
    (n.Object.Theme = n.Object.Theme || {}),
    (n.Theme = n.Theme || {}),
    (n.Service = n.Service || {}),
    (n.Socket = n.Socket || {}),
    (n.Enum = n.Enum || {}),
    (n.Enum.Net = n.Enum.Net || {}),
    (n.Enum.Theme = n.Enum.Theme || {}),
    (n.Enum.Map = n.Enum.Map || {}),
    (n.Catalog = n.Catalog || {}),
    (n.Util = n.Util || {}),
    (n.CRS = n.CRS || {}),
    (n.Map = n.Map || {}),
    (n.xsd = n.xsd || {}),
    (n.XLink = n.XLink || {}),
    (n.extent = n.extent || {}),
    (n.xml = n.xml || {}),
    (n.array = n.array || {}),
    (n.string = n.string || {}),
    (n.LevelRenderer = n.LevelRenderer || {}),
    (n.LevelRenderer.Tool = n.LevelRenderer.Tool || {}),
    (n.LevelRenderer.Animation = n.LevelRenderer.Animation || {}),
    (n.Feature = n.Feature || {}),
    (n.Feature.ShapeParameters = n.Feature.ShapeParameters || {}),
    (n.Geometry = n.Geometry || {}),
    (n.Client = n.Client || {}),
    (n.Source = n.Source || {}),
    (n.GeomInteraction = n.GeomInteraction || {}),
    (n.Format = n.Format || {}),
    (n.Control = n.Control || {}),
    (n.OGC = n.OGC || {}),
    (n.DataStore = n.DataStore || {}),
    (n.DataStore.ElasticSearch = n.DataStore.ElasticSearch || {}),
    (n.DataStore.PostGIS = n.DataStore.PostGIS || {}),
    (n.DataStore.Hbase = n.DataStore.Hbase || {}),
    (n.DataStore.MongoDB = n.DataStore.MongoDB || {}),
    (n.CloudDisk = n.CloudDisk || {}),
    (n.CloudDisk.GisCore = n.CloudDisk.GisCore || {}),
    (n.CloudDisk.Model = n.CloudDisk.Model || {}),
    (n.IGServerX = n.IGServerX || {}),
    (n.IGServerX.Vector = n.IGServerX.Vector || {});
  var r,
    o,
    i,
    a,
    l,
    c = function(e, t) {
      if (((e = e || {}), t)) {
        for (var n in t) {
          var r = t[n];
          void 0 !== r && (e[n] = r);
        }
        !("function" == typeof window.Event && t instanceof window.Event) &&
          t.hasOwnProperty &&
          t.hasOwnProperty("toString") &&
          (e.toString = t.toString);
      }
      return e;
    },
    s = function(e, t) {
      var n,
        r = Object.prototype.toString;
      for (n in ((e = e || {}), t))
        t.hasOwnProperty(n) &&
          ("object" == typeof t[n]
            ? (("[object Null]" !== r.call(e[n]) &&
                "[object Undefined]" !== r.call(e[n])) ||
                (e[n] = "[object Array]" === r.call(t[n]) ? [] : {}),
              s(e[n], t[n]))
            : (e[n] = t[n]),
          ("" !== t[n] && null !== t[n]) || (e[n] = t[n]));
      return e;
    },
    u =
      -1 === (r = navigator.userAgent.toLowerCase()).indexOf("webkit") &&
      -1 !== r.indexOf("gecko"),
    f = (function() {
      var e,
        t = "",
        n = "",
        r = "pc",
        o = navigator.userAgent.toLowerCase();
      return (
        o.indexOf("msie") > -1 ||
        (o.indexOf("trident") > -1 && o.indexOf("rv") > -1)
          ? ((t = "msie"),
            (e = o.match(/msie ([\d.]+)/) || o.match(/rv:([\d.]+)/)))
          : o.indexOf("chrome") > -1
          ? ((t = "chrome"), (e = o.match(/chrome\/([\d.]+)/)))
          : o.indexOf("firefox") > -1
          ? ((t = "firefox"), (e = o.match(/firefox\/([\d.]+)/)))
          : o.indexOf("opera") > -1
          ? ((t = "opera"), (e = o.match(/version\/([\d.]+)/)))
          : o.indexOf("safari") > -1 &&
            ((t = "safari"), (e = o.match(/version\/([\d.]+)/))),
        (n = e ? e[1] : ""),
        o.indexOf("ipad") > -1 ||
        o.indexOf("ipod") > -1 ||
        o.indexOf("iphone") > -1
          ? (r = "apple")
          : o.indexOf("android") > -1 &&
            ((n = (e = o.match(/version\/([\d.]+)/)) ? e[1] : ""),
            (r = "android")),
        { name: t, version: n, device: r }
      );
    })(),
    p = function() {
      return f;
    },
    y =
      ((o = !0),
      (i = p()),
      document.createElement("canvas").getContext
        ? ("firefox" === i.name && parseFloat(i.version) < 5 && (o = !1),
          "safari" === i.name && parseFloat(i.version) < 4 && (o = !1),
          "opera" === i.name && parseFloat(i.version) < 10 && (o = !1),
          "msie" === i.name && parseFloat(i.version) < 9 && (o = !1))
        : (o = !1),
      o),
    d = function(e) {
      var t = e;
      if (null == t) return null;
      switch (t.constructor) {
        case String:
          return (t = (t = (t = (t = (t = (t =
            '"' + t.replace(/(["\\])/g, "\\$1") + '"').replace(
            /\n/g,
            "\\n"
          )).replace(/\r/g, "\\r")).replace("<", "&lt;")).replace(
            ">",
            "&gt;"
          )).replace(/%/g, "%25")).replace(/&/g, "%26");
        case Array:
          for (var n = [], r = 0, o = t.length; r < o; r++) n.push(d(t[r]));
          return "[" + n.join(",") + "]";
        case Number:
          return isFinite(t) ? String(t) : null;
        case Boolean:
          return String(t);
        case Date:
          return (
            "{'__type':\"System.DateTime\",'Year':" +
            t.getFullYear() +
            ",'Month':" +
            (t.getMonth() + 1) +
            ",'Day':" +
            t.getDate() +
            ",'Hour':" +
            t.getHours() +
            ",'Minute':" +
            t.getMinutes() +
            ",'Second':" +
            t.getSeconds() +
            ",'Millisecond':" +
            t.getMilliseconds() +
            ",'TimezoneOffset':" +
            t.getTimezoneOffset() +
            "}"
          );
        default:
          if ("object" == typeof t) {
            if (t.length) {
              for (n = [], r = 0, o = t.length; r < o; r++) n.push(d(t[r]));
              return "[" + n.join(",") + "]";
            }
            var i = [];
            for (var a in t)
              "function" != typeof t[a] &&
                "CLASS_NAME" !== a &&
                i.push("'" + a + "':" + d(t[a]));
            return i.length > 0 ? "{" + i.join(",") + "}" : "{}";
          }
          return t.toString();
      }
    },
    m = function(e) {
      if (null === e || "object" != typeof e) return e;
      if (e instanceof Date) return (t = new Date()).setTime(e.getTime()), t;
      if (e instanceof Array) return e.slice(0);
      if (e instanceof Object) {
        var t = {};
        for (var n in e) e.hasOwnProperty(n) && (t[n] = m(e[n]));
        return t;
      }
      throw new Error("Unable to copy obj! Its type isn't supported.");
    },
    g = function(e) {
      for (var t, n = "", r = "", o = 0; o < e.length; o++)
        (n = e.charAt(o)), (t = "0123456789ABCDEF".indexOf(n)), (r += x(t));
      return r;
    },
    h = function(e) {
      var t = "",
        n = "",
        r = "";
      if (16 == e.length) {
        (n = "1110" + e.substring(0, 4)),
          (n += "10" + e.substring(4, 10)),
          (n += "10" + e.substring(10, 16));
        for (var o = "0123456789ABCDEF", i = 0; i < 3; i++)
          (t += "%"),
            (r = n.substring(8 * i, 8 * (i + 1))),
            (t += o.charAt(v(r.substring(0, 4)))),
            (t += o.charAt(v(r.substring(4, 8))));
        return t;
      }
      return "";
    },
    v = function(e) {
      var t = 0;
      if (4 == e.length) {
        for (var n = 0; n < 4; n++) t += e.charAt(n) * Math.pow(2, 3 - n);
        return t;
      }
      return -1;
    },
    x = function(e) {
      for (var t = "", n = 0, r = 0; r < 4; r++)
        e >= (n = Math.pow(2, 3 - r)) ? ((t += "1"), (e -= n)) : (t += "0");
      return t;
    },
    S = function(e, t) {
      if (
        "[object Object]" === Object.prototype.toString.call(e) &&
        "[object Object]" === Object.prototype.toString.call(t)
      )
        for (var n in t) e[n] ? (e[n] = S(e[n], t[n])) : (e[n] = t[n]);
      else
        e =
          "[object Array]" === Object.prototype.toString.call(e) &&
          "[object Array]" === Object.prototype.toString.call(t)
            ? e.concat(t)
            : t;
      return e;
    },
    O = function(e, t, n, r) {
      t.hasOwnProperty(n) &&
        ("object" != typeof e[n] ||
        {
          "[object Function]": 1,
          "[object RegExp]": 1,
          "[object Date]": 1,
          "[object Error]": 1,
          "[object CanvasGradient]": 1
        }[Object.prototype.toString.call(e[n])]
          ? (!r && n in e) || (e[n] = t[n])
          : b(e[n], t[n], r));
    },
    b = function(e, t, n) {
      for (var r in t) O(e, t, r, n);
      return e;
    },
    C = function(e) {
      for (let t = 0; t < e.length; t++)
        e[t] instanceof Array
          ? C(e[t])
          : e[t] instanceof Object && (e[t] = e[t].toArray());
      return e;
    },
    j = function(e) {
      return "" !== e && null != e;
    };
  (n.Util.extend = c),
    (n.Util.isArray = function(e) {
      return "[object Array]" === Object.prototype.toString.call(e);
    }),
    (n.Util.extendDeep = s),
    (n.Util.copy = function(e, t) {
      var n;
      if (((e = e || {}), t))
        for (var r in e) void 0 !== (n = t[r]) && (e[r] = n);
    }),
    (n.Util.copyExcluce = function(e, t, n) {
      var r;
      if (((e = e || {}), t))
        for (var o in t)
          void 0 !== (r = t[o]) &&
            "function" != typeof r &&
            n.indexOf(o) < 0 &&
            (e[o] = r);
    }),
    (n.Util.reset = function(e) {
      for (var t in (e = e || {}))
        if (e.hasOwnProperty(t)) {
          if ("object" == typeof e[t] && e[t] instanceof Array) {
            for (var n in e[t]) e[t][n].destroy && e[t][n].destroy();
            e[t].length = 0;
          } else
            "object" == typeof e[t] &&
              e[t] instanceof Object &&
              e[t].destroy &&
              e[t].destroy();
          e[t] = null;
        }
    }),
    (n.Util.getElement = function() {
      for (var e = [], t = 0, n = arguments.length; t < n; t++) {
        var r = arguments[t];
        if (
          ("string" == typeof r && (r = document.getElementById(r)),
          1 === arguments.length)
        )
          return r;
        e.push(r);
      }
      return e;
    }),
    (n.Util.isElement = function(e) {
      return !(!e || 1 !== e.nodeType);
    }),
    (n.Util.removeItem = function(e, t) {
      for (var n = e.length - 1; n >= 0; n--) e[n] === t && e.splice(n, 1);
      return e;
    }),
    (n.Util.indexOf = function(e, t) {
      if (null == e) return -1;
      if ("function" == typeof e.indexOf) return e.indexOf(t);
      for (var n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;
      return -1;
    }),
    (n.Util.modifyDOMElement = function(e, t, n, r, o, i, a, l) {
      t && (e.id = t),
        n && ((e.style.left = n.x + "px"), (e.style.top = n.y + "px")),
        r && ((e.style.width = r.w + "px"), (e.style.height = r.h + "px")),
        o && (e.style.position = o),
        i && (e.style.border = i),
        a && (e.style.overflow = a),
        parseFloat(l) >= 0 && parseFloat(l) < 1
          ? ((e.style.filter = "alpha(opacity=" + 100 * l + ")"),
            (e.style.opacity = l))
          : 1 === parseFloat(l) &&
            ((e.style.filter = ""), (e.style.opacity = ""));
    }),
    (n.Util.applyDefaults = function(e, t) {
      e = e || {};
      var n = "function" == typeof window.Event && t instanceof window.Event;
      for (var r in t)
        (void 0 === e[r] ||
          (!n &&
            t.hasOwnProperty &&
            t.hasOwnProperty(r) &&
            !e.hasOwnProperty(r))) &&
          (e[r] = t[r]);
      return (
        !n &&
          t &&
          t.hasOwnProperty &&
          t.hasOwnProperty("toString") &&
          !e.hasOwnProperty("toString") &&
          (e.toString = t.toString),
        e
      );
    }),
    (n.Util.getParameterString = function(e) {
      var t = [];
      for (var n in e) {
        var r = e[n];
        if (null != r && "function" != typeof r) {
          var o;
          if ("object" == typeof r && r.constructor === Array) {
            for (var i, a = [], l = 0, c = r.length; l < c; l++)
              (i = r[l]), a.push(encodeURIComponent(null == i ? "" : i));
            o = a.join(",");
          } else o = encodeURIComponent(r);
          t.push(encodeURIComponent(n) + "=" + o);
        }
      }
      return t.join("&");
    }),
    (n.Util.getWFParameterString = function(e) {
      var t = [];
      for (var n in e) {
        var r = e[n];
        if (null != r && "function" != typeof r) {
          var o;
          if ("object" == typeof r && r.constructor === Array) {
            for (var i, a = [], l = 0, c = r.length; l < c; l++)
              (i = r[l]), a.push(encodeURIComponent(null == i ? "" : i));
            o = a.join(",");
          } else o = encodeURIComponent(r);
          t.push(encodeURIComponent(n) + ":" + o);
        }
      }
      return t.join(";");
    }),
    (n.Util.urlAppend = function(e, t) {
      var n = e;
      if (t) {
        var r = (e + " ").split(/[?&]/);
        n += " " === r.pop() ? t : r.length ? "&" + t : "?" + t;
      }
      return n;
    }),
    (n.Util.getParameters = function(e) {
      var t = "";
      if ((e = null == e ? window.location.href : e).indexOf("?") > -1) {
        var n = e.indexOf("?") + 1;
        e.indexOf("#");
        var r = e.indexOf("#") > -1 ? e.indexOf("#") : e.length;
        t = e.substring(n, r);
      }
      for (var o = {}, i = t.split(/[&;]/), a = 0, l = i.length; a < l; ++a) {
        var c = i[a].split("=");
        if (c[0]) {
          var s = c[0];
          try {
            s = decodeURIComponent(s);
          } catch (e) {
            s = unescape(s);
          }
          var u = (c[1] || "").replace(/\+/g, " ");
          try {
            u = decodeURIComponent(u);
          } catch (e) {
            u = unescape(u);
          }
          1 == (u = u.split(",")).length && (u = u[0]), (o[s] = u);
        }
      }
      return o;
    }),
    (n.IS_GECKO = u),
    (n.Browser = f),
    (n.Util.getBrowser = p),
    (n.Util.isSupportCanvas = y),
    (n.Util.supportCanvas = function() {
      return y;
    }),
    (n.Util.isInTheSameDomain = function(e) {
      if (!e) return !0;
      var t = e.indexOf("//"),
        n = document.location.toString(),
        r = n.indexOf("//");
      if (-1 === t) return !0;
      var o,
        i = (o = e.substring(0, t)),
        a = n.substring(r + 2);
      r = a.indexOf("/");
      var l = a.indexOf(":"),
        c = a.substring(0, r),
        s = document.location.protocol;
      if (
        (-1 !== l || (c += ":" + ("http:" === s.toLowerCase() ? 80 : 443)),
        s.toLowerCase() !== i.toLowerCase())
      )
        return !1;
      var u = (i = e.substring(t + 2)).indexOf(":");
      t = i.indexOf("/");
      var f,
        p = i.substring(0, t);
      return (
        -1 !== u
          ? (f = i.substring(0, u))
          : ((f = i.substring(0, t)),
            (p += ":" + ("http:" === o.toLowerCase() ? 80 : 443))),
        f === document.domain && p === c
      );
    }),
    (n.Util.toJSON = d),
    (n.Util.transformResult = function(e) {
      return (
        e.responseText &&
          "string" == typeof e.responseText &&
          (e = JSON.parse(e.responseText)),
        e
      );
    }),
    (n.Util.copyAttributes = function(e, t) {
      if (((e = e || {}), t))
        for (var n in t) {
          var r = t[n];
          void 0 !== r &&
            "CLASS_NAME" !== n &&
            "function" != typeof r &&
            (e[n] = r);
        }
      return e;
    }),
    (n.Util.copyAttributesWithClip = function(e, t, n) {
      if (((e = e || {}), t))
        for (var r in t) {
          var o = !1;
          if (n && n.length)
            for (var i = 0, a = n.length; i < a; i++)
              if (r === n[i]) {
                o = !0;
                break;
              }
          if (!0 !== o) {
            var l = t[r];
            void 0 !== l &&
              "CLASS_NAME" !== r &&
              "function" != typeof l &&
              (e[r] = l);
          }
        }
      return e;
    }),
    (n.Util.cloneObject = m),
    (n.Util.newGuid = function() {
      for (var e = "", t = 1; t <= 32; t++)
        (e += Math.floor(16 * Math.random()).toString(16)),
          (8 != t && 12 != t && 16 != t && 20 != t) || (e += "-");
      return e;
    }),
    (n.Util.bind = function(e, t) {
      var n = Array.prototype.slice.apply(arguments, [2]);
      return function() {
        var r = n.concat(Array.prototype.slice.apply(arguments, [0]));
        return e.apply(t, r);
      };
    }),
    (n.Util.bindAsEventListener = function(e, t) {
      return function(n) {
        return e.call(t, n || window.event);
      };
    }),
    (n.Util.getTopAnalysisResult = function(e) {
      switch (e.value) {
        case 0:
          return "Intersect";
        case 1:
          return "Disjoin";
        case 2:
          return "Include";
        case 3:
          return "Adjacent";
        default:
          return "Unknown";
      }
    }),
    (n.Util.ChineseToUtf8 = function(e) {
      return e.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function(e) {
        return (function(e) {
          var t = escape(e).split("%"),
            n = "";
          "" != t[0] && (n = t[0]);
          for (var r = 1; r < t.length; r++)
            "u" == t[r].substring(0, 1)
              ? (n += h(g(t[r].substring(1, 5))))
              : (n += "%" + t[r]);
          return n;
        })(e);
      });
    }),
    (n.Util.DeepMerge = S),
    (n.Util.merge = b),
    (n.Util.mixin = function(...e) {
      class t {
        constructor(t) {
          for (var n = 0; n < e.length; n++) o(this, new e[n](t));
        }
      }
      for (var n = 0; n < e.length; n++) {
        var r = e[n];
        o(t, r), o(t.prototype, r.prototype), o(t.prototype, new r());
      }
      return t;
      function o(e, t) {
        var n = Object.getOwnPropertyNames(t);
        Object.getOwnPropertySymbols &&
          (n = n.concat(Object.getOwnPropertySymbols(t)));
        for (var r = 0; r < n.length; r++) {
          var o = n[r];
          if (
            "constructor" !== o &&
            "prototype" !== o &&
            "name" !== o &&
            "length" !== o
          ) {
            let n = Object.getOwnPropertyDescriptor(t, o);
            window.ActiveXObject
              ? Object.defineProperty(e, o, n || {})
              : Object.defineProperty(e, o, n);
          }
        }
      }
    }),
    (n.Util.createCanvasContext2D = function(e, t) {
      var n = document.createElement("CANVAS");
      return e && (n.width = e), t && (n.height = t), n.getContext("2d");
    }),
    (n.Util.formatQuery = function(e, t, n, r) {
      return (
        Object.keys(e).forEach(function(o) {
          let i = e[o],
            a = o;
          if (j(i) && "function" != typeof i) {
            if (n && n.indexOf(o) > -1) {
              let n = {};
              "geometry" === o &&
                ("polygon" === i.type && (n.rings = e[o].rings),
                "multipoint" === i.type && (n.points = e[o].points),
                "point" === i.type &&
                  e[o].x &&
                  e[o].y &&
                  ((n.y = e[o].y), (n.x = e[o].x)),
                "polyline" === i.type && (n.paths = e[o].paths),
                (n.spatialReference = e[o].spatialReference),
                (i = n),
                (t +=
                  "&geometryType=esriGeometry" +
                  e[o].type.charAt(0).toUpperCase() +
                  e[o].type.slice(1))),
                (i = JSON.stringify(i));
            }
            r && r.hasOwnProperty(o) && (a = r[o]), (t += "&" + a + "=" + i);
          }
        }),
        t
      );
    }),
    (n.Util.formatEdits = function(e, t, n) {
      return (
        Object.keys(t).forEach(function(r) {
          if (n && n.indexOf(r) > -1) {
            let n = r;
            (n = r.substring(0, n.length - "Features".length) + "s"),
              (e +=
                n +
                "=" +
                encodeURIComponent(
                  t[r] instanceof Object ? JSON.stringify(t[r]) : t[r]
                ) +
                "&");
          } else e += r + "=" + t[r] + "&";
        }),
        e
      );
    }),
    (n.Util.returnPoint = function(e, t, n) {
      return new e({
        longitude: n[0],
        latitude: n[1],
        z: n[2],
        spatialReference: m(t.spatialReference)
      });
    }),
    (n.Util.returnPoint = C),
    (n.Util.returnPoint = j);
  class w {
    constructor(e) {
      c(this, e || {});
    }
    setByOL(e) {
      return null;
    }
    toString() {
      return "";
    }
    getGeometryType() {}
    Trim(e, t) {
      var n;
      return (
        (n = e.replace(/(^\s+)|(\s+$)/g, "")),
        "g" === t.toLowerCase() && (n = n.replace(/\s/g, "")),
        n
      );
    }
  }
  n.Object.Tangram = w;
  class M extends w {
    constructor(e, t, n, r, o) {
      super(o || {}),
        (this.xmin = e),
        (this.xmax = n),
        (this.ymin = t),
        (this.ymax = r);
    }
    setByOL(e) {
      null != e &&
        ((this.xmin = e[0]),
        (this.ymin = e[1]),
        (this.xmax = e[2]),
        (this.ymax = e[3]));
    }
    toString() {
      return this.xmin + "," + this.ymin + "," + this.xmax + "," + this.ymax;
    }
    getGeometryType() {
      return "rect";
    }
    convertToBound() {
      return [this.xmin, this.ymin, this.xmax, this.ymax];
    }
    intersectsBounds(e, t) {
      "boolean" == typeof t && (t = { inclusive: t }),
        null === (t = t || {}).inclusive && (t.inclusive = !0);
      var n = this,
        r = !1,
        o =
          n.xmin === e.xmax ||
          n.xmax === e.xmin ||
          n.ymax === e.ymin ||
          n.ymin === e.ymax;
      if (t.inclusive || !o) {
        var i =
            (e.ymin >= n.ymin && e.ymin <= n.ymax) ||
            (n.ymin >= e.ymin && n.ymin <= e.ymax),
          a =
            (e.ymax >= n.ymin && e.ymax <= n.ymax) ||
            (n.ymax > e.ymin && n.ymax < e.ymax),
          l =
            (e.xmin >= n.xmin && e.xmin <= n.xmax) ||
            (n.xmin >= e.xmin && n.xmin <= e.xmax),
          c =
            (e.xmax >= n.xmin && e.xmax <= n.xmax) ||
            (n.xmax >= e.xmin && n.xmax <= e.xmax);
        r = (i || a) && (l || c);
      }
      return r;
    }
  }
  Zondy.Object.Rectangle = M;
  class A {
    static deepClone(e) {
      let t;
      return (
        "object" == typeof e
          ? Array.isArray(e)
            ? ((t = []),
              e.forEach(e => {
                t.push(this.deepClone(e));
              }))
            : null === e
            ? (t = null)
            : e.constructor === RegExp
            ? (t = e)
            : "function" == typeof e.clone
            ? (t = e.clone())
            : ((t = {}),
              Object.entries(e).forEach(e => {
                const n = e[0];
                t[n] = this.deepClone(e[1]);
              }))
          : (t = e),
        t
      );
    }
  }
  !(function(e) {
    (e[(e.notLoaded = 0)] = "notLoaded"),
      (e[(e.loading = 1)] = "loading"),
      (e[(e.loaded = 2)] = "loaded"),
      (e[(e.failed = 3)] = "failed");
  })(a || (a = {})),
    (function(e) {
      (e[(e.Unknown = 0)] = "Unknown"),
        (e[(e.Group = 1)] = "Group"),
        (e[(e.Tile = 2)] = "Tile"),
        (e[(e.MapImage = 3)] = "MapImage"),
        (e[(e.IGSTile = 4)] = "IGSTile"),
        (e[(e.IGSMapImage = 5)] = "IGSMapImage"),
        (e[(e.IGSVector = 6)] = "IGSVector"),
        (e[(e.OGCWMTS = 7)] = "OGCWMTS"),
        (e[(e.OGCWMS = 8)] = "OGCWMS"),
        (e[(e.ArcGISTile = 9)] = "ArcGISTile"),
        (e[(e.ArcGISMapImage = 10)] = "ArcGISMapImage"),
        (e[(e.VectorTile = 11)] = "VectorTile"),
        (e[(e.WebTile = 12)] = "WebTile"),
        (e[(e.CustomTile = 13)] = "CustomTile"),
        (e[(e.CustomMapImageLayer = 14)] = "CustomMapImageLayer"),
        (e[(e.AMapMercatorEMap = 15)] = "AMapMercatorEMap"),
        (e[(e.AMapMercatorSatelliteMap = 16)] = "AMapMercatorSatelliteMap"),
        (e[(e.AMapMercatorSatelliteAnnMap = 17)] =
          "AMapMercatorSatelliteAnnMap"),
        (e[(e.ModelCache = 18)] = "ModelCache"),
        (e[(e.IGSModelCache = 19)] = "IGSModelCache"),
        (e[(e.Elevation = 20)] = "Elevation"),
        (e[(e.IGSElevation = 21)] = "IGSElevation"),
        (e[(e.Scene = 22)] = "Scene"),
        (e[(e.IGSScene = 23)] = "IGSScene"),
        (e[(e.Graphics = 24)] = "Graphics");
    })(l || (l = {}));
  class U {
    constructor(e) {
      e &&
        (e.description && (this.description = e.description),
        e.id && (this.id = e.id),
        e.loadStatus && (this.loadStatus = e.loadStatus),
        e.opacity && (this.opacity = e.opacity),
        e.title && (this.title = e.title),
        e.type && (this.type = e.type),
        e.isVisible && (this.isVisible = e.isVisible),
        e.fullExtent && (this.fullExtent = A.deepClone(e.fullExtent)));
    }
    description = "";
    get fullExtent() {
      return this._fullExtent;
    }
    set fullExtent(e) {
      this._fullExtent = e;
    }
    id = "";
    loadStatus = a.notLoaded;
    opacity = 1;
    title = "";
    type = l.Unknown;
    isVisible = !0;
    _deepClone(e) {
      return A.deepClone(e);
    }
    _fullExtent = new M(0, 0, 0, 0);
  }
  var E = exports;
  for (var I in t) E[I] = t[I];
  t.__esModule && Object.defineProperty(E, "__esModule", { value: !0 });
})();
