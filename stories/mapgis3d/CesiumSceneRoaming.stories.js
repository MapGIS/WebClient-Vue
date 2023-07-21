import "../style/card.css";
import Markdown from "../../cesium/docs/api/sceneeffect/sceneroaming.md";

export default {
  title: "三维/场景控制/相机",
  argTypes: {
    speed: {
      description:
        "漫游速度 默认1m/s(1米/秒) 特别提醒（漫游场景范围很大的时候，这个一定要设置大，比如飞机可能就是真实的几千米每秒 如果不按真实设置，会导致内部时间点插值过密，造成卡顿）。",
      table: {
        defaultValue: {
          summary: "10",
        },
      },
      control: "number",
    },
    exHeight: {
      description: "附加高程",
      table: {
        defaultValue: {
          summary: "1",
        },
      },
      control: "number",
    },
    heading: {
      description: "航向角 （单位弧度）",
      table: {
        defaultValue: {
          summary: "90",
        },
      },
      control: "number",
    },
    pitch: {
      description: "俯仰角 （单位弧度）",
      table: {
        defaultValue: {
          summary: "0",
        },
      },
      control: "number",
    },
    range: {
      description: "视角高度",
      table: {
        defaultValue: {
          summary: "0",
        },
      },
      control: "number",
    },
    animationType: {
      description:
        "动画漫游的类型:1跟随,2锁定第一视角,3上帝视角。场景漫游三个视角解释：跟随：相机视角不与漫游模型同时移动，可交互，方位角，俯仰角，距离不可设置，因为这三个参数的值的改变对场景没有影响；锁定第一视角：模拟本人漫游，可设置方位角，俯仰角，距离；上帝视角：从上空俯视漫游，俯仰角默认为-90，方位角默认为 90，方位角和距离可设置。",
      table: {
        defaultValue: {
          summary: "1",
        },
      },
      control: {
        type: "select",
        options: ["1", "2", "3"],
      },
    },
    interpolationAlgorithm: {
      description:
        "插值算法 默认LagrangePolynomialApproximation拉格朗日 还有线性插值LinearApproximation 埃尔米特插值插值HermitePolynomialApproximation",
      table: {
        defaultValue: {
          summary: "LagrangePolynomialApproximation",
        },
      },
      control: {
        type: "select",
        options: [
          "LagrangePolynomialApproximation",
          "LinearApproximation",
          "HermitePolynomialApproximation",
        ],
      },
    },
    isLoop: {
      description: "是否循环",
      table: {
        defaultValue: {
          summary: "true",
        },
      },
      control: "boolean",
    },
    showPath: {
      description: "是否显示路径",
      table: {
        defaultValue: {
          summary: "true",
        },
      },
      control: "boolean",
    },
    showInfo: {
      description: "是否显示提示信息",
      table: {
        defaultValue: {
          summary: "true",
        },
      },
      control: "boolean",
    },
    models: {
      description: "模型",
      table: {
        defaultValue: {
          summary: "./CesiumModels/Cesium_Man.glb",
        },
      },
      control: {
        type: "select",
        options: [
          "./CesiumModels/Cesium_Man.glb",
          "./CesiumModels/CesiumMilkTruck.glb",
          "./CesiumModels/Cesium_Air.gltf",
        ],
      },
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      autoReset: true,
      maximumScreenSpaceError: 8,
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "2ddaabf906d4b5418aed0078e1657029",
      },
    };
  },
  template: `
      <mapgis-web-scene style="height: 95vh">
      <mapgis-3d-ogc-wmts-layer
          :baseUrl="url"
          :wmtsLayer="layer"
          :tileMatrixSet="tileMatrixSet"
          :format="format"
          :tilingScheme="tilingScheme"
          :token="token"
      ></mapgis-3d-ogc-wmts-layer>
      <mapgis-3d-scene-layer :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="$props.m3dUrl" />
      <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-scene-roaming 
        :speed="$props.speed"
        :exHeight="$props.exHeight"
        :heading="$props.heading"
        :pitch="$props.pitch"
        :range="$props.range"
        :animationType="$props.animationType"
        :interpolationAlgorithm="$props.interpolationAlgorithm"
        :isLoop="$props.isLoop"
        :showPath="$props.showPath"
        :showInfo="$props.showInfo"
        :models="$props.models"/>
      </mapgis-ui-card>
      </mapgis-web-scene>
    `,
});

export const 漫游路径管理 = Template.bind({});
漫游路径管理.args = {
  m3dUrl: `http://${webclient.igsIp}:${webclient.igsPort}/igs/rest/g3d/Scene:ZondyModels`,
  speed: 10,
  exHeight: 1,
  heading: 90,
  pitch: 0,
  rang: 0,
  animationType: 1,
  interpolationAlgorithm: "LagrangePolynomialApproximation",
  isLoop: true,
  showPath: true,
  showInfo: true,
  models: [
    {
      label: "人",
      value: `http://${webclient.ip}:${webclient.port}/CesiumModels/Cesium_Man.glb`,
    },
    {
      label: "卡车",
      value: `http://${webclient.ip}:${webclient.port}/CesiumModels/CesiumMilkTruck.glb`,
    },
    {
      label: "飞机",
      value: `http://${webclient.ip}:${webclient.port}/CesiumModels/Cesium_Air.gltf`,
    },
  ],
};

漫游路径管理.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
