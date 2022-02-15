<template>
    <mapgis-ui-modal
        title="视角编辑器"
        :visible="innerShow"
        :mask="false"
        @cancel="closePanel"
        @ok="getResultConfig"
        class="viewpoint-editor"
        v-show="innerShow"
        :bodyStyle="bodyStyle"
        :width="320"
        okText="确定"
        cancelText="取消"
        v-drag
    >
        <mapgis-ui-row class="input-parameter-style">
            <mapgis-ui-col :span="6"><label>名称</label></mapgis-ui-col>
            <mapgis-ui-col :span="18">
                <mapgis-ui-input v-model="name"></mapgis-ui-input>
            </mapgis-ui-col>
        </mapgis-ui-row>

        <mapgis-ui-input-number-panel
            size="medium"
            label="飞行时间"
            v-model="duration"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 18 }"
        />

        <mapgis-ui-row class="input-parameter-style">
            <mapgis-ui-col :span="6"><label>缩略图</label></mapgis-ui-col>
            <mapgis-ui-col :span="10">
                <img class="thumbnail" :src="image" />
            </mapgis-ui-col>
            <mapgis-ui-col :span="8" class="thumbnail-btn">
                <mapgis-ui-button @click="screenshot" style="margin-bottom: 6px"
                    >截图</mapgis-ui-button
                >
                <mapgis-ui-button @click="upload"
                    >上传<input type="file" id="file"
                /></mapgis-ui-button>
            </mapgis-ui-col>
        </mapgis-ui-row>

        <mapgis-ui-collapse expand-icon-position="right" :bordered="false">
            <template #expandIcon="props">
                <mapgis-ui-iconfont
                    type="mapgis-chevrons-down"
                    :rotate="props.isActive ? 180 : 0"
                />
            </template>
            <mapgis-ui-collapse-panel :style="collapseStyle">
                <div slot="header">
                    <mapgis-ui-row class="input-parameter-style">
                        <mapgis-ui-col :span="6"
                            ><label>视角</label></mapgis-ui-col
                        >
                        <mapgis-ui-col :span="18">
                            <div class="current-camera">
                                <mapgis-ui-button @click.stop="getCameraConfig">
                                    <mapgis-ui-iconfont type="mapgis-xiangji" />
                                </mapgis-ui-button>
                                <label>获取时间 : {{ currentTime }}</label>
                            </div>
                            <div class="current-camera">
                                <label style="color: #0081e2"
                                    >展开详细参数</label
                                >
                            </div>
                        </mapgis-ui-col>
                    </mapgis-ui-row>
                </div>

                <mapgis-ui-row>
                    <mapgis-ui-input-number-panel
                        size="small"
                        label="经度"
                        v-model="longitude"
                        :range="[0, 180]"
                        :slider="false"
                    />
                    <mapgis-ui-input-number-panel
                        size="small"
                        label="纬度"
                        v-model="latitude"
                        :range="[-90, 90]"
                        :slider="false"
                    />
                    <mapgis-ui-input-number-panel
                        size="small"
                        label="高度"
                        v-model="height"
                        :range="[0, 100000000]"
                        :slider="false"
                    />
                    <mapgis-ui-input-number-panel
                        size="small"
                        label="方向角"
                        v-model="heading"
                        :range="[0, 360]"
                        :slider="false"
                    />
                    <mapgis-ui-input-number-panel
                        size="small"
                        label="俯视角"
                        v-model="pitch"
                        :range="[-90, 90]"
                        :slider="false"
                    />
                    <mapgis-ui-input-number-panel
                        size="small"
                        label="翻滚角"
                        v-model="roll"
                        :range="[0, 180]"
                        :slider="false"
                    />
                </mapgis-ui-row>
            </mapgis-ui-collapse-panel>
        </mapgis-ui-collapse>
        <mapgis-ui-spin
            :spinning="spinning"
            size="large"
            style="top: 50%; left: 50%"
        />
    </mapgis-ui-modal>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
