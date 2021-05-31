<template>
    <span />
</template>
<script>
import ServiceLayer from "../ServiceLayer";

export default {
    name: "mapgis-3d-igs-vector-layer",
    mixins: [ServiceLayer],
    props: {
        gdbps: {
            type: [Array, String],
            require: true,
        },
    },
    data() {
        return {
            managerName: "IgsserverManager",
            providerName: "MapGIS2DDocMapProvider",
            checkType: {
                tileWidth: "number",
                tileHeight: "number",
                minimumLevel: "number",
                maximumLevel: "number",
            },
        };
    },
    mounted() {
        this.mount();
    },
    destroyed() {
        this.unmount();
    },
    watch: {
        gdbps: {
            handler: function () {
                this.unmount();
                this.mount();
            },
        },
    },
    methods: {
        initUrl(service) {
            let _url;

            //优先判断url方式
            if (this.baseUrl) {
                _url = this.baseUrl;
            } else if (this.domain) {
                _url = this.domain + service;
            } else {
                //最后ip方式
                if (this.ip && this.port) {
                    _url = this.protocol + this.ip + ":" + this.port + service;
                } else {
                    throw new Error("请输入url地址信息");
                }
            }

            return _url;
        },
        mount() {
            //处理独有参数
            const baseUrl = this.initUrl("/igs/rest/mrms/layers");
            let { gdbps } = this;
            if (typeof gdbps === "string") {
                gdbps = gdbps.split(",");
            }
            this.$_mount({ baseUrl: baseUrl, gdbps: gdbps });
        },
        unmount() {
            this.$_unmount();
        },
    },
};
</script>