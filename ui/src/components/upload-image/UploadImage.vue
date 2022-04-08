<template>
  <div>
    <mapgis-ui-upload
      name="file"
      accept=".jpg, image/*"
      :action="uploadUrl"
      :multiple="false"
      method="post"
      :withCredentials="true"
      :showUploadList="showUploadList"
      @change="onChangeFile"
    >
      <!-- <a-button> -->
      <mapgis-ui-iconfont type="mapgis-upload" :style="{ fontSize: '18px' }" />
      <!-- </a-button> -->
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
      default: ""
    },
    click: {
      type: Function,
      required: false
    },
    showUploadList: {
      type: Boolean,
      require: false,
      default: true
    }
  },
  methods: {
    onChangeFile(info) {
      if (info.file.status === "uploading") {
        return;
      }
      if (info.file.status === "error") {
        this.$message.error("图片上传失败，请重新上传！");
        return;
      }
      if (info.file.status === "done") {
        const url = info.file.response.url;
        const strs = this.uploadUrl.split("//");
        const baseUrl = `${strs[0]}//${strs[1].split("/")[0]}`;
        if (this.click) {
          this.click(`${baseUrl}${url}`);
        }
        this.$emit("image-url", `${baseUrl}${url}`);
        // console.log(url)
      }
    }
  }
};
</script>
