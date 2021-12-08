<template>
  <div class="video-table-row">
    <template v-if="editable">
      <!-- 修改video的name -->
      <mapgis-ui-input
        v-if="editable"
        class="name-input"
        :value="nameCopy"
        @change="e => _onNameChange(e.target.value)"
      />
      <a @click="onSaveVideoName">保存</a>
      <mapgis-ui-divider class="name-action-divider" type="vertical" />
      <a @click="onCancelRenameVideo">取消</a>
    </template>
    <template v-else>
      <!-- 显示video的name和操作按钮 -->
      <div class="name" @click="$emit('goto-video')">
        {{ nameCopy }}
      </div>
      <div class="video-table-row-action">
        <mapgis-ui-toolbar-command
          icon="mapgis-bianji"
          title="编辑"
          @click="onEditVideo"
        ></mapgis-ui-toolbar-command>
        <mapgis-ui-toolbar-command
          icon="mapgis-shanchu"
          title="删除"
          @click="onDeleteVideo"
        ></mapgis-ui-toolbar-command>
        <mapgis-ui-toolbar-command
          icon="mapgis-shexiangji"
          title="投放"
          @click="onPutVideo"
        ></mapgis-ui-toolbar-command>
        <!-- 更多按钮 -->
        <mapgis-ui-popover
          placement="bottomLeft"
          arrow-point-at-center
          v-model="actionMenuVisible"
          trigger="click"
          overlayClassName="scene-roaming-path-item-popover"
        >
          <mapgis-ui-list slot="content" :gutter="10">
            <mapgis-ui-list-item @click="onRenameVideo">
              重命名
            </mapgis-ui-list-item>
          </mapgis-ui-list>
          <mapgis-ui-iconfont type="mapgis-more" />
        </mapgis-ui-popover>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "video-item",
  props: {
    name: String // 传入要修改的name字段
  },
  data() {
    return {
      nameCopy: this.name, // 那么字段备份字段
      actionMenuVisible: false, // 是否显示更多里的菜单
      editable: false //是否编辑name
    };
  },
  methods: {
    /**
     * 重命名按钮事件
     */
    onRenameVideo() {
      this.actionMenuVisible = false;
      this.editable = true;
    },
    /**
     * 输入框修改事件
     */
    _onNameChange(val) {
      this.nameCopy = val;
    },
    /**
     * 保存按钮事件
     */
    onSaveVideoName() {
      this.editable = false;
      this.$emit("update-name", this.nameCopy);
    },
    /**
     * 取消按钮事件
     */
    onCancelRenameVideo() {
      this.editable = false;
    },
    /**
     * 删除按钮事件
     */
    onDeleteVideo() {
      this.actionMenuVisible = false;
      this.$emit("delete-video");
    },
    /**
     * 编辑按钮事件
     */
    onEditVideo() {
      this.actionMenuVisible = false;
      this.$emit("edit-video");
    },
    /**
     * 投放按钮事件
     */
    onPutVideo() {
      this.actionMenuVisible = false;
      this.$emit("put-video");
    }
  }
};
</script>

<style lang="scss">
.video-table-row {
  display: flex;
  align-content: center;
  .name {
    cursor: pointer;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .name-input {
    flex: 1;
    margin: -6px 8px -6px 0;
  }
  .name-action-divider {
    height: unset;
  }
}
.video-table-row-action {
  display: none;
}

.video-table-row:hover .video-table-row-action {
  display: inline-block;
}

.video-item-popover {
  .mapgis-ui-popover-inner {
    overflow: hidden;
    .mapgis-ui-popover-inner-content {
      padding: 0;
      .mapgis-ui-list-item {
        padding: 8px 25px;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
