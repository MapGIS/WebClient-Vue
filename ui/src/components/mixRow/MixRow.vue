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
        <div class="mix-row-color-outer" :style="mainStyle">
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
        <mapgis-ui-input
          v-model="valueCopy"
          :placeholder="inputProps.placeholder"
          :addonAfter="inputProps.addonAfter"
          :addonBefore="inputProps.addonBefore"
          :disabled="disabled"
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
    <mapgis-ui-color-picker-setting
        v-if="type === 'MapgisUiColorPickerSetting'"
    />
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
                :colorStyle="listProps.style"
            />
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
    <mapgis-ui-row class="mix-row" :style="{width: panelWidth + 'px', height: panelHeight + 'px'}"
                   v-if="type === 'MapgisUiThemeList' || type === 'MapgisUiThemeListSymbol'">
      <div class="mix-row-theme-list-title">
        <mapgis-ui-row type="flex">
          <mapgis-ui-col :span="type === 'MapgisUiThemeList' ? 4 : 2">
            <p v-if="type === 'MapgisUiThemeList'" class="mix-row-list-p" style="padding-left: 12px;">颜色</p>
            <p v-if="type === 'MapgisUiThemeListSymbol'" class="mix-row-list-p" style="padding-left: 12px;">半径</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="type === 'MapgisUiThemeList' ? 4 : 4">
            <p class="mix-row-list-p" :style="{paddingLeft: type === 'MapgisUiThemeList' ? '8px' : '8px'}">字段名</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="type === 'MapgisUiThemeList' ? 12 : 14">
            <p class="mix-row-list-p" style="padding-left: 0px;">分段值</p>
          </mapgis-ui-col>
          <mapgis-ui-col :span="type === 'MapgisUiThemeList' ? 4 : 4">
            <p class="mix-row-list-p" :style="{paddingLeft: type === 'MapgisUiThemeList' ? '12px' : '4px'}">操作</p>
          </mapgis-ui-col>
        </mapgis-ui-row>
      </div>
      <mapgis-ui-list
          :data-source="listProps.dataSource"
      >
        <mapgis-ui-empty
            :image="defaultImage"
            :description="false"
            v-if="!listProps.dataSource || listProps.dataSource.length === 0"
        >
          <span>暂无数据</span>
        </mapgis-ui-empty>
        <mapgis-ui-list-item slot="renderItem" slot-scope="item,index">
          <div class="mix-row-list">
            <mapgis-ui-row :class="{mixRowSmall: listProps.size === 'small'}">
              <mapgis-ui-col :span="type === 'MapgisUiThemeList' ? 4 : 2"
                             v-if="listProps.colors && listProps.colors.length > 0"
              >
                <mapgis-ui-sketch-color-picker
                    :extraValue="index"
                    :color="listProps.colors[index]"
                    :size="listProps.size"
                    :showBorder="customProps.showBorder"
                    :showColorText="customProps.showColorText || false"
                    :colorStyle="listProps.style"
                    @input="$_changeColor"
                    v-if="type === 'MapgisUiThemeList'"
                >
                  <div class="mix-row-color" :style="{background: listProps.colors[index]}"/>
                </mapgis-ui-sketch-color-picker>
                <div v-if="type === 'MapgisUiThemeListSymbol'" class="mix-row-radius-img-out">
                  <img class="mix-row-radius-img"
                       src="data:image/png;base64,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"
                       title="半径"
                       @click="$_showRadius(index)"
                  >
                </div>
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <p class="mix-row-p"
                   :title="listProps.field"
                   :class="{mixRowPLarge: listProps.size === 'large',mixRowPSmall: listProps.size === 'small'}">
                  {{ listProps.field }}</p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="type === 'MapgisUiThemeList' ? 16 : 18">
                <mapgis-ui-row>
                  <mapgis-ui-col :span="8">
                    <mapgis-ui-input-number
                        v-model="listProps.startData"
                        v-bind:title="String(listProps.startData)"
                        v-if="index === 0"
                        @change="$_inputChange(index)"
                        :size="listProps.size"
                        class="mix-row-input"
                    />
                    <mapgis-ui-input-number
                        v-model="listProps.dataSource[index - 1]"
                        v-bind:title="String(listProps.dataSource[index - 1])"
                        v-if="index > 0"
                        @change="$_inputChange(index)"
                        :size="listProps.size"
                        class="mix-row-input"
                    />
                  </mapgis-ui-col>
                  <mapgis-ui-col :span="2">
                    <p class="mix-row-p"
                       style="padding-left: 6px"
                       :class="{mixRowPLarge: listProps.size === 'large',mixRowPSmall: listProps.size === 'small'}">
                      ~</p>
                  </mapgis-ui-col>
                  <mapgis-ui-col :span="8">
                    <mapgis-ui-input-number
                        v-model="listProps.dataSource[index]"
                        v-bind:title="String(listProps.dataSource[index])"
                        @change="$_inputChange(index)"
                        :size="listProps.size"
                        class="mix-row-input"
                    />
                  </mapgis-ui-col>
                  <mapgis-ui-col :span="6">
                    <img class="mix-row-add"
                         :class="{mixRowImgSmall: listProps.size === 'small',mixRowLarge: listProps.size === 'large'}"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABEZJREFUWEe1V01sVUUU/s68vtomxY2BWMVEEwNRU9/rzLxdVVi4EAjGRdlIVARd4EZAILIBE6PBqDX4kxjE/7iAhbHiT2IMGOvGzkxfjaXWhXHhT6CykSZN2r45Zl7ufbnvcu/70Xo3792ZM9/57jlnvjlD6PJxzq313t8khFgP4GZmvgbAvBDiEjNPSinnu4GkTowjp6NCiFFm3tRqDTN/BuDzYrE4XiqVfmuH35JAcMzMxwCMAljbDiw1fxnA+0T0npRyOm9tLoHJyclNQoiTAG7t0nGW+T6l1CtZE5kEjDF7iej19AIi+sp7P0tEF4hoFsCs956ZeWOhUNgYfoko/N6f4eyYUuqZqzDTA9baRwC8kxwnoovM/KxS6rVOomGM2UNEJwD0p+x3KaXebcJOvhhjRonodGrRB729vQeHhoYupp2HGgljWZVvjBkkoi8B3Jlcx8w7tNZn4rFGCpxzJWauppxkhi3YGGMOENHh8J+Zj2utX8qKjrX2KIBQyI2HiMpxYTYIWGtfBrAvYTeulMrKZd3EOXcu3pJEdF5KuTkvPc6555j56cT8mFJqf3ivE5ienl6/srISvv666IvC/r1Xa/1TC9COCQQMa60BoCK8yz09PeWgE3UC1tqDAF6InTHzg1rrj1oVXDcRiHw8DuDNBOZ+pdRYTOB7AJVo8lOl1PZWzrtNQYxljPmFiG6phz5KGznnbmfmmaz8rGYEItInmXlPjNvX1zcYCGxn5k8S4X9Ca/3G/xGBSF3PxdhCiK2BwKPMfCoe9N5vrlQq56O87SSi3Xlkkrughc0ppdSHYb5arW6o1WpzCdtdZK09BOB4PEhE64KwVKvVG2u1WpDbNe2i0Wb+SqFQuK1cLv8+MTGxpr+//++E/aFAoGkHLC4uXjsyMnIlOglDbXR7Cqb5zBPRHeGj8gg0aX84VMrl8s8BJaidEGLbf0mB9/5srJKZKZiamtrivQ9NRP1J1sBq74K8IgxNx6XELngqT9eThLoVomgbvsjMB5L1VhciY8xZItoaCcQZKeWOdoX3bwgYY+aIaEPADq2b1npbTKCpASGiLVLKL1YzBdbaJilm5rreZB5GAL5VSt29ygTyD6NIdJqOYyJqmYpuUuCcO83MobGNn+bjOCqQrhoSa+1OALFk743VLh21jhuSKApPAhhLghDR81LKI1npCGoZxoPKZc1nNCKh+B7TWr/V2AmdMA41ERFpWZgxlnPuvqgDuiuFf1gp1eg76rsui3lWZxzZfRwaKO/9N8Vi8Y+FhYU/w/jAwMDg8vLyDUKIewCUADyQwv0rHGpSyvG0v9yLSU6H3E4erppn5jlm3l2pVL7LWtzuahYK82EAD8X9YhcMFgG8WigUTuTVSG4K0k6ipjXcGULz0u5y+iMRfQ3gbaXUD+0Id3Q7ToLMzMxcv7S0JL336xJHdf16DuDC8PDwr+2cJuf/AZGKXgkO+31+AAAAAElFTkSuQmCC"
                         @click="$_addRange(index)"
                         title="新增分段">
                    <img class="mix-row-add"
                         :class="{mixRowImgSmall: listProps.size === 'small',mixRowLarge: listProps.size === 'large'}"
                         src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA7lJREFUWEfFV02MFEUU/l737GGJSIzIBXCBgwknd7qK2T2sXOCKikYhKMarJGtI9OJP5CeAF0kIG+BqFAgL/nLGi+5hd6zXs55MPAiiXgBDlkXmsNP9SE26NzU93Ts725tQSV+q3qvv66qv6n1FWGabmppaOzg4uBvAPgAviMh6InrWpovIf0R0D8AfACabzeaNsbGx+eVMTb2CmHk7EY2LyH4Az/SKT8bvE9EVEZlQSv2+VM6SBJj5BIBxAE8vEzgb9gCAJfFpUX4hAWb+GcBLKwTOpv2ilNqZN1cuAWa+C2B9NkFE5omo7ny/JhrYISK19COitTlg95RSz2X7uwgw800AW3ImuNhqtT4bGRmx44VtZmZma6VSOQ7g7ZygW0qprW5/B4EwDK+KyBuZRLsa40qpyX62g5ntaZkA0PHXRHQtCII307kWCSSC+yQDclQpdawf4GwsMx8BcDTTfzIVZpuAPWoApl21i8hNrfW2MuBprjHmTyJyl96ejlF7RNsEwjA8LyLvuWBRFNVqtVpbZGVbvV7f4ft+vWPviS4EQXCIjDHriOgvAOvSABE5rbX+sCywm2+M+YKIPnD65kRkiMIwPCgiXzkDDxcWFraPjo7+s5oEpqenNw0MDNhb8alFARK9Q8z8DYDXHbDCS6MsoZzL7VtLIARQdZZ/Qmv9flmwvHxjzFlbV5yxhtXAbSLa7BB4S2t9udFobInj2B6hd0uSuaSUal9KxpgDRHTJwfrbrsD/ANY4nUNa69vMfA7AoZLgaXr7PjHGPJ8IPu1/1EXA9/1Nw8PD/xZcICvl0yYwOzu7MYoiV9yPurbA87y91Wr1B4vEzNcB7FkpapL3ped5x6rV6q1Go/FqHMffZ7egQ4RE9HkQBB+XBM1ND8PwlIh81CFCZr6S2Ky0/yellLVeq96Y+QaAXc7Ek1YDewF85yzLfBRFL/Yqu/2ys2Xa9/3fMl7hNUrMpr2KXb93USl1sF+QpeKZ+euMR7jfbDaHCosRgP39eoAiAok3sFu92CgtRonau8oxgLtKqQ2rsQrMfCdjTDrLcULCOuAnY0jSv8xzwtaYxHG8r19vYD2A53mTGSNioTqKXZ4pLXLEp1ut1pleZdqW3UqlcjhT+9N/7HLGRba8yBk/BNAQkdnEwk0lM49Zi0VEw0llXaz5joa6HLEdK3yYFDjkFWky64Q7TkOPs/vknmaOMNPH6QHXN/ZYijkiulz6ceqCWPPqed7LIvIKgG0Fz3Nrv3+M4/i61npuOfv1GEgrvUth6rD9AAAAAElFTkSuQmCC"
                         @click="$_deleteRange(index)"
                         title="删除分段">
                  </mapgis-ui-col>
                </mapgis-ui-row>
              </mapgis-ui-col>
            </mapgis-ui-row>
            <mapgis-ui-row v-show="listProps.radiusArray[index]" :class="{mixRowSmall: listProps.size === 'small'}">
              <mapgis-ui-col :span="3">
                <p :style="{paddingBottom: listProps.size === 'small' ? 'none' : '1em'}" style="padding-left: 12px">
                  半径
                </p>
              </mapgis-ui-col>
              <mapgis-ui-col :span="17">
                <mapgis-ui-slider
                    v-model="listProps.radius[index]"
                    @change="$_sliderChange(index)"
                    class="mix-row-radius-slider"
                />
              </mapgis-ui-col>
              <mapgis-ui-col :span="4">
                <mapgis-ui-input-number
                    v-model="listProps.radius[index]"
                    @change="$_sliderChange(index)"
                    :size="listProps.size"
                    style="width: 70%"
                />
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
import Empty from "ant-design-vue/es/empty/index";

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
        titleCol: 7,
        inputCol: 17,
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
        size: undefined,
        style: {
          width: "62px",
          marginLeft: "11px"
        },
        rangeLevel: 0,
        radiusArray: [],
        radius: 4
      },
      colorId: "colorId" + parseInt(Math.random() * 100000),
      panelWidth: undefined,
      panelHeight: undefined,
      defaultImage: Empty.PRESENTED_IMAGE_SIMPLE
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
          showBorder: true,
          showColorText: false
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
    },
    /**
     * 错误检查样式
     * */
    formStyle: {
      type: Object,
      default() {
        return {
          marginBottom: "0"
        };
      }
    },
    /**
     * 是否禁用input
     * */
    disabled: {
      type: Boolean,
      default: false
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
    }
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
      let dataSourceCopy = [], newDataSourceCopy = [];
      if (!GeoJSON) {
        return;
      }
      let features = GeoJSON.features
      //因为一张图无法取得字段名，因此暂时这样写
      key = Object.keys(features[0].properties)[1];
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
        case "MapgisUiThemeListSymbol":
        case "MapgisUiThemeList":
          this.listProps = Object.assign(this.listProps, this.props);
          this.listProps.colors = this.listProps.gradient.split(",");
          this.listProps.rangeLevel = this.listProps.colors.length;
          if (this.type === "MapgisUiThemeListSymbol") {
            this.listProps.radiusArray = [];
            for (let i = 0; i < this.listProps.rangeLevel; i++) {
              this.listProps.radiusArray.push(false);
            }
            if (!(this.listProps.radius instanceof Array)) {
              let radius = this.listProps.radius;
              this.listProps.radius = [];
              for (let i = 0; i < this.listProps.rangeLevel; i++) {
                this.listProps.radius.push(radius);
              }
            }
          }
          this.$_setThemeListDataSource("range");
          this.$nextTick(function () {
            let panel = document.getElementById(this.panelId);
            this.panelWidth = panel.offsetWidth;
            // this.panelHeight = panel.offsetHeight;
          });
          break;
        case "MapgisUiThemeListUnique":
          this.listProps = Object.assign(this.listProps, this.props);
          this.$_setThemeListDataSource("unique");
          this.listProps.colors = this.$_getUniqueColors(this.listProps.gradient, this.listProps.dataSource);
          this.$nextTick(function () {
            let panel = document.getElementById(this.panelId);
            this.panelWidth = panel.offsetWidth;
            // this.panelHeight = panel.offsetHeight;
          });
          break;
      }
    },
    $_getUniqueColors(color, dataSourceCopy) {
      let colors = [];
      if (dataSourceCopy && dataSourceCopy.length > 0) {
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
        if (!(this.listProps.dataSource instanceof Array)) {
          let rangeLevel = this.listProps.gradient.split(",").length;
          this.listProps.dataSource = this.$_getDataByGeoJson(this.listProps.dataSource, this.listProps.field, type, rangeLevel);
        }
        this.listProps.startData = 0;
      } else {
        if (!(this.listProps.dataSource instanceof Array)) {
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
        if (e instanceof Object) {
          this.$emit("change", e.target.value);
        } else {
          this.$emit("change", e);
        }
      }
    },
    $_changeColorSketch(e) {
      let rgba = `rgba(${e.rgba.r}, ${e.rgba.g}, ${e.rgba.b}, ${e.rgba.a})`;
      this.$emit("change", rgba);
    },
    $_inputChange(index) {
      if (index === 0) {
        if (this.listProps.dataSource[index] <= this.listProps.startData || this.listProps.dataSource[index] >= this.listProps.dataSource[index + 1]) {
        }
      } else if (index < this.listProps.dataSource.length - 1) {
        if (this.listProps.dataSource[index] <= this.listProps.dataSource[index - 1] || this.listProps.dataSource[index] >= this.listProps.dataSource[index + 1]) {
        }
      } else {
        if (this.listProps.dataSource[index] <= this.listProps.dataSource[index - 1]) {
        }
      }
      this.$emit("change", this.type);
    },
    $_sliderChange(index) {
      this.$emit("change", this.type);
      this.$nextTick(() => {
        this.$set(this.listProps.radiusArray, index, !this.listProps.radiusArray[index]);
      })
    },
    $_addRange(index) {
      let startData;
      if (index === 0) {
        startData = this.listProps.startData;
      } else {
        startData = Number(this.listProps.dataSource[index - 1]);
      }
      let endData = Number(this.listProps.dataSource[index]);
      if (index < this.listProps.dataSource.length - 1) {
        if (startData < endData) {
          let addNum = (startData + endData) / 2;
          this.listProps.dataSource.splice(index, 0, addNum);
          this.listProps.rangeLevel++;
          let newColors = gradientColor(this.listProps.colors[index], this.listProps.colors[index + 1], 2);
          this.listProps.colors.splice(index + 1, 0, newColors[1]);
        }
      } else {
        let addNum;
        if (this.listProps.dataSource[index - 1]) {
          addNum = (this.listProps.dataSource[index] - this.listProps.dataSource[index - 1]) + this.listProps.dataSource[index];
        } else {
          addNum = 2;
        }
        this.listProps.dataSource.push(addNum);
        this.listProps.rangeLevel++;
        this.listProps.colors.splice(index + 1, 0, this.listProps.colors[index]);
      }
      this.listProps.radiusArray.splice(index + 1, 0, false);
      // this.listProps.radius.splice(index + 1, 0, this.listProps.radius[index]);
      this.$emit("change", this.type);
    },
    $_deleteRange(index) {
      if (this.listProps.rangeLevel > 2) {
        this.listProps.dataSource.splice(index, 1);
        this.listProps.rangeLevel--;
        this.listProps.colors.splice(index, 1);
      }
      this.$emit("change", this.type);
    },
    $_changeColor(e, extraValue) {
      this.$set(this.listProps.colors, extraValue, e.hex);
      this.$emit("change", "MapgisUiThemeListColor", e.hex, extraValue);
    },
    $_showRadius(index) {
      this.$set(this.listProps.radiusArray, index, !this.listProps.radiusArray[index]);
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
  margin: 8px 0;
}

.mixRowSmall {
  padding: 6px 0;
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
  font-size: 14px;
  position: absolute;
  top: 8px;
  color: var(--heading-color);
}

.mix-row-color-outer {
  width: 100%;
  height: 32px;
  border-radius: 4px;
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
  cursor: pointer;
}

.mix-row-p {
  text-align: left;
  line-height: 32px;
  margin-bottom: 0;
  padding-left: 12px;
}

.mix-row-list-p {
  text-align: left;
  line-height: 32px;
  margin-bottom: 0;
}

.mixRowPLarge {
  line-height: 40px;
}

.mixRowPSmall {
  line-height: 24px;
}

.mix-row-add {
  margin-top: 6px;
  margin-left: 9px;
  cursor: pointer;
}

.mixRowLarge {
  margin-top: 4px;
}

.mixRowImgSmall {
  width: 18px;
  margin-top: -4px;
  margin-left: 12px;
}

.mix-row-input {
  width: 100%;
}

.mix-row-theme-list-title {
  width: 100%;
  height: 30px;
  border-bottom: 1px solid var(--border-color-split);
}

.mix-row-radius-img-out {
  cursor: pointer;
  width: 100%;
  height: 100%;
  padding-left: 12px;
}

.mix-row-radius-img {
  width: 19px;
}

.mix-row-radius-slider {
  margin-top: 6px;
  margin-left: -5px;
  margin-right: 10px;
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

/deep/ .mapgis-ui-list-item {
  padding: 0;
}
</style>
