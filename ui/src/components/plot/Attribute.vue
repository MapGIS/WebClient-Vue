<template>
  <mapgis-ui-setting-form size="default" :colon="true" layout="vertical">
    <div class="plot-attribute-panel">
      <!--设置面板-->
      <mapgis-ui-title-collapse title="符号信息">
        <mapgis-ui-form-item label="符号ID">
          <mapgis-ui-input :value="dataCopy.id" :disabled="true" />
        </mapgis-ui-form-item>
        <mapgis-ui-form-item label="符号名称">
          <mapgis-ui-input v-model="dataCopy.name" @change="changeName" />
        </mapgis-ui-form-item>
      </mapgis-ui-title-collapse>

      <mapgis-ui-title-collapse
        v-if="
          dataCopy.properties && Object.keys(dataCopy.properties).length > 0
        "
        title="基本属性"
      >
        <div v-for="(value, key, index) in dataCopy.properties" :key="index">
          <!-- <mapgis-ui-title-input
            v-if="typeof value === 'string' || typeof value === 'object'"
            :title="key + '：'"
            v-model="dataCopy.properties[`${key}`]"
            @change="changeProperties"
          />
          <mapgis-ui-title-input
            v-if="typeof value === 'number'"
            :title="key + '：'"
            v-model="dataCopy.properties[`${key}`]"
            @change="changeProperties"
            type="Number"
          /> -->

          <mapgis-ui-form-item
            :label="key"
            v-if="typeof value === 'string' || typeof value === 'object'"
          >
            <mapgis-ui-input
              v-model="dataCopy.properties[`${key}`]"
              @change="changeProperties(dataCopy.properties[`${key}`])"
            />
          </mapgis-ui-form-item>
          <mapgis-ui-input-number-panel
            v-if="typeof value === 'number'"
            :label="key + '：'"
            v-model="dataCopy.properties[`${key}`]"
            @change="changeProperties"
            size="large"
            :rangeShow="false"
            :slider="false"
          />
          <mapgis-ui-switch-panel
            v-if="typeof value === 'boolean'"
            :label="key + '：'"
            v-model="dataCopy.properties[`${key}`]"
            @changeChecked="changeProperties"
            :isTitleBold="false"
            :hasTopMargin="false"
            :hasBottomMargin="false"
            size="small"
          />
        </div>
      </mapgis-ui-title-collapse>

      <mapgis-ui-title-collapse title="切换部件">
        <mapgis-ui-space class="margin-top">
          <mapgis-ui-tooltip v-for="(t, i) in dataCopy.components" :key="i">
            <template slot="title"> {{ t.title }}</template>
            <div
              :class="{
                'tab-item': true,
                'tab-item-active': active == i
              }"
              @click="() => changeComponent(t, i)"
            >
              <!-- <slot :name="`icon_${i}`">
                <mapgis-ui-iconfont v-if="t.icon" :type="t.icon" />
              </slot> -->
              <img
                v-if="active == i"
                src="./style/images/u349.svg"
                :class="['tab-item-active-img', 'lg']"
              />
              <img
                v-if="active == i"
                src="./style/images/u350.svg"
                :class="['tab-item-active-img', 'sm']"
              />
            </div>
          </mapgis-ui-tooltip>
        </mapgis-ui-space>
      </mapgis-ui-title-collapse>

      <mapgis-ui-title-collapse
        v-if="componentStyle.TextStyle"
        title="文本样式"
      >
        <!-- <mapgis-ui-title-input
          v-if="componentStyle.TextStyle"
          title="文本内容："
          v-model="componentStyle.TextStyle.text"
          @change="changeText"
        /> -->
        <mapgis-ui-form-item label="文本内容">
          <mapgis-ui-input
            v-model="componentStyle.TextStyle.text"
            @change="changeText"
          />
        </mapgis-ui-form-item>

        <mapgis-ui-row :gutter="8">
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="颜色：">
              <mapgis-ui-sketch-color-picker
                v-if="componentStyle.TextStyle"
                v-model="componentStyle.TextStyle.color"
                @change="changeColor"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="透明度：">
              <mapgis-ui-input-number-addon
                v-if="componentStyle.TextStyle"
                v-model="componentStyle.TextStyle.opacity"
                @change="changeOpacity"
                :min="0"
                :max="1.0"
                :step="0.1"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
        </mapgis-ui-row>

        <!-- <div class="space-between">
          <mapgis-ui-col :span="11">
            <mapgis-ui-title-color-picker
              v-if="componentStyle.TextStyle"
              title="颜色："
              v-model="componentStyle.TextStyle.color"
              @change="changeColor"
            />
          </mapgis-ui-col>
          <mapgis-ui-col :span="11">
            <mapgis-ui-title-input
              v-if="componentStyle.TextStyle"
              title="透明度："
              v-model="componentStyle.TextStyle.opacity"
              @change="changeOpacity"
              type="Number"
              :min="0"
              :max="1.0"
              :step="0.1"
            />
          </mapgis-ui-col>
        </div> -->
      </mapgis-ui-title-collapse>

      <mapgis-ui-title-collapse v-if="componentStyle.LineStyle" title="线样式">
        <mapgis-ui-input-number-panel
          v-if="componentStyle.LineStyle"
          label="线宽："
          v-model="componentStyle.LineStyle.width"
          @change="changeWidth"
          size="large"
          :rangeShow="false"
          :slider="false"
          :range="[0, Infinity]"
        />
        <!-- <mapgis-ui-title-input
          v-if="componentStyle.LineStyle"
          title="线宽："
          v-model="componentStyle.LineStyle.width"
          @change="changeWidth"
          type="Number"
        /> -->
        <mapgis-ui-row :gutter="8">
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="颜色：">
              <mapgis-ui-sketch-color-picker
                v-if="componentStyle.LineStyle"
                v-model="componentStyle.LineStyle.color"
                @change="changeColor"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="透明度：">
              <mapgis-ui-input-number-addon
                v-if="componentStyle.LineStyle"
                v-model="componentStyle.LineStyle.opacity"
                @change="changeOpacity"
                :min="0"
                :max="1.0"
                :step="0.1"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
        </mapgis-ui-row>

        <mapgis-ui-row :gutter="8">
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="线端类型：">
              <mapgis-ui-select-panel
                v-if="componentStyle.LineStyle.cap"
                v-model="componentStyle.LineStyle.cap"
                @change="changeCap"
                :selectOptions="capType"
                :showLabel="false"
                :wrapperCol="24"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="拐角类型：">
              <mapgis-ui-select-panel
                v-if="componentStyle.LineStyle.join"
                v-model="componentStyle.LineStyle.join"
                @change="changeJoin"
                :selectOptions="joinType"
                :showLabel="false"
                :wrapperCol="24"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
        </mapgis-ui-row>

        <!-- <div class="space-between">
          <mapgis-ui-col :span="11">
            <mapgis-ui-title-select
              v-if="componentStyle.LineStyle.cap"
              title="线端类型："
              v-model="componentStyle.LineStyle.cap"
              :selectOptions="capType"
              @change="changeCap"
            />
          </mapgis-ui-col>
          <mapgis-ui-col :span="11">
            <mapgis-ui-title-select
              v-if="componentStyle.LineStyle.join"
              title="拐角类型："
              v-model="componentStyle.LineStyle.join"
              :dataSource="joinType"
              @change="changeJoin"
            />
          </mapgis-ui-col>
        </div> -->

        <mapgis-ui-select-panel
          v-if="componentStyle.LineStyle"
          label="衬线选项："
          v-model="componentStyle.LineStyle.compareLine"
          @change="changeCompareLine"
          :selectOptions="compareLineType"
          :wrapperCol="24"
        />
        <!-- <mapgis-ui-title-select
          v-if="componentStyle.LineStyle"
          title="衬线选项："
          v-model="componentStyle.LineStyle.compareLine"
          :dataSource="compareLineType"
          @change="changeCompareLine"
        /> -->

        <mapgis-ui-row :gutter="8">
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="衬线颜色：">
              <mapgis-ui-sketch-color-picker
                v-if="componentStyle.LineStyle"
                v-model="componentStyle.LineStyle.compareLineColor"
                @change="changeColor"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="衬线宽：">
              <mapgis-ui-input-number-addon
                v-if="componentStyle.LineStyle"
                v-model="componentStyle.LineStyle.compareLineWidth"
                @change="changeWidth"
                :min="0"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
        </mapgis-ui-row>

      </mapgis-ui-title-collapse>

      <mapgis-ui-title-collapse
        v-if="componentStyle.FillStyle"
        title="填充样式"
      >
        <mapgis-ui-row :gutter="8">
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="颜色：">
              <mapgis-ui-sketch-color-picker
                v-if="componentStyle.FillStyle"
                v-model="componentStyle.FillStyle.color"
                @change="changeColor"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="透明度：">
              <mapgis-ui-input-number-addon
                v-if="componentStyle.FillStyle"
                v-model="componentStyle.FillStyle.opacity"
                @change="changeOpacity"
                :min="0"
                :max="1.0"
                :step="0.1"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
        </mapgis-ui-row>

        <mapgis-ui-row :gutter="8">
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="边框颜色：">
              <mapgis-ui-sketch-color-picker
                v-if="componentStyle.FillStyle"
                v-model="componentStyle.FillStyle.outlineColor"
                @change="changeColor"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="边框透明度：">
              <mapgis-ui-input-number-addon
                v-if="componentStyle.FillStyle"
                v-model="componentStyle.FillStyle.outlineOpacity"
                @change="changeOpacity"
                :min="0"
                :max="1.0"
                :step="0.1"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
        </mapgis-ui-row>

        <mapgis-ui-row :gutter="8">
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="边框宽度：">
              <mapgis-ui-input-number-addon
                v-if="componentStyle.FillStyle"
                v-model="componentStyle.FillStyle.outlineWidth"
                @change="changeWidth"
                :min="0"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
          <mapgis-ui-col :span="12">
            <mapgis-ui-form-item label="边框拐角类型：">
              <mapgis-ui-select-panel
                v-if="componentStyle.FillStyle"
                v-model="componentStyle.FillStyle.outlineJoin"
                @change="changeJoin"
                :selectOptions="joinType"
                :showLabel="false"
                :wrapperCol="24"
              />
            </mapgis-ui-form-item>
          </mapgis-ui-col>
        </mapgis-ui-row>

      </mapgis-ui-title-collapse>
    </div>
  </mapgis-ui-setting-form>
