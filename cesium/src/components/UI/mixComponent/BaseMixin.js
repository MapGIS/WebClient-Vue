export default {
  inject: ["Cesium", "CesiumZondy", "webGlobe"],
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
    }
  },
  data() {
    return {
      //此组件初始化前，要等待加载完毕的组件的manager名称
      waitManagerName: undefined
    };
  },
  methods: {
    /*
     * 初始化函数，如果组件需要的对象（webGlobe，M3D模型对象等）初始化完毕，才初始化组件
     * @param callback 回调函数
     * **/
    $_init(callback) {
      let vm = this;
      let interval = setInterval(function() {
        let Obj = vm.$_getObject();
        if (Obj) {
          clearInterval(interval);
          callback && callback();
        }
      }, 50);
    },
    /*
     * 根据veuKey取得webGlobe对象
     * @param deleteFunc Function 删除前一次绘制的函数
     * @param NewManagerName String 如果指定了NewManagerName，则使用NewManagerName
     * **/
    $_getObject(NewManagerName, deleteFunc) {
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
    $_deleteManger(managerName, callback) {
      const { vueKey, vueIndex } = this;
      let manager = window.CesiumZondy[managerName].findSource(
        vueKey,
        vueIndex
      );
      if (manager) {
        callback(manager);
        window.CesiumZondy[managerName].deleteSource(vueKey, vueIndex);
      }
    }
  }
};
