<template>
  <div class="operations-row">
    <!-- <template v-if="editable"> -->
    <!-- 修改text -->
    <!-- <mapgis-ui-input
        v-if="editable"
        class="text-input"
        :value="textCopy"
        @change="e => _onTextChange(e.target.value)"
      />
      <a @click="onSaveText">保存</a>
      <mapgis-ui-divider class="text-action-divider" type="vertical" />
      <a @click="onCancelEdit">取消</a>
    </template> -->
    <template>
      <!-- 显示text和操作按钮 -->
      <div class="text">
        {{ textCopy }}
      </div>
      <div
        :class="
          showOperations
            ? 'operations-row-action show-operations'
            : 'operations-row-action hidden-operations'
        "
      >
        <mapgis-ui-toolbar-command
          v-for="item in commands"
          :key="item.key"
          :icon="item.icon"
          :title="item.title"
          @click="onClick(item.operation)"
        ></mapgis-ui-toolbar-command>
      </div>
    </template>
  </div>
</template>

<script>
import { newGuid } from "@mapgis/webclient-vue-ui/src/util/common/util.js";
export default {
  text: "operations-item",
  props: {
    text: String, // 传入要修改的text字段
    operations: {
      // 功能集合，delete,edit,setting,locate四个任意组合
      type: Array,
      default: () => []
    },
    showOperations: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    commands() {
      const commands = [];
      for (let i = 0; i < this.operations.length; i++) {
        let command;
        const operation = this.operations[i];
        const key = newGuid();
        if (this.operations[i] === "delete") {
          command = {
            icon: "mapgis-shanchu",
            title: "删除",
            operation,
            key
          };
        } else if (this.operations[i] === "edit") {
          command = {
            icon: "mapgis-bianji",
            title: "编辑",
            operation,
            key
          };
        } else if (this.operations[i] === "setting") {
          command = {
            icon: "mapgis-setting",
            title: "设置",
            operation,
            key
          };
        } else if (this.operations[i] === "locate") {
          command = {
            icon: "mapgis-target-lock",
            title: "定位",
            operation,
            key
          };
        }
        commands.push(command);
      }
      return commands;
    }
  },
  data() {
    return {
      textCopy: this.text // text字段备份字段
      // editable: false //是否编辑text
    };
  },
  methods: {
    /**
     * 输入框修改事件
     */
    // _onTextChange(val) {
    //   this.textCopy = val;
    // },
    /**
     * 保存按钮事件
     */
    // onSaveText() {
    //   this.editable = false;
    //   this.$emit("update-text", this.textCopy);
    // },
    /**
     * 取消按钮事件
     */
    // onCancelEdit() {
    //   this.editable = false;
    // },
    onClick(operation) {
      //if (operation !== "edit") {
      this.$emit(operation);
      //} else {
      // this.editable = true;
      //}
    }
  }
};
</script>

<style lang="scss">
.operations-row {
  display: flex;
  align-content: center;
  width: 100%;
  .text {
    cursor: pointer;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .text-input {
    flex: 1;
    margin: -6px 8px -6px 0;
  }
  .text-action-divider {
    height: unset;
  }
}

// 请不要更改后面四个class的顺序
.operations-row-action {
  display: none;
}

.operations-row:hover .operations-row-action {
  display: inline-block;
}

.show-operations {
  display: inline-block;
}

.hidden-operations {
  display: none;
}
// 请不要更改上面四个class的顺序

.operations-item-popover {
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
