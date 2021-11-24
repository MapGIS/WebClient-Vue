export default {
    title: "三维/图层/IGServer矢量图层"
}

const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    data() {
        return {
            gdbps:
                ["GDBP://MapGISLocalPlus/北京市/ds/行政区/sfcls/北京市", "GDBP://MapGISLocalPlus/北京市/ds/行政区/sfcls/首都点"],
            baseUrl: `http://${window.webclient.ip}:${window.webclient.port}/igs/rest/mrms/layers`
        }
    },
    template: `
    <mapgis-web-scene>
        <mapgis-3d-igs-dynamic-layer
            :gdbps="gdbps"
            :baseUrl="baseUrl"
        ></mapgis-3d-igs-dynamic-layer>
    </mapgis-web-scene>
    `
});

export const Vector = Template.bind({});
Vector.args = {}