<template>
    <div class="mapgis-3d-viewpoint-manager">
        <div class="viewpoint-toolbar-wrapper">
            <mapgis-ui-space>
                <mapgis-ui-tooltip
                    v-for="(item, i) in buttons"
                    :key="i"
                    placement="bottom"
                >
                    <template slot="title">
                        <span>{{ item.tip }}</span>
                    </template>
                    <mapgis-ui-button
                        :type="item.type"
                        @click="item.click"
                    >
                        <mapgis-ui-iconfont :type="item.icon" theme="filled" />
                    </mapgis-ui-button>
                </mapgis-ui-tooltip>
            </mapgis-ui-space>
        </div>
        <viewpoint-editor v-model="editor"></viewpoint-editor>
        <div class="viewpoint-item-wrapper">
            <div
                class="viewpoint-item"
                v-for="(item, i) in items"
                :key="i"
                @click="selectMode ? selectItem(i) : flyTo(item, i)"
            >
                <div class="item-image">
                    <img :src="item.image" />
                </div>
                <div class="item-name">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import ServiceLayer from "../UI/Controls/ServiceLayer";
import ViewpointEditor from "./ViewpointManager/ViewpointEditor";

export default {
    name: "mapgis-3d-viewpoint-manager",
    components: {
        ViewpointEditor,
    },
    mixins: [ServiceLayer],
    props: {},
    data() {
        return {
            currentItem: 0,
            selectMode: false,
            selectItems: [],
            editor: false,

            items: [
                {
                    name: "全球",
                    image: require('./ViewpointManager/upload/globe.png'),
                    destination : {
                        x: 104,
                        y: 28.011763478186143,
                        z: 10071759.273162084,
                    },
                    orientation: {
                        heading: 360,
                        pitch: -90,
                        roll: 0,
                    },
                    duration: 0.5,
                },
                {
                    name: "中国",
                    image: require('./ViewpointManager/upload/china.png'),
                    destination : {
                        x: 108.91,
                        y: 32.52,
                        z: 5000000.0,
                    },
                    orientation: {
                        heading: 360,
                        pitch: -90,
                        roll: 0,
                    },
                    duration: 0.5,
                },
                {
                    name: "武汉",
                    image: require('./ViewpointManager/upload/wuhan.png'),
                    destination : {
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
                }
            ],
            buttons: [
                {
                    icon: "mapgis-plus",
                    type: "primary",
                    tip: "添加视点",
                    click: this.addViewpoint,
                },
                {
                    icon: "mapgis-setting",
                    type: "primary",
                    tip: "编辑视点",
                    click: this.editViewpoint,
                },
                {
                    icon: "mapgis-x",
                    type: "primary",
                    tip: "删除视点",
                    click: this.deleteViewpoint,
                },
                {
                    icon: "mapgis-check",
                    type: "primary",
                    tip: "选择视点",
                    click: this.selectViewpoint,
                },
            ],
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
        addViewpoint() {
            let newItem = this.items[this.currentItem];
            this.items.push(newItem);
        },
        editViewpoint() {
            if(this.selectItems.length === 1 || !this.selectMode){
                this.editor = !this.editor;
            }else if(this.selectItems.length > 1){
                console.log("不能同时编辑多个视点！")
            }
        },
        deleteViewpoint() {
            const vm = this;
            if(vm.items.length > 0 ){
                if(this.selectMode){
                    this.selectItems.forEach(function (i) {
                        // vm.items.forEach(function (val,index,arr) {
                        //     if (index == i) {
                        //         arr.splice(index, 1);
                        //     }
                        // });
                        vm.items.splice(i,1);
                        console.log("this.items",this.items);
                    });
                    this.selectItems = [];
                }else{
                    vm.items.splice(vm.currentItem,1);
                    if(vm.currentItem == vm.items.length && vm.currentItem != 0){
                        vm.currentItem -= 1;
                    }
                }
            }else{
                console.log("视点列表为空");
            }

        },
        selectViewpoint() {
            this.selectMode = !this.selectMode;
            console.log("this.selectMode",this.selectMode)
            if(!this.selectMode){
                this.selectItems = [];
                this.editor = false;
            }
        },
        flyTo(item, i) {
            const { viewer, Cesium } = this;
            this.currentItem = i;
            if (item.name === "全球") {
                
                // viewer.camera.flyTo({

                //     destination : Cesium.Rectangle.fromDegrees(west, south, east, north)
                    
                // });

                viewer.scene.camera.flyHome(item.duration);

                // let cartesian3 = viewer.scene.camera.position;
                
                // var ellipsoid=viewer.scene.globe.ellipsoid;

                // var cartographic=ellipsoid.cartesianToCartographic(cartesian3);

                // var x=Cesium.Math.toDegrees(cartographic.latitude);

                // var y=Cesium.Math.toDegrees(cartographic.longitude);

                // var z=cartographic.height;

                // console.log("x  "+ x + "  y  "+ y +"  z  "+ z);

            } else {
                viewer.scene.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(
                        item.destination.x,
                        item.destination.y,
                        item.destination.z
                    ),
                    orientation: {
                        heading: Cesium.Math.toRadians(
                            item.orientation.heading
                        ),
                        pitch: Cesium.Math.toRadians(item.orientation.pitch),
                        roll: Cesium.Math.toRadians(item.orientation.roll),
                    },
                    duration: item.duration,
                });
            }
            console.log("item", item);
        },
        selectItem(i) {
            this.selectItems.push(i);
        },

    },
};
</script>

<style scoped>
.mapgis-3d-viewpoint-manager {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10000;
    height: fit-content;
    background-color: #FFFFFF;
    border-radius: 4px;
}

.viewpoint-toolbar-wrapper {
    margin: 2px 5px;
}

.viewpoint-item-wrapper {
    width: 240px;
    height: fit-content;
    max-height: 360px;
    padding: 10px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
}

.viewpoint-item {
    display: inline-block;
    vertical-align: top;
    margin: 10px 4px;
    width: 106px;
    text-align: center;
    cursor: pointer;
}

.item-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 66.5%;
    box-sizing: border-box;
}

img{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: solid 1px #f0f0f0;
    border-radius: 5px;
}

.item-name {
    font-size: 12px;
    text-align: center;
    word-wrap: break-word;
    white-space: pre-wrap;
}

</style>
