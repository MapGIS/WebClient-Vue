export default {
  props: {
    modelUrl: {
      type: String,
    },
    modelOffset: {
      type: Object,
      default: () => {
        return { headingOffset: -90, pitchOffset: 0, rollOffset: 0 };
      },
    },
    modelScale: {
      type: Number,
      default: 1,
    },
    hideVPInvisible: {
      type: Boolean,
      default: false,
    },
    currentProjectorOverlayLayerId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      modelPrimitive: undefined,
    };
  },
  created() {},
  methods: {
    /**
     * 投放视频
     */
    putProjector(projector) {
      this._addCameraMarker(projector, this.modelUrl, this.modelOffset);
      let scenePro =
        this.viewer.scene.visualAnalysisManager.getVisualAnalysisByID(
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
      } = params;
      scenePro = new Cesium.SceneProjector(proType);
      viewer.scene.visualAnalysisManager.add(scenePro, id);

      if (areaCoords && areaCoords.length) {
        window.graphicsLayer.getGraphicByID(id + "graphic").show = true;
      } else {
        switch (proType) {
          case Cesium.SceneProjectorType.IMAGE:
            scenePro.textureSource = params.imgUrl;
            break;
          case Cesium.SceneProjectorType.VIDEO:
          case Cesium.SceneProjectorType.HLS:
            scenePro.textureSource = params.videoSource.videoUrl;
            break;
          case Cesium.SceneProjectorType.COLOR:
            scenePro.textureSource = new Cesium.Color(1, 0, 0, 1);
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
              distance: 150,
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
    /**
     * 取消投放
     */
    cancelPutProjector(projector) {
      this.viewer.scene.visualAnalysisManager.removeByID(projector.id);
      if (projector.params.areaCoords && projector.params.areaCoords.length) {
        window.graphicsLayer.getGraphicByID(
          projector.id + "graphic"
        ).show = false;
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
          scale: this.modelScale,
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
            scale: this.modelScale,
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
        height: cartographic.height,
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
        pitchDirection: pitchDirection,
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
    },
  },
};
