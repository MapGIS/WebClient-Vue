<template>
  <span/>
</template>

<script>
import ServiceLayer from "../ServiceLayer";

export default {
  name: "mapgis-3d-ogc-wms-layer",
  inject: ["Cesium", "webGlobe"],
  mixins:[ServiceLayer],
  props: {
    url: {type: String, required: true},
    layers: {type: String, required: true},
    styles: {type: String},
    crs: {type: String},
    srs: {type: String},
    id: {type: String,default:""},
    layerStyle: {type: Object,default:function () {
        return {}
      }},
    options: {
      type: Object,
      default: () => {
        return {};
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
        parameters: "object",
        getFeatureInfoParameters: "object",
        enablePickFeatures: "object",
        getFeatureInfoFormats: "array",
        rectangle: "object",
        tilingScheme: "object",
        ellipsoid: "object",
        tileWidth: "number",
        tileHeight: "number",
        minimumLevel: "number",
        maximumLevel: "number",
        credit: "object|String",
        subdomains: "String|array",
        clock: "object",
        times: "object",
        proxy: "object",
        vueKey: "string",
        vueIndex: "string | Number",
      },
      //layerStyle的副本，供watch使用
      layerStyleCopy: {},
      initial: false
    };
  },
  created() {
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    url: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    layers: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    styles: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    srs: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    crs: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    layerStyle: {
      handler: function () {
        let {vueKey, vueIndex} = this;
        let layer = window.CesiumZondy.OGCWMSManager.findSource(vueKey, vueIndex);
        if(this.layerStyleCopy.visible !== this.layerStyle.visible){
          layer.source.show = this.layerStyle.visible;
        }
        if(this.layerStyleCopy.opacity !== this.layerStyle.opacity){
          layer.source.alpha = this.layerStyle.opacity;
        }
        if(this.layerStyleCopy.zIndex !== this.layerStyle.zIndex){
          this.$_moveLayer();
        }
        this.layerStyleCopy = Object.assign(this.layerStyleCopy,this.layerStyle);
      },
      deep:true
    },
    options: {
      handler: function () {
        this.unmount();
        this.mount();
      },
      deep: true
    },
    id:{
      handler: function () {
        const {vueIndex, vueKey} = this;
        let layer = window.CesiumZondy.OGCWMTSManager.findSource(vueKey, vueIndex);
        layer.source.id = this.id;
      }
    }
  },
  methods: {
    async createCesiumObject() {
      let {url, options = {}} = this;
      const {headers} = options;

      let urlSource = undefined;

      if (headers) {
        urlSource = new Cesium.Resource({url: url, headers: headers});
      } else {
        urlSource = url;
      }

      //将部分参数转为Cesium自己的参数
      let wmsOpt = {}, vm = this;
      Object.keys(this.$props).forEach(function (key) {
        //取得除options和layerStyle之外的props
        if (key !== "options" && key !== "layerStyle") {
          wmsOpt[key] = vm.$props[key];
        }
      });

      let opt = {...options, ...wmsOpt};
      //如果srs或crs存在，则生成tilingScheme对象，动态投影会用到
      if (opt.srs || opt.crs) {
        opt.tilingScheme = opt.srs ? opt.srs : opt.crs;
        if (
            opt.tilingScheme === "EPSG:4326" ||
            opt.tilingScheme === "EPSG:4490" ||
            opt.tilingScheme === "EPSG:4610" ||
            opt.tilingScheme === "EPSG:4214"
        ) {
          opt.tilingScheme = new Cesium.GeographicTilingScheme();
        } else if (opt.tilingScheme === "EPSG:3857") {
          opt.tilingScheme = new Cesium.WebMercatorTilingScheme();
        } else if (opt.tilingScheme) {
          opt.tilingScheme = opt.tilingScheme;
        } else {
          opt.tilingScheme = new Cesium.GeographicTilingScheme();
        }
      }

      //vueKey为必要值，但是不需要暴露出去，因此给一个默认值
      let checkVueKey = this.$_checkValue(opt, "vueKey", "");
      if (checkVueKey === "null") {
        this.vueKey = "default";
      }

      //vueIndex为必要值，但是不需要暴露出去，因此给一个默认值
      let checkVueIndex = this.$_checkValue(opt, "vueIndex", "");
      if (checkVueIndex === "null") {
        this.vueIndex = (Math.random() * 100000000).toFixed(0);
      }

      return new Cesium.WebMapServiceImageryProvider(opt);
    },
    async mount() {
      //检测参数类型是否正确，不正确不会往下执行
      this.$_check();
      const {webGlobe, options, layerStyle} = this;
      const {visible, opacity} = layerStyle;
      const {viewer} = webGlobe;
      const {imageryLayers} = viewer;
      const {saturation, hue} = options;

      //得到layerStyle的副本，供watch使用
      this.layerStyleCopy = Object.assign({},layerStyle);

      window.Zondy = window.Zondy || window.CesiumZondy;
      let provider = await this.createCesiumObject();
      const {vueIndex, vueKey} = this;
      //zIndex为空时，将vueIndex赋值给zIndex
      let checkZIndex = this.$_checkValue(layerStyle, "zIndex", ""),zIndex;
      if (checkZIndex === "null") {
        zIndex = vueIndex;
      }else {
        zIndex = this.layerStyle.zIndex;
      }
      //通过zIndex确定图层层级
      let imageLayer = imageryLayers.addImageryProvider(provider, zIndex);
      if (saturation !== undefined) {
        imageLayer.saturation = saturation;
      }
      if (hue !== undefined) {
        imageLayer.hue = hue;
      }

      if(this.id.length === 0){
        imageLayer.id = vueIndex;
      }else {
        imageLayer.id = this.id;
      }

      window.CesiumZondy.OGCWMSManager.addSource(vueKey, vueIndex, imageLayer,{zIndex:zIndex});

      //如果第一次初始化，有layerStyle，则赋值，以后都走watch
      if (this.$_checkValue(layerStyle, "visible", "") !== "null" && !this.initial) {
        imageLayer.show = visible;
      }
      if (this.$_checkValue(layerStyle, "opacity", "") !== "null" && !this.initial) {
        imageLayer.alpha = opacity;
      }
      if(!this.initial){
        this.$_initLayerIndex();
      }
      this.initial = true;

      this.$emit("load", imageLayer, this);
    },
    unmount() {
      let {webGlobe, vueKey, vueIndex} = this;
      const {viewer} = webGlobe;
      const {imageryLayers} = viewer;
      let find = window.CesiumZondy.OGCWMSManager.findSource(vueKey, vueIndex);
      imageryLayers.remove(find.source, true);
      window.CesiumZondy.OGCWMSManager.deleteSource(vueKey, vueIndex);

      this.$emit("unload", this);
    }
  }
};
</script>
