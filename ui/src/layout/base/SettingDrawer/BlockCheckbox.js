import PropTypes from "ant-design-vue/es/_util/vue-types";
import "ant-design-vue/es/tooltip/style";
import Tooltip from "ant-design-vue/es/tooltip";
import "ant-design-vue/es/icon/style";
import Icon from "ant-design-vue/es/icon";

var BlockCheckboxProps = {
  value: PropTypes.string,
  // Item: { key, url, title }
  list: PropTypes.array,
  i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false)
};
var baseClassName = "mapgis-ui-setting-drawer-block-checbox";
var BlockCheckbox = {
  props: BlockCheckboxProps,
  render: function render(h) {
    var _this = this;

    var value = this.value,
      list = this.list;
    var items = list;

    var handleChange = function handleChange(key) {
      _this.$emit("change", key);
    };

    var disableStyle = {
      cursor: "not-allowed"
    };
    return h(
      "div",
      {
        class: baseClassName,
        key: value
      },
      [
        items.map(function(item) {
          return h(
            Tooltip,
            {
              attrs: {
                title: item.title
              },
              key: item.key
            },
            [
              h(
                "div",
                {
                  class: "".concat(baseClassName, "-item"),
                  style: item.disable && disableStyle,
                  on: {
                    click: function click() {
                      return !item.disable && handleChange(item.key);
                    }
                  }
                },
                [
                  h("img", {
                    attrs: {
                      src: item.url,
                      alt: item.key
                    }
                  }),
                  h(
                    "div",
                    {
                      class: "".concat(baseClassName, "-selectIcon"),
                      style: {
                        display: value === item.key ? "block" : "none"
                      }
                    },
                    [
                      h(Icon, {
                        attrs: {
                          type: "check"
                        }
                      })
                    ]
                  )
                ]
              )
            ]
          );
        })
      ]
    );
  }
};
export default BlockCheckbox;
