<template>
  <mapgis-ui-card class="path-item" type="inner">
    <div class="path-content">
      <template v-if="editable">
        <mapgis-ui-input
          v-if="editable"
          class="name-input"
          :value="name"
          @change="e => _onNameChange(e.target.value)"
        />
        <a @click="onSavePathName">保存</a>
        <mapgis-ui-divider class="name-action-divider" type="vertical" />
        <a @click="onCancelRenamePath">取消</a>
      </template>
      <template v-else>
        <div class="name" @click="$emit('goto-path')">
          {{ name }}
        </div>
        <div :class="['actions', actionMenuVisible ? 'actions-visible' : '']">
          <mapgis-ui-iconfont type="mapgis-info" :title="path.path.join()" />
          <mapgis-ui-popover
            placement="bottomLeft"
            arrow-point-at-center
            v-model="actionMenuVisible"
            trigger="click"
            overlayClassName="scene-roaming-path-item-popover"
          >
            <mapgis-ui-list slot="content" :gutter="10">
              <mapgis-ui-list-item @click="onRenamePath">
                重命名
              </mapgis-ui-list-item>
              <mapgis-ui-list-item @click="onDeletePath">
                删除
              </mapgis-ui-list-item>
            </mapgis-ui-list>
            <mapgis-ui-iconfont type="mapgis-more" />
          </mapgis-ui-popover>
        </div>
      </template>
    </div>
  </mapgis-ui-card>
</template>

<script>
export default {
  name: "path-item",
  props: {
    path: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  // computed: {
  //   newPathName: {
  //     get: function() {
  //       return this.path.name;
  //     },
  //     set: function(val) {
  //       this.path.name = val;
  //     }
  //   }
  // },
  watch: {
    "path.name": {
      handler() {
        this.name = this.path.name;
      },
      immediate: true
    }
  },
  data() {
    return {
      name: "",
      actionMenuVisible: false,
      editable: false
    };
  },
  methods: {
    onRenamePath() {
      this.actionMenuVisible = false;
      this.editable = true;
    },
    _onNameChange(val) {
      this.name = val;
    },
    onSavePathName() {
      this.editable = false;
      this.$emit("change-path-name", this.name);
      // this.path.name = this.name;
    },
    onCancelRenamePath() {
      this.editable = false;
      this.name = this.path.name;
    },
    onDeletePath() {
      this.actionMenuVisible = false;
      this.$emit("delete-path");
    }
  }
};
</script>

<style scoped>
::v-deep .mapgis-ui-card-type-inner .mapgis-ui-card-body {
  padding: 12px;
}
.path-item {
  border-radius: 3px;
}
.path-item:last-child {
  margin-bottom: 0;
}
.path-item:hover .path-content .actions {
  display: block;
}
.actions-visible {
  display: block;
}
.path-content {
  display: flex;
  align-content: center;
}
.name {
  cursor: pointer;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.actions {
  display: none;
}
.name-input {
  flex: 1;
  margin: -6px 8px -6px 0;
}
.name-action-divider {
  height: unset;
}
.anticon {
  padding-left: 8px;
  cursor: pointer;
}
.scene-roaming-path-item-popover .mapgis-ui-popover-inner {
  overflow: hidden;
}
.scene-roaming-path-item-popover
  .mapgis-ui-popover-inner
  .mapgis-ui-popover-inner-content {
  padding: 0;
}
.scene-roaming-path-item-popover
  .mapgis-ui-popover-inner
  .mapgis-ui-popover-inner-content
  .mapgis-ui-list-item {
  padding: 8px 25px;
}

.scene-roaming-path-item-popover
  .mapgis-ui-popover-inner
  .mapgis-ui-popover-inner-content
  .mapgis-ui-list-item:hover {
  cursor: pointer;
}
</style>