</template>

<script>
export default {
  name: "mapgis-ui-plot-attribute",
  props: {
    data: {
      type: Object
    },
    config: {
      type: Object
    },
    defautLineStyle: {
      type: Object
    },
    defautFillStyle: {
      type: Object
    },
    defautTextStyle: {
      type: Object
    }
  },
  watch: {
    data: {
      handler: function(obj) {
        this.dataCopy = obj;
      },
      deep: true
    }
  },
  data() {
    return {
      dataCopy: undefined,
      componentStyle: undefined,
      active: undefined,
      // joinType: { 尖角: 0, 圆角: 1, 斜角: 2 },
      joinType: ["尖角", "圆角", "斜角"],
      // capType: { 锐利: 0, 平滑: 1, 圆整: 2 },
      capType: ["锐利", "平滑", "圆整"],
      // compareLineType: { 无衬线: 0, 内衬线: 1, 外衬线: 2, 双侧衬线: 3 },
      compareLineType: ["无衬线", "内衬线", "外衬线", "双侧衬线"],
      defautLineStyleCopy: {
        width: 1.0,
        cap: "锐利",
        join: "尖角",
        color: "#FF0000",
        opacity: 1.0,
        showWall: false,
        wallMaterial: "gradient",
        wallColor: "#FFFFFF",
        wallHeight: 1000.0,
        compareLine: "无衬线",
        compareLineColor: "#00FF00",
        compareLineWidth: 1.0
      },
      defautFillStyleCopy: {
        color: "#FFFF00",
        opacity: 1.0,
        outlineColor: "#000000",
        outlineOpacity: 1.0,
        outlineWidth: 1.0,
        outlineJoin: "尖角",
        showWall: false,
        wallMaterial: "gradient",
        wallColor: "#FFFFFF",
        wallHeight: 1000.0,
        compareLine: "无衬线",
        compareLineColor: "#00FF00",
        compareLineWidth: 1.0
      },
      defautTextStyleCopy: {
        color: "#FF0000",
        opacity: 1.0,
        text: "无标题",
        fontFamily: "Microsoft YaHei",
        fontSize: "14px",
        fontWeight: 400
      }
    };
  },
  created() {
    this.dataCopy = this.data;
    this.defautLineStyleCopy = this.defautLineStyle || this.defautLineStyleCopy;
    this.defautFillStyleCopy = this.defautFillStyle || this.defautFillStyleCopy;
    this.defautTextStyleCopy = this.defautTextStyle || this.defautTextStyleCopy;
    this.initStyle();
  },
  methods: {
    initStyle() {
      const vm = this;
      let defaultLineStyle = this.defautLineStyleCopy;
      let defautFillStyle = this.defautFillStyleCopy;
      let defautTextStyle = this.defautTextStyleCopy;
      for (let i = 0; i < vm.dataCopy.components.length; i++) {
        let style = vm.dataCopy.components[i].style;
        for (let type in style) {
          switch (type) {
            case "LineStyle":
              vm.dataCopy.components[i].style.LineStyle = Object.assign(
                defaultLineStyle,
                style[type]
              );
              break;
            case "FillStyle":
              vm.dataCopy.components[i].style.FillStyle = Object.assign(
                defautFillStyle,
                style[type]
              );
              break;
            case "TextStyle":
              vm.dataCopy.components[i].style.TextStyle = Object.assign(
                defautTextStyle,
                style[type]
              );
              break;
          }
        }
      }
      this.componentStyle = this.dataCopy.components[0].style;
    },
    changeName(e) {
      const vm = this;
      this.$emit("changeName", { name: e.target.value, data: vm.dataCopy });
    },
    changeProperties(e) {
      const vm = this;
      this.$emit("changeProperties", { property: e, data: vm.dataCopy });
    },
    changeComponent(componentInfo, index) {
      const vm = this;
      this.active = index;
      this.componentStyle = componentInfo.style;

      this.$emit("changeComponent", {
        component: componentInfo,
        index: index,
        data: vm.dataCopy
      });
    },
    changeColor(e) {
      const vm = this;
      this.$emit("changeColor", {
        color: e,
        componentStyle: vm.componentStyle
      });
    },
    changeOpacity(e) {
      const vm = this;
      this.$emit("changeOpacity", {
        opacity: e,
        componentStyle: vm.componentStyle
      });
    },
    changeWidth(e) {
      const vm = this;
      this.$emit("changeWidth", {
        width: e,
        componentStyle: vm.componentStyle
      });
    },
    changeCompareLine(e) {
      const vm = this;
      this.$emit("changeCompareLine", {
        compareLine: e,
        componentStyle: vm.componentStyle
      });
    },
    changeCap(e) {
      const vm = this;
      this.$emit("changeCap", { cap: e, componentStyle: vm.componentStyle });
    },
    changeJoin(e) {
      const vm = this;
      this.$emit("changeJoin", { join: e, componentStyle: vm.componentStyle });
    },
    changeText(e) {
      const vm = this;
      this.$emit("changeText", {
        text: e.target.value,
        componentStyle: vm.componentStyle
      });
    }
  }
};
</script>
