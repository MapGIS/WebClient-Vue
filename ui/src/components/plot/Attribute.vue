<template>
  <mapgis-ui-setting-form size="default" :colon="true" layout="vertical">
    <div class="plot-attribute-panel">
      <!--设置面板-->
      <template v-for="(collapse, grpIdx) in groupArr">
        <mapgis-ui-title-collapse
          :key="grpIdx"
          :title="collapse.label"
          v-show="group && group[grpIdx]"
        >
          <mapgis-ui-row :gutter="8">
            <template v-for="(value, key, dataIdx) in dataCopy">
              <div
                v-if="
                  styleAttributes[key] &&
                    collapse.id === styleAttributes[key].groupId
                "
                :key="dataIdx"
              >
                <mapgis-ui-col
                  :span="24"
                  v-if="styleAttributes[key].type === 'nodes'"
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
                  <mapgis-ui-form-item :label="styleAttributes[key].title">
                    <mapgis-ui-sketch-color-picker
                      v-if="styleAttributes[key].type === 'color'"
                      v-model="dataCopy[key]"
                      @change="changeStyle(key, $event)"
                      :disableAlpha="false"
                      :showColorText="false"
                    />
                    <mapgis-ui-input-number-addon
                      v-if="styleAttributes[key].type === 'number'"
                      v-model="dataCopy[key]"
                      @change="changeStyle(key, $event)"
                      :min="
                        styleAttributes[key].range
                          ? styleAttributes[key].range[0]
                          : -Infinity
                      "
                      :max="
                        styleAttributes[key].range
                          ? styleAttributes[key].range[1]
                          : Infinity
                      "
                      :step="styleAttributes[key].step || 1"
                      :disabled="styleAttributes[key].disabled || false"
                    />
                    <mapgis-ui-input
                      v-if="styleAttributes[key].type === 'text'"
                      v-model="dataCopy[key]"
                      @change="changeStyle(key, $event.target.value)"
                      :disabled="styleAttributes[key].disabled || false"
                    />
                    <mapgis-ui-switch-panel
                      v-if="styleAttributes[key].type === 'boolean'"
                      v-model="dataCopy[key]"
                      @changeChecked="changeStyle(key, $event)"
                      :showLabel="false"
                      :isTitleBold="false"
                      :hasTopMargin="false"
                      :hasBottomMargin="false"
                      size="small"
                    />
                    <mapgis-ui-select-panel
                      v-if="styleAttributes[key].type === 'select'"
                      v-model="dataCopy[key]"
                      @change="changeStyle(key, $event)"
                      :selectOptions="styleAttributes[key].options"
                      :showLabel="false"
                      :wrapperCol="24"
                    />
                  </mapgis-ui-form-item>
                </mapgis-ui-col>
              </div>
            </template>
            <template
              v-for="(val, k, styleIdx) in dataCopy[nodesName][componentName]"
            >
              <mapgis-ui-col
                :span="12"
                v-if="
                  styleAttributes[k] &&
                    collapse.id === styleAttributes[k].groupId
                "
                :key="styleIdx"
              >
                <mapgis-ui-form-item :label="styleAttributes[k].title">
                  <mapgis-ui-sketch-color-picker
                    v-if="styleAttributes[k].type === 'color'"
                    v-model="dataCopy[nodesName][componentName][k]"
                    @change="changeComponentStyle(k, $event)"
                    :disableAlpha="false"
                    :showColorText="false"
                  />
                  <mapgis-ui-input-number-addon
                    v-if="styleAttributes[k].type === 'number'"
                    v-model="dataCopy[nodesName][componentName][k]"
                    @change="changeComponentStyle(k, $event)"
                    :min="
                      styleAttributes[k].range
                        ? styleAttributes[k].range[0]
                        : -Infinity
                    "
                    :max="
                      styleAttributes[k].range
                        ? styleAttributes[k].range[1]
                        : Infinity
                    "
                    :step="styleAttributes[k].step || 1"
                    :disabled="styleAttributes[k].disabled || false"
                  />
                  <mapgis-ui-input
                    v-if="styleAttributes[k].type === 'text'"
                    v-model="dataCopy[nodesName][componentName][k]"
                    @change="changeComponentStyle(k, $event.target.value)"
                    :disabled="styleAttributes[k].disabled || false"
                  />
                  <mapgis-ui-switch-panel
                    v-if="styleAttributes[k].type === 'boolean'"
                    v-model="dataCopy[nodesName][componentName][k]"
                    @changeChecked="changeComponentStyle(k, $event)"
                    :showLabel="false"
                    :isTitleBold="false"
                    :hasTopMargin="false"
                    :hasBottomMargin="false"
                    size="small"
                  />
                  <mapgis-ui-select-panel
                    v-if="styleAttributes[k].type === 'select'"
                    v-model="dataCopy[nodesName][componentName][k]"
                    @change="changeComponentStyle(k, $event)"
                    :selectOptions="styleAttributes[k].options"
                    :showLabel="false"
                    :wrapperCol="24"
                  />
                </mapgis-ui-form-item>
              </mapgis-ui-col>
            </template>
          </mapgis-ui-row>
        </mapgis-ui-title-collapse>
      </template>
    </div>
  </mapgis-ui-setting-form>
</template>

<script>
import { styleAttributes, groupArr } from "./test/config";
import axios from 'axios';

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
        return styleAttributes;
      }
    },
    groupConfig: {
      type: Array,
      default() {
        return groupArr;
      }
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
      groupArr: this.groupConfig,
      styleAttributes: this.attributeConfig,
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
      for (var i in this.styleAttributes) {
        if (vm.styleAttributes[i].type === "nodes") {
          vm.nodesName = i;
          let components = vm.dataCopy[i];
          vm.componentName = Object.keys(components)[0];
        }
      }
    },
    async $_parseComponent() {
      const vm = this;
      this.svgT = this.svg || await this.getSvg(this.dataCopy.symbolUrl);
      // console.log('this.svgT', this.svgT, this.dataCopy.symbolUrl);
      
      if(!this.svgT) {
        return console.log('缺少符号的svg元素！')}
      ;
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
        svgContainer[index].appendChild(cloneDom);
      });
    },
        /**
     * 获取符号对应svg
     */
    async getSvg(url) {
      if(!url){ return console.log("缺少符号的svgUrl")}
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

      const cloneDomWidth = parseInt(cloneDom.getAttribute("width"), 10);
      const cloneDomHeight = parseInt(cloneDom.getAttribute("height"), 10);

      cloneDom.setAttribute("width", width);
      cloneDom.setAttribute("height", height);

      joinArr.forEach(s => {
        s.style.transformOrigin = "left top";
        s.style.transform = `scale(${width / cloneDomWidth},${height /
          cloneDomHeight})`;
      });

      return cloneDom;
    },
    _applySvgDomArray(dom, partArr) {
      dom.childNodes.forEach(item => {
        if (item.nodeName === "g") {
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
        for (var i in this.styleAttributes) {
          if (vm.styleAttributes[i].type === "nodes") {
            vm.nodesName = i;
          }
        }
      }
      let name = Object.keys(vm.dataCopy[vm.nodesName])[vm.active];
      nodeObj = { ...nodeObj, ...vm.dataCopy[vm.nodesName][name] };

      this.group = new Array(vm.groupArr.length).fill(0);
      for (var key in vm.styleAttributes) {
        let index = vm.styleAttributes[key].groupId;
        if (vm.dataCopy[key] || nodeObj[key]) {
          vm.group[index] = 1;
        }
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
