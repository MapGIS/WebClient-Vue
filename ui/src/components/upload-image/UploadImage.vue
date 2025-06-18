<template>
  <div>
    <mapgis-ui-upload
      name="file"
      accept=".jpg, image/*"
      :action="uploadUrl"
      :multiple="false"
      method="post"
      :withCredentials="true"
      :show-upload-list="showUploadList"
      @change="onChangeFile"
    >
      <div>
        <mapgis-ui-tooltip slot="tip" placement="top">
          <template slot="title">
            <span>{{ info }}</span>
          </template>
          <img v-if="value" :src="getImage(value)" />
          <mapgis-ui-iconfont v-else type="mapgis-upload" class="upload-img" />
        </mapgis-ui-tooltip>
      </div>
    </mapgis-ui-upload>
  </div>
</template>

<script>
export default {
  // 组件名称，统一以"Mp"开头
  name: "mapgis-ui-upload-image",
  props: {
    uploadUrl: {
      type: String,
      required: true,
      default: "",
    },
    click: {
      type: Function,
      required: false,
    },
    showUploadList: {
      type: Boolean,
      require: false,
      default: true,
    },
    baseUrl: {
      type: String,
      default: "",
    },
    hasPrefix: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      info: `文件名不能包含下列任何字符：.\\*/:'?"<>|%`,
    };
  },
  methods: {
    onChangeFile(info) {
      const { file } = info;
      if (file.status === "uploading") {
        return;
      }
      if (file.status === "error") {
        this.$message.error("图片上传失败，请重新上传！");
        return;
      }
      if (file.status === "done") {
        const fileName = file.name.split(".")[0];
        const url = file.response.url.replace(
          fileName,
          encodeURIComponent(fileName)
        );
        const { baseUrl } = this;
        if (this.click) {
          this.click(`${baseUrl}${url}`);
        }

        this.hasPrefix
          ? this.$emit("image-url", `${baseUrl}${url}`)
          : this.$emit("image-url", url);
      }
    },
    getImage(image) {
      // 如果image是完整的路径，则直接返回全路径
      if (image.includes("://")) {
        return image;
      }
      return `${this.baseUrl}${image}`;
    },
  },
};
</script>
<style lang="scss" scoped>
img {
  width: 2em;
  height: 2em;
  margin-bottom: 0.3em;
}

.upload-img {
  font-size: "18px";
  color: var(--text-color);
}
</style>
