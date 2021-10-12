<template>
  <div class="mapgis-document-wrapper" :style="wrapperStyle">
    <div class="document-header-title">
      <mapgis-ui-iconfont type="mapgis-tucengjiancheng" />
      <span>地图文档树</span>
    </div>
    <mapgis-ui-input-search
      style="margin-bottom: 8px"
      placeholder="搜索"
      @change="onChange"
    />
    <mapgis-ui-tree
      checkable
      showIcon
      v-model="checkedKeys"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="layers"
      @expand="onExpand"
    >
      <template slot="custom" slot-scope="{ icon }">
        <mapgis-ui-iconfont :type="icon" />
      </template>
      <template slot="title" slot-scope="{ title }">
        <span v-contextmenu:LayerMenu :title="title">
          <span v-if="title.indexOf(searchValue) > -1">
            {{ title.substr(0, title.indexOf(searchValue)) }}
            <span style="color: #f50">{{ searchValue }}</span>
            {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else> {{ title }} </span>
        </span>
      </template>
    </mapgis-ui-tree>
    <contextmenu ref="LayerMenu" @contextmenu="handleMenuOpen">
      <layer-menu :layerId="selectLayer" @reverse="onReveseClick" />
    </contextmenu>
  </div>
</template>

<script>
import withEvents from "../../../lib/withEvents";
import withSelfEvents from "../withSelfEvents";
import Document from "./DocumentViewModel";
import LayerMenu from "./contextmenu/LayerMenu";
import { directive, Contextmenu } from "v-contextmenu";
import "v-contextmenu/dist/index.css";

const documentEvents = {
  // es6
  documentCreate: "documentCreate"
};

export default {
  name: "mapgis-document",
  mixins: [withEvents, withSelfEvents],
  components: { Contextmenu, LayerMenu },

  inject: ["mapbox", "map"],

  directives: {
    contextmenu: directive
  },

  provide() {
    const self = this;
    return {
      get document() {
        // 提供给子组件或者插槽
        return self.document;
      },
      get layers() {
        // 提供给子组件或者插槽
        return self.document.layers;
      }
    };
  },

  props: {
    wrapperStyle: {
      type: Object,
      default: () => {
        return {
          position: "absolute",
          background: "#ffffff",
          top: "20px",
          left: "20px",
          zIndex: 10,
          borderRadius: "6px"
        };
      }
    }
  },

  data() {
    return {
      initial: true,
      showIcon: true,
      checkedKeys: [],
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      layers: [],
      selectLayer: undefined
    };
  },

  watch: {
    checkedKeys(checks) {
      const vm = this;
      const { map, layers } = this;
      if (map) {
        let unvisible = layers.filter(l => {
          let find = checks.find(check => check == l.key);
          return !find;
        });
        let visible = layers.filter(l => {
          let find = checks.find(check => check == l.key);
          return find;
        });
        visible.forEach(l => {
          map.getLayer(l.key) &&
            map.setLayoutProperty(l.key, "visibility", "visible");
        });
        unvisible.forEach(l => {
          map.getLayer(l.key) &&
            map.setLayoutProperty(l.key, "visibility", "none");
        });
      }
    }
  },

  created() {
    const { map, layers } = this;
    this.document = new Document(map, layers);
  },

  mounted() {
    this.getParentLayer();
  },

  beforeDestroy() {},

  methods: {
    getMapComponents(component) {
      if (!component) return undefined;
      let parent = component.$parent;
      if (parent) {
        const { tag } = parent.$vnode;
        if (tag.match("mapgis-web-map")) {
          return parent;
        }
      }
      return this.getMapComponents(parent);
    },
    getParentLayer() {
      const vm = this;
      if (this.map) {
        let parent = this.getMapComponents(this);
        let children = parent.$children;
        children.forEach(child => {
          let node = child.$vnode;
          if (node.tag && node.tag.match("-layer")) {
            let id = child.$props.layerId;
            let info = vm.document.getLayerComInfo(node.tag);
            const { name, icon } = info;
            vm.layers.push({
              key: id, // antd-vue 保留关键字
              title: id, // antd-vue 保留关键字
              name, // 组件名称
              icon, // 组件图标
              scopedSlots: { icon: "custom", title: "title" }
            });
            vm.document.setLayers(vm.layers);
            vm.checkedKeys.push(id);
          }
        });
      } else {
        // 后面处理外部传入props outmap
      }
    },

    remove() {
      this.$_emitEvent("removed");
    },

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },

    onReveseClick(paylod) {
      const { layerId } = paylod;
      this.checkedKeys = [layerId];
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
      let { layers } = this;
      const dataList = [];
      const generateList = data => {
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const key = node.key;
          dataList.push({ key, title: key });
          if (node.children) {
            generateList(node.children);
          }
        }
      };
      generateList(layers);

      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, layers);
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

    handleMenuOpen(e) {
      this.selectLayer = e.elm.title;
    }
  }
};
</script>

<style lang="css">
.mapgis-document-wrapper {
  /* position: absolute; */
}

.document-header-title {
  font-size: 20px;
  font-weight: bold;
  padding: 6px 12px;
  line-height: 20px;
}
.document-header-title span {
  margin-left: 12px;
}
</style>
