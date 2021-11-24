import withEvents from "../../../../lib/withEvents";
import withSelfEvents from "../../withSelfEvents";

export default {
  mixins: [withEvents, withSelfEvents],

  inject: ["mapbox", "map", "actions"],

  props: {
    position: {
      type: String,
      default: "top-right"
    }
  },

  data() {
    return {};
  },

  beforeDestroy() {
    if (this.map && this.editor) {
      // 这里后面除非找到了能够在组件内部解决事件冲突的方式，
      // 否则都通过$_removeDrawControl()来释放绘制组件
      // this.map.removeControl(this.editor);
    }
  },

  methods: {
    $_addControl() {
      try {
        this.map.addControl(this.editor, this.position);
      } catch (err) {
        this.$_emitEvent("error", { error: err });
        return;
      }
      this.$_emitEvent("added", { editor: this.editor });
    }
  }
};
