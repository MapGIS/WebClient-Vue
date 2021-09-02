<template>
  <div class="mapgis-ui-clouddisk-layout-model-folder" :style="{height:simple? 'calc(100vh - 200px)': '275px'}">
    <!-- <mapgis-ui-spin v-show="isLoading"> -->
      <mapgis-ui-tree
        v-show="!isLoading"
        class="layout-tree-company"
        ref="folderTree"
        :loadData="loadCompany"
        :treeData="data"
        :checkable="isMulti"
        :checkStrictly="true"
        @check="selectTiff"
        @expand="handelExpand"
        @select="handelClick"
      >
      </mapgis-ui-tree>
      <!-- <Tree
      :selected="true"
      :show-checkbox="isMulti"
      :select-node="isMulti"
      :check-strictly="true"
      @on-check-change="selectTiff"
    >
    </Tree> -->
    <!-- </mapgis-ui-spin> -->
  </div>
</template>
<script>
import { dirnavigation } from "../../axios/files";
import { getShareList } from "../../axios/share.js";
import { getFileIcon } from "../../util/fileType";
import { getMapgisPath, getMapgisGroupPath } from "../../config/mapgis";

// const DefaultData = {
//   title: '目录',
//   icon: 'iconwenjianjia-shouqi-',
//   loading: false,
//   // expand: true,
//   children: [],
//   groupId: -1
// }

