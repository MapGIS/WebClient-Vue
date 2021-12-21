import Markdown from "../../cesium/docs/api/layer/Graphic/GraphicLayers.md";

export default {
  title: "三维/图层/标绘图层(多个)",
  argTypes: {
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  template: `<mapgis-web-scene style="height:95vh">
      <mapgis-3d-graphic-layers :dataSource="dataSource"/>
  </mapgis-web-scene>`,
});

export const 标绘图层 = Template.bind({});
标绘图层.args = {
  dataSource: [{
    name: "测试111",
    uuid: "11111",
    dataSource: [{
      "type": "label",
      "id": "7ebf579f-4ebb-4f87-b0b5-f09adfbdb1b3",
      "positions": [
        4571616.589975021,
        2523848.4287585495,
        3641257.038068353
      ],
      title: "文本测试",
      "style": {
        "text": "无标题",
        "font": "30px sans-serif",
        "style": 2,
        "fillColor": {
          "red": 0,
          "green": 0,
          "blue": 0,
          "alpha": 1
        },
        "outlineColor": {
          "red": 0,
          "green": 0,
          "blue": 0,
          "alpha": 1
        },
        "outlineWidth": 1,
        "showBackground": false,
        "backgroundColor": {
          "red": 0.165,
          "green": 0.165,
          "blue": 0.165,
          "alpha": 0.8
        },
        "backgroundPadding": {
          "x": 7,
          "y": 5
        },
        "pixelOffset": {
          "x": 0,
          "y": 0
        },
        "eyeOffset": {
          "x": 0,
          "y": 0,
          "z": 0
        },
        "horizontalOrigin": 1,
        "verticalOrigin": 2,
        "scale": 1,
        "heightReference": 0,
        "_options": {
          "text": "无标题",
          "font": "30px sans-serif",
          "style": 2,
          "fillColor": {
            "red": 0,
            "green": 0,
            "blue": 0,
            "alpha": 1
          },
          "outlineColor": {
            "red": 0,
            "green": 0,
            "blue": 0,
            "alpha": 1
          },
          "outlineWidth": 1,
          "showBackground": false,
          "backgroundColor": {
            "red": 0.165,
            "green": 0.165,
            "blue": 0.165,
            "alpha": 0.8
          },
          "backgroundPadding": {
            "x": 7,
            "y": 5
          },
          "pixelOffset": {
            "x": 0,
            "y": 0
          },
          "eyeOffset": {
            "x": 0,
            "y": 0,
            "z": 0
          },
          "horizontalOrigin": 1,
          "verticalOrigin": 2,
          "scale": 1,
          "heightReference": 0,
          "_options": {
            "text": "无标题",
            "font": "30px sans-serif",
            "style": 2,
            "fillColor": {
              "red": 0,
              "green": 0,
              "blue": 0,
              "alpha": 1
            }
          },
          "_type": "label"
        },
        "_type": "label"
      },
      "editPointStyle": {
        "pointOutlineColor": [
          1,
          0.9607843137254902,
          0.9333333333333333,
          0.9
        ],
        "color": [
          1,
          0,
          0,
          1
        ],
        "centerPointColor": [
          0.41568627450980394,
          0.35294117647058826,
          0.803921568627451,
          0.99
        ],
        "pixelSize": 15,
        "_options": {
          "pointOutlineColor": {
            "red": 1,
            "green": 0.9607843137254902,
            "blue": 0.9333333333333333,
            "alpha": 0.9
          },
          "color": {
            "red": 1,
            "green": 0,
            "blue": 0,
            "alpha": 1
          },
          "centerPointColor": {
            "red": 0.41568627450980394,
            "green": 0.35294117647058826,
            "blue": 0.803921568627451,
            "alpha": 0.99
          },
          "pixelSize": 15,
          "_options": {},
          "_type": "editStyle"
        },
        "_type": "editStyle"
      },
      "attributes": {},
      "show": true,
      "editing": false,
      "allowPicking": true,
      "asynchronous": false
    }]
  },{
    name: "测试222",
    uuid: "22222",
    dataSource: [{
      type: "label",
      id: "111",
      positions: [],
      style: {
        text: "无标题",
        font: "30px sans-serif"
      },
      editPointStyle: {},
      attributes: {},
      name: "测试222",
      show: true,
      editing: true,
      allowPicking: true,
      modelMatrix: {},
      asynchronous: true
    }]
  }]
};

标绘图层.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
