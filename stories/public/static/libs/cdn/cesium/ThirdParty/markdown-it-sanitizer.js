!function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).markdownitSanitizer=e()}(function(){return function o(r,i,l){function a(n,e){if(!i[n]){if(!r[n]){var t="function"==typeof require&&require;if(!e&&t)return t(n,!0);if(s)return s(n,!0);t=new Error("Cannot find module '"+n+"'");throw t.code="MODULE_NOT_FOUND",t}t=i[n]={exports:{}};r[n][0].call(t.exports,function(e){var t=r[n][1][e];return a(t||e)},t,t.exports,o,r,i,l)}return i[n].exports}for(var s="function"==typeof require&&require,e=0;e<l.length;e++)a(l[e]);return a}({1:[function(e,t,n){"use strict";t.exports=function(e,t){for(var n=e.linkify,l=e.utils.escapeHtml,a=RegExp('<a\\s([^<>]*href="[^"<>]*"[^<>]*)\\s?>',"i"),s=RegExp('<img\\s([^<>]*src="[^"<>]*"[^<>]*)\\s?\\/?>',"i"),f=/^(?:https?:)?\/\//i,c=/^(?:https?:\/\/|ftp:\/\/|\/\/|mailto:|xmpp:)/i,u=void 0!==(t=t||{}).removeUnknown&&t.removeUnknown,i=void 0!==t.removeUnbalanced&&t.removeUnbalanced,h=void 0!==t.imageClass?t.imageClass:"",p=!1,d=["a","b","blockquote","code","em","h1","h2","h3","h4","h5","h6","li","ol","p","pre","s","sub","sup","strong","ul"],g=new Array(d.length),m=new Array(d.length),r=0;r<d.length;r++)g[r]=0;for(r=0;r<d.length;r++)m[r]=!1;function k(e){var t=n.match(e);return t&&1===t.length&&0===t[0].index&&t[0].lastIndex===e.length?t[0].url:null}function v(e){return e=e.replace(/<[^<>]*>?/gi,function(e){var t,n,o,r,i;return/(^<->|^<-\s|^<3\s)/.test(e)?e:(t=e.match(s))&&(o=k((n=t[1]).match(/src="([^"<>]*)"/i)[1]),i=(i=n.match(/alt="([^"<>]*)"/i))&&void 0!==i[1]?i[1]:"",r=(r=n.match(/title="([^"<>]*)"/i))&&void 0!==r[1]?r[1]:"",o&&f.test(o))?""!==h?'<img src="'+o+'" alt="'+i+'" title="'+r+'" class="'+h+'">':'<img src="'+o+'" alt="'+i+'" title="'+r+'">':(i=d.indexOf("a"),(t=e.match(a))&&(o=k((n=t[1]).match(/href="([^"<>]*)"/i)[1]),r=(r=n.match(/title="([^"<>]*)"/i))&&void 0!==r[1]?r[1]:"",o&&c.test(o))?(p=!0,g[i]+=1,'<a href="'+o+'" title="'+r+'" target="_blank">'):(t=/<\/a>/i.test(e))?(p=!0,--g[i],g[i]<0&&(m[i]=!0),"</a>"):(t=e.match(/<(br|hr)\s?\/?>/i))?"<"+t[1].toLowerCase()+">":(t=e.match(/<(\/?)(b|blockquote|code|em|h[1-6]|li|ol(?: start="\d+")?|p|pre|s|sub|sup|strong|ul)>/i))&&!/<\/ol start="\d+"/i.test(e)?(p=!0,i=d.indexOf(t[2].toLowerCase().split(" ")[0]),"/"===t[1]?--g[i]:g[i]+=1,g[i]<0&&(m[i]=!0),"<"+t[1]+t[2].toLowerCase()+">"):!0===u?"":l(e))})}e.core.ruler.after("linkify","sanitize_inline",function(e){var t,n,o;for(r=0;r<d.length;r++)g[r]=0;for(r=0;r<d.length;r++)m[r]=!1;for(p=!1,n=0;n<e.tokens.length;n++)if("html_block"===e.tokens[n].type&&(e.tokens[n].content=v(e.tokens[n].content)),"inline"===e.tokens[n].type)for(o=e.tokens[n].children,t=0;t<o.length;t++)"html_inline"===o[t].type&&(o[t].content=v(o[t].content))}),e.core.ruler.after("sanitize_inline","sanitize_balance",function(e){if(!1!==p){var t,n;for(r=0;r<d.length;r++)0!==g[r]&&(m[r]=!0);for(t=0;t<e.tokens.length;t++)if("html_block"!==e.tokens[t].type){if("inline"===e.tokens[t].type)for(n=e.tokens[t].children,r=0;r<n.length;r++)"html_inline"===n[r].type&&(n[r].content=o(n[r].content))}else e.tokens[t].content=o(e.tokens[t].content)}function o(e){for(var t,n,o,r=0;r<d.length;r++)!0===m[r]&&(t=e,n=d[r],o=void 0,o="a"===n?RegExp('<a href="[^"<>]*" title="[^"<>]*" target="_blank">',"g"):"ol"===n?/<ol(?: start="\d+")?>/g:RegExp("<"+n+">","g"),n=RegExp("</"+n+">","g"),e=t=!0===i?(t=t.replace(o,"")).replace(n,""):(t=t.replace(o,function(e){return l(e)})).replace(n,function(e){return l(e)}));return e}})}},{}]},{},[1])(1)});