<template>
    <div class="mapgis-ui-color-pick-panel" :style="colorStyle">
        <mapgis-ui-row>
            <mapgis-ui-col :span="labelCol" class="mapgis-ui-color-pick-panel-label">
                <label>{{ label }}</label>
            </mapgis-ui-col>
            <mapgis-ui-col :span="wrapperCol">
                <mapgis-ui-sketch-color-picker
                    :color.sync="color"
                    :disableAlpha="disableAlpha"
                    @input="inputChange"
                />
            </mapgis-ui-col>
        </mapgis-ui-row>
    </div>
</template>

<script>
export default {
    name: "mapgis-ui-color-pick-panel",
    props: {
        label: {
            type: String,
            default: "标题",
        },
        color: {
            type: String,
            required: true,
            default: "rgb(255,255,102)",
        },
        disableAlpha: {
            type: Boolean,
            default: true,
        },
        colorStyle: {
            type: Object,
        },
        labelCol: {
            type: Number,
            default: 6,
        },
        wrapperCol: {
            type: Number,
            default: 18,
        },
    },
    methods: {
        inputChange(e) {
            this.$emit("input", e);
        },
    },
};
</script>
