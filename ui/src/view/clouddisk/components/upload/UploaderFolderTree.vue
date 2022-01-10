<template>
  <div class="layout-model-folder">
    <mapgis-ui-tree
      :default-expanded-keys="['0-0']"
      :load-data="onLoadData"
      :tree-data="treeData"
      @select="onSelect"
    >
      <template slot="title" slot-scope="{ title, icon }">
        <mapgis-ui-iconfont :type="icon" />
        <span> {{ title }} </span>
      </template>
    </mapgis-ui-tree>
  </div>
</template>
<script>
import { dirnavigation } from "../../axios/files";
import { getMapgisPath, getMapgisGroupPath } from "../../config/mapgis";
import UploadMixin from '../../../../mixin/UploaderMixin';

export default {
  name: "mapgis-ui-uploader-foldertree",
  mixins: [UploadMixin],
  data() {
    return {
      treeData: []
    };
  },
  props: {},
  watch: {},
  mounted() {
    this.treeData = [
      {
        title: "常规文件夹",
        key: "0-0",
        icon: "mapgis-tubiaoqietu_wenjianjia-29",
        scopedSlots: { icon: "icon", title: "title" },
        url: getMapgisPath()
      }
    ];
  },
  methods: {
    onLoadData(treeNode) {
      let vm = this;
      return new Promise(resolve => {
        // console.warn("获得节点", treeNode);
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        dirnavigation(treeNode.dataRef.url)
          .then(res => {
            if (res.status === 200) {
              let result = res.data;
              let { data, errorCode, msg } = result;
              if (errorCode < 0) {
                vm.$notification.error({ message: errorCode, description: msg });
              } else {
                // console.warn("dirnavigation结果");
                let items = data.filter(item => item.isfolder === true);
                items = items.map(d => {
                  d.icon = 'mapgis-tubiaoqietu_wenjianjia-29'
                  d.scopedSlots = { icon: "icon", title: "title" };
                  return d;
                });
                treeNode.dataRef.children = items;
                vm.treeData = [...vm.treeData];
                resolve();
              }
            }
          })
          .catch(error => {
            // console.warn("【dirnavigation错误结果】", error);
            this.$notification.error({ message: "网络异常,请检查链接", description: error });
          });
      });
    },
    onSelect(node, event) {
      // console.warn(node, event, event.node.dataRef.url);
      this.$emit("changePath", event.node.dataRef.url || "");
    }
  }
};
</script>
<style lang="scss" scoped>
.layout-model-folder {
  overflow-x: scroll;
  overflow-y: scroll;
  height: 267px;
  // margin-left: 10px;
  // min-width: 200px;
  .ivu-tree-title-selected,
  .ivu-tree-title-selected:hover {
    background-color: transparent;
  }

  .compay-view-tip-root {
    height: 20px;
    width: 80px;
    font-family: 微软雅黑;
    font-size: 12.5px;
    font-weight: normal;
    font-stretch: normal;

    padding-top: 4px;
    color: #333333;
  }

  .compay-view-tip {
    height: 20px;
    width: 150px;

    font-family: 微软雅黑;
    font-size: 12.5px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 16px;
    padding-top: 5px;
    color: #333333;

    letter-spacing: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
}

.layout-model-folder::-webkit-scrollbar {
  width: 8px;
  height: 12px;
  border: 1px solid #fcfcfc;
  border-radius: 4px;
  background-color: transparent;
}

.layout-model-folder::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
  /* border-radius: 3px; */
  /* background-color: #e0f2fb; */
  background-color: transparent;
}

.layout-model-folder::-webkit-scrollbar-thumb {
  /* border-radius: 3px; */
  /* -webkit-box-shadow: inset 0 0 6px #2d8cf0; */
  background-color: #e7e9eb;
}
</style>
