import {Geometry}  from "./Geometry";
import {extend} from "@mapgis/webclient-es6-service/common";

class Polyline extends Geometry{
    constructor(options) {
        super();
        this.type = "LineString";
        extend(this,options);
    }
}

export {Polyline}