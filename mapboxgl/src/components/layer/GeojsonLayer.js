import mapboxgl from "@mapgis/mapbox-gl";
import { Style } from "@mapgis/webclient-es6-service";

import layerEvents from "../../lib/layerEvents";
import mixin from "./layerMixin";
import clonedeep from "lodash.clonedeep";
const Inspect = require("@mapgis/mapbox-gl-inspect");
const MapboxInspect = Inspect.default;
import Popup from "./geojson/Popup";

const { MarkerStyle, LineStyle, PointStyle, FillStyle } = Style;

export default {
  name: "mapgis-geojson-layer",
  mixins: [mixin],
  components: { Popup },
  inject: ["map", "mapbox"],
  data() {
    return {
      currentToolInfo: "",
      userProsChecked: [],
      inspectActive: false,
      currentNum: "",
      currentClickInfo: [],
      currentHoverInfo: [],
      popupTitle: "id",
      hoveredStateId: -1,
      clickMode: "click",
      hoverMode: "hover"
    };
  },
  props: {
    data: {
      type: [String, Object]
    },
    enablePopup: {
      type: Boolean,
      defalut: false
    },
    popupOptions: {
      type: Object,
      default: () => {
        return { title: "name" };
      }
    },
    enableTips: {
      type: Boolean,
      defalut: false
    },
    tipsOptions: {
      type: Object,
      default: () => {
        return { title: "name" };
      }
    },
    /**
     * 当前图层的显示样式
     */
    layerStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     * 当前图层的高亮样式
     */
    highlightStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    /**
     *  自定义Popup界面,JSX语法Function(features) { return <div>自定义元素 {features[0]}</div>}
     */
    customPopup: Function,
    /**
     *  自定义Tips界面,JSX语法Function(features) { return <div>自定义元素 {features[0]}</div>}
     */
    customTips: Function
  },
  computed: {
    getSourceFeatures() {
      return filter => {
        if (this.map) {
          return this.map.querySourceFeatures(this.sourceId || this.layerId, {
            filter
          });
        }
        return null;
      };
    },

    getRenderedFeatures() {
      return (geometry, filter) => {
        if (this.map) {
          return this.map.queryRenderedFeatures(geometry, {
            layers: [this.layerId],
            filter
          });
        }
        return null;
      };
    },

    getClusterExpansionZoom() {
      return clusterId => {
        return new Promise((resolve, reject) => {
          if (this.mapSource) {
            this.mapSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
              if (err) {
                return reject(err);
              }
              return resolve(zoom);
            });
          } else {
            return reject(
              new Error(
                `Map source with id ${this.sourceId || this.layerId} not found.`
              )
            );
          }
        });
      };
    },

    getClusterChildren() {
      return clusterId => {
        return new Promise((resolve, reject) => {
          const source = this.mapSource;
          if (source) {
            source.getClusterChildren(clusterId, (err, features) => {
              if (err) {
                return reject(err);
              }
              return resolve(features);
            });
          } else {
            return reject(
              new Error(
                `Map source with id ${this.sourceId || this.layerId} not found.`
              )
            );
          }
        });
      };
    },

    getClusterLeaves() {
      return (...args) => {
        return new Promise((resolve, reject) => {
          if (this.mapSource) {
            this.mapSource.getClusterLeaves(...args, (err, features) => {
              if (err) {
                return reject(err);
              }
              return resolve(features);
            });
          } else {
            return reject(
              new Error(
                `Map source with id ${this.sourceId || this.layerId} not found.`
              )
            );
          }
        });
      };
    }
  },

  created() {
    if (this.data) {
      this.$watch(
        () => this.data,
        function(next) {
          if (this.initial) return;
          this.mapSource.setData(next);
        },
        { deep: true }
      );
    }
    this.$_deferredMount();
  },

  render(h) {
    let {
      customPopup,
      customTips,
      clickMode,
      hoverMode,
      currentClickInfo,
      currentHoverInfo
    } = this;

    if (customPopup || customTips) {
      return (
        <div class="mapgis-geojson-custom-wrapper">
          <div ref="click">
            {customPopup && customPopup(currentClickInfo)}
            {!customPopup && (
              <Popup
                ref="click"
                mode={clickMode}
                currentLayerInfo={currentClickInfo}
              ></Popup>
            )}
          </div>
          <div ref="hover">
            {customTips && customTips(currentHoverInfo)}
            {!customTips && (
              <Popup
                ref="hover"
                mode={hoverMode}
                currentLayerInfo={currentHoverInfo}
              ></Popup>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div class="mapgis-geojson-default-wrapper">
          <Popup
            ref="click"
            mode={clickMode}
            currentLayerInfo={currentClickInfo}
          ></Popup>
          <Popup
            ref="hover"
            mode={hoverMode}
            currentLayerInfo={currentHoverInfo}
          ></Popup>
        </div>
      );
    }
  },

  methods: {
    $_deferredMount() {
      let { map, mapbox } = this;
      this.map.on("dataloading", this.$_watchSourceLoading);
      let source;
      if (this.data) {
        source = {
          type: "geojson",
          data: this.data
        };
      } else if (this.source) {
        source = {
          type: "geojson",
          ...this.source
        };
      }
      if (this.enablePopup) {
        source.generateId = true;
      }
      try {
        this.map.addSource(this.sourceId || this.layerId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId || this.layerId);
          this.map.addSource(this.sourceId || this.layerId, source);
        }
      }
      this.$_addLayer();
      this.$_addhoverLayer();

      this.$_bindLayerEvents(layerEvents);
      this.map.off("dataloading", this.$_watchSourceLoading);
      this.initial = false;

      let popup = new mapbox.Popup({
        closeButton: true,
        closeOnClick: false
      });
      //添加map click/mousemove事件
      if (this.enablePopup) {
        this.$_addPopupEvents();
        this.$_bindHightLayerEvent();
      }
      if (this.enableTips) {
        this.$_addMousemoveEvents(popup);
      }
    },

    $_addLayer() {
      const { layerId, sourceId, layer, map, replace, layerStyle } = this;
      const { type } = layerStyle;
      let existed = map.getLayer(layerId);
      if (existed) {
        if (replace) {
          map.removeLayer(layerId);
        } else {
          this.$_emitEvent("layer-exists", { layerId: layerId });
          return existed;
        }
      }
      let style;
      if (Object.keys(layer).length == 0) {
        if (type == "point") {
          style = {
            type: "circle",
            ...layerStyle.toMapboxStyle()
          };
        } else if (type == "line") {
          style = {
            type: "line",
            ...layerStyle.toMapboxStyle()
          };
        } else if (type == "fill") {
          style = {
            type: "fill",
            ...layerStyle.toMapboxStyle()
          };
        }
      } else {
        style = layer;
      }
      let addlayer = {
        id: this.layerId,
        source: this.sourceId || this.layerId,
        ...style
      };
      this.map.addLayer(addlayer, this.before);
      this.$_emitEvent("added", { layerId: this.layerId });
    },

    setFeatureState(featureId, state) {
      if (this.map) {
        const params = { id: featureId, source: this.source };
        return this.map.setFeatureState(params, state);
      }
    },

    getFeatureState(featureId) {
      if (this.map) {
        const params = { id: featureId, source: this.source };
        return this.map.getFeatureState(params);
      }
    },

    removeFeatureState(featureId, sourceLayer, key) {
      if (this.map) {
        const params = {
          id: featureId,
          source: this.source,
          sourceLayer
        };
        return this.map.removeFeatureState(params, key);
      }
    },
    $_addMousemoveEvents(popup) {
      let vm = this;
      let { map } = this;
      map.on("mousemove", vm.layerId, function(e) {
        if (e.features.length > 0) {
          let fs = clonedeep(e.features);
          if (vm.tipsOptions) {
            let newfeatrues;
            newfeatrues = fs.map(f => {
              let properties = f.properties;
              f.properties = {};
              //  赋值fields
              let fields = vm.tipsOptions.fields;
              if (!fields) {
                f.properties = {};
              } else {
                fields.forEach(field => {
                  f.properties[field] = properties[field];
                });
              }
              //  赋值title
              let titlefield = vm.tipsOptions.title;
              if (titlefield) {
                f.title = properties[titlefield];
              } else {
                // f.title = "";
              }
              return f;
            });
            vm.currentHoverInfo = [newfeatrues[0]];
          }
          popup
            .setLngLat(e.lngLat)
            .setDOMContent(vm.$refs.hover.$el || vm.$refs.hover)
            .addTo(map);
        }
      });
      map.on("mouseleave", vm.layerId, function() {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    },
    $_addPopupEvents() {
      let { map } = this;
      let vm = this;
      if (!map || !map.getStyle()) {
        return;
      }
      if (
        this.$parent.popupInspect == null &&
        this.$parent.popupInspect === undefined
      ) {
        const inspect = new MapboxInspect({
          popup: new mapboxgl.Popup({
            closeOnClick: false,
            closeButton: true
          }),
          // showInspectMap: true,
          showMapPopup: vm.enablePopup,
          showMapPopupOnHover: false,
          showInspectMapPopupOnHover: false,
          showInspectButton: false,
          blockHoverPopupOnClick: true,
          queryParameters: {
            layers: [this.layerId]
          },
          // buildInspectStyle: (originalMapStyle, coloredLayers) =>
          //     vm.buildInspectStyle(originalMapStyle, coloredLayers, "", vm),
          renderPopup: features => {
            let fs = clonedeep(features);
            let parentPopupLayers = this.$parent.popupLayers;
            let newfeatrues;
            // 针对属性进行过滤显示
            let layerIds = Object.keys(parentPopupLayers);
            newfeatrues = fs.map(f => {
              if (parentPopupLayers.hasOwnProperty(f.layer.id)) {
                let properties = f.properties;
                f.properties = {};
                //  赋值fields
                let fields = parentPopupLayers[f.layer.id].fields;
                if (!fields) {
                  f.properties = properties;
                } else {
                  fields.forEach(field => {
                    f.properties[field] = properties[field];
                  });
                }
                //  赋值title
                let titlefield = parentPopupLayers[f.layer.id].title;
                if (titlefield) {
                  f.title = properties[titlefield];
                } else {
                  // f.title = "";
                }
              }
              return f;
            });
            // 针对高亮进行过滤显示
            // vm.highlightLayer(newfeatrues);
            vm.currentClickInfo = newfeatrues;
            return vm.$refs.click.$el || vm.$refs.click;
          }
        });
        map.addControl(inspect);
        this.$parent.popupInspect = inspect;
      } else {
        //排除重复layerID
        let inspect = this.$parent.popupInspect;
        let originQueryParameters = inspect.options.queryParameters;
        if (originQueryParameters.layers.indexOf(this.layerId) === -1) {
          inspect.options.queryParameters.layers.push(this.layerId);
        }
      }
      if (this.popupOptions) {
        this.$parent.popupLayers = this.$parent.popupLayers || {};
        if (this.$parent.popupLayers) {
          if (this.$parent.popupLayers.hasOwnProperty(vm.layerId)) {
            this.$parent.popupLayers[vm.layerId] = this.popupOptions;
          } else {
            this.$parent.popupLayers[vm.layerId] = this.popupOptions;
          }
        }
      }
    },
    changePane(key) {
      let vm = this;
      let checkedLayer;
      for (let i = 0; i < vm.currentClickInfo.length; i++) {
        if (key === i) {
          checkedLayer = vm.currentClickInfo[i];
        }
      }
      this.$emit("select-layer", checkedLayer);
    },
    $_bindHightLayerEvent() {
      const vm = this;
      let { map } = this;
      map.on("click", this.layerId, function(e) {
        if (e.features.length > 0) {
          if (vm.hoveredStateId !== null) {
            map.setFeatureState(
              { source: vm.sourceId || vm.layerId, id: vm.hoveredStateId },
              { hover: false }
            );
          }
          vm.hoveredStateId = e.features[0].id;
          map.setFeatureState(
            { source: vm.sourceId || vm.layerId, id: vm.hoveredStateId },
            { hover: true }
          );
        }
      });
    },
    $_addhoverLayer() {
      let highlight;
      let { map, layer, layerId, sourceId, highlightStyle } = this;
      sourceId = sourceId || layerId;
      const { type, point, line, polygon } = highlightStyle;
      if (Object.keys(layer).length == 0) {
        if (type == "point" || point) {
          if (!point) return;
          highlight = {
            id: layerId + "_高亮边界线",
            type: "circle",
            source: sourceId,
            ...point.toMapboxStyle({ highlight: true })
          };
        } else if (type == "line" || line) {
          if (!line) return;
          highlight = {
            id: layerId + "_高亮边界线",
            type: "line",
            source: sourceId,
            ...line.toMapboxStyle({ highlight: true })
          };
        } else if (type == "polygon" || polygon) {
          if (!polygon) return;
          highlight = {
            id: layerId + "_高亮边界线",
            type: "fill",
            source: sourceId,
            ...polygon.toMapboxStyle({ highlight: true })
          };
        }
        if (!map.getLayer(highlight.id)) map.addLayer(highlight);
      } else {
        if (this.layer.type === "fill") {
          if (!line) return;
          highlight = {
            id: layerId + "_高亮边界线",
            type: "line",
            source: sourceId,
            ...line.toMapboxStyle({ highlight: true })
          };
        } else if (this.layer.type === "line") {
          if (!line) return;
          highlight = {
            id: layerId + "_高亮边界线",
            type: "line",
            source: sourceId,
            ...line.toMapboxStyle({ highlight: true })
          };
        } else if (this.layer.type === "circle") {
          if (!point) return;
          highlight = {
            id: layerId + "_高亮边界线",
            type: "circle",
            source: sourceId,
            ...point.toMapboxStyle({ highlight: true })
          };
        }
        if (!map.getLayer(highlight.id)) map.addLayer(highlight);
      }
    }
  }
};
