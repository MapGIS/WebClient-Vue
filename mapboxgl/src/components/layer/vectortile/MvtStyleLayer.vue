<template>
  <span></span>
</template>

<script>
import clonedeep from "lodash.clonedeep";
import withEvents from "../../../lib/withEvents";
import { compareStyle } from "./MvtCompare";
import { DefaultThemeLayers } from "../ThemeLayer/BaseLayer";

import EventBusMapMixin from "../../../lib/eventbus/EventBusMapMixin";
import {
  IGSVectorTileLayer,
  Projection,
  TileInfoUtil,
} from "@mapgis/webclient-common";
import {
  mapboxCustomCRS,
  initializeOptions,
} from "@mapgis/webclient-mapboxgl-plugin";

export default {
  name: "mapgis-mvt-style-layer",
  mixins: [withEvents, EventBusMapMixin],
  inject: ["mapbox", "map"],

  props: {
    mvtStyle: {
      type: [String, Object],
      default: undefined,
    },
    mode: {
      type: String,
      default: "merge", // add set merge
    },
    before: {
      type: String,
    },
    removeForce: {
      type: Boolean,
      default: true,
    },
    minimumLevel: {
      type: Number,
      default: 0,
    },
    maximumLevel: {
      type: Number,
      default: 22,
    },
    token: { Object },
    /**
     * webclient-common库的Layer对象，用于构造MapBox引擎的图层对象
     */
    commonLayer: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      themeRules: [],
      preBefore: undefined,
      // 用于保存mapbox样式图层的id
      layerIdBack: null,
      // 用于保存mapbox的source的id
      sourceIdBack: null,
      // 用于保存mapbox的source对象
      sourceBack: null,
      // 是否是第一次通过传入common图层的方式加载图层
      isFirstAddLayer: false,
    };
  },

  watch: {
    mvtStyle: {
      handler(next, old) {
        // 当commonLayer存在时，使用commonLayer构造图层，否则按照原始逻辑构造图层
        if (this.commonLayer) {
          return;
        }
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
          this.lastStyle = clonedeep(next);
          this.$_initStyle(this.mode, this.lastStyle);
        } else {
          // 防止被底图覆盖
          if (this.before && this.preBefore !== this.before) {
            this.remove(deleteStyle);
            this.$_initStyle(this.mode, this.lastStyle);
            this.preBefore = this.before;
          }
        }
      },
      deep: true,
      immediate: true,
    },
    commonLayer: {
      handler: function (newLayer, oldLayer) {
        this.lastStyle = clonedeep(newLayer._style);
        // 是否重新加载图层
        let reloadLayer = true;
        // 更改透明度或者显隐参数，不重新加载图层
        if (this.isFirstAddLayer) {
          if (
            JSON.stringify(newLayer._style.layers) !==
            JSON.stringify(oldLayer._style.layers)
          ) {
            reloadLayer = false;
            this.lastStyle.layers.forEach((styleLayer) => {
              const paintKeys = Object.keys(styleLayer.paint);
              paintKeys.forEach((key) => {
                this.map.setPaintProperty(
                  styleLayer.id,
                  key,
                  styleLayer.paint[key]
                );
              });
              const layoutKeys = Object.keys(styleLayer.layout);
              layoutKeys.forEach((key) => {
                this.map.setLayoutProperty(
                  styleLayer.id,
                  key,
                  styleLayer.layout[key]
                );
              });
            });
          }
        }
        // 重新加载图层
        const self = this;
        this.$nextTick(() => {
          if (reloadLayer) {
            if (!self.isFirstAddLayer) {
              self.$_deferredMountByCommonLayer();
              self.isFirstAddLayer = true;
            } else {
              const oldLayerJSON = oldLayer.toJSON();
              const newLayerJSON = newLayer.toJSON();
              try {
                if (
                  JSON.stringify(oldLayerJSON) !== JSON.stringify(newLayerJSON)
                ) {
                  self.$_deferredMountByCommonLayer();
                }
              } catch (error) {
                self.$_deferredMountByCommonLayer();
              }
            }
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },

  created() {
    this.CRS = mapboxCustomCRS(this.mapbox, Projection);
    // this.$_deferredMount();
  },

  beforeDestroy() {
    this.remove(this.lastStyle);
  },

  methods: {
    $_deferredMount() {
      this.$_initStyle(this.mode, this.mvtStyle);
      this.initStyle = this.mvtStyle;
      this.initial = false;
      if (typeof this.mvtStyle === "object") {
        this.lastStyle = clonedeep(this.mvtStyle);
      }
    },

    async $_initStyle(mode, style) {
      let mvtStyle;
      if (!style) return;
      if (typeof style === "string") {
        mvtStyle = await this.$_getStyleObjectAsync(style);
      } else {
        mvtStyle = style;
      }
      // 支持自定义裁图的IGS矢量瓦片
      // 矢量瓦片裁剪后会生成“*_metadata.json”文件，
      // 其中"projType": 1表示老版经纬度，"projType": 0代表老版web墨卡托。"projType": 2表示自定义。
      // 目前Desktop界面上主推2。界面上经纬度和web墨卡托只是给了一套标准裁剪参数的2（自定义）。2的裁剪原点和比例尺用户自定义程度特别灵活的
      // 龚跃健-20250508
      this.projType = mvtStyle.projType;
      if (this.projType == 2) {
        const { sources } = mvtStyle;
        this.sourcekeys = Object.keys(sources);
        for (let i = 0; i < this.sourcekeys.length; i++) {
          const source = sources[this.sourcekeys[i]];
          const { tiles } = source;
          if (tiles && tiles.length && tiles[0].includes("/igs/")) {
            const serviceUrl = tiles[0].split("/tiles/")[0];
            const commonLayer = new IGSVectorTileLayer({
              // 服务基地址
              url: serviceUrl,
            });
            // 加载图层元数据
            await commonLayer.load();
            const { tileInfo, extent } = commonLayer;
            const { spatialReference, size, lods, origin } = tileInfo;
            const { wkid, wkt } = spatialReference;
            const resolutions = {};
            lods.forEach((lod, index) => {
              resolutions[index] = lod.resolution;
            });
            this.customCrs = new this.CRS(`EPSG:${wkid}`, wkt, {
              resolutions,
              origin: [origin.coordinates[0], origin.coordinates[1]],
              tileSize: Math.max(size[0], size[1]),
              bounds: [extent.xmin, extent.ymin, extent.xmax, extent.ymax],
              unit: spatialReference.isGeographic ? "degree" : undefined,
            });
            source.crs = this.customCrs;
          }
        }
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
      this.$_updateStyle();
      this.$_emitEvent("added", this);
    },

    $_setStyle(mvtStyle, before) {
      mvtStyle = mvtStyle || clonedeep(this.mvtStyle);
      before = before || this.before;
      this.map.setStyle(mvtStyle, { diff: true });
      this.$_updateStyle();
      this.$_emitEvent("added", this);
    },

    $_updateStyle() {
      // 非自定义裁图的暂时不处理
      if (!this.projType == 2) {
        return;
      }
      const { map, sourcekeys, customCrs, customLayers } = this;
      let mapLoadedInterval;
      const resetSourceCustomCrs = () => {
        // 更新map.style.sourceCaches上的crs,第二次加载会被map上的crs覆盖，这里需要重置一下
        if (this.sourcekeys && this.sourcekeys.length && customCrs) {
          for (let i = 0; i < this.sourcekeys.length; i++) {
            if (map.style.sourceCaches[this.sourcekeys[i]]) {
              map.style.sourceCaches[this.sourcekeys[i]].crs = customCrs;
              map._update(true);
            }
          }
        }
        const { _order } = map.style;
        if (customLayers && customLayers.length) {
          customLayers.forEach((item) => {
            const { layer, afterId } = item;
            let { beforeId } = item;
            if (!beforeId) {
              // 如果没有beforeId，这招afterId的beforeId作为beforeId
              if (afterId) {
                const afterLayerIndex = _order.indexOf(afterId);
                if (afterLayerIndex) {
                  beforeId = _order[afterLayerIndex + 1];
                }
              }
            }

            if (beforeId) {
              map.addLayer(layer.implementation, beforeId);
            } else {
              map.addLayer(layer.implementation);
            }
          });
        }
        if (mapLoadedInterval) {
          clearInterval(mapLoadedInterval);
        }
      };
      if (map.loaded()) {
        resetSourceCustomCrs();
      } else {
        mapLoadedInterval = setInterval(() => {
          if (map.loaded()) {
            resetSourceCustomCrs();
          }
        }, 1000);
      }
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
      layers.forEach((layer) => {
        if (vm.map.getLayer(layer.id)) {
          // 下面地方的处理是针对专题图的显示隐藏特殊处理采取的保留专题图基本的信息前提下更新新的图层可见性
          // let currentThemelayer = map
          //   .getStyle()
          //   .layers.find((l) => l.id == layer.id);
          // if (currentThemelayer) layer.paint = currentThemelayer.paint;
          if (removeForce) {
            vm.map.removeLayer(layer.id);
            // let themes = currentLayers.filter((l) => {
            //   let find = l.source == layer.source && vm.isThemeLayer(l.id);
            //   return find;
            // });
            // if (themes && themes.length > 0) {
            //   // 当前图层激活了专题图图层不能直接暴力删除,记录对应规则
            //   this.themeRules.push([].concat(layer).concat(themes));
            // }
          } else {
            let others = currentLayers.filter((l) => l.source == layer.source);
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

      Object.keys(sources).forEach((source) => {
        if (vm.map.getSource(source)) {
          // let finds = lefts.find((l) => l.source == source);
          // if (!finds) vm.map.removeSource(source);
          vm.map.removeSource(source);
        }
      });
    },

    compareStyle(mvtStyle) {
      this.customLayers = this.$_getCustomLayers();

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
      const self = this;
      // 如果样式文件中，paint为null，则mapboxgl会报错，这里给个默认值
      const layers = newLayer.map((item) => {
        if (!item.paint) {
          item.paint = {};
        }
        if (item.minzoom !== undefined && item.minzoom < self.minimumLevel) {
          item.minzoom = self.minimumLevel;
        }
        if (item.maxzoom !== undefined && item.maxzoom > self.maximumLevel) {
          item.maxzoom = self.maximumLevel;
        }
        return item;
      });

      // 修改说明：glyphs优先使用传入的style上的参数，防止字符不识别
      // 修改人：龚跃健-20241213
      let style = {
        version: oldStyle.version || newStyle.version,
        sprite: oldStyle.sprite || newStyle.sprite,
        glyphs: newStyle.glyphs || oldStyle.glyphs,
        sources: {
          ...oldStyle.sources,
          ...this.getNewLayerSources(newStyle.sources),
        },
        layers: layers,
      };
      const { token } = this;
      if (token.key && token.value) {
        style.glyphs += `&${token.key}=${token.value}`;
        style.sprite += `&${token.key}=${token.value}`;
      }
      // 修改说明：先强制删除draw上面的crs,不然加载会报无法识别crs参数的错误
      // 修改人：龚跃健-20241213
      delete style.sources["mapbox-gl-draw-cold"].crs;
      delete style.sources["mapbox-gl-draw-hot"].crs;
      this.$emit("change-style", style);
      return style;
    },
    /**
     * @description 获取customLayer集合，包含前后图层id
     */
    $_getCustomLayers() {
      let customLayers = [];
      const { _layers, _order } = this.map.style;
      const keys = Object.keys(_layers);
      keys.forEach((key) => {
        const layer = _layers[key];
        if (layer.type === "custom") {
          const { id } = layer;
          // 找到customLayer在_order里的位置
          const index = _order.indexOf(id);
          // 找到beforeId
          let beforeId;
          let afterId;
          if (index && index < length - 1) {
            beforeId = _order[index + 1];
          }
          if (index && index > 0) {
            afterId = _order[index - 1];
          }
          customLayers.push({
            layer,
            beforeId,
            afterId,
          });
        }
      });
      return customLayers;
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
      let filters = olds.filter((layer) => {
        let find = news.find((l) => l.id === layer.id);
        return find ? false : true;
      });
      return filters.concat(news);
    },

    mergeLayers(olds, news) {
      const vm = this;
      news = news || [];
      let themes = olds.filter((l) => vm.isThemeLayer(l.id));
      olds = olds.filter((l) => !vm.isThemeLayer(l.id));
      if (!olds) return [].concat(news);

      let merges = olds.reduce((total, layer, index, arr) => {
        let find = news.find((l) => l.id == layer.id);
        let hasold = total.find((l) => l.id == layer.id);
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
      let unmerges = befores.filter((layer) => {
        let find = merges.find((l) => l.id == layer.id);
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
            let beforeLayer = unmerges.find((l) => l.id == before);
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
          themeRules.forEach((rules) => {
            let findtheme = rules.find((r) => r.id == layer.id);
            if (findtheme) {
              theme = findtheme;
              beforetheme = rules[0];
              let findorigin = total.find((l) => l.id == beforetheme.id);
              if (!findorigin) {
                findtheme = true;
                let newbeforetheme = news.find((l) => l.id == beforetheme.id);
                if (beforetheme) newbeforetheme.paint = beforetheme.paint || {};
                let themelayer = newbeforetheme || beforetheme;
                if (themelayer) total = total.concat(themelayer);
              }
            }
          });
          if (!findtheme) {
            if (!total.find((l) => l.id == layer.id)) {
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
        .map((u) => {
          delete u.before;
          delete u.after;
          return u;
        });
      let layers = merges.concat(umsorts);

      this.themeRules.forEach((rules) => {
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
      DefaultThemeLayers.forEach((l) => {
        if (name.indexOf(l) >= 0) {
          isTheme = true;
        }
      });
      return isTheme;
    },

    hasTheme(layers) {
      let has = false;
      this.themeRules.forEach((rules) => {
        rules.forEach((r) => {
          if (layers) {
            layers.forEach((l) => {
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
        .filter((l) => {
          return l.theme != undefined;
        })
        .map((l, i) => {
          l.zindex = i;
          return l;
        });
      let newRules = [];
      this.themeRules.forEach((rules) => {
        if (rules.length > 0) {
          let find = orders.find((l) => l.id == rules[0].id);
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
        if (!arrs.find((l) => l.id == layer.id)) {
          arrs.splice(index, 0, layer);
        }
      } else if (mode === "after") {
        if (!arrs.find((l) => l.id == layer.id)) {
          arrs.splice(index + 1, 0, layer);
        }
      } else {
        if (!arrs.find((l) => l.id == layer.id)) {
          arrs.push(layer);
        }
      }
    },

    $_handleMapAddLayer(payload) {},

    $_handleMapRemoveLayer(payload) {},

    getNewLayerSources(sources) {
      const newSources = { ...sources };
      if (Object.keys(newSources).length > 0) {
        Object.keys(newSources).forEach((item) => {
          const source = newSources[item];
          if (source.tiles) {
            source.tiles = this.setToken(source.tiles);
          }
        });
      }
      return newSources;
    },
    setToken(tiles) {
      const { token } = this;
      const newTiles = [];
      tiles.forEach((item) => {
        const url = new URL(item);
        const { search } = url;
        if (token.value) {
          newTiles.push(
            search
              ? item + `&${token.key}=${token.value}`
              : item + `?${token.key}=${token.value}`
          );
        } else {
          newTiles.push(item);
        }
      });
      return newTiles;
    },
    /**
     * 通过webclient-common的layer来构造并添加mapboxgl的图层
     */
    $_deferredMountByCommonLayer() {
      const { commonLayer } = this;
      if (commonLayer) {
        this.remove(this.lastStyle);
        const mapboxglOptions = initializeOptions(commonLayer);
        const { layers, sources } = mapboxglOptions;
        this.lastStyle = clonedeep(mapboxglOptions);
        const tileInfo = TileInfoUtil.getTileInfoByLayer(commonLayer);
        const { minScale, maxScale } = commonLayer;
        const sourcesArr = Object.entries(sources);
        for (let i = 0; i < sourcesArr.length; i++) {
          const sourceArr = sourcesArr[i];
          this.map.addSource(sourceArr[0], sourceArr[1]);
        }
        for (let j = 0; j < layers.length; j++) {
          if (this.before) {
            this.map.addLayer(layers[j], this.before);
          } else {
            this.map.addLayer(layers[j]);
          }
        }
      }
    },
  },
};
</script>
