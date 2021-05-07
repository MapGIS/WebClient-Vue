import {BaseParameter} from "./index";
import {extend} from "@mapgis/webclient-es6-service/common";
import {Point} from "./Point"
import {Polyline} from "./Polyline"
import {Polygon} from "./Polygon"

class GeometryParameter extends BaseParameter{
    constructor(options) {
        super();
        this.geometry = undefined;
        this.where = undefined;
        this.compareRectOnly = false;
        this.enableDisplayCondition = false;
        this.spatialRelationType = "Intersect";

        extend(this,options);

    }
}

GeometryParameter.prototype.fromGeoJSON = function (geoJSON) {
    let me = this;
    switch (geoJSON.geometry.type){
        case "Point":
            me.geometry = new Point({
                coordinates: geoJSON.geometry.coordinates
            });
            break;
        case "LineString":
            me.geometry = new Polyline({
                coordinates: geoJSON.geometry.coordinates
            });
            break;
        case "Polygon":
            me.geometry = new Polygon({
                coordinates: geoJSON.geometry.coordinates[0]
            });
            break;
    }
}

export {GeometryParameter}