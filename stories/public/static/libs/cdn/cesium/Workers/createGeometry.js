define(["./when-0ac5fc51","./PrimitivePipeline-2b4818ed","./createTaskProcessorWorker","./Transforms-9663aff8","./Cartesian2-21667d02","./Check-91887fdf","./Math-e1584698","./combine-323053a8","./RuntimeError-71e5ac17","./ComponentDatatype-a350450f","./WebGLConstants-dd197df0","./GeometryAttribute-95829fb2","./GeometryAttributes-49ce162f","./GeometryPipeline-162e7fcf","./AttributeCompression-7ed0057c","./EncodedCartesian3-b1d566d1","./IndexDatatype-14fcdf85","./IntersectionTests-249faccb","./Plane-ab509945","./WebMercatorProjection-bf826b3d"],function(c,d,e,r,t,n,o,i,a,f,s,u,b,m,p,l,y,P,k,C){"use strict";var v={};return e(function(e,r){for(var t=e.subTasks,n=t.length,o=new Array(n),i=0;i<n;i++){var a=t[i],f=a.geometry,s=a.moduleName;c.defined(s)?(s=function(e){var r=v[e];return c.defined(r)||("object"==typeof exports?v[r]=r=require("Workers/"+e):require(["Workers/"+e],function(e){v[r=e]=e})),r}(s),o[i]=s(f,a.offset)):o[i]=f}return c.when.all(o,function(e){return d.PrimitivePipeline.packCreateGeometryResults(e,r)})})});