import html2canvas from "html2canvas";

export default {
    name: "viewpoint-editor",
    mixins: [ServiceLayer],
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        config: {
            type: Object,
        },
        mode: {
            type: String,
        },
    },
    model: {
        prop: "config",
        event: "update",
    },
    watch: {
        show(val) {
            this.innerShow = val;
            if (val) {
                //新增视点时，初始化设置当前视点camera参数
                this.initConfig(this.config);
            }
        },
        innerShow(val) {
            this.$emit("change", val);
        },
        config: {
            handler: function (val) {
                if (val) {
                    this.initConfig(val);
                }
            },
            deep: true,
        },
    },
    data() {
        return {
            bodyStyle: {
                padding: "10px",
            },

            collapseStyle: {
                border: "0",
                overflow: "hidden",
                padding: "0",
            },

            innerShow: this.show,
            name: "",
            image: require("./upload/wuhan.jpg"),
            duration: 0.5,
            currentTime: undefined,
            longitude: undefined,
            latitude: undefined,
            height: undefined,
            heading: undefined,
            pitch: undefined,
            roll: undefined,

            resultConfig: undefined,
            spinning: false,
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
        initConfig(val) {
            this.name = val.name;

            this.image = val.image;

            this.longitude = val.destination.x;
            this.latitude = val.destination.y;
            this.height = val.destination.z;

            this.heading = val.orientation.heading;
            this.pitch = val.orientation.pitch;
            this.roll = val.orientation.roll;

            this.duration = val.duration;

            //初始化设置当前视点camera参数
            if (this.mode === "add") {
                this.getCameraConfig();
            }
        },
        setView() {
            const { viewer, Cesium } = this;
            const vm = this;
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(
                    vm.longitude,
                    vm.latitude,
                    vm.height
                ),
                orientation: {
                    heading: Cesium.Math.toRadians(vm.heading),
                    pitch: Cesium.Math.toRadians(vm.pitch),
                    roll: Cesium.Math.toRadians(vm.roll),
                },
            });
        },
        /* 截图 */
        screenshot() {
            this.spinning = true;
            const { viewer, Cesium } = this;
            const vm = this;

            let opt = {
                allowTaint: true,
                useCORS: true,
            };
            html2canvas(viewer.scene.canvas, opt).then(function (canvas) {
                let image = document.querySelector(".thumbnail");
                // document.body.appendChild(canvas);
                image.setAttribute("src", canvas.toDataURL());
                vm.image = canvas.toDataURL();
                vm.spinning = false;
            });
        },
        /* 上传本地图片 */
        upload() {
            let file = document.getElementById("file");
            let image = document.querySelector(".thumbnail");
            const vm = this;

            file.onchange = function () {
                let fileData = this.files[0]; //获取到一个FileList对象中的第一个文件( File 对象),是我们上传的文件
                let pettern = /^image/;

                // console.info(fileData.type)

                if (!pettern.test(fileData.type)) {
                    alert("图片格式不正确");
                    return;
                }
                let reader = new FileReader();
                reader.onloadstart = function () {
                    this.spinning = true;
                };
                reader.readAsDataURL(fileData); //异步读取文件内容，结果用data:url的字符串形式表示
                /*当读取操作成功完成时调用*/
                reader.onload = function (e) {
                    // console.log(e); //查看对象
                    // console.log(this.result);//要的数据 这里的this指向FileReader（）对象的实例reader
                    image.setAttribute("src", this.result);
                    vm.image = this.result;
                    vm.spinning = false;
                };
                reader.onabort = function () {
                    vm.spinning = false;
                };
            };
        },
        getCameraConfig() {
            const { viewer, Cesium } = this;

            let myDate = new Date();
            // let mytime = myDate.toLocaleTimeString();
            let hour =
                myDate.getHours() > 9
                    ? myDate.getHours()
                    : "0" + myDate.getHours();
            let min =
                myDate.getMinutes() > 9
                    ? myDate.getMinutes()
                    : "0" + myDate.getMinutes();
            let sec =
                myDate.getSeconds() > 9
                    ? myDate.getSeconds()
                    : "0" + myDate.getSeconds();
            this.currentTime = hour + " : " + min + " : " + sec;

            let cartesian3 = viewer.camera.position;
            let ellipsoid = viewer.scene.globe.ellipsoid;
            let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
            this.latitude = Cesium.Math.toDegrees(cartographic.latitude);
            this.longitude = Cesium.Math.toDegrees(cartographic.longitude);
            this.height = cartographic.height;

            this.heading = Cesium.Math.toDegrees(viewer.camera.heading);
            this.pitch = Cesium.Math.toDegrees(viewer.camera.pitch);
            this.roll = Cesium.Math.toDegrees(viewer.camera.roll);
        },
        getResultConfig() {
            const vm = this;
            this.resultConfig = {
                name: vm.name,
                image: vm.image,
                destination: {
                    x: vm.longitude,
                    y: vm.latitude,
                    z: vm.height,
                },
                orientation: {
                    heading: vm.heading,
                    pitch: vm.pitch,
                    roll: vm.roll,
                },
                duration: vm.duration,
            };
            this.$emit("update", this.resultConfig);
            this.innerShow = false;
        },
        closePanel() {
            this.innerShow = false;
        },
    },
    directives: {
        drag: {
            // 指令的定义
            bind: function (el) {
                let odiv = el; //获取当前元素
                const vm = this;
                odiv.onmousedown = (e) => {
                    //算出鼠标相对元素的位置
                    let disX = e.clientX - odiv.offsetLeft;
                    let disY = e.clientY - odiv.offsetTop;

                    document.onmousemove = (e) => {
                        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                        let left = e.clientX - disX;
                        let top = e.clientY - disY;

                        //绑定元素位置到positionX和positionY上面
                        // vm.positionX = top;
                        // vm.positionY = left;

                        //移动当前元素
                        odiv.style.left = left + "px";
                        odiv.style.top = top + "px";
                    };
                    document.onmouseup = (e) => {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
            },
        },
    },
};
</script>

<style scoped>
.input-parameter-style {
    padding: 10px 6px;
}

.input-parameter-style label {
    /* height: 32px; */
    line-height: 32px;
    font-size: 14px;
}

.input-parameter-style .mapgis-ui-input-number {
    width: 100%;
}

.thumbnail {
    width: 106px;
    height: 70px;
}

.thumbnail-btn .mapgis-ui-btn {
    width: 80px;
    display: block;
    margin-left: auto;
}

#file {
    position: absolute;
    height: 32px;
    width: 80px;
    top: 0px;
    left: 0px;
    opacity: 0;
}

.current-camera {
    height: 32px;
    line-height: 32px;
}

.current-camera .mapgis-ui-btn {
    margin-right: 8px;
    padding: 0 8px;
}

.mapgis-ui-collapse-icon-position-right > .mapgis-ui-collapse-item > .mapgis-ui-collapse-header .mapgis-ui-collapse-arrow{
    right: 120px;
    top: 58px;
    color: #0081e2;
}

::v-deep
    .mapgis-ui-collapse
    > .mapgis-ui-collapse-item
    > .mapgis-ui-collapse-header {
    border-left: unset !important;
    padding: 0;
}

::v-deep .mapgis-ui-collapse-content > .mapgis-ui-collapse-content-box {
    padding: 0;
}

::v-deep
    .mapgis-ui-collapse-borderless
    > .mapgis-ui-collapse-item
    > .mapgis-ui-collapse-content
    > .mapgis-ui-collapse-content-box {
    padding: 0;
}

::v-deep .mapgis-ui-spin-spinning {
    position: absolute;
}
</style>
