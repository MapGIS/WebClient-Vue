import { oneOf } from "../../util/common/common-util";
import _debounce from "lodash/debounce";

export default {
  name: "mapgis-ui-editable-table-cell",
  props: {
    /**
     * column的配置:
     * {
     *  ...(typeof ColumnProps),
     * type: 'Select|Input|InputNumber|ColorPicker...可扩展',
     * props: ant组件或自定义组件的绑定属性对象
     * }
     */
    column: {
      type: Object,
      default: () => ({})
    },
    record: {
      type: Object,
      default: () => ({})
    },
    size: {
      type: String,
      default: "small",
      validator(v) {
        return oneOf(v, ["large", "small"]);
      }
    }
  },
  render(h, ctx) {
    const { column, record, size } = this;

    const onChange = _debounce(value => {
      this.$emit("change", value);
    }, 200);

    const value = record[column.dataIndex];

    switch (column.type) {
      case "Select":
        return (
          <mapgis-ui-select
            onChange={onChange}
            options={column.props?.options}
            value={value}
            size={size}
            placeholder={"请选择"}
            {...{ ...column.props }}
          />
        );
      case "Input":
        return (
          <mapgis-ui-input
            onChange={e => onChange(e.target.value)}
            value={value}
            size={size}
            placeholder={"请输入"}
            {...{ ...column.props }}
          />
        );
      case "InputNumber":
        return (
          <mapgis-ui-input-number
            onChange={onChange}
            value={value}
            size={size}
            {...{ ...column.props }}
          />
        );
      case "ColorPicker":
        return (
          <mapgis-ui-color-picker-confirm
            onChange={onChange}
            value={value}
            size={size}
            border-radius={false}
            {...{ ...column.props }}
          />
        );
      default:
        break;
    }
    return null;
  }
};
