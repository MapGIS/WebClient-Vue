export default {
  inject: ["webGlobe", "Cesium"],
  props: {
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    },
    terrainGraphics: {
      type: Object,
      default() {
        return {
          //是否指定各点高度
          perPositionHeight: true,
          //颜色
          material: new Cesium.Color(33 / 255, 150 / 255, 243 / 255, 0),
          //轮廓线是否显示
          outline: false,
          //轮廓线颜色
          outlineColor: Cesium.Color.RED
        };
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    $_getCesium() {
      let { Cesium } = this;
      if (!Cesium) {
        Cesium = window.Cesium;
      }
      return Cesium;
    },
    $_draw(drawFunction, webGlobe, analyseFunction, analysisName) {
      window.drawElement = new window.Cesium.DrawElement(webGlobe.viewer);
      let vm = this;
      console.log("drawElement", drawElement);
      window.drawElement[drawFunction]({
        callback: function(positions) {
          console.log("positions", positions);
          vm[analyseFunction](webGlobe, positions, analysisName);
        }
      });
    },
    $_terrainAnalyse(webGlobe, positions, analysisName) {
      if (positions.length > 0) {
        let pointArr = new Array();
        let Npositions = [];
        let terrainAnalyse = new window.Cesium.TerrainAnalyse(
          webGlobe.viewer,
          {}
        );
        //必须要一个原点,可以写死
        let transform = terrainAnalyse.getTransform(115.5, 30.5, 0.0);
        let inverseTransform = Cesium.Matrix4.inverse(
          transform,
          new Cesium.Matrix4()
        );
        let globe = webGlobe.viewer.scene.globe;
        globe.modifiedSlopeMatrix = inverseTransform;
        //坐标转换、处理
        for (let i = 0; i < positions.length; i++) {
          let point = positions[i];
          let ellipsoid = globe.ellipsoid;
          let cartesian3 = new Cesium.Cartesian3(point.x, point.y, point.z);
          let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
          let lat = Cesium.Math.toDegrees(cartographic.latitude);
          let lon = Cesium.Math.toDegrees(cartographic.longitude);
          let height = cartographic.height;
          pointArr.push(lon, lat, height);
          let geoPosition = Cesium.Matrix4.multiplyByPoint(
            inverseTransform,
            new Cesium.Cartesian3.fromDegrees(lon, lat, height),
            new Cesium.Cartesian3()
          );
          Npositions.push(geoPosition);
        }
        Npositions.push(Npositions[0]);
        globe.selectArea = Npositions;

        //构造区对象
        let polygon = {
          name: "立体区",
          polygon: {
            //坐标点
            hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(pointArr),
            ...this.terrainGraphics
          }
        };
        //绘制图形通用方法：对接Cesium原生特性
        webGlobe.appendGraphics(polygon);

        //更新地形
        terrainAnalyse.updateMaterial(analysisName);
      }
    },
    $_initAnalysis(drawFunction, analyseFunction, analysisName) {
      let vm = this;
      window.CesiumZondy.getWebGlobeByInterval(function(webGlobe) {
        vm.$_draw(drawFunction, webGlobe, analyseFunction, analysisName);
      }, this.vueKey);
    },
    /*
     * 根据veuKey取得webGlobe对象
     * @param deleteFunc Function 删除前一次绘制的函数
     * @param NewManagerName String 如果指定了NewManagerName，则使用NewManagerName
     * **/
    $_getManager(NewManagerName, deleteFunc) {
      let source,
        MName = this.waitManagerName;
      if (NewManagerName) {
        MName = NewManagerName;
      }
      //如果是GlobesManager，则直接通过vueKey来寻找
      if (MName === "GlobesManager") {
        const { webGlobe } = this;
        if (this.vueKey === "default") {
          // 使用注入的webGlobe
          // codemirror使用的时候不能支持多屏，也无法获取.CesiumZondy.GlobesManager对象
          source = webGlobe;
        } else {
          let GlobesManager = window.CesiumZondy.GlobesManager;
          if (GlobesManager[this.vueKey]) {
            source = GlobesManager[this.vueKey][0].source;
          }
        }
      } else {
        //如果是其他的Manager，则通过vueKey和vueIndex来寻找
        source = window.CesiumZondy[MName].findSource(
          this.vueKey,
          this.vueIndex
        );
      }
      if (deleteFunc) {
        deleteFunc(source);
      }
      return source;
    },
    /*
     * 删除Manager
     * @param managerName String 要被删除的manager
     * @param callback Function 回调函数
     * **/
    $_deleteManager(managerName, callback) {
      const { vueKey, vueIndex } = this;
      let manager = window.CesiumZondy[managerName].findSource(
        vueKey,
        vueIndex
      );
      if (manager) {
        if (callback) {
          callback(manager);
        }
        window.CesiumZondy.MeasureToolManager.deleteSource(vueKey, vueIndex);
      }
    }
  }
};
