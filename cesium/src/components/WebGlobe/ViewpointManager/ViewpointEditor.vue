<template>
    <div class="viewpoint-editor" v-show="innerShow" v-drag>
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

        <div class="editor-content"  @mousemove.stop="">
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
                :labelCol="{span:6}"
                :wrapperCol="{span:18}"
            />

            <mapgis-ui-row
                class="input-parameter-style"
            >
                <mapgis-ui-col :span="6"><label>缩略图</label></mapgis-ui-col>
                <mapgis-ui-col :span="10">
                    <img class="thumbnail" :src="image" />
                </mapgis-ui-col>
                <mapgis-ui-col :span="8" style="text-align:right">
                    <mapgis-ui-button @click="screenshot" style="margin-bottom: 6px; width: 80px">截图</mapgis-ui-button>
                    <mapgis-ui-button @click="upload" style="width: 80px">上传<input type="file" id="file" /></mapgis-ui-button> 
                </mapgis-ui-col>
            </mapgis-ui-row>

            <mapgis-ui-collapse expand-icon-position="right" :bordered="false">
                <template #expandIcon="props">
                    <mapgis-ui-iconfont
                        type="mapgis-chevrons-down"
                        :rotate="props.isActive ? 180 : 0"
                        style="display:none"
                    />
                </template>
                <mapgis-ui-collapse-panel :style="collapseStyle">
                    <div slot="header">
                        <mapgis-ui-row class="input-parameter-style">
                            <mapgis-ui-col :span="6"><label>视角</label></mapgis-ui-col>
                            <mapgis-ui-col :span="18">
                                <div class="current-camera" >
                                    <mapgis-ui-button
                                        @click.stop="getCameraConfig"
                                    >
                                        <mapgis-ui-iconfont type="mapgis-xiangji"/>
                                    </mapgis-ui-button>
                                    <label>获取时间 : {{ currentTime }}</label>
                                </div>
                                <div class="current-camera">
                                    <mapgis-ui-iconfont type="mapgis-chevrons-down"/>
                                    <label  style="color: #0081e2;">展开详细参数</label>
                                </div>
                            </mapgis-ui-col>
                        </mapgis-ui-row>
                    </div>

                    <mapgis-ui-row>

                        <mapgis-ui-input-number-panel
                            size="small"
                            label="经度"
                            v-model="longitude"
                            :range="[0,180]"
                            :slider="false"
                            @change="setView"
                        />

                        <mapgis-ui-input-number-panel
                            size="small"
                            label="纬度"
                            v-model="latitude"
                            :range="[-90,90]"
                            :slider="false"
                            @change="setView"
                        />

                        <mapgis-ui-input-number-panel
                            size="small"
                            label="高度"
                            v-model="height"
                            :range="[0,100000000]"
                            :slider="false"
                            @change="setView"
                        />

                        <mapgis-ui-input-number-panel
                            size="small"
                            label="方向角"
                            v-model="heading"
                            :range="[0,360]"
                            :slider="false"
                            @change="setView"
                        />
                        <mapgis-ui-input-number-panel
                            size="small"
                            label="俯视角"
                            v-model="pitch"
                            :range="[-90,90]"
                            :slider="false"
                            @change="setView"
                        />                        
                        <mapgis-ui-input-number-panel
                            size="small"
                            label="翻滚角"
                            v-model="roll"
                            :range="[0,180]"
                            :slider="false"
                            @change="setView"
                        />
                    </mapgis-ui-row>
                </mapgis-ui-collapse-panel>
            </mapgis-ui-collapse>
        </div>
        <div class="editor-footer" @mousemove.stop="">
            <mapgis-ui-button type="primary" @click="getResultConfig">确定</mapgis-ui-button>
            <mapgis-ui-button @click="closePanel">取消</mapgis-ui-button>
        </div>
    </div>
</template>

