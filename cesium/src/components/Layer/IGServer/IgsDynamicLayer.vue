<template>
  <span />
</template>
<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-igs-dynamic-layer",
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
    gdbps: {
      handler: function() {
        this.unmount();
        this.mount();
      }
    }
  },
  methods: {
    initUrl(service) {
      let _url;
      //优先判断url方式
      if (this.baseUrl) {
        _url = this.baseUrl;
      } else if (this.domain) {
        _url = this.domain + service;
      } else {
        //最后ip方式
        if (this.ip && this.port) {
          _url = this.protocol + this.ip + ":" + this.port + service;
        } else {
          throw new Error("请输入url地址信息");
        }
      }

      return _url;
    },
    mount() {
      if (
        this.baseUrl &&
        this.baseUrl.indexOf("igs/rest/services") > -1 &&
        this.baseUrl.indexOf("model")
      ) {
        if (this.layerStyle.visible && !this.model) {
          const { gdbps } = this;
          const url = `${this.baseUrl}?gdbpUrl=${gdbps[0]}&geometry=&oids=&sRef=WGS1984_度&modelDataFormat=`;
          this.fetchModel(url);
        }
      } else {
        //处理独有参数
        const baseUrl = this.initUrl("/igs/rest/mrms/layers");
        let { gdbps } = this;
        if (typeof gdbps === "string") {
          gdbps = gdbps.split(",");
        }
        this.$_mount({ baseUrl: baseUrl, gdbps: gdbps });
      }
    },
    unmount() {
      if (
        this.baseUrl &&
        this.baseUrl.indexOf("igs/rest/services") > -1 &&
        this.baseUrl.indexOf("model")
      ) {
        if (!this.layerStyle.visible) {
          this.model && viewer.scene.primitives.remove(this.model);
          this.model = null;
        }
      } else {
        this.$_unmount();
      }
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

      const model = new Cesium.Model(options);

      const index = viewer.scene.primitives._primitives.findIndex(
        item => item.id === this.gdbps[0]
      );
      if (index === -1) {
        this.model = model;
        viewer.scene.primitives.add(this.model);
      }
    }
  }
};
</script>
