export default {
  inject: ["webGlobe"],
  props: {
    url: {
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
    webSceneKey: { type: String, default: "default" },
    webSceneIndex: { type: Number },
    options: {
      type: Object,
      default: () => {
        return {};
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
      checkType: undefined
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
        this.$_unmount();
        this.$_mount();
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
     * **/
    $_mount(addOpt) {
      //类型检测
      this.$_check();
      let opt = {},
        options = {};

      //取得除options、layerStyle和id之外的必要参数
      const { $props } = this;
      Object.keys($props).forEach(function(key) {
        if (key !== "options" && key !== "layerStyle" && key !== "id") {
          opt[key] = $props[key];
        }
      });

      //设置通用的参数
      let defaultOptions = {
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

      //组合参数
      options = { ...defaultOptions, ...opt, ...addOpt };

      //设置Headers
      let checkHeaders = this.$_checkValue(this.options, "headers", ""),
        urlSource;
      if (checkHeaders === "null") {
        urlSource = new Cesium.Resource({
          url: options.url,
          headers: options.headers
        });
      } else {
        urlSource = options.url;
      }

      options.url = urlSource;

      //取得webGlobe对象，防止当页面有多个webGlobe只会取得
      let webGlobeObj = this.$_getWebGlobe();

      //根据对应的providerName设置provider
      const { layerStyle } = this;
      const { saturation, hue } = options;
      const { visible, opacity, zIndex } = layerStyle;
      const { imageryLayers } = webGlobeObj.viewer;

      window.Zondy = window.Zondy || window.CesiumZondy;
      let provider = new Cesium[this.providerName](options);

      //初始化多线程参数
      this.$_initVueOption(options);

      //取得vueKey,vueIndex
      const { vueKey, vueIndex } = this;

      //如果第一次初始化，有layerStyle，则赋值，以后都走watch
      if (!zIndex) {
        layerStyle.zIndex = vueIndex;
      }

      //通过zIndex确定图层层级
      let imageryLayer = imageryLayers.addImageryProvider(
        provider,
        layerStyle.zIndex
      );

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

      //将图层加入对应的manager
      window.CesiumZondy[this.managerName].addSource(
        vueKey,
        vueIndex,
        imageryLayer,
        {
          zIndex: layerStyle.zIndex,
          webSceneIndex: this.webSceneIndex
        }
      );

      //根据this.$props.layerStyle.zIndex设置图层顺序
      this.$_initLayerIndex();

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
    $_initVueOption(options) {
      //vueKey为必要值，但是不需要暴露出去，因此给一个默认值
      let checkVueKey = this.$_checkValue(options, "vueKey", "");
      if (checkVueKey === "null") {
        this.vueKey = "default";
      }
      //vueIndex为必要值，但是不需要暴露出去，因此给一个默认值
      let checkVueIndex = this.$_checkValue(options, "vueIndex", "");
      if (checkVueIndex === "null") {
        this.vueIndex = Number((Math.random() * 100000000).toFixed(0));
      }
    },
    $_getManager() {
      let Manager = [],
        vm = this;

      //遍历window.CesiumZondy下所有的Manager
      Object.keys(window.CesiumZondy).forEach(function(key) {
        if (key.indexOf("Manager") > -1) {
          //取出含有vueKey的Manager对象
          if (window.CesiumZondy[key].hasOwnProperty("vueKey")) {
            let vKey = window.CesiumZondy[key].vueKey;
            let oneManager = window.CesiumZondy[key][vKey];
            if (oneManager.length > 0) {
              for (let i = 0; i < oneManager.length; i++) {
                //取出Manager对象中含有options.zIndex的对象
                if (
                  oneManager[i].hasOwnProperty("options") &&
                  oneManager[i].options.hasOwnProperty("zIndex")
                ) {
                  //如果webSceneIndex存在，则取得与当前所在的webScene对应的manager，这是为了处理有多个webScene组件存在的情况
                  if (vm.webSceneIndex) {
                    if (
                      vm.webSceneIndex === oneManager[i].options.webSceneIndex
                    ) {
                      Manager.push(oneManager[i]);
                    }
                  } else {
                    //否则认定只有单一webScene组件存在，取得所有符合条件的manager
                    Manager.push(oneManager[i]);
                  }
                }
              }
            }
          }
        }
      });

      //对数组进行排序
      Manager.sort(function(a, b) {
        return a.options.zIndex - b.options.zIndex;
      });

      return Manager;
    },
    $_getLayerIndex(Manager) {
      let layerIndex;
      //根据this.layerStyleCopy.zIndex，从当前的Manager数组中，图层所在index
      for (let i = 0; i < Manager.length; i++) {
        if (Manager[i].options.zIndex === this.layerStyleCopy.zIndex) {
          layerIndex = i;
          break;
        }
      }
      return layerIndex;
    },
    $_getWebGlobe() {
      let webGlobeObj;
      //如果this.webSceneKey && this.webSceneIndex，则从GlobesManager中取得webGlobeObj
      if (this.webSceneKey && this.webSceneIndex) {
        let GlobesManager = window.CesiumZondy.GlobesManager.findSource(
          this.webSceneKey,
          this.webSceneIndex
        );
        webGlobeObj = GlobesManager.source;
      } else {
        //否则取this.webGlobe
        webGlobeObj = this.webGlobe;
      }
      return webGlobeObj;
    },
    /*
     * 当zIndex改变时，调用此方法，在watch中使用
     * **/
    $_moveLayer() {
      //取得webGlobe对象
      let webGlobeObj = this.$_getWebGlobe();
      const { viewer } = webGlobeObj;
      const { imageryLayers } = viewer;
      //取得所有拥有zIndex的图层，且在同一个webGlobe下的图层，放入Manager对象数组中
      let Manager = this.$_getManager();
      let length = Manager.length;
      let layerIndex = this.$_getLayerIndex(Manager);
      //取得当前图层对象
      let imageryLayer = Manager[layerIndex].source;
      //如果当前图层所在的Manager数组中右边有值，[...,当前图层,右边有图层,...]
      if (layerIndex + 1 <= length - 1) {
        //如果当前图层的zIndex比右边的大，则向右边遍历
        if (this.layerStyle.zIndex > Manager[layerIndex + 1].options.zIndex) {
          for (let i = layerIndex + 1; i <= length - 1; i++) {
            //如果zIndex比右边的图层大，则当前图层向上升一位
            if (this.layerStyle.zIndex > Manager[i].options.zIndex) {
              imageryLayers.raise(imageryLayer);
            }
          }
        }
      } else if (layerIndex - 1 >= 0) {
        //如果当前图层所在的Manager数组中左边有值，[...,左边有图层,当前图层,...]
        if (this.layerStyle.zIndex < Manager[layerIndex - 1].options.zIndex) {
          //如果当前图层的zIndex比左边的小，则向左边遍历
          for (let j = layerIndex - 1; j >= 0; j--) {
            //如果zIndex比左边的图层大，则当前图层向下降一位
            if (this.layerStyle.zIndex < Manager[j].options.zIndex) {
              imageryLayers.lower(imageryLayer);
            }
          }
        }
      }
      //更新图层zIndex
      Manager[layerIndex].options.zIndex = this.layerStyle.zIndex;
    },
    /*
     * 根据zIndex初始化图层顺序
     * 会在$_mount使用
     * **/
    $_initLayerIndex() {
      let webGlobeObj = this.$_getWebGlobe();
      const { viewer } = webGlobeObj;
      const { imageryLayers } = viewer;
      let Manager = this.$_getManager();
      let layerIndex = this.$_getLayerIndex(Manager);
      let layer = Manager.splice(layerIndex, 1)[0];
      //初始化时，新加的图层总是放在数组最后一位，因此只考虑下降一层的情况
      for (let i = Manager.length - 1; i >= 0; i--) {
        if (layer.options.zIndex <= Manager[i].options.zIndex) {
          imageryLayers.lower(layer.source);
        }
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
      if (this.url) {
        _url = this.url;
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
