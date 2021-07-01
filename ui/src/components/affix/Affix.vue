<script>
import Affix from "ant-design-vue/es/affix/index";
import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}

export const AffixProps = {
  /**
   * 距离窗口顶部达到指定偏移量后触发
   */
  offsetTop: PropTypes.number,
  offset: PropTypes.number,
  /** 距离窗口底部达到指定偏移量后触发 */
  offsetBottom: PropTypes.number,
  /** 固定状态改变时触发的回调函数 */
  // onChange?: (affixed?: boolean) => void;
  /** 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数 */
  target: PropTypes.func.def(getDefaultTarget),
  prefixCls: PropTypes.string
};

export default {
  name: "mapgis-ui-affix",
  wrapperUI: Affix,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: AffixProps
};
</script>
