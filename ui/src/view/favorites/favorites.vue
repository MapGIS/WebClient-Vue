<template>
  <div class="book-mark-tab">
    <div class="toolbar">
      <mapgis-ui-input-search
        v-model="searchValue"
        placeholder="搜索数据"
        allow-clear
        @search="onSearch"
        @change="searchValueChange"
      ></mapgis-ui-input-search>
      <mapgis-ui-tooltip placement="right" title="添加"
        ><mapgis-ui-ant-icon
          class="add-icon"
          type="plus"
          @click="openAddModel"
        />
      </mapgis-ui-tooltip>
    </div>
    <mapgis-ui-empty v-if="!bookMarkList.length" />
    <mapgis-ui-collapse
      v-if="showType === 'list'"
      :bordered="false"
      expand-icon-position="right"
    >
      <mapgis-ui-collapse-panel
        v-for="(item, index) in bookMarkList"
        :key="item.id"
      >
        <mapgis-ui-empty v-if="!item.data.length" />
        <template slot="header"
          ><span>{{ item.name }} </span>
        </template>
        <template slot="extra">
          <mapgis-ui-tooltip title="查看">
            <mapgis-ui-ant-icon
              style="margin-right: 10px"
              type="environment"
              @click="showCurrentData($event, item)"
            />
          </mapgis-ui-tooltip>
          <mapgis-ui-tooltip title="修改">
            <mapgis-ui-ant-icon
              style="margin-right: 10px"
              type="edit"
              @click="editCurrentData($event, item, index)"
            />
          </mapgis-ui-tooltip>
          <mapgis-ui-popconfirm
            placement="topRight"
            ok-text="确认"
            cancel-text="取消"
            @confirm="deleteCurrentData($event, item.id)"
          >
            <template slot="title">
              <p>是否要删除该数据？</p>
            </template>
            <mapgis-ui-tooltip title="删除">
              <mapgis-ui-ant-icon
                class="icon-style"
                type="delete"
                @click="($event) => $event.stopPropagation()"
              />
            </mapgis-ui-tooltip>
          </mapgis-ui-popconfirm>
          ></template
        >
        <mapgis-ui-tree
          v-if="item.data.length > 0"
          :key="item.id"
          default-expand-all
          :selectable="false"
          :replace-fields="replaceFields"
          :tree-data="item.data"
        >
          <template slot="custom" slot-scope="node">
            <span
              :title="node.name"
              :class="{
                'checked-node': node.children.length === 0,
              }"
            >
              <mapgis-ui-ant-icon
                v-if="node.children.length === 0"
                type="check"
              />
              {{ node.name }}</span
            >
          </template>
        </mapgis-ui-tree>
      </mapgis-ui-collapse-panel>
    </mapgis-ui-collapse>
    <div
      v-if="showType === 'image'"
      class="result-content tree-container beauty-scroll"
    >
      <div class="image-panel">
        <div class="child-panel" v-for="item in bookMarkList" :key="item.id">
          <img
            :src="getImage(item.image)"
            alt=""
            @click="showCurrentData($event, item)"
          />
          <div class="child-panel-footer">
            <span :title="item.name">{{ item.name }}</span>
            <div class="footer-right">
              <mapgis-ui-tooltip title="修改">
                <mapgis-ui-ant-icon
                  style="margin-right: 10px"
                  type="edit"
                  @click="editCurrentData($event, item)"
                />
              </mapgis-ui-tooltip>
              <mapgis-ui-popconfirm
                placement="topRight"
                ok-text="确认"
                cancel-text="取消"
                @confirm="deleteCurrentData($event, item.id)"
              >
                <template slot="title">
                  <p>是否要删除该数据？</p>
                </template>
                <mapgis-ui-tooltip title="删除">
                  <mapgis-ui-ant-icon
                    class="icon-style"
                    type="delete"
                    @click="($event) => $event.stopPropagation()"
                  />
                </mapgis-ui-tooltip>
              </mapgis-ui-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
    <mapgis-ui-modal
      v-model="showAddName"
      :dialog-style="{ top: '150px' }"
      :width="300"
      :mask="false"
      :title="title"
      @cancel="onAddCancel"
      @ok="addData"
    >
      <mapgis-ui-input
        v-model="bookMarkName"
        placeholder="收藏信息名称"
      ></mapgis-ui-input>
    </mapgis-ui-modal>
  </div>
</template>

