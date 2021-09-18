<script>
import Form, { FormProps } from "ant-design-vue/es/form/Form";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const formProps = {
  ...FormProps
};

export default {
  name: "mapgis-ui-form",
  wrapperUI: Form,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  model: {},
  props: formProps,
  computed: {},
  methods: {}
};
</script>
