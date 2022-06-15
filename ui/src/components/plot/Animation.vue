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
            <mapgis-ui-iconfont v-else type="mapgis-plus" @click="addColor(aniParam)"></mapgis-ui-iconfont>
          </template>
          <mapgis-ui-input
            v-else-if="
              pInfo.type == 'array-number' || pInfo.type == 'array-coordinates'
            "
            :value="animationCopy[aniParam].join(',')"
            @change="changeArray($event.target.value, pInfo.type, aniParam)"
          />
        </mapgis-ui-form-item>
        <mapgis-ui-title-collapse
          :collapse="!pInfo.collapse"
          :title="pInfo.name || aniParam"
          v-if="pInfo && pInfo.type == 'object'"
          :key="'aniParam_' + idx"
          :isTitleBold="false"
          :hasBottomMargin="false"
          :hasTopMargin="false"
        >
          <mapgis-ui-form-item
            v-for="(obj, key, pIdx) in pInfo.children"
            :key="'aniObjParam_' + pIdx"
            :label="obj.name || key"
          >
            <mapgis-ui-select-panel
              v-if="obj.multi"
              v-model="animationCopy[aniParam][key]"
              :showLabel="false"
              :wrapperCol="24"
              :selectOptions="attrsItemOptions"
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
            <mapgis-ui-input
              v-else-if="obj.type == 'string'"
              v-model="animationCopy[aniParam][key]"
            />
            <mapgis-ui-sketch-color-picker
              v-else-if="obj.type === 'color'"
              :color="animationCopy[aniParam][key]"
              @change="changeColor($event, aniParam, key)"
              :disableAlpha="false"
              :showColorText="false"
            />
            <template v-else>
              <mapgis-ui-colors-setting
                v-if="
                  [
                    'compareLineColor',
                    'wallColor',
                    'wallGradColor',
                    'strokeStyle',
                    'fillGradColor',
                    'fillStyle'
                  ].indexOf(animationCopy[aniParam].attrName) > -1
                "
                v-model="animationCopy[aniParam][key]"
                :showNumber="false"
              />
              <mapgis-ui-input
                v-else
                :value="
                  animationCopy[aniParam].value &&
                    animationCopy[aniParam].value.join(',')
                "
                @change="
                  changeArray(
                    $event.target.value,
                    'array-number',
                    aniParam,
                    key
                  )
                "
              />
            </template>
          </mapgis-ui-form-item>
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
          "wallGradColor",
          "strokeStyle",
          "fillGradColor",
          "fillStyle",
          "compareLineWidth",
          "dimModHeight",
          "lineWidth"
        ];
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
      animationParams: undefined
    };
  },
  methods: {
    changeType(e) {
      this.$emit("changeType", { type: e, data: this.animationCopy });
    },
    changeArray(str, type, param, key) {
      switch (type) {
        case "array-number":
          key
            ? (this.animationCopy[param][key] = str.split(/,|，/))
            : (this.animationCopy[param] = str.split(/,|，/));
          break;
        case "array-coordinates":
          this.animationCopy[param] = this.arr1to2(str.split(/,|，/), 2);
          break;
      }
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
    addColor(param){
      this.animationCopy[param] = ["#40A9FF"]
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
      return params;
    }
  }
};
</script>
