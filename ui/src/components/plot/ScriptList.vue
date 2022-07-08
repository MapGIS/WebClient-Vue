<template>
  <div class="plot-script-list-panel">
    <mapgis-ui-tabs
      :animated="false"
      :tabBarStyle="{ marginBottom: '8px' }"
      default-active-key="1"
    >
      <mapgis-ui-space slot="tabBarExtraContent" :size="16">
        <mapgis-ui-iconfont type="mapgis-daoru" @click="importClick">
        </mapgis-ui-iconfont>
        <input
          type="file"
          ref="importFile"
          v-show="false"
          @change="selectFile"
        />
        <mapgis-ui-iconfont
          type="mapgis-daochu"
          @click="exportClick"
        ></mapgis-ui-iconfont>
      </mapgis-ui-space>
      <mapgis-ui-tab-pane key="1" tab="脚本列表" class="control-content">
        <mapgis-ui-list
          item-layout="horizontal"
          size="small"
          :data-source="scriptListCopy"
          :split="false"
          class="plot-script-list-panel-content"
        >
          <mapgis-ui-list-item
            :class="{ 'list-active': activeIndex === index }"
            :key="index"
            slot="renderItem"
            slot-scope="item, index"
            @click="clickScript(index)"
          >
            <mapgis-ui-group-tab
              class="script-title-edit"
              v-if="editState && activeIndex === index"
            >
              <mapgis-ui-input
                v-model="nameToEdit"
                size="small"
                slot="title"
                @click.stop=""
              />
              <mapgis-ui-space :size="16" slot="handle">
                <mapgis-ui-iconfont
                  type="mapgis-check"
                  @click.stop="
                    () => {
                      scriptListCopy[activeIndex].timeLineName = nameToEdit;
                      editState = false;
                    }
                  "
                />
                <mapgis-ui-iconfont
                  type="mapgis-close"
                  @click.stop="() => (editState = false)"
                />
              </mapgis-ui-space>
            </mapgis-ui-group-tab>
            <mapgis-ui-group-tab
              :title="item.timeLineName"
              :isTitleBold="false"
              :hasTopMargin="false"
              :hasBottomMargin="false"
              v-else
            >
              <mapgis-ui-space :size="16" slot="handle">
                <mapgis-ui-iconfont
                  type="mapgis-play-circle-fill"
                  class="icon-lg"
                  @click.stop="play(index)"
                />
                <mapgis-ui-iconfont
                  type="mapgis-bianji"
                  class="icon"
                  @click.stop="edit(index)"
                />
                <mapgis-ui-iconfont
                  type="mapgis-shanchu"
                  class="icon"
                  @click.stop="remove(index)"
                />
              </mapgis-ui-space>
            </mapgis-ui-group-tab>
          </mapgis-ui-list-item>
        </mapgis-ui-list>
        <mapgis-ui-group-tab
          title="添加脚本"
          :isTitleBold="false"
          :hasTopMargin="false"
          class="plot-script-list-panel-footer"
          @click.native="addScript"
        >
          <div slot="front" class="front">
            <img src="./style/images/u77.svg" class="icon" />
          </div>
        </mapgis-ui-group-tab>
      </mapgis-ui-tab-pane>
    </mapgis-ui-tabs>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-plot-script-list",
  props: {
    scriptList: {
      type: Array
    }
  },
  watch: {
    scriptList: {
      handler: function(arr) {
        if (arr.length == 1 && Object.keys(arr[0]).length == 0) {
          return;
        }
        this.scriptListCopy = JSON.parse(JSON.stringify(arr));
      },
      deep: true,
      immediate: true
    }
    // scriptListCopy: {
    //   handler: function(arr) {
    //     this.$emit("change", JSON.parse(JSON.stringify(arr)));
    //     console.log("scriptListhange", JSON.parse(JSON.stringify(arr)));
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  // created() {
  //   this.scriptListCopy = JSON.parse(JSON.stringify(this.scriptList));
  // },
  data() {
    return {
      scriptListCopy: undefined,
      activeIndex: undefined,
      editState: false,
      nameToEdit: ""
      // plotId: undefined,
      // showScriptList: true
    };
  },
  methods: {
    clickScript(index) {
      this.activeIndex = index;
      // this.showScriptList = false;
      this.$emit("click", { index: index, list: this.scriptListCopy });
    },
    play(index) {
      this.$emit("play", { index: index, list: this.scriptListCopy });
    },
    edit(index) {
      this.activeIndex = index;
      this.nameToEdit = this.scriptListCopy[index].timeLineName;
      this.editState = true;
      this.$emit("edit", { index: index, list: this.scriptListCopy });
    },
    remove(index) {
      this.scriptListCopy.splice(index, 1);
      this.$emit("remove", this.scriptListCopy);
    },
    addScript() {
      const vm = this;
      this.scriptListCopy.push({
        timeLineName: "脚本" + (vm.scriptListCopy.length + 1),
        animations: []
      });
      this.activeIndex = vm.scriptListCopy.length - 1;
      this.$emit("addScript", this.scriptListCopy);
    },
    /**
     * 导入功能
     */
    importClick() {
      this.$refs.importFile.click();
    },
    selectFile(e) {
      const vm = this;
      let reader = new FileReader();
      reader.readAsText(e.target.files[0], "UTF-8");
      reader.onload = function(res) {
        let json = JSON.parse(res.target.result);
        if (json instanceof Array) {
          let hasData = [];
          for (let i = 0; i < json.length; i++) {
            hasData[i] = false;
          }
          for (let i = 0; i < vm.scriptListCopy.length; i++) {
            for (let j = 0; j < json.length; j++) {
              hasData[j] = false;
              if(vm.scriptListCopy[i].id === json[j].id){
                vm.scriptListCopy[i] = json[j];
                hasData[j] = true;
                break;
              }
            }
          }
          for (let i = 0; i < hasData.length; i++) {
            if (!hasData[i]) {
              vm.scriptListCopy.push(json[i]);
            }
          }
        } else {
          let hasData = false;
          for (let i = 0; i < vm.scriptListCopy.length; i++) {
            if(vm.scriptListCopy[i].id === json.id){
              vm.scriptListCopy[i] = json;
              hasData = true;
              break;
            }
          }
          if(!hasData) {
            vm.scriptListCopy.push(json);
          }
        }
        vm.$emit("import", vm.scriptListCopy);
      };
    },
    /**
     * 导出功能
     */
    async exportClick() {
      await this.exportJSON(this.scriptListCopy, "script-list.json");
      this.$emit("export", this.scriptListCopy);
    },
    exportJSON(data, filename) {
      // console.log(data, "exportJSON");
      if (typeof data === "object") {
        data = JSON.stringify(data, undefined, 4);
      }
      var blob = new Blob([data], { type: "text/json" }),
        e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    }
  }
};
</script>
