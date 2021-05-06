import {Geometry}  from "./Geometry";
import {extend} from "@mapgis/webclient-es6-service/common";

class MultiPolygon extends Geometry{
    constructor(options) {
        super();
        this.type = "MultiPolygon";
        this.polygons = [];
        extend(this,options);

        if(this.polygons.length > 0){
            for (let i = 0; i < this.polygons.length;i++){
                this.coordinates.push(this.polygons[i].coordinates);
            }
        }
    }
}

export {MultiPolygon}