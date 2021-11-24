<template>
  <div class="div_inline">
    <mapgis-ui-input-group compact style="display: flex">
      <mapgis-ui-select default-value="lonlat" style="width: 155px;padding-right:5px " @change="handleChange">
        <mapgis-ui-select-opt-group label="定位点">
          <mapgis-ui-select-option value="lonlat">
            经纬度
          </mapgis-ui-select-option>
          <mapgis-ui-select-option value="WebMecro">
            Web墨卡托
          </mapgis-ui-select-option>
        </mapgis-ui-select-opt-group>
        <mapgis-ui-select-opt-group label="图幅号">
          <mapgis-ui-select-option value="NewMapNum">
            GB/T 13989-92
          </mapgis-ui-select-option>
<!--          <mapgis-ui-select-option value="OldMapNum">-->
<!--            旧图幅号-->
<!--          </mapgis-ui-select-option>-->
        </mapgis-ui-select-opt-group>
      </mapgis-ui-select>
      <mapgis-ui-input style="width: 55%;padding-right:5px"
                       :placeholder="inputDefaultVal"
                       allow-clear
                       id="inputVal"/>
    </mapgis-ui-input-group>
    <mapgis-ui-button
        shape="circle"
        type="primary"
        @click="locateToMap"
        size="small"
    >
      <mapgis-ui-iconfont
          type="mapgis-target-lock"
          theme="filled"
          :style="{ fontSize: '16px'}"
      />
    </mapgis-ui-button>
    <mapgis-3d-dynamic-marker-layer :data="locateFeature"
                                    :fitBound="fitBound"
                                    :layerStyle="layerStyle"
                                    :highlightStyle="highlightStyle"
                                    v-if="locateMarker">
      <mapgis-ui-card slot="popup" slot-scope="{ marker }">
        {{ marker.fid }}
      </mapgis-ui-card>
    </mapgis-3d-dynamic-marker-layer>
  </div>
</template>

<script>
import {Style} from "@mapgis/webclient-es6-service";

const {MarkerStyle, PointStyle, FillStyle} = Style;
const DefaultActiveImagePlotting =
    "data:image/png;base64,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";
const DefaultInactiveImagePlotting =
    "data:image/png;base64,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";

// const DefaultInactiveImagePlotting = "data:image/png;base64,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"

