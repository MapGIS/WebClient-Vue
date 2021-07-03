<script>
import LocaleProvider from 'ant-design-vue/es/locale-provider';

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const localeProviderProps = {
  locale: PropTypes.object.def(function () {
      return {};
    }),
  _ANT_MARK__: PropTypes.string
};

export default {
  name: "mapgis-ui-locale-provider",
  wrapperUI: LocaleProvider,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: localeProviderProps,
  methods: {}
};
</script>
