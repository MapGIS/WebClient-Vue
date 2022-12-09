export default {
    title: "三维/数据图层/影像/MapGIS/矢量图层",
    argTypes: {
        baseUrl: {
            description: '服务基地址',
            type: { name: 'String', required: false },
            table: {
                type: { summary: 'String' },
            },
            control: 'text'
        },
        gdbps: {
            description: 'gdbp地址，允许多个图层',
            type: { name: 'Array | String', required: true },
            table: {
                type: { summary: 'Array | String' }
            },
            control: 'text'
        },
        layerStyle: {
            description: '控制地图的显隐、透明度以及顺序',
            type: { name: 'Object', required: false },
            table: {
                type: { summary: 'Object' }
            },
            control: 'text'
        },
        options: {
            description: 'Cesium的进阶参数',
            type: { name: 'Object', required: false },
            table: {
                type: { summary: 'Object' }
            },
            control: 'text'
        }
    }
}

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    // data() {
    //     return {
    //         gdbps:
    //             ["GDBP://MapGISLocalPlus/北京市/ds/行政区/sfcls/北京市", "GDBP://MapGISLocalPlus/北京市/ds/行政区/sfcls/首都点"],
    //         baseUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrms/layers`
    //     }
    // },
    // template: `
    // <mapgis-web-scene style="height:95vh">
    //     <mapgis-3d-igs-vector-layer
    //         :gdbps="gdbps"
    //         :baseUrl="baseUrl"
    //     ></mapgis-3d-igs-vector-layer>
    // </mapgis-web-scene>
    // `
    template: `
    <mapgis-web-scene style="height: 95vh">
        <mapgis-3d-igs-dynamic-layer
            :gdbps="gdbps"
            :baseUrl="baseUrl"
        ></mapgis-3d-igs-dynamic-layer>
    </mapgis-web-scene>
    `
});

export const 矢量图层 = Template.bind({});
矢量图层.args = {
    baseUrl: `http://${window.webclient.igsIp}:${window.webclient.igsPort}/igs/rest/mrms/layers`,
    gdbps: "GDBP://MapGisLocal/北京市/ds/行政区/sfcls/北京市,GDBP://MapGisLocal/北京市/ds/交通/sfcls/主干道,GDBP://MapGisLocal/北京市/ds/行政区/sfcls/城镇_BJ"
}


