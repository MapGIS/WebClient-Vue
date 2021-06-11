<script>
import Slider, { SliderProps } from "ant-design-vue/es/slider";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";

export const sliderProps = {
  ...SliderProps()
};

export default {
  name: "mapgis-ui-slider",
  wrapperUI: Slider,
  mixins: [AntdMixin],
  inheritAttrs: false,
  model: {
    prop: "value",
    event: "change"
  },
  props: sliderProps
};
</script>
