<script>
import VcSteps from "ant-design-vue/es/vc-steps";

import PropTypes from "../../util/vue-types";
import AntdMixin from "../../mixin/AntdMixin";
import ThemeMixin from "../../mixin/ThemeMixin";

export const StepProps = {
prefixCls: PropTypes.string,
    wrapperStyle: PropTypes.object,
    itemWidth: PropTypes.string,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    status: PropTypes.string,
    iconPrefix: PropTypes.string,
    icon: PropTypes.any,
    adjustMarginRight: PropTypes.string,
    stepNumber: PropTypes.string,
    stepIndex: PropTypes.number,
    description: PropTypes.any,
    title: PropTypes.any,
    subTitle: PropTypes.any,
    progressDot: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    tailContent: PropTypes.any,
    icons: PropTypes.shape({
      finish: PropTypes.any,
      error: PropTypes.any
    }).loose
};

export default {
  name: "mapgis-ui-step",
  wrapperUI: VcSteps.Step,
  mixins: [AntdMixin, ThemeMixin],
  inheritAttrs: false,
  props: StepProps,
};
</script>
