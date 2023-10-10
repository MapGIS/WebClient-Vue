<template>
  <div>
    <!-- slot for toolbar -->
    <slot name="toolbar" />
    <!-- slot for toolbar-item -->
    <slot v-if="editor" />
    <div class="mapgis-edit-control" v-if="enableControl">
      <mapgis-ui-div>
        <span class="mapgis-edit-control-show" @click="toggleFeature">
          <mapgis-ui-iconfont type="mapgis-edit-square" />
        </span>
        <mapgis-ui-tabs :size="size">
          <mapgis-ui-tab-pane key="geometry" tab="几何">
            <mapgis-ui-jsoneditor
              class="mapgis-edit-control-geometry"
              :value="geometry"
              :options="jsonOptions"
              :plus="false"
              height="320px"
              @error="onJsonError"
            />
          </mapgis-ui-tab-pane>
          <mapgis-ui-tab-pane key="properties" tab="属性">
            <div class="mapgis-edit-control-properties">
              <mapgis-ui-space direction="vertical">
                <mapgis-ui-input
                  size="small"
                  v-for="key in Object.keys(properties)"
                  :key="key"
                  :addon-before="key"
                  :value="properties[key]"
                  @change="e => changeProperties(e, key)"
                />
              </mapgis-ui-space>
            </div>
          </mapgis-ui-tab-pane>
        </mapgis-ui-tabs>
      </mapgis-ui-div>
    </div>
  </div>
</template>

<script>
import "@mapgis/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as MapboxDrawCom from "@mapgis/mapbox-gl-draw";
const MapboxDraw = MapboxDrawCom.default;
const modes = MapboxDrawCom.default.modes;
import StaticMode from "@mapgis/mapbox-gl-draw-static-mode";

modes.static = StaticMode;

import editMixin from "./editMixin";
import controlMixin from "../withControlEvents";
import DefaultEditStyle from "./DefaultEditStyle";

import { uuid } from "../../../util/util";

const editEvents = {
  // es6
  drawCreate: "draw.create",
  drawDelete: "draw.delete",
  drawUpdate: "draw.update",

  // brower
  drawcreate: "draw.create",
  drawdelete: "draw.delete",
  drawupdate: "draw.update"
};

