import EventBus, { defaultUpload } from "../util/vue-types/event-bus-uploader";

export default {
  name: "Theme",
  props: {
    /* count: 0,
    visible: false,
    current: {
      type: Array,
      default: () => []
    },
    param: {},
    isFolder: false,
    clickFlag: 0,
    fileName: "",
    status: "init", // 暂定为init(选择文件前)、check(csv预览)、upload(上传过程)
    progress: 0,
    uploadError: false,
    uploadCount: 0, // 原始云盘的complete模块
    uploads: {
      // 原始云盘的complete模块
      type: Array,
      default: () => []
    },
    giscurrents: {
      // 原始云盘的gis模块
      type: Array,
      default: () => []
    },
    giscount: {
      // 原始云盘的gis模块
      type: Array,
      default: () => []
    } */
  },
  data() {
    return {
      count: 0,
      visible: false,
      current: [],
      param: {},
      isFolder: false,
      clickFlag: 0,
      fileName: "",
      uistatus: "init", // 暂定为init(选择文件前)、check(csv预览)、upload(上传过程)
      progress: 0,
      uploadError: false,
      uploadCount: 0, // 原始云盘的complete模块
      uploads: [], // 原始云盘的complete模块
      giscurrents: [], // 原始云盘的gis模块
      giscount: [], // 原始云盘的gis模块
      websocket: { // 原始云盘的websocket模块
        WebsocketAction: "",
        WebsocketContentType: "",
        WebsocketContent: {},
        WebsocketMessageId: "" // 区分消息
      }
    };
  },
  created() {
    this.initUploadData();
    // this.registerPropListener();
  },
  mounted() {
    // 有种最暴力的方式 ，所有的响应事件都更新全部的data，让vue自身的diff算法来比较，
    // 强烈建议不要这么做，尤其是后台线程传输的时候导致的IO性能问题
    // 如果是国际化 或者 主题切换 或者 变更颜色这类很少频繁触发的可以如下实现
    /* EventBus.$on("change-xx-event", payload => {
      const $props = this.getSelfProps();
      $props.forEach(prop => {
        const dataName = this.getDataNameOfProp(prop);
        this[dataName] = payload[prop];
      });

      this.$emit("themeStyleChanged");
    }); */
    const vm = this;
    EventBus.$on("open-uploader", payload => {
      const { isFolder, clickFlag, param } = payload;
      vm.isFolder = isFolder;
      vm.clickFlag = clickFlag;
      vm.param = param;
    });
    EventBus.$on("add-uploader-count", count => {
      vm.count = count;
    });
    EventBus.$on("sub-uploader-count", count => {
      vm.count = count;
    });
    EventBus.$on("clear-uploader-count", count => {
      vm.count = count;
    });
    EventBus.$on("delete-current-file", current => {
      vm.current = current;
    });
    EventBus.$on("change-current-filename", filename => {
      vm.filename = filename;
    });
    EventBus.$on("change-ui-state", uistatus => {
      vm.uistatus = uistatus;
    });
    EventBus.$on("change-upload-process", process => {
      vm.process = process;
    });
    EventBus.$on("change-upload-error", uploadError => {
      vm.uploadError = uploadError;
    });
    EventBus.$on("add-complete-uploader-count", count => {
      vm.count = count;
    });
    EventBus.$on("add-complete-uploader-result", uploads => {
      vm.uploads = uploads;
    });
    EventBus.$on("add-gis-current", giscurrents => {
      vm.giscurrents = giscurrents;
    });
    EventBus.$on("change-websocket-action", action => {
      vm.websocket.WebsocketAction = action;
    });
    EventBus.$on("change-websocket-content", content => {
      vm.websocket.WebsocketContent = content;
    });
    EventBus.$on("change-websocket-content-type", contentType => {
      vm.websocket.WebsocketContentType = contentType;  
    });
    EventBus.$on("change-websocket-msgid", msgid => {
      vm.websocket.WebsocketMessageId = msgid;    
    });
  },
  methods: {
    initUploadData() {
      const upload = EventBus.$options.upload || defaultUpload;

      /* const $props = this.getSelfProps();
      $props.forEach(prop => {
        const dataName = this.getDataNameOfProp(prop);
        this[dataName] = this[prop] || upload[prop];
      }); */

      Object.keys(upload).forEach(key => {
        this[key] = upload[key];
      });
    },

    registerPropListener() {
      const upload = EventBus.$options.upload || defaultUpload;
      const vm = this;
      const $props = this.getSelfProps();
      $props.forEach(prop => {
        this.$watch(prop, function(next) {
          const dataName = this.getDataNameOfProp(prop);
          vm[dataName] = next;
        });
      });
    },

    getSelfProps() {
      return Object.keys(this.$props);
    },

    getDataNameOfProp(prop) {
      switch (prop) {
        default:
          return `${prop}Data`;
      }
    }
  }
};
