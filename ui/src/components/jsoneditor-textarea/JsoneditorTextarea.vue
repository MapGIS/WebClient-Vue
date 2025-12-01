<template>
  <div class="json-editor-textarea">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/addon/lint/lint.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/rubyblue.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/json-lint";

export default {
  name: "mapgis-ui-jsoneditor-textarea",
  /* eslint-disable vue/require-prop-types */
  props: ["value", "visible"],
  data() {
    return {
      jsonEditor: false,
    };
  },
  watch: {
    value(value) {
      const editorValue = this.jsonEditor.getValue();
      if (value !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2));
      }
    },
    visible(val) {
      if (val) {
        this.$nextTick(() => this.jsonEditor.refresh());
      }
    },
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: "application/json",
      gutters: ["CodeMirror-lint-markers"],
      theme: "rubyblue",
      lint: true,
    });

    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2));
    this.jsonEditor.on("change", (cm) => {
      this.$emit("changed", cm.getValue());
      this.$emit("input", cm.getValue());
    });
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue();
    },
  },
};
</script>

<style scoped lang="scss">
.json-editor-textarea {
  height: 100%;
  position: relative;

  ::v-deep .CodeMirror {
    height: 100%;
    min-height: 300px;
  }
}
::v-deep .CodeMirror-scroll {
  min-height: 300px;
}

::v-deep .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
</style>
