import { saveAs } from "file-saver";
var html2canvas = require("html2canvas");
import domtoimage from "./dom-to-image";
import mapboxgl from "@mapgis/mapbox-gl";

var extent = {}; //地图范围
var scale; //比例尺
var extent_km = 111.319490793274; //在经线上，相差一纬度约111km
var extent_km_lat; //在纬线上，相差一经度约111cosα（α该纬线纬度），1KM就是该纬线应约1/(111*cosα)=0.009cosα度，度数纬度关，这样就是1公里对应的纬线度数。

/**
 * 将获取的图片路径转成blob
 * @param dataURI
 * @returns {*}
 * @private
 */
function _dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  var ab = new ArrayBuffer(byteString.length);
  var dw = new DataView(ab);
  for (var i = 0; i < byteString.length; i++) {
    dw.setUint8(i, byteString.charCodeAt(i));
  }
  return new Blob([ab], {
    type: mimeString
  });
}

/**
 * 获取建议的比例尺，比例尺也可以自己设置
 */
function getRecommendScale() {
  var x_min = extent.xmin;
  var y_min = extent.ymin;
  var x_max = extent.xmax;
  var y_max = extent.ymax;
  var map_width = (x_max - x_min) * extent_km * 1000 * 1000; //宽度  从 度单位 换算成 毫米单位
  var map_height = (y_max - y_min) * extent_km * 1000 * 1000; //高度  从 度单位 换算成 毫米单位
  var paper_width = 297; //纸张宽度,默认为横版A4大小 毫米
  var paper_height = 210; //纸张高度,默认为横版A4大小 毫米
  var r_scale =
    map_width / paper_width > map_height / paper_height
      ? Math.ceil(map_width / paper_width)
      : Math.ceil(map_height / paper_height);
  var log10 = r_scale.toString().length - 1;
  var pow10 = Math.pow(10, log10);
  scale = Math.ceil(r_scale / pow10) * pow10; //直接使用推荐的比例尺
  console.log(r_scale, log10, pow10, scale); //66400 4 10000 70000
}

/**
 * 获取输出版面坐标范围，默认以横版A4大小输出
 * @returns {{}}
 */
function layoutSetting() {
  var x_min = extent.xmin;
  var y_min = extent.ymin;
  var x_max = extent.xmax;
  var y_max = extent.ymax;
  //地图实际宽度
  var map_width = (x_max - x_min) * extent_km * 1000 * 1000;
  //地图实际高度
  var map_height = (y_max - y_min) * extent_km * 1000 * 1000;
  //纸张宽度,默认为横版A4大小
  var paper_width = 297;
  //纸张高度,默认为横版A4大小
  var paper_height = 210;
  //根据比例尺调整后的地图宽度(mm)
  var scale_map_width = Math.round(map_width / scale);
  //根据比例尺调整后的地图高度(mm)
  var scale_map_height = Math.round(map_height / scale);

  //纸张与地图的宽度差值
  var differ_width_val = (paper_width - scale_map_width) / 2;
  //纸张与地图的高度差值
  var differ_height_val = (paper_height - scale_map_height) / 2;

  var differ_x_extent = (differ_width_val * scale) / 1000 / 1000 / extent_km; //毫米 换算成 度
  var differ_y_extent = (differ_height_val * scale) / 1000 / 1000 / extent_km; //毫米 换算成 度
  //版面的左上角x坐标
  var layout_l_x = x_min - differ_x_extent;
  //版面的左上角y坐标
  var layout_l_y = y_max + differ_y_extent;
  //版面的右下角x坐标
  var layout_r_x = x_max + differ_x_extent;
  //版面的右下角y坐标
  var layout_r_y = y_min - differ_y_extent;

  //输出版面范围
  //            var bounds = [[layout_l_y, layout_l_x], [layout_r_y, layout_r_x]];
  //            var Rectangle = L.rectangle(bounds, {
  //                color: '#ffcc33',
  //                weight: 2,
  //                fillColor: 'rgba(255, 255, 255, 0)'
  //            });
  //            Rectangle.name = "layoutSetting";
  //            Rectangle.addTo(map);
  var layExtent = {};
  layExtent.xmin = layout_l_x < -180 ? -179.99 : layout_l_x;
  layExtent.ymin = layout_r_y < -90 ? -89.99 : layout_r_y;
  layExtent.xmax = layout_r_x > 180 ? 179.99 : layout_r_x;
  layExtent.ymax = layout_l_y > 90 ? 89.99 : layout_l_y;
  return layExtent;
}

