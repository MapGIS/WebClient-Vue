<template>
    <div>
      <slot name="content" v-bind:currentLayerInfo="currentLayerInfo">
        <div class="PropertiesTabs">
          <a-tabs v-model="activeKey" :active-key="activeKey" :tab-position="mode" @tabClick="changePane">
            <a-tab-pane v-for="(f,i) in currentLayerInfo" :key="i" :tab="f.layer.id">
              <div v-for="(value,key) in f.properties" class="proStyle">
                <div class="keyCss">
                  <span style="padding-right: 5px">{{ key }}</span>
<!--                  <div v-show="typeof value === 'number'">(Num)</div>-->
<!--                  <div v-show="typeof value === 'string'">(Str)</div>-->
                </div>
                <div>
<!--                  {{ value }}-->
                              {{ value }} ({{typeof value}})
                </div>
              </div>
              <br/>
            </a-tab-pane>
          </a-tabs>
        </div>
      </slot>
    </div>
</template>

<script>
import mapboxgl from '@mapgis/mapbox-gl';

let MapboxInspect = require('mapbox-gl-inspect');

export default {
  name: 'mapgis-inspect',
  inject: ["map"],
  mounted() {
    this.enableInspect();
  },
  data() {
    return {
      currentLayerInfo: [],
      indeterminate: true,
      checkAll: false,
      checkedList: [],
      checkedInfo: "",
      check: false,
      selectdType: [],
      mode: "left",
      activeKey: ""
    }
  },
  methods: {
    enableInspect() {
      const vm = this;
      const {map} = this;
      if (!map || !map.getStyle()) {
        return;
      }
      const inspect = new MapboxInspect({
        popup: new mapboxgl.Popup({
          closeOnClick: false,
          closeButton: false,
        }),
        // showInspectMap: true,
        showMapPopup: true,
        showMapPopupOnHover: false,
        showInspectMapPopupOnHover: true,
        showInspectButton: false,
        blockHoverPopupOnClick: false,
        // buildInspectStyle: (originalMapStyle, coloredLayers) => self.buildInspectStyle(
        //     originalMapStyle, coloredLayers, self.props.current, self),
        renderPopup: features => {
          vm.currentLayerInfo = features;
          // return vm.$slots.content[0].elm;

          return vm.$el;
        }
      });
      map.addControl(inspect);
    },
    changePane(key) {
      let vm = this;
      let checkedLayer = [];
      for (let i = 0; i < vm.currentLayerInfo.length; i++) {
        if (key === i) {
          checkedLayer.push(vm.currentLayerInfo[i]);
        }
      }
      console.log("checkedLayer", checkedLayer);
      vm.$emit("callback", checkedLayer);
    }
  }
}
</script>
<style>
.PropertiesTabs {
  max-width: 500px !important;
}
.mapboxgl-popup-content {
  border-radius: 10px !important;
}
.mapboxgl-popup {
  max-width: 500px !important;
}
.proStyle {
  display: flex;
  justify-content: space-between;
  border-bottom: 2px dotted #bccbd7;
  padding: 5px;
}
.keyCss {
  font-weight: 700;
  padding-right: 10px;
  display: flex;
  justify-content:flex-start;
}
.ant-tabs .ant-tabs-left-bar .ant-tabs-tab, .ant-tabs .ant-tabs-right-bar .ant-tabs-tab {
  padding: 9px !important;
  margin: 0 0 10px 0 !important;
  text-align: left !important;
}
</style>