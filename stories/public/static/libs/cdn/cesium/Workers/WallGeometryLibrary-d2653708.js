define(["exports","./arrayRemoveDuplicates-7f5f30dd","./Cartesian2-e9693975","./when-68750dfd","./Math-72d6038c","./PolylinePipeline-6352fdad"],function(e,P,A,C,w,m){"use strict";var i={};var M=new A.Cartographic,b=new A.Cartographic;function E(e,i,t,r){var a=(i=P.arrayRemoveDuplicates(i,A.Cartesian3.equalsEpsilon)).length;if(!(a<2)){var n=C.defined(r),o=C.defined(t),l=new Array(a),s=new Array(a),h=new Array(a),g=i[0];l[0]=g;var p=e.cartesianToCartographic(g,M);o&&(p.height=t[0]),s[0]=p.height,h[0]=n?r[0]:0;for(var d,u,c=s[0]===h[0],v=1,y=1;y<a;++y){var f=i[y],m=e.cartesianToCartographic(f,b);o&&(m.height=t[y]),c=c&&0===m.height,d=p,u=m,w.CesiumMath.equalsEpsilon(d.latitude,u.latitude,w.CesiumMath.EPSILON10)&&w.CesiumMath.equalsEpsilon(d.longitude,u.longitude,w.CesiumMath.EPSILON10)?p.height<m.height&&(s[v-1]=m.height):(l[v]=f,s[v]=m.height,h[v]=n?r[y]:0,c=c&&s[v]===h[v],A.Cartographic.clone(m,p),++v)}if(!(c||v<2))return l.length=v,s.length=v,h.length=v,{positions:l,topHeights:s,bottomHeights:h}}}var F=new Array(2),H=new Array(2),L={positions:void 0,height:void 0,granularity:void 0,ellipsoid:void 0};i.computePositions=function(e,i,t,r,a,n){var o=E(e,i,t,r);if(C.defined(o)){i=o.positions,t=o.topHeights,r=o.bottomHeights;var l=i.length,o=l-2,s=w.CesiumMath.chordLength(a,e.maximumRadius),h=L;if(h.minDistance=s,h.ellipsoid=e,n){for(var g=0,p=0;p<l-1;p++)g+=m.PolylinePipeline.numberOfPoints(i[p],i[p+1],s)+1;var d=new Float64Array(3*g),u=new Float64Array(3*g),c=F,v=H;h.positions=c,h.height=v;var y=0;for(p=0;p<l-1;p++){c[0]=i[p],c[1]=i[p+1],v[0]=t[p],v[1]=t[p+1];var f=m.PolylinePipeline.generateArc(h);d.set(f,y),v[0]=r[p],v[1]=r[p+1],u.set(m.PolylinePipeline.generateArc(h),y),y+=f.length}}else h.positions=i,h.height=t,d=new Float64Array(m.PolylinePipeline.generateArc(h)),h.height=r,u=new Float64Array(m.PolylinePipeline.generateArc(h));return{bottomPositions:u,topPositions:d,numCorners:o}}},e.WallGeometryLibrary=i});