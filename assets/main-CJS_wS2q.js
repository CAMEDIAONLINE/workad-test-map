class w{constructor(e){this.properties=e??[]}get(e){const n=this.properties.filter(r=>r.name===e).map(r=>r.value);if(n.length>1)throw new Error('Expected only one property to be named "'+e+'"');if(n.length!==0)return n[0]}getString(e){return this.getByType(e,"string")}getNumber(e){return this.getByType(e,"number")}getBoolean(e){return this.getByType(e,"boolean")}getByType(e,n){const r=this.get(e);if(r!==void 0){if(n!=="json"&&typeof r!==n)throw new Error('Expected property "'+e+'" to have type "'+n+'"');return r}}mustGetString(e){return this.mustGetByType(e,"string")}mustGetNumber(e){return this.mustGetByType(e,"number")}mustGetBoolean(e){return this.mustGetByType(e,"boolean")}mustGetByType(e,n){const r=this.get(e);if(r===void 0)throw new Error('Property "'+e+'" is missing');if(n!=="json"&&typeof r!==n)throw new Error('Expected property "'+e+'" to have type "'+n+'"');return r}getType(e){const n=this.properties.filter(r=>r.name===e).map(r=>r.type);if(n.length>1)throw new Error('Expected only one property to be named "'+e+'"');if(n.length!==0)return n[0]}}const Q="https://unpkg.com/@workadventure/scripting-api-extra@1.9.3/dist";class ae{constructor(e){this.name=e.name,this.x=e.x,this.y=e.y,this.properties=new w(e.properties)}get isReadable(){const e=this.properties.getString("readableBy");return e?WA.player.tags.includes(e):!0}get isWritable(){const e=this.properties.getString("writableBy");return e?WA.player.tags.includes(e):!0}}function N(t){const e=t?"#"+t.join():"";WA.nav.openCoWebSite(Q+"/configuration.html"+e,!0)}async function le(t,e){const n=await WA.room.getTiledMap(),r=new Map;return Z(n.layers,r),r}function Z(t,e,n,r){for(const o of t)if(o.type==="objectgroup")for(const i of o.objects)(i.type==="variable"||i.class==="variable")&&e.set(i.name,new ae(i));else o.type==="group"&&Z(o.layers,e)}let G;async function L(){return G===void 0&&(G=ue()),G}async function ue(){return ce(await WA.room.getTiledMap())}function ce(t){const e=new Map;return ee(t.layers,"",e),e}function ee(t,e,n){for(const r of t)r.type==="group"?ee(r.layers,e+r.name+"/",n):(r.name=e+r.name,n.set(r.name,r))}async function te(){const t=await L(),e=[];for(const n of t.values())if(n.type==="objectgroup")for(const r of n.objects)(r.type==="area"||r.class==="area")&&e.push(r);return e}function fe(t){let e=1/0,n=1/0,r=0,o=0;const i=t.data;if(typeof i=="string")throw new Error("Unsupported tile layer data stored as string instead of CSV");for(let s=0;s<t.height;s++)for(let a=0;a<t.width;a++)i[a+s*t.width]!==0&&(e=Math.min(e,a),o=Math.max(o,a),n=Math.min(n,s),r=Math.max(r,s));return{top:n,left:e,right:o+1,bottom:r+1}}function ne(t){let e=1/0,n=1/0,r=0,o=0;for(const i of t){const s=fe(i);s.left<e&&(e=s.left),s.top<n&&(n=s.top),s.right>o&&(o=s.right),s.bottom>r&&(r=s.bottom)}return{top:n,left:e,right:o,bottom:r}}/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */var pe=Object.prototype.toString,S=Array.isArray||function(e){return pe.call(e)==="[object Array]"};function U(t){return typeof t=="function"}function ge(t){return S(t)?"array":typeof t}function V(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function $(t,e){return t!=null&&typeof t=="object"&&e in t}function he(t,e){return t!=null&&typeof t!="object"&&t.hasOwnProperty&&t.hasOwnProperty(e)}var de=RegExp.prototype.test;function ye(t,e){return de.call(t,e)}var me=/\S/;function ve(t){return!ye(me,t)}var be={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};function Ae(t){return String(t).replace(/[&<>"'`=\/]/g,function(n){return be[n]})}var we=/\s*/,We=/\s+/,q=/\s*=/,Se=/\s*\}/,Ce=/#|\^|\/|>|\{|&|=|!/;function Ee(t,e){if(!t)return[];var n=!1,r=[],o=[],i=[],s=!1,a=!1,l="",c=0;function p(){if(s&&!a)for(;i.length;)delete o[i.pop()];else i=[];s=!1,a=!1}var d,m,T;function C(b){if(typeof b=="string"&&(b=b.split(We,2)),!S(b)||b.length!==2)throw new Error("Invalid tags: "+b);d=new RegExp(V(b[0])+"\\s*"),m=new RegExp("\\s*"+V(b[1])),T=new RegExp("\\s*"+V("}"+b[1]))}C(e||h.tags);for(var f=new M(t),v,u,y,E,B,A;!f.eos();){if(v=f.pos,y=f.scanUntil(d),y)for(var x=0,se=y.length;x<se;++x)E=y.charAt(x),ve(E)?(i.push(o.length),l+=E):(a=!0,n=!0,l+=" "),o.push(["text",E,v,v+1]),v+=1,E===`
`&&(p(),l="",c=0,n=!1);if(!f.scan(d))break;if(s=!0,u=f.scan(Ce)||"name",f.scan(we),u==="="?(y=f.scanUntil(q),f.scan(q),f.scanUntil(m)):u==="{"?(y=f.scanUntil(T),f.scan(Se),f.scanUntil(m),u="&"):y=f.scanUntil(m),!f.scan(m))throw new Error("Unclosed tag at "+f.pos);if(u==">"?B=[u,y,v,f.pos,l,c,n]:B=[u,y,v,f.pos],c++,o.push(B),u==="#"||u==="^")r.push(B);else if(u==="/"){if(A=r.pop(),!A)throw new Error('Unopened section "'+y+'" at '+v);if(A[1]!==y)throw new Error('Unclosed section "'+A[1]+'" at '+v)}else u==="name"||u==="{"||u==="&"?a=!0:u==="="&&C(y)}if(p(),A=r.pop(),A)throw new Error('Unclosed section "'+A[1]+'" at '+f.pos);return Le(Pe(o))}function Pe(t){for(var e=[],n,r,o=0,i=t.length;o<i;++o)n=t[o],n&&(n[0]==="text"&&r&&r[0]==="text"?(r[1]+=n[1],r[3]=n[3]):(e.push(n),r=n));return e}function Le(t){for(var e=[],n=e,r=[],o,i,s=0,a=t.length;s<a;++s)switch(o=t[s],o[0]){case"#":case"^":n.push(o),r.push(o),n=o[4]=[];break;case"/":i=r.pop(),i[5]=o[2],n=r.length>0?r[r.length-1][4]:e;break;default:n.push(o)}return e}function M(t){this.string=t,this.tail=t,this.pos=0}M.prototype.eos=function(){return this.tail===""};M.prototype.scan=function(e){var n=this.tail.match(e);if(!n||n.index!==0)return"";var r=n[0];return this.tail=this.tail.substring(r.length),this.pos+=r.length,r};M.prototype.scanUntil=function(e){var n=this.tail.search(e),r;switch(n){case-1:r=this.tail,this.tail="";break;case 0:r="";break;default:r=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=r.length,r};function W(t,e){this.view=t,this.cache={".":this.view},this.parent=e}W.prototype.push=function(e){return new W(e,this)};W.prototype.lookup=function(e){var n=this.cache,r;if(n.hasOwnProperty(e))r=n[e];else{for(var o=this,i,s,a,l=!1;o;){if(e.indexOf(".")>0)for(i=o.view,s=e.split("."),a=0;i!=null&&a<s.length;)a===s.length-1&&(l=$(i,s[a])||he(i,s[a])),i=i[s[a++]];else i=o.view[e],l=$(o.view,e);if(l){r=i;break}o=o.parent}n[e]=r}return U(r)&&(r=r.call(this.view)),r};function g(){this.templateCache={_cache:{},set:function(e,n){this._cache[e]=n},get:function(e){return this._cache[e]},clear:function(){this._cache={}}}}g.prototype.clearCache=function(){typeof this.templateCache<"u"&&this.templateCache.clear()};g.prototype.parse=function(e,n){var r=this.templateCache,o=e+":"+(n||h.tags).join(":"),i=typeof r<"u",s=i?r.get(o):void 0;return s==null&&(s=Ee(e,n),i&&r.set(o,s)),s};g.prototype.render=function(e,n,r,o){var i=this.getConfigTags(o),s=this.parse(e,i),a=n instanceof W?n:new W(n,void 0);return this.renderTokens(s,a,r,e,o)};g.prototype.renderTokens=function(e,n,r,o,i){for(var s="",a,l,c,p=0,d=e.length;p<d;++p)c=void 0,a=e[p],l=a[0],l==="#"?c=this.renderSection(a,n,r,o,i):l==="^"?c=this.renderInverted(a,n,r,o,i):l===">"?c=this.renderPartial(a,n,r,i):l==="&"?c=this.unescapedValue(a,n):l==="name"?c=this.escapedValue(a,n,i):l==="text"&&(c=this.rawValue(a)),c!==void 0&&(s+=c);return s};g.prototype.renderSection=function(e,n,r,o,i){var s=this,a="",l=n.lookup(e[1]);function c(m){return s.render(m,n,r,i)}if(l){if(S(l))for(var p=0,d=l.length;p<d;++p)a+=this.renderTokens(e[4],n.push(l[p]),r,o,i);else if(typeof l=="object"||typeof l=="string"||typeof l=="number")a+=this.renderTokens(e[4],n.push(l),r,o,i);else if(U(l)){if(typeof o!="string")throw new Error("Cannot use higher-order sections without the original template");l=l.call(n.view,o.slice(e[3],e[5]),c),l!=null&&(a+=l)}else a+=this.renderTokens(e[4],n,r,o,i);return a}};g.prototype.renderInverted=function(e,n,r,o,i){var s=n.lookup(e[1]);if(!s||S(s)&&s.length===0)return this.renderTokens(e[4],n,r,o,i)};g.prototype.indentPartial=function(e,n,r){for(var o=n.replace(/[^ \t]/g,""),i=e.split(`
`),s=0;s<i.length;s++)i[s].length&&(s>0||!r)&&(i[s]=o+i[s]);return i.join(`
`)};g.prototype.renderPartial=function(e,n,r,o){if(r){var i=this.getConfigTags(o),s=U(r)?r(e[1]):r[e[1]];if(s!=null){var a=e[6],l=e[5],c=e[4],p=s;l==0&&c&&(p=this.indentPartial(s,c,a));var d=this.parse(p,i);return this.renderTokens(d,n,r,p,o)}}};g.prototype.unescapedValue=function(e,n){var r=n.lookup(e[1]);if(r!=null)return r};g.prototype.escapedValue=function(e,n,r){var o=this.getConfigEscape(r)||h.escape,i=n.lookup(e[1]);if(i!=null)return typeof i=="number"&&o===h.escape?String(i):o(i)};g.prototype.rawValue=function(e){return e[1]};g.prototype.getConfigTags=function(e){return S(e)?e:e&&typeof e=="object"?e.tags:void 0};g.prototype.getConfigEscape=function(e){if(e&&typeof e=="object"&&!S(e))return e.escape};var h={name:"mustache.js",version:"4.2.0",tags:["{{","}}"],clearCache:void 0,escape:void 0,parse:void 0,render:void 0,Scanner:void 0,Context:void 0,Writer:void 0,set templateCache(t){P.templateCache=t},get templateCache(){return P.templateCache}},P=new g;h.clearCache=function(){return P.clearCache()};h.parse=function(e,n){return P.parse(e,n)};h.render=function(e,n,r,o){if(typeof e!="string")throw new TypeError('Invalid template! Template should be a "string" but "'+ge(e)+'" was given as the first argument for mustache#render(template, view, partials)');return P.render(e,n,r,o)};h.escape=Ae;h.Scanner=M;h.Context=W;h.Writer=g;class re{constructor(e,n){this.template=e,this.state=n,this.ast=h.parse(e)}getValue(){return this.value===void 0&&(this.value=h.render(this.template,this.state)),this.value}onChange(e){const n=[];for(const r of this.getUsedVariables().values())n.push(this.state.onVariableChange(r).subscribe(()=>{const o=h.render(this.template,this.state);o!==this.value&&(this.value=o,e(this.value))}));return{unsubscribe:()=>{for(const r of n)r.unsubscribe()}}}isPureString(){return this.ast.length===0||this.ast.length===1&&this.ast[0][0]==="text"}getUsedVariables(){const e=new Set;return this.recursiveGetUsedVariables(this.ast,e),e}recursiveGetUsedVariables(e,n){for(const r of e){const o=r[0],i=r[1],s=r[4];["name","&","#","^"].includes(o)&&n.add(i),s!==void 0&&typeof s!="string"&&this.recursiveGetUsedVariables(s,n)}}}async function Me(){var t;const e=await te();for(const n of e){const r=(t=n.properties)!==null&&t!==void 0?t:[];for(const o of r){if(o.type==="int"||o.type==="bool"||o.type==="object"||typeof o.value!="string")continue;const i=new re(o.value,WA.state);if(i.isPureString())continue;const s=i.getValue();await F(n.name,o.name,s),i.onChange(async a=>{await F(n.name,o.name,a)})}}}async function Te(){var t;const e=await L();for(const[n,r]of e.entries())if(r.type!=="objectgroup"){const o=(t=r.properties)!==null&&t!==void 0?t:[];for(const i of o){if(i.type==="int"||i.type==="bool"||i.type==="object"||typeof i.value!="string")continue;const s=new re(i.value,WA.state);if(s.isPureString())continue;const a=s.getValue();K(n,i.name,a),s.onChange(l=>{K(n,i.name,l)})}}}async function F(t,e,n){console.log(t),(await WA.room.area.get(t)).setProperty(e,n)}function K(t,e,n){WA.room.setProperty(t,e,n),e==="visible"&&(n?WA.room.showLayer(t):WA.room.hideLayer(t))}const Be="https://admin.workadventu.re/html";let j,D=0,_=0;function H(t){if(WA.state[t.name]){let e=t.properties.mustGetString("openLayer");for(const n of e.split(`
`))WA.room.showLayer(n);e=t.properties.mustGetString("closeLayer");for(const n of e.split(`
`))WA.room.hideLayer(n)}else{let e=t.properties.mustGetString("openLayer");for(const n of e.split(`
`))WA.room.hideLayer(n);e=t.properties.mustGetString("closeLayer");for(const n of e.split(`
`))WA.room.showLayer(n)}}function ke(t){const e=t.properties.getString("openSound"),n=t.properties.getNumber("soundRadius");let r=1;if(n){const o=ie(t.properties.mustGetString("openLayer").split(`
`));if(o>n)return;r=1-o/n}e&&WA.sound.loadSound(e).play({volume:r})}function Re(t){const e=t.properties.getString("closeSound"),n=t.properties.getNumber("soundRadius");let r=1;if(n){const o=ie(t.properties.mustGetString("closeLayer").split(`
`));if(o>n)return;r=1-o/n}e&&WA.sound.loadSound(e).play({volume:r})}function oe(t){return t.map(e=>j.get(e)).filter(e=>(e==null?void 0:e.type)==="tilelayer")}function ie(t){const e=oe(t),n=ne(e),r=((n.right-n.left)/2+n.left)*32,o=((n.bottom-n.top)/2+n.top)*32;return Math.sqrt(Math.pow(D-r,2)+Math.pow(_-o,2))}function xe(t){WA.state.onVariableChange(t.name).subscribe(()=>{WA.state[t.name]?ke(t):Re(t),H(t)}),H(t)}function J(t,e,n,r){const o=t.name;let i,s,a=!1;const l=n.getString("tag");let c=!0;l&&!WA.player.tags.includes(l)&&(c=!1);const p=!!l;function d(){var u;i&&i.remove(),i=WA.ui.displayActionMessage({message:(u=n.getString("closeTriggerMessage"))!==null&&u!==void 0?u:"Press SPACE to close the door",callback:()=>{WA.state[e.name]=!1,m()}})}function m(){var u;i&&i.remove(),i=WA.ui.displayActionMessage({message:(u=n.getString("openTriggerMessage"))!==null&&u!==void 0?u:"Press SPACE to open the door",callback:()=>{WA.state[e.name]=!0,d()}})}function T(){let u;if(t.type==="tilelayer")u=ne(oe(e.properties.mustGetString("closeLayer").split(`
`)));else{if(t.x===void 0||t.y===void 0||t.width===void 0||t.height===void 0)throw new Error(`Doorstep zone "${t.name}" is missing x, y, width or height`);u={top:t.y,left:t.x,right:t.x+t.width,bottom:t.y+t.height}}s=WA.room.website.create({name:"doorKeypad"+o,url:r+"/keypad.html#"+encodeURIComponent(o),position:{x:u.right*32,y:u.top*32,width:32*3,height:32*4},allowApi:!0})}function C(){s&&(WA.room.website.delete(s.name),s=void 0)}function f(){if(a=!0,n.getBoolean("autoOpen")&&c){WA.state[e.name]=!0;return}if(!WA.state[e.name]&&(p&&!c||!p)&&(n.getString("code")||n.getString("codeVariable"))){T();return}c&&(WA.state[e.name]?d():m())}function v(){a=!1,n.getBoolean("autoClose")&&(WA.state[e.name]=!1),i&&i.remove(),C()}t.type==="tilelayer"?(WA.room.onEnterLayer(o).subscribe(f),WA.room.onLeaveLayer(o).subscribe(v)):(WA.room.area.onEnter(o).subscribe(f),WA.room.area.onLeave(o).subscribe(v)),WA.state.onVariableChange(e.name).subscribe(()=>{a&&(!n.getBoolean("autoClose")&&WA.state[e.name]===!0&&d(),s&&WA.state[e.name]===!0&&C(),!n.getBoolean("autoOpen")&&WA.state[e.name]===!1&&m())})}function Ge(t){const e=t.properties.mustGetString("bellSound"),n=t.properties.getNumber("soundRadius");let r=1;if(n){const o=Math.sqrt(Math.pow(t.x-D,2)+Math.pow(t.y-_,2));if(o>n)return;r=1-o/n}WA.sound.loadSound(e).play({volume:r})}function Ve(t){WA.state[t.name]===void 0&&(WA.state[t.name]=0),WA.state.onVariableChange(t.name).subscribe(()=>{WA.state[t.name]&&Ge(t)})}function z(t,e,n){let r;const o=e.getString("bellPopup");if(n.type==="tilelayer"){const i=n.name;WA.room.onEnterLayer(i).subscribe(()=>{var s;o?r=WA.ui.openPopup(o,"",[{label:(s=e.getString("bellButtonText"))!==null&&s!==void 0?s:"Ring",callback:()=>{WA.state[t]=WA.state[t]+1}}]):WA.state[t]=WA.state[t]+1}),WA.room.onLeaveLayer(i).subscribe(()=>{r&&(r.close(),r=void 0)})}else{const i=n.name;WA.room.area.onEnter(i).subscribe(()=>{var s;o?r=WA.ui.openPopup(o,"",[{label:(s=e.getString("bellButtonText"))!==null&&s!==void 0?s:"Ring",callback:()=>{WA.state[t]=WA.state[t]+1}}]):WA.state[t]=WA.state[t]+1}),WA.room.area.onLeave(i).subscribe(()=>{r&&(r.close(),r=void 0)})}}async function je(t){t=t??Be;const e=await le();j=await L();for(const n of e.values())n.properties.get("door")&&xe(n),n.properties.get("bell")&&Ve(n);for(const n of j.values()){const r=new w(n.properties),o=r.getString("doorVariable");if(o&&n.type==="tilelayer"){const s=e.get(o);if(s===void 0)throw new Error('Cannot find variable "'+o+'" referred in the "doorVariable" property of layer "'+n.name+'"');J(n,s,r,t)}const i=r.getString("bellVariable");i&&n.type==="tilelayer"&&z(i,r,n)}for(const n of await te()){const r=new w(n.properties),o=r.getString("doorVariable");if(o){const s=e.get(o);if(s===void 0)throw new Error('Cannot find variable "'+o+'" referred in the "doorVariable" property of object "'+n.name+'"');J(n,s,r,t)}const i=r.getString("bellVariable");i&&z(i,r,n)}WA.player.onPlayerMove(n=>{D=n.x,_=n.y})}function Ie(t,e){const n=t.getString("bindVariable");if(n){const r=t.get("enterValue"),o=t.get("leaveValue"),i=t.getString("triggerMessage"),s=t.getString("tag");Oe(n,e,r,o,i,s)}}let k;function Oe(t,e,n,r,o,i){i&&!WA.player.tags.includes(i)||(n!==void 0&&WA.room.onEnterLayer(e).subscribe(()=>{o?k=WA.ui.displayActionMessage({type:"message",message:o,callback:()=>{WA.state[t]=n}}):WA.state[t]=n}),r!==void 0&&WA.room.onLeaveLayer(e).subscribe(()=>{WA.state[t]=r,k&&(k.remove().catch(s=>{console.error(s)}),k=void 0)}))}async function Ue(){const t=await L();for(const e of t.values()){const n=new w(e.properties);Ie(n,e.name)}}let X;async function De(t){const e=await WA.room.getTiledMap();t=t??Q,X=await L();const n=e.layers.find(r=>r.name==="configuration");if(n){const o=new w(n.properties).getString("tag");(!o||WA.player.tags.includes(o))&&WA.ui.registerMenuCommand("Configure the room",()=>{WA.nav.openCoWebSite(t+"/configuration.html",!0)});for(const i of X.values()){const s=new w(i.properties),a=s.getString("openConfig");a&&i.type==="tilelayer"&&_e(a.split(","),i.name,s)}}}function _e(t,e,n){let r;const o=n.getString("openConfigAdminTag");let i=!0;o&&!WA.player.tags.includes(o)&&(i=!1);function s(){var l;r&&r.remove(),r=WA.ui.displayActionMessage({message:(l=n.getString("openConfigTriggerMessage"))!==null&&l!==void 0?l:"Press SPACE or touch here to configure",callback:()=>N(t)})}function a(){WA.nav.closeCoWebSite()}WA.room.onEnterLayer(e).subscribe(()=>{const l=n.getString("openConfigTrigger");i&&(l&&l==="onaction"?s():N(t))}),WA.room.onLeaveLayer(e).subscribe(()=>{r&&r.remove(),a()})}function Ne(){return WA.onInit().then(()=>{je().catch(t=>console.error(t)),Ue().catch(t=>console.error(t)),De().catch(t=>console.error(t)),Te().catch(t=>console.error(t)),Me().catch(t=>console.error(t))}).catch(t=>console.error(t))}const R=[{id:"conference-room",label:"CAMEDIA TEAM",teleport:"#conference-room-entry"},{id:"meeting-room-1",label:"Larry Page",teleport:"#meeting-room-1-entry"},{id:"meeting-room-2",label:"Steve Jobs",teleport:"#meeting-room-2-entry"},{id:"meeting-room-3",label:"Roger Moore",teleport:"#meeting-room-3-entry"},{id:"meeting-room-4",label:"Jimmy Page",teleport:"#meeting-room-4-entry"},{id:"meeting-room-5",label:"Bill Gates",teleport:"#meeting-room-5-entry"},{id:"meeting-room-6",label:"Philipp Erich",teleport:"#meeting-room-6-entry"},{id:"pause-room",label:"Pause",teleport:"#pause-entry"}];let Y=null,I=null;console.log("Script started successfully");WA.onInit().then(async()=>{console.log("Scripting API ready"),Ne().then(()=>{console.log("Scripting API Extra ready")}).catch(e=>console.error(e));const t=R.find(e=>e.id==="conference-room");t&&O(t);for(const e of R)WA.room.area.onEnter(e.id).subscribe(async()=>await $e(e))}).catch(t=>console.error(t));async function $e(t){if(Y=t,console.log(""),console.log("  - OEA - lastArea: ",Y),console.log("  - OEA - Open currentArea: ",t.id),I&&WA.ui.actionBar.removeButton(I),t.id==="pause-room"){const e=R.find(n=>n.id==="conference-room");e&&O(e)}else{const e=R.find(n=>n.id==="pause-room");e&&O(e)}}async function O(t){if(!t.teleport)return;const e=`teleport-${t.id}`;I=e,WA.ui.actionBar.addButton({id:e,label:`Zu ${t.label} teleportieren`,callback:async n=>{console.log(`teleport to: ${t.label}`,n),WA.nav.goToRoom(t.teleport)}})}
//# sourceMappingURL=main-CJS_wS2q.js.map
