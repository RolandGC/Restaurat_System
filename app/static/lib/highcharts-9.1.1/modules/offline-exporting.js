/*
 Highcharts JS v9.1.1 (2021-06-03)

 Client side exporting module

 (c) 2015-2021 Torstein Honsi / Oystein Moseng

 License: www.highcharts.com/license
*/
'use strict';(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/modules/offline-exporting",["highcharts","highcharts/modules/exporting"],function(l){a(l);a.Highcharts=l;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function l(a,e,b,n){a.hasOwnProperty(e)||(a[e]=n.apply(null,b))}a=a?a._modules:{};l(a,"Extensions/DownloadURL.js",[a["Core/Globals.js"]],function(a){var e=a.isSafari,
b=a.win,n=b.document,m=b.URL||b.webkitURL||b,l=a.dataURLtoBlob=function(a){if((a=a.replace(/filename=.*;/,"").match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/))&&3<a.length&&b.atob&&b.ArrayBuffer&&b.Uint8Array&&b.Blob&&m.createObjectURL){var w=b.atob(a[3]),e=new b.ArrayBuffer(w.length);e=new b.Uint8Array(e);for(var d=0;d<e.length;++d)e[d]=w.charCodeAt(d);a=new b.Blob([e],{type:a[1]});return m.createObjectURL(a)}};a=a.downloadURL=function(a,m){var u=b.navigator,d=n.createElement("a");if("string"===
typeof a||a instanceof String||!u.msSaveOrOpenBlob){a=""+a;u=/Edge\/\d+/.test(u.userAgent);if(e&&"string"===typeof a&&0===a.indexOf("data:application/pdf")||u||2E6<a.length)if(a=l(a)||"",!a)throw Error("Failed to convert to blob");if("undefined"!==typeof d.download)d.href=a,d.download=m,n.body.appendChild(d),d.click(),n.body.removeChild(d);else try{var h=b.open(a,"chart");if("undefined"===typeof h||null===h)throw Error("Failed to open window");}catch(x){b.location.href=a}}else u.msSaveOrOpenBlob(a,
m)};return{dataURLtoBlob:l,downloadURL:a}});l(a,"Extensions/OfflineExporting.js",[a["Core/Chart/Chart.js"],a["Core/Globals.js"],a["Core/DefaultOptions.js"],a["Core/Renderer/SVG/SVGRenderer.js"],a["Core/Utilities.js"],a["Extensions/DownloadURL.js"]],function(a,e,b,l,m,G){function w(a,g){var f=x.getElementsByTagName("head")[0],c=x.createElement("script");c.type="text/javascript";c.src=a;c.onload=g;c.onerror=function(){B("Error loading script "+a)};f.appendChild(c)}function n(a){var g=h.navigator.userAgent;
g=-1<g.indexOf("WebKit")&&0>g.indexOf("Chrome");try{if(!g&&!e.isFirefox&&-1===a.indexOf("<foreignObject"))return C.createObjectURL(new h.Blob([a],{type:"image/svg+xml;charset-utf-16"}))}catch(f){}return"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(a)}function u(a,g,f,c,e,b,d,H,r){var k=new h.Image,q=function(){setTimeout(function(){var b=x.createElement("canvas"),q=b.getContext&&b.getContext("2d");try{if(q){b.height=k.height*c;b.width=k.width*c;q.drawImage(k,0,0,b.width,b.height);try{var y=
b.toDataURL(g);e(y,g,f,c)}catch(D){z(a,g,f,c)}}else d(a,g,f,c)}finally{r&&r(a,g,f,c)}},I)},p=function(){H(a,g,f,c);r&&r(a,g,f,c)};var z=function(){k=new h.Image;z=b;k.crossOrigin="Anonymous";k.onload=q;k.onerror=p;k.src=a};k.onload=q;k.onerror=p;k.src=a}function d(a,b,f,c){function e(a,c){var b=a.width.baseVal.value+2*c;c=a.height.baseVal.value+2*c;b=new h.jsPDF(c>b?"p":"l","pt",[b,c]);[].forEach.call(a.querySelectorAll('*[visibility="hidden"]'),function(a){a.parentNode.removeChild(a)});c=a.querySelectorAll("linearGradient");
for(var f=0;f<c.length;f++)for(var e=c[f].querySelectorAll("stop"),d=0;d<e.length&&"0"===e[d].getAttribute("offset")&&"0"===e[d+1].getAttribute("offset");)e[d].remove(),d++;[].forEach.call(a.querySelectorAll("tspan"),function(a){"\u200b"===a.textContent&&(a.textContent=" ",a.setAttribute("dx",-5))});h.svg2pdf(a,b,{removeInvalid:!0});return b.output("datauristring")}function q(){r.innerHTML=a;var b=r.getElementsByTagName("text"),d;[].forEach.call(b,function(a){["font-family","font-size"].forEach(function(c){for(var b=
a;b&&b!==r;){if(b.style[c]){a.style[c]=b.style[c];break}b=b.parentNode}});a.style["font-family"]=a.style["font-family"]&&a.style["font-family"].split(" ").splice(-1);d=a.getElementsByTagName("title");[].forEach.call(d,function(c){a.removeChild(c)})});b=e(r.firstChild,0);try{A(b,l),c&&c()}catch(J){f(J)}}var g=!0,d=b.libURL||E().exporting.libURL,r=x.createElement("div"),k=b.type||"image/png",l=(b.filename||"chart")+"."+("image/svg+xml"===k?"svg":k.split("/")[1]),m=b.scale||1;d="/"!==d.slice(-1)?d+"/":
d;if("image/svg+xml"===k)try{if("undefined"!==typeof h.navigator.msSaveOrOpenBlob){var p=new MSBlobBuilder;p.append(a);var t=p.getBlob("image/svg+xml")}else t=n(a);A(t,l);c&&c()}catch(y){f(y)}else if("application/pdf"===k)h.jsPDF&&h.svg2pdf?q():(g=!0,w(d+"jspdf.js",function(){w(d+"svg2pdf.js",function(){q()})}));else{t=n(a);var v=function(){try{C.revokeObjectURL(t)}catch(y){}};u(t,k,{},m,function(a){try{A(a,l),c&&c()}catch(D){f(D)}},function(){var b=x.createElement("canvas"),e=b.getContext("2d"),
q=a.match(/^<svg[^>]*width\s*=\s*"?(\d+)"?[^>]*>/)[1]*m,z=a.match(/^<svg[^>]*height\s*=\s*"?(\d+)"?[^>]*>/)[1]*m,p=function(){h.canvg.Canvg.fromString(e,a).start();try{A(h.navigator.msSaveOrOpenBlob?b.msToBlob():b.toDataURL(k),l),c&&c()}catch(K){f(K)}finally{v()}};b.width=q;b.height=z;h.canvg?p():(g=!0,w(d+"canvg.js",function(){p()}))},f,f,function(){g&&v()})}}var h=e.win,x=e.doc,E=b.getOptions,L=m.addEvent,B=m.error,M=m.extend,N=m.fireEvent,F=m.merge,A=G.downloadURL,C=h.URL||h.webkitURL||h,I=e.isMS?
150:0;e.CanVGRenderer={};a.prototype.getSVGForLocalExport=function(a,b,f,c){var d=this,e=0,g,h,l,k,m=function(){e===n.length&&c(d.sanitizeSVG(g.innerHTML,h))},p=function(a,b,c){++e;c.imageElement.setAttributeNS("http://www.w3.org/1999/xlink","href",a);m()};d.unbindGetSVG=L(d,"getSVG",function(a){h=a.chartCopy.options;g=a.chartCopy.container.cloneNode(!0)});d.getSVGForExport(a,b);var n=g.getElementsByTagName("image");try{if(!n.length){c(d.sanitizeSVG(g.innerHTML,h));return}var t=0;for(l=n.length;t<
l;++t){var v=n[t];(k=v.getAttributeNS("http://www.w3.org/1999/xlink","href"))?u(k,"image/png",{imageElement:v},a.scale,p,f,f,f):(++e,v.parentNode.removeChild(v),m())}}catch(y){f(y)}d.unbindGetSVG()};a.prototype.exportChartLocal=function(a,b){var f=this,c=F(f.options.exporting,a),g=function(a){!1===c.fallbackToExportServer?c.error?c.error(c,a):B(28,!0):f.exportChart(c)};a=function(){return[].some.call(f.container.getElementsByTagName("image"),function(a){a=a.getAttribute("href");return""!==a&&0!==
a.indexOf("data:")})};e.isMS&&f.styledMode&&(l.prototype.inlineWhitelist=[/^blockSize/,/^border/,/^caretColor/,/^color/,/^columnRule/,/^columnRuleColor/,/^cssFloat/,/^cursor/,/^fill$/,/^fillOpacity/,/^font/,/^inlineSize/,/^length/,/^lineHeight/,/^opacity/,/^outline/,/^parentRule/,/^rx$/,/^ry$/,/^stroke/,/^textAlign/,/^textAnchor/,/^textDecoration/,/^transform/,/^vectorEffect/,/^visibility/,/^x$/,/^y$/]);e.isMS&&("application/pdf"===c.type||f.container.getElementsByTagName("image").length&&"image/svg+xml"!==
c.type)||"application/pdf"===c.type&&a()?g("Image type not supported for this chart/browser."):f.getSVGForLocalExport(c,b||{},g,function(a){-1<a.indexOf("<foreignObject")&&"image/svg+xml"!==c.type&&(e.isMS||"application/pdf"===c.type)?g("Image type not supportedfor charts with embedded HTML"):d(a,M({filename:f.getFilename()},c),g,function(){return N(f,"exportChartLocalSuccess")})})};F(!0,E().exporting,{libURL:"https://code.highcharts.com/9.1.1/lib/",menuItemDefinitions:{downloadPNG:{textKey:"downloadPNG",
onclick:function(){this.exportChartLocal()}},downloadJPEG:{textKey:"downloadJPEG",onclick:function(){this.exportChartLocal({type:"image/jpeg"})}},downloadSVG:{textKey:"downloadSVG",onclick:function(){this.exportChartLocal({type:"image/svg+xml"})}},downloadPDF:{textKey:"downloadPDF",onclick:function(){this.exportChartLocal({type:"application/pdf"})}}}});e.downloadSVGLocal=d});l(a,"masters/modules/offline-exporting.src.js",[],function(){})});
//# sourceMappingURL=offline-exporting.js.map