<script>
import ServiceLayer from "../../UI/Controls/ServiceLayer";
import html2canvas from 'html2canvas';  

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
    },
    model: {
        prop: "config",
        event: "update",
    },
    watch: {
        show(val) {
            this.innerShow = val;
        },
        innerShow(val) {
            this.$emit("change", val);
        },
        config: {
            handler: function (val) {
                if(val){
                    this.initConfig(val);
                }
            },
            deep: true,
        },
    },
    data() {
        return {
            hover: false,
            collapseStyle: {
                background: "#ffffff",
                border: "0",
                overflow: "hidden",
                padding: "0",
            },

            innerShow: this.show,
            name:'',
            image:require("./upload/wuhan.png"),
            duration:0.5,
            currentTime: undefined,
            longitude:undefined,
            latitude:undefined,
            height:undefined,
            heading:undefined,
            pitch:undefined,
            roll:undefined,

            resultConfig: undefined,

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
        initConfig(val){
            this.name = val.name;

            this.image = val.image;

            this.longitude = val.destination.x;
            this.latitude = val.destination.y;
            this.height = val.destination.z;

            this.heading = val.orientation.heading;
            this.pitch = val.orientation.pitch;
            this.roll = val.orientation.roll;

            this.duration = val.duration;
        },
        setView(){
            const { viewer, Cesium } = this;
            const vm = this;
            viewer.camera.setView({
                destination : Cesium.Cartesian3.fromDegrees(vm.longitude, vm.latitude, vm.height),
                orientation: {
                    heading : Cesium.Math.toRadians(vm.heading), // east, default value is 0.0 (north)
                    pitch : Cesium.Math.toRadians(vm.pitch),    // default value (looking down)
                    roll : Cesium.Math.toRadians(vm.roll)                             // default value
                }
            });
        },
        /* 截图 */
        screenshot(){
            const { viewer , Cesium} = this;
            const vm = this;
            
            let rect = document.createElement('div');
            // viewer.scene.canvas.appendChild(rect);
            viewer.container.appendChild(rect);
            rect.style = 'position: fixed;background-color: rgba(0, 0, 0, 0.3);border: 2px dashed yellow;z-index: 10000;'

            this.innerShow = false;
            let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

            handler.setInputAction(function(e){

                // console.log('first-click',e);
                rect.style.left =  `${e.position.x}px`;
                rect.style.top =  `${e.position.y}px`;

                handler.setInputAction(function(ev){
                    rect.style.width = `${ev.endPosition.x - e.position.x}px`;
                    rect.style.height = `${ev.endPosition.y - e.position.y}px`;  
                },Cesium.ScreenSpaceEventType.MOUSE_MOVE )
                
                handler.setInputAction(function(){
                    
                    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    // console.log('second-click');

                    vm.innerShow = true;

                    let opt  = { 
                        allowTaint:true, 
                        useCORS:true,
                        width:parseFloat(rect.style.width),
                        height:parseFloat(rect.style.height),
                        x:parseFloat(rect.style.left),
                        y:parseFloat(rect.style.top)
                    };

                    html2canvas(viewer.scene.canvas, opt ).then(function(canvas) {

                        let image = document.querySelector(".thumbnail");
                        // document.body.appendChild(canvas);
                        image.setAttribute("src", canvas.toDataURL());
                        vm.image = canvas.toDataURL();

                        rect.parentNode.removeChild(rect);
                        handler.destroy();

                    });
                },Cesium.ScreenSpaceEventType.LEFT_CLICK )

            },Cesium.ScreenSpaceEventType.LEFT_CLICK )
        },
        /* 上传本地图片 */
        upload(){            
            let file = document.getElementById('file');
            let image = document.querySelector(".thumbnail");
            const vm = this;
            
            file.onchange = function() {
                let fileData = this.files[0];//获取到一个FileList对象中的第一个文件( File 对象),是我们上传的文件
                let pettern = /^image/;
                
                // console.info(fileData.type)

                if (!pettern.test(fileData.type)) {
                    alert("图片格式不正确");
                    return;
                }
                let reader = new FileReader();
                reader.readAsDataURL(fileData);//异步读取文件内容，结果用data:url的字符串形式表示
                /*当读取操作成功完成时调用*/
                reader.onload = function(e) {
                    // console.log(e); //查看对象
                    // console.log(this.result);//要的数据 这里的this指向FileReader（）对象的实例reader
                    image.setAttribute("src", this.result);
                    vm.image = this.result;
                }
            }
        },  
        getCameraConfig() {
            const { viewer , Cesium } = this;

            let myDate = new Date();
            // let mytime = myDate.toLocaleTimeString();
            let hour = myDate.getHours() > 9 ? myDate.getHours() : '0' + myDate.getHours();
            let min = myDate.getMinutes() > 9 ? myDate.getMinutes() : '0' + myDate.getMinutes();
            let sec = myDate.getSeconds() > 9 ? myDate.getSeconds() : '0' + myDate.getSeconds();
            this.currentTime = hour + " : " + min + " : " + sec;

            let cartesian3 = viewer.camera.position;
            let ellipsoid=viewer.scene.globe.ellipsoid;
            let cartographic=ellipsoid.cartesianToCartographic(cartesian3);
            this.latitude = Cesium.Math.toDegrees(cartographic.latitude);
            this.longitude = Cesium.Math.toDegrees(cartographic.longitude);
            this.height = cartographic.height;

            this.heading = Cesium.Math.toDegrees(viewer.camera.heading);
            this.pitch = Cesium.Math.toDegrees(viewer.camera.pitch);
            this.roll = Cesium.Math.toDegrees(viewer.camera.roll);
        },
        getResultConfig() {
            const vm = this;
            this.resultConfig =  {
                name: vm.name || '未命名',
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
            this.$emit("update",this.resultConfig);
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
.viewpoint-editor {
    width: 320px;
    /* height: 370px; */
    position: absolute;
    background: #ffffff;
    top: 10px;
    left: 400px;
    border-radius: 3px;
}

.editor-header {
    height: 40px;
    border-bottom: 1px solid #f0f0f0;
    line-height: 40px;
    cursor: move;
}

.title {
    padding-left: 10px;
    font-size: 16px;
    color: #333333;
}

.closeButton2 {
    position: absolute;
    top: 12px;
    right: 16px;
    width: 16px;
    height: 16px;
    cursor: pointer;
}

.editor-content {
    padding: 10px;
}

.input-parameter-style {
    padding: 10px;
}

.input-parameter-style label {
    /* height: 32px; */
    line-height: 32px;
    font-size: 14px;
    color: #666666;
}

.input-parameter-style .mapgis-ui-input-number {
    width: 100%;
}

.thumbnail {
    width: 106px;
    height: 70px;
}

#file{
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

.current-camera > .anticon {
    margin-right: 8px;
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

.editor-footer {
    height: 48px;
    line-height: 48px;
    border-top: 1px solid #f0f0f0;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.editor-footer button {
    width: 146px;
}
</style>
