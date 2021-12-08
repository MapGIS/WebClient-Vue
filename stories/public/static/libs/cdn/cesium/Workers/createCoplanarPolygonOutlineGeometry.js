define(["./arrayRemoveDuplicates-df87c807","./Transforms-9663aff8","./Cartesian2-21667d02","./Check-91887fdf","./ComponentDatatype-a350450f","./CoplanarPolygonGeometryLibrary-8882b28e","./when-0ac5fc51","./GeometryAttribute-95829fb2","./GeometryAttributes-49ce162f","./GeometryInstance-e3dcce8b","./GeometryPipeline-162e7fcf","./IndexDatatype-14fcdf85","./PolygonGeometryLibrary-82953072","./Math-e1584698","./combine-323053a8","./RuntimeError-71e5ac17","./WebGLConstants-dd197df0","./OrientedBoundingBox-02f4a371","./EllipsoidTangentPlane-c3f115df","./AxisAlignedBoundingBox-ffb4db6f","./IntersectionTests-249faccb","./Plane-ab509945","./AttributeCompression-7ed0057c","./EncodedCartesian3-b1d566d1","./ArcType-13c64291","./EllipsoidRhumbLine-6713e1b6","./PolygonPipeline-9167e80a"],function(a,y,l,e,c,p,o,s,u,d,f,m,g,t,n,r,i,b,h,P,G,v,L,C,T,E,k){"use strict";function A(e){e=(e=o.defaultValue(e,o.defaultValue.EMPTY_OBJECT)).polygonHierarchy;this._polygonHierarchy=e,this._workerName="createCoplanarPolygonOutlineGeometry",this.packedLength=g.PolygonGeometryLibrary.computeHierarchyPackedLength(e)+1}A.fromPositions=function(e){return new A({polygonHierarchy:{positions:(e=o.defaultValue(e,o.defaultValue.EMPTY_OBJECT)).positions}})},A.pack=function(e,t,n){return n=o.defaultValue(n,0),t[n=g.PolygonGeometryLibrary.packPolygonHierarchy(e._polygonHierarchy,t,n)]=e.packedLength,t};var H={polygonHierarchy:{}};return A.unpack=function(e,t,n){t=o.defaultValue(t,0);var r=g.PolygonGeometryLibrary.unpackPolygonHierarchy(e,t);t=r.startingIndex,delete r.startingIndex;t=e[t];return(n=!o.defined(n)?new A(H):n)._polygonHierarchy=r,n.packedLength=t,n},A.createGeometry=function(e){var t=e._polygonHierarchy,e=t.positions,e=a.arrayRemoveDuplicates(e,l.Cartesian3.equalsEpsilon,!0);if(!(e.length<3)&&p.CoplanarPolygonGeometryLibrary.validOutline(e)){var n=g.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(t,!1);if(0!==n.length){for(var r=[],o=0;o<n.length;o++){var i=new d.GeometryInstance({geometry:function(e){for(var t=e.length,n=new Float64Array(3*t),r=m.IndexDatatype.createTypedArray(t,2*t),o=0,i=0,a=0;a<t;a++){var y=e[a];n[o++]=y.x,n[o++]=y.y,n[o++]=y.z,r[i++]=a,r[i++]=(a+1)%t}var l=new u.GeometryAttributes({position:new s.GeometryAttribute({componentDatatype:c.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:n})});return new s.Geometry({attributes:l,indices:r,primitiveType:s.PrimitiveType.LINES})}(n[o])});r.push(i)}e=f.GeometryPipeline.combineInstances(r)[0],t=y.BoundingSphere.fromPoints(t.positions);return new s.Geometry({attributes:e.attributes,indices:e.indices,primitiveType:e.primitiveType,boundingSphere:t})}}},function(e,t){return(e=o.defined(t)?A.unpack(e,t):e)._ellipsoid=l.Ellipsoid.clone(e._ellipsoid),A.createGeometry(e)}});