import {extend} from "@mapgis/webclient-es6-service/common";
import {Polygon} from "./Polygon";
import {Point} from "./Point";
import {Polyline} from "./Polyline";
import {MultiPolygon} from "./MultiPolygon";

class Feature {
    static fromQueryResult(FeatureSet) {
        function getPolygon(Ring) {
            let geometry = new Polygon();
            let exteriorDots = Ring.Arcs[0].Dots,exterior = [];
            for (let k = 0;k < exteriorDots.length;k++){
                exterior.push([exteriorDots[k].x,exteriorDots[k].y]);
            }
            geometry.exterior = exterior;
            if(Ring.Arcs.length > 1){
                let Arcs = Ring.Arcs;
                let interiorDots = Arcs.splice(1,Arcs.length - 1),interior,interiors=[];
                for (let m = 0;m < interiorDots.length;m++){
                    interior = [];
                    console.log("interiorDots[m]",interiorDots[m])
                    for (let t = 0;t < interiorDots[m].Dots.length;t++){
                        interior.push([interiorDots[m].Dots[t].x,interiorDots[m].Dots[t].y]);
                    }
                    interiors.push(interior);
                }
                geometry.interior = interiors;

            }
            return geometry;
        }
        if(!FeatureSet.hasOwnProperty("SFEleArray") || !FeatureSet.hasOwnProperty("AttStruct")
            || (FeatureSet.hasOwnProperty("SFEleArray") && !FeatureSet.SFEleArray)|| (FeatureSet.hasOwnProperty("AttStruct") && !FeatureSet.AttStruct)){
            console.error(new Error("请确保输入的对象含有SFEleArray以及FldAlias"));
            return
        }
        let SFEleArray = FeatureSet.SFEleArray;
        let AttStruct = FeatureSet.AttStruct;
        let features = [],feature;
        for (let i = 0;i < SFEleArray.length;i++){
            let attributes = {},geometry;
            for(let j = 0;j < SFEleArray[i].AttValue.length;j++){
                if(SFEleArray[i].AttValue[j] !== ""){
                    attributes[AttStruct.FldName[j]] = SFEleArray[i].AttValue[j];
                }
            }
            Object.keys(SFEleArray[i].fGeom).forEach(function (key) {
                if(SFEleArray[i].fGeom[key] instanceof Array && SFEleArray[i].fGeom[key].length > 0){
                    switch (key){
                        case "PntGeom":
                            let pointDots = SFEleArray[i].fGeom[key][0].Dot;
                            geometry = new Point({
                                coordinates: [pointDots.x,pointDots.y]
                            });
                            break
                        case "LinGeom":
                            let lineDots = SFEleArray[i].fGeom[key][0].Line.Arcs[0].Dots,line = [];
                            for(let k = 0;k < lineDots.length;k++){
                                line.push([lineDots[k].x,lineDots[k].y]);
                            }
                            geometry = new Polyline({
                                coordinates:line
                            });
                            break
                        case "RegGeom":
                            if(SFEleArray[i].fGeom[key].length > 1){
                                let RegGeoms = SFEleArray[i].fGeom[key],polygons=[];
                                for (let k = 0;k < RegGeoms.length;k++){
                                    polygons.push(getPolygon(RegGeoms[k].Rings[0]));
                                }
                                geometry = new MultiPolygon({
                                    polygons: polygons
                                });
                            }else {
                                geometry = getPolygon(SFEleArray[i].fGeom[key][0].Rings[0]);
                            }
                            break
                    }
                }
            });
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
                style: style
            });
            features.push(feature);
        }
        return features;
    }
    static fromGeoJSON (geoJSON) {
        let feature,features=[];
        if(!geoJSON.hasOwnProperty("type")){
            console.error(new Error("请输入正确的geoJSON"));
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
            console.error(new Error("不支持的geoJSON类型  "));
        }
    }
    
    constructor(options) {
        this.geometry = undefined;
        this.attributes = undefined;
        this.style = undefined;
        this.FID = undefined;

        extend(this,options);
    }
}

export {Feature}