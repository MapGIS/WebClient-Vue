<script>
import FormModelItem, { FormItemProps } from "ant-design-vue/es/form-model/FormItem";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const formItemProps = {
  ...FormItemProps
};

export default {
  name: "mapgis-ui-form-model-item",
  __ANT_NEW_FORM_ITEM: true,
  wrapperUI: FormModelItem,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  model: {},
  props: formItemProps,
  computed: {},
  methods: {
    onFieldBlur() {
      this.$children[0].onFieldBlur();
    },
    onFieldChange() {
      this.$children[0].onFieldChange();
    }
  }
};
</script>
