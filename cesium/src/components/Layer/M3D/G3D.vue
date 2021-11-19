<template>
  <div class="mapgis-3d-g3d-layer">
    <slot name="control">
      <mapgis-ui-collapse-card
        ref="card"
        position="top-left"
        :defaultCollapse="false"
        :outStyle="outStyle"
        :title="title"
      >
        <mapgis-ui-iconfont type="mapgis-layer1" slot="icon-hiden" />
        <div class="mapgis-3d-g3d-layer-title" slot="title">{{ title }}</div>
        <mapgis-ui-space slot="extra" class="mapgis-3d-g3d-layer-icons">
          <mapgis-ui-tooltip> </mapgis-ui-tooltip>
          <mapgis-ui-iconfont type="mapgis-highlight" />
          <mapgis-ui-iconfont type="mapgis-fire1" />
          <mapgis-ui-iconfont type="mapgis-setting" />
          <mapgis-ui-iconfont type="mapgis-hide" @click="handleCardHdie" />
        </mapgis-ui-space>
        <div class="mapgis-3d-g3d-document">
          <mapgis-ui-input-search
            style="margin-bottom: 8px"
            placeholder="搜索"
            @change="onChange"
          />
          <mapgis-ui-tree
            class="mapgis-3d-g3d-document-tree"
            checkable
            showIcon
            v-model="layerIds"
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :tree-data="layerTree"
            @expand="onExpand"
          >
            <template slot="custom" slot-scope="{ icon }">
              <!-- <mapgis-ui-iconfont :type="icon" /> -->
            </template>
            <template
              slot="title"
              slot-scope="{
                title,
                icon,
                version,
                gdbp,
                ip,
                port,
                layerIndex,
                key
              }"
            >
              <span
                :class="{
                  'mapgis-3d-g3d-layer-span': true,
                  'mapgis-3d-g3d-layer-span-inline': true
                }"
              >
                <span v-if="title && title.indexOf(searchValue) > -1">
                  {{ title.substr(0, title.indexOf(searchValue)) }}
                  <span style="color: #f50">{{ searchValue }}</span>
                  {{
                    title.substr(
                      title.indexOf(searchValue) + searchValue.length
                    )
                  }}
                </span>
                <span v-else>{{ title }}</span>
                <span
                  v-if="version && key == '地图场景默认键值'"
                  class="mapgis-3d-g3d-layer-version"
                  >版本:{{ version }}</span
                >
                <mapgis-ui-iconfont
                  :type="icon"
                  class="iconfont"
                  @click="() => handleActiveItemKey({ version, layerIndex })"
                />
                <mapgis-ui-iconfont
                  type="mapgis-crosshair"
                  class="iconfont"
                  @click="
                    () =>
                      handleHighlighItemKey({
                        title,
                        icon,
                        version,
                        gdbp,
                        ip,
                        port,
                        layerIndex,
                        key
                      })
                  "
                />
              </span>
            </template>
          </mapgis-ui-tree>
        </div>

        <m3d-menus
          slot="panel"
          size="big"
          :mode="layerKey == '地图场景默认键值' ? 'g3d' : 'm3d'"
          :version="version"
          :layerIndex="layerIndex"
          :gdbp="gdbp"
          :ip="ip"
          :port="port"
        >
        </m3d-menus>
      </mapgis-ui-collapse-card>
    </slot>
  </div>
</template>

<script>
import G3DOptions from "./G3DOptions";
// import { M3dType, M3dType_2_0 } from "./M3dType";

import M3dMenus from "./components/M3dMenus.vue";

