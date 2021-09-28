<template>
  <div>
    <mapgis-ui-row class="mix-row" v-if="type === 'MapgisUiSlider'">
      <mapgis-ui-col :span="sliderProps.titleCol">
        <p class="mix-row-title" :style="titleStyle">{{ title }}</p>
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
            :style="mainStyle"
            @change="$_change"
            @afterChange="$_afterChange"
        />
      </mapgis-ui-col>
      <mapgis-ui-col :span="sliderProps.inputCol" v-if="!sliderProps.range">
        <mapgis-ui-input-number
            style="margin-top: 5px;"
            :max="sliderProps.sliderMax"
            :min="sliderProps.sliderMin"
            v-model="valueCopy"
            :style="extraStyle"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row class="mix-row" v-if="type === 'MapgisUiSelect'">
      <mapgis-ui-col :span="selectProps.titleCol">
        <p class="mix-row-title" :style="titleStyle">{{ title }}</p>
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
            :style="mainStyle"
            @blur="$_blur"
            @change="$_change"
            @deselect="$_deselect"
            @focus="$_focus"
            @inputKeydown="$_inputKeydown"
            @mouseenter="$_mouseenter"
            @mouseleave="$_mouseleave"
            @popupScroll="$_popupScroll"
            @search="$_search"
            @dropdownVisibleChange="$_dropdownVisibleChange"
            style="width: 100%;">
          <mapgis-ui-select-option v-for="(data, index) in dataSource" :key="index" :value="data.value">
            {{ data.key }}
          </mapgis-ui-select-option>
        </mapgis-ui-select>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row class="mix-row" v-if="type === 'MapgisUiColorPicker'">
      <mapgis-ui-col :span="colorPickerProps.titleCol">
        <p class="mix-row-title" :style="titleStyle">{{ title }}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="colorPickerProps.colorCol">
        <div class="mix-row-color-outer">
          <mapgis-ui-sketch-color-picker
              :color="valueCopy"
              @input="$_changeColorSketch"
          />
        </div>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row class="mix-row" v-if="type === 'MapgisUiGrediantSelect'">
      <mapgis-ui-col :span="grediantPickerProps.titleCol">
        <p class="mix-row-title" :style="titleStyle">{{ title }}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="grediantPickerProps.selectCol">
        <mapgis-ui-select
            v-model="valueCopy"
            :getPopupContainer="grediantPickerProps.getPopupContainer"
            @change="$_change"
            class="mix-row-gradient-select"
            :style="mainStyle"
        >
          <mapgis-ui-select-option v-for="(gradient,index) in dataSource" :key="index"
                                   :value="gradient.key">
            <div class="mix-row-gradient" :style="{background: gradient.value,...grediantPickerProps.optionStyle}"/>
          </mapgis-ui-select-option>
        </mapgis-ui-select>
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row class="mix-row" v-if="type === 'MapgisUiInput'">
      <mapgis-ui-col :span="inputProps.titleCol">
        <p class="mix-row-title" :style="titleStyle">{{ title }}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="inputProps.inputCol">
        <mapgis-ui-form-item
            :validate-status="validateStatus"
        >
          <mapgis-ui-input
              v-model="valueCopy"
              :placeholder="inputProps.placeholder"
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
              @change="$_change"
              @pressEnter="$_pressEnter"
              :style="mainStyle"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-form-item
            validate-status="error"
            help="Should be combination of numbers & alphabets"
            v-if="validateStatus === 'error'"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row class="mix-row" v-if="type === 'MapgisUiInputNumber'">
      <mapgis-ui-col :span="inputNumberProps.titleCol">
        <p class="mix-row-title" :style="titleStyle">{{ title }}</p>
      </mapgis-ui-col>
      <mapgis-ui-col :span="inputNumberProps.inputCol">
        <mapgis-ui-input-number
            v-model="valueCopy"
            :placeholder="inputNumberProps.placeholder"
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
            @change="$_change"
            @pressEnter="$_pressEnter"
            :style="mainStyle"
            class="mix-row-input-number"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-infinite-list
        :dataSource="listProps.dataSource"
        :style="{width: panelWidth + 'px', height: panelHeight + 'px'}"
        style="height: 100%"
        v-if="type === 'MapgisUiThemeListUnique' && listProps.dataSource && listProps.dataSource.length > 0">
      <template v-slot="{item, index}" style="height: 100%">
        <mapgis-ui-row style="width: 100%">
          <mapgis-ui-col :span="3"
                         v-if="listProps.checkBoxArr && listProps.checkBoxArr.length > 0"
          >
            <input type="checkbox"
                   v-model="listProps.checkBoxArr[index]"
                   @click="$_change(listProps.checkBoxArr[index],index,listProps.colors[index])"
            >
          </mapgis-ui-col>
          <mapgis-ui-col :span="3">
            <p class="mix-row-p"
               :class="{mixRowPLarge: listProps.size === 'large',mixRowPSmall: listProps.size === 'small'}">{{
                index + 1
              }}</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="2"
                         v-if="listProps.colors && listProps.colors.length > 0"
          >
            <mapgis-ui-sketch-color-picker
                :extraValue="index"
                :color="listProps.colors[index]"
                :size="listProps.size"
                @input="$_changeColor"
            >
              <div class="mix-row-color" :style="{background: listProps.colors[index]}"/>
            </mapgis-ui-sketch-color-picker>
          </mapgis-ui-col>
          <mapgis-ui-col :span="6">
            <p class="mix-row-p"
               :class="{mixRowPLarge: listProps.size === 'large',mixRowPSmall: listProps.size === 'small'}">
              {{ listProps.field }}</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="10">
            <p class="mix-row-p"
               :class="{mixRowPLarge: listProps.size === 'large',mixRowPSmall: listProps.size === 'small'}">
              {{ item }}</p>
          </mapgis-ui-col>
        </mapgis-ui-row>
      </template>
    </mapgis-ui-infinite-list>
    <mapgis-ui-row class="mix-row" :style="{width: panelWidth + 'px', height: panelHeight + 'px'}" v-if="type === 'MapgisUiThemeList'">
      <mapgis-ui-list
          :data-source="listProps.dataSource"
      >
        <mapgis-ui-spin
            v-if="!listProps.dataSource || listProps.dataSource.length === 0"
            style="position: absolute"
            :style="{top: panelHeight / 2 + 'px'}"
        />
