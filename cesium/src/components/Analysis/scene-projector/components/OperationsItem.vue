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
      if (this.strLen(this.textCopy) > 20) {
        return `${this.subCHString(this.textCopy, 0, 18)}...`;
      }
      return this.textCopy;
    }
  },
  watch: {
    text: {
      handler() {
        this.textCopy = this.text;
      },
      immediate: true
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
    },
    /**
     * 计算字符串长度
     */
    strLen(str) {
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255 || str.charCodeAt(i) < 0) {
          len += 2;
        } else {
          len++;
        }
      }
      return len;
    },
    /**
     * 判断某个字符是否是汉字
     */
    isCHS(str, i) {
      if (str.charCodeAt(i) > 255 || str.charCodeAt(i) < 0) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 将字符串拆成字符，并存到数组中
     */
    strToChars(str) {
      const chars = new Array();
      for (let i = 0; i < str.length; i++) {
        chars[i] = [str.substr(i, 1), this.isCHS(str, i)];
      }
      return chars;
    },
    /**
     * 截取字符串（从start字节到end字节）
     */
    subCHString(str, start, end) {
      let len = 0;
      let subStr = "";
      const charsArray = this.strToChars(str);
      for (let i = 0; i < str.length; i++) {
        if (charsArray[i][1]) {
          len += 2;
        } else {
          len++;
        }
        if (end < len) {
          break;
        } else if (start < len) {
          subStr += charsArray[i][0];
        }
      }
      return subStr;
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
