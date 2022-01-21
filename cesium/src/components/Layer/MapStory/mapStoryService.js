import * as turf from "@turf/turf";
import Base64IconsKeyValue from "./Base64IconsKeyValue";
import editList from "../Graphic/editList";
import { saveAs } from "file-saver";

export default {
  inject: ["viewer", "Cesium"],
  mixins: [Base64IconsKeyValue],
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
    $_init() {
      this.dataSourceCopy = JSON.parse(JSON.stringify(this.dataSource));
    },
    $_autoFlyto(features, dataSource, index, callBack) {
      let vm = this;
      if (index < features.length) {
        setTimeout(function() {
          if (callBack) {
            callBack(index);
          }
          vm.$_flyTo(
            features[index].camera,
            features[index].animationTime,
            function(vm) {
              vm.$_toggleChapterFeatures(
                features[index].uuid,
                features[index].projectUUID,
                dataSource
              );
            }
          );
          vm.$_autoFlyto(features, dataSource, index + 1, callBack);
        }, Number(features[index].animationTime));
      }
    },
    $_play(chapters, dataSource, callBack) {
      //先隐藏所有标绘
      for (let i = 0; i < chapters.length; i++) {
        let graphics = chapters[i].features;
        for (let j = 0; j < graphics.length; j++) {
          let graphic = this.$_getGraphicByID(
            graphics[j].id,
            chapters[i].projectUUID,
            chapters[i].projectUUID
          );
          if (graphic) {
            graphic.show = false;
          }
        }
      }
      //先飞到第一个章节
      let vm = this;
      this.$_flyTo(chapters[0].camera, chapters[0].animationTime, function() {
        //显示第一个章节的所有标绘
        vm.$_toggleChapterFeatures(
          chapters[0].uuid,
          chapters[0].projectUUID,
          dataSource
        );
        //之后开始自动播放
        vm.$_autoFlyto(chapters, dataSource, 1, callBack);
      });
    },
    $_cloneFeatures(features, featureUUID, newUUID) {
      let newfeatures = [];
      for (let k = 0; k < features.length; k++) {
        let coordinates = [];
        switch (features[k].feature.geometry.type) {
          case "point":
            let c = features[k].feature.geometry.coordinates;
            coordinates = [c[0], c[1], c[2]];
            break;
          case "LineString":
            let l = features[k].feature.geometry.coordinates;
            coordinates = [];
            for (let i = 0; i < l.length; i++) {
              coordinates.push([l[i][0], l[i][1], l[i][2]]);
            }
            break;
          case "Polygon":
            let p = features[k].feature.geometry.coordinates[0];
            coordinates = [[]];
            for (let i = 0; i < p.length; i++) {
              coordinates[0].push([p[i][0], p[i][1], p[i][2]]);
            }
            break;
        }
        let properties = {};
        Object.keys(features[k].feature.properties).forEach(function(key) {
          properties[key] = features[k].feature.properties[key];
        });
        let fUUID = featureUUID || features[k].featureUUID;
        if (newUUID) {
        }
        newfeatures.push({
          feature: {
            geometry: {
              type: features[k].feature.geometry.type,
              coordinates: coordinates
            },
            properties: properties,
            type: features[k].feature.type
          },
          featureUUID: fUUID,
          projectUUID: features[k].projectUUID,
          type: features[k].type,
          uuid: features[k].uuid
        });
      }
      return newfeatures;
    },
    $_cloneCamera(originCamera) {
      let camera = {};
      //camera不存在
      if (!originCamera || !(originCamera instanceof Object)) {
        camera = {
          uuid: originCamera.uuid,
          heading: 0,
          pitch: 0,
          roll: 0,
          positionCartographic: {
            height: 0,
            latitude: 0,
            longitude: 0
          }
        };
      } else {
        //camera存在，但positionCartographic不存在
        if (
          !originCamera.positionCartographic ||
          !(originCamera.positionCartographic instanceof Object)
        ) {
          camera = {
            uuid: originCamera.uuid,
            heading: originCamera.heading || 0,
            pitch: originCamera.pitch || 0,
            roll: originCamera.roll || 0,
            positionCartographic: {
              height: 0,
              latitude: 0,
              longitude: 0
            }
          };
        } else {
          //camera存在
          camera = {
            uuid: originCamera.uuid,
            heading: originCamera.heading,
            pitch: originCamera.pitch,
            roll: originCamera.roll,
            positionCartographic: {
              height: originCamera.positionCartographic.height,
              latitude: originCamera.positionCartographic.latitude,
              longitude: originCamera.positionCartographic.longitude
            }
          };
        }
      }
      return camera;
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
    //获取要素模板
    $_getFeature(feature) {
      //是否填充文字
      feature.enableFillText = false;
      //填充文字参数
      feature.fillTextOptions = {};
      //默认不启用弹框
      feature.enablePupup = false;
      //弹框参数
      feature.popupOptions = {
        type: "text", //弹窗类型，text、card（图片）、table
        optionType: "click", //如何开启弹窗，click（鼠标点击）、hover（鼠标移入）、force（强制开启）
        title: "", //标题
        content: "", //类型为text时的文本
        images: [], //类型为图片时的url数组
        keyValue: {} //类型为表格时的数据
      };
      return feature;
    },
    $_textToCanvas(text) {
      let canvas = document.createElement("canvas");
      canvas.height = 200;
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#f00";
      context.fillRect(0, 0, 200, 200);
      context.fillStyle = "#fff";
      context.font = 30 + "px Arial";
      context.textBaseline = "middle";
      context.fillText(text, 0, 100);
      return canvas.toDataURL();
    },
    $_getProject(project) {
      let newProject = {
        chapters: [],
        description: project.description,
        map: {},
        title: project.title,
        uuid: project.uuid
      };
      let map = project.map;
      if (map) {
        newProject.map = {
          baseUrl: map.baseUrl,
          format: map.format,
          layer: map.layer,
          tileMatrixSet: map.tileMatrixSet,
          tilingScheme: map.tilingScheme,
          type: map.type,
          vueIndex: map.vueIndex,
          vueKey: map.vueKey
        };
      }
      let chapters = project.chapters;
      if (chapters) {
        for (let i = 0; i < chapters.length; i++) {
          let camera = chapters[i].camera;
          let chapter = {
            animationTime: Number(chapters[i].animationTime),
            camera: {
              heading: camera.heading,
              pitch: camera.pitch,
              roll: camera.roll,
              uuid: camera.uuid,
              positionCartographic: {
                height: camera.positionCartographic.height,
                latitude: camera.positionCartographic.latitude,
                longitude: camera.positionCartographic.longitude
              }
            },
            content: chapters[i].content,
            features: [],
            images: [],
            layerStyle: {},
            map: {},
            projectUUID: chapters[i].projectUUID,
            title: chapters[i].title,
            uuid: chapters[i].uuid
          };
          let images = chapters[i].images;
          if (images) {
            for (let i = 0; i < images.length; i++) {
              chapter.images.push(images[i]);
            }
          }
          let features = chapters[i].features;
          for (let i = 0; i < features.length; i++) {
            let feature = this.$_toJSONById(features[i].id);
            feature.title = features[i].title;
            chapter.features.push(feature);
          }
          newProject.chapters.push(chapter);
        }
      }
      return newProject;
    },
    $_export(project) {
      const blob = new Blob([JSON.stringify(this.$_getProject(project))], {
        type: "application/json;charset=utf-8"
      });
      saveAs(blob, project.title + ".json");
    },
    $_save() {
      this.$emit("save", this.dataSourceCopy);
    },
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
    $_firstAddPicture(feature) {
      let lnglatPosition;
      if (feature.center) {
        lnglatPosition = {
          lng: feature.center[0],
          lat: feature.center[1],
          alt: feature.center[2]
        };
      } else {
        lnglatPosition = this.$_cartesian3ToLongLat(feature.baseUrl.geometry);
      }
      this.popups.push({
        lng: lnglatPosition.lng,
        lat: lnglatPosition.lat,
        alt: 20,
        title: feature.title,
        images: feature.images,
        feature: feature,
        id: feature.id,
        show: feature.show,
        vueIndex: parseInt(String(Math.random() * 10000))
      });
    },
    $_editProject(index) {
      let map = this.dataSourceCopy[index].map;
      let addMap = true,
        mapIndex;
      for (let i = 0; i < this.projectMaps.length; i++) {
        if (map.vueIndex === this.projectMaps[i].vueIndex) {
          addMap = false;
          mapIndex = i;
          break;
        }
      }
      if (addMap) {
        this.projectMaps.push(map);
      } else {
        this.$set(this.projectMaps, index, map);
      }
    },
    $_closeHoverPanel() {
      let vm = this;
      switch (this.currentFeatureType) {
        case "point":
          this.$_getBillBoardIcon(0, function(img) {
            vm.viewer.entities.add({
              id: window.feature.id,
              position: window.feature.camera.cartesian3Position,
              billboard: {
                image: img,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
              }
            });
          });
          window.feature.drawType = "point";
          break;
        case "polyline":
          this.currentPoints.push(this.currentPoints[0]);
          window.feature.camera.longLatPosition = this.$_getPolygonCenter(
            this.currentPoints
          );
          window.feature.drawType = "polyline";
          break;
        case "polygon":
          window.feature.camera.longLatPosition = this.$_getPolygonCenter(
            this.currentPoints
          );
          window.feature.drawType = "polygon";
          break;
        case "rectangle":
          window.feature.camera.longLatPosition = this.$_getRectangleCenter(
            this.currentPoints
          );
          window.feature.drawType = "rectangle";
          break;
      }
      this.$refs.projectPanel.$refs.projectP.$_addFeatureSet(window.feature);
      this.$refs.projectPanel.$refs.projectP.showEditPanel = false;
    },
    $_titleChanged(title) {
      if (window.feature) {
        window.feature.title = title;
      }
    },
    $_featureTitleChanged(feature) {
      for (let i = 0; i < this.popups.length; i++) {
        if (this.popups[i].id === feature.id) {
          this.$set(this.popups[i], "title", feature.title);
          break;
        }
      }
    },
    $_changeOpacity(opacity, color, id, geometryType) {
      let entity = this.viewer.entities.getById(id);
      opacity = Number(opacity);
      switch (geometryType) {
        case "polygon":
          if (entity.polygon) {
            entity[geometryType].material = Cesium.Color.fromAlpha(
              Cesium.Color.fromCssColorString(color),
              opacity
            );
          } else if (entity.rectangle) {
            entity.rectangle.material = new Cesium.Color.fromAlpha(
              Cesium.Color.fromCssColorString(color),
              opacity
            );
          }
          break;
        case "polyline":
          entity[geometryType].material = new Cesium.Color.fromAlpha(
            Cesium.Color.fromCssColorString(color),
            opacity
          );
          break;
      }
    },
    $_changeColor(color, type, id, geometryType) {
      let entity = this.viewer.entities.getById(id);
      switch (geometryType) {
        case "polygon":
          if (entity.polygon) {
            entity[geometryType].material = new Cesium.Color.fromCssColorString(
              color.hex
            );
          } else if (entity.rectangle) {
            entity.rectangle.material = new Cesium.Color.fromCssColorString(
              color.hex
            );
          }
          break;
        case "polyline":
          entity[geometryType].material = new Cesium.Color.fromCssColorString(
            color.hex
          );
          break;
      }
    },
    $_getLayer(index, project, callBack, feature) {
      let map;
      if (feature) {
        map = feature.map;
      } else {
        map = project.features[index].map;
      }

      if (map) {
        const { vueKey, vueIndex } = map;
        if (vueKey && vueIndex) {
          let layerManager = window.vueCesium.OGCWMTSManager.findSource(
            vueKey,
            vueIndex
          );
          callBack(layerManager.source);
        }
      }
    },
    $_deleteFeature(index, projectUUID) {
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === projectUUID) {
          this.dataSourceCopy[i].chapters.splice(index, 1);
        }
      }
    },
    $_selectCamera(camera, currentFeature) {
      currentFeature.camera = this.$_cloneCamera(camera);
    },
    $_getCamera(currentFeature) {
      let camera = this.viewer.camera;
      let uuid = currentFeature.camera.uuid;
      currentFeature.camera = {
        uuid: uuid
      };
      currentFeature.camera.positionCartographic = {
        height: camera.positionCartographic.height,
        latitude: camera.positionCartographic.latitude,
        longitude: camera.positionCartographic.longitude
      };
      currentFeature.camera.heading = camera.heading;
      currentFeature.camera.pitch = camera.pitch;
      currentFeature.camera.roll = camera.roll;
    },
    $_changeIcon(icon, id) {
      let entity = this.viewer.entities.getById(id);
      this.$_getBillBoardIcon(icon, function(img) {
        entity.billboard.image = img;
      });
    },
    $_getFeatureFromFeatures(uuid, features) {
      let feature;
      for (let i = 0; i < features.length; i++) {
        if (uuid === features[i].uuid) {
          feature = features[i];
          break;
        }
      }
      return feature;
    },
    //取得GraphicsLayer对象，没有则新建
    $_getGraphicsLayer() {
      let graphicsLayerManager = window.vueCesium.GraphicsLayerManager.findSource(
        this.vueKey,
        this.vueIndex
      );
      let graphicsLayer;
      if (!graphicsLayerManager) {
        graphicsLayer = new Cesium.GraphicsLayer(this.viewer, {});
        this.viewer.scene.layers.appendGraphicsLayer(graphicsLayer);
        window.vueCesium.GraphicsLayerManager.addSource(
          this.vueKey,
          this.vueIndex,
          graphicsLayer
        );
      } else {
        graphicsLayer = graphicsLayerManager.source;
      }
      return graphicsLayer;
    },
    $_showFeature(id, flag, index, project) {
      if (id) {
        let entity = this.viewer.entities.getById(id);
        entity.show = flag;
      }
      this.$_getLayer(index, project, function(layer) {
        layer.show = flag;
      });
    },
    $_addMapToProject(type, map) {
      map.vueKey = this.vueKey;
      map.vueIndex = new Date().getTime();
      let index,
        addMap = true;
      for (let i = 0; i < this.projectMaps.length; i++) {
        if (
          this.projectMaps[i].vueKey === map.vueKey &&
          this.projectMaps[i].vueIndex === map.vueIndex
        ) {
          index = i;
          addMap = false;
          break;
        }
      }
      if (addMap) {
        this.projectMaps.push(map);
      } else {
        this.$emit(this.projectMaps, index, map);
      }
    },
    $_changeEntityTitle(currentEntity) {
      let entity = this.viewer.entities.getById(currentEntity.uuid);
      entity.label.text = currentEntity.title;
    },
    $_changeEntity(type, currentEditType, value) {
      // let graphicsLayer = window.vueCesium.GraphicsLayerManager.findSource(this.vueKey, this.vueIndex).source;
      // let entity = graphicsLayer.getPlottingPrimtiveByID(uuid);
      let position;
      switch (type) {
        case "fontColor":
          entity.fillColor = Cesium.Color.fromCssColorString(value);
          break;
        case "fontOpacity":
          entity.fillColor = Cesium.Color.fromAlpha(
            Cesium.Color.fromCssColorString(value.color),
            value.opacity
          );
          break;
        case "changeEntityTitle":
          entity.text = value;
          break;
        case "changeEntityHeight":
          position = this.$_cartesian3ToLongLat(entity.position);
          position.alt = value;
          entity.position = Cesium.Cartesian3.fromDegrees(
            position.lng,
            position.lat,
            position.alt
          );
          break;
        case "changeEntityLng":
          position = this.$_cartesian3ToLongLat(entity.position);
          position.lng = value;
          entity.position = Cesium.Cartesian3.fromDegrees(
            position.lng,
            position.lat,
            position.alt
          );
          break;
        case "changeEntityLat":
          position = this.$_cartesian3ToLongLat(entity.position);
          position.lat = value;
          entity.position = Cesium.Cartesian3.fromDegrees(
            position.lng,
            position.lat,
            position.alt
          );
          break;
        case "polylineOpacity":
        case "polylineColor":
          entity.polyline.material = Cesium.Color.fromAlpha(
            Cesium.Color.fromCssColorString(value.color),
            value.opacity
          );
          break;
        case "polylineWidth":
          entity.polyline.width = value;
          break;
        case "polygonOpacity":
        case "polygonColor":
          entity.polygon.material = Cesium.Color.fromAlpha(
            Cesium.Color.fromCssColorString(value.color),
            value.opacity
          );
          break;
        case "rectangleColor":
        case "rectangleOpacity":
          entity.rectangle.material = Cesium.Color.fromAlpha(
            Cesium.Color.fromCssColorString(value.color),
            value.opacity
          );
          break;
        case "changeEntityIcon":
          this.$_changeIcon(value, uuid);
          break;
        case "forcePopup":
          let hasPopup = this.$_hasPopup(uuid.uuid);
          let degree = {
            lng: uuid.center[0],
            lat: uuid.center[1],
            alt: uuid.center[2]
          };
          this.$_pushPopup(hasPopup, degree, uuid);
          break;
        case "enablePopup":
          let feature = this.$_getFeatureByUUID(uuid.projectUUID, uuid.uuid);
          feature.enablePupup = value;
          break;
        case "deleteEntity":
          graphicsLayer.removePlottingPrimiveByID(uuid);
          let project;
          for (let i = 0; i < this.dataSourceCopy.length; i++) {
            if (this.dataSourceCopy[i].uuid === value.projectUUID) {
              project = this.dataSourceCopy[i];
              break;
            }
          }
          let chapters = project.chapters;
          for (let i = 0; i < chapters.length; i++) {
            let features = chapters[i].features;
            for (let j = 0; j < features.length; i++) {
              if (features[j].uuid === uuid) {
                features.splice(j, 1);
                break;
              }
            }
          }
          break;
        case "changeEntity":
          //更新样式
          let options = this.$_getDrawOptions(value, currentEditType, Cesium);
          this.$_updateStyleByStyle(value.id, options.style);
          break;
      }
    },
    $_copyChapter(uuid) {
      let newUUID = "chapter_" + parseInt(String(Math.random() * 100000000));
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === uuid) {
          let length = this.dataSourceCopy[i].chapters.length;
          let chapter = this.dataSourceCopy[i].chapters[length - 1];
          let camera = this.$_cloneCamera(chapter.camera);
          let features = this.$_cloneFeatures(chapter.features);
          let newChapter = {
            title: chapter.title,
            uuid: newUUID,
            projectUUID: chapter.projectUUID,
            camera: camera,
            features: features
          };
          this.dataSourceCopy[i].chapters.push(newChapter);
          break;
        }
      }
    },
    $_toggleChapterFeatures(chapterUUID, projectUUID, dataSource) {
      dataSource = dataSource || this.dataSourceCopy;
      for (let i = 0; i < dataSource.length; i++) {
        if (dataSource[i].uuid === projectUUID) {
          let chapters = dataSource[i].chapters;
          //先隐藏除当前编辑的章节外的所有章节的标绘对象
          for (let j = 0; j < chapters.length; j++) {
            if (chapters[j].uuid !== chapterUUID) {
              let features = chapters[j].features;
              for (let k = 0; k < features.length; k++) {
                let graphic = this.$_getGraphic(features[k]);
                graphic.show = false;
              }
            }
          }
          //在显示当前编辑的章节的标绘对象
          for (let j = 0; j < chapters.length; j++) {
            if (chapters[j].uuid === chapterUUID) {
              let features = chapters[j].features;
              for (let k = 0; k < features.length; k++) {
                let graphic = this.$_getGraphicByID(
                  features[k].id,
                  chapters[j].projectUUID,
                  chapters[j].projectUUID
                );
                if (graphic) {
                  graphic.show = true;
                  if (graphic.attributes.__enableFlash) {
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
                          window["alpha_" + e.id] -
                          window["alphaSpace_" + e.id];
                        if (window["alpha_" + e.id] <= 0) {
                          window["alpha_" + e.id] = 0;
                          window["flog_" + e.id] = false;
                        }
                      } else {
                        window["alpha_" + e.id] =
                          window["alpha_" + e.id] +
                          window["alphaSpace_" + e.id];
                        if (
                          window["alpha_" + e.id] >= window["alphaEnd_" + e.id]
                        ) {
                          window["flog_" + e.id] = true;
                        }
                      }
                      e.style.color.alpha = window["alpha_" + e.id].toFixed(2);
                      window["flashRunningTime_" + e.id] += 100;
                      if (
                        window["flashRunningTime_" + e.id] >
                        window["flashTime_" + e.id]
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
              }
              break;
            }
          }
          break;
        }
      }
    },
    $_getGraphic(feature) {
      let graphic = this.$_toJSONById(feature.id);
      if (!graphic) {
        let GeoJSON = {
          type: "FeatureCollection",
          features: [feature]
        };
        this.$_fromJson(GeoJSON);
        graphic = this.$_getGraphicByID(feature.id);
      }
      return graphic;
    },
    $_addChapter(chapter) {
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === chapter.projectUUID) {
          let chapters = this.dataSourceCopy[i].chapters;
          if (chapters.length > 0) {
            //继承上一个章节的所有元素
            let newFeatures = [];
            let features = chapters[chapters.length - 1].features;
            for (let j = 0; j < features.length; j++) {
              // //取得center
              // let center = [];
              // if (features[j].center instanceof Array) {
              //   for (let k = 0; k < features[j].center.length; k++) {
              //     center.push(features[j].center[k]);
              //   }
              // }
              // //取得popupOptions
              // let popupOptions = {};
              // Object.keys(features[j].popupOptions).forEach(function (key) {
              //   popupOptions[key] = features[j].popupOptions[key];
              // });
              let graphic = this.$_getGraphic(features[j]);
              graphic.show = false;
              graphic.title = features[j].title;
              newFeatures.push(graphic);
            }
            chapter.features = newFeatures;
          }
          chapter.images = [];
          chapter.content = "";
          this.dataSourceCopy[i].chapters.push(chapter);
          break;
        }
      }
    },
    $_setFeature(feature, projectUUID, chapterUUID) {
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === projectUUID) {
          let chapters = this.dataSourceCopy[i].chapters;
          for (let j = 0; j < chapters.length; j++) {
            if (chapters[j].uuid === chapterUUID) {
              chapters[j].features.push(feature);
            }
          }
          break;
        }
      }
      // this.$emit("save", dataSourceCopy);
    },
    $_addFeature(feature, projectUUID, chapterUUID) {
      this.$_setFeature(feature, projectUUID, chapterUUID);
    },
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
    $_getBillBoardIcon(index, callBack) {
      let img = document.createElement("img");
      if (typeof index === "number") {
        img.src = Base64IconsKeyValue[index].value;
      } else if (typeof index === "string") {
        for (let i = 0; i < Base64IconsKeyValue.length; i++) {
          if (Base64IconsKeyValue[i].key === index) {
            img.src = Base64IconsKeyValue[i].value;
            break;
          }
        }
      }
      img.onload = function() {
        callBack(img);
      };
    },
    $_setCamera() {
      window.feature.camera.positionCartographic.height = this.viewer.camera.positionCartographic.height;
      window.feature.camera.positionCartographic.longitude = this.viewer.camera.positionCartographic.longitude;
      window.feature.camera.positionCartographic.latitude = this.viewer.camera.positionCartographic.latitude;
      window.feature.camera.heading = this.viewer.scene.camera.heading;
      window.feature.camera.pitch = this.viewer.scene.camera.pitch;
      window.feature.camera.roll = this.viewer.scene.camera.roll;
    },
    $_getPolygonCenter(points) {
      let pPoints = [];
      for (let i = 0; i < points.length; i++) {
        pPoints.push([points[i][0], points[i][1]]);
      }
      let center = this.$_getCenter([pPoints]);
      return [
        center.geometry.coordinates[0],
        center.geometry.coordinates[1],
        0
      ];
    },
    $_getRectangleCenter(points) {
      let pPoints = [
        [
          [points[0][0], points[0][1]],
          [points[0][0], points[1][1]],
          [points[1][0], points[1][1]],
          [points[1][0], points[0][1]],
          [points[0][0], points[0][1]]
        ]
      ];
      let center = this.$_getCenter(pPoints);
      let coordinates = center.geometry.coordinates;
      coordinates[2] = 0;
      return coordinates;
    },
    $_getCenter(points) {
      let polygon = turf.polygon(points);
      return turf.centerOfMass(polygon);
    },
    $_getContainerHeight() {
      return this.viewer.container.offsetHeight;
    },
    $_cartesian3ToLongLat(cartesian3) {
      let position = {};
      let graphicPosition = Cesium.Cartographic.fromCartesian(cartesian3);
      position.lat = Cesium.Math.toDegrees(graphicPosition.latitude);
      position.lng = Cesium.Math.toDegrees(graphicPosition.longitude);
      position.alt = graphicPosition.height;
      return position;
    },
    $_getFeatureByUUID(projectUUID, featureUUID) {
      let feature;
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (projectUUID === this.dataSourceCopy[i].uuid) {
          let features = this.dataSourceCopy[i].features;
          for (let j = 0; j < features.length; j++) {
            if (features[j].uuid === featureUUID) {
              feature = features[j];
              break;
            }
          }
          break;
        }
      }
      return feature;
    },
    $_hasPopup(uuid) {
      let hasPopup = false,
        index;
      for (let i = 0; i < this.popups.length; i++) {
        if (this.popups[i].id === uuid) {
          hasPopup = true;
          index = i;
          break;
        }
      }
      return {
        hasPopup: hasPopup,
        index: index
      };
    },
    $_pushPopup(hasPopup, degree, feature) {
      if (hasPopup.hasPopup) {
        this.$set(this.popups, hasPopup.index, {
          lng: degree.lng,
          lat: degree.lat,
          alt: 20,
          type: feature.popupOptions.type,
          show: true,
          content: feature.popupOptions.content,
          images: feature.popupOptions.images,
          title: feature.popupOptions.title,
          id: feature.uuid
        });
      } else {
        this.popups.push({
          lng: degree.lng,
          lat: degree.lat,
          alt: 20,
          type: feature.popupOptions.type,
          show: true,
          content: feature.popupOptions.content,
          images: feature.popupOptions.images,
          id: feature.uuid,
          title: feature.popupOptions.title,
          vueIndex: parseInt(String(Math.random() * 10000))
        });
      }
    },
    $_setPopup(position, type) {
      // let pickedFeature = this.viewer.scene.pick(position);
      // if (!pickedFeature) {
      //   return;
      // }
      // let ray = this.viewer.scene.camera.getPickRay(position);
      // let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
      // let degree = this.$_cartesian3ToLongLat(cartesian);
      // if (pickedFeature && !this.startDraw) {
      //   let hasPopup = this.$_hasPopup(pickedFeature.id);
      //   let feature = this.$_getFeatureByUUID(pickedFeature.primitive.projectUUID, pickedFeature.primitive.featureUUID);
      //
      //   //如果不是点击显示popup则不执行代码
      //   if (feature.popupOptions.optionType !== type) {
      //     return;
      //   }
      //
      //   //如果未启用，则不显示
      //   if (!feature.enablePupup) {
      //     return;
      //   }
      //
      //   this.$_pushPopup(hasPopup, degree, feature);
      // }
    },
    $_setCesiumClick() {
      // let vm = this;
      // this.viewer.scene.globe.depthTestAgainstTerrain = true;
      // this.viewer.screenSpaceEventHandler.setInputAction(function (movement) {
      //   vm.$_setPopup(movement.position, "click");
      // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    $_setCesiumMove() {
      let vm = this;
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
      this.viewer.screenSpaceEventHandler.setInputAction(function(movement) {
        vm.$_setPopup(movement.endPosition, "hover");
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    $_addPoint(callBack) {
      let vm = this;
      let handler = window.vueCesium.MapStoryManager.findSource(
        this.vueKey,
        this.vueIndex
      ).source;
      if (handler) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(function(event) {
          let cartesian3Position = viewer.camera.pickEllipsoid(
            event.position,
            viewer.scene.globe.ellipsoid
          );
          let lnglatPosition = vm.$_cartesian3ToLongLat(cartesian3Position);
          callBack(lnglatPosition, cartesian3Position);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
    }
  }
};
