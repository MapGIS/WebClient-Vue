<template>
  <div>
    <mapgis-ui-row v-if="type === 'slider'">
      <mapgis-ui-col :span="8">
        <p style="margin-top: 0.8em">{{ title }}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="sliderProps.range ? 16 : 12">
        <mapgis-ui-slider
            v-model="valueCopy"
            :max="sliderProps.sliderMax"
            :min="sliderProps.sliderMin"
            :step="sliderProps.step"
            :range="sliderProps.range"
            :tipFormatter="sliderProps.tipFormatter"
            :disabled="sliderProps.disabled"
            :dots="sliderProps.dots"
            :tooltipPlacement="sliderProps.tooltipPlacement"
            :tooltipVisible="sliderProps.tooltipVisible"
            :getTooltipPopupContainer="sliderProps.getTooltipPopupContainer"
            @change="methods.change"
            @afterChange="methods.afterChange"
        />
      </mapgis-ui-col>
      <mapgis-ui-col :span="4" v-if="!sliderProps.range">
        <mapgis-ui-input-number
            style="margin-top: 5px;"
            :max="sliderProps.sliderMax"
            :min="sliderProps.sliderMin"
            v-model="valueCopy"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row v-if="type === 'select'">
      <mapgis-ui-col :span="8">
        <p style="margin-top: 0.8em">{{ title }}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="16">
        <mapgis-ui-select
            v-model="valueCopy"
            :autoFocus="selectProps.autoFocus"
            :defaultActiveFirstOption="selectProps.defaultActiveFirstOption"
            :dropdownClassName="selectProps.dropdownClassName"
            :dropdownRender="selectProps.dropdownRender"
            :dropdownStyle="selectProps.dropdownStyle"
            :dropdownMenuStyle="selectProps.dropdownMenuStyle"
            :getPopupContainer="selectProps.getPopupContainer"
            :labelInValue="selectProps.labelInValue"
            :maxTagCount="selectProps.maxTagCount"
            :maxTagPlaceholder="selectProps.maxTagPlaceholder"
            :maxTagTextLength="selectProps.maxTagTextLength"
            :notFoundContent="selectProps.notFoundContent"
            :mode="selectProps.mode"
            :optionFilterProp="selectProps.optionFilterProp"
            :optionLabelProp="selectProps.optionLabelProp"
            :placeholder="selectProps.placeholder"
            :showSearch="selectProps.showSearch"
            :showArrow="selectProps.showArrow"
            :size="selectProps.size"
            :suffixIcon="selectProps.suffixIcon"
            :removeIcon="selectProps.removeIcon"
            :menuItemSelectedIcon="selectProps.menuItemSelectedIcon"
            :tokenSeparators="selectProps.tokenSeparators"
            :defaultOpen="selectProps.defaultOpen"
            :open="selectProps.open"
            @blur="methods.blur"
            @change="methods.change"
            @deselect="methods.deselect"
            @focus="methods.focus"
            @inputKeydown="methods.inputKeydown"
            @mouseenter="methods.mouseenter"
            @mouseleave="methods.mouseleave"
            @popupScroll="methods.popupScroll"
            @search="methods.search"
            @dropdownVisibleChange="methods.dropdownVisibleChange"
            style="width: 100%;">
          <mapgis-ui-select-option v-for="(data, index) in selectProps.dataSource" :key="index" :value="data">
            {{ data }}
          </mapgis-ui-select-option>
        </mapgis-ui-select>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row v-if="type === 'colorPicker'">
      <mapgis-ui-col :span="8">
        <p>颜色</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="16">
        <div>
          <colorPicker
              :id="colorId"
          />
        </div>
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-slider-row",
  data() {
    return {
      valueCopy: undefined,
      fieldCopy: undefined,
      sliderProps: {
        //滑动最大值
        sliderMax: 200,
        //滑动最小值
        sliderMin: 0,
        //滑动步幅
        sliderStep: 1,
        //是否启用双游标
        range: false,
        //改变滑动游标上面的提示数据
        tipFormatter: undefined,
        //禁用滑块
        disabled: false,
        //是否只能拖拽到刻度上
        dots: false,
        //提示框位置，有如下值top，left，right，bottom，topLeft，topRight，bottomLeft，bottomRight，leftTop，leftBottom，rightTop，rightBottom
        tooltipPlacement: "top",
        //是否显示提示框
        tooltipVisible: true,
        //Tooltip 渲染父节点，默认渲染到 body上
        getTooltipPopupContainer: undefined
      },
      selectProps: {
        //数据源
        dataSource: undefined,
        //默认获取焦点
        autoFocus: false,
        //是否默认高亮第一个选项。
        defaultActiveFirstOption: false,
        //下拉菜单的 className 属性,测试不起作用
        dropdownClassName: undefined,
        //自定义下拉框内容
        dropdownRender: undefined,
        //下拉菜单的 style 属性
        dropdownStyle: undefined,
        //dropdown 菜单自定义样式
        dropdownMenuStyle: undefined,
        //菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。
        getPopupContainer: undefined,
        //是否把每个选项的 label 包装到 value 中，会把 Select 的 value 类型从 string 变为 {key: string, label: vNodes} 的格式
        labelInValue: false,
        //最多显示多少个 tag
        maxTagCount: undefined,
        //隐藏 tag 时显示的内容
        maxTagPlaceholder: undefined,
        //最大显示的 tag 文本长度
        maxTagTextLength: undefined,
        //当下拉列表为空时显示的内容
        notFoundContent: undefined,
        //设置 Select 的模式为多选或标签	'default' | 'multiple' | 'tags' | 'combobox'
        mode: "default",
        //搜索时过滤对应的 option 属性，如设置为 children 表示对内嵌内容进行搜索
        optionFilterProp: undefined,
        //回填到选择框的 Option 的属性值，默认是 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 value。
        optionLabelProp: undefined,
        //选择框默认文字
        placeholder: undefined,
        //使单选模式可搜索
        showSearch: false,
        //是否显示下拉小箭头
        showArrow: true,
        //选择框大小，可选 large small
        size: "default",
        //自定义的多选框清除图标
        suffixIcon: undefined,
        //自定义的多选框清空图标
        removeIcon: undefined,
        //自定义当前选中的条目图标
        menuItemSelectedIcon: undefined,
        //在 tags 和 multiple 模式下自动分词的分隔符
        tokenSeparators: undefined,
        //是否默认展开下拉菜单
        defaultOpen: undefined,
        //是否展开下拉菜单
        open: undefined
      },
      colorPickerProps: {},
      methods: {
        blur: function () {
        },
        change: function () {
        },
        afterChange: function () {
        },
        deselect: function () {
        },
        focus: function () {
        },
        inputKeydown: function () {
        },
        mouseenter: function () {
        },
        mouseleave: function () {
        },
        popupScroll: function () {
        },
        search: function () {
        },
        dropdownVisibleChange: function () {
        },
      },
      colorId: "colorId" + parseInt(Math.random() * 100000)
    }
  },
  props: {
    /**
     * 组件类型
     * */
    type: {
      type: String,
      default: "slider"
    },
    /**
     * 标题
     * */
    title: {
      type: String,
      required: true
    },
    /**
     * 字段名
     * */
    field: {
      type: String,
      required: true
    },
    /**
     * 字段值
     * */
    value: {
      type: [Number, Array, String]
    },
    /**
     * 额外参数
     * */
    options: {
      type: Object,
      default() {
        return {
          sliderProps: {}
        };
      }
    },
  },
  mounted() {
    this.valueCopy = this.value;
    this.fieldCopy = this.field;
    this.$_initProps();
  },
  watch: {
    value: {
      handler: function () {
        this.valueCopy = this.value;
        let changeObject = {
          type: this.type,
          ket: this.fieldCopy,
          value: this.valueCopy
        }
        this.$emit("changed", changeObject);
      },
      deep: true
    },
  },
  methods: {
    $_initProps() {
      this.methods = Object.assign(this.methods, this.options.methods);
      switch (this.type) {
        case "slider":
          this.sliderProps = Object.assign(this.sliderProps, this.options.sliderProps);
          break;
        case "select":
          this.selectProps = Object.assign(this.selectProps, this.options.selectProps);
          break;
      }
    },
    $_initColorStyle(){

    }
  }
}
</script>

<style scoped>
</style>