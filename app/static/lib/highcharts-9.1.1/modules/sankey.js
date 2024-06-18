/*
 Highcharts JS v9.1.1 (2021-06-03)

 Sankey diagram module

 (c) 2010-2021 Torstein Honsi

 License: www.highcharts.com/license
*/
'use strict';(function(c){"object"===typeof module&&module.exports?(c["default"]=c,module.exports=c):"function"===typeof define&&define.amd?define("highcharts/modules/sankey",["highcharts"],function(q){c(q);c.Highcharts=q;return c}):c("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(c){function q(c,f,h,k){c.hasOwnProperty(f)||(c[f]=k.apply(null,h))}c=c?c._modules:{};q(c,"Mixins/Nodes.js",[c["Core/Globals.js"],c["Core/Series/Point.js"],c["Core/Series/Series.js"],c["Core/Utilities.js"]],
function(c,f,h,k){var p=k.defined,g=k.extend,e=k.find,n=k.pick;return c.NodesMixin={createNode:function(d){function b(a,b){return e(a,function(a){return a.id===b})}var a=b(this.nodes,d),c=this.pointClass;if(!a){var f=this.options.nodes&&b(this.options.nodes,d);a=(new c).init(this,g({className:"highcharts-node",isNode:!0,id:d,y:1},f));a.linksTo=[];a.linksFrom=[];a.formatPrefix="node";a.name=a.name||a.options.id||"";a.mass=n(a.options.mass,a.options.marker&&a.options.marker.radius,this.options.marker&&
this.options.marker.radius,4);a.getSum=function(){var b=0,d=0;a.linksTo.forEach(function(a){b+=a.weight});a.linksFrom.forEach(function(a){d+=a.weight});return Math.max(b,d)};a.offset=function(b,d){for(var c=0,e=0;e<a[d].length;e++){if(a[d][e]===b)return c;c+=a[d][e].weight}};a.hasShape=function(){var b=0;a.linksTo.forEach(function(a){a.outgoing&&b++});return!a.linksTo.length||b!==a.linksTo.length};this.nodes.push(a)}return a},generatePoints:function(){var d=this.chart,b={};h.prototype.generatePoints.call(this);
this.nodes||(this.nodes=[]);this.colorCounter=0;this.nodes.forEach(function(a){a.linksFrom.length=0;a.linksTo.length=0;a.level=a.options.level});this.points.forEach(function(a){p(a.from)&&(b[a.from]||(b[a.from]=this.createNode(a.from)),b[a.from].linksFrom.push(a),a.fromNode=b[a.from],d.styledMode?a.colorIndex=n(a.options.colorIndex,b[a.from].colorIndex):a.color=a.options.color||b[a.from].color);p(a.to)&&(b[a.to]||(b[a.to]=this.createNode(a.to)),b[a.to].linksTo.push(a),a.toNode=b[a.to]);a.name=a.name||
a.id},this);this.nodeLookup=b},setData:function(){this.nodes&&(this.nodes.forEach(function(d){d.destroy()}),this.nodes.length=0);h.prototype.setData.apply(this,arguments)},destroy:function(){this.data=[].concat(this.points||[],this.nodes);return h.prototype.destroy.apply(this,arguments)},setNodeState:function(d){var b=arguments,a=this.isNode?this.linksTo.concat(this.linksFrom):[this.fromNode,this.toNode];"select"!==d&&a.forEach(function(a){a&&a.series&&(f.prototype.setState.apply(a,b),a.isNode||(a.fromNode.graphic&&
f.prototype.setState.apply(a.fromNode,b),a.toNode&&a.toNode.graphic&&f.prototype.setState.apply(a.toNode,b)))});f.prototype.setState.apply(this,b)}}});q(c,"Series/Sankey/SankeyPoint.js",[c["Mixins/Nodes.js"],c["Core/Series/Point.js"],c["Core/Series/SeriesRegistry.js"],c["Core/Utilities.js"]],function(c,f,h,k){var p=this&&this.__extends||function(){var c=function(e,d){c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(b,a){b.__proto__=a}||function(b,a){for(var d in a)a.hasOwnProperty(d)&&
(b[d]=a[d])};return c(e,d)};return function(e,d){function b(){this.constructor=e}c(e,d);e.prototype=null===d?Object.create(d):(b.prototype=d.prototype,new b)}}(),g=k.defined;k=k.extend;h=function(c){function e(){var d=null!==c&&c.apply(this,arguments)||this;d.className=void 0;d.fromNode=void 0;d.level=void 0;d.linkBase=void 0;d.linksFrom=void 0;d.linksTo=void 0;d.mass=void 0;d.nodeX=void 0;d.nodeY=void 0;d.options=void 0;d.series=void 0;d.toNode=void 0;return d}p(e,c);e.prototype.applyOptions=function(d,
b){f.prototype.applyOptions.call(this,d,b);g(this.options.level)&&(this.options.column=this.column=this.options.level);return this};e.prototype.getClassName=function(){return(this.isNode?"highcharts-node ":"highcharts-link ")+f.prototype.getClassName.call(this)};e.prototype.isValid=function(){return this.isNode||"number"===typeof this.weight};return e}(h.seriesTypes.column.prototype.pointClass);k(h.prototype,{setState:c.setNodeState});return h});q(c,"Mixins/TreeSeries.js",[c["Core/Color/Color.js"],
c["Core/Utilities.js"]],function(c,f){var h=f.extend,k=f.isArray,p=f.isNumber,g=f.isObject,e=f.merge,n=f.pick;return{getColor:function(d,b){var a=b.index,e=b.mapOptionsToLevel,f=b.parentColor,h=b.parentColorIndex,g=b.series,t=b.colors,k=b.siblings,m=g.points,u=g.chart.options.chart,v;if(d){m=m[d.i];d=e[d.level]||{};if(e=m&&d.colorByPoint){var l=m.index%(t?t.length:u.colorCount);var x=t&&t[l]}if(!g.chart.styledMode){t=m&&m.options.color;u=d&&d.color;if(v=f)v=(v=d&&d.colorVariation)&&"brightness"===
v.key?c.parse(f).brighten(a/k*v.to).get():f;v=n(t,u,x,v,g.color)}var F=n(m&&m.options.colorIndex,d&&d.colorIndex,l,h,b.colorIndex)}return{color:v,colorIndex:F}},getLevelOptions:function(d){var b=null;if(g(d)){b={};var a=p(d.from)?d.from:1;var c=d.levels;var f={};var n=g(d.defaults)?d.defaults:{};k(c)&&(f=c.reduce(function(b,d){if(g(d)&&p(d.level)){var c=e({},d);var f="boolean"===typeof c.levelIsConstant?c.levelIsConstant:n.levelIsConstant;delete c.levelIsConstant;delete c.level;d=d.level+(f?0:a-1);
g(b[d])?h(b[d],c):b[d]=c}return b},{}));c=p(d.to)?d.to:1;for(d=0;d<=c;d++)b[d]=e({},n,g(f[d])?f[d]:{})}return b},setTreeValues:function K(b,a){var c=a.before,e=a.idRoot,f=a.mapIdToNode[e],g=a.points[b.i],k=g&&g.options||{},m=0,u=[];b.levelDynamic=b.level-(("boolean"===typeof a.levelIsConstant?a.levelIsConstant:1)?0:f.level);b.name=n(g&&g.name,"");b.visible=e===b.id||("boolean"===typeof a.visible?a.visible:!1);"function"===typeof c&&(b=c(b,a));b.children.forEach(function(c,l){var x=h({},a);h(x,{index:l,
siblings:b.children.length,visible:b.visible});c=K(c,x);u.push(c);c.visible&&(m+=c.val)});b.visible=0<m||b.visible;c=n(k.value,m);b.children=u;b.childrenTotal=m;b.isLeaf=b.visible&&!m;b.val=c;return b},updateRootId:function(b){if(g(b)){var a=g(b.options)?b.options:{};a=n(b.rootNode,a.rootId,"");g(b.userOptions)&&(b.userOptions.rootId=a);b.rootNode=a}return a}}});q(c,"Series/Sankey/SankeySeries.js",[c["Core/Color/Color.js"],c["Core/Globals.js"],c["Mixins/Nodes.js"],c["Series/Sankey/SankeyPoint.js"],
c["Core/Series/SeriesRegistry.js"],c["Mixins/TreeSeries.js"],c["Core/Utilities.js"]],function(c,f,h,k,p,g,e){var n=this&&this.__extends||function(){var a=function(b,l){a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,l){a.__proto__=l}||function(a,l){for(var b in l)l.hasOwnProperty(b)&&(a[b]=l[b])};return a(b,l)};return function(b,l){function d(){this.constructor=b}a(b,l);b.prototype=null===l?Object.create(l):(d.prototype=l.prototype,new d)}}(),d=p.series,b=p.seriesTypes.column,
a=g.getLevelOptions,q=e.defined;g=e.extend;var L=e.find,z=e.isObject,A=e.merge,t=e.pick,B=e.relativeLength,m=e.stableSort;e=function(d){function e(){var a=null!==d&&d.apply(this,arguments)||this;a.colDistance=void 0;a.data=void 0;a.group=void 0;a.nodeLookup=void 0;a.nodePadding=void 0;a.nodes=void 0;a.nodeWidth=void 0;a.options=void 0;a.points=void 0;a.translationFactor=void 0;return a}n(e,d);e.getDLOptions=function(a){var b=z(a.optionsPoint)?a.optionsPoint.dataLabels:{};a=z(a.level)?a.level.dataLabels:
{};return A({style:{}},a,b)};e.prototype.createNodeColumn=function(){var a=this,b=this.chart,d=[];d.sum=function(){return this.reduce(function(a,b){return a+b.getSum()},0)};d.offset=function(b,l){for(var c=0,e,x=a.nodePadding,r=0;r<d.length;r++){e=d[r].getSum();var F=Math.max(e*l,a.options.minLinkWidth);e=e?F+x:0;if(d[r]===b)return{relativeTop:c+B(b.options.offset||0,e)};c+=e}};d.top=function(d){var l=a.nodePadding,c=this.reduce(function(b,c){0<b&&(b+=l);c=Math.max(c.getSum()*d,a.options.minLinkWidth);
return b+c},0);return(b.plotSizeY-c)/2};return d};e.prototype.createNodeColumns=function(){var a=[];this.nodes.forEach(function(b){var d=-1,c;if(!q(b.options.column))if(0===b.linksTo.length)b.column=0;else{for(c=0;c<b.linksTo.length;c++){var l=b.linksTo[0];if(l.fromNode.column>d){var e=l.fromNode;d=e.column}}b.column=d+1;e&&"hanging"===e.options.layout&&(b.hangsFrom=e,c=-1,L(e.linksFrom,function(a,d){(a=a.toNode===b)&&(c=d);return a}),b.column+=c)}a[b.column]||(a[b.column]=this.createNodeColumn());
a[b.column].push(b)},this);for(var b=0;b<a.length;b++)"undefined"===typeof a[b]&&(a[b]=this.createNodeColumn());return a};e.prototype.generatePoints=function(){function a(b,d){"undefined"===typeof b.level&&(b.level=d,b.linksFrom.forEach(function(b){b.toNode&&a(b.toNode,d+1)}))}h.generatePoints.apply(this,arguments);this.orderNodes&&(this.nodes.filter(function(a){return 0===a.linksTo.length}).forEach(function(b){a(b,0)}),m(this.nodes,function(a,b){return a.level-b.level}))};e.prototype.getNodePadding=
function(){var a=this.options.nodePadding||0;if(this.nodeColumns){var b=this.nodeColumns.reduce(function(a,b){return Math.max(a,b.length)},0);b*a>this.chart.plotSizeY&&(a=this.chart.plotSizeY/b)}return a};e.prototype.hasData=function(){return!!this.processedXData.length};e.prototype.pointAttribs=function(a,b){if(!a)return{};var d=this,e=d.mapOptionsToLevel[(a.isNode?a.level:a.fromNode.level)||0]||{},l=a.options,f=e.states&&e.states[b||""]||{};b=["colorByPoint","borderColor","borderWidth","linkOpacity"].reduce(function(a,
b){a[b]=t(f[b],l[b],e[b],d.options[b]);return a},{});var w=t(f.color,l.color,b.colorByPoint?a.color:e.color);return a.isNode?{fill:w,stroke:b.borderColor,"stroke-width":b.borderWidth}:{fill:c.parse(w).setOpacity(b.linkOpacity).get()}};e.prototype.render=function(){var a=this.points;this.points=this.points.concat(this.nodes||[]);b.prototype.render.call(this);this.points=a};e.prototype.translate=function(){var b=this,d=function(a){for(var d=a.slice(),l=b.options.minLinkWidth||0,w,x=0,g,I=e.plotSizeY-
f.borderWidth-(a.length-1)*c.nodePadding;a.length;){x=I/a.sum();w=!1;for(g=a.length;g--;)a[g].getSum()*x<l&&(a.splice(g,1),I-=l,w=!0);if(!w)break}a.length=0;d.forEach(function(b){return a.push(b)});return x};this.processedXData||this.processData();this.generatePoints();this.nodeColumns=this.createNodeColumns();this.nodeWidth=B(this.options.nodeWidth,this.chart.plotSizeX);var c=this,e=this.chart,f=this.options,g=this.nodeWidth,w=this.nodeColumns;this.nodePadding=this.getNodePadding();this.translationFactor=
w.reduce(function(a,b){return Math.min(a,d(b))},Infinity);this.colDistance=(e.plotSizeX-g-f.borderWidth)/Math.max(1,w.length-1);c.mapOptionsToLevel=a({from:1,levels:f.levels,to:w.length-1,defaults:{borderColor:f.borderColor,borderRadius:f.borderRadius,borderWidth:f.borderWidth,color:c.color,colorByPoint:f.colorByPoint,levelIsConstant:!0,linkColor:f.linkColor,linkLineWidth:f.linkLineWidth,linkOpacity:f.linkOpacity,states:f.states}});w.forEach(function(a){a.forEach(function(b){c.translateNode(b,a)})},
this);this.nodes.forEach(function(a){a.linksFrom.forEach(function(a){(a.weight||a.isNull)&&a.to&&(c.translateLink(a),a.allowShadow=!1)})})};e.prototype.translateLink=function(a){var b=function(b,c){c=b.offset(a,c)*l;return Math.min(b.nodeY+c,b.nodeY+(b.shapeArgs&&b.shapeArgs.height||0)-f)},d=a.fromNode,c=a.toNode,e=this.chart,l=this.translationFactor,f=Math.max(a.weight*l,this.options.minLinkWidth),g=(e.inverted?-this.colDistance:this.colDistance)*this.options.curveFactor,r=b(d,"linksFrom");b=b(c,
"linksTo");var h=d.nodeX,k=this.nodeWidth;c=c.column*this.colDistance;var m=a.outgoing,n=c>h+k;e.inverted&&(r=e.plotSizeY-r,b=(e.plotSizeY||0)-b,c=e.plotSizeX-c,k=-k,f=-f,n=h>c);a.shapeType="path";a.linkBase=[r,r+f,b,b+f];if(n&&"number"===typeof b)a.shapeArgs={d:[["M",h+k,r],["C",h+k+g,r,c-g,b,c,b],["L",c+(m?k:0),b+f/2],["L",c,b+f],["C",c-g,b+f,h+k+g,r+f,h+k,r+f],["Z"]]};else if("number"===typeof b){g=c-20-f;m=c-20;n=c;var p=h+k,q=p+20,t=q+f,v=r,u=r+f,G=u+20,C=G+(e.plotHeight-r-f),y=C+20,E=y+f,H=
b,D=H+f,z=D+20,A=y+.7*f,B=n-.7*f,J=p+.7*f;a.shapeArgs={d:[["M",p,v],["C",J,v,t,u-.7*f,t,G],["L",t,C],["C",t,A,J,E,p,E],["L",n,E],["C",B,E,g,A,g,C],["L",g,z],["C",g,D-.7*f,B,H,n,H],["L",n,D],["C",m,D,m,D,m,z],["L",m,C],["C",m,y,m,y,n,y],["L",p,y],["C",q,y,q,y,q,C],["L",q,G],["C",q,u,q,u,p,u],["Z"]]}}a.dlBox={x:h+(c-h+k)/2,y:r+(b-r)/2,height:f,width:0};a.tooltipPos=e.inverted?[e.plotSizeY-a.dlBox.y-f/2,e.plotSizeX-a.dlBox.x]:[a.dlBox.x,a.dlBox.y+f/2];a.y=a.plotY=1;a.color||(a.color=d.color)};e.prototype.translateNode=
function(a,b){var c=this.translationFactor,d=this.chart,f=this.options,g=a.getSum(),l=Math.max(Math.round(g*c),this.options.minLinkWidth),h=Math.round(f.borderWidth)%2/2,k=b.offset(a,c);b=Math.floor(t(k.absoluteTop,b.top(c)+k.relativeTop))+h;h=Math.floor(this.colDistance*a.column+f.borderWidth/2)+h;h=d.inverted?d.plotSizeX-h:h;c=Math.round(this.nodeWidth);if(a.sum=g){a.shapeType="rect";a.nodeX=h;a.nodeY=b;g=h;k=b;var m=a.options.width||f.width||c,n=a.options.height||f.height||l;d.inverted&&(g=h-c,
k=d.plotSizeY-b-l,m=a.options.height||f.height||c,n=a.options.width||f.width||l);a.dlOptions=e.getDLOptions({level:this.mapOptionsToLevel[a.level],optionsPoint:a.options});a.plotX=1;a.plotY=1;a.tooltipPos=d.inverted?[d.plotSizeY-k-n/2,d.plotSizeX-g-m/2]:[g+m/2,k+n/2];a.shapeArgs={x:g,y:k,width:m,height:n,display:a.hasShape()?"":"none"}}else a.dlOptions={enabled:!1}};e.defaultOptions=A(b.defaultOptions,{borderWidth:0,colorByPoint:!0,curveFactor:.33,dataLabels:{enabled:!0,backgroundColor:"none",crop:!1,
nodeFormat:void 0,nodeFormatter:function(){return this.point.name},format:void 0,formatter:function(){},inside:!0},inactiveOtherPoints:!0,linkOpacity:.5,minLinkWidth:0,nodeWidth:20,nodePadding:10,showInLegend:!1,states:{hover:{linkOpacity:1},inactive:{linkOpacity:.1,opacity:.1,animation:{duration:50}}},tooltip:{followPointer:!0,headerFormat:'<span style="font-size: 10px">{series.name}</span><br/>',pointFormat:"{point.fromNode.name} \u2192 {point.toNode.name}: <b>{point.weight}</b><br/>",nodeFormat:"{point.name}: <b>{point.sum}</b><br/>"}});
return e}(b);g(e.prototype,{animate:d.prototype.animate,createNode:h.createNode,destroy:h.destroy,forceDL:!0,invertible:!0,isCartesian:!1,orderNodes:!0,pointArrayMap:["from","to"],pointClass:k,searchPoint:f.noop,setData:h.setData});p.registerSeriesType("sankey",e);"";"";return e});q(c,"masters/modules/sankey.src.js",[],function(){})});
//# sourceMappingURL=sankey.js.map