<template>
  <div>
    <slot>
      <div class="mapgis-3d-particle-effects">
        <mapgis-ui-tab-panel :tabs="tabIcons" @change="onCreateParticle" ref="tabPanel">
        </mapgis-ui-tab-panel>
        <mapgis-ui-tabs
            :animated="false"
            :tabBarStyle="tabBarStyle"
            :active-key="activeKey"
            @change="tabChange"
        >
          <mapgis-ui-tab-pane key="1" tab="粒子列表" class="mapgis-3d-particle-effects-control-content list-pane">
            <mapgis-ui-list item-layout="horizontal" :data-source="particleListCopy" :pagination="pagination"
                            :split="false">
              <mapgis-ui-empty :image="emptyImage" :image-style="imageStyle" v-if="particleListCopy.length === 0">
                <span slot="description" class="mapgis-3d-particle-effects-empty-style"> 选择上方粒子类型 <br>在地图上点击添加粒子 </span>
              </mapgis-ui-empty>
              <mapgis-ui-list-item
                  :class="{'mapgis-3d-particle-effects-list-active':activeIndex === index}"
                  slot="renderItem"
                  slot-scope="item, index"
                  @mouseenter="mouseenter(index)"
                  @mouseleave="mouseleave"
                  @click="clickListItem(index)"
              >
                <template v-for="(tab,i) in tabIcons">
                  <div v-if="item.param.symbolGuid === tab.guid" :key="i">
                    <div v-if="tab.type === 'icon'">
                      <mapgis-ui-iconfont
                          :class="{'mapgis-3d-particle-effects-item-active':particleListCopy[index].isShow === true}"
                          :type="tab.icon"
                          style="font-size: 16px;padding-right: 4px"
                          @click.capture.stop="showOrHide(index)"></mapgis-ui-iconfont>
                      <span>{{ item.name }}</span>
                    </div>
                    <div v-else>
                      <img
                          :src="tab.image"
                          style="width: 24px;padding-right: 4px"
                          alt=""
                          :class="{'mapgis-3d-particle-effects-item-active':particleListCopy[index].isShow === true}"
                          @click="showOrHide(index)"/>
                      <span>{{ item.name }}</span>
                    </div>
                  </div>
                </template>
                <div
                    :class="['mapgis-3d-particle-effects-opearation',{'mapgis-3d-particle-effects-isBatch':isBatch === true}]"
                    v-show="enterIndex === index || activeIndex === index">
                  <mapgis-ui-tooltip title="删除">
                    <mapgis-ui-iconfont type="mapgis-shanchu" style="font-size: 16px;padding-right: 4px"
                                        @click.capture.stop="onClearParticle(index)"></mapgis-ui-iconfont>
                  </mapgis-ui-tooltip>
                  <mapgis-ui-tooltip title="配置">
                    <mapgis-ui-iconfont type="mapgis-shezhiditu" style="font-size: 16px"
                                        @click.capture.stop="setParticleParameter(index)"></mapgis-ui-iconfont>
                  </mapgis-ui-tooltip>
                </div>
                <div @click.stop>
                  <mapgis-ui-checkbox
                      class="item-checkbox"
                      v-show="isBatch"
                      :checked="selectedIds.includes(index)"
                      @change="_changeItemChecked(index, $event)"
                  ></mapgis-ui-checkbox>
                </div>
              </mapgis-ui-list-item>
            </mapgis-ui-list>
            <div class="pagination-div">
              <mapgis-ui-pagination
                  v-show="!isBatch"
                  hideOnSinglePage
                  class="pagination"
                  @change="pagination.onChange"
                  :pageSize="pagination.pageSize"
                  :total="pagination.total"
                  :size="pagination.size"
                  :show-total="total => `共${total}条数据`"
              ></mapgis-ui-pagination>
              <!-- 批量操作 -->
              <div class="buttons">
                <div v-show="isBatch" class="full-width">
                  <mapgis-ui-button @click="allVisible" class="control-button"
                  >可见
                  </mapgis-ui-button>
                  <mapgis-ui-button
                      @click="allInvisible"
                      class="control-button"
                  >不可见
                  </mapgis-ui-button>
                  <mapgis-ui-button
                      @click="allDelete"
                      class="control-button"
                  >删除
                  </mapgis-ui-button>
                </div>
              </div>
            </div>
          </mapgis-ui-tab-pane>
          <mapgis-ui-tab-pane key="2" tab="设置面板" class="mapgis-3d-particle-effects-control-content"
                              id="parameter-formList">
            <mapgis-ui-select-panel
                class="mapgis-ui-number-style"
                label="发射类型"
                v-model="emitterTypeCopy"
                :selectOptions="emitterOptions"
                @change="onEmitterChange">
            </mapgis-ui-select-panel>
            <mapgis-ui-input-number-panel
                class="mapgis-ui-number-style"
                size="small" label="发射速率(个/秒)"
                v-model="emissionRateCopy"
                @change="val => onChangeEffect(val, 'emissionRate')"/>
            <mapgis-ui-input-number-panel
                class="mapgis-ui-number-style"
                size="small"
                label="尺寸(像素)"
                :range="[2,60]"
                v-model="imageSizeCopy"
                @change="val => onChangeEffect(val, 'imageSize')"/>
            <mapgis-ui-input-number-panel
                size="small"
                label="最小存在时间(秒)"
                :range="[0.1,30.0]"
                v-model="minimumParticleLifeCopy"
                :step="0.1"
                @change="val => onChangeEffect(val, 'minimumParticleLife')"/>
            <mapgis-ui-input-number-panel
                size="small"
                class="mapgis-ui-number-style"
                label="最大存在时间(秒)"
                :range="[0.1,30.0]"
                v-model="maximumParticleLifeCopy"
                :step="0.1"
                @change="val => onChangeEffect(val, 'maximumParticleLife')"/>
            <mapgis-ui-input-number-panel
                size="small"
                label="最小速度(个/秒)"
                :range="[0,30]"
                v-model="minimumSpeedCopy"
                @change="val => onChangeEffect(val, 'minimumSpeed')"/>
            <mapgis-ui-input-number-panel
                size="small"
                class="mapgis-ui-number-style"
                label="最大速度(个/秒)"
                :range="[0,30]"
                v-model="maximumSpeedCopy"
                @change="val => onChangeEffect(val, 'maximumSpeed')"/>
            <mapgis-ui-input-number-panel
                size="small"
                label="初始比例"
                :range="[0.0,10.0]"
                :step="0.5"
                v-model="startScaleCopy"
                @change="val => onChangeEffect(val, 'startScale')"/>
            <mapgis-ui-input-number-panel
                size="small"
                class="mapgis-ui-number-style"
                label="结束比例"
                :range="[0.0,10.0]"
                :step="0.5"
                v-model="endScaleCopy"
                @change="val => onChangeEffect(val, 'endScale')"/>
          </mapgis-ui-tab-pane>
          <mapgis-ui-checkbox
              v-show="activeKey === '1'"
              slot="tabBarExtraContent"
              @change="_changeBatch"
          >
            批量操作
          </mapgis-ui-checkbox>
        </mapgis-ui-tabs>
      </div>
    </slot>
  </div>
