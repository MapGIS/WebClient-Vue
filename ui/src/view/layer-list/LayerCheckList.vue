<template>
  <mapgis-ui-tree
    v-if="showTree"
    v-model="checkedTreeKeys"
    checkable
    :default-expand-all="isExpandAll"
    :tree-data="checkLayers"
    :default-expanded-keys="expandedKeys"
    :replaceFields="replaceFields"
    @check="onCheck"
  ></mapgis-ui-tree>
</template>

<script>
export default {
  name: "mapgis-ui-layer-check-list",
  props: {
    // 数据目录中选中的document图层
    layers: {
      type: Object,
      default: () => {}
    },
    // 默认展开的tree节点，若设置某个节点展开，其父级节点也会展开
    expandedKeys: {
      type: Array,
      default: () => []
    },
    // 默认勾选的节点
    checkedKeys: {
      type: Array,
      default: () => []
    },
    // tree节点是否全部展开，若为true，则expandedKeys设置失效
    isExpandAll: {
      type: Boolean,
      default: false
    },
    // 当前tree初始化是否默认全部勾选，若为true，则isSingleCheck值为true失效
    isCheckAll: {
      type: Boolean,
      default: false
    },
    // tree节点勾选类型  单选|多选
    isSingleCheck: {
      type: Boolean,
      default: true
    },
    // 使用同ant-design中tree组件的replaceFields属性
    replaceFields: {
      type: Object,
      default: () => {
        return { children: "sublayers" };
      }
    }
  },
  data() {
    return {
      layerListArr: [], // 将treeData转换成Array
      showTree: false, // 确保tree保持展开状态
      checkedTreeKeys: [], // tree选中节点
      flag: false // isSingleCheck为true时的标识
    };
  },
  computed: {
    checkLayers() {
      return (
        this.layers
          .clone()
          .defaultMap.layers()
          .filter(item => [6, 5, 23, 11].includes(item.type)) || []
      );
    }
  },
  watch: {
    checkLayers(val) {
      this.showTree = false;
      if (val.length > 0) {
        this.treeConvertList();
      } else {
        this.$emit("on-check", [], []);
      }
    },
    checkedTreeKeys(val) {
      if (this.flag) return;
      this.changeCheck();
      this.flag = false;
    }
  },
  methods: {
    treeConvertList() {
      const arr = [];
      const keyList = [];
      let currentKey;
      // 将treeData转成list存储起来
      this.toConvert(this.checkLayers, arr, keyList, currentKey);
      // 处理勾选
      this.dealCheckKeys(keyList, arr);
      this.layerListArr = arr;
      this.$nextTick(() => {
        this.showTree = true;
      });
    },
    toConvert(treeData, arr, keyList, currentKey) {
      treeData.forEach(item => {
        if (item.type) {
          currentKey = item.id;
          item.key = item.id;
        } else {
          item.key = `${currentKey}-${item.id}`;
        }
        keyList.push(item.key);

        if (item.sublayers && item.sublayers.length > 0) {
          // 单选状态下不让勾选父节点
          if (this.isSingleCheck) {
            item.disabled = true;
          }
          // arr数组目前只是存储转换成list后的主要信息
          arr.push({
            id: item.id,
            key: item.key,
            title: item.title,
            url: item.url,
            isRoot: item.type,
            isChild: false
          });
          this.toConvert(item.sublayers, arr, keyList, currentKey);
        } else {
          arr.push({
            id: item.id,
            key: item.key,
            title: item.title,
            layer: item.layer,
            url: item.url,
            isRoot: item.type,
            isChild: true
          });
        }
      });
    },
    dealCheckKeys(keyList, arr) {
      // 组件更新后的地图文档key列表
      const newRoot = [];
      // 组件更新前的地图文档key列表
      const oldRoot = [];
      arr.forEach(item => {
        if (item.isRoot) {
          newRoot.push(item.key);
        }
      });
      this.layerListArr.forEach(item => {
        if (item.isRoot) {
          oldRoot.push(item.key);
        }
      });

      // 新增的地图文档
      const addRoot = newRoot.filter(item => !oldRoot.includes(item));
      // checkedTreeKeys需要新增的keys
      let newAddKeys = [];
      addRoot.forEach(item => {
        const addKeys = arr.forEach(obj => {
          if (obj.key.indexOf(item) !== -1) {
            newAddKeys.push(obj.key);
          }
        });
      });
      // 移除的地图文档
      const removeRoot = oldRoot.filter(item => !newRoot.includes(item));
      // checkedTreeKeys需要移除的keys
      let newRemoveKeys = [];
      removeRoot.forEach(item => {
        const removeKeys = this.layerListArr.forEach(obj => {
          if (obj.key.indexOf(item) !== -1) {
            newRemoveKeys.push(obj.key);
          }
        });
      });

      if (this.isCheckAll) {
        const currentKeys = [];
        this.checkedTreeKeys.forEach(item => {
          currentKeys.push(item);
        });
        const addCheckKeys = [...currentKeys, ...newAddKeys];
        this.checkedTreeKeys = addCheckKeys.filter(
          item => !newRemoveKeys.includes(item)
        );
      } else {
        if (this.isSingleCheck) {
          if (this.checkedTreeKeys.length === 1) {
            return;
          }
          if (this.checkedKeys.length > 1) {
            this.checkedTreeKeys = [this.checkedKeys[0]];
          } else {
            this.checkedTreeKeys = this.checkedKeys;
          }
        } else {
          const oldCheckedKeys = this.checkedTreeKeys.filter(
            item => !newRemoveKeys.includes(item)
          );
          const filterKeys = oldCheckedKeys.filter(
            item => !this.checkedKeys.includes(item)
          );
          this.checkedTreeKeys = [...filterKeys, ...this.checkedKeys];
        }
      }
      this.onCheck(this.checkedTreeKeys);
    },
    changeCheck() {
      // 只返回最下级勾选的节点信息
      const needCheckList = [];
      // 只返回最下级勾选的节点
      const needKeys = this.checkedTreeKeys.filter(item => {
        const data = this.layerListArr.find(child => child.key === item);
        if (data.isChild) {
          needCheckList.push(data);
        }
        return data.isChild;
      });
      this.$emit("on-check", needKeys, needCheckList);
    },
    onCheck(val) {
      if (!this.isCheckAll && this.isSingleCheck) {
        if (val.length > 1) {
          this.checkedTreeKeys = [val[0]];
          this.$message.info("单选模式下无法进行多选");
          this.flag = true;
        }

        if (val.length === 0) {
          this.flag = false;
        }
      }
    }
  }
};
</script>

<style></style>
