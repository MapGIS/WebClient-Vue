<script>
import FormModel, { FormProps } from "ant-design-vue/es/form-model/Form";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const formProps = {
  ...FormProps
};

export default {
  name: "mapgis-ui-form-model",
  wrapperUI: FormModel,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  model: {},
  props: formProps,
  computed: {},
  methods: {
    onFieldBlur() {
      this.$children[0].onFieldBlur();
    },
    validate() {
      this.$children[0].validate();
    },
    resetFields() {
      this.$children[0].resetFields();
    }
  }
};
</script>
