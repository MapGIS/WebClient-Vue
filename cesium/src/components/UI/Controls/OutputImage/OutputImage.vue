<template>
  <div>
    <slot>
      <div class="mapgis-widget-output-image">
        <mapgis-ui-input v-model="imgName" placeholder="请输入输出图片名">
          <div slot="addonAfter">
            <mapgis-ui-select v-model="outputType" class="outputType-select">
              <mapgis-ui-select-option
                v-for="item in outputTypes"
                :value="item"
                :key="item"
              >
                {{ item }}
              </mapgis-ui-select-option>
            </mapgis-ui-select>
            <mapgis-ui-tooltip
              placement="bottom"
              title="下载"
              arrow-point-at-center
            >
              <mapgis-ui-iconfont
                class="download-icon"
                type="mapgis-download"
                @click="download"
              />
            </mapgis-ui-tooltip>
          </div>
        </mapgis-ui-input>
      </div>
    </slot>
  </div>
</template>

<script>
import jsPDF from "jspdf";
export default {
  name: "mapgis-3d-output-image",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {},
  watch: {
    outputType: {
      handler() {
        if (
          !this.imgName ||
          this.imgName === "" ||
          this.outputTypes.includes(this.imgName.split("-")[0])
        ) {
          this.imgName = `${this.outputType}-${new Date().toLocaleString()}`;
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      imgName: "",
      outputType: "tiff",
      outputTypes: ["tiff", "pdf", "bmp", "png", "gif", "jpg", "ico"]
    };
  },

  computed: {
    mime() {
      const { outputType } = this;
      let mime = "image/bmp";
      switch (outputType) {
        case "pdf":
          mime = "application/pdf";
          break;
        case "tiff":
        case "bmp":
        case "png":
        case "gif":
          mime = `image/${outputType}`;
          break;
        case "jpg":
          mime = `image/jpeg`;
          break;
        case "ico":
          mime = `image/x-icon`;
          break;
      }
      return mime;
    }
  },

  created() {},
  mounted() {
    this.mount();
  },
  destroyed() {
    this.unmount();
  },
  methods: {
    async createCesiumObject() {
      const { baseUrl, options } = this;
      return new Promise(
        resolve => {
          resolve();
        },
        reject => {}
      );
    },
    mount() {
      const vm = this;
      let promise = vm.createCesiumObject();
      promise.then(function(dataSource) {
        vm.$emit("load", vm);
      });
    },
    unmount() {
      this.$emit("unload", this);
    },
    download() {
      this.viewer.render();
      let { canvas } = viewer;
      if (!canvas.clientHeight || !canvas.clientWidth) {
        // 从viewer上拿到的canvas可能是空的
        const cesiumWidgets = document.getElementsByClassName("cesium-widget");
        for (let i = 0; i < cesiumWidgets.length; i++) {
          canvas = cesiumWidgets[i].getElementsByTagName("canvas")[0];
          if (canvas.clientHeight && canvas.clientWidth) {
            break;
          }
        }
      }
      const res = this.Cesium.ReImg.fromCanvas(canvas);
      //res.downloadPng(this.imgName);
      const base64 = res.toBase64();
      this.downloadFileByBase64(
        base64,
        this.imgName,
        canvas.clientHeight,
        canvas.clientWidth
      );
    },
    dataURLtoBlob(dataurl) {
      const arr = dataurl.split(",");
      const bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: this.mime });
    },
    downloadFile(url, name) {
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", name);
      a.setAttribute("target", "_blank");
      let clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent("click", true, true);
      a.dispatchEvent(clickEvent);
    },
    downloadFileByBase64(base64, name, height, width) {
      const { mime } = this;
      if (mime.includes("image/")) {
        const blob = this.dataURLtoBlob(base64);
        const imgUrl = URL.createObjectURL(blob);
        this.downloadFile(imgUrl, name);
      } else if (mime.includes("pdf")) {
        const imgHRatio = height / width;
        //l:横向， p：纵向
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        let pdf = new jsPDF("p", "pt", "a4");
        let pdfHeight = pdf.internal.pageSize.height;
        let pdfWidth = pdf.internal.pageSize.width;
        const pdfInnerHRatio = (pdfHeight - 20) / (pdfWidth - 20);
        if (imgHRatio <= pdfInnerHRatio) {
          // 横向
          pdf = new jsPDF("l", "pt", "a4");
          pdfHeight = pdf.internal.pageSize.height;
          pdfWidth = pdf.internal.pageSize.width;
        }
        // 四边预留10px的白边
        const pdfInnerHeight = pdfHeight - 2 * 10;
        const pdfInnerWidth = pdfWidth - 2 * 10;
        const pWidth = pdfInnerHeight / imgHRatio;
        if (pWidth < pdfInnerWidth) {
          const xStart = (pdfWidth - pWidth) / 2;
          //x位置，y位置，宽，高
          pdf.addImage(base64, "PNG", xStart, 10, pWidth, pdfInnerHeight);
        } else {
          const pHeight = pdfInnerWidth * imgHRatio;
          const yStart = (pdfHeight - pHeight) / 2;
          //x位置，y位置，宽，高
          pdf.addImage(base64, "PNG", 10, yStart, pdfInnerWidth, pHeight);
        }
        pdf.save(name);
      }
    }
  }
};
</script>
<style scoped>
.download-icon {
  padding: 0 0 0 10px;
}
.outputType-select {
  width: 70px;
}
</style>