export default {
  name: "mapgis-3d-g3d-layer",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...G3DOptions
  },
  components: {
    M3dMenus
  },
  data() {
    return {
      title: "G3D场景图层",
      layerIds: this.parseLayers(),
      menus: [
        {
          title: "高亮",
          icon: "mapgis-highlight"
        },
        {
          title: "模型爆炸",
          icon: "mapgis-fire1"
        },
        {
          title: "批量设置",
          icon: "mapgis-setting"
        },
        {
          title: "隐藏面板",
          icon: "mapgis-hide"
        }
      ],
      layerTree: [
        {
          title: "地图场景",
          key: "地图场景默认键值",
          version: "",
          icon: "mapgis-layer1",
          menu: "mapgis-down",
          children: [],
          scopedSlots: { icon: "custom", title: "title" }
        }
      ],
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      expandItemKey: undefined,
      activeItemKey: undefined,
      gdbp: undefined,
      layerKey: undefined,
      layerIndex: undefined,
      version: undefined,
      ip: "localhost",
      port: "6163"
    };
  },
  provide() {
    const self = this;
    return {
      get m3ds() {
        return self.m3ds;
      }
    };
  },
  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  watch: {
    layers(next) {
      this.layerIds = this.parseLayers(next);
      this.changeLayerVisible(this.layerIds);
    },
    layerIds(next) {
      this.changeLayerVisible(this.layerIds);
    }
  },
  methods: {
    createCesiumObject() {
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    onM3dLoaded(e) {},
    mount() {
      const vm = this;
      const { vueIndex, vueKey, vueCesium } = this;
      const { viewer, url, $props } = this;

      let server = this.parseServer();
      let { ip, port } = server;

      let g3dLayer = this.createCesiumObject();
      let layers = this.parseLayers();
      if (!layers) this.layerIds = [];
      g3dLayer.then(e => {
        let g3d = viewer.scene.layers.appendG3DLayer(url, {
          $props,
          loaded: function(layer) {
            // 该回调有多少图层循环进多少次
          },
          getDocLayerIndexes(indexes) {
            // 该回调只触发一次
            let g3dLayer = viewer.scene.layers.getLayer(indexes[0]);
            vm.layerTree[0].version = g3dLayer.version;
            vm.version = g3dLayer.version;
            vm.layerTree[0].title = g3dLayer.name;
            var layerIndexs = g3dLayer.getM3DLayerIndexes();

            let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);

            if (find && find.options && find.options.m3ds) {
              let props = layerIndexs.map(i => {
                let gIndex = layerIndexs[i];
                let layer = g3dLayer.getLayer(gIndex);
                return layer.readyPromise;
              });

              Promise.all(props).then(m3ds => {
                vm.$emit("loaded", { g3d: vm });
                vm.m3ds = m3ds;
                find.options.m3ds = m3ds;
                let all = [];
                m3ds.forEach((m3d, i) => {
                  // 形参的m3d并不是表示序号i对应的图层，下一行才是序号i对应的图层
                  let gIndex = layerIndexs[i];
                  let info = g3dLayer.getLayerInfo(gIndex);
                  let layer = g3dLayer.getLayer(gIndex);
                  let { layerName, gdbpUrl, layerType } = info;
                  all.push(`${gIndex}`);
                  // let version = vm.parseVersion(layer);
                  vm.layerTree[0].children.push({
                    title: layerName,
                    key: `${gIndex}`,
                    version: g3dLayer.version,
                    layerIndex: gIndex,
                    layerType,
                    ip,
                    port,
                    gdbp: gdbpUrl,
                    icon: "mapgis-layer",
                    menu: "mapgis-down",
                    scopedSlots: {
                      icon: "custom",
                      title: "title"
                    }
                  });
                  if (layers) {
                    if (layers.indexOf(`${i}`) >= 0) {
                      layer.show = true;
                    } else {
                      layer.show = false;
                    }
                  } else {
                    layer.show = true;
                  }
                });
                vm.layerIds = all;
              });
            }
          }
        });
        vueCesium.G3DManager.addSource(vueKey, vueIndex, g3d, { m3ds: [] });
      });

      if (viewer.isDestroyed()) return;
    },
    unmount() {
      const { vueCesium, vueKey, vueIndex } = this;
      const { viewer } = this;
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        let { m3ds } = find.options;
        if (!viewer.isDestroyed() && m3ds) {
          m3ds.forEach(l => l.destroy());
        }
      }
      this.$emit("unload", { component: this });
      vueCesium.G3DManager.deleteSource(vueKey, vueIndex);
    },
    // 搜索需要
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    getParentKey(key, tree) {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    },
    onChange(e) {
      let { layerTree } = this;
      const dataList = [];
      const generateList = data => {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const { key } = node;
          dataList.push({ key, title: key });
          if (node.children) {
            generateList(node.children);
          }
        }
      };
      generateList(layerTree);

      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, layerTree);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    },
    // 图层解析
    parseServer(url) {
      url = url || this.url;
      let ip = new RegExp(/^[http:]*[https:]*\/\/.*\//);
      let ips = url.match(ip);
      let temp = ips[0].split("http://");
      let domains = temp[1].split(":");
      ip = domains[0];
      let port = domains[1].split("/")[0];
      this.ip = ip;
      this.port = port;
      return {
        ip,
        port
      };
    },
    parseVersion(m3d) {
      const { asset } = m3d;
      const { version } = asset;
      return version;
    },
    parseName(m3d) {
      let { _gdbpUrl } = m3d;
      let name;
      let reg = new RegExp(/\\.*\.mcj/g);
      let result = _gdbpUrl.match(reg);
      if (result && result.length > 0) {
        let temp = result[0];
        let res = temp.split("\\");
        let proj = res[res.length - 1];
        let names = proj.split(".mcj");
        name = names && names.length > 0 ? names[0] : "未命名";
      }
      return name;
    },
    parseLayers(layerString) {
      layerString = layerString || this.layers;
      if (!layerString) return undefined;
      let pattern = new RegExp(/show:/i);
      if (!pattern.test(layerString)) {
        console.warn("layers格式错误，格式为show:0,1,2");
      }
      let layerStr = layerString.replace(/show:/i, "");
      let layerStrs = layerStr.split(",");
      let layers = layerStrs.map(l => l);
      return layers;
    },
    changeLayerVisible(layers) {
      layers = layers || this.layerIds;
      const { vueKey, vueIndex, vueCesium } = this;
      let find = vueCesium.G3DManager.findSource(vueKey, vueIndex);
      if (find && find.options) {
        let m3ds = find.options.m3ds;
        if (!m3ds) return;
        m3ds.forEach((m3d, i) => {
          if (layers) {
            if (layers.indexOf(`${i}`) >= 0) {
              m3d.show = true;
            } else {
              m3d.show = false;
            }
          } else {
            m3d.show = true;
          }
        });
      }
    },
    handleExpandItemKey(key) {
      if (key == this.expandItemKey) {
        this.expandItemKey = undefined;
      } else {
        this.expandItemKey = key;
      }
    },
    handleActiveItemKey(layer) {
      const { title, icon, version, gdbp, ip, port, layerIndex, key } = layer;
      this.title = title;
      this.gdbp = gdbp;
      this.version = version;
      this.ip = ip;
      this.port = port;
      this.layerIndex = layerIndex;
      this.layerKey = key;
      this.$refs.card && this.$refs.card.togglePanel();
    },
    handleHighlighItemKey(layer) {
      const { title, icon, version, gdbp, ip, port, layerIndex, key } = layer;
    },
    handleCardHdie() {
      this.$refs.card && this.$refs.card.hide();
    },
    handleHover() {
      console.log("hover");
    }
  }
};
</script>
