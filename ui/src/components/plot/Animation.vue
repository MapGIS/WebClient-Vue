<template>
  <div class="plot-animation-panel">
    <mapgis-ui-group-tab title="动画事件设置" />

    <mapgis-ui-setting-form
      layout="horizontal"
      size="default"
      :labelWidth="80"
      wrapperWidth="auto"
      :colon="false"
    >
      <mapgis-ui-form-item label="动画类型">
        <mapgis-ui-select-panel
          v-model="animationCopy.animationType"
          @change="changeType"
          :showLabel="false"
          :wrapperCol="24"
          :selectOptions="animationOptions"
        />
      </mapgis-ui-form-item>

      <!-- 动画公共属性 -->
      <template v-for="(info, param, index) in animationConfig.basicOptions">
        <mapgis-ui-form-item
          :key="'param_' + index"
          :label="info.name || param"
          v-if="animationCopy.animationType !== 'none'"
        >
          <mapgis-ui-select-panel
            v-if="info.multi"
            v-model="animationCopy[param]"
            :showLabel="false"
            :wrapperCol="24"
            :selectOptions="info.multi"
          />
          <mapgis-ui-input-number
            v-else-if="info.type == 'number'"
            v-model="animationCopy[param]"
            :min="
              info.range && info.range[0] !== (undefined || null)
                ? info.range[0]
                : -Infinity
            "
            :max="
              info.range && info.range[1] !== (undefined || null)
                ? info.range[1]
                : Infinity
            "
          />
          <mapgis-ui-input-number
            v-else-if="info.type == 'time'"
            v-model="animationCopy[param]"
            :formatter="value => `${value / 1000}s`"
            :parser="value => value.replace('s', '') * 1000"
            :min="
              info.range && info.range[0] !== (undefined || null)
                ? info.range[0]
                : -Infinity
            "
            :max="
              info.range && info.range[1] !== (undefined || null)
                ? info.range[1]
                : Infinity
            "
          />
          <mapgis-ui-input
            v-else-if="info.type == 'string'"
            v-model="animationCopy[param]"
          />
        </mapgis-ui-form-item>
      </template>

      <!-- 各动画特有属性 -->
      <template
        v-for="(pInfo, aniParam, idx) in animationConfig.animations[
          animationCopy.animationType
        ].options"
      >
        <mapgis-ui-form-item
          :key="'aniParam_' + idx"
          :label="pInfo.name || aniParam"
          v-if="pInfo && pInfo.type != 'object'"
        >
          <mapgis-ui-select-panel
            v-if="pInfo.multi"
            v-model="animationCopy[aniParam]"
            :showLabel="false"
            :wrapperCol="24"
            :selectOptions="pInfo.multi"
          />
          <mapgis-ui-input-number
            v-else-if="pInfo.type == 'number'"
            v-model="animationCopy[aniParam]"
            :min="
              pInfo.range && pInfo.range[0] !== (undefined || null)
                ? pInfo.range[0]
                : -Infinity
            "
            :max="
              pInfo.range && pInfo.range[1] !== (undefined || null)
                ? pInfo.range[1]
                : Infinity
            "
          />
          <mapgis-ui-input-number
            v-else-if="pInfo.type == 'time'"
            v-model="animationCopy[aniParam]"
            :formatter="value => `${value / 1000}s`"
            :parser="value => value.replace('s', '') * 1000"
            :min="
              pInfo.range && pInfo.range[0] !== (undefined || null)
                ? pInfo.range[0]
                : -Infinity
            "
            :max="
              pInfo.range && pInfo.range[1] !== (undefined || null)
                ? pInfo.range[1]
                : Infinity
            "
          />
          <mapgis-ui-input
            v-else-if="pInfo.type == 'string'"
            v-model="animationCopy[aniParam]"
          />
          <mapgis-ui-switch-panel
            v-else-if="pInfo.type == 'boolean'"
            v-model="animationCopy[aniParam]"
            label=""
            size="small"
            :hasBottomMargin="false"
            :hasTopMargin="false"
          />
          <template v-else-if="pInfo.type == 'array-color'">
            <mapgis-ui-colors-setting
              v-if="animationCopy[aniParam].length > 0"
              v-model="animationCopy[aniParam]"
              :showNumber="false"
            />
            <mapgis-ui-iconfont
              v-else
              type="mapgis-plus"
              @click="addColor(aniParam)"
            ></mapgis-ui-iconfont>
          </template>
          <mapgis-ui-input
            v-else-if="pInfo.type == 'array-number'"
            :value="animationCopy[aniParam].join(',')"
            @change="changeArray($event.target.value, aniParam)"
          />
          <mapgis-ui-button
            v-else-if="pInfo.type == 'array-coordinates'"
            @click="drawPath"
            >绘制路径</mapgis-ui-button
          >
        </mapgis-ui-form-item>

        <!-- 类型为对象的动画属性 -->
        <mapgis-ui-title-collapse
          :collapse="!pInfo.collapse"
          :title="pInfo.name || aniParam"
          v-if="pInfo && pInfo.type == 'object'"
          :key="'aniParam_' + idx"
          :isTitleBold="false"
          :hasBottomMargin="false"
          :hasTopMargin="false"
        >
          <template v-for="(obj, key, pIdx) in pInfo.children">
            <mapgis-ui-form-item
              :key="'aniObjParam_' + pIdx"
              :label="obj.name || key"
              v-if="animationCopy[aniParam][key]"
            >
              <!-- 选择属性动画属性名称的ui组件 -->
              <mapgis-ui-select-panel
                v-if="obj.multi && key == 'attrName'"
                v-model="animationCopy[aniParam][key]"
                @change="changeAttrName(aniParam, key)"
                :showLabel="false"
                :wrapperCol="24"
                :selectOptions="attrsItemOptions"
              />
              <mapgis-ui-select-panel
                v-else-if="obj.multi"
                v-model="animationCopy[aniParam][key]"
                :showLabel="false"
                :wrapperCol="24"
                :selectOptions="obj.multi"
              />
              <mapgis-ui-input-number
                v-else-if="obj.type == 'number'"
                v-model="animationCopy[aniParam][key]"
                :min="
                  obj.range && obj.range[0] !== (undefined || null)
                    ? obj.range[0]
                    : -Infinity
                "
                :max="
                  obj.range && obj.range[1] !== (undefined || null)
                    ? obj.range[1]
                    : Infinity
                "
              />
              <mapgis-ui-input-number
                v-else-if="obj.type == 'time'"
                v-model="animationCopy[aniParam][key]"
                :formatter="value => `${value / 1000}s`"
                :parser="value => value.replace('s', '') * 1000"
                :min="
                  obj.range && obj.range[0] !== (undefined || null)
                    ? obj.range[0]
                    : -Infinity
                "
                :max="
                  obj.range && obj.range[1] !== (undefined || null)
                    ? obj.range[1]
                    : Infinity
                "
              />
              <!-- 属性部件名称处理 -->
              <mapgis-ui-select-panel
                v-else-if="obj.type == 'string' && key == 'ids'"
                v-model="animationCopy[aniParam][key]"
                :showLabel="false"
                :wrapperCol="24"
                :selectOptions="idsOptions"
              />
              <mapgis-ui-input
                v-else-if="obj.type == 'string' && key != 'ids'"
                v-model="animationCopy[aniParam][key]"
              />
              <mapgis-ui-sketch-color-picker
                v-else-if="obj.type === 'color'"
                :color="animationCopy[aniParam][key]"
                @change="changeColor($event, aniParam, key)"
                :disableAlpha="false"
                :showColorText="false"
              />
              <!-- 展示属性动画属性值的ui组件 -->
              <template v-else-if="aniParam == 'attrsItem' && key == 'value'">
                <!-- 选择的属性的值为颜色类型时 -->
                <template
                  v-if="
                    attrsItemColorOptions.indexOf(
                      animationCopy[aniParam].attrName
                    ) > -1
                  "
                >
                  <mapgis-ui-iconfont
                    v-if="
                      animationCopy[aniParam][key] == undefined ||
                        animationCopy[aniParam][key].length == 0
                    "
                    type="mapgis-plus"
                    @click="addColor(aniParam, key)"
                  ></mapgis-ui-iconfont>
                  <mapgis-ui-colors-setting
                    v-else
                    v-model="animationCopy[aniParam][key]"
                    :showNumber="false"
                  />
                </template>
                <!-- 选择的属性的值为数值类型时 -->
                <mapgis-ui-input
                  v-else
                  placeholder="请输入以逗号分隔的数值序列，如：8, 20, 15, 8"
                  :value="
                    animationCopy[aniParam].value &&
                      animationCopy[aniParam].value.join(',')
                  "
                  @change="changeArray($event.target.value, aniParam, key)"
                />
              </template> </mapgis-ui-form-item
          ></template>
        </mapgis-ui-title-collapse>
      </template>
    </mapgis-ui-setting-form>
  </div>
