<template>
  <span />
  <!--  <div class="custom-geojson-layer"></div>-->
</template>

<script>
import ServiceLayer from "../Controls/ServiceLayer";
import Mapgis3dComponentLegend from "../mixComponent/Legend";

export default {
  name: "mapgis-3d-component-mix",
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
  mixins: [ServiceLayer],
  components: { Mapgis3dComponentLegend },
  props: {
    geoJson: { type: Object },
    vueKey: { type: String, default: "default" },
    vueIndex: {
      type: String | Number,
      default: () => (Math.random() * 10000000).toFixed(0)
    },
    url: {
      type: String | Object,
      required: true
    },
    options: { type: Object },
    layerStyle: { type: Object },
    ruleJson: { type: Object },
    activeTitle: { type: Array }
  },
  data() {
    return {
      waitManagerName: "M3DIgsManager",
      legend: ""
    };
  },
  created() {},
  mounted() {
    let vm = this;
    // vm.$_init(vm.mount());
    vm.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    activeTitle: function(news) {
      if (news) {
        this.changeColor(news);
      }
    }
  },
  methods: {
    createCesiumObject() {
      const { url } = this;
      return new Cesium.GeoJsonDataSource.load(url);
    },
    findSource() {
      const vm = this;
      const { vueKey, vueIndex } = this;
      let index = -1;
      let find = window.CesiumZondy.GeojsonManager[vueKey].find((s, i) => {
        let result = false;
        if (s && (s.key === vueIndex || s.key === `${vueIndex}`)) {
          index = i;
          result = true;
        }
        return result;
      });
      let source = find ? find.source : undefined;
      return { index: index, source: source };
    },
    mount() {
      let vm = this;
      if (vm.activeTitle.length !== 0) {
        console.log("activeTitle", vm.activeTitle);
      }

      const {
        webGlobe,
        options,
        layerStyle,
        ruleJson,
        url,
        vueKey,
        vueIndex
      } = this;
      const { viewer } = webGlobe;
      const { dataSources, scene } = viewer;

      let datasource = this.createCesiumObject();

      // let labels = scene.primitives.add(new Cesium.LabelCollection());

      datasource.then(function(dataSource) {
        // viewer.zoomTo(dataSource);
        dataSources.add(dataSource).then(() => {
          window.CesiumZondy.GeojsonManager.addSource(
            vueKey,
            vueIndex,
            dataSource.entities.values,
            { outline: undefined, rule: ruleJson }
          );
          // let find = window.CesiumZondy.GeojsonManager.findSource(vueKey, vueIndex);
          // vm.colors = find.options.colors;
        });
      });
    },
    unmount() {
      let { webGlobe, vueKey, vueIndex } = this;
      console.log("vueKey", vueKey, vueIndex);
      const { viewer } = webGlobe;
      const { dataSources, scene } = viewer;
      let find = window.CesiumZondy.GeojsonManager.findSource(vueKey, vueIndex);
      if (find) {
        scene.primitives.remove(find.options.labels);
        if (dataSources) {
          dataSources.remove(find.source, true);
          webGlobe.viewer.entities.remove(find.options.outline);
          webGlobe.viewer.entities.remove(find.options.popup);
        }
      }
      window.CesiumZondy.GeojsonManager.deleteSource(vueKey, vueIndex);
      this.$emit("unload", this.layer);
    },
    initColor() {
      let find = this.findSource();
      if (!find || !find.source) return;
      let entities = find.source;
      let { options, ruleJson, layerStyle } = this;
      let { type, clampToGround } = options;
      let { width, alpha } = layerStyle;
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (!type) continue;
        if (type === "Polygon") {
          let regionName = entity.properties.地类名称._value;
          entity.name = regionName;
          for (let j = 0; j < ruleJson.rule.length; j++) {
            let firstColor = ruleJson.rule[j].color;
            let secondRule = ruleJson.rule[j].rule;
            let findsubrule = secondRule.find(r => r.name === regionName);
            if (findsubrule) {
              let pc = new Cesium.Color.fromCssColorString(
                firstColor
              ).withAlpha(alpha);
              entity.polygon.material = pc;
            }
          }
        }
      }
    },
    changeColor(activeRule) {
      let find = this.findSource();
      if (!find || !find.source) return;
      // this.initColor();
      let entities = find.source;
      let { options, ruleJson, layerStyle } = this;
      let {
        outlineColor,
        type,
        glowPower,
        taperPower,
        clampToGround
      } = options;
      let { width, alpha } = layerStyle;
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (!type) continue;

        if (type === "LineString") {
        } else if (type === "Polygon") {
          entity.polygon.height = undefined;
          let regionName = entity.properties.地类名称._value;

          let isPatch = false;
          for (let j = 0; j < activeRule.length; j++) {
            if (activeRule[j].name === regionName) {
              isPatch = true;
              entity.name = regionName;
              let cssColor = activeRule[j].color; // ;
              if (cssColor) {
                let pc = new Cesium.Color.fromCssColorString(
                  cssColor
                ).withAlpha(alpha);
                entity.polygon.material = pc;
                entity.polygon.outlineColor = pc;
              }
              if (clampToGround) {
                entity.polygon.clampToGround = clampToGround;
                entity.polygon.classificationType =
                  Cesium.ClassificationType.BOTH;
              }
              break;
            }
          }
          if (!isPatch) {
            let cssColor = "#000000";
            console.log("未匹配-before", entity.name, entity.polygon.material);
            entity.polygon.material = new Cesium.Color.fromCssColorString(
              cssColor
            ).withAlpha(0.0);
            console.log("未匹配-after", entity.name, entity.polygon.material);
          }
        }
      }
    },
    highlightColor() {}
  }
};
</script>
<style scoped>
.legend {
  position: absolute;
  left: 10px;
  top: 10px;
  width: calc(40vw);
  height: calc(65vh);
}
</style>
