<template>
  <div>
    <mapgis-ui-row v-if="type === 'slider'">
      <mapgis-ui-col :span="sliderProps.titleCol">
        <p style="margin-top: 0.8em">{{ title }}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="sliderProps.sliderCol">
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
      <mapgis-ui-col :span="sliderProps.inputCol" v-if="!sliderProps.range">
        <mapgis-ui-input-number
            style="margin-top: 5px;"
            :max="sliderProps.sliderMax"
            :min="sliderProps.sliderMin"
            v-model="valueCopy"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row v-if="type === 'select'">
      <mapgis-ui-col :span="selectProps.titleCol">
        <p style="margin-top: 0.8em">{{ title }}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="selectProps.selectCol">
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
      <mapgis-ui-col :span="colorPickerProps.titleCol">
        <p>{{title}}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="colorPickerProps.colorCol">
        <div>
          <colorPicker
              :id="colorId"
              v-model="valueCopy"
              @change="methods.change"
          />
        </div>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row v-if="type === 'grediantPicker'">
      <mapgis-ui-col :span="grediantPickerProps.titleCol">
        <p style="margin-top: 5px">{{title}}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="grediantPickerProps.selectCol">
        <mapgis-ui-select
            v-model="valueCopy"
            :getPopupContainer="grediantPickerProps.getPopupContainer"
            @change="methods.change"
            :style="grediantPickerProps.selectStyle"
        >
          <mapgis-ui-select-option v-for="(gradient,index) in grediantPickerProps.gradients" :key="index"
                                   :value="gradient.key">
            <div class="mix-row-gradient" :style="{background: gradient.value,...grediantPickerProps.optionStyle}"/>
          </mapgis-ui-select-option>
        </mapgis-ui-select>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row v-if="type === 'input'">
      <mapgis-ui-col :span="inputProps.titleCol">
        <p
            :style="inputProps.titleStyle"
        >{{title}}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="inputProps.inputCol">
        <mapgis-ui-input
          v-model="valueCopy"
          :addonAfter="inputProps.addonAfter"
          :addonBefore="inputProps.addonBefore"
          :disabled="inputProps.disabled"
          :id="inputProps.id"
          :maxLength="inputProps.maxLength"
          :prefix="inputProps.prefix"
          :size="inputProps.size"
          :suffix="inputProps.suffix"
          :type="inputProps.type"
          :allowClear="inputProps.allowClear"
          @change="methods.change"
          @pressEnter="methods.pressEnter"
          :style="inputProps.inputStyle"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row v-if="type === 'inputNumber'">
      <mapgis-ui-col :span="inputNumberProps.titleCol">
        <p
            :style="inputNumberProps.titleStyle"
        >{{title}}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="inputNumberProps.inputCol">
        <mapgis-ui-input-number
            v-model="valueCopy"
            :autoFocus="inputNumberProps.autoFocus"
            :disabled="inputNumberProps.disabled"
            :formatter="inputNumberProps.formatter"
            :max="inputNumberProps.max"
            :min="inputNumberProps.min"
            :parser="inputNumberProps.parser"
            :precision="inputNumberProps.precision"
            :decimalSeparator="inputNumberProps.decimalSeparator"
            :size="inputNumberProps.size"
            :step="inputNumberProps.step"
            @change="methods.change"
            @pressEnter="methods.pressEnter"
            :style="inputNumberProps.inputStyle"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-mix-row",
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
        getTooltipPopupContainer: undefined,
        titleCol: 8,
        sliderCol: 12,
        inputCol: 4
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
        open: undefined,
        titleCol: 8,
        selectCol: 16
      },
      colorPickerProps: {
        //拾取器样式
        style: {},
        titleCol: 8,
        colorCol: 16
      },
      grediantPickerProps: {
        //菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。
        getPopupContainer: undefined,
        gradients: undefined,
        selectStyle: {
          width: "155px"
        },
        optionStyle: {
          width: "155px"
        },
        titleCol: 8,
        selectCol: 16
      },
      inputProps: {
        addonAfter: undefined,
        addonBefore: undefined,
        disabled: false,
        id: undefined,
        maxLength: undefined,
        prefix: undefined,
        size: undefined,
        suffix: undefined,
        type: undefined,
        allowClear: undefined,
        titleCol: 8,
        inputCol: 16,
        inputStyle: {},
        titleStyle: {}
      },
      inputNumberProps: {
        autoFocus: undefined,
        disabled: undefined,
        formatter: undefined,
        max: undefined,
        min: undefined,
        parser: undefined,
        precision: undefined,
        decimalSeparator: undefined,
        size: undefined,
        step: undefined,
        titleCol: 8,
        inputCol: 16,
        inputStyle: {},
        titleStyle: {}
      },
      methods: {
        blur: function () {
        },
        change: function () {
        },
        pressEnter: function () {
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
  created() {
    if (this.type === "colorPicker") {
      this.valueCopy = "#000000";
    }
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
          if(this.sliderProps.range && this.sliderProps.sliderCol === 16){
            this.sliderProps.sliderCol = 12;
          }
          break;
        case "select":
          this.selectProps = Object.assign(this.selectProps, this.options.selectProps);
          break;
        case "colorPicker":
          this.$_initColorStyle();
          break;
        case "grediantPicker":
          this.grediantPickerProps = Object.assign(this.grediantPickerProps, this.options.grediantPickerProps);
          if(!this.valueCopy && this.grediantPickerProps.gradients.length > 0){
            this.valueCopy = this.grediantPickerProps.gradients[0].key;
          }
          break;
        case "input":
          this.inputProps = Object.assign(this.inputProps, this.options.inputProps);
          break;
        case "inputNumber":
          this.inputNumberProps = Object.assign(this.inputNumberProps, this.options.inputNumberProps);
          break;
      }
    },
    $_initColorStyle() {
      let colorDocument = document.getElementById(this.colorId);
      let colorBtn = colorDocument.childNodes;
      let vm = this;
      Object.keys(this.options.colorPickerProps.style).forEach(function (key) {
        colorBtn[0].style[key] = vm.options.colorPickerProps.style[key];
      });
    },
  }
}
</script>

<style scoped>
.mix-row-gradient {
  height: 15px;
  margin: 8px 0 0;
  border-radius: 3px;
}
</style>