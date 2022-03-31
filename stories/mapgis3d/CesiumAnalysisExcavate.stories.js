import "../style/card.css";
import Markdown from "../../cesium/docs/api/analysis/Excavate.md";
export default {
    title: "三维/分析/开挖分析",
    argTypes:{
        excaveteStyle:{
            description:'开挖分析的样式',
            table:{
                defaultValue: { summary: '{material:"#00FFFF",edgeColor:"#FF8C00",edgeWidth: 3}'}
            }
        },
    }
};

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    data() {
        return {

        }
    },
    template: `
    <mapgis-web-scene style="height: 95vh">
        <mapgis-3d-m3d-layer :url="m3dUrl2" :vue-index="vueIndex" :auto-reset="autoReset" :maximum-screen-space-error="maximumScreenSpaceError"></mapgis-3d-m3d-layer>
        <mapgis-ui-card class="storybook-ui-card">
        <mapgis-3d-excavate :vue-index="vueIndex" :excaveteStyle="excaveteStyle"></mapgis-3d-excavate>
        </mapgis-ui-card>
        <mapgis-3d-statebar> </mapgis-3d-statebar>
    </mapgis-web-scene>
    `
});

export const Excavate = Template.bind({});
Excavate.args = {
    // m3dUrl:`http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/钻孔_2_钻孔模型s`,
    autoReset:true,
    // m3dUrl2:"http://develop.smaryun.com:6163/igs/rest/g3d/ZondyModels",
    m3dUrl2:`http://${window.webclient.ip}:${window.webclient.port}/igs/rest/g3d/钻孔分层点_Sur_000_Ent`,
    maximumScreenSpaceError:1,
    vueIndex:22,
    excaveteStyle:{
        material:"rgb(200,200,200,0.5)",
        edgeColor:"#FF8C00",
        edgeWidth: 3
    }
}
Excavate.parameters = {
    docs: {
        description: {
            component: Markdown,
        },
    },
};