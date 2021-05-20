<template>
  <span/>
</template>

<script>
export default {
  name: "mapgis-3d-ogc-wmts-layer",
  inject: ["Cesium", "webGlobe"],
  props: {
    url: {type: String, required: true},
    layer: {type: String},
    tileMatrixSet: {type: String, default: ""},
    wmtsStyle: {type: String, default: "default"},
    layerStyle: {type: Object},
    options: {
      type: Object,
      default: () => {
        return {}
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
        tileWidth: "number",
        tileHeight: "number",
        tilingScheme: "object",
        rectangle: "object",
        minimumLevel: "number",
        maximumLevel: "number",
        ellipsoid: "object",
        credit: "object|String",
        subdomains: "String|array",
        startLevel: "number",
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
    layer: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    tileMatrixSet: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    wmtsStyle: {
      handler: function () {
        this.unmount();
        this.mount();
      }
    },
    layerStyle: {
      handler: function () {
        let {vueKey, vueIndex} = this;
        let layer = window.CesiumZondy.OGCWMTSManager.findSource(vueKey, vueIndex);
        if(this.layerStyleCopy.visible !== this.layerStyle.visible){
          layer.source.show = this.layerStyle.visible;
        }
        if(this.layerStyleCopy.opacity !== this.layerStyle.opacity){
          layer.source.alpha = this.layerStyle.opacity;
        }
        if(this.layerStyleCopy.zIndex !== this.layerStyle.zIndex){
          this.unmount();
          this.mount();
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
      deep:true
    }
  },
  methods: {
    $_check(){
      let opt = {...this.options, ...this.layerStyle}
      this.$_checkProps(opt, this.checkType);
    },
    /*检查对象里面的属性是否是需要的类型，如果不是则抛出错误
    * author 杨琨
    * param param checkObj 需要被检查的对象
    * param param checkType 属性类型集合
    * */
    $_checkProps(checkObj, checkType) {
      let vm = this;
      if (checkObj&&checkType) {
        Object.keys(checkObj).forEach(function (key) {
          let result;
          if (checkType.hasOwnProperty(key) && typeof key === 'string') {
            result = vm.$_checkValue(checkObj, key, checkType[key]);
            if (result === "wrongType") {
              throw new Error(key + "的类型错误，应为" + checkType[key] + "类型");
            }
          }
        });
      }
    },
    /*检查属性是否存在或者类型是否正确，优先检查是否为空
    * author 杨琨
    * param param obj 需要被检查的对象
    * param param name 要检查的属性名
    * param param type 要检查的属性的类型
    * return "null" 或者 "wrongType"
    * */
    $_checkValue(obj, name, type) {
      let flag = "";
      if (typeof type === 'string') {
        let typeArr = type.split("|");
        for (let i = 0; i < typeArr.length; i++) {
          typeArr[i] = typeArr[i].replace(/\s*/g, "");
          if (obj.hasOwnProperty(name)) {
            if (obj[name] === null || obj[name] === undefined) {
              flag = "null";
            } else if (typeof obj[name] === 'object') {
              if (typeArr[i] === "array") {
                flag = !(obj[name] instanceof Array) ? "wrongType" : "";
              } else if (typeArr[i] !== "object") {
                flag = "wrongType";
              }
            } else if (!(typeof obj[name] === typeArr[i])) {
              flag = "wrongType";
            }
          } else {
            flag = "null";
          }
        }
      }
      return flag;
    },
    createCesiumObject() {
      const {url, options = {}} = this;
      const {headers} = options;
      let urlSource = undefined;

      if (headers) {
        urlSource = new Cesium.Resource({url: url, headers: headers});
      } else {
        urlSource = url;
      }

      //将部分参数转为Cesium自己的参数
      let wmtsOpt = {}, vm = this;
      Object.keys(this.$props).forEach(function (key) {
        //取得除options和layerStyle之外的props，并转换这些props的名字
        if (key !== "options" && key !== "layerStyle") {
          if (key === "tileMatrixSet") {
            wmtsOpt["tileMatrixSetID"] = vm.$props[key];
          }else if (key === "wmtsStyle") {
            wmtsOpt["style"] = vm.$props[key];
          } else {
            wmtsOpt[key] = vm.$props[key];
          }
        }
      });

      let opt = {...options, ...wmtsOpt};

      //如果tileMatrixSetID存在，则生成tilingScheme对象，动态投影会用到
      if (opt.tileMatrixSetID) {
        opt.tilingScheme = opt.tileMatrixSetID
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

      //tileMatrixLabels为必要值，但是不需要暴露出去，因此给一个默认值
      let checkTileMatrixLabels = this.$_checkValue(opt, "tileMatrixLabels", "");
      if (checkTileMatrixLabels === "null") {
        opt.tileMatrixLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
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

      return new Cesium.WebMapTileServiceImageryProvider(opt);
    },
    mount() {
      //检测参数类型是否正确，不正确不会往下执行
      this.$_check();
      const {webGlobe, options, layerStyle} = this;
      const {zIndex, visible, opacity} = layerStyle;
      const {viewer} = webGlobe;
      const {imageryLayers} = viewer;
      const {saturation, hue} = options;

      //得到layerStyle的副本，供watch使用
      this.layerStyleCopy = Object.assign({},layerStyle);

      window.Zondy = window.Zondy || window.CesiumZondy;
      let provider = this.createCesiumObject();
      const {vueIndex, vueKey} = this;
      //通过zIndex确定图层层级
      let imageLayer = imageryLayers.addImageryProvider(provider, zIndex);
      if (saturation !== undefined) {
        imageLayer.saturation = saturation;
      }
      if (hue !== undefined) {
        imageLayer.hue = hue;
      }

      window.CesiumZondy.OGCWMTSManager.addSource(vueKey, vueIndex, imageLayer);
      let layer = window.CesiumZondy.OGCWMTSManager.findSource(vueKey, vueIndex);

      //如果第一次初始化，有layerStyle，则赋值，以后都走watch
      if (this.$_checkValue(layerStyle, "visible", "") !== "null" && !this.initial) {
        layer.source.show = visible;
      }
      if (this.$_checkValue(layerStyle, "opacity", "") !== "null" && !this.initial) {
        layer.source.alpha = opacity;
      }
      this.initial = true;

      this.$emit("load", layer, this);
    },
    unmount() {
      let {webGlobe, vueKey, vueIndex} = this;
      const {viewer} = webGlobe;
      const {imageryLayers} = viewer;
      let find = window.CesiumZondy.OGCWMTSManager.findSource(vueKey, vueIndex);
      imageryLayers.remove(find.source, true);
      window.CesiumZondy.OGCWMTSManager.deleteSource(vueKey, vueIndex);

      this.$emit("unload", this);
    },
  },
};
</script>
