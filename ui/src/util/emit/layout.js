import EventBus from "../vue-types/event-bus-layout";
import layoutFactory from "../style/layout/layout.json";
import { dealWithLayout } from "../style/color/serialColors";

export const setLayout = (layoutStyle = {}) => {
  let acceptedLayoutStyle = layoutStyle;
  if (typeof layoutStyle === "string") {
    acceptedLayoutStyle =
      layoutFactory.find(item => item.label === layoutStyle) ||
      layoutFactory[0];
  }

  const nextLayoutData = dealWithLayout(acceptedLayoutStyle);
  const nextLayout = {
    ...nextLayoutData.layoutStyle
  };

  EventBus.$options.layout = nextLayout;
  EventBus.$emit("change-layout", nextLayout);
};
