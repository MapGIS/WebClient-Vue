<template>
  <div class="mapgis-ui-clouddisk-layer-select">
    <mapgis-ui-row>
      <mapgis-ui-col v-if="isShare()" :span="14" class="demo-split-pane">
        <!-- <Input placeholder="请输入关键字搜索" class="input" v-model="searchKey" prefix="ios-search"
          @on-change="handleSearch">
        </Input> -->
        <!-- <shareaim
          :historyShareUser="historyShareUser"
          @url="handleShareUrl"
          @showUrl="showHisShare"
          @handleShareUsers="handleShareUsers"
        /> -->
      </mapgis-ui-col>
      <mapgis-ui-col v-if="isShare()" :span="10" class="demo-split-pane">
        <!-- <ShowShareList
          :shareUsers="shareUsers"
          @handleFinalUsers="handleFinalUsers"
        /> -->
      </mapgis-ui-col>

      <mapgis-ui-col v-if="!isShare()" :span="9" class="demo-split-pane">
        <!-- <company
          :isMulti="isMulti"
          :curTiffUrl="curTiffUrl"
          :tiffListsObj="tiffListsObj"
          :onlyFolder="onlyFolder"
          @url="handleUrl"
        /> -->
      </mapgis-ui-col>

      <mapgis-ui-col v-if="!isShare()" :span="15" class="demo-split-pane">
        <!-- <folder
          ref="folder"
          :url="url"
          :isMulti="isMulti"
          :curTiffUrl="curTiffUrl"
          :tiffListsObj="tiffListsObj"
          :onlyFolder="onlyFolder"
          @select="handleSelect"
          @handleSelectsInfo="handleSelectsInfo"
        /> -->
      </mapgis-ui-col>
    </mapgis-ui-row>
    <mapgis-ui-row>
      <mapgis-ui-input
        v-if="!isShare()"
        read-only
        class="treefolder-url"
        :value="select"
        size="small"
      />
    </mapgis-ui-row>
  </div>
</template>

<script>
/* import company from './company.vue'
import folder from './folder.vue'
import shareaim from './shareaim.vue'
import ShowShareList from './showShareList.vue' */

export default {
  name: "mapgis-ui-clouddisk-layerselect",
  components: {
    /* company,
    folder,
    shareaim,
    ShowShareList */
  },
  data() {
    return {
      url: undefined,
      shareUrl: [{}],
      select: "",
      outputusers: "",
      selectLists: [],
      shareUsers: []
    };
  },
  props: {
    type: {
      type: String,
      default: "folder"
    },
    historyShareUser: {
      type: Object,
      default: () => {
        return {};
      }
    },
    onlyFolder: {
      type: Boolean,
      default: false
    },
    curTiffUrl: {
      type: String,
      default: ""
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
    isShare() {
      return this.type === "share";
    },
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
      this.$emit("emitSelect", data);
      this.$emit("emitSelectInfo", [data]);
      // this.$emit('change', select)
    },
    handleSelectsInfo(selectListsObj) {
      this.selectLists = [];
      for (let key in selectListsObj) {
        this.selectLists = this.selectLists.concat(selectListsObj[key]);
      }
      this.$emit("emitSelectInfo", this.selectLists);

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
    }
  }
};
</script>

<style>
.mapgis-ui-clouddisk-layer-select {
  min-height: 300px;
  border: 1px solid #dcdee2;
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
