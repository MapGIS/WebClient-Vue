<template>
  <div class="plot-attribute-panel">
    <mapgis-ui-setting-form size="default" :colon="true" layout="vertical">
      <!--设置面板-->
      <template v-for="(collapse, grpIdx) in groupArr">
        <mapgis-ui-title-collapse
          :key="grpIdx"
          :title="collapse.label"
          v-show="group && group[grpIdx]"
        >
          <mapgis-ui-row :gutter="8">
            <!-- 基本属性和公共的样式属性 -->
            <template v-for="(value, key, dataIdx) in dataCopy">
              <div
                v-if="
                  styleAttributesUIConfig[key] &&
                    collapse.id === styleAttributesUIConfig[key].groupId
                "
                :key="dataIdx"
              >
                <mapgis-ui-col
                  :span="24"
                  v-if="styleAttributesUIConfig[key].type === 'nodes'"
                >
                  <mapgis-ui-space class="margin-top">
                    <mapgis-ui-tooltip
                      v-for="(nodes, name, ndIdx) in value"
                      :key="ndIdx"
                    >
                      <template slot="title"> {{ name }}</template>
                      <div
                        :class="{
                          'tab-item': true,
                          'tab-item-active': active == ndIdx
                        }"
                        @click="() => changeComponent(nodes, name, ndIdx)"
                      >
                        <img
                          v-if="active == ndIdx"
                          src="./style/images/u349.svg"
                          :class="['tab-item-active-img', 'lg']"
                        />
                        <img
                          v-if="active == ndIdx"
                          src="./style/images/u350.svg"
                          :class="['tab-item-active-img', 'sm']"
                        />
                      </div>
                    </mapgis-ui-tooltip>
                  </mapgis-ui-space>
                </mapgis-ui-col>

                <mapgis-ui-col :span="12" v-else>
                  <mapgis-ui-form-item
                    :label="styleAttributesUIConfig[key].title"
                  >
                    <mapgis-ui-sketch-color-picker
                      v-if="styleAttributesUIConfig[key].type === 'color'"
                      v-model="dataCopy[key]"
                      @change="changeStyle(key, $event)"
                      :disableAlpha="false"
                      :showColorText="false"
                    />
                    <mapgis-ui-input-number-addon
                      v-if="styleAttributesUIConfig[key].type === 'number'"
                      v-model="dataCopy[key]"
                      @change="changeStyle(key, $event)"
                      :min="
                        styleAttributesUIConfig[key].range
                          ? styleAttributesUIConfig[key].range[0]
                          : -Infinity
                      "
                      :max="
                        styleAttributesUIConfig[key].range
                          ? styleAttributesUIConfig[key].range[1]
                          : Infinity
                      "
                      :step="styleAttributesUIConfig[key].step || 1"
                      :disabled="styleAttributesUIConfig[key].disabled || false"
                    />
                    <mapgis-ui-input
                      v-if="styleAttributesUIConfig[key].type === 'text'"
                      v-model="dataCopy[key]"
                      @change="changeStyle(key, $event.target.value)"
                      :disabled="styleAttributesUIConfig[key].disabled || false"
                    />
                    <mapgis-ui-switch-panel
                      v-if="styleAttributesUIConfig[key].type === 'boolean'"
                      v-model="dataCopy[key]"
                      @changeChecked="changeStyle(key, $event)"
                      :showLabel="false"
                      :isTitleBold="false"
                      :hasTopMargin="false"
                      :hasBottomMargin="false"
                      size="small"
                    />
                    <mapgis-ui-select-panel
                      v-if="styleAttributesUIConfig[key].type === 'select'"
                      v-model="dataCopy[key]"
                      @change="changeStyle(key, $event)"
                      :selectOptions="styleAttributesUIConfig[key].options"
                      :showLabel="false"
                      :wrapperCol="24"
                    />
                  </mapgis-ui-form-item>
                </mapgis-ui-col>
              </div>
            </template>
            <!-- 部件的样式属性 -->
            <template
              v-for="(val, k, styleIdx) in dataCopy[nodesName][componentName]"
            >
              <mapgis-ui-col
                :span="12"
                v-if="
                  styleAttributesUIConfig[k] &&
                    collapse.id === styleAttributesUIConfig[k].groupId
                "
                :key="styleIdx"
              >
                <mapgis-ui-form-item :label="styleAttributesUIConfig[k].title">
                  <mapgis-ui-sketch-color-picker
                    v-if="styleAttributesUIConfig[k].type === 'color'"
                    v-model="dataCopy[nodesName][componentName][k]"
                    @change="changeComponentStyle(k, $event)"
                    :disableAlpha="false"
                    :showColorText="false"
                  />
                  <mapgis-ui-input-number-addon
                    v-if="styleAttributesUIConfig[k].type === 'number'"
                    v-model="dataCopy[nodesName][componentName][k]"
                    @change="changeComponentStyle(k, $event)"
                    :min="
                      styleAttributesUIConfig[k].range
                        ? styleAttributesUIConfig[k].range[0]
                        : -Infinity
                    "
                    :max="
                      styleAttributesUIConfig[k].range
                        ? styleAttributesUIConfig[k].range[1]
                        : Infinity
                    "
                    :step="styleAttributesUIConfig[k].step || 1"
                    :disabled="styleAttributesUIConfig[k].disabled || false"
                  />
                  <mapgis-ui-input
                    v-if="styleAttributesUIConfig[k].type === 'text'"
                    v-model="dataCopy[nodesName][componentName][k]"
                    @change="changeComponentStyle(k, $event.target.value)"
                    :disabled="styleAttributesUIConfig[k].disabled || false"
                  />
                  <mapgis-ui-switch-panel
                    v-if="styleAttributesUIConfig[k].type === 'boolean'"
                    v-model="dataCopy[nodesName][componentName][k]"
                    @changeChecked="changeComponentStyle(k, $event)"
                    :showLabel="false"
                    :isTitleBold="false"
                    :hasTopMargin="false"
                    :hasBottomMargin="false"
                    size="small"
                  />
                  <mapgis-ui-select-panel
                    v-if="styleAttributesUIConfig[k].type === 'select'"
                    v-model="dataCopy[nodesName][componentName][k]"
                    @change="changeComponentStyle(k, $event)"
                    :selectOptions="styleAttributesUIConfig[k].options"
                    :showLabel="false"
                    :wrapperCol="24"
                  />
                </mapgis-ui-form-item>
              </mapgis-ui-col>
            </template>
          </mapgis-ui-row>
        </mapgis-ui-title-collapse>
      </template>
    </mapgis-ui-setting-form>
  </div>
