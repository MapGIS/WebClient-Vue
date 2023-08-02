export default {
  data() {
    return {
      globalLoad: false
    };
  },
  methods: {
    /**
     * @description 发送更新事件  this.$emit(`update:${prop}`, data);
     * @see https://cn.vuejs.org/v2/guide/components-custom-events.html#sync-修饰符
     * @param {*} prop 更新属性
     * @param {*} data 更新数据
     */
    $_updateSyncedPropsFabric(prop, data) {
      return () => {
        this.propsIsUpdating[prop] = true;
        let info = typeof data === "function" ? data() : data;
        return this.$emit(`update:${prop}`, info);
      };
    },

    /**
     * @description 绑定地图的各种事件，并在事件回调更新各种事件消息对应的事件属性。
     * 前提是 该属性this.$listeners[`update:${prop}`] 存在
     */
    $_bindPropsUpdateEvents() {
      const syncedProps = [
        {
          events: ["moveend"],
          prop: "center",
          getter: this.map.getCenter.bind(this.map)
        },
        {
          events: ["zoomend"],
          prop: "zoom",
          getter: this.map.getZoom.bind(this.map)
        },
        {
          events: ["rotate"],
          prop: "bearing",
          getter: this.map.getBearing.bind(this.map)
        },
        {
          events: ["pitch"],
          prop: "pitch",
          getter: this.map.getPitch.bind(this.map)
        }
        // TODO: make 'bounds' synced prop
        // { events: ['moveend', 'zoomend', 'rotate', 'pitch'], prop: 'bounds', getter: this.map.getBounds.bind(this.map) }
      ];
      syncedProps.forEach(({ events, prop, getter }) => {
        events.forEach(event => {
          if (this.$listeners[`update:${prop}`]) {
            this.map.on(event, this.$_updateSyncedPropsFabric(prop, getter));
          }
        });
      });
    },

    $_loadScript() {
      let self = this;
      if (!global.Cesium /*  && !self.globalLoad */) {
        const $scriptMain = document.createElement("script");
        const $scriptPlugin = document.createElement("script");
        if (window.__POWERED_BY_QIANKUN__) {
          global.document.documentElement.appendChild($scriptMain);
          global.document.documentElement.appendChild($scriptPlugin);
        } else {
          global.document.body.appendChild($scriptMain);
          global.document.body.appendChild($scriptPlugin);
        }

        $scriptMain.src =
          this.libPath ||
          window.VueCesiumLibPath ||
          "http://develop.smaryun.com/static/libs/cdn/cesium/Cesium.js";

        return new Promise(resolve => {
          $scriptMain.onload = () => {
            if (global.Cesium) {
              $scriptPlugin.src =
                self.pluginPath ||
                window.VueCesiumPluginPath ||
                "http://develop.smaryun.com/static/libs/cdn/zondyclient/webclient-cesium-plugin.min.js";
              $scriptPlugin.onload = () => {
                if (global.Cesium) {
                  self.globalLoad = true;
                  resolve(global.Cesium);
                } else {
                  reject(
                    new Error(
                      `[网络请求异步加载错误]: ` +
                        "请检查pluginPath或者网络状态!"
                    )
                  );
                }
              };
            } else {
              reject(
                new Error(
                  `[网络请求异步加载错误]: ` + "请检查libPath或者网络状态!"
                )
              );
            }
          };
        });
      } else {
        return new Promise(resolve => {
          resolve(global.Cesium);
        });
      }
    },

    /**
     * @description 在mounted组件里面调用该方法里面的Promise，主要是绑定map以及绑定各种属性以及行为
     */
    $_loadMap() {
      return this.cesiumPromise.then(cesium => {
        this.cesium = cesium.default ? cesium.default : cesium;
        return new Promise(resolve => {
          if (this.accessToken) this.mapbox.accessToken = this.accessToken;
          const webGlobe = new Cesium.WebSceneControl(this.$refs.container, {
            ...this._props,
            style: this.mapStyle
          });
          resolve(webGlobe);
        });
      });
    },

    /**
     * @description 本质上是把mapbox的map的事件通过vue的emit方式封装发送
     * @param {*} events
     */
    $_bindMapEvents(events) {
      Object.keys(this.$listeners).forEach(eventName => {
        if (events.includes(eventName)) {
          this.map.on(eventName, this.$_emitMapEvent);
        }
      });
    },

    $_unbindEvents(events) {
      events.forEach(eventName => {
        this.map.off(eventName, this.$_emitMapEvent);
      });
    }
  }
};
