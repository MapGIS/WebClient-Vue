// import * as turf from "@turf/turf";
import Base64IconsKeyValue from "./Base64IconsKeyValue";
import editList from "../Graphic/editList";
import GraphicLayerService from "../Graphic/GraphicLayerService";
// import {saveAs} from "file-saver";

export default {
  inject: ["viewer", "Cesium"],
  mixins: [Base64IconsKeyValue, GraphicLayerService],
  props: {
    dataSource: {
      type: Array
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    enablePreview: {
      type: Boolean,
      default: true
    },
    enableClose: {
      type: Boolean,
      default: true
    },
    vueKey: {
      type: String,
      default: "default"
    },
    vueIndex: {
      type: Number,
      default() {
        return Number((Math.random() * 100000000).toFixed(0));
      }
    },
    enableImport: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    dataSource: {
      handler: function() {
        this.$_init();
      },
      deep: true
    }
  },
  data() {
    return {
      projectSet: {},
      optArr: [],
      projectMaps: [],
      popups: [],
      dataSourceCopy: [],
      currentFeatureType: undefined,
      currentFeature: undefined,
      startDraw: false,
      editList: editList,
      //导入文件按钮id
      inputId: "mapgisMapStoryImport" + parseInt(String(Math.random() * 10000))
    };
  },
  methods: {
    //初始化函数
    $_init() {
      this.dataSourceCopy = JSON.parse(JSON.stringify(this.dataSource));
    },
    //自动视点跳转
    $_autoFlyto(chapters, dataSource, index, callBack) {
      let vm = this;
      if (index < chapters.length) {
        setTimeout(function() {
          if (callBack) {
            callBack(index);
          }
          vm.$_flyTo(
            chapters[index].camera,
            chapters[index].animationTime,
            function(vm) {
              //隐藏上一个章节的所有标绘对象
              if (index > 0) {
                vm.$_toggleGraphicsByChapter(chapters[index - 1]);
              }
              //显示本章节的所有标绘对象
              vm.$_toggleGraphicsByChapter(chapters[index]);
            }
          );
          vm.$_autoFlyto(chapters, dataSource, index + 1, callBack);
        }, Number(chapters[index].animationTime));
      }
    },
    //播放函数
    $_play(chapters, dataSource, callBack) {
      //先飞到第一个章节
      let vm = this;
      this.$_flyTo(chapters[0].camera, chapters[0].animationTime, function() {
        //显示第一个章节的所有标绘
        vm.$_toggleGraphicsByChapter(chapters[0]);
        //之后开始自动播放
        vm.$_autoFlyto(chapters, dataSource, 1, callBack);
      });
    },
    $_getDataSource() {
      let newDataSource = [];
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        //取得基本信息
        let ds = {
          chapters: [],
          description: this.dataSourceCopy[i].description,
          map: {},
          title: this.dataSourceCopy[i].title,
          uuid: this.dataSourceCopy[i].uuid
        };
        //取得章节信息
        let chapters = this.dataSourceCopy[i].chapters;
        for (let j = 0; j < chapters.length; j++) {
          let camera = this.$_cloneCamera(chapters[j].camera);
          //取得一章节里面的所有要素信息
          let features = this.$_cloneFeatures(chapters[j].features);
          ds.chapters.push({
            camera: camera,
            features: features,
            title: chapters[j].title,
            uuid: chapters[j].uuid
          });
        }
        //push数据
        newDataSource.push(ds);
      }
      return newDataSource;
    },
    //导出
    $_export(project) {
      // const blob = new Blob([JSON.stringify(this.$_getProject(project))], {
      //   type: "application/json;charset=utf-8"
      // });
      // saveAs(blob, project.title + ".json");
    },
    //保存
    $_save() {
      this.$emit("save", this.dataSourceCopy);
    },
    //导入
    $_import() {
      let inputFile = document.getElementById(this.inputId),
        vm = this;
      inputFile.click();
      inputFile.onchange = function() {
        let File = inputFile.files[0];
        // 使用 FileReader 来读取文件
        let reader = new FileReader();
        // 读取纯文本文件,且编码格式为 utf-8
        reader.readAsText(File, "UTF-8");
        // 读取文件
        reader.onload = function(e) {
          let fileContent = JSON.parse(e.target.result);
          let hasProject = false;
          for (let i = 0; i < vm.dataSourceCopy.length; i++) {
            if (vm.dataSourceCopy[i].uuid === fileContent.uuid) {
              vm.$set(vm.dataSourceCopy, i, fileContent);
              hasProject = true;
              break;
            }
          }
          if (!hasProject) {
            vm.dataSourceCopy.push(fileContent);
          }
        };
      };
    },
    //设置视角
    $_setCamera(currentChapter, camera) {
      if (camera) {
        currentChapter.camera = camera;
      } else {
        currentChapter.camera = this.$_getCamera(currentChapter.uuid);
        currentChapter.camera.title = currentChapter.title;
      }
      this.$_setChapter(currentChapter);
    },
    //取得视角
    $_getCamera(uuid) {
      let camera = this.viewer.camera;
      uuid = uuid || parseInt(String(Math.random() * 1000000000));
      return {
        uuid: uuid,
        positionCartographic: {
          height: camera.positionCartographic.height,
          latitude: camera.positionCartographic.latitude,
          longitude: camera.positionCartographic.longitude
        },
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll
      };
    },
    //添加标绘对象，并隐藏
    $_addGraphicByStory(story, callBack) {
      const { uuid, chapters } = story;
      //总的标绘对象数量
      let graphicLength = 0,
        vm = this;
      for (let j = 0; j < chapters.length; j++) {
        const { features } = chapters[j];
        graphicLength += features.length;
        for (let k = 0; k < features.length; k++) {
          let graphic = this.$_getGraphicByID(features[k].id, uuid, uuid);
          if (graphic) {
            graphic.show = false;
          } else {
            //取得标绘图层
            let graphicLayer = this.$_getGraphicLayer(uuid, uuid);
            //不存在则新建
            if (!graphicLayer) {
              this.$_newGraphicLayer({
                vueIndex: uuid,
                vueKey: uuid,
                getGraphic: function(e) {
                  e.show = false;
                }
              });
              //设置由预览生成的图层标识
              graphicLayer = this.$_getGraphicLayer(uuid, uuid);
              graphicLayer.initByPreview = true;
            }
            //导入标绘对象
            this.$_fromJson(
              {
                features: [features[k]],
                type: "FeatureCollection"
              },
              uuid,
              uuid
            );
          }
        }
      }

      //轮询，确保所有对象加载完毕
      function isLoaded(chapters, graphicLength, vm) {
        //已加载的标绘对象数量
        let loadedGraphicLength = 0;
        for (let j = 0; j < chapters.length; j++) {
          const { features } = chapters[j];
          for (let k = 0; k < features.length; k++) {
            let graphic = vm.$_getGraphicByID(features[k].id, uuid, uuid);
            if (graphic) {
              loadedGraphicLength++;
            }
          }
        }
        return loadedGraphicLength === graphicLength;
      }

      let interval = setInterval(function() {
        let loaded = isLoaded(chapters, graphicLength, vm);
        if (loaded) {
          //全部加载完毕后执行下一步操作
          clearInterval(interval);
          callBack();
        }
      });
    },
    //显示或隐藏标绘对象
    $_toggleGraphicsByChapter(chapter) {
      let { features, projectUUID } = chapter;
      for (let i = 0; i < features.length; i++) {
        let graphic = this.$_getGraphicByID(
          features[i].id,
          projectUUID,
          projectUUID
        );
        graphic.show = !graphic.show;
      }
    },
    //闪烁标绘对象
    $_flashGraphicByChapter(chapter) {
      let { features, projectUUID } = chapter;
      for (let i = 0; i < features.length; i++) {
        let graphic = this.$_getGraphicByID(
          features[i].id,
          projectUUID,
          projectUUID
        );
        if (graphic.attributes.hasOwnProperty("__enableFlash")) {
          let e = graphic;
          let flashStyle = e.attributes.__flashStyle;
          window["flog_" + e.id] = flashStyle.flog;
          window["alpha_" + e.id] = flashStyle.flashAlpha;
          window["alphaEnd_" + e.id] = flashStyle.flashAlpha;
          window["alphaSpace_" + e.id] = flashStyle.alphaSpace;
          window["flashTime_" + e.id] = flashStyle.flashTime;
          window["flashRunningTime_" + e.id] = 0;
          window["interval_" + e.id] = setInterval(function() {
            if (window["flog_" + e.id]) {
              window["alpha_" + e.id] =
                window["alpha_" + e.id] - window["alphaSpace_" + e.id];
              if (window["alpha_" + e.id] <= 0) {
                window["alpha_" + e.id] = 0;
                window["flog_" + e.id] = false;
              }
            } else {
              window["alpha_" + e.id] =
                window["alpha_" + e.id] + window["alphaSpace_" + e.id];
              if (window["alpha_" + e.id] >= window["alphaEnd_" + e.id]) {
                window["flog_" + e.id] = true;
              }
            }
            e.style.color.alpha = window["alpha_" + e.id].toFixed(2);
            window["flashRunningTime_" + e.id] += 100;
            if (
              window["flashRunningTime_" + e.id] > window["flashTime_" + e.id]
            ) {
              clearInterval(window["interval_" + e.id]);
              e.show = false;
              delete window["flog_" + e.id];
              delete window["alpha_" + e.id];
              delete window["alphaEnd_" + e.id];
              delete window["alphaSpace_" + e.id];
              delete window["flashTime_" + e.id];
              delete window["flashRunningTime_" + e.id];
            }
          }, 100);
        }
      }
    },
    //视点跳转
    $_flyTo(camera, time, easingFunction) {
      const { positionCartographic, heading, pitch, roll } = camera;
      const { longitude, latitude, height } = positionCartographic;
      easingFunction = easingFunction || function() {};
      if (
        !positionCartographic ||
        isNaN(heading) ||
        isNaN(pitch) ||
        isNaN(roll)
      ) {
        return;
      }
      this.viewer.camera.flyTo({
        easingFunction: easingFunction(this),
        duration: time / 1000,
        destination: new Cesium.Cartesian3.fromRadians(
          longitude,
          latitude,
          height
        ),
        orientation: {
          heading: heading,
          pitch: pitch,
          roll: roll
        }
      });
    },
    //设置Chapter的值
    $_setChapter(chapter) {
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        let story = this.dataSourceCopy[i];
        if (story.uuid === chapter.projectUUID) {
          let chapters = story.chapters;
          for (let j = 0; j < chapters.length; j++) {
            if (chapter.uuid === chapters[j].uuid) {
              this.$set(this.dataSourceCopy[i].chapters, j, chapter);
              break;
            }
          }
          break;
        }
      }
    }
  }
};
