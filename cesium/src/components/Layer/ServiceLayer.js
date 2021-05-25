export default {
  inject: ["webGlobe"],
  methods: {
    $_getManager() {
      let Manager = [];
      Object.keys(window.CesiumZondy).forEach(function(key) {
        if (key.indexOf("Manager") > -1) {
          if (window.CesiumZondy[key].hasOwnProperty("vueKey")) {
            let vKey = window.CesiumZondy[key].vueKey;
            let oneManager = window.CesiumZondy[key][vKey];
            if (oneManager.length > 0) {
              for (let i = 0; i < oneManager.length; i++) {
                if (
                  oneManager[i].hasOwnProperty("options") &&
                  oneManager[i].options.hasOwnProperty("zIndex")
                ) {
                  Manager.push(oneManager[i]);
                }
              }
            }
          }
        }
      });
      Manager = Manager.sort(function(a, b) {
        return a.options.zIndex - b.options.zIndex;
      });
      return Manager;
    },
    $_getLayerIndex(Manager) {
      let layerIndex;
      for (let i = 0; i < Manager.length; i++) {
        if (Manager[i].options.zIndex === this.layerStyleCopy.zIndex) {
          layerIndex = i;
          break;
        }
      }
      return layerIndex;
    },
    $_moveLayer() {
      const { viewer } = webGlobe;
      const { imageryLayers } = viewer;
      let Manager = this.$_getManager();
      let length = Manager.length;
      let layerIndex = this.$_getLayerIndex(Manager);
      let imageLayer = Manager[layerIndex].source;
      if (layerIndex + 1 <= length - 1) {
        if (this.layerStyle.zIndex > Manager[layerIndex + 1].options.zIndex) {
          for (let i = layerIndex + 1; i <= length - 1; i++) {
            if (this.layerStyle.zIndex > Manager[i].options.zIndex) {
              imageryLayers.raise(imageLayer);
            }
          }
        }
      } else if (layerIndex - 1 >= 0) {
        if (this.layerStyle.zIndex < Manager[layerIndex - 1].options.zIndex) {
          for (let j = layerIndex - 1; j >= 0; j--) {
            if (this.layerStyle.zIndex < Manager[j].options.zIndex) {
              imageryLayers.lower(imageLayer);
            }
          }
        }
      }
      Manager[layerIndex].options.zIndex = this.layerStyle.zIndex;
    },
    $_initLayerIndex() {
      const { viewer } = webGlobe;
      const { imageryLayers } = viewer;
      let Manager = this.$_getManager();
      let layerIndex = this.$_getLayerIndex(Manager);
      let layer = Manager.splice(layerIndex, 1)[0];
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
      if (typeof type === "string") {
        let typeArr = type.split("|");
        for (let i = 0; i < typeArr.length; i++) {
          typeArr[i] = typeArr[i].replace(/\s*/g, "");
          if (obj.hasOwnProperty(name)) {
            if (obj[name] === null || obj[name] === undefined) {
              flag = "null";
            } else if (typeof obj[name] === "object") {
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
    $_check() {
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
    }
  }
};
