import VueOptions from "../../Base/Vue/VueOptions";
import PopupMixin from "./PopupMixin";

import Popup from "../../UI/Popup/Popup.vue";
import PopupContent from "../../UI/Geojson/Popup";

export default {
  name: "mapgis-3d-virtual-popup",
  inject: ["Cesium", "vueCesium", "viewer"],
  props: {
    ...VueOptions,
  },
  mixins: [PopupMixin],
  data() {
    return {};
  },
  components: {
    Popup,
    PopupContent,
  },
  render(h) {
    // props
    let { enablePopup, enableTips, enableIot, properties } = this;
    let { popupOptions, tipsOptions, iotOptions } = this;
    let { customPopup, customTips } = this;

    // data
    let { iClickVisible, iClickPosition, iHoverVisible, iHoverPosition } = this;
    let { iClickMode, iHoverMode, iClickFeatures, iHoverFeatures } = this;
    let { iPinMap } = this;

    const vm = this;
    const {
      title = "name",
      type = "default",
      enableSeparate = true,
      popupType = "table",
      fullHeight = 600,
    } = popupOptions;
    const feature = properties
      ? { properties: properties }
      : iClickFeatures && iClickFeatures.length > 0
      ? iClickFeatures[0]
      : { properties: {} };
    // 字符串或者数组
    const images = [];
    const description = "补充一段说明文字,默认字段description";
    const options = {
      ...popupOptions,
      type,
      popupType,
      images: images,
      description: description,
      title: title ? feature.properties[title] : "标题",
    };

    if (!iPinMap) {
      const fs = iClickFeatures.forEach((f) => {
        f.images = feature.properties.images || images;
        f.content = feature.properties.description || description;
      });
      let features = feature ? [feature.properties] : iClickFeatures;
      return (
        <mapgis-ui-story-panel-large
          onClosePanel={this.$_onPinMap.bind(this)}
          onFlyTo={this.$_onFlyTo.bind(this)}
          dataSource={features}
          height={fullHeight}
        />
      );
    }

    let defaultSlot = this.$slots.default;
    delete popupOptions.title;

    if (customPopup || customTips) {
      return (
        <Popup
          position={iClickPosition}
          visible={iClickVisible}
          forceRender={true}
        >
          <div ref="click">
            {customPopup && customPopup(iClickFeatures)}
            {!customPopup && (
              <PopupContent
                mode={iClickMode}
                currentLayerInfo={iClickFeatures}
              ></PopupContent>
            )}
          </div>
          <div ref="hover">
            {customTips && customTips(iHoverFeatures)}
            {!customTips && (
              <PopupContent
                mode={iHoverMode}
                currentLayerInfo={iHoverFeatures}
              ></PopupContent>
            )}
          </div>
        </Popup>
      );
    } else if (enableIot) {
      return (
        <div class="mapgis-popup-default-wrapper">
          <mapgis-3d-feature-popup
            position={iClickPosition}
            popupOptions={popupOptions}
            visible={iClickVisible}
          >
            <mapgis-3d-popup-iot
              properties={feature.properties}
              getProjectorStatus={this.$_getProjectorStatus.bind(this)}
              projectScreen={this.$_handleProjectScreen.bind(this)}
            ></mapgis-3d-popup-iot>
          </mapgis-3d-feature-popup>
        </div>
      );
    } else {
      return (
        <div class="mapgis-popup-default-wrapper">
          {enablePopup && (
            <Popup
              position={iClickPosition}
              visible={iClickVisible}
              forceRender={true}
              onChange={this.$_changeVisible.bind(this)}
              onSeparate={this.$_separateMap.bind(this)}
              options={options}
            >
              <mapgis-ui-popup-content
                feature={feature}
                popupOptions={popupOptions}
              >
                {defaultSlot}
              </mapgis-ui-popup-content>
            </Popup>
          )}
          {enableTips && (
            <Popup
              position={iHoverPosition}
              visible={iHoverVisible}
              forceRender={true}
            >
              <mapgis-ui-card>
                <span>
                  {feature.properties.title || feature.properties[title]}
                </span>
              </mapgis-ui-card>
            </Popup>
          )}
        </div>
      );
    }
  },
  methods: {},
};