<script>
export default {
  name: "mapgis-ui-favorites",
  props: {
    // 列表模式下tree组件中节点信息展示的替换字段{title: "name",key: "guid"}，具体使用参考ant-design-vue中的tree组件对应api
    replaceFields: {
      type: Object,
      default: () => {
        return {
          title: "name",
          key: "guid",
        };
      },
    },
    // 初始化从接口获取的数据
    dataList: {
      type: Array,
      default: () => [],
    },
    // 展示类型 list 列表模式 image 缩略图模式
    showType: {
      type: String,
      default: "image",
    },
    // baseUrl 用于回显图片
    baseUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      bookMarkList: [],
      bookMarkListCopy: [],
      searchValue: "",
      bookMarkName: "",
      showAddName: false,
      title: "",
      type: "",
      editIndex: undefined,
    };
  },
  watch: {
    dataList: {
      deep: true,
      handler() {
        // 存一份数据用于搜索后还原数据
        this.bookMarkListCopy = JSON.parse(JSON.stringify(this.dataList));
        if (this.searchValue) {
          this.bookMarkList = this.bookMarkListCopy.filter(
            (item) => item.name.indexOf(this.searchValue) !== -1
          );
        } else {
          this.bookMarkList = JSON.parse(JSON.stringify(this.dataList));
        }
      },
    },
  },
  computed: {
    getImage() {
      return (image) => {
        if (image.startsWith("/file")) {
          const appProductName = window._CONFIG.productName || "psmap";
          return `${this.baseUrl}/${appProductName}${image}`;
        }
        return `${this.baseUrl}${image}`;
      };
    },
  },

  mounted() {},

  methods: {
    showCurrentData(e, item) {
      e.stopPropagation();
      this.$emit("showData", item);
    },
    deleteCurrentData(e, id) {
      e.stopPropagation();
      this.$emit("deleteData", id);
    },
    openAddModel() {
      this.showAddName = true;
      this.title = "新增收藏";
      this.type = "add";
    },
    editCurrentData(e, data, index) {
      e.stopPropagation();
      this.showAddName = true;
      this.title = "修改收藏";
      this.type = "edit";
      const deepCloneData = JSON.parse(JSON.stringify(data));
      this.bookMarkName = deepCloneData.name;
      const editIndex = this.bookMarkListCopy.findIndex(
        (item) => item.id === deepCloneData.id
      );
      this.editIndex = editIndex;
    },
    onAddCancel() {
      this.showAddName = false;
      this.bookMarkName = "";
      this.editIndex = undefined;
    },
    addData() {
      if (!this.bookMarkName) {
        this.$message.warning("请输入名称信息!");
        return;
      }
      const hasExist = this.bookMarkList.find(
        (item) => item.name === this.bookMarkName
      );
      if (hasExist) {
        this.$message.warning("输入的名称已存在!");
        return;
      }
      switch (this.type) {
        case "add":
          this.onAddData();
          break;
        case "edit":
          this.onEditData();
          break;
        default:
          break;
      }
      this.onAddCancel();
      // 调用接口保存数据
    },
    onSearch() {},
    searchValueChange() {
      if (!this.searchValue) {
        this.bookMarkList = JSON.parse(JSON.stringify(this.bookMarkListCopy));
      } else {
        this.bookMarkList = this.bookMarkListCopy.filter(
          (item) => item.name.indexOf(this.searchValue) !== -1
        );
      }
    },
    onAddData() {
      this.$emit("addData", this.bookMarkName);
    },
    onEditData() {
      this.$emit("editData", this.bookMarkName, this.editIndex);
    },
  },
};
</script>

<style lang="scss" scoped>
.book-mark-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  .toolbar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    .add-icon {
      padding-left: 12px;
      font-size: 19px;
      cursor: pointer;
    }
  }
  ::v-deep
    .mapgis-ui-collapse-borderless
    > .mapgis-ui-collapse-item
    > .mapgis-ui-collapse-content
    > .mapgis-ui-collapse-content-box {
    padding: 0 10px 0 0;
  }
  ::v-deep .mapgis-ui-tree > li:first-child {
    padding-top: 0;
  }
  .checked-node {
    color: var(--primary-6);
  }

  ::v-deep .mapgis-ui-collapse-header:after,
  .mapgis-ui-collapse-header:before {
    content: "";
    display: block;
    clear: both;
  }

  .result-content {
    flex: 1;
    overflow: auto;
    .image-panel {
      display: flex;
      justify-content: left;
      align-items: center;
      flex-wrap: wrap;
      .child-panel {
        > img {
          width: 240px;
          height: 140px;
          cursor: pointer;
        }
        display: flex;
        flex-direction: column;
        margin: 3px 3px;
        .child-panel-footer {
          display: flex;
          > span {
            flex: 1;
            max-width: 202px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .footer-right {
          }
        }
      }
    }
  }

  .icon-style {
    cursor: pointer;
  }
}
</style>
