import MarkDown from "../../../ui/docs/api/comprehensiveQuery/comprehensiveQuery.md";
export default {
  title: "界面/业务组件/综合查询",
  argTypes: {
    logo: {
      description: "左侧logo",
    },
    districtName: {
      description: "左侧名称",
    },
    defaultMarkerIcon: {
      description: "默认标注图标",
    },
    selectedMarkerIcon: {
      description: "选中标注图标",
    },
    geoJSONExtent: {
      description: "查询范围的geojson",
    },
    widgetInfo: {
      description: "查询配置信息",
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {};
  },
  template: `
      <mapgis-ui-comprehensive-query 
        v-bind="$props"       
        @onClose="onClose"
        @onSearch="onSearch"
        @current-result="currentResult"
        @select-markers="selectMarkers"
        @click-item="clickItem"
        @change-cluster="changeCluster"
        @open-attribute-table="openAttributeTable"
        @remove-attribute-table="removeAttributeTable"
      />
    `,
  methods: {
    onClose() {},
    onSearch() {},
    /**
     * 当前展示的结果回调函数（将查询结果展示至地图上）
     */
    currentResult(geojson) {
      console.log(geojson);
    },
    /**
     * 当前点击的条目的回调函数（实现点击后跳转中心点）
     */
    clickItem(feature) {
      console.log(feature);
    },
    /**
     * 当前选中的坐标
     */
    selectMarkers(selectMarkers) {
      console.log(selectMarkers);
    },
    /**
     * 聚合按钮改变时的回调
     */
    changeCluster(val) {
      console.log(val);
    },
    /**
     * 打开属性表回调函数
     */
    openAttributeTable(exhibition) {
      console.log(exhibition);
    },
    /**
     * 关闭属性表回调函数
     */
    removeAttributeTable(exhibitionId) {
      console.log(exhibitionId);
    },
  },
});

