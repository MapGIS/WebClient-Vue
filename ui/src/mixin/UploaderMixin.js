import EventBus, {
  defaultUpload,
  defaultGis,
  defaultComplete,
  defaultWebsocket
} from "../util/vue-types/event-bus-uploader";

export default {
  name: "Uploader",
  props: {},
  data() {
    return {
      // 原始云盘的uploader模块
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
      webSocketTaskId: '',
      // 原始云盘的complete模块
      uploadCount: 0,
      uploads: [],
      // 原始云盘的gis模块
      giscurrents: [],
      giscount: [],
      // 原始云盘的websocket模块
      WebsocketAction: "",
      WebsocketContent: {},
      WebsocketMessageId: "", // 区分消息
      // 原始云盘的path模块
      uploaduri: ""
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
      vm.fileName = filename;
    });
    EventBus.$on("change-ui-state", uistatus => {
      vm.uistatus = uistatus;
    });
    EventBus.$on("change-upload-progress", progress => {
      vm.progress = progress;
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
    EventBus.$on("change-upload-taskid", taskid => {
      vm.webSocketTaskId = taskid;
    });
    EventBus.$on("add-gis-current", giscurrents => {
      vm.giscurrents = giscurrents;
    });
    EventBus.$on("change-websocket-action", action => {
      vm.WebsocketAction = action;
    });
    EventBus.$on("change-websocket-content", content => {
      vm.WebsocketContent = content;
    });
    EventBus.$on("change-websocket-msgid", msgid => {
      vm.WebsocketMessageId = msgid;
    });
    EventBus.$on("change-path-uploaduri", uri => {
      // vm.path.uri = uri;
      // vm.path.uploaduri = uri;
      vm.uploaduri = uri;
      console.warn("on change", uri);
    });
  },
  methods: {
    initUploadData() {
      const upload = EventBus.$options.upload || defaultUpload;
      const gis = EventBus.$options.gis || defaultGis;
      const complete = EventBus.$options.complete || defaultComplete;
      const websocket = EventBus.$options.websocket || defaultWebsocket;
      const path = EventBus.$options.path || defaultPath;

      /* const $props = this.getSelfProps();
      $props.forEach(prop => {
        const dataName = this.getDataNameOfProp(prop);
        this[dataName] = this[prop] || upload[prop];
      }); */

      Object.keys(upload).forEach(key => {
        this[key] = upload[key];
      });
      Object.keys(gis).forEach(key => {
        this[key] = gis[key];
      });
      Object.keys(complete).forEach(key => {
        this[key] = complete[key];
      });
      Object.keys(websocket).forEach(key => {
        this[key] = websocket[key];
      });
      Object.keys(path).forEach(key => {
        this[key] = path[key];
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