export default {
  name: "mapgis-3d-locate",
  inject: ["Cesium", "viewer"],
  props:{
    mapSheetBoundaryStyle:{
      type: Object,
      default: () => {
        return {
          color: "#FFA500",
          opacity: 0.5
        };
      }
    }
  },
  data() {
    return {
      dataSource:[],
      inputDefaultVal: 'X°,Y°',
      NewMapNum: undefined,
      locateMarker: false,
      locateFeature: {
        type: "FeatureCollection",
        features: []
      },
      layerStyle: new MarkerStyle({
        symbol: DefaultInactiveImagePlotting,
      }),
      marker: new MarkerStyle({
        symbol: DefaultActiveImagePlotting,
      }),
      fitBound: undefined,
      highlightStyle: {
        enableHoverMarker: false,
        enableHoverFeature: true,
        polygon: new FillStyle({
          color: "#ff0000",
          opacity: 0.8,
          outlineColor: "#000000",
        }),
        marker: new MarkerStyle({
          symbol: DefaultActiveImagePlotting,
        }),
      },
    }
  },
  watch: {
    mapNumber: {
      handler: function (newVAal, oldVal) {
        this.resultCoorFromMapNumber();
      }
    }
  },
  methods: {
    handleChange(e) {
      document.getElementById("inputVal").value = undefined;
      this.dataSource = [];
      switch (e) {
        case 'lonlat':
          this.inputDefaultVal = 'X°,Y°';
          break;
        case 'WebMecro':
          this.inputDefaultVal = 'X,Y';
          break;
        case 'NewMapNum':
          this.inputDefaultVal = 'NewMapNum';
          break;
        case 'OldMapNum':
          this.inputDefaultVal = 'OldMapNum';
          break;
      }
    },
    locateValue(value){
      this.dataSource = value
    },
    locateToMap() {
      // this.locateMarker = false;
      let inputValue = document.getElementById("inputVal").value;
      switch (this.inputDefaultVal) {
        case 'NewMapNum':
          this.resultCoorFromMapNumber(inputValue);
          break;
        case "X°,Y°":
          this.lonlatToPoint(inputValue);
          break;
        case "X,Y":
          this.degreesFromWebMercatorProjection(inputValue);
      }
    },
    viewerflyToLonLat(lon, lat, heading = 0.0, pitch = -90, range = 0.0,) {
      let {viewer, Cesium} = this;
      let inputValue = document.getElementById("inputVal").value;
      this.locateFeature.features = [];
      let Point = {
        type: "Feature",
            properties: { fid: "[" + lon+ "," +  lat + "]" },
        geometry: {
          type: "Point",
              coordinates: [lon, lat],
        },
      }
      this.locateFeature.features.push(Point);
      this.locateMarker = true;
      //先清空entity
      viewer. entities.removeAll();
      let entity = new Cesium.Entity({
        id: inputValue,
        position: Cesium.Cartesian3.fromDegrees(lon, lat,viewer.camera.positionCartographic.height),
        point: {
          pixelSize: 10,
          color: Cesium.Color.WHITE.withAlpha(0),
          outlineColor: Cesium.Color.WHITE.withAlpha(0),
          outlineWidth: 1
        }
      });
      viewer.entities.add(entity);
      viewer.flyTo(entity, {
        maximumHeight: 1000,
        offset: {
          heading: Cesium.Math.toRadians(heading),
          pitch: Cesium.Math.toRadians(pitch),
          range: range
        }
      });
    },
    /**
     * 定位到一个矩形范围
     * @param rect 坐标数组
     * @param heading
     * @param pitch
     * @param range
     * @param duration
     */
    flyToRectangle(rect, heading = 0.0, pitch = -90, range = 0.0, duration = 3) {
      let {viewer} = this;
      const vm = this;
      //先清空entity
      viewer. entities.removeAll();
      const westernmostLon = Math.round(Number((rect[0][0]))*100)/100;
      const southernmostLat = Math.round(Number((rect[0][1]))*100)/100;
      const easternmostLon = Math.round(Number((rect[2][0]))*100)/100;
      const northernmostLat = Math.round(Number((rect[2][1]))*100)/100;

      let rectRound = [rect[0],rect[1],rect[2],rect[3],rect[0]];
      // let rectangleCoor = Cesium.Rectangle.fromDegrees(westernmostLon, southernmostLat, easternmostLon, northernmostLat);
      let Polygon = {
        type: "Feature",
        properties: {fid: "图幅边界: {XMin: " + westernmostLon +"°, YMin: " + southernmostLat +"°, XMax: " +easternmostLon +"°, YMax: " + northernmostLat + "°}"},
        geometry: {
          type: "Polygon",
          coordinates: [
            rectRound
          ],
        },
      }
      this.locateFeature.features.push(Polygon);
      this.locateMarker = true;
      this.fitBound = {xmin: westernmostLon, ymin: southernmostLat, xmax: easternmostLon, ymax: northernmostLat};
      this.highlightStyle.polygon = new FillStyle(this.mapSheetBoundaryStyle);
      vm.$emit("located",rectRound);
    },
    lonlatToPoint(inputValue) {
      let lon = inputValue.split(',')[0];
      let lat = inputValue.split(',')[1];
      if (inputValue.indexOf("°")) {
        lon = Number(lon.split('°')[0]);
        lat = Number(lat.split('°')[0]);
      }
      // 经纬度转笛卡尔
      let temp = Cesium.Cartographic.toCartesian(Cesium.Cartographic.fromDegrees(lon, lat));
      // let temp = Cesium.Cartesian3.fromDegrees(lon, lat);
      // let temp = Cesium.Cartesian3.fromDegrees(lon, lat, 0);
      // this.flyToPoint(temp);
      this.locateMarker = false;
      this.viewerflyToLonLat(lon, lat);
    },
    //根据新图幅号计算坐标
    resultCoorFromMapNumber(NewMapNum) {
      // let {Cesium} = this;
      let H = 0, L = 0, h = 0, l = 0;
      let delX, delY;
      if (NewMapNum.length == 3) {
        // 只有1:100万图幅号
        delX = 6;
        delY = 4;
        //100w比例尺的情况下，没有后边六位的行列号，直接认为h和l是0即可
      } else {
        // 求行列号
        h = Number(NewMapNum.slice(4, 7));
        l = Number(NewMapNum.slice(7, 10));

        // 判断图幅号第三位的其他比例尺字符编码 B->K  单位：度°
        switch (NewMapNum[3]) {
          case 'B':                       //50w
            delX = 3;
            delY = 2;
            break;
          case 'C':                       //25w
            delX = 1.5;
            delY = 1;
            break;
          case 'D':                       //10w
            delX = 0.5;
            delY = 1.0 / 3;
            break;
          case 'E':                       //5w
            delX = 0.25;
            delY = 1.0 / 6;
            break;
          case 'F':                       //2.5w
            delX = 0.125;
            delY = 1.0 / 12;
            break;
          case 'G':                       //1w
            delX = 0.0625;
            delY = 1.0 / 24;
            break;
          case 'H':                       //5000
            delX = 0.0625 / 2;
            delY = 1.0 / 24 / 2;
            break;
        }
      }

      H = NewMapNum[0].charCodeAt() - 64;
      L = Number(NewMapNum.slice(1, 3));

      //计算左下角坐标
      //经度：
      let x = (L - 31) * 6 + (l - 1) * delX;
      //纬度：
      let y = (H - 1) * 4 + (4 / delY - h) * delY;
      let degreeArr = [];
      let leftDown = [x, y];
      degreeArr.push(leftDown);
      //计算右下角坐标
      let rightDown = [x + delX, y];
      degreeArr.push(rightDown);

      let rightUp = [x + delX, y + delY];
      degreeArr.push(rightUp);

      let leftUp = [x, y + delY];
      degreeArr.push(leftUp);

      this.flyToRectangle(degreeArr);
    },

    // Web墨卡托转经纬度
    degreesFromWebMercatorProjection(inputValue) {
      let webLon = inputValue.split(',')[0];
      let webLat = inputValue.split(',')[1];
      let cartesian = new Cesium.Cartesian3(webLon, webLat, 0);
      var webMercatorProjection = new Cesium.WebMercatorProjection();
      let lonlat = this.degreesFromCartographic(webMercatorProjection.unproject(cartesian));
      this.viewerflyToLonLat(lonlat.longitude, lonlat.latitude);
    },
    // 弧度转经纬度
    degreesFromCartographic(cartographic) {
      console.log("cartographic",cartographic);
      cartographic.longitude = this.toDegrees(cartographic.longitude);
      cartographic.latitude = this.toDegrees(cartographic.latitude);
      return cartographic;
    },
    toDegrees(value) {
      return Cesium.Math.toDegrees(value)
    }
  }
}

</script>

<style scoped>
.div_inline {
  display: flex;
  align-items: center;
}

</style>