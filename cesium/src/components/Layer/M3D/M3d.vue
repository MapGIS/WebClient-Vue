<template>
  <div>
    <template v-if="isVoxelLayer">
      <VoxelLayer v-bind="$props" />
    </template>
    <template v-else>
      <mapgis-3d-feature-popup
        v-if="popupShowType === 'default' && featureposition"
        :position="featureposition"
        :popupOptions="popupOptions"
        :componentWidth="popupWidth"
        :enablePopup="enablePopup"
        v-bind="popupConfig"
      >
        <component
          :is="popupComponent"
          :properties="featureproperties"
          :dataStoreIp="dataStoreIp"
          :dataStorePort="dataStorePort"
          :dataStoreDataset="dataStoreDataset"
          v-bind="popupConfig"
        />
      </mapgis-3d-feature-popup>
    </template>
  </div>
</template>

<script>
import { G3D } from "@mapgis/webclient-es6-service";
import Tileset3dOptions from "./3DTilesetOptions";
import { M3dType, M3dType_0_0 } from "./M3dType";
import PopupMixin from "../Mixin/PopupMixin";
import modelSwitchPopup from "./components/M3dModelSwitch";
import Popup from "../../UI/Popup/Popup.vue";
import * as Feature from "../../service/comprehensive-query/util/feature";
import VoxelLayer from "./Voxel.vue";
import { M3DModelCacheLayer } from "@mapgis/webclient-common";
import { initializeOptions } from "@mapgis/webclient-cesium-plugin";
const { M3DTileDataInfo } = G3D;

