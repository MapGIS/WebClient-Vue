<script>
import Carousel, { CarouselProps } from 'ant-design-vue/es/carousel';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const carouselTypes = {
  ...CarouselProps
}

export default {
  name: "mapgis-ui-carousel",
  wrapperUI: Carousel,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: carouselTypes,
  methods: {}
};
</script>
