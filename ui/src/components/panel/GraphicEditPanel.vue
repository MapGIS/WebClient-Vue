<template>
  <div>
    <mapgis-ui-card
      :tab-list="tabListNoTitle"
      :active-tab-key="noTitleKey"
      :bodyStyle="cardBodyStyle"
      :tabBarStyle="tabBarStyle"
      @tabChange="key => onTabChange(key, 'noTitleKey')"
    >
      <!--标注列表-->
      <div
        :style="{
          height: listHeight + 'px',
          'overflow-y': dataSourceCopy.length >= scrollNum ? 'scroll' : 'hidden'
        }"
        class="mapgis-ui-graphic-edit-list"
        v-show="noTitleKey === 'list'"
      >
        <div :key="index" v-for="(row, index) in dataSourceCopy">
          <mapgis-ui-icon-row
            @clickTool="$_clickTool($event, row)"
            @dblclick="$_dbclick($event, row)"
            @open="$_open($event, row)"
            :iconStyle="iconStyle"
            :mainStyle="rowStyle"
            :top="index < dataSourceCopy.length - 3 || index < 3"
            :enableGroup="row.type === 'group'"
            :src="icons[row.type + 'Image']"
            :title="row.attributes.title"
          >
            <div
              slot="checkbox"
              class="item-checkbox"
              v-if="row.type !== 'group'"
            >
              <mapgis-ui-checkbox
                v-show="isBatch"
                :checked="selectedIds.includes(row.id)"
                @change="$_changeItemChecked(row.id, $event)"
              >
              </mapgis-ui-checkbox>
            </div>
          </mapgis-ui-icon-row>
          <mapgis-ui-input
            @change="$_changeTitle"
            class="mapgis-ui-graphic-edit-list-input"
            v-show="editTitleGraphicId === row.id"
            v-model="row.attributes.title"
          />
          <mapgis-ui-button
            v-show="editTitleGraphicId === row.id"
            @click="$_finishEditTitle(row.attributes.title)"
            style="height: 30px;"
            type="primary"
            >完成修改
          </mapgis-ui-button>
          <div v-if="row.type === 'group'" v-show="openGroup === row.id">
            <mapgis-ui-icon-row
              :key="gIndex"
              v-for="(graphic, gIndex) in graphicGroups"
              @clickTool="$_clickTool($event, graphic)"
              @dblclick="$_dbclick($event, graphic)"
              :iconStyle="iconStyle"
              :mainStyle="groupRowStyle"
              :top="gIndex < graphicGroups.length - 3 || gIndex < 3"
              :src="icons[graphic.type + 'Image']"
              :title="graphic.name"
            >
              <div slot="checkbox" class="item-checkbox">
                <mapgis-ui-checkbox
                  v-show="isBatch"
                  :checked="selectedIds.includes(graphic.id)"
                  @change="$_changeItemChecked(graphic.id, $event)"
                >
                </mapgis-ui-checkbox>
              </div>
            </mapgis-ui-icon-row>
          </div>
        </div>
        <!-- 批量操作 -->
        <mapgis-ui-setting-footer>
          <div v-show="isBatch" class="footer-div">
            <mapgis-ui-button @click="$_batchShow" class="footer-btn"
              >显示</mapgis-ui-button
            >
            <mapgis-ui-button @click="$_batchHide" class="footer-btn"
              >隐藏</mapgis-ui-button
            >
            <mapgis-ui-button @click="$_batchDelete" class="footer-btn"
              >删除</mapgis-ui-button
            >
          </div>
        </mapgis-ui-setting-footer>
      </div>
      <!--设置面板-->
      <div
        v-show="noTitleKey === 'edit'"
        style="min-height: 200px;max-height: 430px;overflow:auto;"
      >
        <div
          v-show="editPanelValues && editType === 'edit'"
          style="margin-bottom: 12px;"
        >
          <mapgis-ui-title-row-left
            title="类型"
            :value="$_formatType(currentEditType)"
          />
          <div :key="index" v-for="(row, index) in editList[currentEditType]">
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInput'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="['image', 'rectangleText'].indexOf(row.key) < 0"
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInput'"
              :title="row.title"
              type="Image"
              :uploadUrl="uploadUrl"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'image' &&
                  ['PolylineTrailLink', 'Image'].indexOf(
                    editPanelValues.materialType
                  ) > -1
              "
            >
            </mapgis-ui-input-row-left>
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInput'"
              :title="row.title"
              type="Image"
              :uploadUrl="uploadUrl"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'image' &&
                  (currentEditType === 'billboard' ||
                    currentEditType === 'marker')
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInput'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'rectangleText' &&
                  editPanelValues.materialType === 'text'
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                [
                  'rtFontSize',
                  'flashTime',
                  'alphaSpace',
                  'flashAlpha',
                  'outlineWidth',
                  'backgroundPadding',
                  'speed',
                  'duration',
                  'gradient',
                  'count',
                  'direction',
                  'stRotation',
                  'repeatX',
                  'repeatY',
                  'offsetHeight',
                  'labelPadding'
                ].indexOf(row.key) < 0
              "
            />
            <!-- elevationMode的值2，1，0，-1 -->
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'offsetHeight' &&
                  (editPanelValues.elevationMode === undefined ||
                    editPanelValues.elevationMode === -1)
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="row.key === 'outlineWidth' && showOutline"
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="row.key === 'backgroundPadding' && showBackground"
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'speed' &&
                  editPanelValues.materialType === 'RadarMaterial'
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'duration' &&
                  ['PolylineTrailLink', 'CircleWaveMaterial'].indexOf(
                    editPanelValues.materialType
                  ) > -1
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'gradient' &&
                  editPanelValues.materialType === 'CircleWaveMaterial'
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'count' &&
                  editPanelValues.materialType === 'CircleWaveMaterial'
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'stRotation' &&
                  editPanelValues.materialType === 'Image'
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'repeatX' &&
                  editPanelValues.materialType === 'Image'
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'repeatY' &&
                  editPanelValues.materialType === 'Image'
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'flashAlpha' &&
                  editPanelValues.materialType === 'flash'
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'alphaSpace' &&
                  editPanelValues.materialType === 'flash'
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'flashTime' &&
                  editPanelValues.materialType === 'flash'
              "
            />
            <mapgis-ui-input-row-left
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'rtFontSize' &&
                  editPanelValues.materialType === 'text'
              "
            />
            <!-- 特殊：marker标注“文字相对图片位置”编辑栏 -->
            <mapgis-ui-input-row-right
              v-if="row.type === 'MapgisUiInputNumber'"
              :title="row.title"
              type="Number"
              v-model="editPanelValues[row.key]"
              v-show="row.key === 'labelPadding'"
            />
            <mapgis-ui-slider-row-left
              v-if="row.type === 'MapgisUiSlider'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="
                [
                  'outlineOpacity',
                  'backgroundOpacity',
                  'materialOpacity',
                  'rtBackgroundOpacity'
                ].indexOf(row.key) < 0
              "
            />
            <mapgis-ui-slider-row-left
              v-if="row.type === 'MapgisUiSlider'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="row.key === 'outlineOpacity' && showOutline"
            />
            <mapgis-ui-slider-row-left
              v-if="row.type === 'MapgisUiSlider'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="row.key === 'backgroundOpacity' && showBackground"
            />
            <mapgis-ui-slider-row-left
              v-if="row.type === 'MapgisUiSlider'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'materialOpacity' &&
                  ['Color', 'PolylineTrailLink'].indexOf(
                    editPanelValues.materialType
                  ) > -1
              "
            />
            <mapgis-ui-slider-row-left
              v-if="row.type === 'MapgisUiSlider'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'rtBackgroundOpacity' &&
                  editPanelValues.materialType === 'text'
              "
            />
            <mapgis-ui-select-row-left
              v-if="row.type === 'MapgisUiSelect'"
              :title="row.title"
              :dataSource="row.dataSource"
              v-model="editPanelValues[row.key]"
              v-show="
                ['direction', 'rtFontFamily', 'labelPlaceType'].indexOf(
                  row.key
                ) < 0
              "
            />
            <mapgis-ui-select-row-left
              v-if="row.type === 'MapgisUiSelect'"
              :title="row.title"
              :dataSource="row.dataSource"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'direction' &&
                  editPanelValues.materialType === 'PolylineTrailLink'
              "
            />
            <mapgis-ui-select-row-left
              v-if="row.type === 'MapgisUiSelect'"
              :title="row.title"
              :dataSource="row.dataSource"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'rtFontFamily' &&
                  editPanelValues.materialType === 'text'
              "
            />
            <!-- 图片+文字标注中，文字相对图片位置专用，左侧字符较长，右侧选择列表要设置宽度 -->
            <mapgis-ui-select-row-right
              v-if="row.type === 'MapgisUiSelect'"
              :title="row.title"
              :dataSource="row.dataSource"
              v-model="editPanelValues[row.key]"
              v-show="row.key === 'labelPlaceType'"
            />
            <mapgis-ui-color-picker-left
              v-if="row.type === 'MapgisUiColorPicker'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="
                [
                  'outlineColor',
                  'backgroundColor',
                  'materialColor',
                  'pureColor',
                  'linkColor',
                  'rtBackgroundColor'
                ].indexOf(row.key) < 0
              "
            />
            <mapgis-ui-color-picker-left
              v-if="row.type === 'MapgisUiColorPicker'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="row.key === 'outlineColor' && showOutline"
            />
            <mapgis-ui-color-picker-left
              v-if="row.type === 'MapgisUiColorPicker'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="row.key === 'backgroundColor' && showBackground"
            />
            <mapgis-ui-color-picker-left
              v-if="row.type === 'MapgisUiColorPicker'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'materialColor' &&
                  ['Color', 'RadarMaterial', 'CircleWaveMaterial'].indexOf(
                    editPanelValues.materialType
                  ) > -1
              "
            />
            <mapgis-ui-color-picker-left
              v-if="row.type === 'MapgisUiColorPicker'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'linkColor' &&
                  ['PolylineTrailLink'].indexOf(editPanelValues.materialType) >
                    -1
              "
            />
            <mapgis-ui-color-picker-left
              v-if="row.type === 'MapgisUiColorPicker'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'pureColor' &&
                  editPanelValues.materialType === 'Color'
              "
            />
            <mapgis-ui-color-picker-left
              v-if="row.type === 'MapgisUiColorPicker'"
              :title="row.title"
              v-model="editPanelValues[row.key]"
              v-show="
                row.key === 'rtBackgroundColor' &&
                  editPanelValues.materialType === 'text'
              "
            />
            <mapgis-ui-choose-picture-right
              v-if="row.type === 'MapgisUiPicture'"
              :showTitleIcon="false"
              :title="row.title"
              :carouselStyle="carouselStyle"
              :titleStyle="pTitleStyle"
              v-model="editPanelValues[row.key]"
              :enablePreview="false"
            />
            <mapgis-ui-switch-row-left
              v-if="row.type === 'MapgisUiShowOutline'"
              :title="row.title"
              checkTitle="收起"
              unCheckTitle="展开"
              @change="$_showOutLine"
              v-model="showOutline"
            />
            <mapgis-ui-switch-row-left
              v-if="row.type === 'MapgisUiSwitch'"
              :title="row.title"
              @change="$_isHermiteSpline"
              v-model="row.value"
              v-show="row.key === 'isHermiteSpline'"
            />
            <mapgis-ui-switch-row-left
              v-if="row.type === 'MapgisUiShowBackground'"
              :title="row.title"
              checkTitle="收起"
              unCheckTitle="展开"
              @change="$_showBackground"
              v-model="showBackground"
            />
            <mapgis-ui-switch-row-left
              v-if="row.type === 'MapgisUiLoop'"
              :title="row.title"
              @change="$_loop"
              v-model="editPanelValues[row.key]"
            />
          </div>
          <mapgis-ui-graphic-model-edit-panel
            v-if="
              currentEditType === 'model' &&
                editPanelValues &&
                editPanelValues.positions
            "
            :positions.sync="editPanelValues.positions"
            :orientation.sync="editPanelValues.orientation"
            @pickCoords="$_pickCoords"
            @editPositions="$_editPositions"
            @location="$_location"
            @editOrientation="$_editOrientation"
            @resetOrientation="$_resetOrientation"
          ></mapgis-ui-graphic-model-edit-panel>
        </div>
        <div v-show="editType === 'popup'">
          <div :key="index" v-for="(value, index) in attributeKeyArray">
            <mapgis-ui-input-row-left
              v-if="value === 'title'"
              title="标题"
              paddingRight="4px"
              :enableDelete="true"
              @delete="$_delete(index)"
              v-model="attributeValueArray[index]"
            />
            <mapgis-ui-input-row-left
              v-else
              :title="value"
              paddingRight="4px"
              :enableDelete="true"
              @delete="$_delete(index)"
              v-model="attributeValueArray[index]"
            />
          </div>
          <div
            class="mapgis-ui-graphic-edit-addAttribute"
            v-show="addAttribute"
          >
            <div>
              <span style="font-size: 14px;">属性名</span>
              <mapgis-ui-input
                class="mapgis-ui-graphic-edit-addAttribute-input"
                v-model="attributeKey"
              />
            </div>
            <div style="padding-top: 8px;">
              <span style="font-size: 14px;">属性值</span>
              <mapgis-ui-input
                class="mapgis-ui-graphic-edit-addAttribute-input"
                v-model="attributeValue"
              />
            </div>
          </div>
          <mapgis-ui-button
            type="primary"
            class="mapgis-ui-graphic-edit-addAttribute-add"
            :style="{
              'margin-top': attributeKeyArray.length > 0 ? '0' : '7px'
            }"
            @click="$_addAttribute"
          >
            {{ addAttributeTitle }}
          </mapgis-ui-button>
        </div>
        <div v-if="editPanelValues" v-show="editType === 'batch'">
          <mapgis-ui-input-row-left
            title="比例尺"
            type="Number"
            v-model="editPanelValues.scale"
          />
          <mapgis-ui-input-row-left
            title="Z轴旋转"
            type="Number"
            v-model="editPanelValues.heading"
          />
          <mapgis-ui-input-row-left
            title="Y轴旋转"
            type="Number"
            v-model="editPanelValues.pitch"
          />
          <mapgis-ui-input-row-left
            title="X轴旋转"
            type="Number"
            v-model="editPanelValues.roll"
          />
        </div>
      </div>
      <mapgis-ui-checkbox
        v-show="noTitleKey === 'list'"
        slot="tabBarExtraContent"
        @change="$_changeBatch"
      >
        批量操作
      </mapgis-ui-checkbox>
    </mapgis-ui-card>
  </div>
