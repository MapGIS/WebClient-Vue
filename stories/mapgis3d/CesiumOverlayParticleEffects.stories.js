import "../style/card.css";
import fireImg from "../assets/fire.png";
import smokeImg from "../assets/smoke.png";
import Markdown from "../../cesium/docs/api/analysis/ParticleEffects.md";

export default {
  title: "三维/可视化/粒子特效",
  argTypes: {
    emissionRate: {
      description: "发射速率(个/秒)",
      table: {
        defaultValue: { summary: 20.0 },
      },
      control: "number",
    },
    imageSize: {
      description: "尺寸(像素)",
      table: {
        defaultValue: { summary: 5.0 },
      },
      control: "number",
    },
    minimumParticleLife: {
      description: "粒子最小存在时间(秒)",
      table: {
        defaultValue: { summary: 2.0 },
      },
      control: "number",
    },
    maximumParticleLife: {
      description: "粒子最大存在时间(秒)",
      table: {
        defaultValue: { summary: 3.0 },
      },
      control: "number",
    },
    minimumSpeed: {
      description: "最小速度(个/秒)",
      table: {
        defaultValue: { summary: 9.0 },
      },
      control: "number",
    },
    maximumSpeed: {
      description: "最大速度(个/秒)",
      table: {
        defaultValue: { summary: 9.5 },
      },
      control: "number",
    },
    startScale: {
      description: "初始比例",
      table: {
        defaultValue: { summary: 1.0 },
      },
      control: "number",
    },
    endScale: {
      description: "结束比例",
      table: {
        defaultValue: { summary: 4.0 },
      },
      control: "number",
    },
    emitterType: {
      description:
        "发射类型:可选 '盒状放射', '圆形放射', '锥形放射', '球形放射'",
      table: {
        defaultValue: { summary: "圆形放射" },
      },
      control: {
        type: "select",
        options: ["盒状放射", "圆形放射", "锥形放射", "球形放射"],
      },
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  data() {
    return {
      url: "http://t0.tianditu.gov.cn/img_c/wmts",
      m3dUrl: "http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
      maximumScreenSpaceError: 8,
      tileMatrixSet: "c",
      tilingScheme: "EPSG:4326",
      layer: "img",
      format: "tiles",
      token: {
        key: "tk",
        value: "2ddaabf906d4b5418aed0078e1657029",
      },
      particleMode: "",
      imgUrl: "",
      particleEffects: null,
    };
  },
  template: `
  <mapgis-web-scene style="{height: '100vh'}">
      <mapgis-3d-ogc-wmts-layer
          :baseUrl="url"
          :wmtsLayer="layer"
          :tileMatrixSet="tileMatrixSet"
          :format="format"
          :tilingScheme="tilingScheme"
          :token="token"
      ></mapgis-3d-ogc-wmts-layer>
      <mapgis-3d-igs-m3d :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl"></mapgis-3d-igs-m3d>
      <mapgis-ui-card class="storybook-ui-card">
      <mapgis-ui-toolbar>
      <mapgis-ui-toolbar-command-group>
        <mapgis-ui-toolbar-command
          title="火焰"
          icon="mapgis-fire"
          :active="particleMode === 'fire'"
          @click="onCreateParticle('fire')"
        />
        <mapgis-ui-toolbar-command
          title="烟雾"
          icon="mapgis-smoke"
          :active="particleMode === 'smoke'"
          @click="onCreateParticle('smoke')"
        />
      </mapgis-ui-toolbar-command-group>
      <mapgis-ui-toolbar-space />
      <mapgis-ui-toolbar-command-group>
        <mapgis-ui-toolbar-command
          title="清除"
          icon="mapgis-delete"
          @click="onClearParticle"
        />
      </mapgis-ui-toolbar-command-group>
    </mapgis-ui-toolbar>
        <mapgis-3d-particle-effects
            :emissionRate="emissionRate"
            :imageSize="imageSize"
            :minimumParticleLife="minimumParticleLife"
            :maximumParticleLife="maximumParticleLife"
            :minimumSpeed="minimumSpeed"
            :maximumSpeed="maximumSpeed"
            :startScale="startScale"
            :endScale="endScale"
            :emitterType="emitterType"
            :imgUrl="imgUrl"
            @load="load"/>
      </mapgis-ui-card>
      </mapgis-web-scene>
    `,
  methods: {
    load(particleEffects) {
      this.particleEffects = particleEffects;
    },
    onCreateParticle(type) {
      this.particleMode = type;
      this.imgUrl = type === "fire" ? fireImg : smokeImg;
      this.particleEffects.onCreateParticle();
    },
    onClearParticle() {
      this.particleEffects.onClearParticle();
    },
  },
});

export const 粒子特效 = Template.bind({});
粒子特效.args = {
  emissionRate: 2.0, // 发射速率
  imageSize: 5.0, // 尺寸
  minimumParticleLife: 2.0, // 粒子最小存在时间
  maximumParticleLife: 3.0, //粒子最大存在时间
  minimumSpeed: 9.0, // 最小速度
  maximumSpeed: 9.5, // 最大速度
  startScale: 1.0, // 初始比例
  endScale: 4.0, // 结束比例
  emitterType: "圆形放射",
};
粒子特效.parameters = {
  docs: {
    description: {
      component: Markdown,
    },
  },
};
