export default {
  props: {
    modelUrl: {
      type: String
    },
    modelOffset: {
      type: Object,
      default: () => {
        return { headingOffset: -90, pitchOffset: 0, rollOffset: 0 };
      }
    },
    modelScale: {
      type: Number,
      default: 1
    },
    hideVPInvisible: {
      type: Boolean,
      default: false
    },
    currentProjectorOverlayLayerId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // modelPrimitive: undefined
    };
  },
  created() {},
  methods: {
    /**
     * 投放视频
     */
    putProjector(projector) {
      this._addCameraMarker(projector, this.modelUrl, this.modelOffset);
      let scenePro = this.viewer.scene.visualAnalysisManager.getVisualAnalysisByID(
        projector.id
      );
      if (scenePro) {
        // 视频已经被投放
        return scenePro;
      }
      const { viewer, Cesium, hideVPInvisible } = this;
      const { id, params } = projector;
      const proType = this._getProjectorType(
        projector.params.projectorType,
        projector.params.videoSource.protocol
      );
      const {
        cameraPosition,
        orientation,
        hFOV,
        vFOV,
        hintLineVisible,
        areaCoords,
        areaType
      } = params;
      scenePro = new Cesium.SceneProjector(proType);
      viewer.scene.visualAnalysisManager.add(scenePro, id);

      if (areaCoords && areaCoords.length) {
        if (
          !!window.graphicsLayer &&
          !!window.graphicsLayer.getGraphicByID(id + "graphic")
        ) {
          // 说明不是初始化的时候
          window.graphicsLayer.getGraphicByID(id + "graphic").show = true;
        } else {
          if (!window.graphicsLayer) {
            window.graphicsLayer = new Cesium.GraphicsLayer(viewer);
            let vueKey = "default";
            let vueIndex = this.currentProjectorOverlayLayerId;
            viewer.scene.layers.appendGraphicsLayer(window.graphicsLayer);
            window.vueCesium.GraphicsLayerManager.addSource(
              vueKey,
              vueIndex,
              window.graphicsLayer
            );
          }

          // 获取坐标系
          const ellipsoid = viewer.scene.globe.ellipsoid;
          let position = [];
          for (let i = 0; i < areaCoords.length; i++) {
            position.push(
              Cesium.Cartesian3.fromDegrees(
                areaCoords[i][0],
                areaCoords[i][1],
                areaCoords[i][2],
                ellipsoid
              )
            );
          }

          // 初始化的时候
          this.graphic = this.createGraphic(areaType, position, projector);
          window.graphicsLayer.addGraphic(this.graphic);
        }
      } else {
        switch (proType) {
          case Cesium.SceneProjectorType.IMAGE:
            scenePro.projectionSource = params.imgUrl;
            break;
          case Cesium.SceneProjectorType.VIDEO:
          case Cesium.SceneProjectorType.HLS:
            const { protocol, videoUrl } = params.videoSource;
            const element = this.createVideoElement(protocol, videoUrl, id);
            scenePro.projectionSource = videoUrl;
            break;
          case Cesium.SceneProjectorType.COLOR:
            scenePro.projectionSource = new Cesium.Color(1, 0, 0, 1);
            break;
          default:
            break;
        }
        const viewPosition = Cesium.Cartographic.toCartesian(
          Cesium.Cartographic.fromDegrees(
            cameraPosition.x,
            cameraPosition.y,
            cameraPosition.z
          )
        );
        scenePro.viewPosition = viewPosition;

        let targetPosition = Cesium.AlgorithmLib.pickFromRay(
          viewer.scene,
          viewPosition,
          { heading: orientation.heading, pitch: orientation.pitch }
        );
        if (!targetPosition) {
          targetPosition = Cesium.AlgorithmLib.pickFromRay(
            viewer.scene,
            viewPosition,
            {
              heading: orientation.heading,
              pitch: orientation.pitch,
              distance: 150
            }
          );
          scenePro.targetPosition = targetPosition;
        } else {
          scenePro.targetPosition = targetPosition;
        }
        scenePro.horizontAngle = hFOV;
        scenePro.verticalAngle = vFOV;
        scenePro.roll = orientation.roll;
        scenePro.hintLineVisible = hintLineVisible;
        scenePro.hideVPInvisible = hideVPInvisible;
      }
      return scenePro;
    },
    getVideoPlayerType(protocol) {
      let type = "video/mp4";
      if (protocol === "mp4") {
        type = "video/mp4";
      } else if (protocol === "m3u8") {
        type = "application/x-mpegURL";
      } else if (protocol === "webm") {
        type = "video/webm";
      } else if (protocol === "ogg") {
        type = "video/ogg";
      }
      return type;
    },
    /**
     * 创建html视频元素
     * @param {*} protocol 协议
     * @param {*} videoUrl 地址
     * @returns
     */
    createVideoElement(protocol, videoUrl, id) {
      if (window.projectorVideoDomMap[id]) {
        const { videoDom, hlsPlayer } = window.projectorVideoDomMap[id];
        return videoDom;
      }
      const playerType = this.getVideoPlayerType(protocol);
      const videoContainer = document.createElement("div");
      const width = 300;
      const height = 200;
      videoContainer.innerHTML = `<video id="projector-video-${id}" class="video-js vjs-default-skin" controls preload="auto" width="${width}" height="${height}" crossOrigin="anonymous">
      <source src="${videoUrl}" type="${playerType}" /></video>`;
      const videoDom = videoContainer.getElementsByTagName("video")[0];
      const options = {
        // 播放速度  playbackRates: [0.7, 1.0, 1.5, 2.0],
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      };
      const hlsPlayer = window.videojs(videoDom, options);
      hlsPlayer.src({
        type: playerType,
        src: videoUrl
      });
      hlsPlayer.load(videoUrl);
      hlsPlayer.play();
      hlsPlayer.loop();
      window.projectorVideoDomMap[id] = {
        videoDom,
        hlsPlayer
      };
      return videoDom;
    },
    createGraphic(type, position, projector) {
      const { id, params } = projector;
      const {
        projectorType,
        videoSource,
        imgUrl,
        heightReference,
        offsetHeight
      } = params;
      let element;
      if (projectorType === "image") {
        element = imgUrl;
      } else if (projectorType === "video") {
        element = this.createVideoElement(
          videoSource.protocol,
          videoSource.videoUrl,
          id
        );
      }
      let typeGraphic = new Cesium.Graphic({
        /**
         * 修改说明：graphic指定id，如果直接使用id会受到vue的影响，所以在id后方加一个"graphic"标识；
         * 修改人：王涵
         * 修改时间：2023/5/12
         */
        id: id + "graphic",
        //类型
        type: type,
        //几何点坐标
        positions: JSON.parse(JSON.stringify(position)),
        //样式
        style: {
          // 图片材质
          material: Cesium.Material.fromType(Cesium.Material.ImageType, {
            //图片url
            image: element,
            // x、y轴重复
            repeat: new Cesium.Cartesian2(1.0, 1.0)
          }),
          // 固定高度
          perPositionHeight: heightReference === 0,
          // 离地高度
          offsetHeight: offsetHeight,
          // 是否贴地
          classificationType:
            heightReference === 2 ? Cesium.ClassificationType.BOTH : undefined
        }
      });
      return typeGraphic;
    },
    /**
     * 笛卡尔坐标转经纬度
     * @param {*} cartesian3 笛卡尔坐标
     * @returns 经纬度坐标
     */
    cartesian3ToLngLat(cartesian3) {
      const { Cesium } = this;
      // 获取当前坐标系标准
      const ellipsoid = this.viewer.scene.globe.ellipsoid;
      // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
      const cartographic = ellipsoid.cartesianToCartographic(cartesian3);
      // 获取高度
      const height = Number(cartographic.height.toFixed(8));

      // 获取该位置的经纬度坐标
      const lng = parseFloat(
        this.Cesium.Math.toDegrees(cartographic.longitude).toFixed(8)
      );
      const lat = parseFloat(
        this.Cesium.Math.toDegrees(cartographic.latitude).toFixed(8)
      );
      return [lng, lat, height];
    },
    /**
     * 取消投放
     */
    cancelPutProjector(projector) {
      this.viewer.scene.visualAnalysisManager.removeByID(projector.id);
      // 直接移除，释放资源
      if (
        !!window.graphicsLayer &&
        !!window.graphicsLayer.getGraphicByID(projector.id + "graphic")
      ) {
        window.graphicsLayer.removeGraphicByID(projector.id + "graphic");
      }
      if (
        !!window.projectorVideoDomMap &&
        !!window.projectorVideoDomMap[projector.id]
      ) {
        const { videoDom, hlsPlayer } = window.projectorVideoDomMap[
          projector.id
        ];
        if (hlsPlayer) {
          hlsPlayer.dispose();
        }
        delete window.projectorVideoDomMap[projector.id];
      }
      this._removeCameraMarker(projector.id);
    },
    /**
     * 获取相机模型矩阵
     */
    _getModelMatrix(cartesian3Position, orientation, modelOffset) {
      const { Cesium, viewer } = this;
      const { headingOffset, pitchOffset, rollOffset } = modelOffset;
      //弧度的航向分量。
      const heading = Cesium.Math.toRadians(
        orientation.heading + headingOffset
      );
      //弧度的螺距分量。
      const pitch = Cesium.Math.toRadians(orientation.pitch + pitchOffset);
      //滚动分量（以弧度为单位）
      const roll = Cesium.Math.toRadians(orientation.roll + rollOffset);
      //HeadingPitchRoll旋转表示为航向，俯仰和滚动。围绕Z轴。节距是绕负y轴的旋转。滚动是关于正x轴。
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        cartesian3Position,
        hpr
      );
      return modelMatrix;
    },
    /**
     * 获取相机模型位置，为确保视频投放(不被相机模型遮挡，需将相机模型往观察点和视点反方向移动)
     */
    _getCameraModelPosition(
      targetPosition,
      viewPosition,
      orientation,
      distance
    ) {
      const { Cesium, viewer, modelOffset } = this;
      const { heading, pitch } = orientation;
      // 根据相机的观察点和视点计算两点的方向，
      // 取反，将相机往计算的反方向移动包围球半径的距离，
      // 确保相机模型不在相机的观察点和视点之间，以防遮挡视频投放(防止视频部分投放在相机模型上)
      let direction = new Cesium.Cartesian3();
      let dist = new Cesium.Cartesian3();
      let position = new Cesium.Cartesian3();
      direction = Cesium.Cartesian3.subtract(
        targetPosition,
        viewPosition,
        direction
      );
      direction = Cesium.Cartesian3.normalize(
        direction,
        new Cesium.Cartesian3()
      );
      dist = Cesium.Cartesian3.multiplyByScalar(
        direction,
        -distance,
        new Cesium.Cartesian3()
      );
      position = Cesium.Cartesian3.add(
        viewPosition,
        dist,
        new Cesium.Cartesian3()
      );
      return position;
    },
    /**
     * 添加相机模型
     */
    _addCameraMarker(projector, modelUrl, modelOffset) {
      const { primitives } = this.viewer.scene;
      for (let i = 0; i < primitives.length; i++) {
        const p = primitives.get(i);
        if (p.id === projector.id) {
          this.modelPrimitive = p;
          break;
        }
      }
      if (!this.modelPrimitive) {
        const { Cesium, viewer } = this;
        const { id, params } = projector;
        const { cameraPosition } = params;
        const viewPosition = Cesium.Cartesian3.fromDegrees(
          cameraPosition.x,
          cameraPosition.y,
          cameraPosition.z
        );
        let modelMatrix = this._getModelMatrix(
          viewPosition,
          params.orientation,
          modelOffset
        );
        let modelObj = {
          id,
          url: modelUrl,
          modelMatrix: modelMatrix,
          scale: this.modelScale
        };

        let modelPrimitive = viewer.scene.primitives.add(
          Cesium.Model.fromGltf(modelObj)
        );
        modelPrimitive.readyPromise.then(() => {
          // console.log(modelPrimitive);
          // 获取模型的包围球
          const { boundingSphere } = modelPrimitive;
          const { heading, pitch } = params.orientation;
          const targetPosition = Cesium.AlgorithmLib.pickFromRay(
            viewer.scene,
            viewPosition,
            { heading, pitch, distance: 150 }
          );
          const cameraModelPosition = this._getCameraModelPosition(
            targetPosition,
            viewPosition,
            params.orientation,
            boundingSphere.radius
          );
          modelMatrix = this._getModelMatrix(
            cameraModelPosition,
            params.orientation,
            modelOffset
          );

          viewer.scene.primitives.remove(modelPrimitive);

          modelObj = {
            id,
            url: modelUrl,
            modelMatrix: modelMatrix,
            scale: this.modelScale
          };

          this.modelPrimitive = viewer.scene.primitives.add(
            Cesium.Model.fromGltf(modelObj)
          );
        });
      }
    },
    /**
     * 移除相机模型
     */
    _removeCameraMarker(id) {
      const { primitives } = this.viewer.scene;
      for (let i = 0; i < primitives.length; i++) {
        const p = primitives.get(i);
        if (p.id === id) {
          this.viewer.scene.primitives.remove(p);
        }
      }
    },
    /**
     * @description 世界坐标转经纬度坐标
     * @param cartesian - {Object} 世界坐标
     * @return {Object} 经纬度坐标
     */
    _cartesianToDegrees(cartesian) {
      const { ellipsoid } = this.viewer.scene.globe;
      // 将笛卡尔坐标转换为地理坐标
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      // 将弧度转为度的十进制度表示
      const longitude = this.Cesium.Math.toDegrees(cartographic.longitude); // 转换后的经度
      const latitude = this.Cesium.Math.toDegrees(cartographic.latitude); // 转换后的纬度
      const coor = {
        lon: longitude,
        lat: latitude,
        height: cartographic.height
      };
      return coor;
    },
    /**
     * 获取朝向参数
     */
    _getHeadingPitch(viewPosition, targetPosition) {
      const { Cesium } = this;
      // 计算heading初始值
      const viewCartographic = Cesium.Cartographic.fromCartesian(viewPosition);
      const longitude = Cesium.Math.toDegrees(viewCartographic.longitude);
      const latitude = Cesium.Math.toDegrees(viewCartographic.latitude);
      const matrix = Cesium.AlgorithmLib.getTransform(
        longitude,
        latitude,
        viewCartographic.height
      );
      const inverseMatrix = Cesium.Matrix4.inverse(
        matrix,
        new Cesium.Matrix4()
      );
      const viewLocal = Cesium.Matrix4.multiplyByPoint(
        inverseMatrix,
        viewPosition,
        new Cesium.Cartesian3()
      );
      const targetLocal = Cesium.Matrix4.multiplyByPoint(
        inverseMatrix,
        targetPosition,
        new Cesium.Cartesian3()
      );
      const r = Cesium.Cartesian3.distance(viewLocal, targetLocal);
      const y = Math.sqrt(Math.pow(r, 2) - Math.pow(targetLocal.z, 2));
      let vectorLeft = Cesium.Cartesian3.subtract(
        new Cesium.Cartesian3(0, y, 0),
        viewLocal,
        new Cesium.Cartesian3()
      );
      const vectorRight = Cesium.Cartesian3.subtract(
        targetLocal,
        viewLocal,
        new Cesium.Cartesian3()
      );
      vectorRight.z = 0;

      let heading = Cesium.Math.toDegrees(
        Cesium.Cartesian3.angleBetween(vectorLeft, vectorRight)
      );
      if (vectorLeft.x * vectorRight.y - vectorRight.x * vectorLeft.y > 0) {
        heading = -heading + 360;
      }
      vectorLeft = new Cesium.Cartesian3(vectorRight.x, vectorRight.y, 0);
      Cesium.Cartesian3.normalize(vectorLeft, vectorLeft);
      vectorRight.z = targetLocal.z;

      let pitch = Cesium.Math.toDegrees(
        Cesium.Cartesian3.angleBetween(vectorLeft, vectorRight)
      );
      if (targetLocal.z < viewLocal.z) {
        pitch = -pitch;
      }
      const pitchDirection = vectorLeft;
      const result = {
        heading: heading,
        pitch: pitch,
        pitchDirection: pitchDirection
      };
      return result;
    },
    /**
     * 获取投影类型
     */
    _getProjectorType(projectorType, protocol) {
      let proType;
      if (projectorType === "image") {
        proType = this.Cesium.SceneProjectorType.IMAGE;
      } else if (projectorType === "video") {
        proType = this._getProType(protocol);
      }
      return proType;
    },
    /**
     * 获取投放视频协议
     */
    _getProType(protocol) {
      let proType;
      switch (protocol) {
        case "m3u8":
          proType = this.Cesium.SceneProjectorType.HLS;
          break;
        case "mp4":
          proType = this.Cesium.SceneProjectorType.VIDEO;
          break;
        default:
          break;
      }
      return proType;
    }
  }
};
