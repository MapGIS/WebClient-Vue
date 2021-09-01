<template>
  <div>
<!--    <slot name="click">-->
      <GeojsonPopup
          ref="click"
          :mode="clickMode"
          :currentLayerInfo="currentClickInfo">
      </GeojsonPopup>
<!--    </slot>-->
<!--    <slot name="hover">-->
      <GeojsonPopup
          ref="hover"
          :mode="hoverMode"
          :currentLayerInfo="currentHoverInfo">
      </GeojsonPopup>
<!--    </slot>-->
  </div>
</template>

<script>
import layerEvents from "../../lib/layerEvents";
import mixin from "./layerMixin";
import mapboxgl from "@mapgis/mapbox-gl";
import clonedeep from 'lodash.clonedeep';
const MapboxInspect = require("mapbox-gl-inspect");
import GeojsonPopup from './geojson/Popup';

export default {
  name: "mapgis-geojson-layer",
  mixins: [mixin],
  components: {GeojsonPopup},
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
      hoveredStateId : -1,
      clickMode: 'click',
      hoverMode: 'hover',
    }
  },
  props: {
    data:{
      type: [String,Object]
    },
    enablePopup: {
      type: Boolean,
      defalut: false
    },
    popupOptions: {
      type: Object
    },
    enableTips: {
      type: Boolean,
      defalut: false
    },
    //tipsOptions : {
    //    title : "",
    //     fields: []
    //
    // }
    tipsOptions: {
      type: Object
    }
  },
  computed: {
    getSourceFeatures() {
      return filter => {
        if (this.map) {
          return this.map.querySourceFeatures(this.sourceId, {filter});
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
                new Error(`Map source with id ${this.sourceId} not found.`)
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
                new Error(`Map source with id ${this.sourceId} not found.`)
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
                new Error(`Map source with id ${this.sourceId} not found.`)
            );
          }
        });
      };
    }
  },

  created() {
    if (this.data) {
      this.$watch(
          ()=> this.data,
          function (next) {
            if (this.initial) return;
            this.mapSource.setData(next);
          },
          {deep: true}
      );
    }
    this.$_deferredMount();
  },

  methods: {
    $_deferredMount() {
      let {map, mapbox} = this;
      this.map.on("dataloading", this.$_watchSourceLoading);
      let source;
      if (this.data) {
        source = {
          type: "geojson",
          data: this.data
        }
      } else if (this.source) {
        source = {
          type: "geojson",
          ...this.source
        };
        if (this.enablePopup) {
          source.generateId = true;
        }
      }
      try {
        this.map.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId);
          this.map.addSource(this.sourceId, source);
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
      let existed = this.map.getLayer(this.layerId);
      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent("layer-exists", {layerId: this.layerId});
          return existed;
        }
      }
      const layer = {
        id: this.layerId,
        source: this.sourceId,
        ...this.layer
      };
      this.map.addLayer(layer, this.before);
      this.$_emitEvent("added", {layerId: this.layerId});
    },

    setFeatureState(featureId, state) {
      if (this.map) {
        const params = {id: featureId, source: this.source};
        return this.map.setFeatureState(params, state);
      }
    },

    getFeatureState(featureId) {
      if (this.map) {
        const params = {id: featureId, source: this.source};
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
      let {map} = this;
      map.on('mousemove', vm.layerId, function (e) {
        if (e.features.length > 0) {
          let fs = clonedeep(e.features);
          if (vm.tipsOptions) {
            let newfeatrues;
            newfeatrues = fs.map((f)=>{
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
          popup.setLngLat(e.lngLat)
              .setDOMContent(vm.$refs.hover.$el)
              .addTo(map);
        }
      });
      map.on('mouseleave', vm.layerId, function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    },
    $_addPopupEvents() {
      let {map} = this;
      let vm = this;
      if (!map || !map.getStyle()) {
        return;
      }
      if (this.$parent.popupInspect == null && this.$parent.popupInspect === undefined) {
        const inspect = new MapboxInspect({
          popup: new mapboxgl.Popup({
            closeOnClick: true,
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
            newfeatrues = fs.map((f) => {
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
            return vm.$refs.click.$el;
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
      let {map} = this;
      map.on('click', this.layerId, function (e) {
        if (e.features.length > 0) {
          if (vm.hoveredStateId !== null) {
            map.setFeatureState(
                {source: vm.sourceId, id: vm.hoveredStateId},
                {hover: false}
            );
          }
          vm.hoveredStateId = e.features[0].id;
          map.setFeatureState(
              {source: vm.sourceId, id: vm.hoveredStateId},
              {hover: true}
          );
        }
      });

    },
    $_addhoverLayer() {
      let highlight;
      let {map} = this;
      if (this.layer.type === 'fill') {
        highlight = {
          id: this.layerId + "_高亮边界线",
          type: 'line',
          source: this.sourceId,
          paint: {
            "line-color": '#00ffff',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              2,
              0
            ]
          }
        }
      } else if (this.layer.type === 'line') {
        highlight = {
          id: this.layerId + "_高亮边界线",
          type: 'line',
          source: this.sourceId,
          paint: {
            "line-color": '#00ffff',
            'line-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              2,
              0
            ]
          }
        }
      } else if (this.layer.type === 'circle') {
        let circleRadius;
        if (this.layer && this.layer.paint && this.layer.paint["circle-radius"]) {
          circleRadius = this.layer.paint["circle-radius"] + 4;
        } else {
          circleRadius = 6 + 4;
        }

        highlight = {
          id: this.layerId + "_高亮边界线",
          type: 'circle',
          source: this.sourceId,
          paint: {
            "circle-color": "rgba(0, 0, 0, 0)",
            "circle-radius": circleRadius,
            "circle-stroke-color": '#00ffff',
            'circle-stroke-width': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              2,
              0
            ]
          }
        }
      }

      if (!map.getLayer(highlight.id)) map.addLayer(highlight);
    }
  }
};
</script>