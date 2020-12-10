import RasterLayer from "../RasterLayer";
import IgsBaseOptions from "./IgsBaseOptions";

export default {
  name: "IgsBaseLayer",
  mixins: [RasterLayer],
  props: { ...IgsBaseOptions }
};
