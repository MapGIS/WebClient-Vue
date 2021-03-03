/**
 * @copyright https://gist.github.com/godismyjudge95/a4ea43263db53b90b05511c911cd0034
 */

!(function(e) {
  if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = e();
  else if ("function" == typeof define && define.amd) define([], e);
  else {
    ("undefined" != typeof window
      ? window
      : "undefined" != typeof global
      ? global
      : "undefined" != typeof self
      ? self
      : this
    ).MapboxDraw = e();
  }
})(function() {
  return (function i(s, a, c) {
    function u(t, e) {
      if (!a[t]) {
        if (!s[t]) {
          var n = "function" == typeof require && require;
          if (!e && n) return n(t, !0);
          if (l) return l(t, !0);
          var o = new Error("Cannot find module '" + t + "'");
          throw ((o.code = "MODULE_NOT_FOUND"), o);
        }
        var r = (a[t] = { exports: {} });
        s[t][0].call(
          r.exports,
          function(e) {
            return u(s[t][1][e] || e);
          },
          r,
          r.exports,
          i,
          s,
          a,
          c
        );
      }
      return a[t].exports;
    }
    for (
      var l = "function" == typeof require && require, e = 0;
      e < c.length;
      e++
    )
      u(c[e]);
    return u;
  })(
    {
      1: [
        function(e, t, n) {
          "use strict";
          var r = e("./src/setup"),
            i = e("./src/options"),
            s = e("./src/api"),
            a = e("./src/constants");
          (t.exports = function(e) {
            !(function(e, t) {
              var n = { options: (e = i(e)) };
              (t = s(n, t)), (n.api = t);
              var o = r(n);
              (t.onAdd = o.onAdd),
                (t.onRemove = o.onRemove),
                (t.types = a.types),
                (t.options = e);
            })(e, this);
          }),
            (t.exports.modes = e("./src/modes"));
        },
        {
          "./src/api": 22,
          "./src/constants": 23,
          "./src/modes": 56,
          "./src/options": 61,
          "./src/setup": 63
        }
      ],
      2: [
        function(e, t, n) {
          function o(e) {
            if (!(this instanceof o)) return new o(e);
            (this._bbox = e || [1 / 0, 1 / 0, -1 / 0, -1 / 0]),
              (this._valid = !!e);
          }
          ((t.exports = o).prototype.include = function(e) {
            return (
              (this._valid = !0),
              (this._bbox[0] = Math.min(this._bbox[0], e[0])),
              (this._bbox[1] = Math.min(this._bbox[1], e[1])),
              (this._bbox[2] = Math.max(this._bbox[2], e[0])),
              (this._bbox[3] = Math.max(this._bbox[3], e[1])),
              this
            );
          }),
            (o.prototype.equals = function(e) {
              var t;
              return (
                (t = e instanceof o ? e.bbox() : e),
                this._bbox[0] == t[0] &&
                  this._bbox[1] == t[1] &&
                  this._bbox[2] == t[2] &&
                  this._bbox[3] == t[3]
              );
            }),
            (o.prototype.center = function(e) {
              return this._valid
                ? [
                    (this._bbox[0] + this._bbox[2]) / 2,
                    (this._bbox[1] + this._bbox[3]) / 2
                  ]
                : null;
            }),
            (o.prototype.union = function(e) {
              var t;
              return (
                (this._valid = !0),
                (t = e instanceof o ? e.bbox() : e),
                (this._bbox[0] = Math.min(this._bbox[0], t[0])),
                (this._bbox[1] = Math.min(this._bbox[1], t[1])),
                (this._bbox[2] = Math.max(this._bbox[2], t[2])),
                (this._bbox[3] = Math.max(this._bbox[3], t[3])),
                this
              );
            }),
            (o.prototype.bbox = function() {
              return this._valid ? this._bbox : null;
            }),
            (o.prototype.contains = function(e) {
              if (!e) return this._fastContains();
              if (!this._valid) return null;
              var t = e[0],
                n = e[1];
              return (
                this._bbox[0] <= t &&
                this._bbox[1] <= n &&
                this._bbox[2] >= t &&
                this._bbox[3] >= n
              );
            }),
            (o.prototype.intersect = function(e) {
              return this._valid
                ? ((t = e instanceof o ? e.bbox() : e),
                  !(
                    this._bbox[0] > t[2] ||
                    this._bbox[2] < t[0] ||
                    this._bbox[3] < t[1] ||
                    this._bbox[1] > t[3]
                  ))
                : null;
              var t;
            }),
            (o.prototype._fastContains = function() {
              if (!this._valid) return new Function("return null;");
              var e =
                "return " +
                this._bbox[0] +
                "<= ll[0] &&" +
                this._bbox[1] +
                "<= ll[1] &&" +
                this._bbox[2] +
                ">= ll[0] &&" +
                this._bbox[3] +
                ">= ll[1]";
              return new Function("ll", e);
            }),
            (o.prototype.polygon = function() {
              return this._valid
                ? {
                    type: "Polygon",
                    coordinates: [
                      [
                        [this._bbox[0], this._bbox[1]],
                        [this._bbox[2], this._bbox[1]],
                        [this._bbox[2], this._bbox[3]],
                        [this._bbox[0], this._bbox[3]],
                        [this._bbox[0], this._bbox[1]]
                      ]
                    ]
                  }
                : null;
            });
        },
        {}
      ],
      3: [
        function(e, t, n) {
          var u = e("wgs84");
          function r(e) {
            var t = 0;
            if (e && 0 < e.length) {
              t += Math.abs(o(e[0]));
              for (var n = 1; n < e.length; n++) t -= Math.abs(o(e[n]));
            }
            return t;
          }
          function o(e) {
            var t,
              n,
              o,
              r,
              i,
              s,
              a = 0,
              c = e.length;
            if (2 < c) {
              for (s = 0; s < c; s++)
                (i =
                  s === c - 2
                    ? ((o = c - 2), (r = c - 1), 0)
                    : s === c - 1
                    ? ((o = c - 1), (r = 0), 1)
                    : ((r = (o = s) + 1), s + 2)),
                  (t = e[o]),
                  (n = e[r]),
                  (a += (l(e[i][0]) - l(t[0])) * Math.sin(l(n[1])));
              a = (a * u.RADIUS * u.RADIUS) / 2;
            }
            return a;
          }
          function l(e) {
            return (e * Math.PI) / 180;
          }
          (t.exports.geometry = function e(t) {
            var n,
              o = 0;
            switch (t.type) {
              case "Polygon":
                return r(t.coordinates);
              case "MultiPolygon":
                for (n = 0; n < t.coordinates.length; n++)
                  o += r(t.coordinates[n]);
                return o;
              case "Point":
              case "MultiPoint":
              case "LineString":
              case "MultiLineString":
                return 0;
              case "GeometryCollection":
                for (n = 0; n < t.geometries.length; n++)
                  o += e(t.geometries[n]);
                return o;
            }
          }),
            (t.exports.ring = o);
        },
        { wgs84: 20 }
      ],
      4: [
        function(e, t, n) {
          t.exports = function(e) {
            return (function n(e) {
              if (Array.isArray(e) && e.length && "number" == typeof e[0])
                return [e];
              return e.reduce(function(e, t) {
                return Array.isArray(t) && Array.isArray(t[0])
                  ? e.concat(n(t))
                  : (e.push(t), e);
              }, []);
            })(e);
          };
        },
        {}
      ],
      5: [
        function(e, t, n) {
          var o = e("@mapbox/geojson-normalize"),
            r = e("geojson-flatten"),
            i = e("./flatten");
          t.exports = function(e) {
            if (!e) return [];
            var t = r(o(e)),
              n = [];
            return (
              t.features.forEach(function(e) {
                e.geometry && (n = n.concat(i(e.geometry.coordinates)));
              }),
              n
            );
          };
        },
        {
          "./flatten": 4,
          "@mapbox/geojson-normalize": 7,
          "geojson-flatten": 13
        }
      ],
      6: [
        function(e, t, n) {
          var r = e("@mapbox/geojson-coords"),
            o = e("traverse"),
            i = e("@mapbox/extent"),
            s = {
              features: ["FeatureCollection"],
              coordinates: [
                "Point",
                "MultiPoint",
                "LineString",
                "MultiLineString",
                "Polygon",
                "MultiPolygon"
              ],
              geometry: ["Feature"],
              geometries: ["GeometryCollection"]
            },
            a = Object.keys(s);
          function c(e) {
            for (var t = i(), n = r(e), o = 0; o < n.length; o++)
              t.include(n[o]);
            return t;
          }
          (t.exports = function(e) {
            return c(e).bbox();
          }),
            (t.exports.polygon = function(e) {
              return c(e).polygon();
            }),
            (t.exports.bboxify = function(e) {
              return o(e).map(function(t) {
                t &&
                  a.some(function(e) {
                    return !!t[e] && -1 !== s[e].indexOf(t.type);
                  }) &&
                    ((t.bbox = c(t).bbox()), this.update(t));
              });
            });
        },
        { "@mapbox/extent": 2, "@mapbox/geojson-coords": 5, traverse: 19 }
      ],
      7: [
        function(e, t, n) {
          t.exports = function(e) {
            if (!e || !e.type) return null;
            var t = o[e.type];
            if (!t) return null;
            {
              if ("geometry" === t)
                return {
                  type: "FeatureCollection",
                  features: [{ type: "Feature", properties: {}, geometry: e }]
                };
              if ("feature" === t)
                return { type: "FeatureCollection", features: [e] };
              if ("featurecollection" === t) return e;
            }
          };
          var o = {
            Point: "geometry",
            MultiPoint: "geometry",
            LineString: "geometry",
            MultiLineString: "geometry",
            Polygon: "geometry",
            MultiPolygon: "geometry",
            GeometryCollection: "geometry",
            Feature: "feature",
            FeatureCollection: "featurecollection"
          };
        },
        {}
      ],
      8: [
        function(e, t, n) {
          var i = e("jsonlint-lines"),
            s = e("./object");
          t.exports.hint = function(e, t) {
            var n,
              o = [];
            if ("object" == typeof e) n = e;
            else {
              if ("string" != typeof e)
                return [
                  { message: "Expected string or object as input", line: 0 }
                ];
              try {
                n = i.parse(e);
              } catch (e) {
                var r = e.message.match(/line (\d+)/);
                return [
                  { line: parseInt(r[1], 10) - 1, message: e.message, error: e }
                ];
              }
            }
            return (o = o.concat(s.hint(n, t)));
          };
        },
        { "./object": 9, "jsonlint-lines": 15 }
      ],
      9: [
        function(e, t, n) {
          var y = e("./rhr");
          t.exports.hint = function(e, n) {
            var i = [],
              s = 0,
              t = 10,
              a = 6;
            function o(e) {
              if (
                ((n && !1 === n.noDuplicateMembers) ||
                  !e.__duplicateProperties__ ||
                  i.push({
                    message:
                      "An object contained duplicate members, making parsing ambigous: " +
                      e.__duplicateProperties__.join(", "),
                    line: e.__line__
                  }),
                !r(e, "type", "string"))
              )
                if (d[e.type]) e && d[e.type](e);
                else {
                  var t = g[e.type.toLowerCase()];
                  void 0 !== t
                    ? i.push({
                        message:
                          "Expected " +
                          t +
                          " but got " +
                          e.type +
                          " (case sensitive)",
                        line: e.__line__
                      })
                    : i.push({
                        message: "The type " + e.type + " is unknown",
                        line: e.__line__
                      });
                }
            }
            function c(e, t) {
              return e.every(function(e) {
                return null !== e && typeof e === t;
              });
            }
            function r(e, t, n) {
              if (void 0 === e[t])
                return i.push({
                  message: '"' + t + '" member required',
                  line: e.__line__
                });
              if ("array" === n) {
                if (!Array.isArray(e[t]))
                  return i.push({
                    message:
                      '"' +
                      t +
                      '" member should be an array, but is an ' +
                      typeof e[t] +
                      " instead",
                    line: e.__line__
                  });
              } else {
                if (
                  "object" === n &&
                  e[t] &&
                  "Object" !== e[t].constructor.name
                )
                  return i.push({
                    message:
                      '"' +
                      t +
                      '" member should be ' +
                      n +
                      ", but is an " +
                      e[t].constructor.name +
                      " instead",
                    line: e.__line__
                  });
                if (n && typeof e[t] !== n)
                  return i.push({
                    message:
                      '"' +
                      t +
                      '" member should be ' +
                      n +
                      ", but is an " +
                      typeof e[t] +
                      " instead",
                    line: e.__line__
                  });
              }
            }
            function u(o, r) {
              if (!Array.isArray(o))
                return i.push({
                  message:
                    "position should be an array, is a " +
                    typeof o +
                    " instead",
                  line: o.__line__ || r
                });
              if (o.length < 2)
                return i.push({
                  message: "position must have 2 or more elements",
                  line: o.__line__ || r
                });
              if (3 < o.length)
                return i.push({
                  message: "position should not have more than 3 elements",
                  level: "message",
                  line: o.__line__ || r
                });
              if (!c(o, "number"))
                return i.push({
                  message: "each element in a position must be a number",
                  line: o.__line__ || r
                });
              if (n && n.precisionWarning) {
                if (s === t)
                  return (
                    (s += 1),
                    i.push({
                      message:
                        "truncated warnings: we've encountered coordinate precision warning " +
                        t +
                        " times, no more warnings will be reported",
                      level: "message",
                      line: o.__line__ || r
                    })
                  );
                s < t &&
                  o.forEach(function(e) {
                    var t = 0,
                      n = String(e).split(".")[1];
                    if ((void 0 !== n && (t = n.length), a < t))
                      return (
                        (s += 1),
                        i.push({
                          message: "precision of coordinates should be reduced",
                          level: "message",
                          line: o.__line__ || r
                        })
                      );
                  });
              }
            }
            function l(n, t, o, r) {
              if (
                (void 0 === r && void 0 !== n.__line__ && (r = n.__line__),
                0 === o)
              )
                return u(n, r);
              if (1 === o && t)
                if ("LinearRing" === t) {
                  if (!Array.isArray(n[n.length - 1]))
                    return (
                      i.push({
                        message:
                          "a number was found where a coordinate array should have been found: this needs to be nested more deeply",
                        line: r
                      }),
                      !0
                    );
                  if (
                    (n.length < 4 &&
                      i.push({
                        message:
                          "a LinearRing of coordinates needs to have four or more positions",
                        line: r
                      }),
                    n.length &&
                      (n[n.length - 1].length !== n[0].length ||
                        !n[n.length - 1].every(function(e, t) {
                          return n[0][t] === e;
                        })))
                  )
                    return (
                      i.push({
                        message:
                          "the first and last positions in a LinearRing of coordinates must be the same",
                        line: r
                      }),
                      !0
                    );
                } else if ("Line" === t && n.length < 2)
                  return i.push({
                    message:
                      "a line needs to have two or more coordinates to be valid",
                    line: r
                  });
              if (Array.isArray(n))
                return n
                  .map(function(e) {
                    return l(e, t, o - 1, e.__line__ || r);
                  })
                  .some(function(e) {
                    return e;
                  });
              i.push({
                message:
                  "a number was found where a coordinate array should have been found: this needs to be nested more deeply",
                line: r
              });
            }
            function p(e) {
              e.crs &&
                ("object" == typeof e.crs &&
                e.crs.properties &&
                "urn:ogc:def:crs:OGC:1.3:CRS84" === e.crs.properties.name
                  ? i.push({
                      message:
                        "old-style crs member is not recommended, this object is equivalent to the default and should be removed",
                      line: e.__line__
                    })
                  : i.push({
                      message: "old-style crs member is not recommended",
                      line: e.__line__
                    }));
            }
            function f(e) {
              if (e.bbox)
                return Array.isArray(e.bbox)
                  ? (c(e.bbox, "number") ||
                      i.push({
                        message:
                          "each element in a bbox member must be a number",
                        line: e.bbox.__line__
                      }),
                    4 !== e.bbox.length &&
                      6 !== e.bbox.length &&
                      i.push({
                        message:
                          "bbox must contain 4 elements (for 2D) or 6 elements (for 3D)",
                        line: e.bbox.__line__
                      }),
                    i.length)
                  : void i.push({
                      message:
                        "bbox member must be an array of numbers, but is a " +
                        typeof e.bbox,
                      line: e.__line__
                    });
            }
            function h(e) {
              p(e),
                f(e),
                void 0 !== e.id &&
                  "string" != typeof e.id &&
                  "number" != typeof e.id &&
                  i.push({
                    message:
                      'Feature "id" member must have a string or number value',
                    line: e.__line__
                  }),
                void 0 !== e.features &&
                  i.push({
                    message:
                      'Feature object cannot contain a "features" member',
                    line: e.__line__
                  }),
                void 0 !== e.coordinates &&
                  i.push({
                    message:
                      'Feature object cannot contain a "coordinates" member',
                    line: e.__line__
                  }),
                "Feature" !== e.type &&
                  i.push({
                    message: "GeoJSON features must have a type=feature member",
                    line: e.__line__
                  }),
                r(e, "properties", "object"),
                r(e, "geometry", "object") || (e.geometry && o(e.geometry));
            }
            var d = {
                Point: function(e) {
                  var t;
                  p(e),
                    f(e),
                    void 0 !== (t = e).properties &&
                      i.push({
                        message:
                          'geometry object cannot contain a "properties" member',
                        line: t.__line__
                      }),
                    void 0 !== t.geometry &&
                      i.push({
                        message:
                          'geometry object cannot contain a "geometry" member',
                        line: t.__line__
                      }),
                    void 0 !== t.features &&
                      i.push({
                        message:
                          'geometry object cannot contain a "features" member',
                        line: t.__line__
                      }),
                    r(e, "coordinates", "array") || u(e.coordinates);
                },
                Feature: h,
                MultiPoint: function(e) {
                  p(e),
                    f(e),
                    r(e, "coordinates", "array") || l(e.coordinates, "", 1);
                },
                LineString: function(e) {
                  p(e),
                    f(e),
                    r(e, "coordinates", "array") || l(e.coordinates, "Line", 1);
                },
                MultiLineString: function(e) {
                  p(e),
                    f(e),
                    r(e, "coordinates", "array") || l(e.coordinates, "Line", 2);
                },
                FeatureCollection: function(e) {
                  if (
                    (p(e),
                    f(e),
                    void 0 !== e.properties &&
                      i.push({
                        message:
                          'FeatureCollection object cannot contain a "properties" member',
                        line: e.__line__
                      }),
                    void 0 !== e.coordinates &&
                      i.push({
                        message:
                          'FeatureCollection object cannot contain a "coordinates" member',
                        line: e.__line__
                      }),
                    !r(e, "features", "array"))
                  ) {
                    if (!c(e.features, "object"))
                      return i.push({
                        message: "Every feature must be an object",
                        line: e.__line__
                      });
                    e.features.forEach(h);
                  }
                },
                GeometryCollection: function(t) {
                  p(t),
                    f(t),
                    r(t, "geometries", "array") ||
                      (c(t.geometries, "object") ||
                        i.push({
                          message:
                            "The geometries array in a GeometryCollection must contain only geometry objects",
                          line: t.__line__
                        }),
                      1 === t.geometries.length &&
                        i.push({
                          message:
                            "GeometryCollection with a single geometry should be avoided in favor of single part or a single object of multi-part type",
                          line: t.geometries.__line__
                        }),
                      t.geometries.forEach(function(e) {
                        e &&
                          ("GeometryCollection" === e.type &&
                            i.push({
                              message:
                                "GeometryCollection should avoid nested geometry collections",
                              line: t.geometries.__line__
                            }),
                          o(e));
                      }));
                },
                Polygon: function(e) {
                  p(e),
                    f(e),
                    r(e, "coordinates", "array") ||
                      l(e.coordinates, "LinearRing", 2) ||
                      y(e, i);
                },
                MultiPolygon: function(e) {
                  p(e),
                    f(e),
                    r(e, "coordinates", "array") ||
                      l(e.coordinates, "LinearRing", 3) ||
                      y(e, i);
                }
              },
              g = Object.keys(d).reduce(function(e, t) {
                return (e[t.toLowerCase()] = t), e;
              }, {});
            return (
              "object" != typeof e || null == e
                ? i.push({
                    message: "The root of a GeoJSON object must be an object.",
                    line: 0
                  })
                : (o(e),
                  i.forEach(function(e) {
                    ({}.hasOwnProperty.call(e, "line") &&
                      void 0 === e.line &&
                      delete e.line);
                  })),
              i
            );
          };
        },
        { "./rhr": 10 }
      ],
      10: [
        function(e, t, n) {
          function i(e) {
            return (e * Math.PI) / 180;
          }
          function o(e) {
            var t = 0;
            if (2 < e.length)
              for (var n, o, r = 0; r < e.length - 1; r++)
                (n = e[r]),
                  (t +=
                    i((o = e[r + 1])[0] - n[0]) *
                    (2 + Math.sin(i(n[1])) + Math.sin(i(o[1]))));
            return 0 <= t;
          }
          function r(e) {
            if (e && 0 < e.length) {
              if (o(e[0])) return !1;
              if (!e.slice(1, e.length).every(o)) return !1;
            }
            return !0;
          }
          t.exports = function(e, t) {
            var n;
            ("Polygon" === (n = e).type
              ? r(n.coordinates)
              : "MultiPolygon" === n.type
              ? n.coordinates.every(r)
              : void 0) ||
              t.push({
                message:
                  "Polygons and MultiPolygons should follow the right-hand rule",
                level: "message",
                line: e.__line__
              });
          };
        },
        {}
      ],
      11: [
        function(e, t, n) {
          "use strict";
          function o(e, t) {
            (this.x = e), (this.y = t);
          }
          ((t.exports = o).prototype = {
            clone: function() {
              return new o(this.x, this.y);
            },
            add: function(e) {
              return this.clone()._add(e);
            },
            sub: function(e) {
              return this.clone()._sub(e);
            },
            multByPoint: function(e) {
              return this.clone()._multByPoint(e);
            },
            divByPoint: function(e) {
              return this.clone()._divByPoint(e);
            },
            mult: function(e) {
              return this.clone()._mult(e);
            },
            div: function(e) {
              return this.clone()._div(e);
            },
            rotate: function(e) {
              return this.clone()._rotate(e);
            },
            rotateAround: function(e, t) {
              return this.clone()._rotateAround(e, t);
            },
            matMult: function(e) {
              return this.clone()._matMult(e);
            },
            unit: function() {
              return this.clone()._unit();
            },
            perp: function() {
              return this.clone()._perp();
            },
            round: function() {
              return this.clone()._round();
            },
            mag: function() {
              return Math.sqrt(this.x * this.x + this.y * this.y);
            },
            equals: function(e) {
              return this.x === e.x && this.y === e.y;
            },
            dist: function(e) {
              return Math.sqrt(this.distSqr(e));
            },
            distSqr: function(e) {
              var t = e.x - this.x,
                n = e.y - this.y;
              return t * t + n * n;
            },
            angle: function() {
              return Math.atan2(this.y, this.x);
            },
            angleTo: function(e) {
              return Math.atan2(this.y - e.y, this.x - e.x);
            },
            angleWith: function(e) {
              return this.angleWithSep(e.x, e.y);
            },
            angleWithSep: function(e, t) {
              return Math.atan2(
                this.x * t - this.y * e,
                this.x * e + this.y * t
              );
            },
            _matMult: function(e) {
              var t = e[0] * this.x + e[1] * this.y,
                n = e[2] * this.x + e[3] * this.y;
              return (this.x = t), (this.y = n), this;
            },
            _add: function(e) {
              return (this.x += e.x), (this.y += e.y), this;
            },
            _sub: function(e) {
              return (this.x -= e.x), (this.y -= e.y), this;
            },
            _mult: function(e) {
              return (this.x *= e), (this.y *= e), this;
            },
            _div: function(e) {
              return (this.x /= e), (this.y /= e), this;
            },
            _multByPoint: function(e) {
              return (this.x *= e.x), (this.y *= e.y), this;
            },
            _divByPoint: function(e) {
              return (this.x /= e.x), (this.y /= e.y), this;
            },
            _unit: function() {
              return this._div(this.mag()), this;
            },
            _perp: function() {
              var e = this.y;
              return (this.y = this.x), (this.x = -e), this;
            },
            _rotate: function(e) {
              var t = Math.cos(e),
                n = Math.sin(e),
                o = t * this.x - n * this.y,
                r = n * this.x + t * this.y;
              return (this.x = o), (this.y = r), this;
            },
            _rotateAround: function(e, t) {
              var n = Math.cos(e),
                o = Math.sin(e),
                r = t.x + n * (this.x - t.x) - o * (this.y - t.y),
                i = t.y + o * (this.x - t.x) + n * (this.y - t.y);
              return (this.x = r), (this.y = i), this;
            },
            _round: function() {
              return (
                (this.x = Math.round(this.x)),
                (this.y = Math.round(this.y)),
                this
              );
            }
          }),
            (o.convert = function(e) {
              return e instanceof o
                ? e
                : Array.isArray(e)
                ? new o(e[0], e[1])
                : e;
            });
        },
        {}
      ],
      12: [function(e, t, n) {}, {}],
      13: [
        function(e, t, n) {
          t.exports = function n(o) {
            switch ((o && o.type) || null) {
              case "FeatureCollection":
                return (
                  (o.features = o.features.reduce(function(e, t) {
                    return e.concat(n(t));
                  }, [])),
                  o
                );
              case "Feature":
                return o.geometry
                  ? n(o.geometry).map(function(e) {
                      var t = {
                        type: "Feature",
                        properties: JSON.parse(JSON.stringify(o.properties)),
                        geometry: e
                      };
                      return void 0 !== o.id && (t.id = o.id), t;
                    })
                  : o;
              case "MultiPoint":
                return o.coordinates.map(function(e) {
                  return { type: "Point", coordinates: e };
                });
              case "MultiPolygon":
                return o.coordinates.map(function(e) {
                  return { type: "Polygon", coordinates: e };
                });
              case "MultiLineString":
                return o.coordinates.map(function(e) {
                  return { type: "LineString", coordinates: e };
                });
              case "GeometryCollection":
                return o.geometries.map(n).reduce(function(e, t) {
                  return e.concat(t);
                }, []);
              case "Point":
              case "Polygon":
              case "LineString":
                return [o];
            }
          };
        },
        {}
      ],
      14: [
        function(e, t, n) {
          var c = (t.exports = function(e, t) {
            if ((t || (t = 16), void 0 === e && (e = 128), e <= 0)) return "0";
            for (
              var n = Math.log(Math.pow(2, e)) / Math.log(t), o = 2;
              n === 1 / 0;
              o *= 2
            )
              n = (Math.log(Math.pow(2, e / o)) / Math.log(t)) * o;
            var r = n - Math.floor(n),
              i = "";
            for (o = 0; o < Math.floor(n); o++) {
              i = Math.floor(Math.random() * t).toString(t) + i;
            }
            if (r) {
              var s = Math.pow(t, r);
              i = Math.floor(Math.random() * s).toString(t) + i;
            }
            var a = parseInt(i, t);
            return a !== 1 / 0 && a >= Math.pow(2, e) ? c(e, t) : i;
          });
          c.rack = function(o, r, i) {
            var n = function(e) {
                var t = 0;
                do {
                  if (10 < t++) {
                    if (!i)
                      throw new Error("too many ID collisions, use more bits");
                    o += i;
                  }
                  var n = c(o, r);
                } while (Object.hasOwnProperty.call(s, n));
                return (s[n] = e), n;
              },
              s = (n.hats = {});
            return (
              (n.get = function(e) {
                return n.hats[e];
              }),
              (n.set = function(e, t) {
                return (n.hats[e] = t), n;
              }),
              (n.bits = o || 128),
              (n.base = r || 16),
              n
            );
          };
        },
        {}
      ],
      15: [
        function(o, t, r) {
          (function(n) {
            var e = (function() {
              var e = function(e, t, n, o) {
                  for (n = n || {}, o = e.length; o--; n[e[o]] = t);
                  return n;
                },
                t = [1, 12],
                n = [1, 13],
                o = [1, 9],
                r = [1, 10],
                i = [1, 11],
                s = [1, 14],
                a = [1, 15],
                c = [14, 18, 22, 24],
                u = [18, 22],
                l = [22, 24],
                p = {
                  trace: function() {},
                  yy: {},
                  symbols_: {
                    error: 2,
                    JSONString: 3,
                    STRING: 4,
                    JSONNumber: 5,
                    NUMBER: 6,
                    JSONNullLiteral: 7,
                    NULL: 8,
                    JSONBooleanLiteral: 9,
                    TRUE: 10,
                    FALSE: 11,
                    JSONText: 12,
                    JSONValue: 13,
                    EOF: 14,
                    JSONObject: 15,
                    JSONArray: 16,
                    "{": 17,
                    "}": 18,
                    JSONMemberList: 19,
                    JSONMember: 20,
                    ":": 21,
                    ",": 22,
                    "[": 23,
                    "]": 24,
                    JSONElementList: 25,
                    $accept: 0,
                    $end: 1
                  },
                  terminals_: {
                    2: "error",
                    4: "STRING",
                    6: "NUMBER",
                    8: "NULL",
                    10: "TRUE",
                    11: "FALSE",
                    14: "EOF",
                    17: "{",
                    18: "}",
                    21: ":",
                    22: ",",
                    23: "[",
                    24: "]"
                  },
                  productions_: [
                    0,
                    [3, 1],
                    [5, 1],
                    [7, 1],
                    [9, 1],
                    [9, 1],
                    [12, 2],
                    [13, 1],
                    [13, 1],
                    [13, 1],
                    [13, 1],
                    [13, 1],
                    [13, 1],
                    [15, 2],
                    [15, 3],
                    [20, 3],
                    [19, 1],
                    [19, 3],
                    [16, 2],
                    [16, 3],
                    [25, 1],
                    [25, 3]
                  ],
                  performAction: function(e, t, n, o, r, i, s) {
                    var a = i.length - 1;
                    switch (r) {
                      case 1:
                        this.$ = e
                          .replace(/\\(\\|")/g, "$1")
                          .replace(/\\n/g, "\n")
                          .replace(/\\r/g, "\r")
                          .replace(/\\t/g, "\t")
                          .replace(/\\v/g, "\v")
                          .replace(/\\f/g, "\f")
                          .replace(/\\b/g, "\b");
                        break;
                      case 2:
                        this.$ = Number(e);
                        break;
                      case 3:
                        this.$ = null;
                        break;
                      case 4:
                        this.$ = !0;
                        break;
                      case 5:
                        this.$ = !1;
                        break;
                      case 6:
                        return (this.$ = i[a - 1]);
                      case 13:
                        (this.$ = {}),
                          Object.defineProperty(this.$, "__line__", {
                            value: this._$.first_line,
                            enumerable: !1
                          });
                        break;
                      case 14:
                      case 19:
                        (this.$ = i[a - 1]),
                          Object.defineProperty(this.$, "__line__", {
                            value: this._$.first_line,
                            enumerable: !1
                          });
                        break;
                      case 15:
                        this.$ = [i[a - 2], i[a]];
                        break;
                      case 16:
                        (this.$ = {}), (this.$[i[a][0]] = i[a][1]);
                        break;
                      case 17:
                        (this.$ = i[a - 2]),
                          void 0 !== i[a - 2][i[a][0]] &&
                            (this.$.__duplicateProperties__ ||
                              Object.defineProperty(
                                this.$,
                                "__duplicateProperties__",
                                { value: [], enumerable: !1 }
                              ),
                            this.$.__duplicateProperties__.push(i[a][0])),
                          (i[a - 2][i[a][0]] = i[a][1]);
                        break;
                      case 18:
                        (this.$ = []),
                          Object.defineProperty(this.$, "__line__", {
                            value: this._$.first_line,
                            enumerable: !1
                          });
                        break;
                      case 20:
                        this.$ = [i[a]];
                        break;
                      case 21:
                        (this.$ = i[a - 2]), i[a - 2].push(i[a]);
                    }
                  },
                  table: [
                    {
                      3: 5,
                      4: t,
                      5: 6,
                      6: n,
                      7: 3,
                      8: o,
                      9: 4,
                      10: r,
                      11: i,
                      12: 1,
                      13: 2,
                      15: 7,
                      16: 8,
                      17: s,
                      23: a
                    },
                    { 1: [3] },
                    { 14: [1, 16] },
                    e(c, [2, 7]),
                    e(c, [2, 8]),
                    e(c, [2, 9]),
                    e(c, [2, 10]),
                    e(c, [2, 11]),
                    e(c, [2, 12]),
                    e(c, [2, 3]),
                    e(c, [2, 4]),
                    e(c, [2, 5]),
                    e([14, 18, 21, 22, 24], [2, 1]),
                    e(c, [2, 2]),
                    { 3: 20, 4: t, 18: [1, 17], 19: 18, 20: 19 },
                    {
                      3: 5,
                      4: t,
                      5: 6,
                      6: n,
                      7: 3,
                      8: o,
                      9: 4,
                      10: r,
                      11: i,
                      13: 23,
                      15: 7,
                      16: 8,
                      17: s,
                      23: a,
                      24: [1, 21],
                      25: 22
                    },
                    { 1: [2, 6] },
                    e(c, [2, 13]),
                    { 18: [1, 24], 22: [1, 25] },
                    e(u, [2, 16]),
                    { 21: [1, 26] },
                    e(c, [2, 18]),
                    { 22: [1, 28], 24: [1, 27] },
                    e(l, [2, 20]),
                    e(c, [2, 14]),
                    { 3: 20, 4: t, 20: 29 },
                    {
                      3: 5,
                      4: t,
                      5: 6,
                      6: n,
                      7: 3,
                      8: o,
                      9: 4,
                      10: r,
                      11: i,
                      13: 30,
                      15: 7,
                      16: 8,
                      17: s,
                      23: a
                    },
                    e(c, [2, 19]),
                    {
                      3: 5,
                      4: t,
                      5: 6,
                      6: n,
                      7: 3,
                      8: o,
                      9: 4,
                      10: r,
                      11: i,
                      13: 31,
                      15: 7,
                      16: 8,
                      17: s,
                      23: a
                    },
                    e(u, [2, 17]),
                    e(u, [2, 15]),
                    e(l, [2, 21])
                  ],
                  defaultActions: { 16: [2, 6] },
                  parseError: function(e, t) {
                    if (!t.recoverable) {
                      function n(e, t) {
                        (this.message = e), (this.hash = t);
                      }
                      throw ((n.prototype = Error), new n(e, t));
                    }
                    this.trace(e);
                  },
                  parse: function(e) {
                    var t = this,
                      n = [0],
                      o = [null],
                      r = [],
                      i = this.table,
                      s = "",
                      a = 0,
                      c = 0,
                      u = 0,
                      l = r.slice.call(arguments, 1),
                      p = Object.create(this.lexer),
                      f = { yy: {} };
                    for (var h in this.yy)
                      Object.prototype.hasOwnProperty.call(this.yy, h) &&
                        (f.yy[h] = this.yy[h]);
                    p.setInput(e, f.yy),
                      (f.yy.lexer = p),
                      (f.yy.parser = this),
                      void 0 === p.yylloc && (p.yylloc = {});
                    var d = p.yylloc;
                    r.push(d);
                    var g = p.options && p.options.ranges;
                    "function" == typeof f.yy.parseError
                      ? (this.parseError = f.yy.parseError)
                      : (this.parseError = Object.getPrototypeOf(
                          this
                        ).parseError);
                    for (
                      var y,
                        m,
                        _,
                        v,
                        b,
                        E,
                        T,
                        x,
                        S,
                        C = function() {
                          var e;
                          return (
                            "number" != typeof (e = p.lex() || 1) &&
                              (e = t.symbols_[e] || e),
                            e
                          );
                        },
                        O = {};
                      ;

                    ) {
                      if (
                        ((_ = n[n.length - 1]),
                        void 0 ===
                          (v = this.defaultActions[_]
                            ? this.defaultActions[_]
                            : (null == y && (y = C()), i[_] && i[_][y])) ||
                          !v.length ||
                          !v[0])
                      ) {
                        var I = "";
                        for (E in ((S = []), i[_]))
                          this.terminals_[E] &&
                            2 < E &&
                            S.push("'" + this.terminals_[E] + "'");
                        (I = p.showPosition
                          ? "Parse error on line " +
                            (a + 1) +
                            ":\n" +
                            p.showPosition() +
                            "\nExpecting " +
                            S.join(", ") +
                            ", got '" +
                            (this.terminals_[y] || y) +
                            "'"
                          : "Parse error on line " +
                            (a + 1) +
                            ": Unexpected " +
                            (1 == y
                              ? "end of input"
                              : "'" + (this.terminals_[y] || y) + "'")),
                          this.parseError(I, {
                            text: p.match,
                            token: this.terminals_[y] || y,
                            line: p.yylineno,
                            loc: d,
                            expected: S
                          });
                      }
                      if (v[0] instanceof Array && 1 < v.length)
                        throw new Error(
                          "Parse Error: multiple actions possible at state: " +
                            _ +
                            ", token: " +
                            y
                        );
                      switch (v[0]) {
                        case 1:
                          n.push(y),
                            o.push(p.yytext),
                            r.push(p.yylloc),
                            n.push(v[1]),
                            (y = null),
                            m
                              ? ((y = m), (m = null))
                              : ((c = p.yyleng),
                                (s = p.yytext),
                                (a = p.yylineno),
                                (d = p.yylloc),
                                0 < u && u--);
                          break;
                        case 2:
                          if (
                            ((T = this.productions_[v[1]][1]),
                            (O.$ = o[o.length - T]),
                            (O._$ = {
                              first_line: r[r.length - (T || 1)].first_line,
                              last_line: r[r.length - 1].last_line,
                              first_column: r[r.length - (T || 1)].first_column,
                              last_column: r[r.length - 1].last_column
                            }),
                            g &&
                              (O._$.range = [
                                r[r.length - (T || 1)].range[0],
                                r[r.length - 1].range[1]
                              ]),
                            void 0 !==
                              (b = this.performAction.apply(
                                O,
                                [s, c, a, f.yy, v[1], o, r].concat(l)
                              )))
                          )
                            return b;
                          T &&
                            ((n = n.slice(0, -1 * T * 2)),
                            (o = o.slice(0, -1 * T)),
                            (r = r.slice(0, -1 * T))),
                            n.push(this.productions_[v[1]][0]),
                            o.push(O.$),
                            r.push(O._$),
                            (x = i[n[n.length - 2]][n[n.length - 1]]),
                            n.push(x);
                          break;
                        case 3:
                          return !0;
                      }
                    }
                    return !0;
                  }
                },
                f = {
                  EOF: 1,
                  parseError: function(e, t) {
                    if (!this.yy.parser) throw new Error(e);
                    this.yy.parser.parseError(e, t);
                  },
                  setInput: function(e, t) {
                    return (
                      (this.yy = t || this.yy || {}),
                      (this._input = e),
                      (this._more = this._backtrack = this.done = !1),
                      (this.yylineno = this.yyleng = 0),
                      (this.yytext = this.matched = this.match = ""),
                      (this.conditionStack = ["INITIAL"]),
                      (this.yylloc = {
                        first_line: 1,
                        first_column: 0,
                        last_line: 1,
                        last_column: 0
                      }),
                      this.options.ranges && (this.yylloc.range = [0, 0]),
                      (this.offset = 0),
                      this
                    );
                  },
                  input: function() {
                    var e = this._input[0];
                    return (
                      (this.yytext += e),
                      this.yyleng++,
                      this.offset++,
                      (this.match += e),
                      (this.matched += e),
                      e.match(/(?:\r\n?|\n).*/g)
                        ? (this.yylineno++, this.yylloc.last_line++)
                        : this.yylloc.last_column++,
                      this.options.ranges && this.yylloc.range[1]++,
                      (this._input = this._input.slice(1)),
                      e
                    );
                  },
                  unput: function(e) {
                    var t = e.length,
                      n = e.split(/(?:\r\n?|\n)/g);
                    (this._input = e + this._input),
                      (this.yytext = this.yytext.substr(
                        0,
                        this.yytext.length - t
                      )),
                      (this.offset -= t);
                    var o = this.match.split(/(?:\r\n?|\n)/g);
                    (this.match = this.match.substr(0, this.match.length - 1)),
                      (this.matched = this.matched.substr(
                        0,
                        this.matched.length - 1
                      )),
                      n.length - 1 && (this.yylineno -= n.length - 1);
                    var r = this.yylloc.range;
                    return (
                      (this.yylloc = {
                        first_line: this.yylloc.first_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.first_column,
                        last_column: n
                          ? (n.length === o.length
                              ? this.yylloc.first_column
                              : 0) +
                            o[o.length - n.length].length -
                            n[0].length
                          : this.yylloc.first_column - t
                      }),
                      this.options.ranges &&
                        (this.yylloc.range = [r[0], r[0] + this.yyleng - t]),
                      (this.yyleng = this.yytext.length),
                      this
                    );
                  },
                  more: function() {
                    return (this._more = !0), this;
                  },
                  reject: function() {
                    return this.options.backtrack_lexer
                      ? ((this._backtrack = !0), this)
                      : this.parseError(
                          "Lexical error on line " +
                            (this.yylineno + 1) +
                            ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" +
                            this.showPosition(),
                          { text: "", token: null, line: this.yylineno }
                        );
                  },
                  less: function(e) {
                    this.unput(this.match.slice(e));
                  },
                  pastInput: function() {
                    var e = this.matched.substr(
                      0,
                      this.matched.length - this.match.length
                    );
                    return (
                      (20 < e.length ? "..." : "") +
                      e.substr(-20).replace(/\n/g, "")
                    );
                  },
                  upcomingInput: function() {
                    var e = this.match;
                    return (
                      e.length < 20 &&
                        (e += this._input.substr(0, 20 - e.length)),
                      (e.substr(0, 20) + (20 < e.length ? "..." : "")).replace(
                        /\n/g,
                        ""
                      )
                    );
                  },
                  showPosition: function() {
                    var e = this.pastInput(),
                      t = new Array(e.length + 1).join("-");
                    return e + this.upcomingInput() + "\n" + t + "^";
                  },
                  test_match: function(e, t) {
                    var n, o, r;
                    if (
                      (this.options.backtrack_lexer &&
                        ((r = {
                          yylineno: this.yylineno,
                          yylloc: {
                            first_line: this.yylloc.first_line,
                            last_line: this.last_line,
                            first_column: this.yylloc.first_column,
                            last_column: this.yylloc.last_column
                          },
                          yytext: this.yytext,
                          match: this.match,
                          matches: this.matches,
                          matched: this.matched,
                          yyleng: this.yyleng,
                          offset: this.offset,
                          _more: this._more,
                          _input: this._input,
                          yy: this.yy,
                          conditionStack: this.conditionStack.slice(0),
                          done: this.done
                        }),
                        this.options.ranges &&
                          (r.yylloc.range = this.yylloc.range.slice(0))),
                      (o = e[0].match(/(?:\r\n?|\n).*/g)) &&
                        (this.yylineno += o.length),
                      (this.yylloc = {
                        first_line: this.yylloc.last_line,
                        last_line: this.yylineno + 1,
                        first_column: this.yylloc.last_column,
                        last_column: o
                          ? o[o.length - 1].length -
                            o[o.length - 1].match(/\r?\n?/)[0].length
                          : this.yylloc.last_column + e[0].length
                      }),
                      (this.yytext += e[0]),
                      (this.match += e[0]),
                      (this.matches = e),
                      (this.yyleng = this.yytext.length),
                      this.options.ranges &&
                        (this.yylloc.range = [
                          this.offset,
                          (this.offset += this.yyleng)
                        ]),
                      (this._more = !1),
                      (this._backtrack = !1),
                      (this._input = this._input.slice(e[0].length)),
                      (this.matched += e[0]),
                      (n = this.performAction.call(
                        this,
                        this.yy,
                        this,
                        t,
                        this.conditionStack[this.conditionStack.length - 1]
                      )),
                      this.done && this._input && (this.done = !1),
                      n)
                    )
                      return n;
                    if (this._backtrack) {
                      for (var i in r) this[i] = r[i];
                      return !1;
                    }
                    return !1;
                  },
                  next: function() {
                    if (this.done) return this.EOF;
                    var e, t, n, o;
                    this._input || (this.done = !0),
                      this._more || ((this.yytext = ""), (this.match = ""));
                    for (var r = this._currentRules(), i = 0; i < r.length; i++)
                      if (
                        (n = this._input.match(this.rules[r[i]])) &&
                        (!t || n[0].length > t[0].length)
                      ) {
                        if (((t = n), (o = i), this.options.backtrack_lexer)) {
                          if (!1 !== (e = this.test_match(n, r[i]))) return e;
                          if (this._backtrack) {
                            t = !1;
                            continue;
                          }
                          return !1;
                        }
                        if (!this.options.flex) break;
                      }
                    return t
                      ? !1 !== (e = this.test_match(t, r[o])) && e
                      : "" === this._input
                      ? this.EOF
                      : this.parseError(
                          "Lexical error on line " +
                            (this.yylineno + 1) +
                            ". Unrecognized text.\n" +
                            this.showPosition(),
                          { text: "", token: null, line: this.yylineno }
                        );
                  },
                  lex: function() {
                    var e = this.next();
                    return e || this.lex();
                  },
                  begin: function(e) {
                    this.conditionStack.push(e);
                  },
                  popState: function() {
                    return 0 < this.conditionStack.length - 1
                      ? this.conditionStack.pop()
                      : this.conditionStack[0];
                  },
                  _currentRules: function() {
                    return this.conditionStack.length &&
                      this.conditionStack[this.conditionStack.length - 1]
                      ? this.conditions[
                          this.conditionStack[this.conditionStack.length - 1]
                        ].rules
                      : this.conditions.INITIAL.rules;
                  },
                  topState: function(e) {
                    return 0 <=
                      (e = this.conditionStack.length - 1 - Math.abs(e || 0))
                      ? this.conditionStack[e]
                      : "INITIAL";
                  },
                  pushState: function(e) {
                    this.begin(e);
                  },
                  stateStackSize: function() {
                    return this.conditionStack.length;
                  },
                  options: {},
                  performAction: function(e, t, n, o) {
                    switch (n) {
                      case 0:
                        break;
                      case 1:
                        return 6;
                      case 2:
                        return (t.yytext = t.yytext.substr(1, t.yyleng - 2)), 4;
                      case 3:
                        return 17;
                      case 4:
                        return 18;
                      case 5:
                        return 23;
                      case 6:
                        return 24;
                      case 7:
                        return 22;
                      case 8:
                        return 21;
                      case 9:
                        return 10;
                      case 10:
                        return 11;
                      case 11:
                        return 8;
                      case 12:
                        return 14;
                      case 13:
                        return "INVALID";
                    }
                  },
                  rules: [
                    /^(?:\s+)/,
                    /^(?:(-?([0-9]|[1-9][0-9]+))(\.[0-9]+)?([eE][-+]?[0-9]+)?\b)/,
                    /^(?:"(?:\\[\\"bfnrt\/]|\\u[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*")/,
                    /^(?:\{)/,
                    /^(?:\})/,
                    /^(?:\[)/,
                    /^(?:\])/,
                    /^(?:,)/,
                    /^(?::)/,
                    /^(?:true\b)/,
                    /^(?:false\b)/,
                    /^(?:null\b)/,
                    /^(?:$)/,
                    /^(?:.)/
                  ],
                  conditions: {
                    INITIAL: {
                      rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                      inclusive: !0
                    }
                  }
                };
              function h() {
                this.yy = {};
              }
              return (p.lexer = f), new ((h.prototype = p).Parser = h)();
            })();
            void 0 !== o &&
              void 0 !== r &&
              ((r.parser = e),
              (r.Parser = e.Parser),
              (r.parse = function() {
                return e.parse.apply(e, arguments);
              }),
              (r.main = function(e) {
                e[1] || (console.log("Usage: " + e[0] + " FILE"), n.exit(1));
                var t = o("fs").readFileSync(o("path").normalize(e[1]), "utf8");
                return r.parser.parse(t);
              }),
              void 0 !== t && o.main === t && r.main(n.argv.slice(1)));
          }.call(this, o("_process")));
        },
        { _process: 18, fs: 12, path: 17 }
      ],
      16: [
        function(e, Qe, et) {
          (function(e) {
            var o = "__lodash_hash_undefined__",
              b = 1,
              m = 2,
              n = 9007199254740991,
              _ = "[object Arguments]",
              v = "[object Array]",
              r = "[object AsyncFunction]",
              E = "[object Boolean]",
              T = "[object Date]",
              x = "[object Error]",
              i = "[object Function]",
              s = "[object GeneratorFunction]",
              S = "[object Map]",
              C = "[object Number]",
              a = "[object Null]",
              O = "[object Object]",
              c = "[object Promise]",
              u = "[object Proxy]",
              I = "[object RegExp]",
              L = "[object Set]",
              M = "[object String]",
              w = "[object Symbol]",
              l = "[object Undefined]",
              p = "[object WeakMap]",
              N = "[object ArrayBuffer]",
              A = "[object DataView]",
              f = /^\[object .+?Constructor\]$/,
              h = /^(?:0|[1-9]\d*)$/,
              t = {};
            (t["[object Float32Array]"] = t["[object Float64Array]"] = t[
              "[object Int8Array]"
            ] = t["[object Int16Array]"] = t["[object Int32Array]"] = t[
              "[object Uint8Array]"
            ] = t["[object Uint8ClampedArray]"] = t["[object Uint16Array]"] = t[
              "[object Uint32Array]"
            ] = !0),
              (t[_] = t[v] = t[N] = t[E] = t[A] = t[T] = t[x] = t[i] = t[S] = t[
                C
              ] = t[O] = t[I] = t[L] = t[M] = t[p] = !1);
            var d = "object" == typeof e && e && e.Object === Object && e,
              g =
                "object" == typeof self &&
                self &&
                self.Object === Object &&
                self,
              y = d || g || Function("return this")(),
              P = "object" == typeof et && et && !et.nodeType && et,
              F = P && "object" == typeof Qe && Qe && !Qe.nodeType && Qe,
              j = F && F.exports === P,
              k = j && d.process,
              R = (function() {
                try {
                  return k && k.binding && k.binding("util");
                } catch (e) {}
              })(),
              D = R && R.isTypedArray;
            function U(e, t) {
              for (var n = -1, o = null == e ? 0 : e.length; ++n < o; )
                if (t(e[n], n, e)) return !0;
              return !1;
            }
            function V(e) {
              var n = -1,
                o = Array(e.size);
              return (
                e.forEach(function(e, t) {
                  o[++n] = [t, e];
                }),
                o
              );
            }
            function G(e) {
              var t = -1,
                n = Array(e.size);
              return (
                e.forEach(function(e) {
                  n[++t] = e;
                }),
                n
              );
            }
            var B,
              $,
              J,
              z = Array.prototype,
              q = Function.prototype,
              Y = Object.prototype,
              X = y["__core-js_shared__"],
              K = q.toString,
              W = Y.hasOwnProperty,
              H = (B = /[^.]+$/.exec((X && X.keys && X.keys.IE_PROTO) || ""))
                ? "Symbol(src)_1." + B
                : "",
              Z = Y.toString,
              Q = RegExp(
                "^" +
                  K.call(W)
                    .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                    .replace(
                      /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                      "$1.*?"
                    ) +
                  "$"
              ),
              ee = j ? y.Buffer : void 0,
              te = y.Symbol,
              ne = y.Uint8Array,
              oe = Y.propertyIsEnumerable,
              re = z.splice,
              ie = te ? te.toStringTag : void 0,
              se = Object.getOwnPropertySymbols,
              ae = ee ? ee.isBuffer : void 0,
              ce =
                (($ = Object.keys),
                (J = Object),
                function(e) {
                  return $(J(e));
                }),
              ue = Re(y, "DataView"),
              le = Re(y, "Map"),
              pe = Re(y, "Promise"),
              fe = Re(y, "Set"),
              he = Re(y, "WeakMap"),
              de = Re(Object, "create"),
              ge = Ge(ue),
              ye = Ge(le),
              me = Ge(pe),
              _e = Ge(fe),
              ve = Ge(he),
              be = te ? te.prototype : void 0,
              Ee = be ? be.valueOf : void 0;
            function Te(e) {
              var t = -1,
                n = null == e ? 0 : e.length;
              for (this.clear(); ++t < n; ) {
                var o = e[t];
                this.set(o[0], o[1]);
              }
            }
            function xe(e) {
              var t = -1,
                n = null == e ? 0 : e.length;
              for (this.clear(); ++t < n; ) {
                var o = e[t];
                this.set(o[0], o[1]);
              }
            }
            function Se(e) {
              var t = -1,
                n = null == e ? 0 : e.length;
              for (this.clear(); ++t < n; ) {
                var o = e[t];
                this.set(o[0], o[1]);
              }
            }
            function Ce(e) {
              var t = -1,
                n = null == e ? 0 : e.length;
              for (this.__data__ = new Se(); ++t < n; ) this.add(e[t]);
            }
            function Oe(e) {
              var t = (this.__data__ = new xe(e));
              this.size = t.size;
            }
            function Ie(e, t) {
              var n = Je(e),
                o = !n && $e(e),
                r = !n && !o && ze(e),
                i = !n && !o && !r && He(e),
                s = n || o || r || i,
                a = s
                  ? (function(e, t) {
                      for (var n = -1, o = Array(e); ++n < e; ) o[n] = t(n);
                      return o;
                    })(e.length, String)
                  : [],
                c = a.length;
              for (var u in e)
                (!t && !W.call(e, u)) ||
                  (s &&
                    ("length" == u ||
                      (r && ("offset" == u || "parent" == u)) ||
                      (i &&
                        ("buffer" == u ||
                          "byteLength" == u ||
                          "byteOffset" == u)) ||
                      Ve(u, c))) ||
                  a.push(u);
              return a;
            }
            function Le(e, t) {
              for (var n = e.length; n--; ) if (Be(e[n][0], t)) return n;
              return -1;
            }
            function Me(e) {
              return null == e
                ? void 0 === e
                  ? l
                  : a
                : ie && ie in Object(e)
                ? (function(e) {
                    var t = W.call(e, ie),
                      n = e[ie];
                    try {
                      var o = !(e[ie] = void 0);
                    } catch (e) {}
                    var r = Z.call(e);
                    o && (t ? (e[ie] = n) : delete e[ie]);
                    return r;
                  })(e)
                : ((t = e), Z.call(t));
              var t;
            }
            function we(e) {
              return Ke(e) && Me(e) == _;
            }
            function Ne(e, t, n, o, r) {
              return (
                e === t ||
                (null == e || null == t || (!Ke(e) && !Ke(t))
                  ? e != e && t != t
                  : (function(e, t, n, o, r, i) {
                      var s = Je(e),
                        a = Je(t),
                        c = s ? v : Ue(e),
                        u = a ? v : Ue(t),
                        l = (c = c == _ ? O : c) == O,
                        p = (u = u == _ ? O : u) == O,
                        f = c == u;
                      if (f && ze(e)) {
                        if (!ze(t)) return !1;
                        l = !(s = !0);
                      }
                      if (f && !l)
                        return (
                          i || (i = new Oe()),
                          s || He(e)
                            ? Fe(e, t, n, o, r, i)
                            : (function(e, t, n, o, r, i, s) {
                                switch (n) {
                                  case A:
                                    if (
                                      e.byteLength != t.byteLength ||
                                      e.byteOffset != t.byteOffset
                                    )
                                      return !1;
                                    (e = e.buffer), (t = t.buffer);
                                  case N:
                                    return !(
                                      e.byteLength != t.byteLength ||
                                      !i(new ne(e), new ne(t))
                                    );
                                  case E:
                                  case T:
                                  case C:
                                    return Be(+e, +t);
                                  case x:
                                    return (
                                      e.name == t.name && e.message == t.message
                                    );
                                  case I:
                                  case M:
                                    return e == t + "";
                                  case S:
                                    var a = V;
                                  case L:
                                    var c = o & b;
                                    if ((a || (a = G), e.size != t.size && !c))
                                      return !1;
                                    var u = s.get(e);
                                    if (u) return u == t;
                                    (o |= m), s.set(e, t);
                                    var l = Fe(a(e), a(t), o, r, i, s);
                                    return s.delete(e), l;
                                  case w:
                                    if (Ee) return Ee.call(e) == Ee.call(t);
                                }
                                return !1;
                              })(e, t, c, n, o, r, i)
                        );
                      if (!(n & b)) {
                        var h = l && W.call(e, "__wrapped__"),
                          d = p && W.call(t, "__wrapped__");
                        if (h || d) {
                          var g = h ? e.value() : e,
                            y = d ? t.value() : t;
                          return i || (i = new Oe()), r(g, y, n, o, i);
                        }
                      }
                      return (
                        !!f &&
                        (i || (i = new Oe()),
                        (function(e, t, n, o, r, i) {
                          var s = n & b,
                            a = je(e),
                            c = a.length,
                            u = je(t).length;
                          if (c != u && !s) return !1;
                          for (var l = c; l--; ) {
                            var p = a[l];
                            if (!(s ? p in t : W.call(t, p))) return !1;
                          }
                          var f = i.get(e);
                          if (f && i.get(t)) return f == t;
                          var h = !0;
                          i.set(e, t), i.set(t, e);
                          for (var d = s; ++l < c; ) {
                            p = a[l];
                            var g = e[p],
                              y = t[p];
                            if (o)
                              var m = s
                                ? o(y, g, p, t, e, i)
                                : o(g, y, p, e, t, i);
                            if (
                              !(void 0 === m ? g === y || r(g, y, n, o, i) : m)
                            ) {
                              h = !1;
                              break;
                            }
                            d || (d = "constructor" == p);
                          }
                          if (h && !d) {
                            var _ = e.constructor,
                              v = t.constructor;
                            _ != v &&
                              "constructor" in e &&
                              "constructor" in t &&
                              !(
                                "function" == typeof _ &&
                                _ instanceof _ &&
                                "function" == typeof v &&
                                v instanceof v
                              ) &&
                              (h = !1);
                          }
                          return i.delete(e), i.delete(t), h;
                        })(e, t, n, o, r, i))
                      );
                    })(e, t, n, o, Ne, r))
              );
            }
            function Ae(e) {
              return (
                !(!Xe(e) || ((t = e), H && H in t)) &&
                (qe(e) ? Q : f).test(Ge(e))
              );
              var t;
            }
            function Pe(e) {
              if (
                ((n = (t = e) && t.constructor),
                (o = ("function" == typeof n && n.prototype) || Y),
                t !== o)
              )
                return ce(e);
              var t,
                n,
                o,
                r = [];
              for (var i in Object(e))
                W.call(e, i) && "constructor" != i && r.push(i);
              return r;
            }
            function Fe(e, t, o, r, i, s) {
              var n = o & b,
                a = e.length,
                c = t.length;
              if (a != c && !(n && a < c)) return !1;
              var u = s.get(e);
              if (u && s.get(t)) return u == t;
              var l = -1,
                p = !0,
                f = o & m ? new Ce() : void 0;
              for (s.set(e, t), s.set(t, e); ++l < a; ) {
                var h = e[l],
                  d = t[l];
                if (r) var g = n ? r(d, h, l, t, e, s) : r(h, d, l, e, t, s);
                if (void 0 !== g) {
                  if (g) continue;
                  p = !1;
                  break;
                }
                if (f) {
                  if (
                    !U(t, function(e, t) {
                      if (((n = t), !f.has(n) && (h === e || i(h, e, o, r, s))))
                        return f.push(t);
                      var n;
                    })
                  ) {
                    p = !1;
                    break;
                  }
                } else if (h !== d && !i(h, d, o, r, s)) {
                  p = !1;
                  break;
                }
              }
              return s.delete(e), s.delete(t), p;
            }
            function je(e) {
              return (
                (n = De),
                (o = Ze((t = e))),
                Je(t)
                  ? o
                  : (function(e, t) {
                      for (var n = -1, o = t.length, r = e.length; ++n < o; )
                        e[r + n] = t[n];
                      return e;
                    })(o, n(t))
              );
              var t, n, o;
            }
            function ke(e, t) {
              var n,
                o,
                r = e.__data__;
              return ("string" == (o = typeof (n = t)) ||
              "number" == o ||
              "symbol" == o ||
              "boolean" == o
              ? "__proto__" !== n
              : null === n)
                ? r["string" == typeof t ? "string" : "hash"]
                : r.map;
            }
            function Re(e, t) {
              var n,
                o,
                r = ((o = t), null == (n = e) ? void 0 : n[o]);
              return Ae(r) ? r : void 0;
            }
            (Te.prototype.clear = function() {
              (this.__data__ = de ? de(null) : {}), (this.size = 0);
            }),
              (Te.prototype.delete = function(e) {
                var t = this.has(e) && delete this.__data__[e];
                return (this.size -= t ? 1 : 0), t;
              }),
              (Te.prototype.get = function(e) {
                var t = this.__data__;
                if (de) {
                  var n = t[e];
                  return n === o ? void 0 : n;
                }
                return W.call(t, e) ? t[e] : void 0;
              }),
              (Te.prototype.has = function(e) {
                var t = this.__data__;
                return de ? void 0 !== t[e] : W.call(t, e);
              }),
              (Te.prototype.set = function(e, t) {
                var n = this.__data__;
                return (
                  (this.size += this.has(e) ? 0 : 1),
                  (n[e] = de && void 0 === t ? o : t),
                  this
                );
              }),
              (xe.prototype.clear = function() {
                (this.__data__ = []), (this.size = 0);
              }),
              (xe.prototype.delete = function(e) {
                var t = this.__data__,
                  n = Le(t, e);
                return !(
                  n < 0 ||
                  (n == t.length - 1 ? t.pop() : re.call(t, n, 1),
                  --this.size,
                  0)
                );
              }),
              (xe.prototype.get = function(e) {
                var t = this.__data__,
                  n = Le(t, e);
                return n < 0 ? void 0 : t[n][1];
              }),
              (xe.prototype.has = function(e) {
                return -1 < Le(this.__data__, e);
              }),
              (xe.prototype.set = function(e, t) {
                var n = this.__data__,
                  o = Le(n, e);
                return (
                  o < 0 ? (++this.size, n.push([e, t])) : (n[o][1] = t), this
                );
              }),
              (Se.prototype.clear = function() {
                (this.size = 0),
                  (this.__data__ = {
                    hash: new Te(),
                    map: new (le || xe)(),
                    string: new Te()
                  });
              }),
              (Se.prototype.delete = function(e) {
                var t = ke(this, e).delete(e);
                return (this.size -= t ? 1 : 0), t;
              }),
              (Se.prototype.get = function(e) {
                return ke(this, e).get(e);
              }),
              (Se.prototype.has = function(e) {
                return ke(this, e).has(e);
              }),
              (Se.prototype.set = function(e, t) {
                var n = ke(this, e),
                  o = n.size;
                return n.set(e, t), (this.size += n.size == o ? 0 : 1), this;
              }),
              (Ce.prototype.add = Ce.prototype.push = function(e) {
                return this.__data__.set(e, o), this;
              }),
              (Ce.prototype.has = function(e) {
                return this.__data__.has(e);
              }),
              (Oe.prototype.clear = function() {
                (this.__data__ = new xe()), (this.size = 0);
              }),
              (Oe.prototype.delete = function(e) {
                var t = this.__data__,
                  n = t.delete(e);
                return (this.size = t.size), n;
              }),
              (Oe.prototype.get = function(e) {
                return this.__data__.get(e);
              }),
              (Oe.prototype.has = function(e) {
                return this.__data__.has(e);
              }),
              (Oe.prototype.set = function(e, t) {
                var n = this.__data__;
                if (n instanceof xe) {
                  var o = n.__data__;
                  if (!le || o.length < 199)
                    return o.push([e, t]), (this.size = ++n.size), this;
                  n = this.__data__ = new Se(o);
                }
                return n.set(e, t), (this.size = n.size), this;
              });
            var De = se
                ? function(t) {
                    return null == t
                      ? []
                      : ((t = Object(t)),
                        (function(e, t) {
                          for (
                            var n = -1,
                              o = null == e ? 0 : e.length,
                              r = 0,
                              i = [];
                            ++n < o;

                          ) {
                            var s = e[n];
                            t(s, n, e) && (i[r++] = s);
                          }
                          return i;
                        })(se(t), function(e) {
                          return oe.call(t, e);
                        }));
                  }
                : function() {
                    return [];
                  },
              Ue = Me;
            function Ve(e, t) {
              return (
                !!(t = null == t ? n : t) &&
                ("number" == typeof e || h.test(e)) &&
                -1 < e &&
                e % 1 == 0 &&
                e < t
              );
            }
            function Ge(e) {
              if (null != e) {
                try {
                  return K.call(e);
                } catch (e) {}
                try {
                  return e + "";
                } catch (e) {}
              }
              return "";
            }
            function Be(e, t) {
              return e === t || (e != e && t != t);
            }
            ((ue && Ue(new ue(new ArrayBuffer(1))) != A) ||
              (le && Ue(new le()) != S) ||
              (pe && Ue(pe.resolve()) != c) ||
              (fe && Ue(new fe()) != L) ||
              (he && Ue(new he()) != p)) &&
              (Ue = function(e) {
                var t = Me(e),
                  n = t == O ? e.constructor : void 0,
                  o = n ? Ge(n) : "";
                if (o)
                  switch (o) {
                    case ge:
                      return A;
                    case ye:
                      return S;
                    case me:
                      return c;
                    case _e:
                      return L;
                    case ve:
                      return p;
                  }
                return t;
              });
            var $e = we(
                (function() {
                  return arguments;
                })()
              )
                ? we
                : function(e) {
                    return (
                      Ke(e) && W.call(e, "callee") && !oe.call(e, "callee")
                    );
                  },
              Je = Array.isArray;
            var ze =
              ae ||
              function() {
                return !1;
              };
            function qe(e) {
              if (!Xe(e)) return !1;
              var t = Me(e);
              return t == i || t == s || t == r || t == u;
            }
            function Ye(e) {
              return "number" == typeof e && -1 < e && e % 1 == 0 && e <= n;
            }
            function Xe(e) {
              var t = typeof e;
              return null != e && ("object" == t || "function" == t);
            }
            function Ke(e) {
              return null != e && "object" == typeof e;
            }
            var We,
              He = D
                ? ((We = D),
                  function(e) {
                    return We(e);
                  })
                : function(e) {
                    return Ke(e) && Ye(e.length) && !!t[Me(e)];
                  };
            function Ze(e) {
              return null != (t = e) && Ye(t.length) && !qe(t) ? Ie(e) : Pe(e);
              var t;
            }
            Qe.exports = function(e, t) {
              return Ne(e, t);
            };
          }.call(
            this,
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          ));
        },
        {}
      ],
      17: [
        function(e, t, u) {
          (function(r) {
            function i(e, t) {
              for (var n = 0, o = e.length - 1; 0 <= o; o--) {
                var r = e[o];
                "." === r
                  ? e.splice(o, 1)
                  : ".." === r
                  ? (e.splice(o, 1), n++)
                  : n && (e.splice(o, 1), n--);
              }
              if (t) for (; n--; n) e.unshift("..");
              return e;
            }
            function s(e, t) {
              if (e.filter) return e.filter(t);
              for (var n = [], o = 0; o < e.length; o++)
                t(e[o], o, e) && n.push(e[o]);
              return n;
            }
            (u.resolve = function() {
              for (
                var e = "", t = !1, n = arguments.length - 1;
                -1 <= n && !t;
                n--
              ) {
                var o = 0 <= n ? arguments[n] : r.cwd();
                if ("string" != typeof o)
                  throw new TypeError(
                    "Arguments to path.resolve must be strings"
                  );
                o && ((e = o + "/" + e), (t = "/" === o.charAt(0)));
              }
              return (
                (t ? "/" : "") +
                  (e = i(
                    s(e.split("/"), function(e) {
                      return !!e;
                    }),
                    !t
                  ).join("/")) || "."
              );
            }),
              (u.normalize = function(e) {
                var t = u.isAbsolute(e),
                  n = "/" === o(e, -1);
                return (
                  (e = i(
                    s(e.split("/"), function(e) {
                      return !!e;
                    }),
                    !t
                  ).join("/")) ||
                    t ||
                    (e = "."),
                  e && n && (e += "/"),
                  (t ? "/" : "") + e
                );
              }),
              (u.isAbsolute = function(e) {
                return "/" === e.charAt(0);
              }),
              (u.join = function() {
                var e = Array.prototype.slice.call(arguments, 0);
                return u.normalize(
                  s(e, function(e, t) {
                    if ("string" != typeof e)
                      throw new TypeError(
                        "Arguments to path.join must be strings"
                      );
                    return e;
                  }).join("/")
                );
              }),
              (u.relative = function(e, t) {
                function n(e) {
                  for (var t = 0; t < e.length && "" === e[t]; t++);
                  for (var n = e.length - 1; 0 <= n && "" === e[n]; n--);
                  return n < t ? [] : e.slice(t, n - t + 1);
                }
                (e = u.resolve(e).substr(1)), (t = u.resolve(t).substr(1));
                for (
                  var o = n(e.split("/")),
                    r = n(t.split("/")),
                    i = Math.min(o.length, r.length),
                    s = i,
                    a = 0;
                  a < i;
                  a++
                )
                  if (o[a] !== r[a]) {
                    s = a;
                    break;
                  }
                var c = [];
                for (a = s; a < o.length; a++) c.push("..");
                return (c = c.concat(r.slice(s))).join("/");
              }),
              (u.sep = "/"),
              (u.delimiter = ":"),
              (u.dirname = function(e) {
                if (("string" != typeof e && (e += ""), 0 === e.length))
                  return ".";
                for (
                  var t = e.charCodeAt(0),
                    n = 47 === t,
                    o = -1,
                    r = !0,
                    i = e.length - 1;
                  1 <= i;
                  --i
                )
                  if (47 === (t = e.charCodeAt(i))) {
                    if (!r) {
                      o = i;
                      break;
                    }
                  } else r = !1;
                return -1 === o
                  ? n
                    ? "/"
                    : "."
                  : n && 1 === o
                  ? "/"
                  : e.slice(0, o);
              }),
              (u.basename = function(e, t) {
                var n = (function(e) {
                  "string" != typeof e && (e += "");
                  var t,
                    n = 0,
                    o = -1,
                    r = !0;
                  for (t = e.length - 1; 0 <= t; --t)
                    if (47 === e.charCodeAt(t)) {
                      if (!r) {
                        n = t + 1;
                        break;
                      }
                    } else -1 === o && ((r = !1), (o = t + 1));
                  return -1 === o ? "" : e.slice(n, o);
                })(e);
                return (
                  t &&
                    n.substr(-1 * t.length) === t &&
                    (n = n.substr(0, n.length - t.length)),
                  n
                );
              }),
              (u.extname = function(e) {
                "string" != typeof e && (e += "");
                for (
                  var t = -1, n = 0, o = -1, r = !0, i = 0, s = e.length - 1;
                  0 <= s;
                  --s
                ) {
                  var a = e.charCodeAt(s);
                  if (47 === a) {
                    if (r) continue;
                    n = s + 1;
                    break;
                  }
                  -1 === o && ((r = !1), (o = s + 1)),
                    46 === a
                      ? -1 === t
                        ? (t = s)
                        : 1 !== i && (i = 1)
                      : -1 !== t && (i = -1);
                }
                return -1 === t ||
                  -1 === o ||
                  0 === i ||
                  (1 === i && t === o - 1 && t === n + 1)
                  ? ""
                  : e.slice(t, o);
              });
            var o =
              "b" === "ab".substr(-1)
                ? function(e, t, n) {
                    return e.substr(t, n);
                  }
                : function(e, t, n) {
                    return t < 0 && (t = e.length + t), e.substr(t, n);
                  };
          }.call(this, e("_process")));
        },
        { _process: 18 }
      ],
      18: [
        function(e, t, n) {
          var o,
            r,
            i = (t.exports = {});
          function s() {
            throw new Error("setTimeout has not been defined");
          }
          function a() {
            throw new Error("clearTimeout has not been defined");
          }
          function c(t) {
            if (o === setTimeout) return setTimeout(t, 0);
            if ((o === s || !o) && setTimeout)
              return (o = setTimeout), setTimeout(t, 0);
            try {
              return o(t, 0);
            } catch (e) {
              try {
                return o.call(null, t, 0);
              } catch (e) {
                return o.call(this, t, 0);
              }
            }
          }
          !(function() {
            try {
              o = "function" == typeof setTimeout ? setTimeout : s;
            } catch (e) {
              o = s;
            }
            try {
              r = "function" == typeof clearTimeout ? clearTimeout : a;
            } catch (e) {
              r = a;
            }
          })();
          var u,
            l = [],
            p = !1,
            f = -1;
          function h() {
            p &&
              u &&
              ((p = !1),
              u.length ? (l = u.concat(l)) : (f = -1),
              l.length && d());
          }
          function d() {
            if (!p) {
              var e = c(h);
              p = !0;
              for (var t = l.length; t; ) {
                for (u = l, l = []; ++f < t; ) u && u[f].run();
                (f = -1), (t = l.length);
              }
              (u = null),
                (p = !1),
                (function(t) {
                  if (r === clearTimeout) return clearTimeout(t);
                  if ((r === a || !r) && clearTimeout)
                    return (r = clearTimeout), clearTimeout(t);
                  try {
                    r(t);
                  } catch (e) {
                    try {
                      return r.call(null, t);
                    } catch (e) {
                      return r.call(this, t);
                    }
                  }
                })(e);
            }
          }
          function g(e, t) {
            (this.fun = e), (this.array = t);
          }
          function y() {}
          (i.nextTick = function(e) {
            var t = new Array(arguments.length - 1);
            if (1 < arguments.length)
              for (var n = 1; n < arguments.length; n++)
                t[n - 1] = arguments[n];
            l.push(new g(e, t)), 1 !== l.length || p || c(d);
          }),
            (g.prototype.run = function() {
              this.fun.apply(null, this.array);
            }),
            (i.title = "browser"),
            (i.browser = !0),
            (i.env = {}),
            (i.argv = []),
            (i.version = ""),
            (i.versions = {}),
            (i.on = y),
            (i.addListener = y),
            (i.once = y),
            (i.off = y),
            (i.removeListener = y),
            (i.removeAllListeners = y),
            (i.emit = y),
            (i.prependListener = y),
            (i.prependOnceListener = y),
            (i.listeners = function(e) {
              return [];
            }),
            (i.binding = function(e) {
              throw new Error("process.binding is not supported");
            }),
            (i.cwd = function() {
              return "/";
            }),
            (i.chdir = function(e) {
              throw new Error("process.chdir is not supported");
            }),
            (i.umask = function() {
              return 0;
            });
        },
        {}
      ],
      19: [
        function(e, t, n) {
          var r = (t.exports = function(e) {
            return new i(e);
          });
          function i(e) {
            this.value = e;
          }
          function o(e, c, u) {
            var l = [],
              p = [],
              f = !0;
            return (function o(t) {
              var e = u ? h(t) : t,
                r = {},
                n = !0,
                i = {
                  node: e,
                  node_: t,
                  path: [].concat(l),
                  parent: p[p.length - 1],
                  parents: p,
                  key: l.slice(-1)[0],
                  isRoot: 0 === l.length,
                  level: l.length,
                  circular: null,
                  update: function(e, t) {
                    i.isRoot || (i.parent.node[i.key] = e),
                      (i.node = e),
                      t && (n = !1);
                  },
                  delete: function(e) {
                    delete i.parent.node[i.key], e && (n = !1);
                  },
                  remove: function(e) {
                    g(i.parent.node)
                      ? i.parent.node.splice(i.key, 1)
                      : delete i.parent.node[i.key],
                      e && (n = !1);
                  },
                  keys: null,
                  before: function(e) {
                    r.before = e;
                  },
                  after: function(e) {
                    r.after = e;
                  },
                  pre: function(e) {
                    r.pre = e;
                  },
                  post: function(e) {
                    r.post = e;
                  },
                  stop: function() {
                    f = !1;
                  },
                  block: function() {
                    n = !1;
                  }
                };
              if (!f) return i;
              function s() {
                if ("object" == typeof i.node && null !== i.node) {
                  (i.keys && i.node_ === i.node) || (i.keys = d(i.node)),
                    (i.isLeaf = 0 == i.keys.length);
                  for (var e = 0; e < p.length; e++)
                    if (p[e].node_ === t) {
                      i.circular = p[e];
                      break;
                    }
                } else (i.isLeaf = !0), (i.keys = null);
                (i.notLeaf = !i.isLeaf), (i.notRoot = !i.isRoot);
              }
              s();
              var a = c.call(i, i.node);
              return (
                void 0 !== a && i.update && i.update(a),
                r.before && r.before.call(i, i.node),
                n &&
                  ("object" != typeof i.node ||
                    null === i.node ||
                    i.circular ||
                    (p.push(i),
                    s(),
                    y(i.keys, function(e, t) {
                      l.push(e), r.pre && r.pre.call(i, i.node[e], e);
                      var n = o(i.node[e]);
                      u && m.call(i.node, e) && (i.node[e] = n.node),
                        (n.isLast = t == i.keys.length - 1),
                        (n.isFirst = 0 == t),
                        r.post && r.post.call(i, n),
                        l.pop();
                    }),
                    p.pop()),
                  r.after && r.after.call(i, i.node)),
                i
              );
            })(e).node;
          }
          function h(t) {
            if ("object" != typeof t || null === t) return t;
            var n;
            if (g(t)) n = [];
            else if ("[object Date]" === s(t))
              n = new Date(t.getTime ? t.getTime() : t);
            else if ("[object RegExp]" === s(t)) n = new RegExp(t);
            else if ("[object Error]" === s(t)) n = { message: t.message };
            else if ("[object Boolean]" === s(t)) n = new Boolean(t);
            else if ("[object Number]" === s(t)) n = new Number(t);
            else if ("[object String]" === s(t)) n = new String(t);
            else if (Object.create && Object.getPrototypeOf)
              n = Object.create(Object.getPrototypeOf(t));
            else if (t.constructor === Object) n = {};
            else {
              var e =
                  (t.constructor && t.constructor.prototype) ||
                  t.__proto__ ||
                  {},
                o = function() {};
              (o.prototype = e), (n = new o());
            }
            return (
              y(d(t), function(e) {
                n[e] = t[e];
              }),
              n
            );
          }
          (i.prototype.get = function(e) {
            for (var t = this.value, n = 0; n < e.length; n++) {
              var o = e[n];
              if (!t || !m.call(t, o)) {
                t = void 0;
                break;
              }
              t = t[o];
            }
            return t;
          }),
            (i.prototype.has = function(e) {
              for (var t = this.value, n = 0; n < e.length; n++) {
                var o = e[n];
                if (!t || !m.call(t, o)) return !1;
                t = t[o];
              }
              return !0;
            }),
            (i.prototype.set = function(e, t) {
              for (var n = this.value, o = 0; o < e.length - 1; o++) {
                var r = e[o];
                m.call(n, r) || (n[r] = {}), (n = n[r]);
              }
              return (n[e[o]] = t);
            }),
            (i.prototype.map = function(e) {
              return o(this.value, e, !0);
            }),
            (i.prototype.forEach = function(e) {
              return (this.value = o(this.value, e, !1)), this.value;
            }),
            (i.prototype.reduce = function(t, e) {
              var n = 1 === arguments.length,
                o = n ? this.value : e;
              return (
                this.forEach(function(e) {
                  (this.isRoot && n) || (o = t.call(this, o, e));
                }),
                o
              );
            }),
            (i.prototype.paths = function() {
              var t = [];
              return (
                this.forEach(function(e) {
                  t.push(this.path);
                }),
                t
              );
            }),
            (i.prototype.nodes = function() {
              var t = [];
              return (
                this.forEach(function(e) {
                  t.push(this.node);
                }),
                t
              );
            }),
            (i.prototype.clone = function() {
              var r = [],
                i = [];
              return (function t(n) {
                for (var e = 0; e < r.length; e++) if (r[e] === n) return i[e];
                if ("object" != typeof n || null === n) return n;
                var o = h(n);
                return (
                  r.push(n),
                  i.push(o),
                  y(d(n), function(e) {
                    o[e] = t(n[e]);
                  }),
                  r.pop(),
                  i.pop(),
                  o
                );
              })(this.value);
            });
          var d =
            Object.keys ||
            function(e) {
              var t = [];
              for (var n in e) t.push(n);
              return t;
            };
          function s(e) {
            return Object.prototype.toString.call(e);
          }
          var g =
              Array.isArray ||
              function(e) {
                return "[object Array]" === Object.prototype.toString.call(e);
              },
            y = function(e, t) {
              if (e.forEach) return e.forEach(t);
              for (var n = 0; n < e.length; n++) t(e[n], n, e);
            };
          y(d(i.prototype), function(o) {
            r[o] = function(e) {
              var t = [].slice.call(arguments, 1),
                n = new i(e);
              return n[o].apply(n, t);
            };
          });
          var m =
            Object.hasOwnProperty ||
            function(e, t) {
              return t in e;
            };
        },
        {}
      ],
      20: [
        function(e, t, n) {
          (t.exports.RADIUS = 6378137),
            (t.exports.FLATTENING = 1 / 298.257223563),
            (t.exports.POLAR_RADIUS = 6356752.3142);
        },
        {}
      ],
      21: [
        function(e, t, n) {
          t.exports = function() {
            for (var e = {}, t = 0; t < arguments.length; t++) {
              var n = arguments[t];
              for (var o in n) r.call(n, o) && (e[o] = n[o]);
            }
            return e;
          };
          var r = Object.prototype.hasOwnProperty;
        },
        {}
      ],
      22: [
        function(e, t, n) {
          "use strict";
          var r = e("lodash.isequal"),
            o = e("@mapbox/geojson-normalize"),
            a = e("hat"),
            c = e("./lib/features_at"),
            u = e("./lib/string_sets_are_equal"),
            l = e("@mapbox/geojsonhint"),
            p = e("./constants"),
            f = e("./lib/string_set"),
            h = {
              Polygon: e("./feature_types/polygon"),
              LineString: e("./feature_types/line_string"),
              Point: e("./feature_types/point"),
              MultiPolygon: e("./feature_types/multi_feature"),
              MultiLineString: e("./feature_types/multi_feature"),
              MultiPoint: e("./feature_types/multi_feature")
            };
          t.exports = function(i, s) {
            return (
              (s.modes = p.modes),
              (s.getFeatureIdsAt = function(e) {
                return c.click({ point: e }, null, i).map(function(e) {
                  return e.properties.id;
                });
              }),
              (s.getSelectedIds = function() {
                return i.store.getSelectedIds();
              }),
              (s.getSelected = function() {
                return {
                  type: p.geojsonTypes.FEATURE_COLLECTION,
                  features: i.store
                    .getSelectedIds()
                    .map(function(e) {
                      return i.store.get(e);
                    })
                    .map(function(e) {
                      return e.toGeoJSON();
                    })
                };
              }),
              (s.getSelectedPoints = function() {
                return {
                  type: p.geojsonTypes.FEATURE_COLLECTION,
                  features: i.store.getSelectedCoordinates().map(function(e) {
                    return {
                      type: p.geojsonTypes.FEATURE,
                      properties: {},
                      geometry: {
                        type: p.geojsonTypes.POINT,
                        coordinates: e.coordinates
                      }
                    };
                  })
                };
              }),
              (s.set = function(e) {
                if (
                  void 0 === e.type ||
                  e.type !== p.geojsonTypes.FEATURE_COLLECTION ||
                  !Array.isArray(e.features)
                )
                  throw new Error("Invalid FeatureCollection");
                var t = i.store.createRenderBatch(),
                  n = i.store.getAllIds().slice(),
                  o = s.add(e),
                  r = new f(o);
                return (
                  (n = n.filter(function(e) {
                    return !r.has(e);
                  })).length && s.delete(n),
                  t(),
                  o
                );
              }),
              (s.add = function(e) {
                var t = l.hint(e, { precisionWarning: !1 }).filter(function(e) {
                  return "message" !== e.level;
                });
                if (t.length) throw new Error(t[0].message);
                var n = JSON.parse(JSON.stringify(o(e))).features.map(function(
                  e
                ) {
                  if (((e.id = e.id || a()), null === e.geometry))
                    throw new Error("Invalid geometry: null");
                  if (
                    void 0 === i.store.get(e.id) ||
                    i.store.get(e.id).type !== e.geometry.type
                  ) {
                    var t = h[e.geometry.type];
                    if (void 0 === t)
                      throw new Error(
                        "Invalid geometry type: ".concat(e.geometry.type, ".")
                      );
                    var n = new t(i, e);
                    i.store.add(n);
                  } else {
                    var o = i.store.get(e.id);
                    (o.properties = e.properties),
                      r(o.getCoordinates(), e.geometry.coordinates) ||
                        o.incomingCoords(e.geometry.coordinates);
                  }
                  return e.id;
                });
                return i.store.render(), n;
              }),
              (s.get = function(e) {
                var t = i.store.get(e);
                if (t) return t.toGeoJSON();
              }),
              (s.getAll = function() {
                return {
                  type: p.geojsonTypes.FEATURE_COLLECTION,
                  features: i.store.getAll().map(function(e) {
                    return e.toGeoJSON();
                  })
                };
              }),
              (s.delete = function(e) {
                return (
                  i.store.delete(e, { silent: !0 }),
                  s.getMode() !== p.modes.DIRECT_SELECT ||
                  i.store.getSelectedIds().length
                    ? i.store.render()
                    : i.events.changeMode(p.modes.SIMPLE_SELECT, void 0, {
                        silent: !0
                      }),
                  s
                );
              }),
              (s.deleteAll = function() {
                return (
                  i.store.delete(i.store.getAllIds(), { silent: !0 }),
                  s.getMode() === p.modes.DIRECT_SELECT
                    ? i.events.changeMode(p.modes.SIMPLE_SELECT, void 0, {
                        silent: !0
                      })
                    : i.store.render(),
                  s
                );
              }),
              (s.changeMode = function(e) {
                var t =
                  1 < arguments.length && void 0 !== arguments[1]
                    ? arguments[1]
                    : {};
                return (
                  e === p.modes.SIMPLE_SELECT &&
                  s.getMode() === p.modes.SIMPLE_SELECT
                    ? u(t.featureIds || [], i.store.getSelectedIds()) ||
                      (i.store.setSelected(t.featureIds, { silent: !0 }),
                      i.store.render())
                    : (e === p.modes.DIRECT_SELECT &&
                        s.getMode() === p.modes.DIRECT_SELECT &&
                        t.featureId === i.store.getSelectedIds()[0]) ||
                      i.events.changeMode(e, t, { silent: !0 }),
                  s
                );
              }),
              (s.getMode = function() {
                return i.events.getMode();
              }),
              (s.trash = function() {
                return i.events.trash({ silent: !0 }), s;
              }),
              (s.combineFeatures = function() {
                return i.events.combineFeatures({ silent: !0 }), s;
              }),
              (s.uncombineFeatures = function() {
                return i.events.uncombineFeatures({ silent: !0 }), s;
              }),
              (s.setFeatureProperty = function(e, t, n) {
                return i.store.setFeatureProperty(e, t, n), s;
              }),
              s
            );
          };
        },
        {
          "./constants": 23,
          "./feature_types/line_string": 26,
          "./feature_types/multi_feature": 27,
          "./feature_types/point": 28,
          "./feature_types/polygon": 29,
          "./lib/features_at": 37,
          "./lib/string_set": 47,
          "./lib/string_sets_are_equal": 48,
          "@mapbox/geojson-normalize": 7,
          "@mapbox/geojsonhint": 8,
          hat: 14,
          "lodash.isequal": 16
        }
      ],
      23: [
        function(e, t, n) {
          "use strict";
          t.exports = {
            classes: {
              CONTROL_BASE: "mapboxgl-ctrl",
              CONTROL_PREFIX: "mapboxgl-ctrl-",
              CONTROL_BUTTON: "mapbox-gl-draw_ctrl-draw-btn",
              CONTROL_BUTTON_LINE: "mapbox-gl-draw_line",
              CONTROL_BUTTON_POLYGON: "mapbox-gl-draw_polygon",
              CONTROL_BUTTON_POINT: "mapbox-gl-draw_point",
              CONTROL_BUTTON_TRASH: "mapbox-gl-draw_trash",
              CONTROL_BUTTON_COMBINE_FEATURES: "mapbox-gl-draw_combine",
              CONTROL_BUTTON_UNCOMBINE_FEATURES: "mapbox-gl-draw_uncombine",
              CONTROL_GROUP: "mapboxgl-ctrl-group",
              ATTRIBUTION: "mapboxgl-ctrl-attrib",
              ACTIVE_BUTTON: "active",
              BOX_SELECT: "mapbox-gl-draw_boxselect"
            },
            sources: { HOT: "mapbox-gl-draw-hot", COLD: "mapbox-gl-draw-cold" },
            cursors: {
              ADD: "add",
              MOVE: "move",
              DRAG: "drag",
              POINTER: "pointer",
              NONE: "none"
            },
            types: { POLYGON: "polygon", LINE: "line_string", POINT: "point" },
            geojsonTypes: {
              FEATURE: "Feature",
              POLYGON: "Polygon",
              LINE_STRING: "LineString",
              POINT: "Point",
              FEATURE_COLLECTION: "FeatureCollection",
              MULTI_PREFIX: "Multi",
              MULTI_POINT: "MultiPoint",
              MULTI_LINE_STRING: "MultiLineString",
              MULTI_POLYGON: "MultiPolygon"
            },
            modes: {
              DRAW_LINE_STRING: "draw_line_string",
              DRAW_POLYGON: "draw_polygon",
              DRAW_POINT: "draw_point",
              SIMPLE_SELECT: "simple_select",
              DIRECT_SELECT: "direct_select",
              STATIC: "static"
            },
            events: {
              CREATE: "draw.create",
              DELETE: "draw.delete",
              UPDATE: "draw.update",
              SELECTION_CHANGE: "draw.selectionchange",
              MODE_CHANGE: "draw.modechange",
              ACTIONABLE: "draw.actionable",
              RENDER: "draw.render",
              COMBINE_FEATURES: "draw.combine",
              UNCOMBINE_FEATURES: "draw.uncombine"
            },
            updateActions: {
              MOVE: "move",
              CHANGE_COORDINATES: "change_coordinates"
            },
            meta: {
              FEATURE: "feature",
              MIDPOINT: "midpoint",
              VERTEX: "vertex"
            },
            activeStates: { ACTIVE: "true", INACTIVE: "false" },
            interactions: [
              "scrollZoom",
              "boxZoom",
              "dragRotate",
              "dragPan",
              "keyboard",
              "doubleClickZoom",
              "touchZoomRotate"
            ],
            LAT_MIN: -90,
            LAT_RENDERED_MIN: -85,
            LAT_MAX: 90,
            LAT_RENDERED_MAX: 85,
            LNG_MIN: -270,
            LNG_MAX: 270
          };
        },
        {}
      ],
      24: [
        function(e, t, n) {
          "use strict";
          var p = e("./lib/mode_handler"),
            f = e("./lib/get_features_and_set_cursor"),
            h = e("./lib/features_at"),
            d = e("./lib/is_click"),
            g = e("./lib/is_tap"),
            y = e("./constants"),
            m = e("./modes/object_to_mode");
          t.exports = function(i) {
            var s = Object.keys(i.options.modes).reduce(function(e, t) {
                return (e[t] = m(i.options.modes[t])), e;
              }, {}),
              n = {},
              o = {},
              r = {},
              a = null,
              c = null;
            (r.drag = function(e, t) {
              t({ point: e.point, time: new Date().getTime() })
                ? (i.ui.queueMapClasses({ mouse: y.cursors.DRAG }), c.drag(e))
                : e.originalEvent.stopPropagation();
            }),
              (r.mousedrag = function(e) {
                r.drag(e, function(e) {
                  return !d(n, e);
                });
              }),
              (r.touchdrag = function(e) {
                r.drag(e, function(e) {
                  return !g(o, e);
                });
              }),
              (r.mousemove = function(e) {
                if (
                  1 ===
                  (void 0 !== e.originalEvent.buttons
                    ? e.originalEvent.buttons
                    : e.originalEvent.which)
                )
                  return r.mousedrag(e);
                var t = f(e, i);
                (e.featureTarget = t), c.mousemove(e);
              }),
              (r.mousedown = function(e) {
                n = { time: new Date().getTime(), point: e.point };
                var t = f(e, i);
                (e.featureTarget = t), c.mousedown(e);
              }),
              (r.mouseup = function(e) {
                var t = f(e, i);
                (e.featureTarget = t),
                  d(n, { point: e.point, time: new Date().getTime() })
                    ? c.click(e)
                    : c.mouseup(e);
              }),
              (r.mouseout = function(e) {
                c.mouseout(e);
              }),
              (r.touchstart = function(e) {
                if (i.options.touchEnabled) {
                  o = { time: new Date().getTime(), point: e.point };
                  var t = h.touch(e, null, i)[0];
                  t &&
                    (e.originalEvent.preventDefault(),
                    (e.featureTarget = t),
                    c.touchstart(e));
                }
              }),
              (r.touchmove = function(e) {
                if ((e.originalEvent.preventDefault(), i.options.touchEnabled))
                  return c.touchmove(e), r.touchdrag(e);
              }),
              (r.touchend = function(e) {
                if (i.options.touchEnabled) {
                  var t = h.touch(e, null, i)[0];
                  t &&
                    (e.originalEvent.preventDefault(),
                    (e.featureTarget = t),
                    g(o, { time: new Date().getTime(), point: e.point })
                      ? c.tap(e)
                      : c.touchend(e));
                }
              });
            var t = function(e) {
              return !(8 === e || 46 === e || (48 <= e && e <= 57));
            };
            function u(e, t) {
              var n =
                2 < arguments.length && void 0 !== arguments[2]
                  ? arguments[2]
                  : {};
              c.stop();
              var o = s[e];
              if (void 0 === o) throw new Error("".concat(e, " is not valid"));
              a = e;
              var r = o(i, t);
              (c = p(r, i)),
                n.silent || i.map.fire(y.events.MODE_CHANGE, { mode: e }),
                i.store.setDirty(),
                i.store.render();
            }
            (r.keydown = function(e) {
              "mapboxgl-canvas" === (e.srcElement || e.target).classList[0] &&
                ((8 !== e.keyCode && 46 !== e.keyCode) ||
                !i.options.controls.trash
                  ? t(e.keyCode)
                    ? c.keydown(e)
                    : 49 === e.keyCode && i.options.controls.point
                    ? u(y.modes.DRAW_POINT)
                    : 50 === e.keyCode && i.options.controls.line_string
                    ? u(y.modes.DRAW_LINE_STRING)
                    : 51 === e.keyCode &&
                      i.options.controls.polygon &&
                      u(y.modes.DRAW_POLYGON)
                  : (e.preventDefault(), c.trash()));
            }),
              (r.keyup = function(e) {
                t(e.keyCode) && c.keyup(e);
              }),
              (r.zoomend = function() {
                i.store.changeZoom();
              });
            var l = {
              trash: !(r.data = function(e) {
                if ("style" === e.dataType) {
                  var t = i.setup,
                    n = i.map,
                    o = i.options,
                    r = i.store;
                  o.styles.some(function(e) {
                    return n.getLayer(e.id);
                  }) || (t.addLayers(), r.setDirty(), r.render());
                }
              }),
              combineFeatures: !1,
              uncombineFeatures: !1
            };
            return {
              start: function() {
                (a = i.options.defaultMode), (c = p(s[a](i), i));
              },
              changeMode: u,
              actionable: function(t) {
                var n = !1;
                Object.keys(t).forEach(function(e) {
                  if (void 0 === l[e]) throw new Error("Invalid action type");
                  l[e] !== t[e] && (n = !0), (l[e] = t[e]);
                }),
                  n && i.map.fire(y.events.ACTIONABLE, { actions: l });
              },
              currentModeName: function() {
                return a;
              },
              currentModeRender: function(e, t) {
                return c.render(e, t);
              },
              fire: function(e, t) {
                r[e] && r[e](t);
              },
              addEventListeners: function() {
                i.map.on("mousemove", r.mousemove),
                  i.map.on("mousedown", r.mousedown),
                  i.map.on("mouseup", r.mouseup),
                  i.map.on("data", r.data),
                  i.map.on("touchmove", r.touchmove),
                  i.map.on("touchstart", r.touchstart),
                  i.map.on("touchend", r.touchend),
                  i.container.addEventListener("mouseout", r.mouseout),
                  i.options.keybindings &&
                    (i.container.addEventListener("keydown", r.keydown),
                    i.container.addEventListener("keyup", r.keyup));
              },
              removeEventListeners: function() {
                i.map.off("mousemove", r.mousemove),
                  i.map.off("mousedown", r.mousedown),
                  i.map.off("mouseup", r.mouseup),
                  i.map.off("data", r.data),
                  i.map.off("touchmove", r.touchmove),
                  i.map.off("touchstart", r.touchstart),
                  i.map.off("touchend", r.touchend),
                  i.container.removeEventListener("mouseout", r.mouseout),
                  i.options.keybindings &&
                    (i.container.removeEventListener("keydown", r.keydown),
                    i.container.removeEventListener("keyup", r.keyup));
              },
              trash: function(e) {
                c.trash(e);
              },
              combineFeatures: function() {
                c.combineFeatures();
              },
              uncombineFeatures: function() {
                c.uncombineFeatures();
              },
              getMode: function() {
                return a;
              }
            };
          };
        },
        {
          "./constants": 23,
          "./lib/features_at": 37,
          "./lib/get_features_and_set_cursor": 38,
          "./lib/is_click": 39,
          "./lib/is_tap": 41,
          "./lib/mode_handler": 43,
          "./modes/object_to_mode": 59
        }
      ],
      25: [
        function(e, t, n) {
          "use strict";
          var o = e("hat"),
            r = e("../constants"),
            i = function(e, t) {
              (this.ctx = e),
                (this.properties = t.properties || {}),
                (this.coordinates = t.geometry.coordinates),
                (this.id = t.id || o()),
                (this.type = t.geometry.type);
            };
          (i.prototype.changed = function() {
            this.ctx.store.featureChanged(this.id);
          }),
            (i.prototype.incomingCoords = function(e) {
              this.setCoordinates(e);
            }),
            (i.prototype.setCoordinates = function(e) {
              (this.coordinates = e), this.changed();
            }),
            (i.prototype.getCoordinates = function() {
              return JSON.parse(JSON.stringify(this.coordinates));
            }),
            (i.prototype.setProperty = function(e, t) {
              this.properties[e] = t;
            }),
            (i.prototype.toGeoJSON = function() {
              return JSON.parse(
                JSON.stringify({
                  id: this.id,
                  type: r.geojsonTypes.FEATURE,
                  properties: this.properties,
                  geometry: {
                    coordinates: this.getCoordinates(),
                    type: this.type
                  }
                })
              );
            }),
            (i.prototype.internal = function(e) {
              var t = {
                id: this.id,
                meta: r.meta.FEATURE,
                "meta:type": this.type,
                active: r.activeStates.INACTIVE,
                mode: e
              };
              if (this.ctx.options.userProperties)
                for (var n in this.properties)
                  t["user_".concat(n)] = this.properties[n];
              return {
                type: r.geojsonTypes.FEATURE,
                properties: t,
                geometry: {
                  coordinates: this.getCoordinates(),
                  type: this.type
                }
              };
            }),
            (t.exports = i);
        },
        { "../constants": 23, hat: 14 }
      ],
      26: [
        function(e, t, n) {
          "use strict";
          var o = e("./feature"),
            r = function(e, t) {
              o.call(this, e, t);
            };
          ((r.prototype = Object.create(o.prototype)).isValid = function() {
            return 1 < this.coordinates.length;
          }),
            (r.prototype.addCoordinate = function(e, t, n) {
              this.changed();
              var o = parseInt(e, 10);
              this.coordinates.splice(o, 0, [t, n]);
            }),
            (r.prototype.getCoordinate = function(e) {
              var t = parseInt(e, 10);
              return JSON.parse(JSON.stringify(this.coordinates[t]));
            }),
            (r.prototype.removeCoordinate = function(e) {
              this.changed(), this.coordinates.splice(parseInt(e, 10), 1);
            }),
            (r.prototype.updateCoordinate = function(e, t, n) {
              var o = parseInt(e, 10);
              (this.coordinates[o] = [t, n]), this.changed();
            }),
            (t.exports = r);
        },
        { "./feature": 25 }
      ],
      27: [
        function(e, t, n) {
          "use strict";
          var o = e("./feature"),
            r = e("../constants"),
            i = e("hat"),
            s = {
              MultiPoint: e("./point"),
              MultiLineString: e("./line_string"),
              MultiPolygon: e("./polygon")
            },
            a = function(e, t, n, o, r) {
              var i = n.split("."),
                s = parseInt(i[0], 10),
                a = i[1] ? i.slice(1).join(".") : null;
              return e[s][t](a, o, r);
            },
            c = function(e, t) {
              if (
                (o.call(this, e, t),
                delete this.coordinates,
                (this.model = s[t.geometry.type]),
                void 0 === this.model)
              )
                throw new TypeError(
                  "".concat(t.geometry.type, " is not a valid type")
                );
              this.features = this._coordinatesToFeatures(
                t.geometry.coordinates
              );
            };
          ((c.prototype = Object.create(
            o.prototype
          ))._coordinatesToFeatures = function(e) {
            var t = this,
              n = this.model.bind(this);
            return e.map(function(e) {
              return new n(t.ctx, {
                id: i(),
                type: r.geojsonTypes.FEATURE,
                properties: {},
                geometry: { coordinates: e, type: t.type.replace("Multi", "") }
              });
            });
          }),
            (c.prototype.isValid = function() {
              return this.features.every(function(e) {
                return e.isValid();
              });
            }),
            (c.prototype.setCoordinates = function(e) {
              (this.features = this._coordinatesToFeatures(e)), this.changed();
            }),
            (c.prototype.getCoordinate = function(e) {
              return a(this.features, "getCoordinate", e);
            }),
            (c.prototype.getCoordinates = function() {
              return JSON.parse(
                JSON.stringify(
                  this.features.map(function(e) {
                    return e.type === r.geojsonTypes.POLYGON
                      ? e.getCoordinates()
                      : e.coordinates;
                  })
                )
              );
            }),
            (c.prototype.updateCoordinate = function(e, t, n) {
              a(this.features, "updateCoordinate", e, t, n), this.changed();
            }),
            (c.prototype.addCoordinate = function(e, t, n) {
              a(this.features, "addCoordinate", e, t, n), this.changed();
            }),
            (c.prototype.removeCoordinate = function(e) {
              a(this.features, "removeCoordinate", e), this.changed();
            }),
            (c.prototype.getFeatures = function() {
              return this.features;
            }),
            (t.exports = c);
        },
        {
          "../constants": 23,
          "./feature": 25,
          "./line_string": 26,
          "./point": 28,
          "./polygon": 29,
          hat: 14
        }
      ],
      28: [
        function(e, t, n) {
          "use strict";
          var o = e("./feature"),
            r = function(e, t) {
              o.call(this, e, t);
            };
          ((r.prototype = Object.create(o.prototype)).isValid = function() {
            return (
              "number" == typeof this.coordinates[0] &&
              "number" == typeof this.coordinates[1]
            );
          }),
            (r.prototype.updateCoordinate = function(e, t, n) {
              3 === arguments.length
                ? (this.coordinates = [t, n])
                : (this.coordinates = [e, t]),
                this.changed();
            }),
            (r.prototype.getCoordinate = function() {
              return this.getCoordinates();
            }),
            (t.exports = r);
        },
        { "./feature": 25 }
      ],
      29: [
        function(e, t, n) {
          "use strict";
          var o = e("./feature"),
            r = function(e, t) {
              o.call(this, e, t),
                (this.coordinates = this.coordinates.map(function(e) {
                  return e.slice(0, -1);
                }));
            };
          ((r.prototype = Object.create(o.prototype)).isValid = function() {
            return (
              0 !== this.coordinates.length &&
              this.coordinates.every(function(e) {
                return 2 < e.length;
              })
            );
          }),
            (r.prototype.incomingCoords = function(e) {
              (this.coordinates = e.map(function(e) {
                return e.slice(0, -1);
              })),
                this.changed();
            }),
            (r.prototype.setCoordinates = function(e) {
              (this.coordinates = e), this.changed();
            }),
            (r.prototype.addCoordinate = function(e, t, n) {
              this.changed();
              var o = e.split(".").map(function(e) {
                return parseInt(e, 10);
              });
              this.coordinates[o[0]].splice(o[1], 0, [t, n]);
            }),
            (r.prototype.removeCoordinate = function(e) {
              this.changed();
              var t = e.split(".").map(function(e) {
                  return parseInt(e, 10);
                }),
                n = this.coordinates[t[0]];
              n &&
                (n.splice(t[1], 1),
                n.length < 3 && this.coordinates.splice(t[0], 1));
            }),
            (r.prototype.getCoordinate = function(e) {
              var t = e.split(".").map(function(e) {
                  return parseInt(e, 10);
                }),
                n = this.coordinates[t[0]];
              return JSON.parse(JSON.stringify(n[t[1]]));
            }),
            (r.prototype.getCoordinates = function() {
              return this.coordinates.map(function(e) {
                return e.concat([e[0]]);
              });
            }),
            (r.prototype.updateCoordinate = function(e, t, n) {
              this.changed();
              var o = e.split("."),
                r = parseInt(o[0], 10),
                i = parseInt(o[1], 10);
              void 0 === this.coordinates[r] && (this.coordinates[r] = []),
                (this.coordinates[r][i] = [t, n]);
            }),
            (t.exports = r);
        },
        { "./feature": 25 }
      ],
      30: [
        function(e, t, n) {
          "use strict";
          var o = e("../constants");
          t.exports = {
            isOfMetaType: function(n) {
              return function(e) {
                var t = e.featureTarget;
                return !!t && !!t.properties && t.properties.meta === n;
              };
            },
            isShiftMousedown: function(e) {
              return (
                !!e.originalEvent &&
                !!e.originalEvent.shiftKey && 0 === e.originalEvent.button
              );
            },
            isActiveFeature: function(e) {
              return (
                !!e.featureTarget &&
                !!e.featureTarget.properties &&
                  e.featureTarget.properties.active === o.activeStates.ACTIVE &&
                    e.featureTarget.properties.meta === o.meta.FEATURE
              );
            },
            isInactiveFeature: function(e) {
              return (
                !!e.featureTarget &&
                !!e.featureTarget.properties &&
                  e.featureTarget.properties.active ===
                    o.activeStates.INACTIVE &&
                    e.featureTarget.properties.meta === o.meta.FEATURE
              );
            },
            noTarget: function(e) {
              return void 0 === e.featureTarget;
            },
            isFeature: function(e) {
              return (
                !!e.featureTarget &&
                !!e.featureTarget.properties &&
                  e.featureTarget.properties.meta === o.meta.FEATURE
              );
            },
            isVertex: function(e) {
              var t = e.featureTarget;
              return (
                !!t && !!t.properties && t.properties.meta === o.meta.VERTEX
              );
            },
            isShiftDown: function(e) {
              return !!e.originalEvent && !0 === e.originalEvent.shiftKey;
            },
            isEscapeKey: function(e) {
              return 27 === e.keyCode;
            },
            isEnterKey: function(e) {
              return 13 === e.keyCode;
            },
            true: function() {
              return !0;
            }
          };
        },
        { "../constants": 23 }
      ],
      31: [
        function(e, t, n) {
          "use strict";
          var f = e("@mapbox/geojson-extent"),
            o = e("../constants"),
            r = o.LAT_MIN,
            i = o.LAT_MAX,
            h = o.LAT_RENDERED_MIN,
            d = o.LAT_RENDERED_MAX,
            g = o.LNG_MIN,
            y = o.LNG_MAX;
          t.exports = function(e, t) {
            var s = r,
              a = i,
              c = r,
              u = i,
              l = y,
              p = g;
            e.forEach(function(e) {
              var t = f(e),
                n = t[1],
                o = t[3],
                r = t[0],
                i = t[2];
              s < n && (s = n),
                o < a && (a = o),
                c < o && (c = o),
                n < u && (u = n),
                r < l && (l = r),
                p < i && (p = i);
            });
            var n = t;
            return (
              s + n.lat > d && (n.lat = d - s),
              c + n.lat > i && (n.lat = i - c),
              a + n.lat < h && (n.lat = h - a),
              u + n.lat < r && (n.lat = r - u),
              l + n.lng <= g &&
                (n.lng += 360 * Math.ceil(Math.abs(n.lng) / 360)),
              p + n.lng >= y &&
                (n.lng -= 360 * Math.ceil(Math.abs(n.lng) / 360)),
              n
            );
          };
        },
        { "../constants": 23, "@mapbox/geojson-extent": 6 }
      ],
      32: [
        function(e, t, n) {
          "use strict";
          var u = e("../constants");
          t.exports = function(e, t, n, o) {
            var r = t.geometry.coordinates,
              i = n.geometry.coordinates;
            if (
              r[1] > u.LAT_RENDERED_MAX ||
              r[1] < u.LAT_RENDERED_MIN ||
              i[1] > u.LAT_RENDERED_MAX ||
              i[1] < u.LAT_RENDERED_MIN
            )
              return null;
            var s = o.project([r[0], r[1]]),
              a = o.project([i[0], i[1]]),
              c = o.unproject([(s.x + a.x) / 2, (s.y + a.y) / 2]);
            return {
              type: u.geojsonTypes.FEATURE,
              properties: {
                meta: u.meta.MIDPOINT,
                parent: e,
                lng: c.lng,
                lat: c.lat,
                coord_path: n.properties.coord_path
              },
              geometry: {
                type: u.geojsonTypes.POINT,
                coordinates: [c.lng, c.lat]
              }
            };
          };
        },
        { "../constants": 23 }
      ],
      33: [
        function(e, t, n) {
          "use strict";
          var h = e("./create_vertex"),
            d = e("./create_midpoint"),
            c = e("../constants");
          t.exports = function o(r) {
            var i,
              u =
                1 < arguments.length && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              n =
                2 < arguments.length && void 0 !== arguments[2]
                  ? arguments[2]
                  : null,
              e = r.geometry,
              t = e.type,
              s = e.coordinates,
              l = r.properties && r.properties.id,
              p = [];
            function a(e, s) {
              var a = "",
                c = null;
              e.forEach(function(e, t) {
                var n = null != s ? "".concat(s, ".").concat(t) : String(t),
                  o = h(l, e, n, f(n));
                if (u.midpoints && c) {
                  var r = d(l, c, o, u.map);
                  r && p.push(r);
                }
                c = o;
                var i = JSON.stringify(e);
                a !== i && p.push(o), 0 === t && (a = i);
              });
            }
            function f(e) {
              return !!u.selectedPaths && -1 !== u.selectedPaths.indexOf(e);
            }
            return (
              t === c.geojsonTypes.POINT
                ? p.push(h(l, s, n, f(n)))
                : t === c.geojsonTypes.POLYGON
                ? s.forEach(function(e, t) {
                    a(e, null !== n ? "".concat(n, ".").concat(t) : String(t));
                  })
                : t === c.geojsonTypes.LINE_STRING
                ? a(s, n)
                : 0 === t.indexOf(c.geojsonTypes.MULTI_PREFIX) &&
                  ((i = t.replace(c.geojsonTypes.MULTI_PREFIX, "")),
                  s.forEach(function(e, t) {
                    var n = {
                      type: c.geojsonTypes.FEATURE,
                      properties: r.properties,
                      geometry: { type: i, coordinates: e }
                    };
                    p = p.concat(o(n, u, t));
                  })),
              p
            );
          };
        },
        { "../constants": 23, "./create_midpoint": 32, "./create_vertex": 34 }
      ],
      34: [
        function(e, t, n) {
          "use strict";
          var r = e("../constants");
          t.exports = function(e, t, n, o) {
            return {
              type: r.geojsonTypes.FEATURE,
              properties: {
                meta: r.meta.VERTEX,
                parent: e,
                coord_path: n,
                active: o ? r.activeStates.ACTIVE : r.activeStates.INACTIVE
              },
              geometry: { type: r.geojsonTypes.POINT, coordinates: t }
            };
          };
        },
        { "../constants": 23 }
      ],
      35: [
        function(e, t, n) {
          "use strict";
          t.exports = {
            enable: function(e) {
              setTimeout(function() {
                e.map &&
                  e.map.doubleClickZoom &&
                  e._ctx &&
                  e._ctx.store &&
                  e._ctx.store.getInitialConfigValue &&
                  e._ctx.store.getInitialConfigValue("doubleClickZoom") &&
                  e.map.doubleClickZoom.enable();
              }, 0);
            },
            disable: function(e) {
              setTimeout(function() {
                e.map &&
                  e.map.doubleClickZoom &&
                  e.map.doubleClickZoom.disable();
              }, 0);
            }
          };
        },
        {}
      ],
      36: [
        function(e, t, n) {
          "use strict";
          t.exports = function(e, t) {
            var n = e.x - t.x,
              o = e.y - t.y;
            return Math.sqrt(n * n + o * o);
          };
        },
        {}
      ],
      37: [
        function(e, t, n) {
          "use strict";
          var u = e("./sort_features"),
            l = e("./map_event_to_bounding_box"),
            o = e("../constants"),
            p = e("./string_set"),
            f = [o.meta.FEATURE, o.meta.MIDPOINT, o.meta.VERTEX];
          function r(e, t, n, o) {
            if (null === n.map) return [];
            var r = e ? l(e, o) : t,
              i = {};
            n.options.styles &&
              (i.layers = n.options.styles.map(function(e) {
                return e.id;
              }));
            var s = n.map.queryRenderedFeatures(r, i).filter(function(e) {
                return -1 !== f.indexOf(e.properties.meta);
              }),
              a = new p(),
              c = [];
            return (
              s.forEach(function(e) {
                var t = e.properties.id;
                a.has(t) || (a.add(t), c.push(e));
              }),
              u(c)
            );
          }
          t.exports = {
            click: function(e, t, n) {
              return r(e, t, n, n.options.clickBuffer);
            },
            touch: function(e, t, n) {
              return r(e, t, n, n.options.touchBuffer);
            }
          };
        },
        {
          "../constants": 23,
          "./map_event_to_bounding_box": 42,
          "./sort_features": 46,
          "./string_set": 47
        }
      ],
      38: [
        function(e, t, n) {
          "use strict";
          var r = e("./features_at"),
            i = e("../constants");
          t.exports = function(e, t) {
            var n = r.click(e, null, t),
              o = { mouse: i.cursors.NONE };
            return (
              n[0] &&
                ((o.mouse =
                  n[0].properties.active === i.activeStates.ACTIVE
                    ? i.cursors.MOVE
                    : i.cursors.POINTER),
                (o.feature = n[0].properties.meta)),
              -1 !== t.events.currentModeName().indexOf("draw") &&
                (o.mouse = i.cursors.ADD),
              t.ui.queueMapClasses(o),
              t.ui.updateMapClasses(),
              n[0]
            );
          };
        },
        { "../constants": 23, "./features_at": 37 }
      ],
      39: [
        function(e, t, n) {
          "use strict";
          var a = e("./euclidean_distance");
          t.exports = function(e, t) {
            var n =
                2 < arguments.length && void 0 !== arguments[2]
                  ? arguments[2]
                  : {},
              o = null != n.fineTolerance ? n.fineTolerance : 4,
              r = null != n.grossTolerance ? n.grossTolerance : 12,
              i = null != n.interval ? n.interval : 500;
            (e.point = e.point || t.point), (e.time = e.time || t.time);
            var s = a(e.point, t.point);
            return s < o || (s < r && t.time - e.time < i);
          };
        },
        { "./euclidean_distance": 36 }
      ],
      40: [
        function(e, t, n) {
          "use strict";
          t.exports = function(e, t) {
            return !!e.lngLat && e.lngLat.lng === t[0] && e.lngLat.lat === t[1];
          };
        },
        {}
      ],
      41: [
        function(e, t, n) {
          "use strict";
          var i = e("./euclidean_distance");
          t.exports = function(e, t) {
            var n =
                2 < arguments.length && void 0 !== arguments[2]
                  ? arguments[2]
                  : {},
              o = null != n.tolerance ? n.tolerance : 25,
              r = null != n.interval ? n.interval : 250;
            return (
              (e.point = e.point || t.point),
              (e.time = e.time || t.time),
              i(e.point, t.point) < o && t.time - e.time < r
            );
          };
        },
        { "./euclidean_distance": 36 }
      ],
      42: [
        function(e, t, n) {
          "use strict";
          t.exports = function(e) {
            var t =
              1 < arguments.length && void 0 !== arguments[1]
                ? arguments[1]
                : 0;
            return [
              [e.point.x - t, e.point.y - t],
              [e.point.x + t, e.point.y + t]
            ];
          };
        },
        {}
      ],
      43: [
        function(e, t, n) {
          "use strict";
          t.exports = function(e, i) {
            var s = {
                drag: [],
                click: [],
                mousemove: [],
                mousedown: [],
                mouseup: [],
                mouseout: [],
                keydown: [],
                keyup: [],
                touchstart: [],
                touchmove: [],
                touchend: [],
                tap: []
              },
              a = {
                on: function(e, t, n) {
                  if (void 0 === s[e])
                    throw new Error("Invalid event type: ".concat(e));
                  s[e].push({ selector: t, fn: n });
                },
                render: function(e) {
                  i.store.featureChanged(e);
                }
              },
              t = function(e, t) {
                for (var n = s[e], o = n.length; o--; ) {
                  var r = n[o];
                  if (r.selector(t)) {
                    r.fn.call(a, t), i.store.render(), i.ui.updateMapClasses();
                    break;
                  }
                }
              };
            return (
              e.start.call(a),
              {
                render: e.render,
                stop: function() {
                  e.stop && e.stop();
                },
                trash: function() {
                  e.trash && (e.trash(), i.store.render());
                },
                combineFeatures: function() {
                  e.combineFeatures && e.combineFeatures();
                },
                uncombineFeatures: function() {
                  e.uncombineFeatures && e.uncombineFeatures();
                },
                drag: function(e) {
                  t("drag", e);
                },
                click: function(e) {
                  t("click", e);
                },
                mousemove: function(e) {
                  t("mousemove", e);
                },
                mousedown: function(e) {
                  t("mousedown", e);
                },
                mouseup: function(e) {
                  t("mouseup", e);
                },
                mouseout: function(e) {
                  t("mouseout", e);
                },
                keydown: function(e) {
                  t("keydown", e);
                },
                keyup: function(e) {
                  t("keyup", e);
                },
                touchstart: function(e) {
                  t("touchstart", e);
                },
                touchmove: function(e) {
                  t("touchmove", e);
                },
                touchend: function(e) {
                  t("touchend", e);
                },
                tap: function(e) {
                  t("tap", e);
                }
              }
            );
          };
        },
        {}
      ],
      44: [
        function(e, t, n) {
          "use strict";
          var o = e("@mapbox/point-geometry");
          t.exports = function(e, t) {
            var n = t.getBoundingClientRect();
            return new o(
              e.clientX - n.left - (t.clientLeft || 0),
              e.clientY - n.top - (t.clientTop || 0)
            );
          };
        },
        { "@mapbox/point-geometry": 11 }
      ],
      45: [
        function(e, t, n) {
          "use strict";
          var o = e("./constrain_feature_movement"),
            s = e("../constants");
          t.exports = function(e, t) {
            var i = o(
              e.map(function(e) {
                return e.toGeoJSON();
              }),
              t
            );
            e.forEach(function(e) {
              var t,
                n = e.getCoordinates(),
                o = function(e) {
                  var t = { lng: e[0] + i.lng, lat: e[1] + i.lat };
                  return [t.lng, t.lat];
                },
                r = function(e) {
                  return e.map(function(e) {
                    return o(e);
                  });
                };
              e.type === s.geojsonTypes.POINT
                ? (t = o(n))
                : e.type === s.geojsonTypes.LINE_STRING ||
                  e.type === s.geojsonTypes.MULTI_POINT
                ? (t = n.map(o))
                : e.type === s.geojsonTypes.POLYGON ||
                  e.type === s.geojsonTypes.MULTI_LINE_STRING
                ? (t = n.map(r))
                : e.type === s.geojsonTypes.MULTI_POLYGON &&
                  (t = n.map(function(e) {
                    return e.map(function(e) {
                      return r(e);
                    });
                  })),
                e.incomingCoords(t);
            });
          };
        },
        { "../constants": 23, "./constrain_feature_movement": 31 }
      ],
      46: [
        function(e, t, n) {
          "use strict";
          var o = e("@mapbox/geojson-area"),
            r = e("../constants"),
            i = { Point: 0, LineString: 1, Polygon: 2 };
          function s(e, t) {
            var n = i[e.geometry.type] - i[t.geometry.type];
            return 0 === n && e.geometry.type === r.geojsonTypes.POLYGON
              ? e.area - t.area
              : n;
          }
          t.exports = function(e) {
            return e
              .map(function(e) {
                return (
                  e.geometry.type === r.geojsonTypes.POLYGON &&
                    (e.area = o.geometry({
                      type: r.geojsonTypes.FEATURE,
                      property: {},
                      geometry: e.geometry
                    })),
                  e
                );
              })
              .sort(s)
              .map(function(e) {
                return delete e.area, e;
              });
          };
        },
        { "../constants": 23, "@mapbox/geojson-area": 3 }
      ],
      47: [
        function(e, t, n) {
          "use strict";
          function o(e) {
            if (
              ((this._items = {}),
              (this._nums = {}),
              (this._length = e ? e.length : 0),
              e)
            )
              for (var t = 0, n = e.length; t < n; t++)
                this.add(e[t]),
                  void 0 !== e[t] &&
                    ("string" == typeof e[t]
                      ? (this._items[e[t]] = t)
                      : (this._nums[e[t]] = t));
          }
          (o.prototype.add = function(e) {
            return (
              this.has(e) ||
                (this._length++,
                "string" == typeof e
                  ? (this._items[e] = this._length)
                  : (this._nums[e] = this._length)),
              this
            );
          }),
            (o.prototype.delete = function(e) {
              return (
                !1 === this.has(e) ||
                  (this._length--, delete this._items[e], delete this._nums[e]),
                this
              );
            }),
            (o.prototype.has = function(e) {
              return (
                ("string" == typeof e || "number" == typeof e) &&
                (void 0 !== this._items[e] || void 0 !== this._nums[e])
              );
            }),
            (o.prototype.values = function() {
              var t = this,
                n = [];
              return (
                Object.keys(this._items).forEach(function(e) {
                  n.push({ k: e, v: t._items[e] });
                }),
                Object.keys(this._nums).forEach(function(e) {
                  n.push({ k: JSON.parse(e), v: t._nums[e] });
                }),
                n
                  .sort(function(e, t) {
                    return e.v - t.v;
                  })
                  .map(function(e) {
                    return e.k;
                  })
              );
            }),
            (o.prototype.clear = function() {
              return (
                (this._length = 0), (this._items = {}), (this._nums = {}), this
              );
            }),
            (t.exports = o);
        },
        {}
      ],
      48: [
        function(e, t, n) {
          "use strict";
          t.exports = function(e, t) {
            return (
              e.length === t.length &&
              JSON.stringify(
                e
                  .map(function(e) {
                    return e;
                  })
                  .sort()
              ) ===
                JSON.stringify(
                  t
                    .map(function(e) {
                      return e;
                    })
                    .sort()
                )
            );
          };
        },
        {}
      ],
      49: [
        function(e, t, n) {
          "use strict";
          t.exports = [
            {
              id: "gl-draw-polygon-fill-inactive",
              type: "fill",
              filter: [
                "all",
                ["==", "active", "false"],
                ["==", "$type", "Polygon"],
                ["!=", "mode", "static"]
              ],
              paint: {
                "fill-color": "#3bb2d0",
                "fill-outline-color": "#3bb2d0",
                "fill-opacity": 0.1
              }
            },
            {
              id: "gl-draw-polygon-fill-active",
              type: "fill",
              filter: [
                "all",
                ["==", "active", "true"],
                ["==", "$type", "Polygon"]
              ],
              paint: {
                "fill-color": "#fbb03b",
                "fill-outline-color": "#fbb03b",
                "fill-opacity": 0.1
              }
            },
            {
              id: "gl-draw-polygon-midpoint",
              type: "circle",
              filter: [
                "all",
                ["==", "$type", "Point"],
                ["==", "meta", "midpoint"]
              ],
              paint: { "circle-radius": 3, "circle-color": "#fbb03b" }
            },
            {
              id: "gl-draw-polygon-stroke-inactive",
              type: "line",
              filter: [
                "all",
                ["==", "active", "false"],
                ["==", "$type", "Polygon"],
                ["!=", "mode", "static"]
              ],
              layout: { "line-cap": "round", "line-join": "round" },
              paint: { "line-color": "#3bb2d0", "line-width": 2 }
            },
            {
              id: "gl-draw-polygon-stroke-active",
              type: "line",
              filter: [
                "all",
                ["==", "active", "true"],
                ["==", "$type", "Polygon"]
              ],
              layout: { "line-cap": "round", "line-join": "round" },
              paint: {
                "line-color": "#fbb03b",
                "line-dasharray": [0.2, 2],
                "line-width": 2
              }
            },
            {
              id: "gl-draw-line-inactive",
              type: "line",
              filter: [
                "all",
                ["==", "active", "false"],
                ["==", "$type", "LineString"],
                ["!=", "mode", "static"]
              ],
              layout: { "line-cap": "round", "line-join": "round" },
              paint: { "line-color": "#3bb2d0", "line-width": 2 }
            },
            {
              id: "gl-draw-line-active",
              type: "line",
              filter: [
                "all",
                ["==", "$type", "LineString"],
                ["==", "active", "true"]
              ],
              layout: { "line-cap": "round", "line-join": "round" },
              paint: {
                "line-color": "#fbb03b",
                "line-dasharray": [0.2, 2],
                "line-width": 2
              }
            },
            {
              id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
              type: "circle",
              filter: [
                "all",
                ["==", "meta", "vertex"],
                ["==", "$type", "Point"],
                ["!=", "mode", "static"]
              ],
              paint: { "circle-radius": 5, "circle-color": "#fff" }
            },
            {
              id: "gl-draw-polygon-and-line-vertex-inactive",
              type: "circle",
              filter: [
                "all",
                ["==", "meta", "vertex"],
                ["==", "$type", "Point"],
                ["!=", "mode", "static"]
              ],
              paint: { "circle-radius": 3, "circle-color": "#fbb03b" }
            },
            {
              id: "gl-draw-point-point-stroke-inactive",
              type: "circle",
              filter: [
                "all",
                ["==", "active", "false"],
                ["==", "$type", "Point"],
                ["==", "meta", "feature"],
                ["!=", "mode", "static"]
              ],
              paint: {
                "circle-radius": 5,
                "circle-opacity": 1,
                "circle-color": "#fff"
              }
            },
            {
              id: "gl-draw-point-inactive",
              type: "circle",
              filter: [
                "all",
                ["==", "active", "false"],
                ["==", "$type", "Point"],
                ["==", "meta", "feature"],
                ["!=", "mode", "static"]
              ],
              paint: { "circle-radius": 3, "circle-color": "#3bb2d0" }
            },
            {
              id: "gl-draw-point-stroke-active",
              type: "circle",
              filter: [
                "all",
                ["==", "$type", "Point"],
                ["==", "active", "true"],
                ["!=", "meta", "midpoint"]
              ],
              paint: { "circle-radius": 7, "circle-color": "#fff" }
            },
            {
              id: "gl-draw-point-active",
              type: "circle",
              filter: [
                "all",
                ["==", "$type", "Point"],
                ["!=", "meta", "midpoint"],
                ["==", "active", "true"]
              ],
              paint: { "circle-radius": 5, "circle-color": "#fbb03b" }
            },
            {
              id: "gl-draw-polygon-fill-static",
              type: "fill",
              filter: [
                "all",
                ["==", "mode", "static"],
                ["==", "$type", "Polygon"]
              ],
              paint: {
                "fill-color": "#404040",
                "fill-outline-color": "#404040",
                "fill-opacity": 0.1
              }
            },
            {
              id: "gl-draw-polygon-stroke-static",
              type: "line",
              filter: [
                "all",
                ["==", "mode", "static"],
                ["==", "$type", "Polygon"]
              ],
              layout: { "line-cap": "round", "line-join": "round" },
              paint: { "line-color": "#404040", "line-width": 2 }
            },
            {
              id: "gl-draw-line-static",
              type: "line",
              filter: [
                "all",
                ["==", "mode", "static"],
                ["==", "$type", "LineString"]
              ],
              layout: { "line-cap": "round", "line-join": "round" },
              paint: { "line-color": "#404040", "line-width": 2 }
            },
            {
              id: "gl-draw-point-static",
              type: "circle",
              filter: [
                "all",
                ["==", "mode", "static"],
                ["==", "$type", "Point"]
              ],
              paint: { "circle-radius": 5, "circle-color": "#404040" }
            }
          ];
        },
        {}
      ],
      50: [
        function(e, t, n) {
          "use strict";
          t.exports = function(e, t, n) {
            var o, r;
            function i() {
              (o = !1), r && (s.apply(n, r), (r = !1));
            }
            function s() {
              o
                ? (r = arguments)
                : ((o = !0), e.apply(n, arguments), setTimeout(i, t));
            }
            return s;
          };
        },
        {}
      ],
      51: [
        function(e, t, n) {
          "use strict";
          t.exports = function(e) {
            return [].concat(e).filter(function(e) {
              return void 0 !== e;
            });
          };
        },
        {}
      ],
      52: [
        function(e, t, n) {
          "use strict";
          var o = e("../lib/common_selectors"),
            r = o.noTarget,
            i = o.isOfMetaType,
            s = o.isInactiveFeature,
            a = o.isShiftDown,
            c = e("../lib/create_supplementary_points"),
            u = e("../lib/constrain_feature_movement"),
            l = e("../lib/double_click_zoom"),
            p = e("../constants"),
            f = e("../lib/common_selectors"),
            h = e("../lib/move_features"),
            d = i(p.meta.VERTEX),
            g = i(p.meta.MIDPOINT),
            y = {
              fireUpdate: function() {
                this.map.fire(p.events.UPDATE, {
                  action: p.updateActions.CHANGE_COORDINATES,
                  features: this.getSelected().map(function(e) {
                    return e.toGeoJSON();
                  })
                });
              },
              fireActionable: function(e) {
                this.setActionableState({
                  combineFeatures: !1,
                  uncombineFeatures: !1,
                  trash: 0 < e.selectedCoordPaths.length
                });
              },
              startDragging: function(e, t) {
                this.map.dragPan.disable(),
                  (e.canDragMove = !0),
                  (e.dragMoveLocation = t.lngLat);
              },
              stopDragging: function(e) {
                this.map.dragPan.enable(),
                  (e.dragMoving = !1),
                  (e.canDragMove = !1),
                  (e.dragMoveLocation = null);
              },
              onVertex: function(e, t) {
                this.startDragging(e, t);
                var n = t.featureTarget.properties,
                  o = e.selectedCoordPaths.indexOf(n.coord_path);
                a(t) || -1 !== o
                  ? a(t) && -1 === o && e.selectedCoordPaths.push(n.coord_path)
                  : (e.selectedCoordPaths = [n.coord_path]);
                var r = this.pathsToCoordinates(
                  e.featureId,
                  e.selectedCoordPaths
                );
                this.setSelectedCoordinates(r);
              },
              onMidpoint: function(e, t) {
                this.startDragging(e, t);
                var n = t.featureTarget.properties;
                e.feature.addCoordinate(n.coord_path, n.lng, n.lat),
                  this.fireUpdate(),
                  (e.selectedCoordPaths = [n.coord_path]);
              },
              pathsToCoordinates: function(t, e) {
                return e.map(function(e) {
                  return { feature_id: t, coord_path: e };
                });
              },
              onFeature: function(e, t) {
                0 === e.selectedCoordPaths.length
                  ? this.startDragging(e, t)
                  : this.stopDragging(e);
              },
              dragFeature: function(e, t, n) {
                h(this.getSelected(), n), (e.dragMoveLocation = t.lngLat);
              },
              dragVertex: function(t, e, n) {
                for (
                  var o = t.selectedCoordPaths.map(function(e) {
                      return t.feature.getCoordinate(e);
                    }),
                    r = o.map(function(e) {
                      return {
                        type: p.geojsonTypes.FEATURE,
                        properties: {},
                        geometry: { type: p.geojsonTypes.POINT, coordinates: e }
                      };
                    }),
                    i = u(r, n),
                    s = 0;
                  s < o.length;
                  s++
                ) {
                  var a = o[s];
                  t.feature.updateCoordinate(
                    t.selectedCoordPaths[s],
                    a[0] + i.lng,
                    a[1] + i.lat
                  );
                }
              },
              clickNoTarget: function() {
                this.changeMode(p.modes.SIMPLE_SELECT);
              },
              clickInactive: function() {
                this.changeMode(p.modes.SIMPLE_SELECT);
              },
              clickActiveFeature: function(e) {
                (e.selectedCoordPaths = []),
                  this.clearSelectedCoordinates(),
                  e.feature.changed();
              },
              onSetup: function(e) {
                var t = e.featureId,
                  n = this.getFeature(t);
                if (!n)
                  throw new Error(
                    "You must provide a featureId to enter direct_select mode"
                  );
                if (n.type === p.geojsonTypes.POINT)
                  throw new TypeError(
                    "direct_select mode doesn't handle point features"
                  );
                var o = {
                  featureId: t,
                  feature: n,
                  dragMoveLocation: e.startPos || null,
                  dragMoving: !1,
                  canDragMove: !1,
                  selectedCoordPaths: e.coordPath ? [e.coordPath] : []
                };
                return (
                  this.setSelectedCoordinates(
                    this.pathsToCoordinates(t, o.selectedCoordPaths)
                  ),
                  this.setSelected(t),
                  l.disable(this),
                  this.setActionableState({ trash: !0 }),
                  o
                );
              },
              onStop: function() {
                l.enable(this), this.clearSelectedCoordinates();
              },
              toDisplayFeatures: function(e, t, n) {
                e.featureId === t.properties.id
                  ? ((t.properties.active = p.activeStates.ACTIVE),
                    n(t),
                    c(t, {
                      map: this.map,
                      midpoints: !0,
                      selectedPaths: e.selectedCoordPaths
                    }).forEach(n))
                  : ((t.properties.active = p.activeStates.INACTIVE), n(t)),
                  this.fireActionable(e);
              },
              onTrash: function(t) {
                t.selectedCoordPaths
                  .sort()
                  .reverse()
                  .forEach(function(e) {
                    return t.feature.removeCoordinate(e);
                  }),
                  this.fireUpdate(),
                  (t.selectedCoordPaths = []),
                  this.clearSelectedCoordinates(),
                  this.fireActionable(t),
                  !1 === t.feature.isValid() &&
                    (this.deleteFeature([t.featureId]),
                    this.changeMode(p.modes.SIMPLE_SELECT, {}));
              },
              onMouseMove: function(e, t) {
                var n = f.isActiveFeature(t),
                  o = d(t),
                  r = 0 === e.selectedCoordPaths.length;
                n && r
                  ? this.updateUIClasses({ mouse: p.cursors.MOVE })
                  : o && !r
                  ? this.updateUIClasses({ mouse: p.cursors.MOVE })
                  : this.updateUIClasses({ mouse: p.cursors.NONE }),
                  this.stopDragging(e);
              },
              onMouseOut: function(e) {
                e.dragMoving && this.fireUpdate();
              }
            };
          (y.onTouchStart = y.onMouseDown = function(e, t) {
            return d(t)
              ? this.onVertex(e, t)
              : f.isActiveFeature(t)
              ? this.onFeature(e, t)
              : g(t)
              ? this.onMidpoint(e, t)
              : void 0;
          }),
            (y.onDrag = function(e, t) {
              if (!0 === e.canDragMove) {
                (e.dragMoving = !0), t.originalEvent.stopPropagation();
                var n = {
                  lng: t.lngLat.lng - e.dragMoveLocation.lng,
                  lat: t.lngLat.lat - e.dragMoveLocation.lat
                };
                0 < e.selectedCoordPaths.length
                  ? this.dragVertex(e, t, n)
                  : this.dragFeature(e, t, n),
                  (e.dragMoveLocation = t.lngLat);
              }
            }),
            (y.onClick = function(e, t) {
              return r(t)
                ? this.clickNoTarget(e, t)
                : f.isActiveFeature(t)
                ? this.clickActiveFeature(e, t)
                : s(t)
                ? this.clickInactive(e, t)
                : void this.stopDragging(e);
            }),
            (y.onTap = function(e, t) {
              return r(t)
                ? this.clickNoTarget(e, t)
                : f.isActiveFeature(t)
                ? this.clickActiveFeature(e, t)
                : s(t)
                ? this.clickInactive(e, t)
                : void 0;
            }),
            (y.onTouchEnd = y.onMouseUp = function(e) {
              e.dragMoving && this.fireUpdate(), this.stopDragging(e);
            }),
            (t.exports = y);
        },
        {
          "../constants": 23,
          "../lib/common_selectors": 30,
          "../lib/constrain_feature_movement": 31,
          "../lib/create_supplementary_points": 33,
          "../lib/double_click_zoom": 35,
          "../lib/move_features": 45
        }
      ],
      53: [
        function(e, t, n) {
          "use strict";
          function u(e) {
            return (
              (function(e) {
                if (Array.isArray(e)) {
                  for (var t = 0, n = new Array(e.length); t < e.length; t++)
                    n[t] = e[t];
                  return n;
                }
              })(e) ||
              (function(e) {
                if (
                  Symbol.iterator in Object(e) ||
                  "[object Arguments]" === Object.prototype.toString.call(e)
                )
                  return Array.from(e);
              })(e) ||
              (function() {
                throw new TypeError(
                  "Invalid attempt to spread non-iterable instance"
                );
              })()
            );
          }
          var o = e("../lib/common_selectors"),
            r = e("../lib/is_event_at_coordinates"),
            l = e("../lib/double_click_zoom"),
            p = e("../constants"),
            i = e("../lib/create_vertex"),
            s = {
              onSetup: function(e) {
                var t,
                  n,
                  o = (e = e || {}).featureId,
                  r = "forward";
                if (o) {
                  if (!(t = this.getFeature(o)))
                    throw new Error(
                      "Could not find a feature with the provided featureId"
                    );
                  var i = e.from;
                  if (
                    (i &&
                      "Feature" === i.type &&
                      i.geometry &&
                      "Point" === i.geometry.type &&
                      (i = i.geometry),
                    i &&
                      "Point" === i.type &&
                      i.coordinates &&
                      2 === i.coordinates.length &&
                      (i = i.coordinates),
                    !i || !Array.isArray(i))
                  )
                    throw new Error(
                      "Please use the `from` property to indicate which point to continue the line from"
                    );
                  var s = t.coordinates.length - 1;
                  if (
                    t.coordinates[s][0] === i[0] &&
                    t.coordinates[s][1] === i[1]
                  ) {
                    var a;
                    (n = s + 1),
                      (a = t).addCoordinate.apply(
                        a,
                        [n].concat(u(t.coordinates[s]))
                      );
                  } else {
                    if (
                      t.coordinates[0][0] !== i[0] ||
                      t.coordinates[0][1] !== i[1]
                    )
                      throw new Error(
                        "`from` should match the point at either the start or the end of the provided LineString"
                      );
                    var c;
                    (r = "backwards"),
                      (n = 0),
                      (c = t).addCoordinate.apply(
                        c,
                        [n].concat(u(t.coordinates[0]))
                      );
                  }
                } else
                  (t = this.newFeature({
                    type: p.geojsonTypes.FEATURE,
                    properties: {},
                    geometry: {
                      type: p.geojsonTypes.LINE_STRING,
                      coordinates: []
                    }
                  })),
                    (n = 0),
                    this.addFeature(t);
                return (
                  this.clearSelectedFeatures(),
                  l.disable(this),
                  this.updateUIClasses({ mouse: p.cursors.ADD }),
                  this.activateUIButton(p.types.LINE),
                  this.setActionableState({ trash: !0 }),
                  { line: t, currentVertexPosition: n, direction: r }
                );
              },
              clickAnywhere: function(e, t) {
                if (
                  (0 < e.currentVertexPosition &&
                    r(t, e.line.coordinates[e.currentVertexPosition - 1])) ||
                  ("backwards" === e.direction &&
                    r(t, e.line.coordinates[e.currentVertexPosition + 1]))
                )
                  return this.changeMode(p.modes.SIMPLE_SELECT, {
                    featureIds: [e.line.id]
                  });
                this.updateUIClasses({ mouse: p.cursors.ADD }),
                  e.line.updateCoordinate(
                    e.currentVertexPosition,
                    t.lngLat.lng,
                    t.lngLat.lat
                  ),
                  "forward" === e.direction
                    ? (e.currentVertexPosition++,
                      e.line.updateCoordinate(
                        e.currentVertexPosition,
                        t.lngLat.lng,
                        t.lngLat.lat
                      ))
                    : e.line.addCoordinate(0, t.lngLat.lng, t.lngLat.lat);
              },
              clickOnVertex: function(e) {
                return this.changeMode(p.modes.SIMPLE_SELECT, {
                  featureIds: [e.line.id]
                });
              },
              onMouseMove: function(e, t) {
                e.line.updateCoordinate(
                  e.currentVertexPosition,
                  t.lngLat.lng,
                  t.lngLat.lat
                ),
                  o.isVertex(t) &&
                    this.updateUIClasses({ mouse: p.cursors.POINTER });
              }
            };
          (s.onTap = s.onClick = function(e, t) {
            if (o.isVertex(t)) return this.clickOnVertex(e, t);
            this.clickAnywhere(e, t);
          }),
            (s.onKeyUp = function(e, t) {
              o.isEnterKey(t)
                ? this.changeMode(p.modes.SIMPLE_SELECT, {
                    featureIds: [e.line.id]
                  })
                : o.isEscapeKey(t) &&
                  (this.deleteFeature([e.line.id], { silent: !0 }),
                  this.changeMode(p.modes.SIMPLE_SELECT));
            }),
            (s.onStop = function(e) {
              l.enable(this),
                this.activateUIButton(),
                void 0 !== this.getFeature(e.line.id) &&
                  (e.line.removeCoordinate("".concat(e.currentVertexPosition)),
                  e.line.isValid()
                    ? this.map.fire(p.events.CREATE, {
                        features: [e.line.toGeoJSON()]
                      })
                    : (this.deleteFeature([e.line.id], { silent: !0 }),
                      this.changeMode(
                        p.modes.SIMPLE_SELECT,
                        {},
                        { silent: !0 }
                      )));
            }),
            (s.onTrash = function(e) {
              this.deleteFeature([e.line.id], { silent: !0 }),
                this.changeMode(p.modes.SIMPLE_SELECT);
            }),
            (s.toDisplayFeatures = function(e, t, n) {
              var o = t.properties.id === e.line.id;
              if (
                ((t.properties.active = o
                  ? p.activeStates.ACTIVE
                  : p.activeStates.INACTIVE),
                !o)
              )
                return n(t);
              t.geometry.coordinates.length < 2 ||
                ((t.properties.meta = p.meta.FEATURE),
                n(
                  i(
                    e.line.id,
                    t.geometry.coordinates[
                      "forward" === e.direction
                        ? t.geometry.coordinates.length - 2
                        : 1
                    ],
                    "".concat(
                      "forward" === e.direction
                        ? t.geometry.coordinates.length - 2
                        : 1
                    ),
                    !1
                  )
                ),
                n(t));
            }),
            (t.exports = s);
        },
        {
          "../constants": 23,
          "../lib/common_selectors": 30,
          "../lib/create_vertex": 34,
          "../lib/double_click_zoom": 35,
          "../lib/is_event_at_coordinates": 40
        }
      ],
      54: [
        function(e, t, n) {
          "use strict";
          var o = e("../lib/common_selectors"),
            r = e("../constants"),
            i = {
              onSetup: function() {
                var e = this.newFeature({
                  type: r.geojsonTypes.FEATURE,
                  properties: {},
                  geometry: { type: r.geojsonTypes.POINT, coordinates: [] }
                });
                return (
                  this.addFeature(e),
                  this.clearSelectedFeatures(),
                  this.updateUIClasses({ mouse: r.cursors.ADD }),
                  this.activateUIButton(r.types.POINT),
                  this.setActionableState({ trash: !0 }),
                  { point: e }
                );
              },
              stopDrawingAndRemove: function(e) {
                this.deleteFeature([e.point.id], { silent: !0 }),
                  this.changeMode(r.modes.SIMPLE_SELECT);
              }
            };
          (i.onTap = i.onClick = function(e, t) {
            this.updateUIClasses({ mouse: r.cursors.MOVE }),
              e.point.updateCoordinate("", t.lngLat.lng, t.lngLat.lat),
              this.map.fire(r.events.CREATE, {
                features: [e.point.toGeoJSON()]
              }),
              this.changeMode(r.modes.SIMPLE_SELECT, {
                featureIds: [e.point.id]
              });
          }),
            (i.onStop = function(e) {
              this.activateUIButton(),
                e.point.getCoordinate().length ||
                  this.deleteFeature([e.point.id], { silent: !0 });
            }),
            (i.toDisplayFeatures = function(e, t, n) {
              var o = t.properties.id === e.point.id;
              if (
                ((t.properties.active = o
                  ? r.activeStates.ACTIVE
                  : r.activeStates.INACTIVE),
                !o)
              )
                return n(t);
            }),
            (i.onTrash = i.stopDrawingAndRemove),
            (i.onKeyUp = function(e, t) {
              if (o.isEscapeKey(t) || o.isEnterKey(t))
                return this.stopDrawingAndRemove(e, t);
            }),
            (t.exports = i);
        },
        { "../constants": 23, "../lib/common_selectors": 30 }
      ],
      55: [
        function(e, t, n) {
          "use strict";
          var o = e("../lib/common_selectors"),
            r = e("../lib/double_click_zoom"),
            a = e("../constants"),
            i = e("../lib/is_event_at_coordinates"),
            c = e("../lib/create_vertex"),
            s = {
              onSetup: function() {
                var e = this.newFeature({
                  type: a.geojsonTypes.FEATURE,
                  properties: {},
                  geometry: { type: a.geojsonTypes.POLYGON, coordinates: [[]] }
                });
                return (
                  this.addFeature(e),
                  this.clearSelectedFeatures(),
                  r.disable(this),
                  this.updateUIClasses({ mouse: a.cursors.ADD }),
                  this.activateUIButton(a.types.POLYGON),
                  this.setActionableState({ trash: !0 }),
                  { polygon: e, currentVertexPosition: 0 }
                );
              },
              clickAnywhere: function(e, t) {
                if (
                  0 < e.currentVertexPosition &&
                  i(t, e.polygon.coordinates[0][e.currentVertexPosition - 1])
                )
                  return this.changeMode(a.modes.SIMPLE_SELECT, {
                    featureIds: [e.polygon.id]
                  });
                this.updateUIClasses({ mouse: a.cursors.ADD }),
                  e.polygon.updateCoordinate(
                    "0.".concat(e.currentVertexPosition),
                    t.lngLat.lng,
                    t.lngLat.lat
                  ),
                  e.currentVertexPosition++,
                  e.polygon.updateCoordinate(
                    "0.".concat(e.currentVertexPosition),
                    t.lngLat.lng,
                    t.lngLat.lat
                  );
              },
              clickOnVertex: function(e) {
                return this.changeMode(a.modes.SIMPLE_SELECT, {
                  featureIds: [e.polygon.id]
                });
              },
              onMouseMove: function(e, t) {
                e.polygon.updateCoordinate(
                  "0.".concat(e.currentVertexPosition),
                  t.lngLat.lng,
                  t.lngLat.lat
                ),
                  o.isVertex(t) &&
                    this.updateUIClasses({ mouse: a.cursors.POINTER });
              }
            };
          (s.onTap = s.onClick = function(e, t) {
            return o.isVertex(t)
              ? this.clickOnVertex(e, t)
              : this.clickAnywhere(e, t);
          }),
            (s.onKeyUp = function(e, t) {
              o.isEscapeKey(t)
                ? (this.deleteFeature([e.polygon.id], { silent: !0 }),
                  this.changeMode(a.modes.SIMPLE_SELECT))
                : o.isEnterKey(t) &&
                  this.changeMode(a.modes.SIMPLE_SELECT, {
                    featureIds: [e.polygon.id]
                  });
            }),
            (s.onStop = function(e) {
              this.updateUIClasses({ mouse: a.cursors.NONE }),
                r.enable(this),
                this.activateUIButton(),
                void 0 !== this.getFeature(e.polygon.id) &&
                  (e.polygon.removeCoordinate(
                    "0.".concat(e.currentVertexPosition)
                  ),
                  e.polygon.isValid()
                    ? this.map.fire(a.events.CREATE, {
                        features: [e.polygon.toGeoJSON()]
                      })
                    : (this.deleteFeature([e.polygon.id], { silent: !0 }),
                      this.changeMode(
                        a.modes.SIMPLE_SELECT,
                        {},
                        { silent: !0 }
                      )));
            }),
            (s.toDisplayFeatures = function(e, t, n) {
              var o = t.properties.id === e.polygon.id;
              if (
                ((t.properties.active = o
                  ? a.activeStates.ACTIVE
                  : a.activeStates.INACTIVE),
                !o)
              )
                return n(t);
              if (0 !== t.geometry.coordinates.length) {
                var r = t.geometry.coordinates[0].length;
                if (!(r < 3)) {
                  if (
                    ((t.properties.meta = a.meta.FEATURE),
                    n(c(e.polygon.id, t.geometry.coordinates[0][0], "0.0", !1)),
                    3 < r)
                  ) {
                    var i = t.geometry.coordinates[0].length - 3;
                    n(
                      c(
                        e.polygon.id,
                        t.geometry.coordinates[0][i],
                        "0.".concat(i),
                        !1
                      )
                    );
                  }
                  if (r <= 4) {
                    var s = [
                      [
                        t.geometry.coordinates[0][0][0],
                        t.geometry.coordinates[0][0][1]
                      ],
                      [
                        t.geometry.coordinates[0][1][0],
                        t.geometry.coordinates[0][1][1]
                      ]
                    ];
                    if (
                      (n({
                        type: a.geojsonTypes.FEATURE,
                        properties: t.properties,
                        geometry: {
                          coordinates: s,
                          type: a.geojsonTypes.LINE_STRING
                        }
                      }),
                      3 === r)
                    )
                      return;
                  }
                  return n(t);
                }
              }
            }),
            (s.onTrash = function(e) {
              this.deleteFeature([e.polygon.id], { silent: !0 }),
                this.changeMode(a.modes.SIMPLE_SELECT);
            }),
            (t.exports = s);
        },
        {
          "../constants": 23,
          "../lib/common_selectors": 30,
          "../lib/create_vertex": 34,
          "../lib/double_click_zoom": 35,
          "../lib/is_event_at_coordinates": 40
        }
      ],
      56: [
        function(e, t, n) {
          "use strict";
          t.exports = {
            simple_select: e("./simple_select"),
            direct_select: e("./direct_select"),
            draw_point: e("./draw_point"),
            draw_polygon: e("./draw_polygon"),
            draw_line_string: e("./draw_line_string")
          };
        },
        {
          "./direct_select": 52,
          "./draw_line_string": 53,
          "./draw_point": 54,
          "./draw_polygon": 55,
          "./simple_select": 60
        }
      ],
      57: [
        function(e, t, n) {
          "use strict";
          var o = (t.exports = e("./mode_interface_accessors"));
          (o.prototype.onSetup = function() {}),
            (o.prototype.onDrag = function() {}),
            (o.prototype.onClick = function() {}),
            (o.prototype.onMouseMove = function() {}),
            (o.prototype.onMouseDown = function() {}),
            (o.prototype.onMouseUp = function() {}),
            (o.prototype.onMouseOut = function() {}),
            (o.prototype.onKeyUp = function() {}),
            (o.prototype.onKeyDown = function() {}),
            (o.prototype.onTouchStart = function() {}),
            (o.prototype.onTouchMove = function() {}),
            (o.prototype.onTouchEnd = function() {}),
            (o.prototype.onTap = function() {}),
            (o.prototype.onStop = function() {}),
            (o.prototype.onTrash = function() {}),
            (o.prototype.onCombineFeature = function() {}),
            (o.prototype.onUncombineFeature = function() {}),
            (o.prototype.toDisplayFeatures = function() {
              throw new Error("You must overwrite toDisplayFeatures");
            });
        },
        { "./mode_interface_accessors": 58 }
      ],
      58: [
        function(e, t, n) {
          "use strict";
          var o = e("../constants"),
            r = e("../lib/features_at"),
            i = e("../feature_types/point"),
            s = e("../feature_types/line_string"),
            a = e("../feature_types/polygon"),
            c = e("../feature_types/multi_feature"),
            u = (t.exports = function(e) {
              (this.map = e.map),
                (this.drawConfig = JSON.parse(JSON.stringify(e.options || {}))),
                (this._ctx = e);
            });
          (u.prototype.setSelected = function(e) {
            return this._ctx.store.setSelected(e);
          }),
            (u.prototype.setSelectedCoordinates = function(e) {
              var n = this;
              this._ctx.store.setSelectedCoordinates(e),
                e.reduce(function(e, t) {
                  return (
                    void 0 === e[t.feature_id] &&
                      ((e[t.feature_id] = !0),
                      n._ctx.store.get(t.feature_id).changed()),
                    e
                  );
                }, {});
            }),
            (u.prototype.getSelected = function() {
              return this._ctx.store.getSelected();
            }),
            (u.prototype.getSelectedIds = function() {
              return this._ctx.store.getSelectedIds();
            }),
            (u.prototype.isSelected = function(e) {
              return this._ctx.store.isSelected(e);
            }),
            (u.prototype.getFeature = function(e) {
              return this._ctx.store.get(e);
            }),
            (u.prototype.select = function(e) {
              return this._ctx.store.select(e);
            }),
            (u.prototype.deselect = function(e) {
              return this._ctx.store.deselect(e);
            }),
            (u.prototype.deleteFeature = function(e) {
              var t =
                1 < arguments.length && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
              return this._ctx.store.delete(e, t);
            }),
            (u.prototype.addFeature = function(e) {
              return this._ctx.store.add(e);
            }),
            (u.prototype.clearSelectedFeatures = function() {
              return this._ctx.store.clearSelected();
            }),
            (u.prototype.clearSelectedCoordinates = function() {
              return this._ctx.store.clearSelectedCoordinates();
            }),
            (u.prototype.setActionableState = function() {
              var e =
                  0 < arguments.length && void 0 !== arguments[0]
                    ? arguments[0]
                    : {},
                t = {
                  trash: e.trash || !1,
                  combineFeatures: e.combineFeatures || !1,
                  uncombineFeatures: e.uncombineFeatures || !1
                };
              return this._ctx.events.actionable(t);
            }),
            (u.prototype.changeMode = function(e) {
              var t =
                  1 < arguments.length && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                n =
                  2 < arguments.length && void 0 !== arguments[2]
                    ? arguments[2]
                    : {};
              return this._ctx.events.changeMode(e, t, n);
            }),
            (u.prototype.updateUIClasses = function(e) {
              return this._ctx.ui.queueMapClasses(e);
            }),
            (u.prototype.activateUIButton = function(e) {
              return this._ctx.ui.setActiveButton(e);
            }),
            (u.prototype.featuresAt = function(e, t) {
              var n =
                2 < arguments.length && void 0 !== arguments[2]
                  ? arguments[2]
                  : "click";
              if ("click" !== n && "touch" !== n)
                throw new Error("invalid buffer type");
              return r[n](e, t, this._ctx);
            }),
            (u.prototype.newFeature = function(e) {
              var t = e.geometry.type;
              return t === o.geojsonTypes.POINT
                ? new i(this._ctx, e)
                : t === o.geojsonTypes.LINE_STRING
                ? new s(this._ctx, e)
                : t === o.geojsonTypes.POLYGON
                ? new a(this._ctx, e)
                : new c(this._ctx, e);
            }),
            (u.prototype.isInstanceOf = function(e, t) {
              if (e === o.geojsonTypes.POINT) return t instanceof i;
              if (e === o.geojsonTypes.LINE_STRING) return t instanceof s;
              if (e === o.geojsonTypes.POLYGON) return t instanceof a;
              if ("MultiFeature" === e) return t instanceof c;
              throw new Error("Unknown feature class: ".concat(e));
            }),
            (u.prototype.doRender = function(e) {
              return this._ctx.store.featureChanged(e);
            });
        },
        {
          "../constants": 23,
          "../feature_types/line_string": 26,
          "../feature_types/multi_feature": 27,
          "../feature_types/point": 28,
          "../feature_types/polygon": 29,
          "../lib/features_at": 37
        }
      ],
      59: [
        function(e, t, n) {
          "use strict";
          var o = e("./mode_interface"),
            c = {
              drag: "onDrag",
              click: "onClick",
              mousemove: "onMouseMove",
              mousedown: "onMouseDown",
              mouseup: "onMouseUp",
              mouseout: "onMouseOut",
              keyup: "onKeyUp",
              keydown: "onKeyDown",
              touchstart: "onTouchStart",
              touchmove: "onTouchMove",
              touchend: "onTouchEnd",
              tap: "onTap"
            },
            u = Object.keys(c);
          t.exports = function(a) {
            var n = Object.keys(a);
            return function(e) {
              var t =
                  1 < arguments.length && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                i = {},
                s = n.reduce(function(e, t) {
                  return (e[t] = a[t]), e;
                }, new o(e));
              return {
                start: function() {
                  var r = this;
                  (i = s.onSetup(t)),
                    u.forEach(function(e) {
                      var t,
                        n = c[e],
                        o = function() {
                          return !1;
                        };
                      a[n] &&
                        (o = function() {
                          return !0;
                        }),
                        r.on(
                          e,
                          o,
                          ((t = n),
                          function(e) {
                            s[t](i, e);
                          })
                        );
                    });
                },
                stop: function() {
                  s.onStop(i);
                },
                trash: function() {
                  s.onTrash(i);
                },
                combineFeatures: function() {
                  s.onCombineFeatures(i);
                },
                uncombineFeatures: function() {
                  s.onUncombineFeatures(i);
                },
                render: function(e, t) {
                  s.toDisplayFeatures(i, e, t);
                }
              };
            };
          };
        },
        { "./mode_interface": 57 }
      ],
      60: [
        function(e, t, n) {
          "use strict";
          var a = e("../lib/common_selectors"),
            c = e("../lib/mouse_event_point"),
            o = e("../lib/create_supplementary_points"),
            r = e("../lib/string_set"),
            u = e("../lib/double_click_zoom"),
            i = e("../lib/move_features"),
            l = e("../constants"),
            s = {
              onSetup: function(e) {
                var t = this,
                  n = {
                    dragMoveLocation: null,
                    boxSelectStartLocation: null,
                    boxSelectElement: void 0,
                    boxSelecting: !1,
                    canBoxSelect: !1,
                    dragMoveing: !1,
                    canDragMove: !1,
                    initiallySelectedFeatureIds: e.featureIds || []
                  };
                return (
                  this.setSelected(
                    n.initiallySelectedFeatureIds.filter(function(e) {
                      return void 0 !== t.getFeature(e);
                    })
                  ),
                  this.fireActionable(),
                  this.setActionableState({
                    combineFeatures: !0,
                    uncombineFeatures: !0,
                    trash: !0
                  }),
                  n
                );
              },
              fireUpdate: function() {
                this.map.fire(l.events.UPDATE, {
                  action: l.updateActions.MOVE,
                  features: this.getSelected().map(function(e) {
                    return e.toGeoJSON();
                  })
                });
              },
              fireActionable: function() {
                var t = this,
                  e = this.getSelected(),
                  n = e.filter(function(e) {
                    return t.isInstanceOf("MultiFeature", e);
                  }),
                  o = !1;
                if (1 < e.length) {
                  o = !0;
                  var r = e[0].type.replace("Multi", "");
                  e.forEach(function(e) {
                    e.type.replace("Multi", "") !== r && (o = !1);
                  });
                }
                var i = 0 < n.length,
                  s = 0 < e.length;
                this.setActionableState({
                  combineFeatures: o,
                  uncombineFeatures: i,
                  trash: s
                });
              },
              getUniqueIds: function(e) {
                return e.length
                  ? e
                      .map(function(e) {
                        return e.properties.id;
                      })
                      .filter(function(e) {
                        return void 0 !== e;
                      })
                      .reduce(function(e, t) {
                        return e.add(t), e;
                      }, new r())
                      .values()
                  : [];
              },
              stopExtendedInteractions: function(e) {
                e.boxSelectElement &&
                  (e.boxSelectElement.parentNode &&
                    e.boxSelectElement.parentNode.removeChild(
                      e.boxSelectElement
                    ),
                  (e.boxSelectElement = null)),
                  this.map.dragPan.enable(),
                  (e.boxSelecting = !1),
                  (e.canBoxSelect = !1),
                  (e.dragMoving = !1),
                  (e.canDragMove = !1);
              },
              onStop: function() {
                u.enable(this);
              },
              onMouseMove: function(e) {
                return this.stopExtendedInteractions(e);
              },
              onMouseOut: function(e) {
                if (e.dragMoving) return this.fireUpdate();
              }
            };
          (s.onTap = s.onClick = function(e, t) {
            return a.noTarget(t)
              ? this.clickAnywhere(e, t)
              : a.isOfMetaType(l.meta.VERTEX)(t)
              ? this.clickOnVertex(e, t)
              : a.isFeature(t)
              ? this.clickOnFeature(e, t)
              : void 0;
          }),
            (s.clickAnywhere = function(e) {
              var t = this,
                n = this.getSelectedIds();
              n.length &&
                (this.clearSelectedFeatures(),
                n.forEach(function(e) {
                  return t.doRender(e);
                })),
                u.enable(this),
                this.stopExtendedInteractions(e);
            }),
            (s.clickOnVertex = function(e, t) {
              this.changeMode(l.modes.DIRECT_SELECT, {
                featureId: t.featureTarget.properties.parent,
                coordPath: t.featureTarget.properties.coord_path,
                startPos: t.lngLat
              }),
                this.updateUIClasses({ mouse: l.cursors.MOVE });
            }),
            (s.startOnActiveFeature = function(e, t) {
              this.stopExtendedInteractions(e),
                this.map.dragPan.disable(),
                this.doRender(t.featureTarget.properties.id),
                (e.canDragMove = !0),
                (e.dragMoveLocation = t.lngLat);
            }),
            (s.clickOnFeature = function(e, t) {
              var n = this;
              u.disable(this), this.stopExtendedInteractions(e);
              var o = a.isShiftDown(t),
                r = this.getSelectedIds(),
                i = t.featureTarget.properties.id,
                s = this.isSelected(i);
              if (!o && s && this.getFeature(i).type !== l.geojsonTypes.POINT)
                return this.changeMode(l.modes.DIRECT_SELECT, { featureId: i });
              s && o
                ? (this.deselect(i),
                  this.updateUIClasses({ mouse: l.cursors.POINTER }),
                  1 === r.length && u.enable(this))
                : !s && o
                ? (this.select(i),
                  this.updateUIClasses({ mouse: l.cursors.MOVE }))
                : s ||
                  o ||
                  (r.forEach(function(e) {
                    return n.doRender(e);
                  }),
                  this.setSelected(i),
                  this.updateUIClasses({ mouse: l.cursors.MOVE })),
                this.doRender(i);
            }),
            (s.onMouseDown = function(e, t) {
              return a.isActiveFeature(t)
                ? this.startOnActiveFeature(e, t)
                : this.drawConfig.boxSelect && a.isShiftMousedown(t)
                ? this.startBoxSelect(e, t)
                : void 0;
            }),
            (s.startBoxSelect = function(e, t) {
              this.stopExtendedInteractions(e),
                this.map.dragPan.disable(),
                (e.boxSelectStartLocation = c(
                  t.originalEvent,
                  this.map.getContainer()
                )),
                (e.canBoxSelect = !0);
            }),
            (s.onTouchStart = function(e, t) {
              if (a.isActiveFeature(t)) return this.startOnActiveFeature(e, t);
            }),
            (s.onDrag = function(e, t) {
              return e.canDragMove
                ? this.dragMove(e, t)
                : this.drawConfig.boxSelect && e.canBoxSelect
                ? this.whileBoxSelect(e, t)
                : void 0;
            }),
            (s.whileBoxSelect = function(e, t) {
              (e.boxSelecting = !0),
                this.updateUIClasses({ mouse: l.cursors.ADD }),
                e.boxSelectElement ||
                  ((e.boxSelectElement = document.createElement("div")),
                  e.boxSelectElement.classList.add(l.classes.BOX_SELECT),
                  this.map.getContainer().appendChild(e.boxSelectElement));
              var n = c(t.originalEvent, this.map.getContainer()),
                o = Math.min(e.boxSelectStartLocation.x, n.x),
                r = Math.max(e.boxSelectStartLocation.x, n.x),
                i = Math.min(e.boxSelectStartLocation.y, n.y),
                s = Math.max(e.boxSelectStartLocation.y, n.y),
                a = "translate(".concat(o, "px, ").concat(i, "px)");
              (e.boxSelectElement.style.transform = a),
                (e.boxSelectElement.style.WebkitTransform = a),
                (e.boxSelectElement.style.width = "".concat(r - o, "px")),
                (e.boxSelectElement.style.height = "".concat(s - i, "px"));
            }),
            (s.dragMove = function(e, t) {
              (e.dragMoving = !0), t.originalEvent.stopPropagation();
              var n = {
                lng: t.lngLat.lng - e.dragMoveLocation.lng,
                lat: t.lngLat.lat - e.dragMoveLocation.lat
              };
              i(this.getSelected(), n), (e.dragMoveLocation = t.lngLat);
            }),
            (s.onMouseUp = function(e, t) {
              var n = this;
              if (e.dragMoving) this.fireUpdate();
              else if (e.boxSelecting) {
                var o = [
                    e.boxSelectStartLocation,
                    c(t.originalEvent, this.map.getContainer())
                  ],
                  r = this.featuresAt(null, o, "click"),
                  i = this.getUniqueIds(r).filter(function(e) {
                    return !n.isSelected(e);
                  });
                i.length &&
                  (this.select(i),
                  i.forEach(function(e) {
                    return n.doRender(e);
                  }),
                  this.updateUIClasses({ mouse: l.cursors.MOVE }));
              }
              this.stopExtendedInteractions(e);
            }),
            (s.toDisplayFeatures = function(e, t, n) {
              (t.properties.active = this.isSelected(t.properties.id)
                ? l.activeStates.ACTIVE
                : l.activeStates.INACTIVE),
                n(t),
                this.fireActionable(),
                t.properties.active === l.activeStates.ACTIVE &&
                  t.geometry.type !== l.geojsonTypes.POINT &&
                  o(t).forEach(n);
            }),
            (s.onTrash = function() {
              this.deleteFeature(this.getSelectedIds()), this.fireActionable();
            }),
            (s.onCombineFeatures = function() {
              var e = this.getSelected();
              if (!(0 === e.length || e.length < 2)) {
                for (
                  var t = [], n = [], o = e[0].type.replace("Multi", ""), r = 0;
                  r < e.length;
                  r++
                ) {
                  var i = e[r];
                  if (i.type.replace("Multi", "") !== o) return;
                  i.type.includes("Multi")
                    ? i.getCoordinates().forEach(function(e) {
                        t.push(e);
                      })
                    : t.push(i.getCoordinates()),
                    n.push(i.toGeoJSON());
                }
                if (1 < n.length) {
                  var s = this.newFeature({
                    type: l.geojsonTypes.FEATURE,
                    properties: n[0].properties,
                    geometry: { type: "Multi".concat(o), coordinates: t }
                  });
                  this.addFeature(s),
                    this.deleteFeature(this.getSelectedIds(), { silent: !0 }),
                    this.setSelected([s.id]),
                    this.map.fire(l.events.COMBINE_FEATURES, {
                      createdFeatures: [s.toGeoJSON()],
                      deletedFeatures: n
                    });
                }
                this.fireActionable();
              }
            }),
            (s.onUncombineFeatures = function() {
              var n = this,
                o = this.getSelected();
              if (0 !== o.length) {
                for (
                  var r = [],
                    i = [],
                    e = function(e) {
                      var t = o[e];
                      n.isInstanceOf("MultiFeature", t) &&
                        (t.getFeatures().forEach(function(e) {
                          n.addFeature(e),
                            (e.properties = t.properties),
                            r.push(e.toGeoJSON()),
                            n.select([e.id]);
                        }),
                        n.deleteFeature(t.id, { silent: !0 }),
                        i.push(t.toGeoJSON()));
                    },
                    t = 0;
                  t < o.length;
                  t++
                )
                  e(t);
                1 < r.length &&
                  this.map.fire(l.events.UNCOMBINE_FEATURES, {
                    createdFeatures: r,
                    deletedFeatures: i
                  }),
                  this.fireActionable();
              }
            }),
            (t.exports = s);
        },
        {
          "../constants": 23,
          "../lib/common_selectors": 30,
          "../lib/create_supplementary_points": 33,
          "../lib/double_click_zoom": 35,
          "../lib/mouse_event_point": 44,
          "../lib/move_features": 45,
          "../lib/string_set": 47
        }
      ],
      61: [
        function(e, t, n) {
          "use strict";
          var o = e("xtend"),
            r = e("./constants"),
            i = {
              defaultMode: r.modes.SIMPLE_SELECT,
              keybindings: !0,
              touchEnabled: !0,
              clickBuffer: 2,
              touchBuffer: 25,
              boxSelect: !0,
              displayControlsDefault: !0,
              styles: e("./lib/theme"),
              modes: e("./modes"),
              controls: {},
              userProperties: !1
            },
            s = {
              point: !0,
              line_string: !0,
              polygon: !0,
              trash: !0,
              combine_features: !0,
              uncombine_features: !0
            },
            a = {
              point: !1,
              line_string: !1,
              polygon: !1,
              trash: !1,
              combine_features: !1,
              uncombine_features: !1
            };
          function c(e, t) {
            return e.map(function(e) {
              return e.source
                ? e
                : o(e, {
                    id: "".concat(e.id, ".").concat(t),
                    source: "hot" === t ? r.sources.HOT : r.sources.COLD
                  });
            });
          }
          t.exports = function() {
            var e =
                0 < arguments.length && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              t = o(e);
            return (
              e.controls || (t.controls = {}),
              !1 === e.displayControlsDefault
                ? (t.controls = o(a, e.controls))
                : (t.controls = o(s, e.controls)),
              ((t = o(i, t)).styles = c(t.styles, "cold").concat(
                c(t.styles, "hot")
              )),
              t
            );
          };
        },
        { "./constants": 23, "./lib/theme": 49, "./modes": 56, xtend: 21 }
      ],
      62: [
        function(e, t, n) {
          "use strict";
          var u = e("./constants");
          t.exports = function() {
            var o = this;
            if (!(o.ctx.map && void 0 !== o.ctx.map.getSource(u.sources.HOT)))
              return c();
            var r = o.ctx.events.currentModeName();
            o.ctx.ui.queueMapClasses({ mode: r });
            var n = [],
              e = [];
            (e = o.isDirty
              ? o.getAllIds()
              : ((n = o.getChangedIds().filter(function(e) {
                  return void 0 !== o.get(e);
                })),
                o.sources.hot
                  .filter(function(e) {
                    return (
                      e.properties.id &&
                      -1 === n.indexOf(e.properties.id) &&
                      void 0 !== o.get(e.properties.id)
                    );
                  })
                  .map(function(e) {
                    return e.properties.id;
                  }))),
              (o.sources.hot = []);
            var t = o.sources.cold.length;
            o.sources.cold = o.isDirty
              ? []
              : o.sources.cold.filter(function(e) {
                  var t = e.properties.id || e.properties.parent;
                  return -1 === n.indexOf(t);
                });
            var i = t !== o.sources.cold.length || 0 < e.length;
            function s(e, t) {
              var n = o.get(e).internal(r);
              o.ctx.events.currentModeRender(n, function(e) {
                o.sources[t].push(e);
              });
            }
            if (
              (n.forEach(function(e) {
                return s(e, "hot");
              }),
              e.forEach(function(e) {
                return s(e, "cold");
              }),
              i &&
                o.ctx.map
                  .getSource(u.sources.COLD)
                  .setData({
                    type: u.geojsonTypes.FEATURE_COLLECTION,
                    features: o.sources.cold
                  }),
              o.ctx.map
                .getSource(u.sources.HOT)
                .setData({
                  type: u.geojsonTypes.FEATURE_COLLECTION,
                  features: o.sources.hot
                }),
              o._emitSelectionChange &&
                (o.ctx.map.fire(u.events.SELECTION_CHANGE, {
                  features: o.getSelected().map(function(e) {
                    return e.toGeoJSON();
                  }),
                  points: o.getSelectedCoordinates().map(function(e) {
                    return {
                      type: u.geojsonTypes.FEATURE,
                      properties: {},
                      geometry: {
                        type: u.geojsonTypes.POINT,
                        coordinates: e.coordinates
                      }
                    };
                  })
                }),
                (o._emitSelectionChange = !1)),
              o._deletedFeaturesToEmit.length)
            ) {
              var a = o._deletedFeaturesToEmit.map(function(e) {
                return e.toGeoJSON();
              });
              (o._deletedFeaturesToEmit = []),
                o.ctx.map.fire(u.events.DELETE, { features: a });
            }
            function c() {
              (o.isDirty = !1), o.clearChangedIds();
            }
            c(), o.ctx.map.fire(u.events.RENDER, {});
          };
        },
        { "./constants": 23 }
      ],
      63: [
        function(e, t, n) {
          "use strict";
          var s = e("./events"),
            a = e("./store"),
            c = e("./ui"),
            o = e("./constants"),
            u = e("xtend");
          t.exports = function(t) {
            var e = null,
              n = null,
              i = {
                onRemove: function() {
                  return (
                    t.map.off("load", i.connect),
                    clearInterval(n),
                    i.removeLayers(),
                    t.store.restoreMapConfig(),
                    t.ui.removeButtons(),
                    t.events.removeEventListeners(),
                    t.ui.clearMapClasses(),
                    (t.map = null),
                    (t.container = null),
                    (t.store = null),
                    e && e.parentNode && e.parentNode.removeChild(e),
                    (e = null),
                    this
                  );
                },
                connect: function() {
                  t.map.off("load", i.connect),
                    clearInterval(n),
                    i.addLayers(),
                    t.store.storeMapConfig(),
                    t.events.addEventListeners();
                },
                onAdd: function(o) {
                  var r = o.fire;
                  return (
                    (o.fire = function(e, t) {
                      var n = arguments;
                      return (
                        1 === r.length &&
                          1 !== arguments.length &&
                          (n = [u({}, { type: e }, t)]),
                        r.apply(o, n)
                      );
                    }),
                    (t.map = o),
                    (t.events = s(t)),
                    (t.ui = c(t)),
                    (t.container = o.getContainer()),
                    (t.store = new a(t)),
                    (e = t.ui.addButtons()),
                    t.options.boxSelect &&
                      (o.boxZoom.disable(),
                      o.dragPan.disable(),
                      o.dragPan.enable()),
                    o.loaded()
                      ? i.connect()
                      : (o.on("load", i.connect),
                        (n = setInterval(function() {
                          o.loaded() && i.connect();
                        }, 16))),
                    t.events.start(),
                    e
                  );
                },
                addLayers: function() {
                  t.map.addSource(o.sources.COLD, {
                    data: {
                      type: o.geojsonTypes.FEATURE_COLLECTION,
                      features: []
                    },
                    type: "geojson"
                  }),
                    t.map.addSource(o.sources.HOT, {
                      data: {
                        type: o.geojsonTypes.FEATURE_COLLECTION,
                        features: []
                      },
                      type: "geojson"
                    }),
                    t.options.styles.forEach(function(e) {
                      t.map.addLayer(e);
                    }),
                    t.store.setDirty(!0),
                    t.store.render();
                },
                removeLayers: function() {
                  t.options.styles.forEach(function(e) {
                    t.map.getLayer(e.id) && t.map.removeLayer(e.id);
                  }),
                    t.map.getSource(o.sources.COLD) &&
                      t.map.removeSource(o.sources.COLD),
                    t.map.getSource(o.sources.HOT) &&
                      t.map.removeSource(o.sources.HOT);
                }
              };
            return (t.setup = i);
          };
        },
        {
          "./constants": 23,
          "./events": 24,
          "./store": 64,
          "./ui": 65,
          xtend: 21
        }
      ],
      64: [
        function(e, t, n) {
          "use strict";
          var o = e("./lib/throttle"),
            r = e("./lib/to_dense_array"),
            i = e("./lib/string_set"),
            s = e("./render"),
            a = e("./constants").interactions,
            c = (t.exports = function(e) {
              (this._features = {}),
                (this._featureIds = new i()),
                (this._selectedFeatureIds = new i()),
                (this._selectedCoordinates = []),
                (this._changedFeatureIds = new i()),
                (this._deletedFeaturesToEmit = []),
                (this._emitSelectionChange = !1),
                (this._mapInitialConfig = {}),
                (this.ctx = e),
                (this.sources = { hot: [], cold: [] }),
                (this.render = o(s, 16, this)),
                (this.isDirty = !1);
            });
          function u(e) {
            var t = this,
              n = this._selectedCoordinates.filter(function(e) {
                return t._selectedFeatureIds.has(e.feature_id);
              });
            this._selectedCoordinates.length === n.length ||
              e.silent ||
              (this._emitSelectionChange = !0),
              (this._selectedCoordinates = n);
          }
          (c.prototype.createRenderBatch = function() {
            var e = this,
              t = this.render,
              n = 0;
            return (
              (this.render = function() {
                n++;
              }),
              function() {
                (e.render = t), 0 < n && e.render();
              }
            );
          }),
            (c.prototype.setDirty = function() {
              return (this.isDirty = !0), this;
            }),
            (c.prototype.featureChanged = function(e) {
              return this._changedFeatureIds.add(e), this;
            }),
            (c.prototype.getChangedIds = function() {
              return this._changedFeatureIds.values();
            }),
            (c.prototype.clearChangedIds = function() {
              return this._changedFeatureIds.clear(), this;
            }),
            (c.prototype.getAllIds = function() {
              return this._featureIds.values();
            }),
            (c.prototype.add = function(e) {
              return (
                this.featureChanged(e.id),
                (this._features[e.id] = e),
                this._featureIds.add(e.id),
                this
              );
            }),
            (c.prototype.delete = function(e) {
              var t = this,
                n =
                  1 < arguments.length && void 0 !== arguments[1]
                    ? arguments[1]
                    : {};
              return (
                r(e).forEach(function(e) {
                  t._featureIds.has(e) &&
                    (t._featureIds.delete(e),
                    t._selectedFeatureIds.delete(e),
                    n.silent ||
                      (-1 ===
                        t._deletedFeaturesToEmit.indexOf(t._features[e]) &&
                        t._deletedFeaturesToEmit.push(t._features[e])),
                    delete t._features[e],
                    (t.isDirty = !0));
                }),
                u.call(this, n),
                this
              );
            }),
            (c.prototype.get = function(e) {
              return this._features[e];
            }),
            (c.prototype.getAll = function() {
              var t = this;
              return Object.keys(this._features).map(function(e) {
                return t._features[e];
              });
            }),
            (c.prototype.select = function(e) {
              var t = this,
                n =
                  1 < arguments.length && void 0 !== arguments[1]
                    ? arguments[1]
                    : {};
              return (
                r(e).forEach(function(e) {
                  t._selectedFeatureIds.has(e) ||
                    (t._selectedFeatureIds.add(e),
                    t._changedFeatureIds.add(e),
                    n.silent || (t._emitSelectionChange = !0));
                }),
                this
              );
            }),
            (c.prototype.deselect = function(e) {
              var t = this,
                n =
                  1 < arguments.length && void 0 !== arguments[1]
                    ? arguments[1]
                    : {};
              return (
                r(e).forEach(function(e) {
                  t._selectedFeatureIds.has(e) &&
                    (t._selectedFeatureIds.delete(e),
                    t._changedFeatureIds.add(e),
                    n.silent || (t._emitSelectionChange = !0));
                }),
                u.call(this, n),
                this
              );
            }),
            (c.prototype.clearSelected = function() {
              var e =
                0 < arguments.length && void 0 !== arguments[0]
                  ? arguments[0]
                  : {};
              return (
                this.deselect(this._selectedFeatureIds.values(), {
                  silent: e.silent
                }),
                this
              );
            }),
            (c.prototype.setSelected = function(t) {
              var n = this,
                e =
                  1 < arguments.length && void 0 !== arguments[1]
                    ? arguments[1]
                    : {};
              return (
                (t = r(t)),
                this.deselect(
                  this._selectedFeatureIds.values().filter(function(e) {
                    return -1 === t.indexOf(e);
                  }),
                  { silent: e.silent }
                ),
                this.select(
                  t.filter(function(e) {
                    return !n._selectedFeatureIds.has(e);
                  }),
                  { silent: e.silent }
                ),
                this
              );
            }),
            (c.prototype.setSelectedCoordinates = function(e) {
              return (
                (this._selectedCoordinates = e),
                (this._emitSelectionChange = !0),
                this
              );
            }),
            (c.prototype.clearSelectedCoordinates = function() {
              return (
                (this._selectedCoordinates = []),
                (this._emitSelectionChange = !0),
                this
              );
            }),
            (c.prototype.getSelectedIds = function() {
              return this._selectedFeatureIds.values();
            }),
            (c.prototype.getSelected = function() {
              var t = this;
              return this._selectedFeatureIds.values().map(function(e) {
                return t.get(e);
              });
            }),
            (c.prototype.getSelectedCoordinates = function() {
              var t = this;
              return this._selectedCoordinates.map(function(e) {
                return {
                  coordinates: t.get(e.feature_id).getCoordinate(e.coord_path)
                };
              });
            }),
            (c.prototype.isSelected = function(e) {
              return this._selectedFeatureIds.has(e);
            }),
            (c.prototype.setFeatureProperty = function(e, t, n) {
              this.get(e).setProperty(t, n), this.featureChanged(e);
            }),
            (c.prototype.storeMapConfig = function() {
              var t = this;
              a.forEach(function(e) {
                t.ctx.map[e] &&
                  (t._mapInitialConfig[e] = t.ctx.map[e].isEnabled());
              });
            }),
            (c.prototype.restoreMapConfig = function() {
              var t = this;
              Object.keys(this._mapInitialConfig).forEach(function(e) {
                t._mapInitialConfig[e]
                  ? t.ctx.map[e].enable()
                  : t.ctx.map[e].disable();
              });
            }),
            (c.prototype.getInitialConfigValue = function(e) {
              return (
                void 0 === this._mapInitialConfig[e] ||
                this._mapInitialConfig[e]
              );
            });
        },
        {
          "./constants": 23,
          "./lib/string_set": 47,
          "./lib/throttle": 50,
          "./lib/to_dense_array": 51,
          "./render": 62
        }
      ],
      65: [
        function(e, t, n) {
          "use strict";
          var l = e("xtend"),
            p = e("./constants"),
            f = ["mode", "feature", "mouse"];
          t.exports = function(o) {
            var n = {},
              r = null,
              i = { mode: null, feature: null, mouse: null },
              s = { mode: null, feature: null, mouse: null };
            function e(e) {
              s = l(s, e);
            }
            function t() {
              if (o.container) {
                var t = [],
                  n = [];
                f.forEach(function(e) {
                  s[e] !== i[e] &&
                    (t.push("".concat(e, "-").concat(i[e])),
                    null !== s[e] && n.push("".concat(e, "-").concat(s[e])));
                }),
                  0 < t.length &&
                    o.container.classList.remove.apply(
                      o.container.classList,
                      t
                    ),
                  0 < n.length &&
                    o.container.classList.add.apply(o.container.classList, n),
                  (i = l(i, s));
              }
            }
            function a(t) {
              var n =
                  1 < arguments.length && void 0 !== arguments[1]
                    ? arguments[1]
                    : {},
                e = document.createElement("button");
              return (
                (e.className = ""
                  .concat(p.classes.CONTROL_BUTTON, " ")
                  .concat(n.className)),
                e.setAttribute("title", n.title),
                n.container.appendChild(e),
                e.addEventListener(
                  "click",
                  function(e) {
                    e.preventDefault(),
                      e.stopPropagation(),
                      e.target !== r ? (u(t), n.onActivate()) : c();
                  },
                  !0
                ),
                e
              );
            }
            function c() {
              r && (r.classList.remove(p.classes.ACTIVE_BUTTON), (r = null));
            }
            function u(e) {
              c();
              var t = n[e];
              t &&
                t &&
                "trash" !== e &&
                (t.classList.add(p.classes.ACTIVE_BUTTON), (r = t));
            }
            return {
              setActiveButton: u,
              queueMapClasses: e,
              updateMapClasses: t,
              clearMapClasses: function() {
                e({ mode: null, feature: null, mouse: null }), t();
              },
              addButtons: function() {
                var e = o.options.controls,
                  t = document.createElement("div");
                return (
                  (t.className = ""
                    .concat(p.classes.CONTROL_GROUP, " ")
                    .concat(p.classes.CONTROL_BASE)),
                  e &&
                    (e[p.types.LINE] &&
                      (n[p.types.LINE] = a(p.types.LINE, {
                        container: t,
                        className: p.classes.CONTROL_BUTTON_LINE,
                        title: "LineString tool ".concat(
                          o.options.keybindings ? "(l)" : ""
                        ),
                        onActivate: function() {
                          return o.events.changeMode(p.modes.DRAW_LINE_STRING);
                        }
                      })),
                    e[p.types.POLYGON] &&
                      (n[p.types.POLYGON] = a(p.types.POLYGON, {
                        container: t,
                        className: p.classes.CONTROL_BUTTON_POLYGON,
                        title: "Polygon tool ".concat(
                          o.options.keybindings ? "(p)" : ""
                        ),
                        onActivate: function() {
                          return o.events.changeMode(p.modes.DRAW_POLYGON);
                        }
                      })),
                    e[p.types.POINT] &&
                      (n[p.types.POINT] = a(p.types.POINT, {
                        container: t,
                        className: p.classes.CONTROL_BUTTON_POINT,
                        title: "Marker tool ".concat(
                          o.options.keybindings ? "(m)" : ""
                        ),
                        onActivate: function() {
                          return o.events.changeMode(p.modes.DRAW_POINT);
                        }
                      })),
                    e.trash &&
                      (n.trash = a("trash", {
                        container: t,
                        className: p.classes.CONTROL_BUTTON_TRASH,
                        title: "Delete",
                        onActivate: function() {
                          o.events.trash();
                        }
                      })),
                    e.combine_features &&
                      (n.combine_features = a("combineFeatures", {
                        container: t,
                        className: p.classes.CONTROL_BUTTON_COMBINE_FEATURES,
                        title: "Combine",
                        onActivate: function() {
                          o.events.combineFeatures();
                        }
                      })),
                    e.uncombine_features &&
                      (n.uncombine_features = a("uncombineFeatures", {
                        container: t,
                        className: p.classes.CONTROL_BUTTON_UNCOMBINE_FEATURES,
                        title: "Uncombine",
                        onActivate: function() {
                          o.events.uncombineFeatures();
                        }
                      }))),
                  t
                );
              },
              removeButtons: function() {
                Object.keys(n).forEach(function(e) {
                  var t = n[e];
                  t.parentNode && t.parentNode.removeChild(t), delete n[e];
                });
              }
            };
          };
        },
        { "./constants": 23, xtend: 21 }
      ]
    },
    {},
    [1]
  )(1);
});
