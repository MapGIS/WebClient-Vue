import "../style/card.css";
import Markdown from "../../cesium/docs/api/Overlay/ParticleEffects.md";


export default {
    title: "三维/可视化/粒子特效",
    argTypes: {
        particleList:{
            description: "粒子特效参数配置集",
            table: {
                defaultValue: {
                    summary: '[]',
                },
            },
            control: "array",
        },
        symbolList:{
            description: "符号库参数配置",
            table: {
                defaultValue: {
                    summary:'[{\n' +
                        '          guid: "C0EA27B2-0365-1F9F-C71A-B0586ADDCA0D",\n' +
                        '          name: "火焰",\n' +
                        '          image: "./fire.png",\n' +
                        '          iconUrl: "mapgis-fire",\n' +
                        '        },\n' +
                        '        {\n' +
                        '          guid: "B8AF7BAC-082F-14C6-BECD-8F7AB44C5019",\n' +
                        '          name: "烟雾",\n' +
                        '          image: "./smoke.png",\n' +
                        '          iconUrl: "mapgis-smoke",\n' +
                        '        }]'
                },
            },
            control: "array",
        }
    },
};

const Template = (args, {argTypes}) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            url: "http://t0.tianditu.gov.cn/img_c/wmts",
            m3dUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/ZondyModels`,
            // m3dUrl: `http://localhost:6163/igs/rest/g3d/BIM模型`,
            maximumScreenSpaceError: 8,
            tileMatrixSet: "c",
            tilingScheme: "EPSG:4326",
            layer: "img",
            format: "tiles",
            token: {
                key: "tk",
                value: "2ddaabf906d4b5418aed0078e1657029",
            },
            autoReset: true,
            particleEffects: null,
            showParticle: true
        };
    },
    template: `
      <mapgis-web-scene :style="{height: '95vh'}">
      <mapgis-3d-ogc-wmts-layer
          :baseUrl="url"
          :wmtsLayer="layer"
          :tileMatrixSet="tileMatrixSet"
          :format="format"
          :tilingScheme="tilingScheme"
          :token="token"
      ></mapgis-3d-ogc-wmts-layer>
      <mapgis-3d-m3d-layer :autoReset="autoReset" :maximumScreenSpaceError="maximumScreenSpaceError" :url="m3dUrl"
                           @loaded="loaded"></mapgis-3d-m3d-layer>
      <mapgis-ui-card v-if="showParticle"
                      class="storybook-ui-card">
        <mapgis-3d-particle-effects-manager
            :symbolList="symbolList"
            :particleList="particleList"
            @changeParticel="changeParticle"
            @load="load"/>
      </mapgis-ui-card>
      <mapgis-3d-statebar></mapgis-3d-statebar>
      </mapgis-web-scene>
    `,
    methods: {
        load(particleEffects) {
            this.particleEffects = particleEffects;
        },
        loaded(e) {
            this.showParticle = true;
        },
        changeParticle(e){
            console.log("particleList",e);
        }
    },
});

export const 粒子特效 = Template.bind({});
粒子特效.args = {
    symbolList:[
        {
            guid: "9D09DB87-7955-9295-2E34-61E83C30D3AA",
            name: "外部火焰",
            image: `http://localhost:8895/img/fire.png`,
            iconUrl: "mapgis-huoyan",
        },
        {
            guid: "F9FDE880-8F5B-AEDF-CA95-ADC54F02A34F",
            name: "外部烟雾",
            image: `http://localhost:8895/img/smoke.png`,
            iconUrl: "mapgis-yanwu",
        },
    ],
    particleList:[
        {
            guid: "49A834D7-97C6-F452-4611-6F0739809B50",
            name: "粒子名称1",
            param: {
                emitterType: "圆形放射",  //发射类型
                emissionRate: 20.0,     //发射速率
                imageSize: 5.0,         //尺寸
                minimumParticleLife: 2.0,  //粒子最小存在时间
                maximumParticleLife: 3.0,  //粒子最大存在时间
                minimumSpeed: 9.0,         //最小速度
                maximumSpeed: 10.0,        //最大速度
                startScale: 1.0,           //初始比例
                endScale: 4.0,             //结束比例
                symbolGuid: "9D09DB87-7955-9295-2E34-61E83C30D3AA",
                position: {
                    longitude: 114.402023,
                    latitude: 30.46666308,
                    height: 7.160341631125318
                }
            }
        },
        {
            guid: "36F335E8-1F3C-41E2-40AA-EE950D691761",
            name: "粒子名称2",
            param: {
                emitterType: "球形放射",  //发射类型
                emissionRate: 40.0,     //发射速率
                imageSize: 6.0,         //尺寸
                minimumParticleLife: 2.0,  //粒子最小存在时间
                maximumParticleLife: 3.0,  //粒子最大存在时间
                minimumSpeed: 9.0,         //最小速度
                maximumSpeed: 10.0,        //最大速度
                startScale: 1.0,           //初始比例
                endScale: 4.0,             //结束比例
                symbolGuid: "9D09DB87-7955-9295-2E34-61E83C30D3AA",
                position: {
                    longitude: 114.40092382,
                    latitude: 30.46549092,
                    height: 1
                }
            }
        }
    ]
};
粒子特效.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};