</template>

<script>
import icons from "../iconfont/GraphicBase64Icons";

export default {
  name: "mapgis-ui-graphic-edit-panel",
  props: {
    editList: {
      type: Object
    },
    dataSource: {
      type: Array,
      default() {
        return [];
      }
    },
    //当前编辑的类型
    currentEditType: {
      type: String
    },
    graphicGroups: {
      type: Array,
      default() {
        return [];
      }
    },
    uploadUrl: {
      type: String,
      default: ""
    }
  },
  watch: {
    editPanelValues: {
      handler: function() {
        if (this.isUpdatePanel && !this.editTitle) {
          if (this.editType === "batch") {
            this.$emit("changeGroup", this.editPanelValues, this.groupId);
          } else {
            this.$emit("change", this.editPanelValues, this.isEdit);
          }
        }
      },
      deep: true
    },
    dataSource: {
      handler: function() {
        this.dataSourceCopy = JSON.parse(JSON.stringify(this.dataSource));
        if (this.dataSource.length > 0 && !this.editTitle) {
          //获取设置面板显示参数
          if (this.isUpdatePanel) {
            this.editPanelValues = this.$_getEditPanelValuesFromJSON(
              this.dataSourceCopy[this.dataSourceCopy.length - 1]
            );
            this.noTitleKey = "edit";
            this.isEdit = true;
          }
        }
      },
      deep: true
    }
  },
  data() {
    return {
      isBatch: false, //是否批量操作
      selectedIds: [], //选中要素的id集合
      //切换面板参数
      tabListNoTitle: [
        {
          key: "list",
          tab: "标注列表"
        },
        {
          key: "edit",
          tab: "设置面板"
        }
      ],
      //当前显示面板
      noTitleKey: "list",
      //tab框的body样式
      cardBodyStyle: {
        padding: "0"
      },
      tabBarStyle: {
        margin: "0",
        textAlign: "center"
        // borderBottom: "1px solid #F0F0F0"
      },
      //标注列表一行中的图标样式
      iconStyle: {
        marginTop: "-4px"
      },
      //标注列表一行的样式
      rowStyle: {
        height: "40px",
        lineHeight: "40px",
        paddingLeft: "20px"
      },
      //标注列表组一行的样式
      groupRowStyle: {
        height: "40px",
        lineHeight: "40px",
        paddingLeft: "54px"
      },
      //名称输入框样式
      mainStyle: {
        width: "220px"
      },
      //滑动组件主体样式
      sliderMainStyle: {
        width: "106px",
        marginLeft: "-13px"
      },
      //滑动组件右边输入框样式
      sliderInputStyle: {
        marginLeft: "-64px"
      },
      //下拉框组件主体样式
      selectMainStyle: {
        width: "220px",
        marginLeft: "-28px"
      },
      //颜色选择器主体样式
      colorMainStyle: {
        width: "220px",
        marginLeft: "13px"
      },
      //本地图片样式
      carouselStyle: {
        paddingRight: "11px"
      },
      //本地图片样式
      pTitleStyle: {
        fontWeight: "normal"
      },
      //名称输入框的标题样式
      titleStyle: {
        marginLeft: "24px"
      },
      //图标资源
      icons: icons,
      //设置面板的显示数据
      editPanelValues: undefined,
      //是否进行编辑
      isEdit: true,
      //是都更新面板
      isUpdatePanel: true,
      //当前的属性面板参数
      attributeKeyArray: [],
      attributeValueArray: [],
      //是否添加属性
      addAttribute: false,
      //属性名
      attributeKey: "",
      //属性值
      attributeValue: "",
      //添加属性按钮名称
      addAttributeTitle: "添加属性",
      //当前的GraphicId
      currentGraphicId: undefined,
      //展开组
      openGroup: undefined,
      //要编辑标题的标会对象ID
      editTitleGraphicId: undefined,
      //是否编辑标题
      editTitle: false,
      //列表高度
      listHeight: 200,
      //添加滚动条的数量
      scrollNum: 5,
      //是否展开外边线参数
      showOutline: false,
      //是否展开北京参数
      showBackground: false,
      groupId: undefined,
      dataSourceCopy: [],
      editType: "edit"
    };
  },
  mounted() {
    let canvas = document.getElementsByClassName("mapboxgl-canvas");
    if (canvas && canvas.length > 0) {
      this.listHeight =
        canvas[0].offsetHeight - 370 > 200
          ? canvas[0].offsetHeight - 370 > 200
          : 200;
      this.scrollNum = Math.ceil(this.listHeight / 40);
    }
  },
  methods: {
    $_resetEditPanel() {
      this.noTitleKey = "list";
    },
    $_changeTitle() {
      this.editTitle = true;
      this.$emit("editTitle", true);
    },
    $_finishEditTitle(title) {
      this.$emit("editTitle", false, title, this.editTitleGraphicId);
      this.editTitleGraphicId = undefined;
      this.editTitle = false;
    },
    $_addAttribute() {
      if (this.addAttribute) {
        this.addAttributeTitle = "添加属性";
        let hasSameKey = false,
          index = 0;
        for (let i = 0; i < this.attributeKeyArray.length; i++) {
          if (this.attributeKeyArray[i] === this.attributeKey) {
            index = i;
            hasSameKey = true;
            break;
          }
        }
        if (hasSameKey) {
          this.attributeValueArray[index] = this.attributeValue;
        } else {
          this.attributeKeyArray.push(this.attributeKey);
          this.attributeValueArray.push(this.attributeValue);
        }
        //更新属性
        let attributes = {};
        for (let i = 0; i < this.attributeKeyArray.length; i++) {
          attributes[this.attributeKeyArray[i]] = this.attributeValueArray[i];
        }
        this.$emit("changeAttributes", attributes, this.editPanelValues.id);
      } else {
        this.addAttributeTitle = "确定添加";
        this.attributeKey = "";
        this.attributeValue = "";
      }
      this.addAttribute = !this.addAttribute;
    },
    test() {
      this.$emit("test");
    },
    $_setEditPanelValues(editPanelValues) {
      const { attributes } = editPanelValues;
      let vm = this;
      this.isUpdatePanel = false;
      this.editPanelValues = editPanelValues;
      if (attributes) {
        this.attributeKeyArray = [];
        this.attributeValueArray = [];
        Object.keys(attributes).forEach(function(key) {
          if (key !== "title") {
            vm.attributeKeyArray.push(key);
            vm.attributeValueArray.push(attributes[key]);
          }
        });
      }
      this.$nextTick(function() {
        this.isUpdatePanel = true;
      });
    },
    /**
     * 是否批量操作
     */
    $_changeBatch({ target }) {
      this.isBatch = target.checked;
    },
    /**
     * 列表中checbox事件
     */
    $_changeItemChecked(id, event) {
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
    $_batchShow() {
      this.$emit("batchOperate", {
        operate: "batchShow",
        selectedIds: this.selectedIds
      });
    },
    $_batchHide() {
      this.$emit("batchOperate", {
        operate: "batchHide",
        selectedIds: this.selectedIds
      });
    },
    $_batchDelete() {
      this.$emit("batchOperate", {
        operate: "batchDelete",
        selectedIds: this.selectedIds
      });
      // 删除后，重置selectedIds
      this.selectedIds = [];
    },
    onTabChange(key, type) {
      this[type] = key;
      //进制编辑
      if (this.noTitleKey === "list") {
        this.isEdit = false;
        this.$emit("stopDrawing");
      } else {
        this.isEdit = true;
      }
    },
    $_dbclick(event, json, noEmit) {
      if (json.type === "group") {
        return;
      }
      //显示设置面板
      this.noTitleKey = "edit";
      //设置为编辑状态
      this.isEdit = true;
      //获取当前GraphicId
      this.currentGraphicId = json.id;
      if (!noEmit) {
        this.$emit("dblclick", json);
      }
    },
    $_open(open, row) {
      if (open) {
        this.openGroup = row.id;
        this.$emit("open", row.attributes.title);
      } else {
        this.openGroup = undefined;
      }
    },
    $_clickTool(type, row) {
      if (type === "editTitle") {
        this.editTitleGraphicId = row.id;
      }
      if (row.type === "group" && type === "edit") {
        //显示批处理面板
        this.noTitleKey = "batch";
        this.groupId = row.id;
      }
      this.$emit("clickTool", type, row);
    },
    $_showOutLine(e) {
      this.showOutline = e;
    },
    $_isHermiteSpline(e) {
      this.editPanelValues.isHermiteSpline = e;
    },
    $_showBackground(e) {
      this.showBackground = e;
    },
    $_loop(e) {
      this.editPanelValues.loop = e;
    },
    $_cartesian3ToLongLat(cartesian3) {
      let position = {};
      let graphicPosition = Cesium.Cartographic.fromCartesian(cartesian3);
      position.lat = Cesium.Math.toDegrees(graphicPosition.latitude);
      position.lng = Cesium.Math.toDegrees(graphicPosition.longitude);
      position.alt = graphicPosition.height;
      return position;
    },
    /**
     * 从一个绘制要素的JSON对象中取得设置面板显示参数
     * @param json Object 一个绘制要素的JSON对象
     * @return editPanelValues Object 设置面板里面要显示的数值
     * */
    $_getEditPanelValuesFromJSON(json) {
      if (!json || !(json instanceof Object) || JSON.stringify(json) === "{}") {
        console.warn("json对象不能为空！");
        return;
      }
      if (!json.hasOwnProperty("type") || !json.hasOwnProperty("id")) {
        console.warn("type或者id不存在！");
        return;
      }
      const {
        id,
        positions,
        style = {},
        editPointStyle,
        attributes = {},
        name,
        show,
        editing,
        allowPicking,
        modelMatrix,
        asynchronous,
        heading,
        pitch,
        roll
      } = json;

      const {
        text,
        font,
        color,
        fillColor,
        backgroundColor,
        outlineWidth,
        outlineColor,
        image,
        extrudedHeight,
        width,
        height,
        topRadius,
        backgroundOpacity,
        backgroundPadding,
        bottomRadius,
        pixelSize,
        radius,
        materialType,
        material,
        cornerType,
        radiusX,
        radiusY,
        radiusZ,
        url,
        scale,
        addHeight,
        stRotation,
        isHermiteSpline,
        offsetHeight,
        loop,
        elevationMode,
        // marker style
        abelStyle,
        illboardStyle,
        labelPlaceType,
        labelPadding
      } = style;

      const { title, __flashStyle } = attributes;

      let editPanelValues = {},
        vm = this;

      //取得属性面板参数，由于object无法设置顺序，因此使用数组代替
      vm.attributeKeyArray = [];
      vm.attributeValueArray = [];
      Object.keys(attributes).forEach(function(key) {
        vm.attributeKeyArray.push(key);
        vm.attributeValueArray.push(attributes[key]);
      });

      let type = json.type;
      if (
        type === "circle" &&
        this.currentEditType !== "circle" &&
        this.currentEditType !== "mouse"
      ) {
        type = "cone";
      }
      switch (type) {
        case "point":
          editPanelValues.id = id;
          editPanelValues.color =
            "rgb(" +
            color[0] * 255 +
            "," +
            color[1] * 255 +
            "," +
            color[2] * 255 +
            ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.pixelSize = pixelSize;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.outlineWidth = outlineWidth;
          editPanelValues.outlineOpacity = outlineColor[3] * 100;
          editPanelValues.outlineColor =
            "rgb(" +
            outlineColor[0] * 255 +
            "," +
            outlineColor[1] * 255 +
            "," +
            outlineColor[2] * 255 +
            ")";
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "label":
          editPanelValues.id = id;
          editPanelValues.text = text;
          editPanelValues.title = title;
          editPanelValues.name = name;
          editPanelValues.offsetHeight = offsetHeight;
          let fonts;
          if (typeof font === "number") {
            fonts = [font, "sans-serif"];
          } else if (font.indexOf(" ") > -1) {
            fonts = font.split(" ");
          } else {
            fonts = [font, "sans-serif"];
          }
          editPanelValues.fontSize = fonts[0];
          editPanelValues.fontFamily = fonts[1];
          editPanelValues.fontColor =
            "rgb(" +
            fillColor[0] * 255 +
            "," +
            fillColor[1] * 255 +
            "," +
            fillColor[2] * 255 +
            ")";
          editPanelValues.opacity = fillColor[3] * 100;
          editPanelValues.backgroundColor =
            "rgb(" +
            backgroundColor[0] * 255 +
            "," +
            backgroundColor[1] * 255 +
            "," +
            backgroundColor[2] * 255 +
            ")";
          editPanelValues.backgroundOpacity = backgroundColor[3] * 100;
          editPanelValues.backgroundPadding = backgroundPadding.x;
          editPanelValues.outlineWidth = outlineWidth;
          editPanelValues.outlineColor =
            "rgb(" +
            outlineColor[0] * 255 +
            "," +
            outlineColor[1] * 255 +
            "," +
            outlineColor[2] * 255 +
            ")";
          editPanelValues.outlineOpacity = outlineColor[3] * 100;
          let position = this.$_cartesian3ToLongLat({
            x: positions[0],
            y: positions[1],
            z: positions[2]
          });
          editPanelValues.height = position.alt;
          editPanelValues.position = position;
          break;
        case "box":
          editPanelValues.id = id;
          editPanelValues.color =
            "rgb(" +
            color[0] * 255 +
            "," +
            color[1] * 255 +
            "," +
            color[2] * 255 +
            ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.extrudedHeight = extrudedHeight;
          editPanelValues.offsetHeight = offsetHeight;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "billboard":
          editPanelValues.id = id;
          editPanelValues.color =
            "rgb(" +
            color[0] * 255 +
            "," +
            color[1] * 255 +
            "," +
            color[2] * 255 +
            ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.image = image;
          editPanelValues.width = width;
          editPanelValues.height = height;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.outlineWidth = outlineWidth;
          editPanelValues.outlineOpacity = outlineColor[3] * 100;
          editPanelValues.outlineColor =
            "rgb(" +
            outlineColor[0] * 255 +
            "," +
            outlineColor[1] * 255 +
            "," +
            outlineColor[2] * 255 +
            ")";
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "polyline":
          editPanelValues.id = id;
          editPanelValues.width = width;
          editPanelValues.isHermiteSpline = isHermiteSpline;
          editPanelValues.materialType = materialType;
          editPanelValues.loop = loop;
          if (materialType === "Color") {
            editPanelValues.color =
              "rgb(" +
              color[0] * 255 +
              "," +
              color[1] * 255 +
              "," +
              color[2] * 255 +
              ")";
            editPanelValues.opacity = color[3] * 100;
          } else {
            editPanelValues.color =
              "rgb(" +
              material.color.red * 255 +
              "," +
              material.color.green * 255 +
              "," +
              material.color.blue * 255 +
              ")";
            editPanelValues.opacity = material.color.alpha * 100;
          }
          if (title) {
            editPanelValues.title = title;
          }
          editPanelValues.elevationMode = elevationMode;
          break;
        case "polylineVolume":
          editPanelValues.id = id;
          editPanelValues.color =
            "rgb(" +
            color[0] * 255 +
            "," +
            color[1] * 255 +
            "," +
            color[2] * 255 +
            ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.width = width;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.cornerType = cornerType;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "polygon":
          editPanelValues.id = id;
          editPanelValues.title = title;
          editPanelValues.color =
            "rgb(" +
            color[0] * 255 +
            "," +
            color[1] * 255 +
            "," +
            color[2] * 255 +
            ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.extrudedHeight = extrudedHeight;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.materialType = materialType || "Color";
          if (__flashStyle) {
            editPanelValues.alphaSpace = __flashStyle.alphaSpace;
            editPanelValues.flashTime = __flashStyle.flashTime;
            editPanelValues.flashAlpha = __flashStyle.flashAlpha;
          }
          if (materialType === "Image") {
            editPanelValues.image = material.image;
            editPanelValues.stRotation = stRotation;
          }
          if (title) {
            editPanelValues.title = title;
          }
          editPanelValues.elevationMode = elevationMode;
          break;
        case "rectangle":
          editPanelValues.id = id;
          editPanelValues.title = title;
          editPanelValues.color =
            "rgb(" +
            color[0] * 255 +
            "," +
            color[1] * 255 +
            "," +
            color[2] * 255 +
            ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.materialType = materialType;
          if (title) {
            editPanelValues.title = title;
          }
          if (materialType === "text") {
            const { backgroundColor, text, font, fillColor } = material;
            editPanelValues.rtBackgroundColor =
              "rgb(" +
              backgroundColor[0] * 255 +
              "," +
              backgroundColor[1] * 255 +
              "," +
              backgroundColor[2] * 255 +
              ")";
            editPanelValues.rtBackgroundOpacity = backgroundColor[3] * 100;
            editPanelValues.rectangleText = text;
            let fonts = font.split(" ");
            editPanelValues.rtFontSize = fonts[0].split("px")[0];
            editPanelValues.rtFontFamily = fonts[1];
            editPanelValues.color =
              "rgb(" +
              fillColor[0] * 255 +
              "," +
              fillColor[1] * 255 +
              "," +
              fillColor[2] * 255 +
              ")";
            editPanelValues.opacity = fillColor[3] * 100;
          }
          if (materialType === "Image") {
            const { repeat } = material;
            editPanelValues.image = material.image;
            editPanelValues.stRotation = stRotation;
            editPanelValues.repeatX = repeat.x;
            editPanelValues.repeatY = repeat.y;
          }
          editPanelValues.elevationMode = elevationMode;
          break;
        case "circle":
          if (this.currentEditType === "circle") {
            editPanelValues.id = id;
            editPanelValues.radius = radius;
            editPanelValues.offsetHeight = offsetHeight;
            editPanelValues.materialType = materialType;
            if (materialType === "Color") {
              editPanelValues.materialColor =
                "rgb(" +
                color[0] * 255 +
                "," +
                color[1] * 255 +
                "," +
                color[2] * 255 +
                ")";
              editPanelValues.materialOpacity = color[3] * 100;
            } else if (materialType === "RadarMaterial") {
              editPanelValues.materialColor =
                "rgb(" +
                material.color.red * 255 +
                "," +
                material.color.green * 255 +
                "," +
                material.color.blue * 255 +
                ")";
              editPanelValues.materialOpacity = material.color.alpha * 100;
              editPanelValues.speed = material.speed;
            } else if (materialType === "CircleWaveMaterial") {
              editPanelValues.materialColor =
                "rgb(" +
                material.color.red * 255 +
                "," +
                material.color.green * 255 +
                "," +
                material.color.blue * 255 +
                ")";
              editPanelValues.materialOpacity = material.color.alpha * 100;
              editPanelValues.duration = material.duration;
              editPanelValues.gradient = material.gradient;
              editPanelValues.count = material.count;
            }
            if (title) {
              editPanelValues.title = title;
            }
          } else {
            editPanelValues.id = id;
            editPanelValues.title = title;
            editPanelValues.color =
              "rgb(" +
              color[0] * 255 +
              "," +
              color[1] * 255 +
              "," +
              color[2] * 255 +
              ")";
            editPanelValues.opacity = color[3] * 100;
            editPanelValues.radius = radius;
            editPanelValues.height = height;
            editPanelValues.extrudedHeight = extrudedHeight;
            if (title) {
              editPanelValues.title = title;
            }
          }
          editPanelValues.elevationMode = elevationMode;
          break;
        case "ellipsoid":
          editPanelValues.id = id;
          editPanelValues.color =
            "rgb(" +
            color[0] * 255 +
            "," +
            color[1] * 255 +
            "," +
            color[2] * 255 +
            ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.radiusX = radiusX;
          editPanelValues.radiusY = radiusY;
          editPanelValues.radiusZ = radiusZ;
          editPanelValues.offsetHeight = offsetHeight;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "wall":
          editPanelValues.id = id;
          editPanelValues.title = title;
          editPanelValues.extrudedHeight = extrudedHeight;
          editPanelValues.materialType = materialType;
          editPanelValues.loop = loop;
          if (materialType === "Color") {
            editPanelValues.color =
              "rgb(" +
              color[0] * 255 +
              "," +
              color[1] * 255 +
              "," +
              color[2] * 255 +
              ")";
            editPanelValues.opacity = color[3] * 100;
          } else if (materialType === "PolylineTrailLink") {
            editPanelValues.linkColor =
              "rgb(" +
              material.color.red * 255 +
              "," +
              material.color.green * 255 +
              "," +
              material.color.blue * 255 +
              ")";
            editPanelValues.materialOpacity = material.color.alpha * 100;
            editPanelValues.duration = material.duration;
            editPanelValues.image = material.image;
            editPanelValues.direction = material.direction;
          }
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "corridor":
          editPanelValues.id = id;
          editPanelValues.color =
            "rgba(" +
            color[0] * 255 +
            "," +
            color[1] * 255 +
            "," +
            color[2] * 255 +
            ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.width = width;
          editPanelValues.cornerType = cornerType;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.extrudedHeight = extrudedHeight;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "cylinder":
          editPanelValues.id = id;
          editPanelValues.color =
            "rgba(" +
            color[0] * 255 +
            "," +
            color[1] * 255 +
            "," +
            color[2] * 255 +
            ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.topRadius = topRadius;
          editPanelValues.bottomRadius = bottomRadius;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.extrudedHeight = extrudedHeight;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "cone":
          editPanelValues.id = id;
          editPanelValues.color =
            "rgba(" +
            color[0] * 255 +
            "," +
            color[1] * 255 +
            "," +
            color[2] * 255 +
            ")";
          editPanelValues.opacity = color[3] * 100;
          editPanelValues.radius = radius;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.extrudedHeight = extrudedHeight;
          if (title) {
            editPanelValues.title = title;
          }
          break;
        case "marker":
          editPanelValues.id = id;
          editPanelValues.image = illboardStyle.image;
          editPanelValues.width = illboardStyle.width;
          editPanelValues.height = illboardStyle.height;
          editPanelValues.title = title;
          editPanelValues.text = abelStyle.text;
          let markerFont;
          if (typeof abelStyle.font === "number") {
            markerFont = [abelStyle.font, "sans-serif"];
          } else if (abelStyle.font.indexOf(" ") > -1) {
            markerFont = abelStyle.font.split(" ");
          } else {
            markerFont = [abelStyle.font, "sans-serif"];
          }
          editPanelValues.fontSize = markerFont[0];
          editPanelValues.fontFamily = markerFont[1];
          editPanelValues.fontColor =
            "rgb(" +
            abelStyle.fillColor.red * 255 +
            "," +
            abelStyle.fillColor.green * 255 +
            "," +
            abelStyle.fillColor.blue * 255 +
            ")";
          editPanelValues.opacity = abelStyle.fillColor.alpha * 100;
          editPanelValues.offsetHeight = offsetHeight;
          editPanelValues.labelPlaceType = labelPlaceType;
          editPanelValues.labelPadding = labelPadding;
          break;
        case "model":
          editPanelValues.id = id;
          editPanelValues.url = url;
          editPanelValues.scale = scale;
          if (title) {
            editPanelValues.title = title;
          }
          editPanelValues.positions = positions;
          editPanelValues.orientation = { heading, pitch, roll };
          break;
      }

      return editPanelValues;
    },
    /**
     * 将类型从英文转为中文
     * @param type String 类型，英文
     * @return type String 类型，中文
     * */
    $_formatType(type) {
      let format = {
        label: "文字",
        billboard: "广告牌",
        point: "点",
        polyline: "直线",
        curve: "曲线",
        polygon: "多边形",
        rectangle: "矩形",
        circle: "圆",
        cube: "正方体",
        polygonCube: "立体多边形",
        cuboid: "长方体",
        cone: "圆柱",
        cylinder: "圆锥",
        ellipsoid: "球",
        polylineVolume: "圆管线",
        corridor: "方管线",
        model: "模型",
        wall: "墙",
        marker: "图片+文字",
        square: "正方体"
      };

      return format[type];
    },
    $_delete(index) {
      this.$emit(
        "deleteAttribute",
        this.attributeKeyArray[index],
        this.editPanelValues.id
      );
      this.attributeKeyArray.splice(index, 1);
      this.attributeValueArray.splice(index, 1);
    },
    $_pickCoords(val) {
      this.$emit("pickCoords", val);
    },
    $_editPositions(val) {
      this.$emit("editPositions", val);
    },
    $_location() {
      this.$emit("location");
    },
    $_editOrientation(val) {
      this.$emit("editOrientation", val);
    },
    $_resetOrientation() {
      this.$emit("resetOrientation");
    }
  }
};
</script>

<style scoped>
.mapgis-ui-graphic-edit-list {
  overflow: hidden;
}

.mapgis-ui-graphic-edit-addAttribute {
  width: 100%;
  margin: 10px 0;
  padding-left: 10px;
}

.mapgis-ui-graphic-edit-addAttribute-input {
  width: calc(100% - 70px);
  margin-left: 24px;
}

.mapgis-ui-graphic-edit-addAttribute-add {
  float: right;
  margin-right: 7px;
  margin-bottom: 7px;
}

.mapgis-ui-graphic-edit-list-input {
  width: calc(100% - 124px);
  margin-left: 20px;
  margin-right: 4px;
}

::v-deep .mapgis-ui-card-head {
  padding: 0 11px;
}

.item-checkbox {
  float: right;
  margin-right: 5px;
}

.full-width {
  width: 100%;
}

.footer-div {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.footer-btn {
  margin: 0 8px;
  width: 30%;
}
</style>
