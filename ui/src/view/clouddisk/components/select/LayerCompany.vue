<template>
  <div class="layout-model-company">
    <mapgis-ui-tree
      :loadData="loadCompany"
      :treeData="data"
      @select="handleSelect"
      :default-selected-keys="['个人空间']"
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
  OWNERSHIP_GROUP_FOLDER,
  OWNERSHIP_PUBLIC_SHARE_TO_USER,
  OWNERSHIP_OTHER_SHARE_TO_USER
} from "../../util/codeType";

import { getFilesByOrganization, getFileByRecycle } from "../../axios/files";

const ReadFromCloudDisk = [
  {
    title: "个人空间",
    key: "个人空间",
    icon: "mapgis-user",
    // selected: true,
    isLeaf: true,
    groupId: OWNERSHIP_USER_FOLDER,
    scopedSlots: { icon: "icon", title: "title" }
  },
  {
    title: "公共数据",
    key: "公共数据",
    icon: "mapgis-gongkai",
    // selected: false,
    isLeaf: true,
    groupId: OWNERSHIP_PUBLIC_SHARE_TO_USER,
    scopedSlots: { icon: "icon", title: "title" }
  },
  {
    title: "我收到的共享",
    key: "我收到的共享",
    icon: "mapgis-shoudaodegongxiang",
    // selected: false,
    isLeaf: true,
    groupId: OWNERSHIP_OTHER_SHARE_TO_USER,
    scopedSlots: { icon: "icon", title: "title" }
  },
  {
    title: "团队空间",
    key: "团队空间",
    icon: "mapgis-deleteteam",
    // selected: true,
    // isLeaf: true,
    groupId: OWNERSHIP_GROUP_FOLDER,
    scopedSlots: { icon: "icon", title: "title" }
  }
];

const SaveToCloudDisk = [
  {
    title: "个人空间",
    key: "个人空间",
    icon: "mapgis-user",
    // selected: true,
    isLeaf: true,
    groupId: OWNERSHIP_USER_FOLDER,
    scopedSlots: { icon: "icon", title: "title" }
  },
  {
    title: "团队空间",
    key: "团队空间",
    icon: "mapgis-deleteteam",
    // selected: true,
    // isLeaf: true,
    groupId: OWNERSHIP_GROUP_FOLDER,
    scopedSlots: { icon: "icon", title: "title" }
  },
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
        // if (OWNERSHIPS.indexOf(item.dataRef.groupId) < 0) {
        let groupId = item.dataRef.groupId;
        getFilesByOrganization(groupId)
          .then(res => {
            if (res.status === 200) {
            }
            let children = res.data.data.list;
            children = children.map(child => {
              // child.icon = "mapgis-deleteteam";
              child.title = child.name;
              child.scopedSlots = { icon: "icon", title: "title" };
              if (child.childs && child.childs.length === 0) {
                child.isLeaf = true
              }
              // else if (!child.childs) {
              //   child.loading = false;
              //   child.children = [];
              // }
              return child;
            });
            console.log("loadcompany", children);
            item.dataRef.children = children;
            this.data = [...this.data];
            resolve();
          })
          .catch(error => {
            let notification = {
              message: '网络异常,请检查链接',
              description: error,
              onClick: function () {
                console.warn('错误日志：', error);
              }
            };
            this.$notification.error(notification);
            // this.$store.commit("CHANGE_FILES", { files: [] });
            resolve();
          });
        // }
      });
    },
    handleSelect(keys, e) {
      if (keys.length > 0) {
        let groupId = e.node.dataRef.groupId
        if (groupId >= 0) {
          if (groupId !== OWNERSHIP_GROUP_FOLDER) {
            window.localStorage.setItem("mapgis_clouddisk_group_path", e.node.dataRef.path);
          }
        }
        this.$emit("url", groupId);
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
