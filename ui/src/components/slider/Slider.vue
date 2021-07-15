<script>
import Slider, { SliderProps } from "ant-design-vue/es/slider";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const sliderProps = {
  ...SliderProps()
};

export default {
  name: "mapgis-ui-slider",
  wrapperUI: Slider,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  model: {
    prop: "value",
    event: "change"
  },
  props: sliderProps,
  computed: {
    addListeners() {
      const vm = this;
      return {
        change: function(value) {
          vm.$emit("change", value);
        }
      };
    }
  }
};
</script>
