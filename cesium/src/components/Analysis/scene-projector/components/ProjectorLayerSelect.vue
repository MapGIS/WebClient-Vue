<template>
  <div>
    <div class="mapgis-select">
      <mapgis-ui-input
        v-model="selectedLayer"
        class="mapgis-input"
        placeholder="请选择图层名"
        @focus="showCardDialog = true"
      >
        <mapgis-ui-iconfont
          slot="suffix"
          :type="icon"
          @click="showCardDialog = !showCardDialog"
        />
      </mapgis-ui-input>
      <mapgis-ui-card v-show="showCardDialog" class="data-card">
        <div v-show="!editLayerNameVisible">
          <mapgis-ui-list :data-source="selectOptionsCopy" class="mapgis-list">
            <mapgis-ui-list-item
              class="card-content"
              slot="renderItem"
              slot-scope="item"
              :key="item.id"
              @click="clickListItem(item)"
            >
              <operations-item
                :key="item.name"
                :text="item.name"
                :operations="['edit', 'delete']"
                @delete="onDelete(item.id)"
                @edit="onEdit(item)"
              ></operations-item>
            </mapgis-ui-list-item>
          </mapgis-ui-list>
          <mapgis-ui-divider class="divider" />
          <div
            class="card-content"
            @mousedown="e => e.preventDefault()"
            @click="onAdd"
          >
            <mapgis-ui-iconfont type="mapgis-plus-circle" /> 新建图层
          </div>
        </div>
        <edit-layer-name
          v-show="editLayerNameVisible"
          :selectOptions="selectOptionsCopy"
          :editLayerName="editLayername"
          @finished="onEditLayerNameFinished"
          @edited="onEditLayerNameOk"
        ></edit-layer-name>
      </mapgis-ui-card>
    </div>
  </div>
</template>

<script>
import OperationsItem from "./OperationsItem.vue";
import EditLayerName from "./EditLayerName.vue";
import { newGuid } from "../../../Utils/util";

export default {
  name: "projector-layer-select",
  components: {
    OperationsItem,
    EditLayerName
  },
  props: {
    selectOptions: {
      type: Array,
      default: () => []
    },
    defaultValue: {
      type: String,
      default: ""
    }
  },
  computed: {
    editLayername() {
      return this.editLayer ? this.editLayer.name : "";
    },
    icon() {
      return this.showCardDialog ? "mapgis-up" : "mapgis-down";
    }
  },
  watch: {
    selectOptions: {
      handler() {
        this.selectOptionsCopy = JSON.parse(JSON.stringify(this.selectOptions));
        if (!this.isChangeBySelf) {
          //如果不是内部触发的改变，则默认取第一个
          // this.selectedLayer = this.selectOptionsCopy[0].name; // 默认选择第一个
        }
        this.isChangeBySelf = false;
      },
      deep: true,
      immediate: true
    },
    defaultValue: {
      handler() {
        if (this.defaultValue.length > 0) {
          this.selectedLayer = this.defaultValue;
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      selectOptionsCopy: [],
      selectedLayer: "",
      editLayerNameVisible: false,
      editLayer: null,
      showCardDialog: false,
      isChangeBySelf: false // 是否为内部导致的options变化，比如内部增删改
    };
  },

  methods: {
    /**
     * 图层名展示的时候后面加上对应图层视频列表总数
     */
    getLabel(item) {
      const length = item.projectorList ? item.projectorList.length : 0;
      return `${item.name}(${length})`;
    },
    /**
     * 点击图层名
     */
    clickListItem(item) {
      const selectOptions = [...this.selectOptionsCopy];
      const target = selectOptions.find(option => option.name === item.name);
      // 如果删除的图层刚好是选中的图层，则置空选中图层
      if (!target) {
        this.selectedLayer = "";
      } else {
        this.selectedLayer = item.name;
      }
      this.$emit("selectedLayer", this.selectedLayer);
      if (!this.editLayerNameVisible) {
        this.showCardDialog = false;
      }
    },
    /**
     * 修改layerName
     */
    changeName(id, dataIndex, value) {
      const selectOptions = [...this.selectOptionsCopy];
      const target = selectOptions.find(item => item.id === id);
      if (target) {
        target[dataIndex] = value;
        this.selectOptionsCopy = selectOptions;
      }
      this.$emit("change-layer-name", { id, dataIndex, value });
    },
    /**
     * 图层名编辑界面确定按钮事件
     */
    onEditLayerNameOk(val) {
      if (this.editLayer) {
        this.changeName(this.editLayer.id, "name", val);
      } else {
        const id = newGuid();
        const newLayer = { id, name: val, projectorList: [] };
        this.selectOptionsCopy.push(newLayer);
        this.$emit("add-layer", newLayer);
      }
      this.selectedLayer = val;
      this.$emit("selectedLayer", this.selectedLayer);
      this.isChangeBySelf = true;
      this.showCardDialog = false;
    },
    /**
     * 图层名编辑结束事件
     */
    onEditLayerNameFinished() {
      this.editLayerNameVisible = false;
      this.editLayer = null;
    },
    /**
     * 新建图层名
     */
    onAdd() {
      this.editLayerNameVisible = true;
      this.editLayer = null;
    },
    /**
     * 编辑图层名
     */
    onEdit(item) {
      this.editLayerNameVisible = true;
      this.editLayer = item;
    },
    /**
     * 删除选项
     */
    onDelete(id) {
      const selectOptions = [...this.selectOptionsCopy];
      this.selectOptionsCopy = selectOptions.filter(item => item.id !== id);
      this.$emit("delete-layer", id);
      this.isChangeBySelf = true;
    }
  }
};
</script>
<style scoped>
.data-card {
  width: 87%;
  margin-bottom: 12px;
  position: absolute;
  z-index: 1000;
}
.card-content {
  line-height: 28px;
  padding: 4px 8px;
  cursor: pointer;
}
.card-content:hover {
  color: var(--primary-color);
}

.divider {
  margin: 0px;
}

::v-deep .mapgis-ui-card-body {
  padding: 0px;
}

.mapgis-list {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
}
</style>
