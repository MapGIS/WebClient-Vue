define(["./when-0ac5fc51","./Cartesian2-21667d02","./arrayRemoveDuplicates-df87c807","./BoundingRectangle-4522d4e2","./Transforms-9663aff8","./ComponentDatatype-a350450f","./PolylineVolumeGeometryLibrary-40d01268","./Check-91887fdf","./GeometryAttribute-95829fb2","./GeometryAttributes-49ce162f","./IndexDatatype-14fcdf85","./Math-e1584698","./PolygonPipeline-9167e80a","./combine-323053a8","./RuntimeError-71e5ac17","./WebGLConstants-dd197df0","./EllipsoidTangentPlane-c3f115df","./AxisAlignedBoundingBox-ffb4db6f","./IntersectionTests-249faccb","./Plane-ab509945","./PolylinePipeline-8d8b2828","./EllipsoidGeodesic-5a7a5804","./EllipsoidRhumbLine-6713e1b6"],function(d,c,a,o,u,y,r,e,f,h,g,t,l,i,n,s,p,m,E,v,P,_,k){"use strict";function C(e){var i=(e=d.defaultValue(e,d.defaultValue.EMPTY_OBJECT)).polylinePositions,n=e.shapePositions;this._positions=i,this._shape=n,this._ellipsoid=c.Ellipsoid.clone(d.defaultValue(e.ellipsoid,c.Ellipsoid.WGS84)),this._cornerType=d.defaultValue(e.cornerType,r.CornerType.ROUNDED),this._granularity=d.defaultValue(e.granularity,t.CesiumMath.RADIANS_PER_DEGREE),this._workerName="createPolylineVolumeOutlineGeometry";i=1+i.length*c.Cartesian3.packedLength;i+=1+n.length*c.Cartesian2.packedLength,this.packedLength=i+c.Ellipsoid.packedLength+2}C.pack=function(e,i,n){var t;n=d.defaultValue(n,0);var a=e._positions,o=a.length;for(i[n++]=o,t=0;t<o;++t,n+=c.Cartesian3.packedLength)c.Cartesian3.pack(a[t],i,n);var r=e._shape,o=r.length;for(i[n++]=o,t=0;t<o;++t,n+=c.Cartesian2.packedLength)c.Cartesian2.pack(r[t],i,n);return c.Ellipsoid.pack(e._ellipsoid,i,n),n+=c.Ellipsoid.packedLength,i[n++]=e._cornerType,i[n]=e._granularity,i};var b=c.Ellipsoid.clone(c.Ellipsoid.UNIT_SPHERE),L={polylinePositions:void 0,shapePositions:void 0,ellipsoid:b,height:void 0,cornerType:void 0,granularity:void 0};C.unpack=function(e,i,n){i=d.defaultValue(i,0);for(var t=e[i++],a=new Array(t),o=0;o<t;++o,i+=c.Cartesian3.packedLength)a[o]=c.Cartesian3.unpack(e,i);var t=e[i++],r=new Array(t);for(o=0;o<t;++o,i+=c.Cartesian2.packedLength)r[o]=c.Cartesian2.unpack(e,i);var l=c.Ellipsoid.unpack(e,i,b);i+=c.Ellipsoid.packedLength;var s=e[i++],p=e[i];return d.defined(n)?(n._positions=a,n._shape=r,n._ellipsoid=c.Ellipsoid.clone(l,n._ellipsoid),n._cornerType=s,n._granularity=p,n):(L.polylinePositions=a,L.shapePositions=r,L.cornerType=s,L.granularity=p,new C(L))};var T=new o.BoundingRectangle;return C.createGeometry=function(e){var i=e._positions,n=a.arrayRemoveDuplicates(i,c.Cartesian3.equalsEpsilon),t=e._shape,t=r.PolylineVolumeGeometryLibrary.removeDuplicatesFromShape(t);if(!(n.length<2||t.length<3)){l.PolygonPipeline.computeWindingOrder2D(t)===l.WindingOrder.CLOCKWISE&&t.reverse();i=o.BoundingRectangle.fromPoints(t,T);return function(e,i){var n=new h.GeometryAttributes;n.position=new f.GeometryAttribute({componentDatatype:y.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:e});var t=i.length,i=n.position.values.length/3,a=e.length/3/t,o=g.IndexDatatype.createTypedArray(i,2*t*(1+a)),r=0,l=0,s=l*t;for(c=0;c<t-1;c++)o[r++]=c+s,o[r++]=c+s+1;for(o[r++]=t-1+s,o[r++]=s,s=(l=a-1)*t,c=0;c<t-1;c++)o[r++]=c+s,o[r++]=c+s+1;for(o[r++]=t-1+s,o[r++]=s,l=0;l<a-1;l++)for(var p=t*l,d=p+t,c=0;c<t;c++)o[r++]=c+p,o[r++]=c+d;return new f.Geometry({attributes:n,indices:g.IndexDatatype.createTypedArray(i,o),boundingSphere:u.BoundingSphere.fromVertices(e),primitiveType:f.PrimitiveType.LINES})}(r.PolylineVolumeGeometryLibrary.computePositions(n,t,i,e,!1),t)}},function(e,i){return(e=d.defined(i)?C.unpack(e,i):e)._ellipsoid=c.Ellipsoid.clone(e._ellipsoid),C.createGeometry(e)}});