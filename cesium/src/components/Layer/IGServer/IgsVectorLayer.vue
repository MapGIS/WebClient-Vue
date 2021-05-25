<script>
import IgsLayer from "../RasterLayer";

export default {
    name: "mapgis-3d-igs-vector-layer",
    mixins: [IgsLayer],
    props: {
        gdbps: {
            type: Array,
            require: true,
        },
    },
    methods: {
        initUrl() {
            let _url = this.url;
            if (!this.url) {
                let domain = this.domain;
                if (!domain) {
                    domain = this.protocol + "://" + this.ip + ":" + this.port;
                }
                _url = domain + "/igs/rest/mrms/layers";
            }
            return _url;
        },
        createCesiumObject() {
            const url = this.initUrl();
            const { $props } = this;
            const options = { ...$props, url };
            const provider = new Cesium.MapGIS2DDocMapProvider(options);
            return new Cesium.ImageryLayer(provider);
        },
    },
};
</script>

