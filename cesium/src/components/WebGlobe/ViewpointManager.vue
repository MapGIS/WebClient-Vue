<template>
    <div class="mapgis-3d-viewpoint-manager" v-show="manager">
        <!-- <div class="viewpoint-header">
            <label class="title">设置</label>
            <div @mouseenter="hover = true" @mouseleave="hover = false">
                <img
                    v-show="!hover"
                    class="closeButton2"
                    src="./ViewpointManager/关闭2.png"
                    @click="closePanel"
                />
                <img
                    v-show="hover"
                    class="closeButton2"
                    src="./ViewpointManager/关闭2hover.png"
                    @click="closePanel"
                />
            </div>
        </div> -->

        <viewpoint-editor
            v-model="config"
            @update="changeViewpoint($event)"
            @change="
                (e) => {
                    editor = e;
                }
            "
            :show="editor"
        />

        <div class="viewpoint-item-wrapper">
            <div  :class="['viewpoint-item',{ active:clickActive === i }]" v-for="(item, i) in items" :key="i">
                <div
                    :class="['item-image',{ active:clickActive === true }]"
                    class="item-image"
                    @mouseenter="imgIndex = i"
                    @mouseleave="imgIndex = undefined"
                    @click="flyTo(item, i)"
                >
                  <img :src="item.image" />
                  <div
                      class="item-mask"
                      v-show="imgIndex === i || selectMode"
                  >
                    <mapgis-ui-checkbox
                        @change="selectItem($event, i)"
                        @click.stop=""
                    />
                  </div>
                  <mapgis-ui-iconfont
                      class="item-locate"
                      type="mapgis-dingwei"
                  />
                </div>
                <div class="item-name">
                  <label>{{ item.name }}</label>
                  <mapgis-ui-iconfont
                      class="item-more-icon"
                      type="mapgis-gengduo"
                      @click="(e) => handleMenu(i, e)"
                  />
                </div>
            </div>
        </div>

        <div class="item-more-tool" v-show="active >= 0" ref="menu" @mouseleave="active = -1">
            <div @click="editViewpoint(active)" class="more-tool-btn">
                <mapgis-ui-iconfont type="mapgis-bianji"></mapgis-ui-iconfont>
                编辑
            </div>
            <div @click="deleteViewpoint(active)" class="more-tool-btn">                           
                <mapgis-ui-iconfont type="mapgis-shanchu"></mapgis-ui-iconfont>
                删除
            </div>
        </div>

        <div class="viewpoint-footer">
            <mapgis-ui-button
                type="primary"
                :block="true"
                v-if="!selectMode"
                @click="addViewpoint"
            >添加视点</mapgis-ui-button>
            
            <mapgis-ui-button
                type="default"
                :block="true"
                v-else
                @click="deleteViewpoint"
            >删除视点</mapgis-ui-button>
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

    mounted() {
        this.mount();
    },
    data() {
        return {
            currentItem: 0,
            selectMode: false,
            mode: undefined, //add edit
            selectItems: [],
            editor: false,
            editItem: undefined,
            hover: undefined,
            manager:true,
            imgIndex: undefined,
            active: -1,
            config: undefined,
            clickActive:false,

            /* 视点列表 */
            items: [
                {
                    name: "全球",
                    image: require("./ViewpointManager/upload/globe.jpg"),
                    destination: {
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
                    image: require("./ViewpointManager/upload/china.jpg"),
                    destination: {
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
                    image: require("./ViewpointManager/upload/wuhan.jpg"),
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
            ],
        };
    },
    destroyed() {
        this.unmount();
    },
    methods: {
        mount() {
            this.$emit("loaded", this);
        },
        unmount() {
            this.$emit("unload");
        },
        /* 视点跳转 */
        flyTo(item, i) {
            if (this.clickActive === i){
              this.clickActive = undefined;
            } else {
              this.clickActive = i;
            }
            const { viewer, Cesium } = this;
            this.currentItem = i;

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

        },
        /* 增加视点 */
        addViewpoint() {
            const vm = this;
            this.editor = true;
            this.mode = "add";
            if (vm.currentItem >= 0 ) {
                /* 新增视点时默认填充已有的视点参数 */
                vm.config = vm.items[vm.currentItem];
            }
        },
        /* 激活单个视点的编辑、删除菜单 */
        handleMenu(i, e) {
            // console.log(i, e);
            this.active = i;
            if(this.active >= 0){
              if (this.active % 2 === 0){
                /* 设置菜单的位置 */
                this.$refs.menu.style.left = `${e.x}px`;
                this.$refs.menu.style.top = `${e.y}px`;
              } else {
                this.$refs.menu.style.left = `${e.x - 88}px`;
                this.$refs.menu.style.top = `${e.y}px`;
              }
            }
        },
        /* 编辑视点 */
        editViewpoint(i) {
            this.editItem = i;
            this.config = this.items[i];
            this.editor = true;
            this.mode = "edit";
        },
        /* 处理编辑器传回的config参数 */
        changeViewpoint(val) {
            const vm = this;
            if (vm.mode === "add") {
                /* 增加视点 */
                vm.items.push(val);
            } else if (vm.mode === "edit") {
                /* 编辑视点 */
                Object.assign(vm.items[vm.editItem], val);
            }
        },
        /* 复选框选择视点 */
        selectItem(e, i) {
            const vm = this;
            /* 记录复选框选择的视点 */
            if (e.target.checked) {
                vm.selectItems.push(i);
                vm.selectMode = true;
            } else {
                let index = vm.selectItems.indexOf(i);
                vm.selectItems.splice(index, 1);
                if (vm.selectItems.length === 0) {
                    vm.selectMode = false;
                }
            }
        },
        /* 删除视点 */
        deleteViewpoint(i) {
            const vm = this;
            if (vm.selectMode) {
                /* 删除复选框勾选的视点 */
                vm.selectItems.forEach(function (index) {
                    vm.items.splice(index, 1);
                });
                vm.selectItems = [];
                vm.selectMode = false;
            } else {
                /* 删除单个视点 */
                vm.items.splice(i, 1);
            }

            if (vm.items.length === 0 ) {
                /* 视点列表为空时，当前视点为空 */
                vm.currentItem = -1;
            }else if(vm.items.length <= vm.currentItem) {
                /* 当前视点被删除时，将当前视点设为第一个视点 */
                vm.currentItem = -1;
            }
        },
        /* 关闭视点编辑器 */
        closePanel() {
            this.manager = false;
        }
    },
};
</script>

<style scoped>
</style>
