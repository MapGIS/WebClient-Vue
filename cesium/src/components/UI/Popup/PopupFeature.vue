<script>
import PopupMixin from "../../Layer/Mixin/PopupVirtual";

export default {
  name: "mapgis-3d-feature-popup",
  mixins: [PopupMixin],
  props: {
    /**
     * @param {Entity} [position.entity]  实体,内部获取坐标点cartesian, 输入此参数可忽略下面的，cartesian，longitude,latitude
     * @param {Cartesian3} [position.cartesian] 笛卡尔积坐标点cartesian, 输入此参数可忽略下面的longitude,latitude
     * @param {Number} [position.longitude] 经度, 先判断cartesian是否存在，存在忽略此参数
     * @param {Number} [position.latitude] 纬度, 先判断cartesian是否存在，存在忽略此参数
     * @param {Number}  [position.height] 高度, 可选 默认0
     */
    position: {
      type: Object,
      required: true
    },
    /**
     *  @param {Boolean} visible(v-model) 对话框是否可见
     */
    visible: {
      type: Boolean,
      default: true
    },
    enablePopup: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  model: {
    prop: "visible",
    event: "change"
  },
  inject: ["Cesium", "vueCesium", "viewer"],
  watch: {
    position: {
      deep: true,
      immediate: true,
      handler() {
        this.update();
      }
    },
    visible: {
      deep: true,
      immediate: true,
      handler() {
        this.update();
      }
    }
  },
  mounted() {
    this.iClickVisible = this.visible;
    // this.mount();
  },
  destroyed() {
    // this.unmount();
  },
  methods: {
    togglePopup() {
      let value = !this.show;
      this.show = value;
    },
    getViewer() {
      let { viewer, vueKey, vueCesium } = this;
      vueCesium = vueCesium || window.vueCesium;
      let instance = viewer || vueCesium.getViewer(vueKey);
      return instance;
    },
    createCesiumObject() {
      return new Promise(resole => {
        resole();
      });
    },
    mount() {
      let { viewer, vueKey, vueIndex, vueCesium } = this;
      vueCesium = vueCesium || window.vueCesium;
      viewer = viewer || this.getViewer();
      let promise = this.createCesiumObject();
      promise.then(function() {
        let find = vueCesium.PopupManager.addSource(
          vueKey,
          vueIndex,
          undefined,
          {}
        );
      });
    },
    unmount() {
      let { viewer, vueKey, vueIndex, vueCesium } = this;
      viewer = viewer || this.getViewer();
      vueCesium = vueCesium || window.vueCesium;
      let popup;

      let find = vueCesium.PopupManager.findSource(vueKey, vueIndex);
      if (find) {
        popup = find.source;
      }
      return !viewer.isDestroyed();
    },
    update() {
      const { position, visible } = this;
      this.iClickPosition = position;
      this.iClickVisible = visible;
    },
    $_changeVisible(visible) {
      this.$emit("change", visible);
    }
  }
};
</script>
