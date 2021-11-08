<template>
  <div class="mapgis-ui-clouddisk-layer-select" :style="{border:simple? '0px': '1px solid #dcdee2'}">
    <mapgis-ui-row>
      <mapgis-ui-col :span="simple ? 0 : 9" class="demo-split-pane">
        <mapgis-ui-clouddisk-company
          :isMulti="isLayers"
          :tiffListsObj="tiffListsObj"
          @url="handleUrl"
        />
      </mapgis-ui-col>

      <mapgis-ui-col :span="simple ? 24 : 15" class="demo-split-pane">
        <mapgis-ui-clouddisk-folder
          ref="folder"
          :url="url"
          :simple="simple"
          :isMulti="isLayers"
          :isStyle="isStyle"
          :curTiffUrl="curTiffUrl"
          :tiffListsObj="tiffListsObj"
          :onlyFolder="onlyFolder"
          @select="handleSelect"
          @handleSelectsInfo="handleSelectsInfo"
        />
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row v-show="!simple">
      <mapgis-ui-input
        read-only
        class="treefolder-url"
        :value="select"
        size="small"
      />
    </mapgis-ui-row>
    <mapgis-ui-clouddisk-transform ref="layerTransform" :selectLists="selectLists" :selectStyle="selectStyle" :currentDocument="currentDocument" :handleNewDocument="handleNewDocument"/>
  </div>
</template>

<script>
import MapgisUiClouddiskCompany from "./LayerCompany.vue";
import MapgisUiClouddiskFolder from "./LayerFolder.vue";
import MapgisUiClouddiskTransform from "./LayerTransform.vue";
/* import folder from './folder.vue'
import shareaim from './shareaim.vue'
import ShowShareList from './showShareList.vue' */

export default {
  name: "mapgis-ui-clouddisk-layerselect",
  components: {
    MapgisUiClouddiskCompany,
    MapgisUiClouddiskFolder,
    MapgisUiClouddiskTransform
  },
  data() {
    return {
      url: undefined,
      shareUrl: [{}],
      select: "",
      outputusers: "",
      selectLists: [],
      shareUsers: [],
      selectStyle: {}
    };
  },
  props: {
    simple: {
      type: Boolean,  
      default: false
    },
    onlyFolder: {
      type: Boolean,
      default: false
    },
    curTiffUrl: {
      type: String,
      default: ""
    },
    // isMulti: {
    //   type: Boolean,
    //   default: true
    // },
    tiffListsObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    currentDocument: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isLayers: {
      type: Boolean,
      default: false
    },
    isStyle: {
      type: Boolean,
      default: false
    },
    handleNewDocument: Function
  },
  watch: {
    select(next) {
      this.$emit("change", next);
    },
    curTiffUrl(next) {
      this.select = next;
    }
    // onlyFolder (next) {
    //   console.warn('检查监控')
    //   console.warn('检查监控是否生效', next)
    // }
  },
  methods: {
    handleUrl(url) {
      if (this.selectLists.length <= 0) {
        this.select = this.curTiffUrl;
      } else {
        let inputResult = "";
        this.selectLists.forEach(select => {
          inputResult += select.url + ",";
        });
        inputResult = inputResult.slice(0, -1);
        this.select = inputResult;
      }
      this.url = url;
    },
    handleShareUrl(url) {
      if (!url[0].title) {
        this.outputusers = "请取消勾选并选择具体用户或组织 !";
      } else if (url[0].Role) {
        this.outputusers =
          "分享至： " + url[0].title + "（" + url[0].RoleName + "）";
      } else {
        this.outputusers = "分享至： " + url[0].title;
      }
      for (var i = 1; i < url.length; i++) {
        if (url[i].Role) {
          this.outputusers =
            this.outputusers +
            "； " +
            url[i].title +
            "（" +
            url[i].RoleName +
            "）";
        } else {
          this.outputusers = this.outputusers + "； " + url[i].title;
        }
      }
      this.shareUrl = url;
      this.$emit("changeshare", this.shareUrl);
    },
    showHisShare(url) {
      if (url[0].Role) {
        this.outputusers =
          "已分享至： " + url[0].title + "（" + url[0].RoleName + "）";
      } else {
        this.outputusers = "已分享至： " + url[0].title;
      }
      for (var i = 1; i < url.length; i++) {
        if (url[i].Role) {
          this.outputusers =
            this.outputusers +
            "； " +
            url[i].title +
            "（" +
            url[i].RoleName +
            "）";
        } else {
          this.outputusers = this.outputusers + "； " + url[i].title;
        }
      }
      this.shareUrl = url;
      this.$emit("changeshare", this.shareUrl);
    },
    handleShareUsers(selects) {
      this.shareUsers = selects;
    },
    handleFinalUsers(selects) {
      this.$emit("changeshare", selects);
    },
    handleSelect(select, data) {
      this.select = select;
      this.selectStyle = data;
      // this.$emit("emitSelect", data);
      // this.$emit("emitSelectInfo", [data]);
      // this.$emit('change', select)
    },
    handleSelectsInfo(selectListsObj) {
      this.selectLists = [];
      for (let key in selectListsObj) {
        this.selectLists = this.selectLists.concat(selectListsObj[key]);
      }
      // 已勾选图层，数组格式
      // this.$emit("emitSelectInfo", this.selectLists);

      let inputResult = "";
      this.selectLists.forEach(select => {
        inputResult += select.url + ",";
      });
      inputResult = inputResult.slice(0, -1);
      this.select = inputResult;
    },
    // clearSelect () {
    //   this.select = ''
    // }
    updataFolder() {
      this.select = "";
      this.$refs.folder.updataFolder();
    },
    handleAddLayer () {
      // console.warn('收到回调并执行')
      this.$refs.layerTransform.addLayer()
    },
    handleOpenStyle () {
      this.$refs.layerTransform.openStyle()
    }
  }
};
</script>

<style>
.mapgis-ui-clouddisk-layer-select {
  min-height: 300px;
  /* border: 1px solid #dcdee2; */
  padding: 0px;
}
.demo-split-pane:first-child {
  min-width: 200px;
  border-right: 1px solid #dcdee2;
}
.menu-node-active > li {
  background: #e0f2fb;
  border-left: 3px solid #2ca0f4;
  i-mapgis-ui-color: #2ca0f4;
}
.treefolder-url {
  margin-top: 0px;
}
</style>
