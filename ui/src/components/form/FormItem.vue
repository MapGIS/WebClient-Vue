<script>
import FormItem, { FormItemProps } from "ant-design-vue/es/form/FormItem";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const formItemProps = {
  ...FormItemProps
};

export default {
  name: "mapgis-ui-form-item",
  __ANT_FORM_ITEM: true,
  wrapperUI: FormItem,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  model: {},
  props: formItemProps,
  computed: {},
  methods: {}
};
</script>
