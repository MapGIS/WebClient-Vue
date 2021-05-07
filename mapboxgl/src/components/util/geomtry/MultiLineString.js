import {Geometry}  from "./Geometry";
import {extend} from "@mapgis/webclient-es6-service/common";

class MultiLineString extends Geometry{
    constructor(options) {
        super();
        this.type = "MultiLineString";
        extend(this,options);
    }
}

export {MultiLineString}