export const 综合查询 = Template.bind({});
综合查询.args = {
  logo: "static/media/stories/assets/direction.svg",
  districtName: "湖北省",
  defaultMarkerIcon:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAbCAYAAAB836/YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjI0QjQwQjAyNEQ0MTFFN0JBNTlDNkY3RkIwMTA0NjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjI0QjQwQjEyNEQ0MTFFN0JBNTlDNkY3RkIwMTA0NjQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MjQ0MUEyNzI0RDQxMUU3QkE1OUM2RjdGQjAxMDQ2NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MjQ0MUEyODI0RDQxMUU3QkE1OUM2RjdGQjAxMDQ2NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoX+N+MAAAG1SURBVHjapJQ5SANREIb/hEVBi0BKjyJgOomVVkpE1EZMKkW0tLaJvYVNFKw8SGVn5YGIUYyCR2cKI6KNpQoWJqVEUDTOkFl92bzNbjY//LBv3sy37/aVSiV0L0KnUfIkeYjcKbEX8jl5m3xqLXhYAPwaUBf5gpwhz5JDZEMcklhGcsLWYiuwn5wlD8JZnHMtNVog/y1NDsK9glIT1gE3yQHUr4DUVgB5+APwLq6NQhYasptVaqbe+REgFim3D+6AlTPg61sLZcaVCYzqMhLDwHTvf3umD6BThqWMFhhVp9yuy4j3VMfGI7bT7lCBrWhcLSrwTZexc1Md283ZAvPqptyS26wZq3QXmozypvzQ2qXvgfVLW2BOBfLhHLNm8G4mT8p2oSN1ylvmkD0qL4w/4DufkgaACWFUXD3+Q8oDLGWOTvfazJEP64AdS43t88WXakqeMCdxzoTU2AJZRb4Q5OcasCfJKTo9sOquxcifmj6Oxe1Ohb/GKOhtQVITT0of6gWylskFpV2QGLwCP8gbSntNYp6BrD3le98p2XABpCcBr8p3w0DWI9nnJtEtMOtyefArwABPOFufcniU/gAAAABJRU5ErkJggg==",
  selectedMarkerIcon:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAbCAYAAAB836/YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjI0NDFBMjUyNEQ0MTFFN0JBNTlDNkY3RkIwMTA0NjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjI0NDFBMjYyNEQ0MTFFN0JBNTlDNkY3RkIwMTA0NjQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MjQ0MUEyMzI0RDQxMUU3QkE1OUM2RjdGQjAxMDQ2NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2MjQ0MUEyNDI0RDQxMUU3QkE1OUM2RjdGQjAxMDQ2NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pldf8IIAAAHiSURBVHjaYvz//z8DIyMjAzr46mzmBqTCgNgJiGWhwo+BeB8Qr+Lee2oXSC86YEQX/OZirgKkZgOxAwN+cACI07j2nLyN00CgYTZAaiMQCzEQB94BsT/Q0CMYBgINUwVSp4GYn4E08BGITWEuZUKSmEuGYQxQPXNRXAh0HSi89jNQBhyArjwIc2EYViVsbAxsOSUMnJv2gTFbTjEDAwsrLgPBZrBAOfZYzUvNYWAJCIXzWQKAev79Z/g1rQ+bcnvkMJTGpoLZ3QdTzNUTlwtlkA3kZqAccCEb+Aqbij9b1mOKbd2Ay8DXyGF4Hoil0FX8njeDgZGVFehNLwYGYGr4u2c7w+8Fs3AZeA452WQA2dMp9HImMNnMgHl5CczJZILXUDMgYQg0+QuQKqLAwCKoGRiFwzSQ00k0bDrQsCwYhwlNMheIN5Ng2DaoHrzlIRe0EDUnYNhJUOELdN03vAZCDRUFUmeAWA6HYQ+hRdZrgiU2kqH6QOoUKEujSf0CYjOgYRex6WPCmY8gGtqxSLXjMgyvgVDQCcRvkPhvoGIMZBkIdMl3IDUVSWgyVIyBXBeCwFok9npCinFGCloEPYW6WJqQWnBpo9OEXxEwqm+CLCek7kodovhiICIRExM8DAABBgBD8KOM5w279wAAAABJRU5ErkJggg==",
  geoJSONExtent: {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [110.48538949, 28.40888988],
          [112.29962518, 28.40888988],
          [112.29962518, 30.12955383],
          [110.48538949, 30.12955383],
          [110.48538949, 28.40888988],
        ],
      ],
    },
  },
  widgetInfo: {
    dataStore: {
      ip: "192.168.80.105",
      port: "9091",
      libsName: "",
      showType: "normal",
      clusterMaxCount: "10000",
      allShows: "formatAddress:详细地址,name:名称,lat:纬度,lon:经度",
      queryTable: [
        {
          mLibsName: "wuhan_poi",
          dataType: "政府机构",
          placeName: "武汉市",
          color: "#FFE5B4",
          titleAttr: "name",
          attrs: [
            "formatAddress",
            "province",
            "city",
            "country",
            "town",
            "street",
            "streetNo",
            "code",
            "marker",
            "interestpoint",
            "identifier",
            "name",
            "attrList",
            "RESIDENT",
            "LON",
            "DOORPN",
            "hotGroup",
            "ADDNAME",
            "COUNTRY",
            "BUILDING",
            "CLASID",
            "CITYCODENE",
            "DATASOURCE",
            "LAT",
            "lat",
            "lon",
          ],
          showAttrsAndTitle: [
            {
              attr: "formatAddress",
              showName: "详细地址",
            },
            {
              attr: "name",
              showName: "名称",
            },
            {
              attr: "lat",
              showName: "纬度",
            },
            {
              attr: "lon",
              showName: "经度",
            },
          ],
          allUse: true,
        },
      ],
    },
  },
};

综合查询.parameters = {
  docs: {
    description: {
      component: MarkDown,
    },
  },
};
