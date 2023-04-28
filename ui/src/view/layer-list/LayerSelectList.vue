<template>
  <div class="tree-select-content">
    <mapgis-ui-tree-select
      v-model="selectTreeKeys"
      show-search
      tree-node-filter-prop="title"
      :style="componentWidth"
      :dropdown-style="dropdownStyle"
      :tree-data="selectLayers"
      :tree-default-expand-all="isExpandAll"
      :tree-checkable="checkable"
      :tree-default-expanded-keys="expandedKeys"
      :allow-clear="allowClear"
      :replace-fields="replaceFields"
      @select="selectNode"
      @search="searchNode"
      placeholder="请选择"
    >
    </mapgis-ui-tree-select>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-layer-select-list",
  props: {
    // 组件宽度
    width: {
      type: [String, Number],
      default: 200
    },
    // 组件最大高度，超出部分overflow: "auto"
    maxHeight: {
      type: Number,
      default: 400
    },
    // 节点是否全部展开
    isExpandAll: {
      type: Boolean,
      default: true
    },
    // 默认展开的节点 isExpandAll为true该属性无效
    expandedKeys: {
      type: Array,
      default: () => []
    },
    // 节点是否可以多选
    checkable: {
      type: Boolean,
      default: false
    },
    // 是否显示清除按钮
    allowClear: {
      type: Boolean,
      default: true
    },
    // 数据目录中选中的document图层
    layers: {
      type: Array,
      default: () => []
    },
    // 默认选中的keys
    selectKeys: {
      type: Array,
      default: () => []
    },
    // 使用同ant-design中tree-select组件的replaceFields属性
    replaceFields: {
      type: Object,
      default: () => {
        return {
          children: "sublayers",
          key: "key",
          value: "value",
          label: "title"
        };
      }
    }
  },
  data() {
    return {
      selectTreeKeys: [...this.selectKeys],
      layerListArr: []
    };
  },
  computed: {
    selectLayers() {
      return this.dealLayers(this.layers) || [];
    },
    componentWidth() {
      return typeof this.width === "number"
        ? `width: ${this.width}px`
        : `width: ${this.width}`;
    },
    dropdownStyle() {
      return { maxHeight: `${this.maxHeight}px`, overflow: "auto" };
    }
  },
  watch: {
    selectLayers(val) {
      // 图层为空时取消勾选
      if (val.length === 0) {
        this.selectTreeKeys = [];
      }
      this.treeConvertList();
    },
    selectTreeKeys(val) {
      this.emitkeys(val);
    }
  },
  methods: {
    treeConvertList() {
      const arr = [];
      const keyList = [];
      let currentKey;
      // 将treeData转成list存储起来
      this.toConvert(this.selectLayers, arr, keyList, currentKey);
      this.layerListArr = arr;
    },
    toConvert(treeData, arr, keyList, currentKey) {
      treeData.forEach(item => {
        if (item.type) {
          currentKey = item.id;
          item.value = item.id;
          item.key = item.id;
        } else {
          item.value = `${currentKey}-${item.id}`;
          item.key = `${currentKey}-${item.id}`;
        }
        keyList.push(item.key);

        if (item.sublayers && item.sublayers.length > 0) {
          // 单选状态下不让勾选父节点
          if (!this.checkable) {
            item.disabled = true;
          }
          // arr数组目前只是存储转换成list后的主要信息
          arr.push({
            id: item.id,
            title: item.title,
            value: item.value,
            url: item.url,
            isChild: false
          });
          this.toConvert(item.sublayers, arr, keyList, currentKey);
        } else {
          // arr数组目前只是存储转换成list后的主要信息
          arr.push({
            id: item.id,
            title: item.title,
            value: item.value,
            url: item.url,
            isChild: true,
            layer: item.layer
          });
        }
      });
    },
    // 图层对象直接传入tree-select组件控制台会报错,需要转成普通对象
    dealLayers(layers) {
      const newLayers = [];
      layers.forEach(item => {
        const obj = {};
        for (const key in item) {
          if (Object.hasOwnProperty.call(item, key)) {
            obj[key] = item[key];
          }
        }
        newLayers.push(obj);
      });
      return newLayers;
    },
    emitkeys(keys) {
      keys = this.checkable ? keys : [keys];
      const needSelectList = [];
      keys.forEach(item => {
        const data = this.layerListArr.find(child => child.value === item);
        data && needSelectList.push(data);
      });
      this.$emit("on-select", keys, needSelectList);
    },
    searchNode(keyword) {},
    selectNode(node) {}
  }
};
</script>

<style lang="scss">
.tree-select-content {
  .mapgis-ui-select-selection--multiple {
    max-height: 32px;
    overflow-y: hidden;
    overflow-x: auto;
    .mapgis-ui-select-selection__rendered {
      display: flex;
    }
    .mapgis-ui-select-selection__choice {
      text-align: center;
      min-width: max-content;
      border: 0;
    }
    .mapgis-ui-select-search__field__wrap {
      margin-left: 10px;
    }
  }
  .mapgis-ui-select-selection__clear {
    right: 2px;
  }
  .mapgis-ui-select-selection--multiple::-webkit-scrollbar {
    height: 3px;
  }
}
</style>