</template>

<script>
import VueOptions from "../../Base/Vue/VueOptions";
import {
  isLogarithmicDepthBufferEnable,
  setLogarithmicDepthBufferEnable
} from "../../WebGlobe/util";

import emptyImage from '../../../assets/image/empty.png';
import {newGuid} from "../../Utils/util";
import clonedeep from 'lodash.clonedeep';

export default {
  name: "mapgis-3d-particle-effects-manager",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
    /**
     * @type Array
     * @default []
     * @description 符号库参数配置
     */
    symbolList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /**
     * @type Array
     * @default []
     * @description 粒子特效参数配置
     */
    particleList: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  watch: {
    symbolList: {
      deep: true,
      immediate: true,
      handler() {
        this.symbolListCopy = this.symbolList;
      }
    },
    symbolListCopy: {
      deep: true,
      immediate: true,
      handler(next) {
        //获取符号库列表tabPanel所需元素 1.有iconUrl 2.只有image,无iconUrl
        let vm = this;
        vm.tabIcons = [];
        for (let i = 0; i < next.length; i++) {
          let particle = {};
          if (next[i].iconUrl) {
            particle.type = "icon";
            particle.icon = next[i].iconUrl
          } else {
            particle.type = "img";
            particle.icon = next[i].image;
            particle.style = vm.symbolImgStyle;
          }
          particle.title = next[i].name;
          particle.guid = next[i].guid;
          particle.image = next[i].image;
          if (next[i].config) {
            particle.config = next[i].config;
          } else {
            particle.config = JSON.parse(JSON.stringify(vm.viewModel));
          }
          vm.tabIcons.push(particle);
        }
      }
    },
    particleList: {
      deep: true,
      immediate: true,
      handler(next) {
        let vm = this;
        this.particleListCopy = JSON.parse(JSON.stringify(this.particleList));
        //当外部传入粒子列表时，在场景中生成粒子特效
        // 初始化粒子特效参数
        for (let i = 0; i < next.length; i++) {
          let viewModel = JSON.parse(JSON.stringify(next[i].param));
          // 遍历符号列表，找到symbolGuid对应的符号的image
          let checkedSymbol = vm.symbolListCopy.filter(f => {
            return f.guid === viewModel.symbolGuid;
          });
          this.imgUrl = checkedSymbol[0].image;
          vm.particleListCopy[i].imageUrl = this.imgUrl;
          this.createParticleEffects(viewModel.position, viewModel);
          if (!vm.particleListCopy[i].isShow) {
            vm.particleArr[i].remove();
          }
        }
      }
    },
    particleArr: {
      handler(next) {
        this.pagination.total = this.particleListCopy ? this.particleListCopy.length : 0;
      }
    }
  },
  model: {
    prop: "particleList",
    event: "changeParticle"
  },
  data() {
    return {
      // 建立粒子的初始参数
      viewModel: {
        emitterType: "圆形放射",
        emissionRate: 2.0,
        imageSize: 5.0,
        minimumParticleLife: 2.0,
        maximumParticleLife: 3.0,
        minimumSpeed: 9.0,
        maximumSpeed: 9.5,
        startScale: 1.0,
        endScale: 4.0
      },
      emissionRateCopy: 2.0, // 发射速率
      imageSizeCopy: 5.0, // 尺寸
      minimumParticleLifeCopy: 2.0, // 粒子最小存在时间
      maximumParticleLifeCopy: 3.0, //粒子最大存在时间
      minimumSpeedCopy: 9.0, // 最小速度
      maximumSpeedCopy: 9.5, // 最大速度
      startScaleCopy: 1.0, // 初始比例
      endScaleCopy: 4.0, // 结束比例
      emitterTypeCesium: undefined, // 发射类型
      emitterTypeCopy: "圆形放射", // 发射类型下拉值
      currentEffectType: "火焰",//当前预设特效类型
      currentEffectName: "火焰1",//当前预设特效名称
      emitterOptions: ["盒状放射", "圆形放射", "锥形放射", "球形放射"], // 发射类型下拉项
      particleArr: [], // 粒子特效集
      isLogarithmicDepthBufferEnable: undefined, // 记录对数深度缓冲区状态
      handlerAction: undefined,
      tabIcons: [
        {
          title: "火焰",
          icon: "mapgis-fire",
          type: "icon",
          guid: "6961EBEA-F6A2-EB46-2119-7F5E2A0BEBCC",
          image: "./fire.png"
        },
        {
          title: "烟雾",
          icon: "mapgis-smoke",
          type: "icon",
          guid: "9A81F9FB-AABA-D469-8B5E-1572A0BF8515",
          image: "./smoke.png"
        }],
      tabBarStyle: {
        margin: '0',
        textAlign: "center",
        borderBottom: "1px solid #F0F0F0",
      },
      activeKey: '1',
      particleListCopy: this.particleList || [],
      symbolListCopy: [
        {
          guid: "C0EA27B2-0365-1F9F-C71A-B0586ADDCA0D",
          name: "火焰",
          image: "./fire.png",
          iconUrl: "mapgis-fire",
        },
        {
          guid: "B8AF7BAC-082F-14C6-BECD-8F7AB44C5019",
          name: "烟雾",
          image: "./smoke.png",
          iconUrl: "mapgis-smoke",
        }],
      // 修改已有粒子参数的索引
      changeParticleIndex: undefined,
      // 粒子类型: create(新建) | selected(选中)
      mode: undefined,

      emptyImage: emptyImage,
      imageStyle: {
        height: '150px',
        margin: '0 auto'
      },
      // 初始化的粒子参数
      initParticleParmeter: {},
      enterIndex: undefined,
      activeIndex: undefined,
      //视角跳转
      heading: 0,
      pitch: -25,
      roll: 0,
      // 符号库列表样式
      symbolImgStyle: {
        width: '24px',
        height: '24px'
      },
      symbolGuid: undefined,
      title: undefined,
      // 当前选中符号图标
      iconUrl: undefined,
      // 当前选中符号对应的粒子图片
      imgUrl: undefined,

      // 分页
      pagination: {
        onChange: page => {
          console.log(page);
          this.pagination.current = page;
          this.selectedIds = [];
        },
        current: 1,
        size: "small",
        pageSize: 7
      },
      isBatch: false, //是否批量操作

      selectedIds: [], //选中video的id集合
    };
  },

  created() {
  },
  mounted() {
    this.mount();
  },
  destroyed() {
    this.removeAllParticle();
    this.unmount();
  },
  methods: {
    mouseenter(index) {
      this.enterIndex = index;
    },
    mouseleave() {
      this.enterIndex = undefined;
    },
    clickListItem(index) {
      let vm = this;
      this.activeIndex = index;
      this.mode = 'selected';
      // 当前分页对应的页数
      const currentPage = vm.pagination.current;
      const pageSize = vm.pagination.pageSize;
      // 相机视角跳转至选中的粒子所在
      const currentChooseIndex = index + (currentPage - 1) * pageSize;

      let particlePosition = this.particleArr[currentChooseIndex].position;
      // viewer.flyTo和camera.flyTo定位点时，添加倾斜角有差别，camera.flyTo飞行到点有偏差
      // 方法一：viewer.flyTo
      this.viewer.entities.removeAll();
      let entity = new Cesium.Entity({
        id: currentChooseIndex,
        position: Cesium.Cartesian3.fromDegrees(particlePosition[0], particlePosition[1], particlePosition[2]),
        point: {
          pixelSize: 10,
          color: Cesium.Color.WHITE.withAlpha(0),
          outlineColor: Cesium.Color.WHITE.withAlpha(0),
          outlineWidth: 1
        }
      });
      this.viewer.entities.add(entity);
      this.viewer.flyTo(entity, {
        offset: {
          heading: Cesium.Math.toRadians(vm.heading || 0),
          pitch: Cesium.Math.toRadians(vm.pitch || -Cesium.Math.PI_OVER_FOUR),
          range: 0
        }
      });
      // 方法二：camera.flyTo
      // this.viewer.scene.camera.flyTo({
      //   destination: this.Cesium.Cartesian3.fromDegrees(particlePosition[0], particlePosition[1], particlePosition[2] + 250),
      //   orientation: {
      //     heading: Cesium.Math.toRadians(vm.heading || 0),                          //绕垂直于地心的轴旋转
      //     pitch: Cesium.Math.toRadians(vm.pitch || -Cesium.Math.PI_OVER_FOUR),      //绕纬度线旋转
      //     roll: Cesium.Math.toRadians(vm.roll || 0)                                 //绕经度线旋转
      //   },
      //   duration: 3
      // })
    },
    async createCesiumObject() {
      return new Promise(
          resolve => {
            resolve();
          },
          reject => {
          }
      );
    },
    setEffectOptions(effect) {
      this.emitterTypeCopy = effect.emitterType;
      this.emissionRateCopy = effect.emissionRate;
      this.imageSizeCopy = effect.imageSize;
      this.minimumParticleLifeCopy = effect.minimumParticleLife;
      this.maximumParticleLifeCopy = effect.maximumParticleLife;
      this.minimumSpeedCopy = effect.minimumSpeed;
      this.maximumSpeedCopy = effect.maximumSpeed;
      this.startScaleCopy = effect.startScale;
      this.endScaleCopy = effect.endScale;
      this.viewModel = effect;
    },
    mount() {
      const vm = this;
      let promise = this.createCesiumObject();
      promise.then(function (dataSource) {
        vm.$emit("load", vm);
      });
      // this.effectOptions = this.effectFireOptions;
      // this.setEffectOptions(this.effectFire[this.currentEffectName]);
    },
    unmount() {
      if (this.handlerAction) {
        this.handlerAction.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handlerAction = undefined;
      }
      if (this.$refs.tabPanel) {
        this.$refs.tabPanel.active = undefined
      }
      if (
          this.isLogarithmicDepthBufferEnable !==
          isLogarithmicDepthBufferEnable(this.viewer)
      ) {
        setLogarithmicDepthBufferEnable(
            this.isLogarithmicDepthBufferEnable,
            this.viewer
        );
      }
      this.$emit("unload", this);
    },
    removeAllParticle() {
      let vm = this;
      if (vm.particleArr.length > 0) {
        for (let i = 0; i < vm.particleArr.length; i++) {
          vm.particleArr[i].remove();
        }
      }
      // 粒子结果集
      this.particleArr = [];
      // 粒子列表
      this.particleListCopy = [];
    },
    // 删除
    onClearParticle(index) {
      let vm = this;
      const currentPage = this.pagination.current;
      const pageSize = this.pagination.pageSize;
      this.changeParticleIndex = index + (currentPage - 1) * pageSize;

      if (vm.particleArr.length > 0) {
        for (let i = 0; i < vm.particleArr.length; i++) {
          if (i === this.changeParticleIndex) {
            vm.particleArr[this.changeParticleIndex].remove();
          }
        }
      }
      // if (this.handlerAction) {
      //   this.handlerAction.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // }
      // 粒子结果集
      this.particleArr.splice(index, 1);
      // 粒子列表
      this.particleListCopy.splice(index, 1);
      // this.$emit("changeParticle", this.particleListCopy);
      this.$emit("changeParticle", this.particleListCopy);
    },
    tabChange(e) {
      this.activeKey = e;
      if (e === '2') {
        // 当tab切换到设置面板时，先判断粒子列表是否有选中粒子，若有则设置面板为该选中粒子的参数，否则为生成粒子时的初始化参数
        if (this.activeIndex === undefined) {
          this.changeParticleIndex = undefined;
          if (this.mode = 'create') {
            //选中符号，创建粒子时的参数
            const viewModelCopy = JSON.parse(JSON.stringify(this.viewModel));
            this.emitterTypeCopy = viewModelCopy.emitterType;
            this.emissionRateCopy = viewModelCopy.emissionRate;
            this.imageSizeCopy = viewModelCopy.imageSize;
            this.minimumParticleLifeCopy = viewModelCopy.minimumParticleLife;
            this.maximumParticleLifeCopy = viewModelCopy.maximumParticleLife;
            this.minimumSpeedCopy = viewModelCopy.minimumSpeed;
            this.maximumSpeedCopy = viewModelCopy.maximumSpeed;
            this.startScaleCopy = viewModelCopy.startScale;
            this.endScaleCopy = viewModelCopy.endScale;
          } else {
            //没有选中符号，并且没有选中粒子列表中粒子
            let initOperationConfig = {
              emitterType: "圆形放射",
              emissionRate: 2.0,
              imageSize: 5.0,
              minimumParticleLife: 2.0,
              maximumParticleLife: 3.0,
              minimumSpeed: 9.0,
              maximumSpeed: 9.5,
              startScale: 1.0,
              endScale: 4.0
            }
            this.emitterTypeCopy = initOperationConfig.emitterType;
            this.emissionRateCopy = initOperationConfig.emissionRate;
            this.imageSizeCopy = initOperationConfig.imageSize;
            this.minimumParticleLifeCopy = initOperationConfig.minimumParticleLife;
            this.maximumParticleLifeCopy = initOperationConfig.maximumParticleLife;
            this.minimumSpeedCopy = initOperationConfig.minimumSpeed;
            this.maximumSpeedCopy = initOperationConfig.maximumSpeed;
            this.startScaleCopy = initOperationConfig.startScale;
            this.endScaleCopy = initOperationConfig.endScale;
          }
        } else {
          // 选中粒子列表中的已有粒子时：
          const currentPage = this.pagination.current;
          const pageSize = this.pagination.pageSize;
          this.changeParticleIndex = this.activeIndex + (currentPage - 1) * pageSize;

          let currentParticle = Object.assign({}, this.particleListCopy[this.changeParticleIndex].param);

          this.emitterTypeCopy = currentParticle.emitterType;
          this.emissionRateCopy = currentParticle.emissionRate;
          this.imageSizeCopy = currentParticle.imageSize;
          this.minimumParticleLifeCopy = currentParticle.minimumParticleLife;
          this.maximumParticleLifeCopy = currentParticle.maximumParticleLife;
          this.minimumSpeedCopy = currentParticle.minimumSpeed;
          this.maximumSpeedCopy = currentParticle.maximumSpeed;
          this.startScaleCopy = currentParticle.startScale;
          this.endScaleCopy = currentParticle.endScale;

          // this.changeParticleIndex = this.activeIndex;
        }
      }
    },
    setParticleParameter(index) {
      this.activeKey = '2';
      this.mode = 'selected';
      const currentPage = this.pagination.current;
      const pageSize = this.pagination.pageSize;
      this.changeParticleIndex = index + (currentPage - 1) * pageSize;

      // 参数为该粒子的参数，初始化时是初始化参数，修改后是修改后存放在particleArr结果集中的参数。
      let currentParticle = Object.assign({}, this.particleListCopy[this.changeParticleIndex].param);
      // let currentParticle = clonedeep(this.particleListCopy[index].param);
      this.emitterTypeCopy = currentParticle.emitterType;
      this.emissionRateCopy = currentParticle.emissionRate;
      this.imageSizeCopy = currentParticle.imageSize;
      this.minimumParticleLifeCopy = currentParticle.minimumParticleLife;
      this.maximumParticleLifeCopy = currentParticle.maximumParticleLife;
      this.minimumSpeedCopy = currentParticle.minimumSpeed;
      this.maximumSpeedCopy = currentParticle.maximumSpeed;
      this.startScaleCopy = currentParticle.startScale;
      this.endScaleCopy = currentParticle.endScale;
    },
    onCreateParticle(tab) {
      // 先把面板参数重设
      this.mode = 'create';
      // this.setEffectOptions(this.viewModel);
      this.viewModel = Object.assign({}, tab.config);
      this.changeParticleIndex = undefined;

      this.imgUrl = tab.image;
      this.title = tab.title;
      this.symbolGuid = tab.guid;
      if (!this.handlerAction) {
        this._addEventListener();
      }
    },

    _addEventListener() {
      this.handlerAction = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      this.handlerAction.setInputAction(event => {
        this._registerMouseLClickEvent(event);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    _registerMouseLClickEvent(event) {
      // 获取点击点的笛卡尔坐标
      const cartesian = this.viewer.getCartesian3Position(
          event.position
      );
      // 获取当前坐标系标准
      const ellipsoid = this.viewer.scene.globe.ellipsoid;
      // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);

      // 粒子特效初始参数
      const viewModel = this.viewModel;

      // 获取该位置的经纬度坐标
      let degrees = {};
      const longitude = parseFloat(
          this.Cesium.Math.toDegrees(cartographic.longitude).toFixed(8)
      );
      const latitude = parseFloat(
          this.Cesium.Math.toDegrees(cartographic.latitude).toFixed(8)
      );
      degrees.longitude = longitude;
      degrees.latitude = latitude;
      degrees.height = cartographic.height;
      this.createParticleEffects(degrees, viewModel);

      // 粒子列表新增一个粒子
      let param = Object.assign({}, this.viewModel);

      param.position = degrees;
      param.symbolGuid = this.symbolGuid;
      const guid = newGuid();

      let particleItem;
      particleItem = {
        name: this.title.concat(this.particleArr.length),
        guid: guid,
        imageUrl: this.imgUrl,
        isShow: true,
        param: param
      }
      this.particleListCopy.push(particleItem);
      this.$emit("changeParticle", this.particleListCopy);
    },
    createParticleEffects(degrees, viewModel) {
      let vm = this;
      let emitterTypeCesium = vm.changeEmitterTypeCesium(viewModel.emitterType);

      this.isLogarithmicDepthBufferEnable = isLogarithmicDepthBufferEnable(
          this.viewer
      );
      if (this.isLogarithmicDepthBufferEnable === true) {
        setLogarithmicDepthBufferEnable(false, this.viewer);
      }
      // 开启计时
      this.viewer.clock.shouldAnimate = true;

      // 创建粒子特效
      let particle = new this.Cesium.StableParticle(this.viewer, this.imgUrl, [degrees.longitude, degrees.latitude, degrees.height], {
        startColor: new this.Cesium.Color(1, 1, 1, 1),
        emissionRate: viewModel.emissionRate,
        imageSize: new this.Cesium.Cartesian2(viewModel.imageSize, viewModel.imageSize),
        minimumParticleLife: viewModel.minimumParticleLife,
        maximumParticleLife: viewModel.maximumParticleLife,
        minimumSpeed: viewModel.minimumSpeed,
        maximumSpeed: viewModel.maximumSpeed,
        startScale: viewModel.startScale,
        endScale: viewModel.endScale,
        emitter: emitterTypeCesium,
        gravity: 0.5,
        heading: 0.0,
        pitch: 0.0,
        roll: 0.0,
        minimumPixelSize: 64.0,
        endColor: this.Cesium.Color.WHITE.withAlpha(0.0),
        minimumImageSize: new this.Cesium.Cartesian2(25.0, 25.0),
        maximumImageSize: new this.Cesium.Cartesian2(25.0, 25.0),
        lifetime: 16.0,
        viewHeight: -1,
      });
      particle.start();

      this.particleArr.push(particle);

      // 存储粒子的参数列表
      // this.particleListCopy.push(viewModel);
      // 粒子参数设置绑定UI
      this.Cesium.knockout.track(viewModel);

      // 注销鼠标的各项监听事件
      // if (this.handlerAction) {
      //   this.handlerAction.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // }
    },
    onEmitterChange(value) {
      let emitter = this.changeEmitterTypeCesium(value);
      for (let i = 0; i < this.particleArr.length; i++) {
        if (i === this.changeParticleIndex && this.mode === 'selected') {
          this.particleArr[i].emitter = emitter;
          this.particleListCopy[i].param.emitterType = value;
          this.$emit("changeParticle", this.particleListCopy);
        } else if (this.mode === 'create') {
          this.viewModel.emitterType = value
        }
      }
    },
    changeEmitterTypeCesium(value) {
      let emitter;
      switch (value) {
        case "盒状放射":
          emitter = new this.Cesium.BoxEmitter(
              new this.Cesium.Cartesian3(5.0, 5.0, 5.0)
          );
          break;
        case "圆形放射":
          emitter = new this.Cesium.CircleEmitter(5.0);
          break;
        case "锥形放射":
          emitter = new this.Cesium.ConeEmitter(
              this.Cesium.Math.toRadians(30.0)
          );
          break;
        case "球形放射":
          emitter = new this.Cesium.SphereEmitter(5.0);
          break;

        default:
          break;
      }
      return emitter;
    },
    onChangeEffect(val, key) {
      if (this.particleArr.length > 0) {
        for (let i = 0; i < this.particleArr.length; i++) {
          if (i === this.changeParticleIndex && this.mode === 'selected') {
            if (key === "imageSize") {
              this.particleArr[i].maximumImageSize = new this.Cesium.Cartesian2(val, val);
              this.particleArr[i].minimumImageSize = new this.Cesium.Cartesian2(val, val);
              this.particleListCopy[i].param.imageSize = val;
            } else {
              this.particleArr[i][key] = val;
              this.particleListCopy[i].param[key] = val;
            }
            this.$emit("changeParticle", this.particleListCopy);
          } else if (this.mode === 'create') {
            if (key === "imageSize") {
              this.viewModel.imageSize = val;
            } else {
              this.viewModel[key] = val;
            }
          }
        }
      }
    },
    // 对粒子列表中已有的粒子进行显隐操作
    showOrHide(index) {
      let vm = this;
      const currentPage = this.pagination.current;
      const pageSize = this.pagination.pageSize;
      const changeParticleIndex = index + (currentPage - 1) * pageSize;
      if (vm.particleListCopy[changeParticleIndex].isShow) {
        // 隐藏
        vm.particleListCopy[changeParticleIndex].isShow = false;
        vm.particleArr[changeParticleIndex].remove();
      } else {
        // 显示
        vm.particleListCopy[changeParticleIndex].isShow = true;
        vm.showParticleEffects(changeParticleIndex);
      }
      this.$emit("changeParticle", this.particleListCopy);
    },
    // 对隐藏的粒子进行显示
    showParticleEffects(index) {
      let vm = this;
      let oneParticle = Object.assign({}, vm.particleListCopy[index].param);
      let emitterTypeCesium = vm.changeEmitterTypeCesium(oneParticle.emitterType);
      const imgUrl = vm.particleListCopy[index].imageUrl;
      const degrees = oneParticle.position;
      // 开启计时
      this.viewer.clock.shouldAnimate = true;
      // 创建粒子特效
      let particle = new this.Cesium.StableParticle(this.viewer, imgUrl, [degrees.longitude, degrees.latitude, degrees.height], {
        startColor: new this.Cesium.Color(1, 1, 1, 1),
        emissionRate: oneParticle.emissionRate,
        imageSize: new this.Cesium.Cartesian2(oneParticle.imageSize, oneParticle.imageSize),
        minimumParticleLife: oneParticle.minimumParticleLife,
        maximumParticleLife: oneParticle.maximumParticleLife,
        minimumSpeed: oneParticle.minimumSpeed,
        maximumSpeed: oneParticle.maximumSpeed,
        startScale: oneParticle.startScale,
        endScale: oneParticle.endScale,
        emitter: emitterTypeCesium,
        gravity: 0.5,
        heading: 0.0,
        pitch: 0.0,
        roll: 0.0,
        minimumPixelSize: 64.0,
        endColor: this.Cesium.Color.WHITE.withAlpha(0.0),
        minimumImageSize: new this.Cesium.Cartesian2(25.0, 25.0),
        maximumImageSize: new this.Cesium.Cartesian2(25.0, 25.0),
        lifetime: 16.0,
        viewHeight: -1,
      });
      particle.start();
      vm.particleArr[index] = particle;
    },

    listPagination() {
      return this.isBatch ? false : this.pagination;
    },
    /**
     * 列表中checbox事件
     */
    _changeItemChecked(id, event) {
      const checked = event.target.checked;
      if (checked) {
        if (!this.selectedIds.includes(id)) {
          this.selectedIds.push(id);
        }
      } else {
        if (this.selectedIds.includes(id)) {
          const index = this.selectedIds.indexOf(id);
          if (index > -1) {
            this.selectedIds.splice(index, 1);
          }
        }
      }
    },

    /**
     * 是否批量操作
     */
    _changeBatch({target}) {
      this.isBatch = target.checked;
    },
    /**
     * 批量隐藏
     */
    allInvisible() {
      let vm = this;
      const {selectedIds, pagination} = this;
      const currentPage = pagination.current;
      const pageSize = pagination.pageSize;
      for (let i = 0; i < selectedIds.length; i++) {
        const currentChooseIndex = selectedIds[i] + (currentPage - 1) * pageSize;
        if (vm.particleListCopy[currentChooseIndex].isShow) {
          // 隐藏
          vm.particleListCopy[currentChooseIndex].isShow = false;
          vm.particleArr[currentChooseIndex].remove();
        }
      }
    },
    /**
     * 批量显示
     */
    allVisible() {
      let vm = this;
      const {selectedIds, pagination} = this;
      const currentPage = pagination.current;
      const pageSize = pagination.pageSize;
      for (let i = 0; i < selectedIds.length; i++) {
        // 显示
        const currentChooseIndex = selectedIds[i] + (currentPage - 1) * pageSize;
        if (!vm.particleListCopy[currentChooseIndex].isShow) {
          vm.particleListCopy[currentChooseIndex].isShow = true;
          vm.showParticleEffects(currentChooseIndex);
        }
      }
    },
    /**
     * 批量删除
     */
    allDelete() {
      let vm = this;
      const {selectedIds, pagination} = this;
      const currentPage = pagination.current;
      const pageSize = pagination.pageSize;
      let indexArr = [];
      // 移除被选中的删除项
      for (let i = 0; i < selectedIds.length; i++) {
        const currentChooseIndex = selectedIds[i] + (currentPage - 1) * pageSize;
        indexArr.push(currentChooseIndex);
        vm.particleArr[currentChooseIndex].remove();
      }
      indexArr = indexArr.sort();
      for (let j = indexArr.length - 1; j >= 0; j--) {
        vm.particleListCopy.splice(indexArr[j], 1);
        vm.particleArr.splice(indexArr[j], 1);
      }
      this.selectedIds = [];
    },
  }
};
</script>
<style scoped>
::v-deep .mapgis-ui-tabs-nav .mapgis-ui-tabs-tab {
  margin: 0;
}

::v-deep .mapgis-ui-tabs-nav-scroll {
  display: flex;
  justify-content: flex-start;
}

.list-pane {
  position: relative;
}

.pagination-div {
  bottom: 0;
  position: absolute;
  width: 100%;
}

.pagination {
  padding: 6px 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 6px;
  width: 100%;
  border-top: 1px solid var(--border-color-split);
}

.full-width {
  width: 100%;
}

.control-button {
  width: calc(32% - 2.5px);
  margin: 0 1px;
}

::v-deep .mapgis-ui-list-pagination {
  margin-top: 12px;
  display: none;
}

.item-checkbox {
  float: right;
}
</style>