export default {
  name: "mapgis-edit",
  mixins: [editMixin, controlMixin],
  provide() {
    const self = this;
    return {
      get editor() {
        // 提供markerg给子组件popup或者插槽槽
        return self.editor;
      }
    };
  },
  model: {
    prop: "feature",
    event: "change.feature"
  },
  props: {
    feature: {
      type: Object,
      required: true
    },
    enableControl: {
      type: Boolean,
      default: false
    },
    closeEdit: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Object,
      default: () => {
        return {
          point: false,
          line_string: false,
          polygon: false,
          trash: false,
          combine_features: false,
          uncombine_features: false
        };
      }
    },
    styles: {
      type: Array,
      default: () => DefaultEditStyle
    }
  },

  data() {
    return {
      initial: true,
      editor: undefined,
      size: "small",
      geometry: {},
      properties: {},
      jsonOptions: {
        search: false,
        mode: "code",
        onChange: this.changeGeometry
      },
      oldStyles: DefaultEditStyle
    };
  },

  watch: {
    feature: {
      handler: function(next) {
        this.parseFeature(next);
        this.toggleFeature();
      },
      deep: true
    },
    styles: {
      handler: function(news) {
        this.oldStyles = this.combineStyle(news);
      }
    }
  },

  mounted() {
    this.$_initEdit();
    this.parseFeature();
    this.toggleFeature();
  },

  beforeDestroy() {
    this.remove();
  },

  methods: {
    parseFeature(feature) {
      feature = feature || this.feature;
      const { geometry, properties } = feature;
      this.geometry = geometry ? geometry : {};
      this.properties = properties || {};
    },
    changeGeometry(geometry) {
      let { guid, editor, feature } = this;
      if (!editor || !feature) return;
      let f = editor.get(guid);
      if (f) {
        editor.delete(guid);
        if (!feature.geometry) return;
        feature.geometry = geometry;
        feature.id = guid;
        if (feature.geometry.type == "Polygon") {
          feature.geometry.coordinates = feature.geometry.coordinates.map(
            ring => {
              ring[ring.length - 1] = ring[0];
              return ring;
            }
          );
        }
        editor.add(feature);
        this.$emit("change.feature", feature);
      }
    },
    enableEditor() {
      this.$_moveLayer();
      this.$_unbindDrawEvents();
      this.$_unbindMeasureEvents();
      this.$_unbindEditEvents();
      this.$_bindSelfEvents(Object.keys(editEvents));
    },

    $_initEdit() {
      const editoroptions = {
        ...this.$props,
        styles: this.oldStyles
      };
      this.editor = {
        ...this.map._controls.find(item => item instanceof MapboxDraw)
      };
      this.editor.options = { ...editoroptions };
      this.$_compareStyle();
      this.$_emitEvent("added", { editor: this.editor });
      this.initial = false;
      return this.editor;
    },

    /**
     * 移动图层，这里是为了让新添加的地图不要覆盖到绘制图层上方，所以将新加的图层顺序调换到绘制图层之前，防止覆盖
     * 一张图因为调用机制的问题，组件初始化时并不能监测到后续添加的地图，因此在测量绘制前调整顺序
     */
    $_moveLayer() {
      let layersId = [];
      this.map.getStyle().layers.forEach(layer => {
        layersId.push(layer.id);
      });
      for (
        let i = layersId.indexOf("gl-draw-point-static.hot") + 1;
        i < layersId.length;
        i++
      ) {
        if (this.map.getLayer("gl-draw-polygon-fill-inactive.cold")) {
          this.map.moveLayer(layersId[i], "gl-draw-polygon-fill-inactive.cold");
        }
      }
    },

    $_bindSelfEvents(events) {
      if (events.length === 0) return;
      // asControl 本身是拥有 $_bindSelfEvents 方法的，但是这里的draw组件并不是遵循的mapbox-gl.js的事件机制，
      // 因此我们需要覆盖该方法, 按照对应的业务方式实现
      const vm = this;
      let listeners = ["drawUpdate", "drawCreate"].concat(
        Object.keys(this.$listeners)
      );

      // 使用vue的this.$listeners方式来订阅用户指定的事件
      // Object.keys(this.$listeners).forEach(eventName => {
      listeners.forEach(eventName => {
        if (events.includes(eventName)) {
          this.$_bindEditEvents(
            editEvents[eventName],
            vm.$_emitEditEvent.bind(vm, eventName)
          );
        }
      });
    },

    // 按照@mapgis/webclient-vue-mapboxgl的规范 发送事件 ，其实就是用{type：eventName}包装事件名
    $_emitEditEvent(eventName, eventData) {
      const vm = this;
      let mode = this.editor.getMode();
      if (eventName == "drawUpdate") {
        if (
          eventData.action == "change_coordinates" &&
          eventData.features &&
          eventData.features.length >= 0
        ) {
          let feature = eventData.features[0];
          this.$emit("change.feature", feature);
          this.parseFeature(feature);
        }
      }
      return this.$_emitSelfEvent({ type: eventName }, eventData);
    },

    $_compareStyle() {
      let combines = this.combineStyle();
      this.changeMapStyle(combines);
      this.oldStyles = combines;
    },

    combineStyle(news) {
      let olds = this.oldStyles || DefaultEditStyle;
      news = news || this.styles;
      let combines = olds.filter(l => {
        return !news.find(f => f.id === l.id);
      });
      combines = combines.concat(news);
      return combines;
    },

    changeMapStyle(layers) {
      let { map } = this;
      layers.forEach(layer => {
        if (map.getLayer(layer)) {
          if (layer.filter) {
            map.setFilter(layer.id, layer.filter);
          }
          if (layer.paint) {
            Object.keys(layer.paint).forEach(key => {
              map.setPaintProperty(layer.id, key, layer.paint[key]);
            });
          }
          if (layer.layout) {
            Object.keys(layer.layout).forEach(key => {
              map.setLayoutProperty(layer.id, key, layer.layout[key]);
            });
          }
        }
      });
    },

    remove() {
      this.toggleDelete();
      this.$_unbindDrawEvents();

      this.$_emitEvent("removed");
    },
    showFeature() {
      let { feature, editor } = this;
      if (!editor) return;
      let guid = uuid();
      this.guid = guid;
      let f = editor.get(guid);

      if (!f) {
        f = { ...feature, id: guid };
        editor.add(f);
      } else {
        this.$message.error("当前正在编辑该要素，请勿重复添加！");
      }
    },
    onJsonError() {
      this.$message.error("错误GEOJSON格式，请重新编辑！");
    },
    toggleFeature() {
      this.enableEditor();
      this.editor && this.editor.changeMode("simple_select");
      this.showFeature();
      this.editor.changeMode("direct_select", {
        featureId: this.guid
      });
      if (this.closeEdit) {
        this.editor && this.editor.changeMode("static");
      }
    },
    toggleDelete() {
      this.enableEditor();
      this.editor && this.editor.deleteAll();
    },

    changeProperties(e, key) {
      let value = e.target.value;
      let { feature, editor, guid } = this;
      if (!feature || !editor) return;
      let { properties } = feature;
      if (!properties) return;
      editor.setFeatureProperty(guid, key, value);
      let f = editor.get(guid);
      this.properties = f.properties;
      this.$emit("change.feature", f);
    }
  }
};
</script>

<style>
.mapgis-edit-control > .mapgis-ui-div > .mapgis-ui-tabs > .mapgis-ui-tabs-bar {
  margin: 0 0 4px 0;
}

.mapgis-edit-control-show {
  position: absolute;
  z-index: 2000;
  font-size: 22px;
  right: 6px;
  top: 2px;
}

.mapgis-edit-control-geometry {
  width: 260px;
  height: 320px;
  margin: 4px;
}

.mapgis-edit-control-properties {
  padding: 4px;
  width: 260px;
  max-height: 320px;
  overflow-y: scroll;
}

.mapgis-edit-control {
  margin: 4px;
  width: fit-content;
  max-width: 260px;
  position: absolute;
  z-index: 3000;
}

.jsoneditor-menu a.jsoneditor-poweredBy {
  display: none;
}
.jsoneditor-container.min-box {
  min-width: 260px !important;
}
</style>
