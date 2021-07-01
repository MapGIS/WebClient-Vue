import {
  getOptionProps,
  getComponentFromProp
} from "ant-design-vue/es/_util/props-util";
import defaultRenderEmpty from "../components/empty/RenderEmpty";

// getOptionprops 如果是Vue组件对象则将驼峰写法以及连字符写法的Props对象返回
// getComponentFromProp(this, props, optins=this, excute=true)

export default {
  props: {
    getPopupContainer: Function,
    prefixCls: String,
    csp: Object, // 内容安全策略
    locale: Object
  },
  provide() {
    const vm = this;
    return {
      get configProvider() {
        return {
          getPopupContainer: this.getPopupContainer,
          prefixCls: vm.prefixCls,
          csp: vm.csp,
          locale: Object.assign(
            {},
            vm.locale,
            vm.$i18n && vm.$i18n.getLocaleMessage(vm.$i18n.locale)
          ),
          getPrefixCls: vm.getPrefixCls,
          renderEmpty: vm.renderEmptyUI
        };
      },
      get localeData() {
        return {
          antLocale: Object.assign(
            {},
            vm.locale,
            vm.$i18n && vm.$i18n.getLocaleMessage(vm.$i18n.locale),
            { exist: true }
          )
        };
      }
    };
  },
  computed: {
    addProps: function() {
      return {};
    },
    addListeners: function() {
      return {};
    },
    uiProps: function() {
      return { ...getOptionProps(this), ...this.addProps };
    },
    uiListeners: function() {
      return { ...this.$listeners, ...this.addListeners };
    },
    uiStyle: function() {
      return null;
    }
  },
  data() {
    return {};
  },
  render(h) {
    const Component = this.getWrapperUI();
    return h(
      Component,
      {
        props: this.uiProps,
        style: this.uiStyle,
        attrs: this.$attrs,
        on: this.uiListeners,
        scopedSlots: this.$scopedSlots
      },
      this.renderChildren(h)
    );
  },
  methods: {
    getPrefixCls(suffix, customPrefix) {
      const { prefixCls = "mapgis-ui" } = this.$props;
      if (customPrefix) return customPrefix;
      return suffix ? `${prefixCls}-${suffix}` : prefixCls;
    },

    getWrapperUI() {
      const ui = this.$options.wrapperUI;
      return ui;
    },

    renderEmptyUI(h, name) {
      const renderEmpty =
        getComponentFromProp(this, "renderEmpty", {}, false) ||
        defaultRenderEmpty;
      return renderEmpty(h, name);
    },

    renderChildren(createElement) {
      const slotComponents = [].concat(this.$slots["default"] || []);
      for (let key in this.$slots) {
        if (key !== "default") {
          slotComponents.push(
            createElement(
              "template",
              {
                slot: key
              },
              this.$slots[key]
            )
          );
        }
      }
      return slotComponents;
    }
  }
};