<!--        <template #renderEmpty>-->
<!--          &lt;!&ndash;空状态&ndash;&gt;-->
<!--        </template>-->
        <mapgis-ui-list-item slot="renderItem" slot-scope="item,index">
          <div class="mix-row-list">
            <mapgis-ui-row>
              <mapgis-ui-col :span="3"
                             v-if="listProps.checkBoxArr && listProps.checkBoxArr.length > 0"
              >
                <input type="checkbox"
                       v-model="listProps.checkBoxArr[index]"
                       @click="$_change(listProps.checkBoxArr[index],index,listProps.colors[index])"
                >
              </mapgis-ui-col>
              <mapgis-ui-col :span="3">
                <p class="mix-row-p"
                   :class="{mixRowPLarge: listProps.size === 'large',mixRowPSmall: listProps.size === 'small'}">{{
                    index + 1
                  }}</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="2"
                             v-if="listProps.colors && listProps.colors.length > 0"
              >
                <mapgis-ui-sketch-color-picker
                    :extraValue="index"
                    :color="listProps.colors[index]"
                    :size="listProps.size"
                    :showBorder="customProps.showBorder"
                    @input="$_changeColor"
                >
                  <div class="mix-row-color" :style="{background: listProps.colors[index]}"/>
                </mapgis-ui-sketch-color-picker>
              </mapgis-ui-col>
              <mapgis-ui-col :span="6">
                <p class="mix-row-p"
                   :class="{mixRowPLarge: listProps.size === 'large',mixRowPSmall: listProps.size === 'small'}">
                  {{ listProps.field }}</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="10">
                <mapgis-ui-row>
                  <mapgis-ui-col :span="11">
                    <mapgis-ui-input-number
                        v-model="listProps.startData"
                        v-bind:title="String(listProps.startData)"
                        v-if="index === 0"
                        :size="listProps.size"
                    />
                    <mapgis-ui-input-number
                        v-model="listProps.dataSource[index - 1]"
                        v-bind:title="String(listProps.dataSource[index - 1])"
                        v-if="index > 0"
                        :size="listProps.size"
                    />
                  </mapgis-ui-col>
                  <mapgis-ui-col :span="2">
                    <p class="mix-row-p"
                       :class="{mixRowPLarge: listProps.size === 'large',mixRowPSmall: listProps.size === 'small'}">
                      ~</p>
                  </mapgis-ui-col>
                  <mapgis-ui-col :span="11">
                    <mapgis-ui-input-number
                        v-model="listProps.dataSource[index]"
                        v-bind:title="String(listProps.dataSource[index])"
                        :size="listProps.size"
                    />
                  </mapgis-ui-col>
                </mapgis-ui-row>
              </mapgis-ui-col>
            </mapgis-ui-row>
          </div>
        </mapgis-ui-list-item>
      </mapgis-ui-list>
    </mapgis-ui-row>
  </div>
