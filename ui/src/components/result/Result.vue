<script>
import Result, { ResultProps } from 'ant-design-vue/es/result';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const resultTypes = {
  ...ResultProps
};

export default {
  name: "mapgis-ui-result",
  wrapperUI: Result,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: resultTypes,
  methods: {}
};
</script>
