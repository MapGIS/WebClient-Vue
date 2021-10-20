<template>
  <div id="GlobeView" ref="viewer" style="width:100%; height:100%;">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "WebGlobe",
  props: {
    libPath: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isLoad: false,
      viewer: undefined
    }
  },
  methods: {
    init() {
      if (this.isLoad) {
        return false;
      }
      this.Cesium = Cesium;
      const element = this.$refs.viewer;
      const accessToken = this.token.accessToken
        ? this.token.accessToken
        : typeof this._Cesium !== "undefined" &&
          this._Cesium().hasOwnProperty("accessToken")
        ? this._Cesium().accessToken
        : this.token.accessToken;

      // Cesium.Ion.defaultAccessToken = accessToken;
      const {} = this;
      const url = Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII");
      let options = {};

      const webGlobe = new Cesium.WebSceneControl(element, options);

      this.webGlobe = webGlobe;
      this.viewer = webGlobe.viewer;

      // registerEvents(true);
      // this.$emit("ready", { Cesium, webGlobe });
      this.isLoad = true;
      // this._resolve({ Cesium, webGlobe });
      return { Cesium, webGlobe };
    },
    getCesiumScript() {
      if (!global.Cesium) {
        const libPath = this.libPath
          ? this.libPath
          : typeof this._Cesium !== "undefined" &&
            this._Cesium().hasOwnProperty("libPath")
          ? this._Cesium().libPath
          : "https://unpkg.com/cesium/Build/Cesium/Cesium.js";

        let dirName = dirname(libPath);
        const $link = document.createElement("link");
        $link.rel = "stylesheet";
        global.document.head.appendChild($link);
        $link.href = `${dirName}/Widgets/widgets.css`;

        const $script = document.createElement("script");
        global.document.body.appendChild($script);
        $script.src = libPath;
        return new Promise((resolve, reject) => {
          $script.onload = () => {
            if (global.Cesium) {
              resolve(global.Cesium);
            } else {
              reject(
                new Error(
                  `[C_PKG_FULLNAME] ERROR: ` + "Error loading CesiumJS!"
                )
              );
            }
          };
        });
      } else {
        return Promise.resolve(global.Cesium);
      }
    },
    async beforeInit() {
      await this.getCesiumScript();
    }
  },
  mounted() {
    const { init, beforeInit } = this;
    beforeInit().then(() => init());
    // .catch((e) => _reject(new Error(`[C_PKG_FULLNAME] ERROR: ` + 'An error occurred during the initialization of the Viewer!')))
  },
  created() {
    this.isLoad = false;
    this._createPromise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  },
  destroyed() {
    if (global.Cesium) {
      let scripts = document.getElementsByTagName("script");
      let removeScripts = [];
      for (let script of scripts) {
        if (script.src.indexOf("/Cesium.js") > -1) {
          removeScripts.push(script);
        }
        if (global.Cesium.SuperMapImageryProvider) {
          if (script.src.indexOf("/Workers/zlib.min.js") > -1) {
            removeScripts.push(script);
          }
        }
      }
      removeScripts.forEach(script => {
        document.getElementsByTagName("body")[0].removeChild(script);
      });
      let links = document.getElementsByTagName("link");
      for (let link of links) {
        if (link.href.indexOf("Widgets/widgets.css") > -1) {
          document.getElementsByTagName("head")[0].removeChild(link);
        }
      }

      const { webGlobe } = this;
      webGlobe.viewer.destroy();
      this.webGlobe = null;
      this.viewer = null;
      this.isLoad = false;

      global.Cesium = null;
    }
  }
};
</script>