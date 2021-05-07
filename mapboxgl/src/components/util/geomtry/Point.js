import {Geometry}  from "./Geometry";
import {extend} from "@mapgis/webclient-es6-service/common";

class Point extends Geometry{
    constructor(options) {
        super();
        this.type = "Point";
        extend(this,options);
    }
}

export {Point}