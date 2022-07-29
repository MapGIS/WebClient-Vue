<template>
  <mapgis-ui-row class="mapgis-ui-input-row-left">
    <div
      class="mapgis-ui-input-row-left-title"
      :style="{ paddingLeft: paddingLeft, fontSize: fontSize }"
    >
      {{ title }}
    </div>
    <div
      class="mapgis-ui-input-row-left-input"
      :style="{
        paddingRight: paddingRight,
        marginLeft: marginLeft,
        width: enableButton ? 'calc(100% - 154px)' : width
      }"
    >
      <mapgis-ui-input
        style="width: 100%"
        @change="$_change"
        v-model="valueCopy"
        v-if="
          type === 'Text' ||
            (type === 'Image' && (!uploadUrl || uploadUrl.length == 0))
        "
      />
      <mapgis-ui-input-number
        style="width: 100%"
        @change="$_change"
        v-model="valueCopy"
        v-if="type === 'Number'"
      />
      <div
        class="full-width flex"
        v-if="type === 'Image' && uploadUrl && uploadUrl.length > 0"
      >
        <mapgis-ui-input v-model="valueCopy" @change="$_change" allowClear />
        <mapgis-ui-upload-image
          :uploadUrl="uploadUrl"
          :showUploadList="false"
          @image-url="$_updateImgUrl"
        ></mapgis-ui-upload-image>
      </div>
    </div>
    <mapgis-ui-button v-if="enableButton" type="primary" @click="$_finish"
      >完成</mapgis-ui-button
    >
    <mapgis-ui-iconfont
      v-if="enableDelete"
      type="mapgis-delete"
      @click="$_delete"
    ></mapgis-ui-iconfont>
  </mapgis-ui-row>
</template>

<script>
export default {
  name: "mapgis-ui-input-row-left",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    title: {
      type: String
    },
    value: {
      type: [String, Number]
    },
    type: {
      type: String,
      default: "Text"
    },
    fontSize: {
      type: String,
      default: "14px"
    },
    paddingLeft: {
      type: String,
      default: "10px"
    },
    paddingRight: {
      type: String,
      default: "0"
    },
    inputWidth: {
      type: String,
      default: "10px"
    },
    enableButton: {
      type: Boolean,
      default: false
    },
    marginLeft: {
      type: String,
      default: "0"
    },
    width: {
      type: String,
      default: "calc(100% - 94px)"
    },
    uploadUrl: {
      type: String,
      default: ""
    },
    enableDelete: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valueCopy: undefined
    };
  },
  watch: {
    value: {
      handler: function() {
        this.valueCopy = this.value;
      },
      deep: true
    }
  },
  methods: {
    $_change(e) {
      function getValue(value, type) {
        let result;
        if (type === "Number") {
          if (!(typeof value === "number")) {
            result = 0;
          } else {
            result = value;
          }
        } else {
          result = value;
        }
        return result;
      }
      if (!e) {
        if (this.type === "Number") {
          this.valueCopy = 0;
        } else {
          this.valueCopy = "";
        }
      } else if (typeof e === "object") {
        this.valueCopy = getValue(e.target.value, this.type);
      } else {
        this.valueCopy = getValue(e, this.type);
      }
      this.$emit("change", this.valueCopy);
    },
    $_finish() {
      this.$emit("finish");
    },
    $_updateImgUrl(url) {
      this.valueCopy = url;
      this.$emit("change", this.valueCopy);
    },
    $_delete() {
      this.$emit("delete");
    }
  },
  mounted() {
    this.valueCopy = this.value;
  }
};
</script>

<style scoped>
.mapgis-ui-input-row-left {
  text-align: left;
  height: 32px;
  line-height: 32px;
  margin: 8px 0;
}

.mapgis-ui-input-row-left-title,
.mapgis-ui-input-row-left-input {
  display: inline-block;
  height: inherit;
  vertical-align: top;
}

.mapgis-ui-input-row-left-title {
  width: 80px;
  text-align: left;
  font-size: 12px;
  /* font-weight: bolder; */
  color: var(--heading-color);
}

.mapgis-ui-input-row-left-input {
}

.full-width {
  width: 100%;
}

.flex {
  display: flex;
  align-items: center;
}
</style>
