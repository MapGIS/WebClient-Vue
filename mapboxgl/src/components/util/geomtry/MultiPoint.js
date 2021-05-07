import {Geometry}  from "./Geometry";
import {extend} from "@mapgis/webclient-es6-service/common";

class MultiPoint extends Geometry{
    constructor(options) {
        super();
        this.type = "MultiPoint";
        extend(this,options);
    }
}

export {MultiPoint}