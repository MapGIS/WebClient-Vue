export default {
    title: "三维/图层/IGServer矢量图层"
}

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            gdbps:
                ["GDBP://MapGISLocalPlus/北京市/ds/行政区/sfcls/北京市", "GDBP://MapGISLocalPlus/北京市/ds/行政区/sfcls/首都点"],
            baseUrl: "http://develop.smaryun.com:6163/igs/rest/mrms/layers"
        }
    },
    template: `
    <mapgis-web-scene>
        <mapgis-3d-igs-vector-layer
            :gdbps="gdbps"
            :baseUrl="baseUrl"
        ></mapgis-3d-igs-vector-layer>
    </mapgis-web-scene>
    `
});

export const Vector = Template.bind({});
Vector.args = {}