</template>

<script>
import {gradientColor} from "../../util/common/util"
export default {
  name: "mapgis-ui-mix-row",
  data() {
    return {
      valueCopy: undefined,
      fieldCopy: undefined,
      validateStatus: "success",
      sliderProps: {
        //滑动最大值
        sliderMax: 100,
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
        tooltipVisible: undefined,
        //Tooltip 渲染父节点，默认渲染到 body上
        getTooltipPopupContainer: undefined,
        titleCol: 8,
        sliderCol: 12,
        inputCol: 4
      },
      selectProps: {
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
        titleCol: 6,
        colorCol: 18
      },
      grediantPickerProps: {
        //菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。
        getPopupContainer: undefined,
        gradients: undefined,
        titleCol: 8,
        selectCol: 16
      },
      inputProps: {
        placeholder: undefined,
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
        titleCol: 6,
        inputCol: 18,
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
        titleCol: 6,
        inputCol: 18,
      },
      listProps: {
        dataSource: undefined,
        colors: [],
        checkBoxArr: [],
        gradient: "#D53E4F,#FB8D59,#FEE08B,#FFFFBF,#E6F598,#99D594,#3288BD",
        size: undefined
      },
      colorId: "colorId" + parseInt(Math.random() * 100000),
      panelWidth: undefined,
      panelHeight: undefined
    }
  },
  props: {
    panelId: {
      type: String
    },
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
      type: String
    },
    /**
     * 字段名
     * */
    field: {
      type: String
    },
    /**
     * 正则表达式
     * */
    regExp: {
      type: String
    },
    /**
     * 字段值
     * */
    value: {
      type: [Number, Array, String]
    },
    /**
     * 数据源
     * */
    dataSource: {
      type: [Array]
    },
    /**
     * 额外参数
     * */
    props: {
      type: Object,
      default() {
        return {
          sliderProps: {}
        };
      }
    },
    customProps: {
      default() {
        return {
          showBorder: true
        };
      }
    },
    /**
     * 标题样式
     * */
    titleStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 主体样式
     * */
    mainStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 额外样式
     * */
    extraStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  model: {
    prop: "value",
    event: "change"
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
      },
      deep: true
    },
    props: {
      handler: function () {
        this.$_initProps();
      },
      deep: true
    },
  },
  methods: {
    /**
     * 从GeoJSON中取得数据
     * @param GeoJSON GeoJSON数据
     * @param key 字段名
     * @returns 是否相等
     * @param type 单值或分段
     */
    $_getDataByGeoJson(GeoJSON, key, type, rangeLevel) {
      let dataSourceCopy = [], newDataSourceCopy = [], features = GeoJSON.features;
      if(!features){
        return;
      }
      for (let i = 0; i < features.length; i++) {
        if (
            features[i].properties[key] !== "" &&
            features[i].properties[key] !== null &&
            features[i].properties[key] !== undefined
        ) {
          dataSourceCopy.push(features[i].properties[key]);
        }
      }
      dataSourceCopy.sort(function (a, b) {
        return a - b;
      });
      dataSourceCopy = Array.from(new Set(dataSourceCopy));
      switch (type) {
        case "unique":
          newDataSourceCopy = dataSourceCopy;
          break;
        case "range":
          let length = dataSourceCopy.length;
          //某些情况下，取得的数字数据包含字符串要排除
          let temp = [];
          for (let j = 0; j < length; j++) {
            if (!isNaN(Number(dataSourceCopy[j]))) {
              temp.push(Number(dataSourceCopy[j]));
            }
          }
          dataSourceCopy = temp;
          length = dataSourceCopy.length;
          let range = dataSourceCopy[length - 1] - dataSourceCopy[0];
          if (range === 0) {
            newDataSourceCopy.push(dataSourceCopy[0]);
          } else {
            let rangeSect = range / rangeLevel;
            let floatLength;
            if (String(rangeSect).indexOf(".") > -1) {
              floatLength = String(rangeSect).split(".")[1].length;
            }
            for (let j = 0; j < rangeLevel; j++) {
              newDataSourceCopy.push(Number(dataSourceCopy[0]) + (j + 1) * rangeSect);
            }
          }
          break;
      }
      return newDataSourceCopy;
    },
    $_initProps() {
      switch (this.type) {
        case "MapgisUiSlider":
          this.sliderProps = Object.assign(this.sliderProps, this.props);
          if (this.sliderProps.range && this.sliderProps.sliderCol === 16) {
            this.sliderProps.sliderCol = 12;
          }
          break;
        case "MapgisUiSelect":
          this.selectProps = Object.assign(this.selectProps, this.props);
          break;
        case "MapgisUiColorPicker":
          this.colorPickerProps = Object.assign(this.colorPickerProps, this.props);
          break;
        case "MapgisUiGrediantSelect":
          this.grediantPickerProps = Object.assign(this.grediantPickerProps, this.props);
          if (!this.valueCopy && this.grediantPickerProps.gradients.length > 0) {
            this.valueCopy = this.grediantPickerProps.gradients[0].key;
          }
          break;
        case "MapgisUiInput":
          this.inputProps = Object.assign(this.inputProps, this.props);
          break;
        case "MapgisUiInputNumber":
          this.inputNumberProps = Object.assign(this.inputNumberProps, this.props);
          break;
        case "MapgisUiThemeList":
          this.listProps = Object.assign(this.listProps, this.props);
          this.listProps.colors = this.listProps.gradient.split(",");
          this.$_setThemeListDataSource("range");
          this.$nextTick(function () {
            let panel = document.getElementById(this.panelId);
            this.panelWidth = panel.offsetWidth;
            this.panelHeight = panel.offsetHeight;
          });
          break;
        case "MapgisUiThemeListUnique":
          this.listProps = Object.assign(this.listProps, this.props);
          this.$_setThemeListDataSource("unique");
          this.listProps.colors = this.$_getUniqueColors(this.listProps.gradient,this.listProps.dataSource);
          this.$nextTick(function () {
            let panel = document.getElementById(this.panelId);
            this.panelWidth = panel.offsetWidth;
            this.panelHeight = panel.offsetHeight;
          });
          break;
      }
    },
    $_getUniqueColors(color, dataSourceCopy) {
      let colors = [];
      if(dataSourceCopy && dataSourceCopy.length > 0){
        //根据渐变颜色取得所有颜色
        let colorArr = color.split(",");
        let colorArrLength = colorArr.length - 1;
        let dataLength = dataSourceCopy.length;
        let colorLength = [];
        for (let i = 0; i < colorArrLength; i++) {
          if (i === colorArrLength - 1) {
            colorLength.push(
                dataLength -
                parseInt(dataLength / colorArrLength) * (colorArrLength - 1)
            );
          } else {
            colorLength.push(parseInt(dataLength / colorArrLength));
          }
        }
        for (let i = 0; i < colorLength.length; i++) {
          colors = colors.concat(
              gradientColor(colorArr[i], colorArr[i + 1], colorLength[i])
          );
        }
      }
      return colors;
    },
    $_setThemeListDataSource(type) {
      if (type === "range" && this.listProps.dataSource) {
        if(!(this.listProps.dataSource instanceof Array)){
          let rangeLevel = this.listProps.gradient.split(",").length;
          this.listProps.dataSource = this.$_getDataByGeoJson(this.listProps.dataSource, this.listProps.field, type, rangeLevel);
        }
        this.listProps.startData = 0;
      }else {
        if (!(this.listProps.dataSource instanceof Array)){
          this.listProps.dataSource = this.$_getDataByGeoJson(this.listProps.dataSource, this.listProps.field, type);
        }
      }
    },
    $_change(e, index, extra) {
      if (this.type === "MapgisUiInput") {
        if (this.regExp) {
          let regExp = new RegExp(this.regExp);
          if (!regExp.test(this.valueCopy)) {
            this.validateStatus = "error";
          } else {
            this.validateStatus = "success";
          }
        }
      }
      if (this.type === "MapgisUiThemeList") {
        this.listProps.checkBoxArr[index] = !e;
        this.$emit("change", "MapgisUiThemeListCheckBox", !e, index, this.listProps.checkBoxArr, extra);
      } else {
        this.$emit("change", e);
      }
    },
    $_changeColorSketch(e){
      let  rgba = `rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${e.rgba.a})`;
      this.$emit("change", rgba);
    },
    $_changeColor(e, extraValue) {
      this.$set(this.listProps.colors, extraValue, e.hex);
      this.$emit("change", "MapgisUiThemeListColor", e.hex, extraValue);
    },
    $_afterChange(e) {
      this.$emit("afterChange", e);
    },
    $_pressEnter(e) {
      this.$emit("pressEnter", e);
    },
    $_blur(e) {
      this.$emit("blur", e);
    },
    $_deselect(e) {
      this.$emit("deselect", e);
    },
    $_focus(e) {
      this.$emit("focus", e);
    },
    $_inputKeydown(e) {
      this.$emit("inputKeydown", e);
    },
    $_mouseenter(e) {
      this.$emit("mouseenter", e);
    },
    $_mouseleave(e) {
      this.$emit("mouseleave", e);
    },
    $_popupScroll(e) {
      this.$emit("popupScroll", e);
    },
    $_search(e) {
      this.$emit("search", e);
    },
    $_dropdownVisibleChange(e) {
      this.$emit("dropdownVisibleChange", e);
    }
  }
}
</script>

