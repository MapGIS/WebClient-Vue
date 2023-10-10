import { G3D } from "@mapgis/webclient-es6-service";
import { M3dType_0_0 } from "./M3dType";

const { G3DLayerType, M3DTileDataInfo } = G3D;

export function loopM3ds(m3ds, callback) {
  const vm = this;
  let dataCallback = cbtype => {
    if (loop) {
      window.clearInterval(loop);
      loop = undefined;
      let types = [];
      m3ds.forEach(m3d => {
        let type = checkType(m3d);
        m3d.type = type || cbtype;
        types.push(m3d.type);
      });
      if (callback) {
        callback(types);
      }
    }
  };

  let loop = window.setInterval(() => {
    m3ds.forEach(m3d => {
      checkType(m3d, dataCallback);
    });
  }, 100);
}

export function checkType(tileset, callback) {
  const vm = this;
  let m3dType = M3DTileDataInfo.UnKnow;
  const { root } = tileset;
  if (!root) return m3dType;
  const version = root.tileset._version;
  let { children } = root;
  if (version == "0.0" || version == "1.0") {
    // m3d 0.x  1.x版本逻辑判断 type =0是模型 =1是示例化数据 =2是点云
    if (!children || children.length <= 0) return m3dType;
    children.forEach(child => {
      let tempType = checkTypeNode(child, version, callback);
      m3dType = tempType || m3dType;
    });
  } else if (version == "2.0") {
    if (!children || children.length <= 0) return m3dType;
    children.forEach(child => {
      let tempType = checkTypeNode(child, version, callback);
      m3dType = tempType ? tempType : m3dType;
    });
  }

  return m3dType;
}

export function checkTypeNode(tileset, version, callback) {
  let m3dType;
  const vm = this;
  if (!tileset) return m3dType;
  if (tileset._content) {
    let type = tileset._content._dataType;
    if (type >= 0) {
      if (version == "0.0" || version == "1.0") {
        switch (type) {
          case M3dType_0_0.Model:
            m3dType = M3DTileDataInfo.Model;
            break;
          case M3dType_0_0.Instance:
            m3dType = M3DTileDataInfo.Vector;
            break;
          case M3dType_0_0.CloudPoint:
            m3dType = M3DTileDataInfo.PointCloud;
            break;
        }
      } else if (version == "2.0") {
        switch (type) {
          case M3DTileDataInfo.Model:
          case `${M3DTileDataInfo.Model}`:
            m3dType = M3DTileDataInfo.Model;
            break;
          case M3DTileDataInfo.Instance:
          case `${M3DTileDataInfo.Instance}`:
            m3dType = M3DTileDataInfo.Vector;
            break;
          case M3DTileDataInfo.PointCloud:
          case `${M3DTileDataInfo.PointCloud}`:
            m3dType = M3DTileDataInfo.PointCloud;
            break;
        }
      }
      if (callback) {
        callback(m3dType);
      }
      return m3dType;
    }
  }

  return m3dType;
}

export function checkTypeIcon(type) {
  let icon = "";
  switch (type) {
    case M3DTileDataInfo.UnKnow:
      icon = "mapgis-info";
      break;
    case M3DTileDataInfo.Model:
      icon = "mapgis-sanweiditu";
      break;
    case M3DTileDataInfo.Vector:
      icon = "mapgis-vector";
      break;
    case M3DTileDataInfo.PointCloud:
      icon = "mapgis-cloud";
      break;
    case G3DLayerType.g3dTerrainLayer:
      icon = "mapgis-terrain";
      break;
  }
  return icon;
}