</template>

<script>
import { styleAttributesUIConfig, groupArr } from "./config/attributeConfig";
import axios from "axios";

export default {
  name: "mapgis-ui-plot-attribute",
  props: {
    data: {
      type: Object,
      required: true
    },
    svg: {
      type: SVGSVGElement
    },
    attributeConfig: {
      type: Object,
      default() {
        return styleAttributesUIConfig;
      }
    },
    groupConfig: {
      type: Array,
      default() {
        return groupArr;
      }
    },
    baseUrl: {
      type: String,
      default: ""
    },
    symbolType: {
      type: String,
      default: undefined
    }
  },
  model: {
    prop: "data",
    event: "change"
  },
  watch: {
    data: {
      handler: function(obj) {
        this.dataCopy = obj;
        // console.log("obj", obj);
      },
      deep: true,
      immediate: true
    },
    dataCopy: {
      handler: function(obj) {
        const vm = this;
        if (this.nodesName) {
          vm.componentName = Object.keys(vm.dataCopy[vm.nodesName])[vm.active];
        }
        this.$_parseGroup();
        this.$nextTick(() => {
          vm.$_parseComponent();
        });
        this.$emit("change", obj);
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      dataCopy: undefined,
      groupArr: JSON.parse(JSON.stringify(this.groupConfig)),
      styleAttributesUIConfig: JSON.parse(JSON.stringify(this.attributeConfig)),
      active: 0,
      nodesName: undefined,
      svgT: undefined,
      componentName: undefined,
      group: undefined
    };
  },
  created() {
    this.$_initComponentInfo();
  },
  methods: {
    $_initComponentInfo() {
      const vm = this;
      for (var i in this.styleAttributesUIConfig) {
        if (vm.styleAttributesUIConfig[i].type === "nodes") {
          vm.nodesName = i;
          let components = vm.dataCopy[i];
          vm.componentName = Object.keys(components)[0];
        }
      }
    },
    async $_parseComponent() {
      const vm = this;
      this.svgT = this.svg || (await this.getSvg(this.dataCopy.symbolUrl));
      // console.log('this.svgT', this.svgT, this.dataCopy.symbolUrl);

      if (!this.svgT) {
        return console.log("缺少符号的svg元素！");
      }
      let svgContainer = document.querySelectorAll(".tab-item");
      svgContainer.forEach(node => {
        let nodeL = node.querySelectorAll("svg");
        nodeL.forEach(nd => {
          node.removeChild(nd);
        });
      });

      let keyArr = Object.keys(vm.dataCopy[vm.nodesName]);
      keyArr.forEach((key, index) => {
        let svgDom = vm.svgT;
        const cloneDom = vm.getSvgDomByKey(svgDom, key, 30, 30);
        // console.log("cloneDom", cloneDom);
        svgContainer[index].appendChild(cloneDom);
      });
    },
    /**
     * 获取符号对应svg
     */
    async getSvg(url) {
      if (!url) {
        return console.log("缺少符号的svgUrl");
      }
      if (this.baseUrl) {
        url = this.baseUrl + url;
      }
      axios.defaults.withCredentials = true;
      const res = await axios({
        method: "get",
        url: url,
        dataType: "text",
        timeout: 1000
      });

      const xml = await new DOMParser().parseFromString(
        res.data,
        "image/svg+xml"
      );
      return xml.documentElement;
    },
    getSvgDomByKey(svgDom, key, width, height) {
      const cloneDom = svgDom.cloneNode(true);
      const keyArr = key.split(",");
      const partArr = [];
      const joinArr = [];
      this._applySvgDomArray(cloneDom, partArr);
      // console.log("keyArr", keyArr);
      const deleteArr = partArr.filter(s => {
        if (keyArr.indexOf(s.getAttribute("id")) > -1) {
          joinArr.push(s);
          return false;
        }
        return true;
      });
      deleteArr.forEach(t => {
        t.parentElement.removeChild(t);
      });

      // console.log("joinArr", joinArr);
      const cloneDomWidth = parseInt(cloneDom.getAttribute("width"), 10);
      const cloneDomHeight = parseInt(cloneDom.getAttribute("height"), 10);

      cloneDom.setAttribute("width", width);
      cloneDom.setAttribute("height", height);

      joinArr.forEach(s => {
        if (s.nodeName == "tspan") {
          s.parentElement.style.transformOrigin = "left top";
          s.parentElement.style.transform = `scale(${width /
            cloneDomWidth},${height / cloneDomHeight})`;
          return;
        }
        s.style.transformOrigin = "left top";
        s.style.transform = `scale(${width / cloneDomWidth},${height /
          cloneDomHeight})`;
      });

      return cloneDom;
    },
    _applySvgDomArray(dom, partArr) {
      dom.childNodes.forEach(item => {
        if (item.nodeName === "g" || item.nodeName === "text") {
          this._applySvgDomArray(item, partArr);
        } else if (item.nodeType === 1) {
          partArr.push(item);
        }
      });
    },
    // 根据传入的数据决定渲染的分类
    $_parseGroup() {
      const vm = this;
      let nodeObj = {};
      if (!vm.nodesName) {
        for (var i in this.styleAttributesUIConfig) {
          if (vm.styleAttributesUIConfig[i].type === "nodes") {
            vm.nodesName = i;
          }
        }
      }
      let name = Object.keys(vm.dataCopy[vm.nodesName])[vm.active];
      nodeObj = { ...nodeObj, ...vm.dataCopy[vm.nodesName][name] };
      this.group = new Array(vm.groupArr.length).fill(false);
      for (var key in vm.styleAttributesUIConfig) {
        let index = vm.styleAttributesUIConfig[key].groupId;
        // 当存在分组下的属性时，将对应分类开关的显示设置为开启
        if (vm.dataCopy[key] || nodeObj[key]) {
          vm.group[index] = true;
        }
      }

      // 当没有部件时，隐藏 切换部件 折叠开关
      if (JSON.stringify(vm.dataCopy[vm.nodesName]) == "{}") {
        vm.group[4] = false;
      }
      // console.log("vm.group", vm.group);
    },
    // 切换部件
    changeComponent(nodeStyle, name, index) {
      this.active = index;
      this.componentName = name;
      this.$_parseGroup();

      this.$emit("changeComponent", {
        component: { name: name, style: nodeStyle },
        index: index
      });
    },
    changeComponentStyle(key, value) {
      const vm = this;

      this.$emit("changeComponentStyle", {
        key: key,
        value: value,
        name: vm.componentName
      });
    },
    changeStyle(key, e) {
      this.$emit("changeStyle", {
        key: key,
        value: e
      });
    }
  }
};
</script>