</template>

<script>
import config from "./test/animationConfig.json";
import { rgbToHex } from "../../util/common/color-util.js";

export default {
  name: "mapgis-ui-plot-animation",
  props: {
    animation: {
      type: Object,
      required: true
    },
    animationConfig: {
      type: Object,
      default: () => {
        return config;
      }
    },
    animationOptions: {
      type: Object,
      default: () => {
        return {
          none: "无动画",
          "scale-animation": "比例动画",
          "attribute-animation": "属性动画",
          "visible-animation": "显隐动画",
          "blink-animation": "闪烁动画",
          "grow-animation": "生长动画",
          "path-animation": "路径动画"
        };
      }
    },
    attrsItemOptions: {
      type: Array,
      default: () => {
        return [
          "compareLineColor",
          "wallColor",
          // "wallGradColor",
          "strokeStyle",
          // "fillGradColor",
          "fillStyle",
          "compareLineWidth",
          "dimModHeight",
          "lineWidth"
        ];
      }
    },
    attrsItemColorOptions: {
      type: Array,
      default: () => {
        return [
          "compareLineColor",
          "wallColor",
          // "wallGradColor",
          "strokeStyle",
          // "fillGradColor",
          "fillStyle"
        ];
      }
    },
    idsOptions: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  // model: {
  //   prop: "animation",
  //   event: "change"
  // },
  watch: {
    animation: {
      handler: function(obj) {
        this.animationCopy = this.initData(obj);
      },
      deep: true,
      immediate: true
    },
    animationCopy: {
      handler: function(obj) {
        this.$emit("change", obj);
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      animationCopy: undefined,
      basicParams: undefined,
      animationParams: undefined,
      defaultColor: "rgba(64,169,255,0.5)"
    };
  },
  methods: {
    changeType(e) {
      this.animationCopy = this.initData(this.animationCopy);
      this.$emit("changeType", { type: e, data: this.animationCopy });
    },
    changeArray(str, param, key) {
      let strArr = str.split(/,|，/);
      // 字符串转数字
      let arr = strArr.map(Number);
      key
        ? (this.animationCopy[param][key] = arr)
        : (this.animationCopy[param] = arr);
    },
    drawPath() {
      this.$emit("drawPath");
    },
    /**一维数组转为二维数组 */
    arr1to2(arr, number) {
      var arr2 = [];
      let len = arr.length;
      for (let i = 0, j = 0; i < len; i += number, j++) {
        arr2[j] = arr.splice(0, number);
      }
      return arr2;
    },
    changeColor(color, param, key) {
      this.animationCopy[param][key] = rgbToHex(color);
    },
    addColor(param, key) {
      if (key) {
        this.animationCopy[param][key] = [this.defaultColor];
        return;
      }
      this.animationCopy[param] = [this.defaultColor];
    },
    // 根据选择的属性类型给属性值赋值
    changeAttrName(aniParam, key) {
      let val = this.animationCopy[aniParam].value;
      if (
        this.attrsItemColorOptions.indexOf(this.animationCopy[aniParam][key]) >
        -1
      ) {
        if (val && typeof val[0] == "string") {
          this.animationCopy[aniParam].value = val;
          return;
        }
        this.animationCopy[aniParam].value = [this.defaultColor];
      } else {
        if (val && typeof val[0] == "number") {
          this.animationCopy[aniParam].value = val;
          return;
        }
        this.animationCopy[aniParam].value = [];
      }
    },
    /**处理传入的动画数据 */
    initData(data) {
      if (!data) return;
      const vm = this;
      this.basicParams = this.basicParams || this.initBasicParams();
      this.animationParams = this.initAnimatioParams(data.animationType);
      let params = { ...vm.basicParams, ...vm.animationParams };
      return Object.assign(params, data);
    },
    initBasicParams() {
      let paramsInfo = this.animationConfig.basicOptions;
      let basicParams = {};
      for (var param in paramsInfo) {
        basicParams[param] = paramsInfo[param].default;
      }
      return basicParams;
    },
    initAnimatioParams(type) {
      let paramsInfo = this.animationConfig.animations[type].options;
      let params = {};
      for (var param in paramsInfo) {
        params[param] = paramsInfo[param].default;
      }
      if (type == "attribute-animation") {
        params.attrsItem.attrName =
          params.attrsItem.attrName || this.attrsItemColorOptions[0];
        params.attrsItem.ids = params.attrsItem.ids || this.idsOptions[0];
      }
      return params;
    }
  }
};
</script>
