import * as turf from "@turf/turf"
import Base64IconsKeyValue from "./Base64IconsKeyValue"

export default {
  inject: ["viewer", "Cesium"],
  mixins: [Base64IconsKeyValue],
  props: {
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
  data() {
    return {
      projectSet: {},
      optArr: [],
      projectMaps: [],
      popups: [],
      dataSourceCopy: [],
      currentFeatureType: undefined,
      currentFeature: undefined,
      startDraw: false
    }
  },
  methods: {
    $_autoFlyto(features, dataSource, index, callBack) {
      let vm = this;
      if (index < features.length) {
        setTimeout(function () {
          if (callBack) {
            callBack(index);
          }
          vm.$_flyTo(features[index].camera, features[index].animationTime, function (vm) {
            if (index > 0) {
              //隐藏上一个章节的所有要素
              vm.$_toggleChapterFeatures(features[index - 1].uuid, features[index - 1].projectUUID, dataSource);
            }
            //显示当前章节的所有要素
            vm.$_toggleChapterFeatures(features[index].uuid, features[index].projectUUID, dataSource);
            setTimeout(function () {
              vm.$_toggleChapterFeatures(features[index].uuid, features[index].projectUUID, dataSource, false);
            }, 200);
            setTimeout(function () {
              vm.$_toggleChapterFeatures(features[index].uuid, features[index].projectUUID, dataSource);
            }, 400);
            setTimeout(function () {
              vm.$_toggleChapterFeatures(features[index].uuid, features[index].projectUUID, dataSource, false);
            }, 600);
            setTimeout(function () {
              vm.$_toggleChapterFeatures(features[index].uuid, features[index].projectUUID, dataSource);
            }, 800);
          });
          vm.$_autoFlyto(features, dataSource, index + 1, callBack);
        }, Number(features[index].animationTime));
      }
    },
    $_play(features, dataSource, callBack) {
      for (let i = 0; i < features.length; i++) {
        this.$_toggleChapterFeatures(features[i].uuid, features[i].projectUUID, dataSource, false);
      }
      let vm = this;
      this.$_flyTo(features[0].camera, features[0].animationTime, function () {
        setTimeout(function () {
          vm.$_toggleChapterFeatures(features[0].uuid, features[0].projectUUID, dataSource, false);
        }, 200);
        setTimeout(function () {
          vm.$_toggleChapterFeatures(features[0].uuid, features[0].projectUUID, dataSource);
        }, 400);
        setTimeout(function () {
          vm.$_toggleChapterFeatures(features[0].uuid, features[0].projectUUID, dataSource, false);
        }, 600);
        setTimeout(function () {
          vm.$_toggleChapterFeatures(features[0].uuid, features[0].projectUUID, dataSource);
        }, 800);
      });
      this.$_autoFlyto(features, dataSource, 0, callBack);
    },
    $_cloneFeatures(features, featureUUID, newUUID) {
      let newfeatures = [];
      for (let k = 0; k < features.length; k++) {
        let coordinates = [];
        switch (features[k].feature.geometry.type) {
          case "point":
            let c = features[k].feature.geometry.coordinates
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
        Object.keys(features[k].feature.properties).forEach(function (key) {
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
            type: features[k].feature.type,
          },
          featureUUID: fUUID,
          projectUUID: features[k].projectUUID,
          type: features[k].type,
          uuid: features[k].uuid,
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
            longitude: 0,
          },
        }
      } else {
        //camera存在，但positionCartographic不存在
        if (!originCamera.positionCartographic || !(originCamera.positionCartographic instanceof Object)) {
          camera = {
            uuid: originCamera.uuid,
            heading: originCamera.heading || 0,
            pitch: originCamera.pitch || 0,
            roll: originCamera.roll || 0,
            positionCartographic: {
              height: 0,
              latitude: 0,
              longitude: 0,
            },
          }
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
              longitude: originCamera.positionCartographic.longitude,
            },
          }
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
        }
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
        type: "text",//弹窗类型，text、card（图片）、table
        optionType: "click",//如何开启弹窗，click（鼠标点击）、hover（鼠标移入）、force（强制开启）
        title: "",//标题
        content: "",//类型为text时的文本
        images: [],//类型为图片时的url数组
        keyValue: {},//类型为表格时的数据
      };
      return feature;
    },
    $_textToCanvas(text) {
      let canvas = document.createElement('canvas');
      canvas.height = 200;
      let context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#f00";
      context.fillRect(0, 0, 200, 200);
      context.fillStyle = "#fff";
      context.font = 30 + "px Arial";
      context.textBaseline = 'middle';
      context.fillText(text, 0, 100);
      return canvas.toDataURL();
    },
    $_drawCreate(Cartesian3Points, degreeArr, viewerDraw, radians) {
      let center, entity;
      let mapStoryManager = window.vueCesium.MapStoryManager.findSource(this.vueKey, this.vueIndex);
      switch (this.currentFeatureType) {
        case "rectangle":
          let points = [[Cesium.Math.toDegrees(radians.west), Cesium.Math.toDegrees(radians.south)], [Cesium.Math.toDegrees(radians.east), Cesium.Math.toDegrees(radians.north)]];
          center = this.$_getRectangleCenter(points);
          this.currentFeature.center = center;
          let rectanglePoints = [[
            [Cesium.Math.toDegrees(radians.west), Cesium.Math.toDegrees(radians.south), 0],
            [Cesium.Math.toDegrees(radians.west), Cesium.Math.toDegrees(radians.north), 0],
            [Cesium.Math.toDegrees(radians.east), Cesium.Math.toDegrees(radians.north), 0],
            [Cesium.Math.toDegrees(radians.east), Cesium.Math.toDegrees(radians.south), 0],
            [Cesium.Math.toDegrees(radians.west), Cesium.Math.toDegrees(radians.south), 0]
          ]];
          this.currentFeature.drawType = "rectangle";
          this.currentFeature.feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Polygon",
              "coordinates": rectanglePoints
            }
          };
          this.currentFeature = this.$_getFeature(this.currentFeature);
          this.$_setFeature(this.currentFeature);
          entity = this.viewer.entities.add({
            id: this.currentFeature.uuid,
            rectangle: {
              coordinates: radians,
              material: Cesium.Color.RED,
            },
            featureUUID: this.currentFeature.uuid,
            projectUUID: this.currentFeature.projectUUID,
          });
          // this.viewer.entities.add({
          //   id: this.currentFeature.uuid + "_text",
          //   rectangle: {
          //     coordinates: radians,
          //     material: this.$_textToCanvas(this.currentFeature.uuid + "_text"),
          //   },
          //   featureUUID: this.currentFeature.uuid,
          //   projectUUID: this.currentFeature.projectUUID,
          // });
          mapStoryManager.options[this.currentFeature.uuid] = entity;
          break;
        case "polygon":
          center = this.$_getPolygonCenter(degreeArr);
          this.currentFeature.center = center;
          let polygonPoints = [[]];
          for (let i = 0; i < degreeArr.length; i++) {
            polygonPoints[0].push([degreeArr[i][0], degreeArr[i][1], degreeArr[i][2]]);
          }
          this.currentFeature.drawType = "polygon";
          this.currentFeature.feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Polygon",
              "coordinates": polygonPoints
            }
          };
          this.currentFeature = this.$_getFeature(this.currentFeature);
          this.$_setFeature(this.currentFeature);
          entity = this.viewer.entities.add({
            id: this.currentFeature.uuid,
            polygon: {
              hierarchy: new Cesium.PolygonHierarchy(Cartesian3Points),
              material: Cesium.Color.RED,
              fill: true
            },
            featureUUID: this.currentFeature.uuid,
            projectUUID: this.currentFeature.projectUUID,
          });
          mapStoryManager.options[this.currentFeature.uuid] = entity;
          break;
        case "polyline":
          let newPoints = degreeArr.concat([degreeArr[0]]);
          center = this.$_getPolygonCenter(newPoints);
          this.currentFeature.center = center;
          let linePoints = [];
          for (let i = 0; i < degreeArr.length; i++) {
            linePoints.push([degreeArr[i][0], degreeArr[i][1], degreeArr[i][2]]);
          }
          this.currentFeature.drawType = "polyline";
          this.currentFeature.feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "LineString",
              "coordinates": linePoints
            }
          };
          this.currentFeature.layerStyle.width = 4;
          this.currentFeature = this.$_getFeature(this.currentFeature);
          this.$_setFeature(this.currentFeature);
          entity = this.viewer.entities.add({
            id: this.currentFeature.uuid,
            polyline: {
              positions: Cartesian3Points,
              material: Cesium.Color.RED,
              width: this.currentFeature.layerStyle.width
            },
            featureUUID: this.currentFeature.uuid,
            projectUUID: this.currentFeature.projectUUID,
          });
          mapStoryManager.options[this.currentFeature.uuid] = entity;
          break;
      }
      this.startDraw = false;
    },
    $_firstAddPicture(feature) {
      let lnglatPosition;
      if (feature.center) {
        lnglatPosition = {
          lng: feature.center[0],
          lat: feature.center[1],
          alt: feature.center[2],
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
      let addMap = true, mapIndex;
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
          this.$_getBillBoardIcon(0, function (img) {
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
          window.feature.camera.longLatPosition = this.$_getPolygonCenter(this.currentPoints);
          window.feature.drawType = "polyline";
          break;
        case "polygon":
          window.feature.camera.longLatPosition = this.$_getPolygonCenter(this.currentPoints);
          window.feature.drawType = "polygon";
          break;
        case "rectangle":
          window.feature.camera.longLatPosition = this.$_getRectangleCenter(this.currentPoints);
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
            entity[geometryType].material = Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), opacity);
          } else if (entity.rectangle) {
            entity.rectangle.material = new Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), opacity);
          }
          break;
        case "polyline":
          entity[geometryType].material = new Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(color), opacity);
          break;
      }
    },
    $_changeColor(color, type, id, geometryType) {
      let entity = this.viewer.entities.getById(id);
      switch (geometryType) {
        case "polygon":
          if (entity.polygon) {
            entity[geometryType].material = new Cesium.Color.fromCssColorString(color.hex);
          } else if (entity.rectangle) {
            entity.rectangle.material = new Cesium.Color.fromCssColorString(color.hex);
          }
          break;
        case "polyline":
          entity[geometryType].material = new Cesium.Color.fromCssColorString(color.hex);
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
        const {vueKey, vueIndex} = map;
        if (vueKey && vueIndex) {
          let layerManager = window.vueCesium.OGCWMTSManager.findSource(vueKey, vueIndex);
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
      this.$_getBillBoardIcon(icon, function (img) {
        entity.billboard.image = img;
      });
    },
    $_addEntity(feature, layerStyle, id) {
      let vm = this;
      switch (feature.type) {
        case "point":
          const {geometry} = feature;
          if (!geometry) {
            return;
          }
          const {x, y, z} = feature.geometry;
          if (x && y && z) {
            let img = document.createElement("img");
            let imgUrl = layerStyle.billboard.image;
            if (typeof imgUrl === 'number') {
              imgUrl = Base64IconsKeyValue[imgUrl].value;
            }
            img.src = imgUrl;
            img.onload = function () {
              vm.viewer.entities.add({
                id: id,
                position: new Cesium.Cartesian3(x, y, z),
                billboard: {
                  image: img,
                  disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
              });
            }
          }
          break;
      }
    },
    $_showProject(project) {
      const {show, uuid} = project;
      if (show) {
        let newProject = this.projectSet[uuid];
        const {features, map} = newProject;
        for (let i = 0; i < features.length; i++) {
          let entity = this.viewer.entities.getById(features[i].id);
          const {layerStyle, baseUrl} = features[i];
          if (entity) {
            if (show) {
              if (layerStyle.hasOwnProperty("show") && layerStyle.show !== false) {
                entity.show = show;
                this.$_getLayer(i, newProject, function (layer) {
                  layer.show = show;
                });
              }
            } else {
              entity.show = show;
              this.$_getLayer(i, newProject, function (layer) {
                layer.show = show;
              });
            }
          } else {
            const {map} = features[i];
            this.$_addEntity(baseUrl, features[i].layerStyle, features[i].id);
            if (map) {
              this.optArr.push(map);
            }
          }
        }
        if (map) {
          const {vueKey, vueIndex, type} = map;
          if (vueKey && vueIndex && type) {
            let layer;
            switch (type) {
              case "WMTS":
                layer = window.vueCesium.OGCWMTSManager.findSource(vueKey, vueIndex);
                break;
            }
            if (!layer) {
              this.projectMaps.push(map);
            }
          }
        }
      } else {

      }
    },
    $_showFeature(id, flag, index, project) {
      if (id) {
        let entity = this.viewer.entities.getById(id);
        entity.show = flag;
      }
      this.$_getLayer(index, project, function (layer) {
        layer.show = flag;
      });
    },
    $_addMapToProject(type, map) {
      map.vueKey = this.vueKey;
      map.vueIndex = new Date().getTime();
      let index, addMap = true;
      for (let i = 0; i < this.projectMaps.length; i++) {
        if (this.projectMaps[i].vueKey === map.vueKey && this.projectMaps[i].vueIndex === map.vueIndex) {
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
    $_changeEntity(type, uuid, value) {
      let graphicsLayer = window.graphicsLayer;
      let entity = graphicsLayer.getPlottingPrimtiveByID(uuid);
      let position;
      console.log("----entity", entity)
      switch (type) {
        case "fontColor":
          entity.fillColor = Cesium.Color.fromCssColorString(value);
          break;
        case "fontOpacity":
          entity.fillColor = Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(value.color), value.opacity);
          break;
        case "changeEntityTitle":
          entity.text = value;
          break;
        case "changeEntityHeight":
          position = this.$_cartesian3ToLongLat(entity.position);
          position.alt = value;
          entity.position = Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.alt);
          break;
        case "changeEntityLng":
          position = this.$_cartesian3ToLongLat(entity.position);
          position.lng = value;
          entity.position = Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.alt);
          break;
        case "changeEntityLat":
          position = this.$_cartesian3ToLongLat(entity.position);
          position.lat = value;
          entity.position = Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.alt);
          break;
        case "polylineOpacity":
        case "polylineColor":
          entity.polyline.material = Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(value.color), value.opacity);
          break;
        case "polylineWidth":
          entity.polyline.width = value;
          break;
        case "polygonOpacity":
        case "polygonColor":
          entity.polygon.material = Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(value.color), value.opacity);
          break;
        case "rectangleColor":
        case "rectangleOpacity":
          entity.rectangle.material = Cesium.Color.fromAlpha(Cesium.Color.fromCssColorString(value.color), value.opacity);
          break;
        case "changeEntityIcon":
          this.$_changeIcon(value, uuid);
          break;
        case "forcePopup":
          let hasPopup = this.$_hasPopup(uuid.uuid);
          let degree = {
            lng: uuid.center[0],
            lat: uuid.center[1],
            alt: uuid.center[2],
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
          }
          this.dataSourceCopy[i].chapters.push(newChapter);
          break;
        }
      }
    },
    $_toggleChapterFeatures(chapterUUID, projectUUID, dataSource, show) {
      let graphicsLayer = window.graphicsLayer;
      dataSource = dataSource || this.dataSourceCopy;
      for (let i = 0; i < dataSource.length; i++) {
        if (dataSource[i].uuid === projectUUID) {
          let chapters = dataSource[i].chapters;
          for (let j = 0; j < chapters.length; j++) {
            if (chapters[j].uuid === chapterUUID) {
              let features = chapters[j].features;
              for (let k = 0; k < features.length; k++) {
                let entity = graphicsLayer.getPlottingPrimtiveByID(features[k].uuid);
                if (show === false || show === true) {
                  entity.show = show;
                } else {
                  entity.show = features[k].show;
                }
              }
              break;
            }
          }
          break;
        }
      }
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
              console.log("----------features[j]", features[j])
              //取得center
              let center = [];
              if (features[j].center instanceof Array) {
                for (let k = 0; k < features[j].center.length; k++) {
                  center.push(features[j].center[k]);
                }
              }
              //取得layerStyle
              let layerStyle = {};
              Object.keys(features[j].layerStyle).forEach(function (key) {
                layerStyle[key] = features[j].layerStyle[key];
              });
              //取得popupOptions
              let popupOptions = {};
              Object.keys(features[j].popupOptions).forEach(function (key) {
                popupOptions[key] = features[j].popupOptions[key];
              });
              newFeatures.push({
                center: center,
                drawType: features[j].drawType,
                enablePupup: features[j].enablePupup,
                layerStyle: layerStyle,
                popupOptions: popupOptions,
                title: features[j].title,
                uuid: features[j].uuid,
                show: features[j].show,
              });
            }
            chapter.features = newFeatures;
          }
          this.dataSourceCopy[i].chapters.push(chapter);
          break;
        }
      }
    },
    $_setFeature(feature, options) {
      for (let i = 0; i < this.dataSourceCopy.length; i++) {
        if (this.dataSourceCopy[i].uuid === feature.projectUUID) {
          this.dataSourceCopy[i].features.push(feature);
          let chapters = this.dataSourceCopy[i].chapters;
          for (let j = 0; j < chapters.length; j++) {
            let newFeature = {
              uuid: feature.uuid,
              title: feature.uuid,
              drawType: feature.drawType,
              layerStyle: feature.layerStyle,
              enablePupup: feature.enablePupup,
              popupOptions: feature.popupOptions,
              center: feature.center
            };
            if (chapters[j].uuid === feature.featureUUID) {
              newFeature.show = true;
              if (options) {
                newFeature = Object.assign(newFeature, options);
              }
              chapters[j].features.push(newFeature);
            } else {
              newFeature.show = false;
              if (options) {
                newFeature = Object.assign(newFeature, options);
              }
              chapters[j].features.push(newFeature);
            }
          }
          break;
        }
      }
    },
    $_addFeature(feature) {
      let vm = this, entity;
      let mapStoryManager = window.vueCesium.MapStoryManager.findSource(this.vueKey, this.vueIndex);
      this.currentFeatureType = feature.type;
      this.currentFeature = feature.feature;
      //开始绘制
      this.startDraw = true;
      switch (feature.type) {
        case "point":
          this.$_addPoint(function (position, cartesian3Position) {
            vm.$_getBillBoardIcon(0, function (img) {
              feature.feature.drawType = "point";
              feature.feature.feature.geometry = {
                drawType: "point",
                type: "point",
                coordinates: [position.lng, position.lat, position.alt]
              }
              entity = vm.viewer.entities.add({
                id: feature.feature.uuid,
                position: cartesian3Position,
                billboard: {
                  image: img,
                  disableDepthTestDistance: Number.POSITIVE_INFINITY
                },
                featureUUID: vm.currentFeature.uuid,
                projectUUID: vm.currentFeature.projectUUID,
              });
              mapStoryManager.options[feature.feature.uuid] = entity;
              feature.feature = vm.$_getFeature(feature.feature);
              vm.$_setFeature(feature.feature);
              vm.startDraw = false;
            });
          });
          break;
        case "polyline":
          this.drawer && this.drawer.enableDrawLine(true);
          break;
        case "rectangle":
          this.drawer && this.drawer.enableDrawRectangle(true);
          break;
        case "polygon":
          this.drawer && this.drawer.enableDrawPolygon(true);
          break;
        case "chapter":
          this.$refs.projectPanel.currentProject.features.push(feature.feature);
          break;
        case "text":
          window.graphicsLayer = new Cesium.GraphicsLayer(this.viewer);
          this.viewer.scene.layers.appendGraphicsLayer(graphicsLayer);
          graphicsLayer.startDrawing({
            id: feature.feature.uuid,
            type: "label",
            text: '无标题',
            font: '50px Helvetica',
            pixelSize: 20,
            pixelOffsetScaleByDistance: false,
            horizontalOrigin: Cesium.HorizontalOrigin.right,
            fillColor: '#000',
            isScaleByDistance: true, //是否远近缩放
            getPrimitive: function (e) {
              e.featureUUID = vm.currentFeature.uuid;
              e.projectUUID = vm.currentFeature.projectUUID;
              e.primitive.featureUUID = vm.currentFeature.uuid;
              e.primitive.projectUUID = vm.currentFeature.projectUUID;
              let position = vm.$_cartesian3ToLongLat(e.position);
              feature.feature.drawType = "text";
              feature.feature.center = [position.lng, position.lat, position.alt];
              feature.feature.layerStyle.color = "#000000";
              feature.feature.feature.geometry = {
                type: "point",
                coordinates: [position.lng, position.lat, position.alt]
              }
              feature.feature.feature.properties = {
                "title": "无标题"
              }
              feature.feature = vm.$_getFeature(feature.feature);
              vm.$_setFeature(feature.feature, {
                title: "无标题"
              });
              mapStoryManager.options[feature.feature.uuid] = e;
              vm.startDraw = false;
            }
          });
          break;
      }
    },
    $_flyTo(camera, time, easingFunction) {
      const {positionCartographic, heading, pitch, roll} = camera;
      const {longitude, latitude, height} = positionCartographic;
      easingFunction = easingFunction || function () {
      };
      this.viewer.camera.flyTo({
        easingFunction: easingFunction(this),
        duration: time / 1000,
        destination: new Cesium.Cartesian3.fromRadians(longitude, latitude, height),
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
      img.onload = function () {
        callBack(img);
      }
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
        pPoints.push([points[i][0], points[i][1]])
      }
      let center = this.$_getCenter([pPoints]);
      return [center.geometry.coordinates[0], center.geometry.coordinates[1], 0];
    },
    $_getRectangleCenter(points) {
      let pPoints = [[
        [points[0][0], points[0][1]],
        [points[0][0], points[1][1]],
        [points[1][0], points[1][1]],
        [points[1][0], points[0][1]],
        [points[0][0], points[0][1]]
      ]];
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
      let hasPopup = false, index;
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
          id: feature.uuid,
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
      let pickedFeature = this.viewer.scene.pick(position);
      if (!pickedFeature) {
        return;
      }
      let ray = this.viewer.scene.camera.getPickRay(position);
      let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
      let degree = this.$_cartesian3ToLongLat(cartesian);
      if (pickedFeature && !this.startDraw) {
        let hasPopup = this.$_hasPopup(pickedFeature.id);
        let feature = this.$_getFeatureByUUID(pickedFeature.primitive.projectUUID, pickedFeature.primitive.featureUUID);

        //如果不是点击显示popup则不执行代码
        if (feature.popupOptions.optionType !== type) {
          return;
        }

        //如果未启用，则不显示
        if (!feature.enablePupup) {
          return;
        }

        this.$_pushPopup(hasPopup, degree, feature);
      }
    },
    $_setCesiumClick() {
      let vm = this;
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
      this.viewer.screenSpaceEventHandler.setInputAction(function (movement) {
        vm.$_setPopup(movement.position, "click");
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    $_setCesiumMove() {
      let vm = this;
      this.viewer.scene.globe.depthTestAgainstTerrain = true;
      this.viewer.screenSpaceEventHandler.setInputAction(function (movement) {
        vm.$_setPopup(movement.endPosition, "hover");
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    $_initManager() {
      let mapStoryManager = window.vueCesium.MapStoryManager.findSource(this.vueKey, this.vueIndex);
      if (!mapStoryManager) {
        let handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
        let entities = {};
        window.vueCesium.MapStoryManager.addSource(this.vueKey, this.vueIndex, handler, entities);
      }
      this.$_setCesiumClick();
      this.$_setCesiumMove();
      // if (this.dataSource instanceof Array) {
      //     let popups = [];
      //     for (let i = 0; i < this.dataSource.length; i++) {
      //         let result = this.dataSource[i].chapters;
      //         vm.projectSet[vm.dataSource[i].uuid] = result;
      //         const {features, show, map} = result;
      //         if (show === false) {
      //             return;
      //         }
      //         if (map) {
      //             vm.projectMaps.push(map);
      //         }
      //         for (let i = 0; i < features.length; i++) {
      //             const {map} = features[i];
      //             const {geometry} = features[i].baseUrl;
      //             const {x, y, z} = geometry;
      //             if (map) {
      //                 map.id = features[i].id;
      //                 vm.optArr.push(map);
      //             }
      //             let lnglatPosition = vm.$_cartesian3ToLongLat(features[i].baseUrl.geometry);
      //             popups.push({
      //                 lng: lnglatPosition.lng,
      //                 lat: lnglatPosition.lat,
      //                 alt: 20,
      //                 title: features[i].title,
      //                 images: features[i].images,
      //                 feature: features[i],
      //                 id: features[i].id,
      //                 show: features[i].show,
      //                 vueIndex: parseInt(String(Math.random() * 10000))
      //             });
      //             if (x && y && z) {
      //                 let img = document.createElement("img");
      //                 let imgUrl = features[i].layerStyle.billboard.image;
      //                 if (typeof imgUrl === 'number') {
      //                     imgUrl = Base64IconsKeyValue[imgUrl].value;
      //                 }
      //                 img.src = imgUrl;
      //                 img.onload = function () {
      //                     vm.viewer.entities.add({
      //                         id: features[i].id,
      //                         position: new Cesium.Cartesian3(x, y, z),
      //                         billboard: {
      //                             image: img,
      //                             disableDepthTestDistance: Number.POSITIVE_INFINITY
      //                         }
      //                     });
      //                 }
      //             }
      //         }
      //         vm.$_setCesiumClick();
      //         vm.$nextTick(function () {
      //             let icons = document.getElementsByClassName("mapgis-3d-map-story-small-popup-tolarge");
      //             for (let i = 0; i < icons.length; i++) {
      //                 icons[i].onclick = function () {
      //                     vm.$emit("projectPreview", [features[i]], false);
      //                 }
      //             }
      //         });
      //     }
      //     vm.popups = popups;
      // }
    },
    $_addPoint(callBack) {
      let vm = this;
      let handler = window.vueCesium.MapStoryManager.findSource(this.vueKey, this.vueIndex).source;
      if (handler) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(function (event) {
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
}