export default {
  name: "mapgis-3d-m3d-layer",
  components: {
    modelSwitchPopup,
    Popup,
    VoxelLayer,
  },
  inject: ["Cesium", "vueCesium", "viewer"],
  mixins: [PopupMixin],
  props: {
    ...Tileset3dOptions,
    // 右侧展示气泡框props
    popupShowType: {
      type: String,
      default: "default",
    },
    // 气泡框对象
    popupOverlay: {
      type: Object,
      default: () => {},
    },
    // datastore服务器ip
    dataStoreIp: {
      type: String,
      default: "192.168.96.101",
    },
    // datastore服务器port
    dataStorePort: {
      type: String,
      default: "9014",
    },
    // 查询知识图谱的数据集位置
    dataStoreDataset: {
      type: String,
      default: "Graph3/GraphDataset1",
    },
    // 弹出框属性
    popupOptions: {
      type: Object,
      default: () => {
        return { popupType: "card" };
      },
    },
    // 挂靠的查询参数，比如三维简单要素类，如果有挂靠的查询参数，则拾取的要素属性使用从三维简单要素类里的内容
    searchParams: {
      type: Object,
      default: () => {},
    },
     // 图层跳转时间
     duration: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 拾取的要素位置
      featureposition: undefined,
      // 拾取的要素属性
      featureproperties: undefined,
      // 是否为栅格体元图层
      isVoxelLayer: false,
    };
  },
  watch: {
    // 监听url变化
    url(next) {
      this.unmount();
      this.mount();
    },
    // 监听M3D的显示/隐藏设置变化
    show(next) {
      if (this.initial) return;
      this.changeShow(next);
    },
    // 监听M3D透明度设置变化
    opacity(next) {
      if (this.initial) return;
      if (next >= 0 && next <= 1) {
        this.changeOpacity(next);
      }
    },
    // 是否显示弹框
    enablePopup(next) {
      if (next) {
        this.bindPopupEvent();
      } else {
        this.unbindPopupEvent();
      }
    },
  },
  created() {},
  mounted() {
    this.mount();
    console.log(this.popupComponent, "popupComponent");
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    /**
     * 构造M3D初始化options
     */
    getOptions() {
      const { $props } = this;
      let options = {};
      // 新增extensions属性
      // 以支持通过对象的方式批量传入图层属性，
      // 但是优先级低于单个传入属性，即如果单个属性有传入值，优先使用传入的值，
      // 如果没有传入，但是extensions中有该属性，则使用extensions里对应的值
      // 修改者：龚跃健 2024/10/28
      const tempProps = {
        ...this.$props,
        ...this.$props.extensions,
        ...this.$options.propsData,
      };
      Object.keys(tempProps).forEach(function (key) {
        options[key] = tempProps[key];
      });
      return options;
    },
    /**
     * @description 初始化组件
     */
    mount() {
      const vm = this;
      const { viewer, vueIndex, vueKey, vueCesium, $props } = this;
      const { url, opacity } = this;
      const { luminanceAtZenith, maximumMemoryUsage } = this;
      if (viewer.isDestroyed()) return;
      const options = this.getOptions();

      // 需要过滤出extensionOptions里面的url，要不然cesiumOptions.url会被覆盖
      const { url: optionUrl, ...extensionOptions } = options;
      const commonM3DLayer = new M3DModelCacheLayer({
        // 服务基地址
        url,
        ...options,
        extensionOptions
      });
      commonM3DLayer.load().then((layer) => {
        const cesiumOptions = initializeOptions(layer, viewer);
        zondy.cesium.MapGISM3DSet.fromUrl(cesiumOptions.url, cesiumOptions).then((m3dset) => {
          if (!m3dset) {
            return;
          }
          m3dset.imageBasedLighting.luminanceAtZenith = luminanceAtZenith;
          if (options.autoReset) {
            const boundingSphere = m3dset.boundingSphere;
            const orientation = new Cesium.HeadingPitchRange(
              0.0,
              -0.5,
              boundingSphere.radius * 2.5
            );
            viewer.camera.flyToBoundingSphere(boundingSphere, {
              duration: options.duration,
              offset: orientation,
            });
          }
          viewer.scene.primitives.add(m3dset);
          m3dset.style = new Cesium.Cesium3DTileStyle({
            color:
              "undefined === ${COLOR}.r ? color('white'," +
              opacity +
              "):rgba(${COLOR}.r *255,${COLOR}.g* 255,${COLOR}.b *255, " +
              opacity +
              ")",
          });
          let m3ds = [m3dset];
          vueCesium.M3DIgsManager.addSource(vueKey, vueIndex, m3ds, {
            url: url,
          });
          const layerInfo = m3dset.layerinfo;
          if (layerInfo && layerInfo.length) {
            const { voxelInfo } = layerInfo[0] || {};
            if (voxelInfo) {
              vm.isVoxelLayer = true;
              m3dset.heightScale = 1000;
              vm.$emit("handelVoxel", vueIndex);
            }
          }
          vm.$emit("loaded", { tileset: m3ds[0], m3ds: m3ds });
          vm.bindPopupEvent();
        });
      });
    },
    /**
     * @description 清空组件
     */
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      this.removeLayer();
      this.unbindPopupEvent();
      this.$emit("unload", { component: this });
      vueCesium.M3DIgsManager.deleteSource(vueKey, vueIndex);
    },
    /**
     * @description 移除M3D图层
     */
    removeLayer() {
      const { viewer } = this;
      const m3dset = this.getM3DSet();
      if (m3dset) {
        viewer.scene.primitives.remove(m3dset);
      }
    },
    /**
     * @description 获取M3DSet
     */
    getM3DSet() {
      const { vueKey, vueIndex } = this;
      const find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        const m3ds = find.source;
        if (m3ds && m3ds.length) {
          return m3ds[0];
        }
        return null;
      }
      return null;
    },
    /**
     * @description 绑定气泡框事件
     */
    bindPopupEvent() {
      const { vueKey, vueIndex, vueCesium } = this;
      const { enablePopup, enableTips, enableModelSwitch } = this;
      let clickhandler, hoverhandler;
      if (enablePopup || enableModelSwitch) {
        clickhandler = this.$_bindClickEvent(
          this.pickFeature,
          this.cancelFeature,
          true,
          false
        );
      }
      if (enableTips) {
        hoverhandler = this.$_bindHoverEvent(this.pickFeature);
      }
      vueCesium.M3DIgsManager.changeOptions(
        vueKey,
        vueIndex,
        "clickhandler",
        clickhandler
      );
      vueCesium.M3DIgsManager.changeOptions(
        vueKey,
        vueIndex,
        "hoverhandler",
        hoverhandler
      );
    },
    /**
     * @description 取消绑定气泡框事件
     */
    unbindPopupEvent() {
      const { Cesium, vueCesium, vueKey, vueIndex, viewer } = this;
      const { highlightStyle } = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        if (find.options.clickhandler) {
          find.options.clickhandler.destroy();
        }
        if (find.options.hoverhandler) {
          find.options.hoverhandler.destroy();
        }
      }
      // 关闭右侧气泡框
      this.popupOverlay && this.popupOverlay.setContent(null);

      let m3dset = this.getM3DSet();
      if (m3dset) {
        m3dset.style = undefined;
      }
      this.featureposition = undefined;
      this.featureproperties = undefined;
    },
    /**
     * @description 拾取
     * @param {Object} payload cesium鼠标点击事件返回的对象
     */
    async pickFeature(payload) {
      const vm = this;
      const { movement } = payload;

      const { popupOptions, highlightStyle, vueKey, vueIndex } = this;
      const { viewer, vueCesium, Cesium } = this;

      const pickInfo = {};
      let feature = viewer.scene.pick(movement.position);
      let m3dset = this.getM3DSet();
      if (Cesium.defined(feature) && feature.tileset !== m3dset) {
        return;
      }
      vueCesium.M3DIgsManager.changeOptions(vueKey, vueIndex, "pick", m3dset);
      vueCesium.M3DIgsManager.changeOptions(
        vueKey,
        vueIndex,
        "pickStyle",
        m3dset.Cesium3DTileStyle ||
          Cesium.Color.fromCssColorString(highlightStyle)
      );
      // 修改说明：M3D2.1已弃用viewer.scene.pickOid方法，后面统一从feature上获取要素id，高亮统一使用Cesium3DTileStyle设置
      // 修改人:龚跃健
      // 修改日期：2024-11-22
      const { version } = m3dset;
      let id;
      let conditions;
      if (version === "2.1") {
        id = feature.getProperty("tid");
        conditions = [["${tid} === ${id}", highlightStyle]];
      } else {
        id = feature.getProperty("OID");
        conditions = [["${OID} === ${id}", highlightStyle]];
      }
      pickInfo.id = id;
      m3dset.style = new Cesium.Cesium3DTileStyle({
        defines: {
          id,
        },
        color: {
          conditions,
        },
      });
      let titlefield = popupOptions ? popupOptions.title : undefined;
      // 优先基于id，通过IGS要素查询的方式获取要素属性信息
      const properties = await this.getFeaturePorpertiesById(id);
      if (Object.keys(properties).length) {
        if (vm.showPopup) {
          if (this.popupShowType === "default") {
            vm.featureproperties = properties;
          } else {
            // title放在最前面
            let popupContent = {};
            popupContent = properties[titlefield]
              ? { title: properties[titlefield], ...properties }
              : { ...properties };
            vm.popupOverlay && vm.popupOverlay.setContent(popupContent);
          }
        }
        pickInfo.properties = properties;
      } else {
        let result = {};
        const propertyIds = feature.getPropertyIds();
        // 修改说明：属性信息也统一从feature上获取，更新获取方法
        // 修改人:龚跃健
        // 修改日期：2025-1-9
        if (propertyIds && propertyIds.length) {
          for (let i = 0; i < propertyIds.length; ++i) {
            const propertyId = propertyIds[i];
            result[propertyId] = feature.getProperty(propertyId);
          }
          if (vm.showPopup) {
            if (this.popupShowType === "default") {
              vm.featureproperties = result;
            } else {
              // title放在最前面
              let popupContent = {};
              popupContent = result[titlefield]
                ? { title: result[titlefield], ...result }
                : { ...result };
              vm.popupOverlay && vm.popupOverlay.setContent(popupContent);
            }
          }
          pickInfo.properties = result;
        }
      }
      if (this.popupShowType === "default" && vm.iClickPosition) {
        if (vm.showPopup) {
          vm.featureposition = vm.iClickPosition;
        }
        pickInfo.position = vm.iClickPosition;
      }
      pickInfo.layerId = vm.vueIndex;
      vm.$emit("pick-info", pickInfo);
    },
    /**
     * @description 取消拾取内容
     */
    cancelFeature() {
      const m3dset = this.getM3DSet();
      m3dset.style = undefined;
      this.featureposition = undefined;
      this.featureproperties = undefined;
      this.popupOverlay && this.popupOverlay.setContent(null);
      this.$emit("pick-info", {});
    },
    /**
     * @description 设置M3D的显示/隐藏
     * @param {Boolean} show 是否显示
     */
    changeShow(show) {
      const { vueKey, vueIndex, vueCesium } = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        m3ds && m3ds.forEach((m3d) => (m3d.show = show));
      }
    },
    /**
     * @description 设置M3D透明度
     * @param {Number} opacity 透明度
     */
    changeOpacity(opacity) {
      const { vueKey, vueIndex, vueCesium, Cesium } = this;
      const vm = this;
      let find = vueCesium.M3DIgsManager.findSource(vueKey, vueIndex);
      if (find) {
        let m3ds = find.source;
        if (!m3ds) return;
        m3ds.forEach((m3d) => {
          m3d.style = new Cesium.Cesium3DTileStyle({
            color:
              "undefined === ${COLOR}.r ? color('white'," +
              opacity +
              "):rgba(${COLOR}.r *255,${COLOR}.g* 255,${COLOR}.b *255, " +
              opacity +
              ")",
          });
        });
      }
    },
    /**
     * @description 根据id，通过IGS要素查询的获取要素属性信息
     * @param {String} id 要素id
     * @return {Object} 要素属性信息
     */
    async getFeaturePorpertiesById(id) {
      const properties = {};
      if (this.searchParams) {
        const { domain, serverName, layerIndex, gdbp } = this.searchParams;
        const featureSet = await Feature.FeatureQuery.query(
          {
            domain,
            f: "json",
            IncludeAttribute: true,
            IncludeGeometry: false,
            IncludeWebGraphic: false,
            where: null,
            gdbp,
            docName: serverName,
            layerIdxs: layerIndex,
            rtnLabel: false,
            objectIds: id,
            requestType: "POST",
          },
          false,
          true
        );
        if (featureSet && featureSet.SFEleArray) {
          const { AttStruct, SFEleArray } = featureSet;
          const { FldAlias, FldName } = AttStruct;
          const { AttValue } = SFEleArray[0];

          for (let i = 0; i < AttValue.length; i++) {
            const tag = FldAlias[i] ? FldAlias[i] : FldName[i];
            properties[tag] = AttValue[i];
          }
        }
      }
      return properties;
    },
  },
};
</script>
