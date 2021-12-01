<template>
  <span />
  <!--  <div class="custom-geojson-layer"></div>-->
</template>

<script>
import BaseMixin from "./BaseMixin";
// import Mapgis3dComponentLegend from "../mixComponent/Legend";
import * as turf from "@turf/turf";

let analysisManager;
export default {
  name: "mapgis-3d-component-mix",
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [BaseMixin],
  // components: { Mapgis3dComponentLegend },
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
    activeTitle: { type: Array },
    highLight: {},
    activeCircle: { type: Boolean, default: false }
  },
  data() {
    return {
      waitManagerName: "M3DIgsManager",
      legend: "",
      position: {
        longitude: 0,
        latitude: 0,
        height: 0
      },
      //单体化模型信息对象
      current: {
        feature: undefined,
        originalColor: new Cesium.Color()
      },
      handlerAction: undefined
    };
  },
  created() {},
  mounted() {
    let vm = this;
    this.$_init(vm.mount);
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    activeTitle: function(news) {
      if (news) {
        this.changeColor(news);
      }
    },
    highLight: function(news) {
      if (news) {
        this.highlightColor(news);
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
      let find = window.vueCesium.GeojsonManager[vueKey].find((s, i) => {
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
      const {
        viewer,
        options,
        layerStyle,
        ruleJson,
        url,
        vueKey,
        vueIndex,
        activeCircle
      } = this;
      const { dataSources, scene } = viewer;
      // let findSource = vm.$_getObject(vm.waitManagerName);

      let cesiumobj = this.createCesiumObject();
      //intersect 求相交：本例是倾斜摄影和矢量图层的相交圆

      cesiumobj.then(function(origin) {
        // viewer.zoomTo(dataSource);
        if (activeCircle) {
          let intersection = vm.intersect(origin);
          let clipCesiumobj = new Cesium.GeoJsonDataSource.load(intersection);
          clipCesiumobj.then(function(clip) {
            dataSources.add(clip).then(() => {
              window.vueCesium.GeojsonManager.addSource(
                vueKey,
                vueIndex,
                clip.entities.values,
                { outline: undefined, rule: ruleJson }
              );
            });
          });
        } else {
          dataSources.add(origin).then(() => {
            window.vueCesium.GeojsonManager.addSource(
              vueKey,
              vueIndex,
              origin.entities.values,
              { outline: undefined, rule: ruleJson }
            );
          });
        }
      });

      vm.pickModel();
    },
    unmount() {
      let { viewer, vueKey, vueIndex } = this;
      const { dataSources, scene } = viewer;
      let find = window.vueCesium.GeojsonManager.findSource(vueKey, vueIndex);
      if (find) {
        // scene.primitives.remove(find.options.labels);
        if (dataSources) {
          dataSources.remove(find.source, true);
          viewer.entities.remove(find.options.outline);
          // webGlobe.viewer.entities.remove(find.options.popup);
        }
      }
      window.vueCesium.GeojsonManager.deleteSource(vueKey, vueIndex);
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
      if (find.options && find.options.popup) {
        this.viewer.entities.remove(find.options.popup);
      }
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
            entity.polygon.material = new Cesium.Color.fromCssColorString(
              cssColor
            ).withAlpha(0.0);
          }
        }
      }
    },
    pickModel() {
      let vm = this;
      let { viewer } = this;
      this.handlerAction = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      this.handlerAction.setInputAction(event => {
        vm.highlightPicking(event);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // webGlobe.registerMouseEvent("LEFT_CLICK", vm.highlightPicking);
      // webGlobe.registerMouseEvent("RIGHT_CLICK", vm.stopPick);
      //构造分析功能管理对象
      analysisManager = new window.CesiumZondy.Manager.AnalysisManager({
        viewer: viewer
      });
    },
    // 鼠标左键单击事件回调：模型高亮
    highlightPicking(movement) {
      let vm = this;
      const { viewer, vueKey, vueIndex } = this;
      //根据鼠标点击位置选择对象
      let pickedFeature = viewer.scene.pick(movement.position);

      //判断current对象（即上一次鼠标选中要素）中要素有值，该值和鼠标点击位置不相同,
      // 则要移除上一次的要素高亮和popup
      if (
        Cesium.defined(vm.current.feature) &&
        vm.current.feature !== pickedFeature
      ) {
        let find = window.vueCesium.GeojsonManager.findSource(
          vueKey,
          vueIndex
        );
        viewer.entities.remove(find.options.popup);
        if (find.options.id && find.options.originColor) {
          const entities = find.source;
          for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (
              entity.id === find.options.id &&
              find.options.name === entity.properties.地类名称._value
            ) {
              entity.polygon.material.color = find.options.originColor;
            }
          }
        }
        vm.current.feature = undefined;
      }

      //判断点击位置是否有值，该值和鼠标点击位置不相同
      if (
        Cesium.defined(pickedFeature) &&
        vm.current.feature !== pickedFeature
      ) {
        vm.current.feature = pickedFeature;
        //获取要素的瓦片集
        let currentLayer;
        currentLayer = [vm.current.feature.id];
        //获取名称属性
        let title = currentLayer[0].name;
        //获取唯一性的id
        let ID = currentLayer[0].id;

        let find = window.vueCesium.GeojsonManager.findSource(
          vueKey,
          vueIndex
        );
        let originColor;
        //判断查找的点在矢量图层的哪个区域
        if (find && find.source) {
          const entities = find.source;
          for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            let regionName = entity.properties.地类名称._value;
            if (regionName === title && ID === entity.id) {
              //先取出原先颜色
              originColor = entity.polygon.material.color;
              //高亮操作
              let nc = new Cesium.Color(1.0, 0, 0, 0.8);
              entity.polygon.material = nc;

              //popup弹窗：先确定该区域的polygon坐标求出center和面积
              let coordinates = entity.polygon.hierarchy._value.positions;
              //笛卡尔坐标转化为经纬度坐标
              let polygon = [];
              for (let j = 0; j < coordinates.length; j++) {
                let point = [];
                let cartographic = Cesium.Cartographic.fromCartesian(
                  coordinates[j]
                );
                const longitude = Cesium.Math.toDegrees(cartographic.longitude);
                const latitude = Cesium.Math.toDegrees(cartographic.latitude);
                point.push(longitude);
                point.push(latitude);
                polygon.push(point);
              }
              polygon = turf.polygon([polygon]);
              let area = turf.area(polygon);
              let center = turf.center(polygon);

              let point = center.geometry.coordinates;

              vm.position.longitude = point[0];
              vm.position.latitude = point[1];
              vm.position.height =
                area < 100000 ? Math.log(area) * 4 : Math.log(area) * 20;

              var b = parseInt(area).toString();
              var len = b.length;
              if (len > 3) {
                var r = len % 3;
                b =
                  r > 0
                    ? b.slice(0, r) +
                      "," +
                      b
                        .slice(r, len)
                        .match(/\d{3}/g)
                        .join(",")
                    : b
                        .slice(r, len)
                        .match(/\d{3}/g)
                        .join(",");
              }
              console.log("viewer.entities", viewer.entities);
              let popup = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(
                  vm.position.longitude,
                  vm.position.latitude,
                  vm.position.height
                ),
                label: {
                  text:
                    "地块名称：" +
                    regionName +
                    "\r\n" +
                    "地块面积：" +
                    b +
                    "m²",
                  showBackground: true,
                  font: "16px bold 微软雅黑",
                  backgroundColor: Cesium.Color.GREY.withAlpha(0.7),
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                  show: true
                },
                polyline: {
                  positions: [
                    Cesium.Cartesian3.fromDegrees(
                      vm.position.longitude,
                      vm.position.latitude,
                      0
                    ),
                    Cesium.Cartesian3.fromDegrees(
                      vm.position.longitude,
                      vm.position.latitude,
                      vm.position.height
                    )
                  ],
                  material: Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.GREY,
                    dashLength: 32.0
                  })
                }
              });
              window.vueCesium.GeojsonManager.deleteSource(vueKey, vueIndex);

              window.vueCesium.GeojsonManager.addSource(
                vueKey,
                vueIndex,
                entities,
                {
                  popup: popup,
                  originColor: originColor,
                  id: ID,
                  name: regionName
                }
              );
            }
          }
        }
      }
    },
    intersect(datasource) {
      let vm = this;
      let findSource = vm.$_getObject(vm.waitManagerName);
      let centerCartesian = findSource.source[0].boundingSphere.center;
      //笛卡尔转化经纬度
      let center = [];
      let cartographic = Cesium.Cartographic.fromCartesian(centerCartesian);
      center.push(Cesium.Math.toDegrees(cartographic.longitude));
      center.push(Cesium.Math.toDegrees(cartographic.latitude));
      //求倾斜摄影的圆：circle 返回polygon
      let radius = 1;
      let options = { steps: 64, units: "kilometers" };
      let circle = turf.circle(center, radius, options);

      //矢量图层的polygon
      let val = datasource.entities.values;
      let geojsoncolltion = {
        type: "FeatureCollection",
        features: []
      };

      let mutiPolygon = [];

      let singleIntersect = [];
      // for (let i = 0; i < val.length(features))

      for (let i = 0; i < val.length; i++) {
        let positions = val[i].polygon.hierarchy._value.positions;
        let polygon = [];

        for (let j = 0; j < positions.length; j++) {
          let point = [];
          let cartographic = Cesium.Cartographic.fromCartesian(positions[j]);
          const longitude = Cesium.Math.toDegrees(cartographic.longitude);
          const latitude = Cesium.Math.toDegrees(cartographic.latitude);
          point.push(longitude);
          point.push(latitude);
          polygon.push(point);
        }
        let polygonTurf = turf.polygon([polygon]);

        if (turf.intersect(circle, polygonTurf)) {
          let inter = turf.intersect(circle, polygonTurf);
          inter.properties = val[i].properties;
          geojsoncolltion.features.push(inter);
          //有交集
          if (inter.geometry.type === "Polygon") {
          } else if (inter.geometry.type === "MultiPolygon") {
          }
        }
        //
        //  绘制多边形
        //
        //  let hier2 = [];
        //  for (let c=0; c<polygon.length;c++){
        //    for (let d=0;d<polygon[c].length;d++){
        //      hier2.push(polygon[c][d]);
        //    }
        //  }
        // viewer.entities.add({
        //   polygon: {
        //     hierarchy: Cesium.Cartesian3.fromDegreesArray(hier2),
        //     material: Cesium.Color.DARKMAGENTA.withAlpha(0.5),
        //   }
        // });
        mutiPolygon.push(polygon);
      }
      /* let vectorPolygon = turf.multiPolygon([mutiPolygon]);
      //求相交部分：
      intersection = turf.intersect(vectorPolygon, circle); */

      return geojsoncolltion;
    }
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
