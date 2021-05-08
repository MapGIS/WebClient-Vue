import {extend} from "@mapgis/webclient-es6-service/common";
import {Polygon} from "./Polygon";
import {Point} from "./Point";
import {Polyline} from "./Polyline";
import {MultiPolygon} from "./MultiPolygon";

class Feature {
    constructor(options) {
        this.geometry = undefined;
        this.geometryType = undefined;
        this.attributes = undefined;
        this.style = undefined;
        this.FID = undefined;

        extend(this,options);
    }
    static fromQueryResult = function (result) {
        if(!result.hasOwnProperty("SFEleArray") || !result.hasOwnProperty("AttStruct")
            || (result.hasOwnProperty("SFEleArray") && !result.SFEleArray)|| (result.hasOwnProperty("AttStruct") && !result.AttStruct)){
            throw new Error("请确保输入的对象含有SFEleArray以及FldAlias");
        }
        let SFEleArray = result.SFEleArray;
        let AttStruct = result.AttStruct;
        let features = [],feature;
        for (let i = 0;i < SFEleArray.length;i++){
            let attributes = {},geometry = [],geometryType;
            for(let j = 0;j < SFEleArray[i].AttValue.length;j++){
                if(SFEleArray[i].AttValue[j] !== ""){
                    attributes[AttStruct.FldName[j]] = SFEleArray[i].AttValue[j];
                }
            }
            switch (SFEleArray[i].ftype){
                case 1:
                    let PntGeom = SFEleArray[i].fGeom.PntGeom;
                    for(let k = 0;k < PntGeom.length;k++){
                        let point = new Point({
                            coordinates: [PntGeom[k].Dot.x,PntGeom[k].Dot.y]
                        })
                        geometry.push(point);
                        geometryType = "Point";
                    }
                    break
                case 2:
                    let LinGeom = SFEleArray[i].fGeom.LinGeom;
                    for(let k = 0;k < LinGeom.length;k++){
                        let polyline = new Polyline({
                            coordinates: LinGeom[k].Line.Arcs[0].Dots
                        });
                        geometry.push(polyline)
                        geometryType = "LineString";
                    }
                    break
                case 3:
                    let RegGeom = SFEleArray[i].fGeom.RegGeom;
                    for(let k = 0;k < RegGeom.length;k++){
                        let polygon = new Polygon();
                        polygon.exterior = RegGeom[k].Rings[0].Arcs[0].Dots;
                        for (let m = 1; m < RegGeom[k].Rings.length;m++){
                            polygon.interior.push(RegGeom[k].Rings[m].Arcs[0].Dots);
                        }
                        geometry.push(polygon);
                        geometryType = "Polygon";
                    }
                    break
            }
            let style;
            if(SFEleArray[i].GraphicInfo){
                let GraphicInfo = SFEleArray[i].GraphicInfo;
                switch (GraphicInfo.InfoType){
                    case 1:
                        style = GraphicInfo.PntInfo;
                        break
                    case 2:
                        style = GraphicInfo.LinInfo;
                        break
                    case 3:
                        style = GraphicInfo.RegInfo;
                        break
                }
            }

            feature = new Feature({
                attributes: attributes,
                FID: SFEleArray[i].FID,
                geometry: geometry,
                geometryType: geometryType,
                style: style
            });
            features.push(feature);
        }
        return features;
    }
    static fromGeoJSON = function (geoJSON) {
        let feature,features=[];
        if(!geoJSON.hasOwnProperty("type")){
            throw new Error("请输入正确的geoJSON");
        }
        if(geoJSON.type === "Feature"){
            feature = new Feature({
                geometry: Feature.geometry,
                attributes: geoJSON.properties
            });
            return feature;
        }else if(geoJSON.type === "FeatureCollection"){
            let featureCollection = geoJSON.features;
            for(let i = 0;i < featureCollection.length;i++){
                feature = new Feature({
                    geometry: featureCollection[i].geometry,
                    attributes: featureCollection[i].properties
                });
                features.push(feature);
            }
            return features;
        }else {
            throw new Error("不支持的geoJSON类型");
        }
    }
}

export {Feature}