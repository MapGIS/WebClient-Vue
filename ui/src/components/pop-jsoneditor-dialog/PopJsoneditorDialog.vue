<template>
  <mapgis-ui-modal
    class="pop-json-editor-dialog-wrapper-modal"
    :width="realWidth"
    :visible="visible"
    @ok="$emit('ok', { config: realConfig })"
    @cancel="$emit('cancel')"
  >
    <template slot="title">
      <span> {{ `${title}` }}</span>
      <mapgis-ui-tooltip
        v-if="markdown"
        slot="tip"
        placement="top"
        title="显示说明文档"
      >
        <mapgis-ui-iconfont
          type="mapgis-info"
          style="margin-right: 5px"
          @click="
            () => {
              showMarkdownText = !showMarkdownText;
            }
          "
        ></mapgis-ui-iconfont>
      </mapgis-ui-tooltip>
    </template>
    <div class="editor-container">
      <div
        :class="[
          'json-editor-wrapper',
          { 'full-width': !markdown || !showMarkdownText },
        ]"
      >
        <div class="json-editor-container">
          <mapgis-ui-jsoneditor-textarea
            :visible="visible"
            v-model="realConfig"
          />
        </div>
      </div>
      <div v-show="markdown && showMarkdownText" class="markdownText-panel">
        <div class="scrollbar-wrapper">
          <div
            class="markdownText-content"
            v-html="formattedMarkdownText"
          ></div>
          <mapgis-ui-button
            v-if="moreInfoUrl"
            class="more-info-url-btn"
            type="link"
            @click="openMoreInfoUrl"
          >
            更多参数说明
          </mapgis-ui-button>
        </div>
      </div>
    </div>
  </mapgis-ui-modal>
</template>

<script>
// 引入markdown解析库
import MarkdownIt from "markdown-it";

export default {
  name: "mapgis-ui-pop-jsoneditor-dialog",
  props: {
    config: {
      type: [String, Boolean, Number, Object, Array],
      default() {
        return {};
      },
    },
    title: {
      type: String,
      required: true,
    },
    width: {
      type: [Number, String],
      default: 520,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    // 参数说明文档
    markdown: {
      type: [String, Object],
      default: "",
    },
    // 更多参数说明链接
    moreInfoUrl: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      realConfig: this.config,
      showMarkdownText: false,
    };
  },
  computed: {
    realWidth() {
      return this.isMobile ? "98%" : this.width;
    },
    /**
     * 将markdown转换成html格式
     */
    formattedMarkdownText() {
      // 将markdown转换为HTML
      const md = new MarkdownIt();
      const markdownContent = this.markdown;
      return md.render(markdownContent || "");
    },
  },
  watch: {
    config() {
      this.realConfig = this.config;
    },
  },
  methods: {
    /**
     * 打开更多参数说明链接
     */
    openMoreInfoUrl() {
      window.open(this.moreInfoUrl);
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-container {
  display: flex;
  height: 450px;
}

.json-editor-wrapper {
  width: 50%;
  height: 100%;
  transition: width 0.3s ease;

  &.full-width {
    width: 100%;
  }
}

.json-editor-container {
  height: 100%;
  overflow: hidden;

  ::v-deep .json-editor-textarea {
    height: 100%;

    .CodeMirror {
      height: 100%;
      max-height: none;
    }

    .CodeMirror-scroll {
      max-height: none;
    }
  }
}

.markdownText-panel {
  width: 50%;
  height: 100%;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  background-color: transparent;

  .scrollbar-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 5px;
  }

  .markdownText-content {
    padding: 0 6px;
    font-size: 12px;
    line-height: 1.6;

    ::v-deep h2 {
      font-size: 16px;
      margin: 16px 0 12px 0;
      padding-bottom: 8px;
      color: var(--text-color);
    }

    ::v-deep h3 {
      font-size: 14px;
      margin: 7px 0 5px 0;
      color: var(--text-color);
    }

    ::v-deep p {
      margin: 8px 0;
    }

    ::v-deep ul,
    ::v-deep ol {
      padding-left: 20px;
      margin: 8px 0;
    }

    ::v-deep li {
      margin: 4px 0;
    }

    ::v-deep strong {
      font-weight: bold;
    }
  }
}

.more-info-url-btn {
  border: 0px;
  padding: 0px;
  font-size: 12px;
}

.more-info-url-btn:focus,
.more-info-url-btn:hover {
  background-color: transparent;
}
</style>
