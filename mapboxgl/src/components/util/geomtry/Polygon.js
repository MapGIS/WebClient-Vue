import {Geometry}  from "./Geometry";
import {extend} from "@mapgis/webclient-es6-service/common";

class Polygon extends Geometry{
    constructor(options) {
        super();
        this.type = "Polygon";
        this.exterior = [];
        this.interior = [];
        extend(this,options);

        if(this.exterior.length > 0){
            this.coordinates.push(this.exterior);
        }

        if(this.interior.length > 0){
            for (let i = 0;i < this.interior.length;i++){
                this.coordinates.push(this.interior[i]);
            }
        }
    }
}

export {Polygon}