<template>
  <span></span>
</template>

<script>
import clonedeep from "lodash.clonedeep";
import withEvents from "../../../lib/withEvents";
import { deepEqual } from "../../util/util";
import { compareStyle } from "./MvtCompare";
import { DefaultThemeLayers } from "../ThemeLayer/BaseLayer";

import EventBusMapMixin from "../../../lib/eventbus/EventBusMapMixin";

export default {
  name: "mapgis-mvt-style-layer",
  mixins: [withEvents, EventBusMapMixin],
  inject: ["mapbox", "map"],

  props: {
    mvtStyle: {
      type: [String, Object],
      default: undefined
    },
    mode: {
      type: String,
      default: "merge" // add set merge
    },
    before: {
      type: String
    },
    removeForce: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      lastStyle: undefined,
      themeRules: []
    };
  },

  watch: {
    mvtStyle: {
      handler(next, old) {
        let deleteStyle = old;
        let { lastStyle } = this;
        if (!compareStyle(next, old)) {
          if (old && !lastStyle) {
            lastStyle = old; // mvt第一次外部传入改变
          }
          if (old && lastStyle) {
            // 后期多次外部修改mvt样式,这类情况一般是如下场景，
            // 外部同时使用了MVT组件和其他有修改mapbox样式能力的图层(ThemeLayer)
            // 初始化MVT组件的时候生成了样式StyleA,然后某个操作触发了ThemeLayer修改样式,
            // 导致了其他组件修改了mapbox的图层关系后产生的新的样式StyleB无法告诉mvt组件，
            // 而mvt组件仍然认为当前的样式是StyleA导致再维护的时候出现混乱的情况
            // 这类情况采取事件总线机制来维护协同组件间的样式关系
            if (!compareStyle(old, lastStyle)) {
            }
          }
          this.remove(deleteStyle);
          this.$_initStyle(this.mode, next);
          this.lastStyle = next;
        }
      },
      deep: true
    }
  },

  created() {
    this.$_deferredMount();
  },

  beforeDestroy() {
    this.remove(this.lastStyle);
  },

  methods: {
    $_deferredMount() {
      this.$_initStyle(this.mode, this.mvtStyle);
      this.initStyle = this.mvtStyle;
      this.initial = false;
    },

    async $_initStyle(mode, style) {
      let mvtStyle;
      if (!style) return;
      if (typeof style === "string") {
        mvtStyle = await this.$_getStyleObjectAsync(style);
      } else {
        mvtStyle = style;
      }
      mode = mode || this.mode;
      if (mode === "add" || mode === "merge") {
        this.$_addStyle(mvtStyle);
      } else if (mode == "set") {
        this.$_setStyle(mvtStyle);
      }
    },

    $_addStyle(mvtStyle, before) {
      before = before || this.before;
      let newStyle = this.compareStyle(mvtStyle);
      this.map.setStyle(newStyle, { diff: true });
      this.$_emitEvent("added", this);
    },

    $_setStyle(mvtStyle, before) {
      mvtStyle = mvtStyle || this.mvtStyle;
      before = before || this.before;
      this.map.setStyle(mvtStyle, { diff: true });
      this.$_emitEvent("added", this);
    },

    remove(oldStyle, removeForce) {
      removeForce = removeForce === undefined ? true : this.removeForce;
      let { map } = this;
      if (!oldStyle) return;
      let vm = this;
      const { layers, sources } = oldStyle;
      if (!layers || !map) return;
      /* let oldMapid = oldStyle.id;
      let newMapid = this.mvtStyle && this.mvtStyle.id ? this.mvtStyle.id : undefined; */
      let currentLayers = map.getStyle().layers;
      this.themeRules = [];
      layers.forEach(layer => {
        if (vm.map.getLayer(layer.id)) {
          // 下面地方的处理是针对专题图的显示隐藏特殊处理采取的保留专题图基本的信息前提下更新新的图层可见性
          let currentThemelayer = map
            .getStyle()
            .layers.find(l => l.id == layer.id);
          if (currentThemelayer) layer.paint = currentThemelayer.paint;
          if (removeForce) {
            vm.map.removeLayer(layer.id);
            let themes = currentLayers.filter(l => {
              let find = l.source == layer.source && vm.isThemeLayer(l.id);
              return find;
            });
            if (themes && themes.length > 0) {
              // 当前图层激活了专题图图层不能直接暴力删除,记录对应规则
              this.themeRules.push([].concat(layer).concat(themes));
            }
          } else {
            let others = currentLayers.filter(l => l.source == layer.source);
            if (others && others.length >= 2) {
              // 有其他图层同时引用同一个数据源，不删除数据
            } else {
              vm.map.removeLayer(layer.id);
            }
          }
        }
      });
      if (!sources) return;
      let lefts = this.map.getStyle().layers;

      Object.keys(sources).forEach(source => {
        if (vm.map.getSource(source)) {
          let finds = lefts.find(l => l.source == source);
          if (!finds) vm.map.removeSource(source);
        }
      });
    },

    compareStyle(mvtStyle) {
      let currentStyle = this.map.getStyle();
      let oldStyle = currentStyle;

      let newStyle = this.$_getStyleObject(mvtStyle);
      let newLayer = [];

      switch (this.mode) {
        case "add":
          newLayer = this.addLayers(oldStyle.layers, newStyle.layers);
          break;
        case "merge":
          newLayer = this.mergeLayers(oldStyle.layers, newStyle.layers);
          break;
      }

      let style = {
        version: oldStyle.version || newStyle.version,
        sprite: oldStyle.sprite || newStyle.sprite,
        glyphs: oldStyle.glyphs || newStyle.glyphs,
        sources: { ...oldStyle.sources, ...newStyle.sources },
        layers: newLayer
      };
      this.$emit('change-style', style);
      return style;
    },

    $_getStyleObject(mvtStyle) {
      return mvtStyle || this.mvtStyle;
    },

    async $_getStyleObjectAsync(mvtStyle) {
      let style = {};
      mvtStyle = mvtStyle || this.mvtStyle;
      let response = await fetch(mvtStyle);
      style = await response.json();
      return style;
    },

    addLayers(olds, news) {
      news = news || [];
      if (!olds) return [].concat(news);
      let filters = olds.filter(layer => {
        let find = news.find(l => l.id === layer.id);
        return find ? false : true;
      });
      return filters.concat(news);
    },

    mergeLayers(olds, news) {
      const vm = this;
      news = news || [];
      let themes = olds.filter(l => vm.isThemeLayer(l.id));
      olds = olds.filter(l => !vm.isThemeLayer(l.id));
      if (!olds) return [].concat(news);

      let merges = olds.reduce((total, layer, index, arr) => {
        let find = news.find(l => l.id == layer.id);
        let hasold = total.find(l => l.id == layer.id);
        if (find && !hasold) {
          return total.concat(find);
        } else {
          return total.concat(layer);
        }
      }, []);

      // 将未直接合并覆盖的图层重新根据原来的顺序进行插入
      let befores = news.map((u, i) => {
        u.before = i == news.length - 1 ? undefined : news[i + 1];
        if (i === news.length - 1) {
          u.before = undefined;
          if (i > 0) u.after = news[i - 1].id;
        } else {
          u.before = news[i + 1].id;
        }
        u.zindex = i;
        return u;
      });
      // 考虑 A-B-C-D D在之前已经被合并得情况
      let unmerges = befores.filter(layer => {
        let find = merges.find(l => l.id == layer.id);
        return find ? false : true;
      });
      // 考虑 A-B-C 内部的顺序问题  如实际调整为B-A-C
      // 主要是mapbox的机制只能办到addLayer({}, before), 所以只能按照before的顺序进行一个重新排序
      let reunmerges = [];
      const sort = clonedeep(unmerges);
      sort.forEach((layer, i) => {
        let { before, after } = layer;
        let index = -1;
        if (before) {
          index = this.findIndex(reunmerges, before);
          if (index >= 0) {
            this.addLayer(reunmerges, index, layer, "before");
          } else {
            let beforeLayer = unmerges.find(l => l.id == before);
            if (beforeLayer) {
              index = this.findIndex(reunmerges, layer.id);
              if (index >= 0) {
                this.addLayer(reunmerges, index, beforeLayer, "before");
              } else {
                this.addLayer(reunmerges, index, beforeLayer, "tail");
              }

              index = this.findIndex(reunmerges, before);
              if (index >= 0) {
                this.addLayer(reunmerges, index, layer, "after");
              } else {
                this.addLayer(reunmerges, index, layer, "tail");
              }
            }
          }
        } else if (after) {
          index = this.findIndex(reunmerges, after);
          this.addLayer(reunmerges, index, layer, "before");
        }
      });
      // 专题图逻辑
      // let hastheme = this.hasTheme(unmerges);
      let hastheme = this.hasTheme();
      if (this.hasTheme) {
        let themeRules = this.resortTheme(news);
        reunmerges = unmerges.reduce((total, layer) => {
          let theme = undefined;
          let beforetheme = undefined;
          let findtheme = false;
          themeRules.forEach(rules => {
            let findtheme = rules.find(r => r.id == layer.id);
            if (findtheme) {
              theme = findtheme;
              beforetheme = rules[0];
              let findorigin = total.find(l => l.id == beforetheme.id);
              if (!findorigin) {
                findtheme = true;
                let newbeforetheme = news.find(l => l.id == beforetheme.id);
                if (beforetheme) newbeforetheme.paint = beforetheme.paint || {};
                let themelayer = newbeforetheme || beforetheme;
                if (themelayer) total = total.concat(themelayer);
              }
            }
          });
          if (!findtheme) {
            if (!total.find(l => l.id == layer.id)) {
              total = total.concat(layer);
            }
          }
          return total;
        }, []);
      }

      let lefts = hastheme ? reunmerges : unmerges;
      let umsorts = lefts
        .filter((u, i) => {
          let index = -1;
          let { before, after } = u;
          if (before) {
            for (let j = 0; j < merges.length; j++) {
              if (merges[j].id == before) {
                index = j;
                break;
              }
            }
            if (index >= 0) {
              delete u.before;
              merges.splice(index, 0, u);
              return false;
            }
          } else if (!before && after) {
            return true;
          }
          return true;
        })
        .map(u => {
          delete u.before;
          delete u.after;
          return u;
        });
      let layers = merges.concat(umsorts);

      this.themeRules.forEach(rules => {
        for (let i = rules.length - 1; i > 0; i--) {
          let r = rules[i];
          let index = vm.findIndex(layers, rules[0].id);
          if (index >= 0) {
            vm.addLayer(layers, index, r, "after");
          } else {
            vm.addLayer(layers, index, r, "tail");
          }
        }
      });

      return layers;
    },

    isThemeLayer(name) {
      let isTheme = false;
      if (!name) return isTheme;
      DefaultThemeLayers.forEach(l => {
        if (name.indexOf(l) >= 0) {
          isTheme = true;
        }
      });
      return isTheme;
    },

    hasTheme(layers) {
      let has = false;
      this.themeRules.forEach(rules => {
        rules.forEach(r => {
          if (layers) {
            layers.forEach(l => {
              if (l.id == r.id) {
                if (r.theme || r.theme !== "none") {
                  has = true;
                }
              }
            });
          } else {
            if (r.theme || r.theme !== "none") {
              has = true;
            }
          }
        });
      });
      return has;
    },

    resortTheme(news) {
      let orders = news
        .filter(l => {
          return l.theme != undefined;
        })
        .map((l, i) => {
          l.zindex = i;
          return l;
        });
      let newRules = [];
      this.themeRules.forEach(rules => {
        if (rules.length > 0) {
          let find = orders.find(l => l.id == rules[0].id);
          if (find) {
            newRules[find.zindex] = rules;
          }
        }
      });
      this.themeRules = newRules;
      return newRules;
    },

    findIndex(arrs, id) {
      let index = -1;
      for (let j = 0; j < arrs.length; j++) {
        if (arrs[j].id == id) {
          index = j;
          break;
        }
      }
      return index;
    },

    addLayer(arrs, index, layer, mode = "before") {
      if (mode === "before") {
        if (!arrs.find(l => l.id == layer.id)) {
          arrs.splice(index, 0, layer);
        }
      } else if (mode === "after") {
        if (!arrs.find(l => l.id == layer.id)) {
          arrs.splice(index + 1, 0, layer);
        }
      } else {
        if (!arrs.find(l => l.id == layer.id)) {
          arrs.push(layer);
        }
      }
    },

    $_handleMapAddLayer(payload) {},

    $_handleMapRemoveLayer(payload) {}
  }
};
</script>