export default {
  name: "mapgis-ui-clouddisk-folder",
  data() {
    return {
      data: [],
      // defaultURL: getMapgisPath() + '/.gis',
      selectListsObj: {},
      isLoading: false
    };
  },
  props: {
    simple: {
      type: Boolean,  
      default: false
    },
    url: {
      type: Number,
      default: -100
    },
    onlyFolder: {
      type: Boolean,
      default: true
    },
    isMulti: {
      type: Boolean,
      default: false
    },
    isStyle: {
      type: Boolean,
      default: false
    },
    curTiffUrl: {
      type: String,
      default: ""
    },
    tiffListsObj: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    url(next) {
      this.showDirFiles(next);
    },
    onlyFolder() {
      let nextUrl = -100;
      this.showDirFiles(nextUrl);
    },
    curTiffUrl(next) {
      if (next === "") return;
      // let index = next.indexOf('.gis')
      if (this.isMulti) {
        let nextUrl = this.url;
        this.showDirFiles(nextUrl);
      }
    },
    tiffListsObj(next) {
      this.selectListsObj = next;
    }
  },
  mounted() {
    this.showDirFiles(this.url)
  },
  methods: {
    updataFolder() {
      this.showDirFiles(this.url);
    },
    showDirFiles(url) {
      let vm = this;
      vm.isLoading = true;
      if (url === -1) {
        let nullData = {
          title: "目录",
          icon: "iconwenjianjia-shouqi-",
          loading: false,
          expand: false,
          // children: [],
          groupId: -1,
          key: '0-1'
        };
        vm.data = [nullData];
        vm.isLoading = false;
      } else if (url === -98 || url === -97) {
        let isShareToMe = url === -97; // 选我的接收文件时，isShareToMe为true，isInnerPublic为false
        let isInnerPublic = url === -98; // 选公共数据时，isShareToMe为false，isInnerPublic为true
        getShareList(isShareToMe, isInnerPublic)
          .then(res => {
            if (res.status === 200) {
              let result = res.data;
              let { data, errorCode, msg } = result;
              if (errorCode < 0) {
                let nullData = {
                  title: "目录",
                  icon: "iconwenjianjia-shouqi-",
                  loading: false,
                  expand: false,
                  // children: [],
                  groupId: -1,
                  key: '0-2'
                };
                vm.data = [{ ...nullData }];
                this.$notification.error({ message: errorCode, description: msg });
                vm.isLoading = false;
              } else {
                let commonData = [];
                data.forEach(ele => {
                  if (!ele.valid) return;
                  let index = ele.resInfo.url.indexOf(ele.resInfo.title);
                  ele.resInfo.commonUrl = ele.resInfo.url.slice(0, index - 1);
                  ele.resInfo.innerUserRole = ele.innerUserRole;
                  ele.resInfo.isPublic = ele.allInnerUser;
                  ele.resInfo.icon = getFileIcon(ele.resInfo.ext);
                  if (ele.resInfo.isfolder) {
                    // ele.resInfo.children = [];
                    ele.resInfo.loading = false;
                    ele.resInfo.disableCheckbox = true;
                    // ele.resInfo.disableCheckbox = true
                  } else {
                    delete ele.resInfo.loading;
                  }
                  commonData.push(ele.resInfo);
                });
                // commonData = this.checkSelected(url, "", commonData);
                let newDefaultData = {
                  title: "目录",
                  icon: "iconwenjianjia-shouqi-",
                  loading: false,
                  expand: true,
                  disableCheckbox: true,
                  children: commonData,
                  groupId: -1,
                  url: url,
                  key: '0-3'
                };
                vm.data = [newDefaultData];
                vm.isLoading = false;
              }
            }
          })
          .catch(error => {
            this.$notification.error({ message: "网络异常,请检查链接", description: error });            
            vm.isLoading = false;
          });
      } else if (url === -100) {
        let defaultURL = getMapgisGroupPath();
        dirnavigation(defaultURL)
          .then(res => {
            if (res.status === 200) {
              let result = res.data;
              let { data, errorCode, msg } = result;
              if (errorCode < 0) {
                let nullData = {
                  title: "目录",
                  icon: "iconwenjianjia-shouqi-",
                  loading: false,
                  expand: false,
                  // children: [],
                  groupId: -1,
                  key: '0-4'
                };
                vm.data = [{ ...nullData }];
                this.$notification.error({ message: errorCode, description: msg });
                vm.isLoading = false;
              } else {
                let items = this.onlyFolder
                  ? data.filter(item => item.isfolder === true)
                  : data;
                items = items.filter(item => {
                  if (item.isfolder) {
                    return true
                  } else if (this.isStyle) {
                    return item.type === '.style'
                  } else {
                    let hasImport = item.xattrs && item.xattrs.dataSource && item.xattrs.dataSource !== ''
                    return hasImport
                  }
                })
                items = items.map(d => {
                  d.commonUrl = defaultURL;
                  d.icon = getFileIcon(d.ext);
                  if (d.isfolder) {
                    d.loading = false;
                    // d.children = [];
                    d.disableCheckbox = true;
                  } else {
                    d.isLeaf = true;
                    d.expand = false;
                    delete d.loading;
                  }
                  return d;
                });
                // items = this.checkSelected(url, defaultURL, items);
                let newDefaultData = {
                  title: "目录",
                  icon: "iconwenjianjia-shouqi-",
                  loading: false,
                  expand: true,
                  disableCheckbox: true,
                  children: items,
                  groupId: -1,
                  url: defaultURL,
                  key: '0-5'
                };
                vm.data = [newDefaultData];
                vm.isLoading = false;
              }
            }
          })
          .catch(error => {
            this.$notification.error({ message: "网络异常,请检查链接", description: error });
            vm.isLoading = false;
          });
      }
    },
    handelClick (selectedKeys, e) {
      // console.warn('当前选择', e.node.dataRef.url)
      if (!this.isMulti) {
        this.$emit("select", e.node.dataRef.url, e.node.dataRef)
      } else {
        // if (data.isfolder) {
        //   this.$set(data, "expand", !data.expand);
        //   // data.expand = true
        //   this.loadCompany(data, this.renewData);
        // } else {
        //   this.$set(data, "checked", !data.checked);
        //   let selects = this.$refs.folderTree.getCheckedNodes();
        //   this.selectListsObj[this.url] = selects;
        //   this.$emit("handleSelectsInfo", this.selectListsObj);
        // }
      }
    },
    clickHander(data, e) {
      // console.warn(e)
      if (!this.isMulti) {
        // console.warn(data)
        // let items = document.getElementsByClassName('ivu-tree-children')

        // for (let i = 0; i < items.length; i++) {
        //   let item = items[i]
        //   item.className = 'ivu-tree-children'
        // }
        // let node = e.target
        // while (node.className !== 'ivu-tree-children') {
        //   node = node.parentNode
        // }
        // node.className = 'menu-node-active ivu-tree-children'
        this.$emit("select", data.url, data);
      } else {
        // console.warn(data)
        if (data.isfolder) {
          this.$set(data, "expand", !data.expand);
          // data.expand = true
          this.loadCompany(data, this.renewData);
        } else {
          this.$set(data, "checked", !data.checked);
          let selects = this.$refs.folderTree.getCheckedNodes();
          this.selectListsObj[this.url] = selects;
          this.$emit("handleSelectsInfo", this.selectListsObj);
          // console.warn('复选框1', selects, this.url, this.selectListsObj)
          // data.checked = true
        }
      }
    },
    loadCompany(item) {
      return new Promise(resolve => {
        if (item.dataRef.children) {
          // console.warn('进到有children的里面')
          resolve();
          return;
        }
        dirnavigation(item.dataRef.url)
          .then(res => {
            if (res.status === 200) {
              let result = res.data;
              let { data, errorCode, msg } = result;
              if (errorCode < 0) {
                this.$notification.error({ message: errorCode, description: msg });
              } else {
                let items = this.onlyFolder
                  ? data.filter(item => item.isfolder === true)
                  : data;
                items = items.filter(item => {
                  if (item.isfolder) {
                    return true
                  } else if (this.isStyle) {
                    return item.type === '.style'
                  } else {
                    let hasImport = item.xattrs && item.xattrs.dataSource && item.xattrs.dataSource !== ''
                    return hasImport
                  }
                })
                items = items.map(d => {
                  d.commonUrl = item.commonUrl;
                  d.icon = getFileIcon(d.ext);
                  if (d.isfolder) {
                    d.loading = false;
                    // d.children = [];
                    d.disableCheckbox = true;
                  } else {
                    d.isLeaf = true;
                    d.expand = false;
                    delete d.loading;
                  }
                  return d;
                });
                // items = this.checkSelected(this.url, item.dataRef.url, items);
                item.dataRef.children = items;
                // vm.data = [...vm.data];
                // console.warn(items)
                // callback(items, item);
              }
            }
          })
          .catch(error => {
            this.$notification.error({ message: "网络异常,请检查链接", description: error });
          });
      })
    },
    selectTiff(checkedKeys, e) {
      let selects = e.checkedNodes.map(item => item.data.props);
      // console.warn('复选框', selects, e, this.url, this.selectListsObj);
      this.selectListsObj[this.url] = selects;
      this.$emit("handleSelectsInfo", this.selectListsObj);
    },
    checkSelected(url, curUrl, items) {
      let tiffList = this.selectListsObj[url];
      if (!tiffList) return items;
      if (url) {
        tiffList.forEach(tiffFile => {
          let temTiffUrl;
          if (curUrl === "") {
            temTiffUrl = tiffFile.url.substring(tiffFile.commonUrl.length + 1);
          } else {
            temTiffUrl = tiffFile.url.substring(curUrl.length + 1);
          }
          let temTiffUrlList = temTiffUrl.split("/");
          items = items.map(d => {
            if (d.title === temTiffUrlList[0]) {
              if (d.isfolder) {
                d.expand = true;
                // d.selected = true
                // d.checked = true
                this.loadCompany(d, this.renewData);
              } else {
                d.checked = true;
              }
            }
            return d;
          });
        });
      }
      return items;
    },
    renewData(items, item) {
      this.$set(item, "children", items);
      // console.warn('查看目前data', this.data, items)
      // let flag = true
      // for (let i = 0; i < this.data[0].children.length; i++) {
      //   if (items[0].pid === this.data[0].children[i].id) {
      //     flag = false
      //     this.data[0].children[i].children = items
      //     break
      //   }
      // }
      // if (flag) {
      //   for (let j = 0; j < this.data[0].children.length; j++) {
      //     if (this.data[0].children[j].children && this.data[0].children[j].children.length > 0) {
      //       for (let k = 0; k < this.data[0].children[j].children.length; k++) {
      //         if (items[0].pid === this.data[0].children[j].children[k].id) {
      //           items = items.map(d => {
      //             d.expand = false
      //             return d
      //           })
      //           this.data[0].children[j].children[k].children = items
      //           break
      //         }
      //       }
      //     }
      //   }
      // }
    },
    handelExpand (a, b) {
      // console.warn('检查展开', a, b);
    }
  }
};
</script>
<style lang="scss" scoped>
.layout-tree-company {
  width: 20vw;
}
// .layout-model-folder {
//   overflow-x: scroll;
//   overflow-y: scroll;
//   // max-height: calc(100vh - 200px);
//   max-height: 275px;
//   margin-left: 10px;
//   position: relative;
//   // min-width: 200px;
//   .ivu-tree-title-selected,
//   .ivu-tree-title-selected:hover {
//     background-color: transparent;
//   }
//   // .compay-view-tip-root {
//   //   height: 20px;
//   //   width: 80px;
//   //   font-family: 微软雅黑;
//   //   font-size: 12.5px;
//   //   font-weight: normal;
//   //   font-stretch: normal;

//   //   padding-top: 4px;
//   //   color: #333333;
//   // }

//   // .compay-view-tip {
//   //   height: 20px;
//   //   width: 150px;

//   //   font-family: 微软雅黑;
//   //   font-size: 12.5px;
//   //   font-weight: normal;
//   //   font-stretch: normal;
//   //   line-height: 16px;
//   //   padding-top: 5px;
//   //   color: #333333;

//   //   letter-spacing: 0px;
//   //   overflow: hidden;
//   //   text-overflow: ellipsis;
//   //   -o-text-overflow: ellipsis;
//   //   white-space: nowrap;
//   //   display: block;
//   // }
// }

// .layout-model-folder::-webkit-scrollbar {
//   width: 3px;
//   height: 6px;
//   background-color: transparent;
// }

// .layout-model-folder::-webkit-scrollbar-track {
//   /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
//   /* border-radius: 3px; */
//   /* background-color: #e0f2fb; */
//   background-color: transparent;
// }

// .layout-model-folder::-webkit-scrollbar-thumb {
//   /* border-radius: 3px; */
//   /* -webkit-box-shadow: inset 0 0 6px #2d8cf0; */
//   background-color: #2d8cf0;
// }
</style>