<style scoped>
.mix-row {
  margin: 6px 0;
}

.mix-row-gradient {
  height: 15px;
  margin: 8px 0 0;
  border-radius: 3px;
}

.mix-row-gradient-select {
  width: 100%;
}

.mix-row-title {
  font-size: 12px;
  position: absolute;
  top: 8px;
}

.mix-row-color-outer {
  width: 100%;
  height: 32px;
  border-radius: 4px;
  border: 1px solid var(--border-color-base);
}

.mix-row-input-number {
  width: 100%;
}

.mix-row-list {
  width: 100%;
  height: 100%;
}

.mix-row-color {
  height: 16px;
  width: 16px;
  margin: auto;
  margin-top: 3px;
}

.mix-row-p {
  text-align: center;
  line-height: 32px;
  margin-bottom: 0;
}

.mixRowPLarge {
  line-height: 40px;
}

.mixRowPSmall {
  line-height: 24px;
}

/deep/ .m-colorPicker {
  width: 100%;
}

/deep/ .colorBtn {
  width: 96% !important;
  margin: 5px 2%;
  border-radius: 4px;
}

/deep/ .m-colorPicker .colorBtn {
  height: 20px;
}

/deep/ .mapgis-ui-select-selection-selected-value {
  width: 100%;
}
</style>