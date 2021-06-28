<script>
import Transfer, { TransferProps } from 'ant-design-vue/es/transfer';
 
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const transferTypes = {
  ...TransferProps
  // showSearch: PropTypes.bool
};

export default {
  name: "mapgis-ui-transfer",
  wrapperUI: Transfer,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: transferTypes,
  methods: {}
};
</script>
