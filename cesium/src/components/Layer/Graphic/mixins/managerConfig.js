export default {
  methods: {
    setFeatureConfig() {
      const featureConfig = this.featureConfig.feature;
      const labelConfig = this.featureConfig.label;
      const managerConfig = this.getConfig(featureConfig, labelConfig);
      const editConfig = JSON.parse(JSON.stringify(this.editList));
      this.setManagerConfig(editConfig, managerConfig);
      this.editList = editConfig;
    },
    getConfig(featureConfig, labelConfig) {
      const config = {};
      Object.keys(featureConfig).forEach(item => {
        const feature = featureConfig[item];
        switch (item) {
          case "line":
            config.lineColor = feature.color;
            config.lineWidth = Number(feature.size);
            break;
          case "pnt":
            config.pointColor = feature.color;
            config.pointWidth = Number(feature.size);
            config.pointStyle = feature.style;
            break;
          case "reg":
            config.polygonColor = feature.color;
          default:
            break;
        }
      });

      Object.keys(labelConfig).forEach(item => {
        const label = labelConfig[item];
        switch (item) {
          case "image":
            config.defaultImg = label.defaultImg;
            config.selectedImg = label.selectedImg;
            config.anchor = label.popupAnchor;
            break;
          case "text":
            config.textColor = label.color;
            config.fontFamily = label.fontFamily;
            config.fontSize = label.fontSize;
            break;
          default:
            break;
        }
      });

      return config;
    },
    setManagerConfig(editConfig, managerConfig) {
      Object.keys(editConfig).forEach(item => {
        const config = editConfig[item];
        switch (item) {
          case "box":
            this.setBoxConfig(config, managerConfig);
            break;
          case "circle":
            this.setCircleConfig(config, managerConfig);
            break;
          case "cone":
            this.setConeConfig(config, managerConfig);
            break;
          case "corridor":
            this.setCorridorConfig(config, managerConfig);
            break;
          case "curve":
            this.setCurveConfig(config, managerConfig);
            break;
          case "cylinder":
            this.setCylinderConfig(config, managerConfig);
            break;
          case "ellipsoid":
            this.setEllipsoidConfig(config, managerConfig);
            break;
          case "label":
            this.setLabelConfig(config, managerConfig);
            break;
          case "marker":
            this.setMarkerConfig(config, managerConfig);
            break;
          case "model":
            this.setModelConfig(config, managerConfig);
            break;
          case "point":
            this.setPointConfig(config, managerConfig);
            break;
          case "polygon":
            this.setPolygonConfig(config, managerConfig);
            break;
          case "polygonCube":
            this.setPolygonCubeConfig(config, managerConfig);
            break;
          case "polyline":
            this.setPolylineConfig(config, managerConfig);
            break;
          case "polylineVolume":
            this.setPolylineVolumeConfig(config, managerConfig);
            break;
          case "rectangle":
            this.setRectangleConfig(config, managerConfig);
            break;
          case "square":
            this.setSquareConfig(config, managerConfig);
            break;
          case "wall":
            this.setWallConfig(config, managerConfig);
            break;
          default:
            break;
        }
      });
    },
    setBoxConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "extrudedHeight":
            break;
          case "offsetHeight":
            break;
          case "color":
            item.value = managerConfig.polygonColor;
            break;
          case "opacity":
            break;
          default:
            break;
        }
      });
    },
    setCircleConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "radius":
            break;
          case "materialType":
            break;
          case "materialColor":
            item.value = managerConfig.polygonColor;
            break;
          case "elevationMode":
            break;
          case "offsetHeight":
            break;
          case "extrudedHeight":
            break;
          case "offsetHeight":
            break;
          case "materialOpacity":
            break;
          case "speed":
            break;
          case "duration":
            break;
          case "gradient":
            break;
          case "count":
            break;
          default:
            break;
        }
      });
    },
    setConeConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "radius":
            break;
          case "extrudedHeight":
            break;
          case "color":
            item.value = managerConfig.polygonColor;
            break;
          case "offsetHeight":
            break;
          case "opacity":
            break;
          default:
            break;
        }
      });
    },
    setCorridorConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "width":
            if (managerConfig.lineWidth) {
              item.value = managerConfig.lineWidth;
            }
            break;
          case "extrudedHeight":
            break;
          case "color":
            if (managerConfig.polygonColor) {
              item.value = managerConfig.polygonColor;
            }
            break;
          case "cornerType":
            break;
          case "opacity":
            break;
          default:
            break;
        }
      });
    },
    setCurveConfig(config, managerConfig) {
      //   config.forEach(item => {
      //     switch (item.key) {
      //       case "title":
      //         break;
      //       case "width":
      //         if (managerConfig.lineWidth) {
      //           item.value = managerConfig.lineWidth;
      //         }
      //         break;
      //       case "extrudedHeight":
      //         break;
      //       case "color":
      //         if (managerConfig.polygonColor) {
      //           item.value = managerConfig.polygonColor;
      //         }
      //         break;
      //       case "cornerType":
      //         break;
      //       case "opacity":
      //         break;
      //       default:
      //         break;
      //     }
      //   });
    },
    setCylinderConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "opacity":
            break;
          case "extrudedHeight":
            break;
          case "color":
            if (managerConfig.polygonColor) {
              item.value = managerConfig.polygonColor;
            }
            break;
          case "topRadius":
            break;
          case "bottomRadius":
            break;
          case "offsetHeight":
            break;
          default:
            break;
        }
      });
    },
    setEllipsoidConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "radiusX":
            break;
          case "radiusY":
            break;
          case "color":
            if (managerConfig.polygonColor) {
              item.value = managerConfig.polygonColor;
            }
            break;
          case "radiusZ":
            break;
          case "opacity":
            break;
          case "offsetHeight":
            break;
          default:
            break;
        }
      });
    },
    setLabelConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "text":
            break;
          case "fontFamily":
            if (managerConfig.fontFamily) {
              item.value = managerConfig.fontFamily;
            }
            break;
          case "fontSize":
            if (managerConfig.fontSize) {
              item.value = managerConfig.fontSize;
            }
            break;
          case "fontColor":
            if (managerConfig.textColor) {
              item.value = managerConfig.textColor;
            }
            break;
          case "showOutline":
            break;
          case "opacity":
            break;
          case "offsetHeight":
            break;
          case "outlineWidth":
            break;
          case "outlineColor":
            break;
          case "outlineOpacity":
            break;
          case "showBackground":
            break;
          case "backgroundColor":
            break;
          case "backgroundOpacity":
            break;
          case "backgroundPadding":
            break;
          case "horizontalOrigin":
            break;
          case "verticalOrigin":
            break;
          default:
            break;
        }
      });
    },
    setMarkerConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "image":
            break;
          case "width":
            break;
          case "height":
            break;
          case "text":
            break;
          case "fontFamily":
            if (managerConfig.fontFamily) {
              item.value = managerConfig.fontFamily;
            }
            break;
          case "fontSize":
            if (managerConfig.fontSize) {
              item.value = managerConfig.fontSize;
            }
            break;
          case "fontColor":
            if (managerConfig.textColor) {
              item.value = managerConfig.textColor;
            }
            break;
          case "labelPlaceType":
            break;
          case "labelPadding":
            break;
          case "offsetHeight":
            break;
          case "opacity":
            break;
          default:
            break;
        }
      });
    },
    setModelConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "url":
            break;
          case "scale":
            break;
          default:
            break;
        }
      });
    },
    setPointConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "pixelSize":
            break;
          case "color":
            if (managerConfig.pointColor) {
              item.value = managerConfig.pointColor;
            }
            break;
          case "opacity":
            break;
          case "offsetHeight":
            break;
          case "showOutline":
            break;
          case "outlineWidth":
            break;
          case "outlineColor":
            break;
          case "outlineOpacity":
            break;
          default:
            break;
        }
      });
    },
    setPolygonConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "materialType":
            break;
          case "image":
            break;
          case "repeatX":
            break;
          case "repeatY":
            break;
          case "color":
            if (managerConfig.polygonColor) {
              item.value = managerConfig.polygonColor;
            }
            break;
          case "opacity":
            break;
          case "elevationMode":
            break;
          case "offsetHeight":
            break;
          case "flashAlpha":
            break;
          case "alphaSpace":
            break;
          case "flashTime":
            break;
          default:
            break;
        }
      });
    },
    setPolygonCubeConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "extrudedHeight":
            break;
          case "offsetHeight":
            break;
          case "color":
            if (managerConfig.polygonColor) {
              item.value = managerConfig.polygonColor;
            }
            break;
          case "opacity":
            break;
          default:
            break;
        }
      });
    },
    setPolylineConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "materialType":
            break;
          case "width":
            if (managerConfig.lineWidth) {
              item.value = managerConfig.lineWidth;
            }
            break;
          case "color":
            if (managerConfig.polygonColor) {
              item.value = managerConfig.polygonColor;
            }
            break;
          case "opacity":
            break;
          case "isHermiteSpline":
            break;
          case "loop":
            break;
          case "elevationMode":
            break;
          default:
            break;
        }
      });
    },
    setPolylineVolumeConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "cornerType":
            break;
          case "width":
            // if (managerConfig.lineWidth) {
            //   item.value = managerConfig.lineWidth;
            // }
            break;
          case "color":
            if (managerConfig.polygonColor) {
              item.value = managerConfig.polygonColor;
            }
            break;
          case "opacity":
            break;
          default:
            break;
        }
      });
    },
    setRectangleConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "rectangleText":
            break;
          case "materialType":
            break;
          case "image":
            break;
          case "repeatX":
            break;
          case "repeatY":
            break;
          case "stRotation":
            break;
          case "color":
            if (managerConfig.polygonColor) {
              item.value = managerConfig.polygonColor;
            }
            break;
          case "opacity":
            break;
          case "elevationMode":
            break;
          case "offsetHeight":
            break;
          case "rtFontFamily":
            if (managerConfig.fontFamily) {
              item.value = managerConfig.fontFamily;
            }
            break;
          case "rtFontSize":
            if (managerConfig.fontSize) {
              item.value = managerConfig.fontSize;
            }
            break;
          case "rtBackgroundColor":
            break;
          case "rtBackgroundOpacity":
            break;
          default:
            break;
        }
      });
    },
    setSquareConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "extrudedHeight":
            break;
          case "offsetHeight":
            break;
          case "color":
            if (managerConfig.polygonColor) {
              item.value = managerConfig.polygonColor;
            }
            break;
          case "opacity":
            break;
          default:
            break;
        }
      });
    },
    setWallConfig(config, managerConfig) {
      config.forEach(item => {
        switch (item.key) {
          case "title":
            break;
          case "materialType":
            break;
          case "offsetHeight":
            break;
          case "linkColor":
            if (managerConfig.lineColor) {
              item.value = managerConfig.lineColor;
            }
            break;
          case "materialColor":
            if (managerConfig.polygonColor) {
              item.value = managerConfig.polygonColor;
            }
            break;
          case "materialOpacity":
            break;
          case "image":
            break;
          case "duration":
            break;
          case "direction":
            break;
          case "extrudedHeight":
            break;
          case "loop":
            break;
          default:
            break;
        }
      });
    }
  }
};
