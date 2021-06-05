export default {
  inject: ["webGlobe"],
  props: {
    baseUrl: {
      type: String,
      default: null
    },
    domain: {
      type: String,
      default: null
    },
    protocol: {
      type: String,
      default: "http://"
    },
    ip: {
      type: String,
      default: null
    },
    port: {
      type: String,
      default: null
    },
    serverName: {
      type: String,
      default: null
    },
    layerStyle: {
      type: Object,
      default: function() {
        return {
          visible: true,
          opacity: 1
        };
      }
    },
    id: { type: String, default: "" },
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
          enablePickFeatures: undefined,
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
      //layerStyle，用于监听layerStyle的属性变化
      layerStyleCopy: {},
      //确定serviceLayer要使用的manager名字
      managerName: undefined,
      //确定serviceLayer要使用的provider的名字
      providerName: undefined,
      /*
      * this.$props.options里面的参数类型检测设置，类型名称全小写，
      * 检测类型有number，boolean，string，object，array
      * checkType: {
        visible: "boolean",//确定visible为boolean
        opacity: "number",//确定opacity为number
        vueKey: "string",//确定vueKey为string
        parameters: "object"//确定parameters为object
        }
      **/
      checkType: undefined,
      layerId: undefined
    };
  },
  watch: {
    layerStyle: {
      handler: function() {
        let { vueKey, vueIndex } = this;
        let layer = window.CesiumZondy[this.managerName].findSource(
          vueKey,
          vueIndex
        );
        if (this.layerStyleCopy.visible !== this.layerStyle.visible) {
          layer.source.show = this.layerStyle.visible;
        }
        if (this.layerStyleCopy.opacity !== this.layerStyle.opacity) {
          layer.source.alpha = this.layerStyle.opacity;
        }
        if (this.layerStyleCopy.zIndex !== this.layerStyle.zIndex) {
          this.$_moveLayer();
        }
        this.layerStyleCopy = Object.assign(
          this.layerStyleCopy,
          this.layerStyle
        );
      },
      deep: true
    },
    options: {
      handler: function() {
        this.unmount();
        this.mount();
      },
      deep: true
    },
    id: {
      handler: function() {
        const { vueIndex, vueKey } = this;
        let layer = window.CesiumZondy[this.managerName].findSource(
          vueKey,
          vueIndex
        );
        layer.source.id = this.id;
      }
    }
  },
  methods: {
    /*
     * 通用的mount函数，建议使用时在自己的mount函数里面调用此函数，并在mounted生命周期调用
     * 使用前请优先处理好自己组建里非通用参数，然后传入$_mount
     * 例如：
     * mount(){
     *   //...处理自己的provider要用的参数，请参考Cesium文档里的Provider
     *   //在线文档：http://develop.smaryun.com:8899/docs/other/mapgis-cesium/index.html
     *   //最新文档：\\192.168.82.44\MapGIS 10 开发环境\WebClient\package的develop里面
     *   let options = {
     *     opt1: "",
     *     opt2: ""
     *   }
     *   this.$_mount(options);
     * }
     *
     * @param addOpt 需要额外添加的参数
     * @param CesiumZondyLayer 该参数存在时，会替provier处的Cesium[this.providerName]方法，请参考webclient-javascript里的各种Cesium的layer
     * **/
    $_mount(addOpt, CesiumZondyLayer) {
      //类型检测
      this.$_check();
      let opt = {},
        options = {};

      //取得除options、layerStyle和id之外的必要参数
      const { $props, vueIndex, vueKey } = this;
      Object.keys($props).forEach(function(key) {
        if (key !== "options" && key !== "layerStyle" && key !== "id") {
          opt[key] = $props[key];
        }
      });

      //组合参数
      options = { ...this.options, ...opt, ...addOpt };

      //设置Headers
      let checkHeaders = this.$_checkValue(this.options, "headers", ""),
        urlSource;
      if (checkHeaders === "null") {
        urlSource = new Cesium.Resource({
          url: options.baseUrl,
          headers: options.headers
        });
      } else {
        urlSource = options.baseUrl;
      }

      options.url = urlSource;

      //取得webGlobe对象，防止当页面有多个webGlobe只会取得
      let webGlobeObj = this.$_getWebGlobe();

      //根据对应的providerName设置provider
      const { layerStyle } = this;
      const { saturation, hue } = options;
      const { visible, opacity, zIndex } = layerStyle;
      const { imageryLayers } = webGlobeObj.viewer;

      let provider;
      if (CesiumZondyLayer) {
        provider = new CesiumZondyLayer(options);
      } else {
        provider = new Cesium[this.providerName](options);
      }

      //初始化imageryLayers.addImageryProvider需要的index
      let providerZIndex;
      if (zIndex <= 0) {
        throw new Error("zIndex不能为0或负数，请从1开始设值");
      } else if (!zIndex) {
        //如果没有设置layerStyle.zIndex，则layer的zIndex统一设置为0，并且按照初始化的顺序向上叠放
        providerZIndex = 0;
      } else {
        //确定zIndex不能重复
        this.$_checkZIndex(imageryLayers);
        //如果有layerStyle.zIndex，则layer的zIndex为layerStyle.zIndex
        providerZIndex = zIndex;
      }

      //不管有没有设置zIndex先同意往上面叠放
      let imageryLayer = imageryLayers.addImageryProvider(
        provider,
        imageryLayers._layers.length
      );

      //如果有zIndex，则保证zIndex大于0的layer始终在zIndex为0的layer上面，并按照zIndex从大到小排序
      //如果没有zIndex，则按初始化顺序向上叠放，如果在此layer的下方含有zIndex大于0的layer，则layer向下一层，直到下方没有包含zIndex大于0的layer
      //只会根据imageryLayers排序，不会影响其他图层
      this.$_initLayerIndex();

      if (saturation !== undefined) {
        imageryLayer.saturation = saturation;
      }
      if (hue !== undefined) {
        imageryLayer.hue = hue;
      }

      //设置图层是否可见
      if (typeof visible === "boolean") {
        imageryLayer.show = visible;
      }

      //设置涂层的透明度
      if (typeof opacity === "number") {
        imageryLayer.alpha = opacity;
      }

      //得到layerStyle的副本，供watch使用
      this.layerStyleCopy = Object.assign({}, layerStyle);

      //设置图层id，分屏，卷帘使用
      if (this.id.length === 0) {
        imageryLayer.id = vueIndex;
      } else {
        imageryLayer.id = this.id;
      }

      //保存layerId，方便找到zIndex
      this.layerId = imageryLayer.id;

      //将图层加入对应的manager
      window.CesiumZondy[this.managerName].addSource(
        vueKey,
        vueIndex,
        imageryLayer,
        {
          zIndex: providerZIndex,
          id: imageryLayer.id
        }
      );

      //抛出load事件
      this.$emit("load", imageryLayer, this);
    },
    $_unmount() {
      let webGlobeObj = this.$_getWebGlobe();
      let { vueKey, vueIndex } = this;
      const { viewer } = webGlobeObj;
      const { imageryLayers } = viewer;
      let find = window.CesiumZondy[this.managerName].findSource(
        vueKey,
        vueIndex
      );
      imageryLayers.remove(find.source, true);
      window.CesiumZondy[this.managerName].deleteSource(vueKey, vueIndex);
      this.$emit("unload", this);
    },
    $_checkZIndex(imageryLayers) {
      let layers = this.$_getLayers();
      let _layers = imageryLayers._layers;
      for (let i = 0; i < _layers.length; i++) {
        for (let j = 0; j < layers.length; j++) {
          if (layers[j].options.id === _layers[i].id) {
            if (layers[j].options.zIndex === this.layerStyle.zIndex) {
              throw new Error("该zIndex值已被使用，请重新赋值");
            }
          }
        }
      }
    },
    $_getCurrentLayer(imageryLayers) {
      let currentLayer, index;
      let _layers = imageryLayers._layers;
      for (let i = 0; i < _layers.length; i++) {
        if (_layers[i].id === this.layerId) {
          currentLayer = _layers[i];
          index = i;
          break;
        }
      }
      return {
        currentLayer: currentLayer,
        index: index
      };
    },
    $_getLayers() {
      let Layers = [],
        vm = this;

      //遍历window.CesiumZondy下所有的Manager
      Object.keys(window.CesiumZondy).forEach(function(key) {
        if (key.indexOf("Manager") > -1 && key !== "GlobesManager") {
          //取出含有与webScene组件相同vueKey的Manager对象
          if (window.CesiumZondy[key].hasOwnProperty("vueKey")) {
            if (window.CesiumZondy[key].hasOwnProperty(vm.vueKey)) {
              Layers = Layers.concat(window.CesiumZondy[key][vm.vueKey]);
            }
          }
        }
      });

      //对数组进行排序
      Layers.sort(function(a, b) {
        return a.options.zIndex - b.options.zIndex;
      });
      return Layers;
    },
    $_getLayerIndex(Layers) {
      let layerIndex;
      //根据this.layerStyleCopy.zIndex，从当前的Layers数组中，图层所在index
      for (let i = 0; i < Layers.length; i++) {
        if (Layers[i].options.zIndex === this.layerStyleCopy.zIndex) {
          layerIndex = i;
          break;
        }
      }
      return layerIndex;
    },
    $_getWebGlobe() {
      let webGlobeObj;
      const { vueKey, webGlobe } = this;
      //如果this.vueKey，则从GlobesManager中取得webGlobeObj
      if (vueKey) {
        if (vueKey === "default") {
          webGlobeObj = webGlobe;
        } else {
          let GlobesManager = window.CesiumZondy.GlobesManager;
          webGlobeObj = GlobesManager[this.vueKey][0].source;
        }
      } else {
        //否则取this.webGlobe
        webGlobeObj = webGlobe;
      }
      return webGlobeObj;
    },
    /*
     * 当zIndex改变时，调用此方法，在watch中使用
     * **/
    $_moveLayer() {
      if (this.layerStyle.zIndex <= 0) {
        throw new Error("zIndex不能为0或负数，请从1开始设值");
      }
      //取得webGlobe对象
      let webGlobeObj = this.$_getWebGlobe();
      const { viewer } = webGlobeObj;
      const { imageryLayers } = viewer;
      const { _layers } = imageryLayers;
      let currentLayer = this.$_getCurrentLayer(imageryLayers).currentLayer;
      let index = this.$_getCurrentLayer(imageryLayers).index;

      //确定zIndex不能重复
      this.$_checkZIndex(imageryLayers);

      //如果当前未被设置zIndex的layer有了zIndex，则一直上升，直到zIndex小于上一个layer的zIndex
      if (!this.layerStyleCopy.zIndex) {
        for (let i = index + 1; i < _layers.length; i++) {
          let nextIndex = this.$_getZIndexById(_layers[i].id);
          if (nextIndex === 0) {
            imageryLayers.raise(currentLayer);
          } else if (this.layerStyle.zIndex > nextIndex) {
            imageryLayers.raise(currentLayer);
          }
        }
      } else {
        let nextIndex = index + 1;
        let prevIndex = index - 1;
        if (nextIndex <= _layers.length - 1) {
          if (
            this.layerStyle.zIndex > this.$_getZIndexById(_layers[nextIndex].id)
          ) {
            for (let i = nextIndex; i < _layers.length; i++) {
              let nextIndex = this.$_getZIndexById(_layers[i].id);
              if (this.layerStyle.zIndex > nextIndex) {
                imageryLayers.raise(currentLayer);
              }
            }
          }
        } else if (prevIndex > 0) {
          let pIndex = this.$_getZIndexById(_layers[prevIndex].id);
          if (pIndex > 0 && this.layerStyle.zIndex < pIndex) {
            for (let i = prevIndex; i > 0; i--) {
              let prevIndex = this.$_getZIndexById(_layers[i].id);
              if (this.layerStyle.zIndex < prevIndex) {
                imageryLayers.lower(currentLayer);
              }
            }
          }
        }
      }
      this.$_updateLayerManager();
    },
    $_updateLayerManager() {
      let layers = this.$_getLayers();
      for (let i = 0; i < layers.length; i++) {
        if (this.layerId === layers[i].options.id) {
          layers[i].options.zIndex = this.layerStyle.zIndex;
          break;
        }
      }
    },
    /*
     * 根据zIndex初始化图层顺序
     * 会在$_mount使用
     * **/
    $_initLayerIndex() {
      let webGlobeObj = this.$_getWebGlobe();
      const { viewer } = webGlobeObj;
      const { imageryLayers } = viewer;
      let _layers = imageryLayers._layers;
      let length = _layers.length;
      let currentLayer = _layers[length - 1];
      if (this.layerStyle.zIndex) {
        for (let i = length - 2; i > 0; i--) {
          if (this.layerStyle.zIndex < this.$_getZIndexById(_layers[i].id)) {
            imageryLayers.lower(currentLayer);
          }
        }
      } else {
        for (let i = length - 2; i > 0; i--) {
          if (this.$_getZIndexById(_layers[i].id) > 0) {
            imageryLayers.lower(currentLayer);
          }
        }
      }
    },
    $_getZIndexById(id) {
      let layers = this.$_getLayers();
      let zIndex;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].options.id === id) {
          zIndex = layers[i].options.zIndex;
          break;
        }
      }
      return zIndex;
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
      //这里要确保type为String，因为遍历Object对象后传入的type可能为其他类型，这里只要String类型
      if (typeof type === "string") {
        //处理多个类型的情况
        let typeArr = type.split("|");
        for (let i = 0; i < typeArr.length; i++) {
          typeArr[i] = typeArr[i].replace(/\s*/g, "");
          if (obj.hasOwnProperty(name)) {
            //优先判断是否为空
            if (obj[name] === null || obj[name] === undefined) {
              flag = "null";
            } else if (typeof obj[name] === "object") {
              //判断是数组还是Object
              if (typeArr[i] === "array") {
                flag = !(obj[name] instanceof Array) ? "wrongType" : "";
              } else if (typeArr[i] !== "object") {
                flag = "wrongType";
              }
            } else if (!(typeof obj[name] === typeArr[i])) {
              //判断其他类型
              flag = "wrongType";
            }
          } else {
            flag = "null";
          }
        }
      }
      return flag;
    },
    $_check() {
      //只判断options和layerStyle里的对象类型
      let opt = { ...this.options, ...this.layerStyle };
      this.$_checkProps(opt, this.checkType);
    },
    /*检查对象里面的属性是否是需要的类型，如果不是则抛出错误
     * author 杨琨
     * param param checkObj 需要被检查的对象
     * param param checkType 属性类型集合
     * */
    $_checkProps(checkObj, checkType) {
      let vm = this;
      if (checkObj && checkType) {
        Object.keys(checkObj).forEach(function(key) {
          let result;
          if (checkType.hasOwnProperty(key) && typeof key === "string") {
            result = vm.$_checkValue(checkObj, key, checkType[key]);
            if (result === "wrongType") {
              throw new Error(
                key + "的类型错误，应为" + checkType[key] + "类型"
              );
            }
          }
        });
      }
    },
    /*
     * 初始化url，有三种方式，url、domain、ip
     * @param service 要调用的服务名称
     * **/
    $_initUrl(service) {
      let _url;

      //优先判断url方式
      if (this.baseUrl) {
        _url = this.baseUrl;
      } else if (this.domain) {
        //其次domain方式
        if (!this.serverName) {
          throw new Error("请输入地图文档名称");
        }
        _url = this.domain + service + this.serverName;
      } else {
        //最后ip方式
        if (this.ip && this.port) {
          if (this.serverName) {
            _url =
              this.protocol +
              this.ip +
              ":" +
              this.port +
              service +
              this.serverName;
          } else {
            throw new Error("请输入地图文档名称");
          }
        } else {
          throw new Error("请输入url地址信息");
        }
      }

      return _url;
    },
    /*
     * 设置tilingScheme
     * @param service 要调用的服务名称
     * **/
    $_setTilingScheme(tileMatrixSetName) {
      let tilingScheme;
      if (
        tileMatrixSetName === "EPSG:4326" ||
        tileMatrixSetName === "EPSG:4490" ||
        tileMatrixSetName === "EPSG:4610" ||
        tileMatrixSetName === "EPSG:4214"
      ) {
        tilingScheme = new Cesium.GeographicTilingScheme();
      } else if (tileMatrixSetName === "EPSG:3857") {
        tilingScheme = new Cesium.WebMercatorTilingScheme();
      } else {
        tilingScheme = new Cesium.GeographicTilingScheme();
      }
      return tilingScheme;
    }
  }
};
