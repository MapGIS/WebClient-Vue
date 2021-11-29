<template>
    <div class="viewpoint-editor" v-show="innerShow">
        <div class="editor-header">
            <label class="title">视角编辑器</label>
            <div @mouseenter="hover = true" @mouseleave="hover = false">
                <img
                    v-show="!hover"
                    class="closeButton2"
                    src="./关闭2.png"
                    @click="closePanel"
                />
                <img
                    v-show="hover"
                    class="closeButton2"
                    src="./关闭2hover.png"
                    @click="closePanel"
                />
            </div>
        </div>
        
    </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";

export default {
    name: "viewpoint-editor",
    mixins: [ServiceLayer],
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    model: {
        prop: "show",
        event: "change",
    },
    watch: {
        show(val) {
            this.innerShow = val;
        },
        innerShow(val) {
            this.$emit("change", val);
        },
    },
    data() {
        return {
            hover: false,
            innerShow: this.show,

            result: {
                name: "武汉",
                image: require("./upload/wuhan.png"),
                destination: {
                    x: 114.21,
                    y: 30.42,
                    z: 150000.0,
                },
                orientation: {
                    heading: 360,
                    pitch: -90,
                    roll: 0,
                },
                duration: 0.5,
            },
        };
    },

    mounted() {
        this.mount();
    },
    destroyed() {
        this.unmount();
    },
    methods: {
        mount() {
            this.$emit("load", this);
        },
        unmount() {
            this.$emit("unload");
        },

        closePanel() {
            this.innerShow = false;
        },
    },
};
</script>

<style scoped>
.viewpoint-editor {
    width: 490px;
    height: 400px;
    position: absolute;
    background: rgba(219, 219, 219, 0.8);
    top: 100px;
    left: 300px;
}

.editor-header {
    height: 40px;
    border-bottom: 1px solid #f0f0f0;
    line-height: 40px;
}

.title {
    padding-left: 20px;
    font-size: 16px;
    color: #333333;
}

.closeButton2 {
    position: absolute;
    top: 12px;
    right: 16px;
    width: 16px;
    height: 16px;
}
</style>
