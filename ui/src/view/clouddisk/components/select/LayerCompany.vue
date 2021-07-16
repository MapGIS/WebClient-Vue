<template>
  <div class="layout-model-company">
    <mapgis-ui-tree
      :loadData="loadCompany"
      :treeData="data"
      @select="handleSelect"
    >
      <template slot="title" slot-scope="{ title, icon }">
        <mapgis-ui-iconfont :type="icon" />
        <span> {{ title }} </span>
      </template>
    </mapgis-ui-tree>
  </div>
</template>
<script>
import {
  OWNERSHIPS,
  OWNERSHIP_USER_FOLDER,
  OWNERSHIP_PUBLIC_SHARE_TO_USER,
  OWNERSHIP_OTHER_SHARE_TO_USER
} from "../../util/codeType";

import { getFilesByOrganization, getFileByRecycle } from "../../axios/files";

const ReadFromCloudDisk = [
  {
    title: "我的数据",
    key: "我的数据",
    icon: "mapgis-dilishujuyuan",
    selected: true,
    groupId: OWNERSHIP_USER_FOLDER,
    scopedSlots: { icon: "icon", title: "title" }
  },
  {
    title: "公共数据",
    key: "公共数据",
    icon: "mapgis-shujuziyuan",
    selected: false,
    groupId: OWNERSHIP_PUBLIC_SHARE_TO_USER,
    scopedSlots: { icon: "icon", title: "title" }
  },
  {
    title: "我的接收文件",
    key: "我的接收文件",
    icon: "mapgis-daorumoxinghuancun",
    selected: false,
    groupId: OWNERSHIP_OTHER_SHARE_TO_USER,
    scopedSlots: { icon: "icon", title: "title" }
  }
];

const SaveToCloudDisk = [
  {
    title: "我的数据",
    key: "我的数据",
    icon: "mapgis-dilishujuyuan",

    selected: true,
    groupId: OWNERSHIP_USER_FOLDER,
    scopedSlots: { icon: "icon", title: "title" }
  }
];

export default {
  name: "mapgis-ui-clouddisk-company",
  data() {
    return {
      data: ReadFromCloudDisk
    };
  },
  props: {
    mode: {
      type: String,
      default: "read" // read save
    },
    isMulti: {
      type: Boolean,
      default: false
    },
    tiffListsObj: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {},
  watch: {
    mode: {
      immediate: true,
      handler(next) {
        let newData = [];
        switch (next) {
          case "read":
            newData = ReadFromCloudDisk;
            break;
          case "save":
            newData = SaveToCloudDisk;
            break;
        }
        this.data = newData;
      }
    },
    tiffListsObj(next) {
      if (next === {}) return;
      let key = Object.keys(this.tiffListsObj)[0];
      this.data[0].selected = key === "-100";
      this.data[1].selected = key === "-98";
      this.data[2].selected = key === "-97";
      this.$emit("url", parseInt(key));
    }
  },
  methods: {
    loadCompany(item) {
      return new Promise(resolve => {
        if (OWNERSHIPS.indexOf(item.groupId) < 0) {
          let groupId = item.groupId;
          getFilesByOrganization(groupId)
            .then(res => {
              if (res.status === 200) {
              }
              let children = res.data.data.list;
              children = children.map(child => {
                let url = {
                  title: child.name,
                  prefix: "/" + child.name,
                  alias: "/" + child.name,
                  uri: child.path
                };
                child.url = url;
                if (child.childs && child.childs.length > 0) {
                  child.children = [];
                  child.loading = false;
                } else if (!child.childs) {
                  child.loading = false;
                  child.children = [];
                }
                return child;
              });
              console.log("loadcompany", children);
              // this.treeData = [...this.treeData];
              resolve();
            })
            .catch(error => {
              this.$Notice.error({ title: "网络异常,请检查链接", desc: error });
              this.$store.commit("CHANGE_FILES", { files: [] });
              resolve();
            });
        }
      });
    },
    storeTrash(data) {
      let url = data.url;
      this.$store.commit("CHANGE_FILES_LOADING", { loading: true });
      getFileByRecycle(url.uri)
        .then(res => {
          if (res.status === 200) {
            let result = res.data;
            let { data, errorCode, msg } = result;
            if (errorCode < 0) {
              this.$store.commit("CHANGE_FILES", { files: [] });
              this.$Notice.error({ title: errorCode, desc: msg });
            } else {
              this.$store.commit("CHANGE_FILES", { files: data });
              this.$store.commit("CHANGE_CONTENT_TYPE", {
                contentType: "recycle"
              });
              this.$store.commit("CHANGE_RECYCLE", { recycle: false });
              this.$store.commit("CHANGE_DELETE", { delete: false });
              this.$store.commit("CHANGE_SECRETFUNCTION", {
                secretFunction: false
              });
            }
          }
          this.$store.commit("CHANGE_FILES_LOADING", { loading: false });
        })
        .catch(error => {
          this.$Notice.error({ title: "网络异常,请检查链接", desc: error });
          this.$store.commit("CHANGE_FILES", { files: [] });
          this.$store.commit("CHANGE_FILES_LOADING", { loading: false });
        });
    },
    handleSelect(keys, event) {
      if (keys.length > 0) {
        this.$emit("url", event.node.dataRef.groupId);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-model-company {
  overflow-x: hidden;
  overflow-y: scroll;
  // padding-left: 10px;
  height: 275px;
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

.layout-model-company::-webkit-scrollbar {
  width: 3px;
  height: 12px;
  background-color: transparent;
}

.layout-model-company::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
  /* border-radius: 3px; */
  /* background-color: #e0f2fb; */
  background-color: transparent;
}

.layout-model-company::-webkit-scrollbar-thumb {
  /* border-radius: 3px; */
  /* -webkit-box-shadow: inset 0 0 6px #2d8cf0; */
  background-color: #2d8cf0;
}

.layout-tree-company {
  width: 35vw;
}
</style>