export function printCanvas(map, callback, layoutinfo) {
  if (!map) return;
  var layout = map.getBounds();

  var xmin = layout._sw.lng;
  var ymin = layout._sw.lat;
  var xmax = layout._ne.lng;
  var ymax = layout._ne.lat;

  var width_extent_map = 9;
  var height_extent_map = 10;
  var width_extent_layer = 7;
  var height_extent_layer = 8;

  extent.xmin = xmin;
  extent.ymin = ymin;
  extent.xmax = xmax;
  extent.ymax = ymax;

  getRecommendScale();

  var a1 = map.project(new mapboxgl.LngLat(xmin, ymax));
  var a4 = map.project(new mapboxgl.LngLat(xmax, ymin));

  var mapBounds = map.getBounds();
  var lefttop = new mapboxgl.LngLat(mapBounds._sw.lng, mapBounds._ne.lat);
  var mapLeftTopPoint = map.project(lefttop);

  var startPointX = mapLeftTopPoint.x - a1.x - 7; //得到一个负数
  var startPointY = mapLeftTopPoint.y - a1.y - 7; //得到一个负数

  var mapParams = {};
  mapParams.width = parseInt(a4.x - mapLeftTopPoint.x + width_extent_map); //
  mapParams.height = parseInt(a4.y - mapLeftTopPoint.y + height_extent_map);
  mapParams.startPointX = startPointX; // ?
  mapParams.startPointY = startPointY; // ?

  var layExtent = layoutSetting(); //获取根据比例尺调整后的版面范围

  var b1 = map.project(new mapboxgl.LngLat(layExtent.xmin, layExtent.ymax)); //左上
  var b4 = map.project(new mapboxgl.LngLat(layExtent.xmax, layExtent.ymin)); //右下

  var laystartPointX = mapLeftTopPoint.x - b1.x - 9;
  var laystartPointY = mapLeftTopPoint.y - b1.y - 9;

  var layParams = {};
  layParams.width = parseInt(b4.x - mapLeftTopPoint.x + width_extent_layer); //输出地图版面宽
  layParams.height = parseInt(b4.y - mapLeftTopPoint.y + height_extent_layer); //输出地图版面高
  layParams.startPointX = laystartPointX; //输出地图版面的x像素坐标
  layParams.startPointY = laystartPointY; //输出地图版面的y像素坐标

  //以下参数都是在有layParams的前提下,位置已设置为固定
  var mapFrameStyleParams = {};
  mapFrameStyleParams.strokeStyle = "black"; //图像的边框线颜色
  mapFrameStyleParams.lineWidth = 2;

  let date = new Date().toISOString();
  layoutinfo = layoutinfo || {
    baseinfo: {
      title: "地图标题",
      author: "作者",
      date: date
    },
    scale: {
      domid: "mapgis-legend-rule"
    },
    legend: {
      domid: "mapgis-legend-standard"
    }
  };

  var mapFrameStyleParams = {};
  mapFrameStyleParams.strokeStyle = "black"; //图像的边框线颜色
  mapFrameStyleParams.lineWidth = 1.25;

  var titleParams = {};
  titleParams.font = "50px 微软雅黑";
  titleParams.fontWeight = "bold";
  titleParams.textAlign = "center";
  titleParams.textBaseline = "bottom";
  titleParams.text = layoutinfo.baseinfo.title;

  var leftTextParams = {};
  leftTextParams.font = "20px 微软雅黑";
  leftTextParams.textAlign = "right";
  leftTextParams.textBaseline = "top";
  leftTextParams.text = layoutinfo.baseinfo.author;

  var rightTextParams = {};
  rightTextParams.font = "20px 微软雅黑";
  rightTextParams.textAlign = "right";
  rightTextParams.textBaseline = "top";
  rightTextParams.text = layoutinfo.baseinfo.date;

  var scaleParams = {};
  scaleParams.x = layoutinfo.scale.x || 0;
  scaleParams.y = layoutinfo.scale.y || 0;
  scaleParams.scale = layoutinfo.scale;
  let scale = document.getElementById(
    layoutinfo.scale.domid || "mapgis-legend-rule"
  );

  var legendParams = {};
  legendParams.x = layoutinfo.legend.x || 0;
  legendParams.y = layoutinfo.legend.y || 0;
  legendParams.legend = layoutinfo.legend;
  let legend = document.getElementById(
    layoutinfo.legend.domid || "mapgis-legend-standard"
  );

  html2canvas(scale).then(function(scalecanvas) {
    scalecanvas.toBlob(function(scaleblob) {
      // saveAs(blob, "pretty image.png");
      scaleParams.url = window.URL.createObjectURL(scaleblob);
      let scaleimg = new Image();
      scaleimg.src = scaleParams.url;
      scaleimg.onload = function(e) {
        window.URL.revokeObjectURL(scaleimg.src);
        scaleParams.image = scaleimg;
        scaleParams.width = scaleimg.width || scaleimg.style.width;
        scaleParams.height = scaleimg.height || scaleimg.style.height;

        html2canvas(legend).then(function(legendcanvas) {
          legendcanvas.toBlob(function(legendblob) {
            // saveAs(blob, "pretty image.png");
            legendParams.url = window.URL.createObjectURL(legendblob);
            let legendimg = new Image();
            legendimg.src = legendParams.url;
            legendimg.onload = function(e) {
              window.URL.revokeObjectURL(legendimg.src);
              legendParams.image = legendimg;
              legendParams.width = legendimg.width || legendimg.style.width;
              legendParams.height = legendimg.height || legendimg.style.height;

              domtoimage
                .toPng(map.getCanvas(), {
                  width: mapParams.width, //输出地图内容的宽
                  height: mapParams.height, //输出地图内容的高
                  startPointX: mapParams.startPointX, //输出地图内容左上角x像素坐标
                  startPointY: mapParams.startPointY, //输出地图内容左上角y像素坐标
                  layParams: layParams, //输出版面参数
                  mapFrameStyleParams: mapFrameStyleParams, //图框参数
                  titleParams: titleParams, //标题参数
                  scaleParams: scaleParams, // 比例尺参数
                  legendParams: legendParams, // 图例参数
                  leftTextParams: leftTextParams, //左下角文字参数
                  rightTextParams: rightTextParams //右下角文字参数
                })
                .then(function(dataUrl) {
                  var blob = _dataURItoBlob(dataUrl);
                  saveAs(blob, `${titleParams.text}.png`);
                  callback && callback();
                })
                .catch(function(err) {
                  console.log(err);
                });
            };
          });
        });
      };
    });
  });

  setTimeout(function() {}, 500);
}

export default printCanvas;
