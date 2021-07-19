var Objects = require("./objects.js");
var utils = require("../utils/utils.js");

export function Object3D(options) {
  options = utils._validate(options, Objects.prototype._defaults.Object3D);

  var obj = options.obj;

  if (options.units === "meters")
    obj = Objects.prototype._makeGroup(options.obj, options);

  obj = Objects.prototype._addMethods(obj);
  return obj;
}

export default Object3D;
