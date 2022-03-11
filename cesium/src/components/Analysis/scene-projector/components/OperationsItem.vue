<template>
  <div class="operations-row">
    <template>
      <mapgis-ui-tooltip placement="bottom">
        <template slot="title">
          <span>{{ textCopy }}</span>
        </template>
        <div class="text">
          {{ itemtext }}
        </div>
      </mapgis-ui-tooltip>
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
import { newGuid } from "../../../Utils/util";

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
    },
    itemtext() {
      if (this.textCopy.length > 20) {
        return `${this.textCopy.substring(0, 16)}...`;
      }
      return this.textCopy;
    }
  },
  data() {
    return {
      textCopy: this.text // text字段备份字段
    };
  },
  methods: {
    onClick(operation) {
      this.$emit(operation);
    }
  }
};
</script>

<style scoped>
.operations-row {
  display: flex;
  align-content: center;
  width: 100%;
}
.text {
  cursor: pointer;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 请不要更改后面四个class的顺序 */
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
/* 请不要更改上面四个class的顺序 */
</style>
