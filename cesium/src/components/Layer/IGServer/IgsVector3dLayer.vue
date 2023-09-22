<template>
  <span></span>
</template>

<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-igs-vector-layer",
  mixins: [ServiceLayer],
  props: {
    gdbps: {
      type: [Array, String],
      require: true
    }
  },
  data() {
    return {
      managerName: "IgsserverManager",
      providerName: "MapGISMapServerImageryProvider",
      checkType: {
        tileWidth: "number",
        tileHeight: "number",
        minimumLevel: "number",
        maximumLevel: "number"
      }
    };
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    "layerStyle.visible"(val) {
      this.showOrHideModel(val);
    }
  },
  methods: {
    mount() {
      // 加载模型
      const { gdbps } = this;
      const domain = this.baseUrl.split("?")[0];
      const url = `${domain}?gdbpUrl=${gdbps}&geometry=&oids=&sRef=WGS1984_度&modelDataFormat=`;
      this.fetchModel(url);
    },
    unmount() {
      // 销毁模型
      this.model && viewer.scene.primitives.remove(this.model);
      this.model = null;
    },
    showOrHideModel(val) {
      // 控制模型显隐
      this.model.show = val;
    },
    // 获取position及文件流
    fetchModel(url) {
      fetch(url)
        .then(stream => {
          this.xPosition = stream.headers.get("X-Gis-Position");
          return stream.arrayBuffer();
        })
        .then(res => {
          this.createModel(res);
        });
    },
    // 生成模型
    createModel(satelliteArrayBuffer) {
      const positionArr = this.xPosition.split(",");
      const { viewer } = this;
      const position = Cesium.Cartesian3.fromDegrees(
        Number(positionArr[0]),
        Number(positionArr[1]),
        Number(positionArr[2])
      );
      // 目前获取到的结果模型需要沿z轴旋转90°
      const heading = Cesium.defaultValue(Cesium.Math.toRadians(90), 0.0);
      const pitch = Cesium.defaultValue(Cesium.Math.toRadians(0), 0.0);
      const roll = Cesium.defaultValue(0.0, 0.0);
      const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        position,
        new Cesium.HeadingPitchRoll(heading, pitch, roll)
      );
      const options = {
        modelMatrix: modelMatrix,
        gltf: satelliteArrayBuffer,
        id: this.gdbps[0]
      };
      this.model = viewer.scene.primitives.add(new Cesium.Model(options));
    }
  }
};
</script>
