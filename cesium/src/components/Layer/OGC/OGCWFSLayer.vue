<template>
  <span />
</template>

<script>
import ServiceLayer from "../ServiceLayer";
export default {
  name: "mapgis-3d-ogc-wfs-layer",
  inject: ["Cesium", "vueCesium", "viewer"], // 地图脚本Cesium
  mixins: [ServiceLayer],
  props: {
    // 这里面写的是options的参数
    baseUrl: {
      type: String,
      default: null
    },
    // wfs服务版本 可选1.0.0 1.1.0 2.0.0
    wfsVersion: { type: String, dafault: "2.0.0" },
    // 请求要素的条数,默认值1000,wfs2.0.0支持
    count: { type: Number, dafault: 1000 },
    // 自动跳转至图层范围
    autoReset: { type: Boolean, default: true },
    // 渲染器，底层有封装，具体值不要放入，会造成参数读取问题
    renderer: {
      type: Object,
      default() {
        return {};
      }
    },
    id: { type: String, default: "" },
    token: {
      type: Object
    },
    options: {
      type: Object,
      default: () => {
        return {
          proxy: undefined,
          tilingScheme: undefined,
          rectangle: undefined,
          tileDiscardPolicy: undefined,
          tileHeight: 256,
          tileWidth: 256,
          enablePickFeatures: false,
          minimumLevel: 0,
          maximumLevel: 20,
          credit: undefined
        };
      }
    },
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    }
  },
  data() {
    return {
      //监测props
      checkType: {
        visible: "boolean",
        opacity: "number",
        zIndex: "number",
        tileMatrixLabels: "array",
        clock: "object",
        times: "object",
        dimensions: "object",
        // 瓦片宽度
        tileWidth: "number",
        // 瓦片高度
        tileHeight: "number",
        tilingScheme: "object",
        // 服务请求范围
        rectangle: "object",
        // 瓦片最小级别
        minimumLevel: "number",
        //瓦片最大级别
        maximumLevel: "number",
        credit: "object|string",
        subdomains: "string|array",
        startLevel: "number",
        vueKey: "string",
        vueIndex: "string|number",
        tilingScheme: "object",
        // 获取代理
        proxy: "object"
      },
      // 图层管理,
      managerName: "OGCWFSManager",
      // 图层索引
      layerIndex: undefined,
      // 图层
      layer: undefined,
      // 图层范围
      layerRange: []
    };
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    wfsVersion: {
      handler: function() {
        this.unmount();
        this.mount();
      }
    },
    baseUrl: {
      handler: function() {
        this.unmount();
        this.mount();
      }
    },
    count: {
      handler: function() {
        this.unmount();
        this.mount();
      }
    },
    autoReset: {
      handler: function() {
        this.unmount();
        this.mount();
      }
    },
    // 渲染器需要深度监听，因为渲染器内部某个属性值为对象，不深度监听页面不渲染
    renderer: {
      handler(value) {
        this.mount();
      },
      deep: true
    },
    id: {
      handler: function() {
        const { vueIndex, vueKey } = this;
        let layer = window.vueCesium[this.managerName].findSource(
          vueKey,
          vueIndex
        );
        layer.source.id = this.id;
      }
    }
  },
  methods: {
    mount() {
      // mount中应该做什么？
      // 1.拿到/给到options中的参数
      // 2.检查options中的类型
      // 3.深拷贝renderer
      // 4.处理renderer里面的color
      // 5.调用方法加载图层
      let { viewer, vueCesium } = this;
      let { baseUrl, wfsVersion, count, autoReset, renderer } = this;
      let vm = this;
      let options = {
        wfsVersion,
        count,
        autoReset,
        renderer
      };
      this.$_check();
      // 深拷贝,达到与原对象完全分离的目的，互不影响
      let transformRenderer = JSON.parse(JSON.stringify(renderer));
      this.transformObject(transformRenderer);
      options.renderer = transformRenderer;
      let layerIndex = viewer.scene.layers.appendFeatureLayer(baseUrl, {
        ...options,
        // 这里的index，取到的是请求数据的featureType，我理解的是请求到的要素的类型的数量（索引）
        getDocLayerIndexes: vm.getDocLayer,
        // 将加载完成后图层信息回调 暴露出来
        loaded: function(layerInfo) {
          let vm = this;
          vm.$emit("loaded", layerInfo);
        }
      });
    },
    getDocLayer(index) {
      const vm = this;
      const { vueIndex, vueKey, vueCesium, url } = this;
      if (index) {
        vm.layerIndex = index;
        // getFeatureLayer():根据图层索引号，获取矢量图层对象
        // getLayer(index)：按照图层索引号获取图层对象
        // vm.layer:MapGISFeatureLayer
        vm.layer = viewer.scene.layers.getLayer(vm.layerIndex[0]);
        let source = [vm.layer];
        if (source) {
          vueCesium[vm.managerName].addSource(vueKey, vueIndex, source, {
            url: vm.baseUrl,
            layerIndex: vm.layerIndex
          });
          vm.layerRange = vm.layer._layerRange;
        }
        vm.$emit("load", { data: vm });
      }
    },
    // 这里的逻辑是拿到渲染器里面的颜色
    transformObject(renderer) {
      // 这里起到的作用：当renderer为null或者undefined时，将{}赋值给renderer，防止报错
      renderer = renderer || {};
      Object.keys(renderer).forEach(key => {
        // 如果renderer里面还有对象，再执行一次
        if (typeof renderer[key] == "object") {
          this.transformObject(renderer[key]);
        }
        if (key == "color") {
          renderer[key] = Cesium.Color.fromCssColorString(renderer[key]);
        }
      });
    },
    unmount() {
      let { viewer, vueCesium } = this;
      const { vueKey, vueIndex, layerIndex } = this;

      let find = vueCesium[this.managerName].findSource(vueKey, vueIndex);
      // let index = layerIndex;
      // if (layerIndex instanceof Array) {
      //   debugger;
      //   index = layerIndex[0];
      // }
      if (find && find.source) {
        viewer.scene.layers.removeAllLayers();
      }
      //  for(var i = 0; i < layerIndexs; i++){
      //      viewer.scene.layers.removeFeatureLayerByID(layerIndexs[i]);
      //  }
      vueCesium[this.managerName].deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    }
  }
};
</script>
