<template>
  <mapgis-ui-card class="path-item" type="inner">
    <div class="path-content">
      <template v-if="editable">
        <mapgis-ui-input
          v-if="editable"
          class="name-input"
          :value="path.name"
          @change="e => _onNameChange(e.target.value)"
        />
        <a @click="onSavePathName">保存</a>
        <mapgis-ui-divider class="name-action-divider" type="vertical" />
        <a @click="onCancelRenamePath">取消</a>
      </template>
      <template v-else>
        <div class="name" @click="$emit('goto-path')">
          {{ path.name }}
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
  computed: {
    newPathName: function() {
      return this.path.name;
    }
  },
  data() {
    return {
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
      this.newPathName = val;
    },
    onSavePathName() {
      this.editable = false;
      this.path.name = this.newPathName;
    },
    onCancelRenamePath() {
      this.editable = false;
    },
    onDeletePath() {
      this.actionMenuVisible = false;
      this.$emit("delete-path");
    }
  }
};
</script>

<style lang="scss">
.mapgis-ui-card-type-inner .mapgis-ui-card-body {
  padding: 12px;
}
.path-item {
  margin-bottom: 16px;
  // background-color: @background-color-light;
  // box-shadow: 0 1px 1px @shadow-color;
  border-radius: 6px;
  &:last-child {
    margin-bottom: 0;
  }
  .path-content {
    display: flex;
    align-content: center;
    .name {
      cursor: pointer;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .actions {
      display: none;
      .anticon {
        padding-left: 8px;
        cursor: pointer;
        &:hover {
          // color: @primary-color;
        }
      }
    }
    .name-input {
      flex: 1;
      margin: -6px 8px -6px 0;
    }
    .name-action-divider {
      height: unset;
    }
  }
  &:hover {
    // box-shadow: 0 1px 2px @shadow-color;
    .path-content {
      .actions {
        display: block;
      }
    }
  }
  .path-content {
    .actions-visible {
      display: block;
    }
  }
}
.scene-roaming-path-item-popover {
  .mapgis-ui-popover-inner {
    overflow: hidden;
    .mapgis-ui-popover-inner-content {
      padding: 0;
      .mapgis-ui-list-item {
        padding: 8px 25px;
        &:hover {
          // background-color: @table-row-hover-bg;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
