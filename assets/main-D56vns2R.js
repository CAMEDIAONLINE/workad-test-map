class A{constructor(e){this.properties=e??[]}get(e){const n=this.properties.filter(r=>r.name===e).map(r=>r.value);if(n.length>1)throw new Error('Expected only one property to be named "'+e+'"');if(n.length!==0)return n[0]}getString(e){return this.getByType(e,"string")}getNumber(e){return this.getByType(e,"number")}getBoolean(e){return this.getByType(e,"boolean")}getByType(e,n){const r=this.get(e);if(r!==void 0){if(n!=="json"&&typeof r!==n)throw new Error('Expected property "'+e+'" to have type "'+n+'"');return r}}mustGetString(e){return this.mustGetByType(e,"string")}mustGetNumber(e){return this.mustGetByType(e,"number")}mustGetBoolean(e){return this.mustGetByType(e,"boolean")}mustGetByType(e,n){const r=this.get(e);if(r===void 0)throw new Error('Property "'+e+'" is missing');if(n!=="json"&&typeof r!==n)throw new Error('Expected property "'+e+'" to have type "'+n+'"');return r}getType(e){const n=this.properties.filter(r=>r.name===e).map(r=>r.type);if(n.length>1)throw new Error('Expected only one property to be named "'+e+'"');if(n.length!==0)return n[0]}}const H="https://unpkg.com/@workadventure/scripting-api-extra@1.9.3/dist";class ie{constructor(e){this.name=e.name,this.x=e.x,this.y=e.y,this.properties=new A(e.properties)}get isReadable(){const e=this.properties.getString("readableBy");return e?WA.player.tags.includes(e):!0}get isWritable(){const e=this.properties.getString("writableBy");return e?WA.player.tags.includes(e):!0}}function _(t){const e=t?"#"+t.join():"";WA.nav.openCoWebSite(H+"/configuration.html"+e,!0)}async function se(t,e){const n=await WA.room.getTiledMap(),r=new Map;return X(n.layers,r),r}function X(t,e,n,r){for(const o of t)if(o.type==="objectgroup")for(const i of o.objects)(i.type==="variable"||i.class==="variable")&&e.set(i.name,new ie(i));else o.type==="group"&&X(o.layers,e)}let j;async function P(){return j===void 0&&(j=ae()),j}async function ae(){return le(await WA.room.getTiledMap())}function le(t){const e=new Map;return Y(t.layers,"",e),e}function Y(t,e,n){for(const r of t)r.type==="group"?Y(r.layers,e+r.name+"/",n):(r.name=e+r.name,n.set(r.name,r))}async function Q(){const t=await P(),e=[];for(const n of t.values())if(n.type==="objectgroup")for(const r of n.objects)(r.type==="area"||r.class==="area")&&e.push(r);return e}function ce(t){let e=1/0,n=1/0,r=0,o=0;const i=t.data;if(typeof i=="string")throw new Error("Unsupported tile layer data stored as string instead of CSV");for(let s=0;s<t.height;s++)for(let a=0;a<t.width;a++)i[a+s*t.width]!==0&&(e=Math.min(e,a),o=Math.max(o,a),n=Math.min(n,s),r=Math.max(r,s));return{top:n,left:e,right:o+1,bottom:r+1}}function Z(t){let e=1/0,n=1/0,r=0,o=0;for(const i of t){const s=ce(i);s.left<e&&(e=s.left),s.top<n&&(n=s.top),s.right>o&&(o=s.right),s.bottom>r&&(r=s.bottom)}return{top:n,left:e,right:o,bottom:r}}/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */var ue=Object.prototype.toString,S=Array.isArray||function(e){return ue.call(e)==="[object Array]"};function O(t){return typeof t=="function"}function fe(t){return S(t)?"array":typeof t}function G(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function D(t,e){return t!=null&&typeof t=="object"&&e in t}function pe(t,e){return t!=null&&typeof t!="object"&&t.hasOwnProperty&&t.hasOwnProperty(e)}var ge=RegExp.prototype.test;function de(t,e){return ge.call(t,e)}var he=/\S/;function ye(t){return!de(he,t)}var me={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};function ve(t){return String(t).replace(/[&<>"'`=\/]/g,function(n){return me[n]})}var be=/\s*/,we=/\s+/,U=/\s*=/,Ae=/\s*\}/,We=/#|\^|\/|>|\{|&|=|!/;function Se(t,e){if(!t)return[];var n=!1,r=[],o=[],i=[],s=!1,a=!1,l="",u=0;function p(){if(s&&!a)for(;i.length;)delete o[i.pop()];else i=[];s=!1,a=!1}var h,m,T;function C(b){if(typeof b=="string"&&(b=b.split(we,2)),!S(b)||b.length!==2)throw new Error("Invalid tags: "+b);h=new RegExp(G(b[0])+"\\s*"),m=new RegExp("\\s*"+G(b[1])),T=new RegExp("\\s*"+G("}"+b[1]))}C(e||d.tags);for(var f=new B(t),v,c,y,E,k,w;!f.eos();){if(v=f.pos,y=f.scanUntil(h),y)for(var x=0,oe=y.length;x<oe;++x)E=y.charAt(x),ye(E)?(i.push(o.length),l+=E):(a=!0,n=!0,l+=" "),o.push(["text",E,v,v+1]),v+=1,E===`
`&&(p(),l="",u=0,n=!1);if(!f.scan(h))break;if(s=!0,c=f.scan(We)||"name",f.scan(be),c==="="?(y=f.scanUntil(U),f.scan(U),f.scanUntil(m)):c==="{"?(y=f.scanUntil(T),f.scan(Ae),f.scanUntil(m),c="&"):y=f.scanUntil(m),!f.scan(m))throw new Error("Unclosed tag at "+f.pos);if(c==">"?k=[c,y,v,f.pos,l,u,n]:k=[c,y,v,f.pos],u++,o.push(k),c==="#"||c==="^")r.push(k);else if(c==="/"){if(w=r.pop(),!w)throw new Error('Unopened section "'+y+'" at '+v);if(w[1]!==y)throw new Error('Unclosed section "'+w[1]+'" at '+v)}else c==="name"||c==="{"||c==="&"?a=!0:c==="="&&C(y)}if(p(),w=r.pop(),w)throw new Error('Unclosed section "'+w[1]+'" at '+f.pos);return Ee(Ce(o))}function Ce(t){for(var e=[],n,r,o=0,i=t.length;o<i;++o)n=t[o],n&&(n[0]==="text"&&r&&r[0]==="text"?(r[1]+=n[1],r[3]=n[3]):(e.push(n),r=n));return e}function Ee(t){for(var e=[],n=e,r=[],o,i,s=0,a=t.length;s<a;++s)switch(o=t[s],o[0]){case"#":case"^":n.push(o),r.push(o),n=o[4]=[];break;case"/":i=r.pop(),i[5]=o[2],n=r.length>0?r[r.length-1][4]:e;break;default:n.push(o)}return e}function B(t){this.string=t,this.tail=t,this.pos=0}B.prototype.eos=function(){return this.tail===""};B.prototype.scan=function(e){var n=this.tail.match(e);if(!n||n.index!==0)return"";var r=n[0];return this.tail=this.tail.substring(r.length),this.pos+=r.length,r};B.prototype.scanUntil=function(e){var n=this.tail.search(e),r;switch(n){case-1:r=this.tail,this.tail="";break;case 0:r="";break;default:r=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=r.length,r};function W(t,e){this.view=t,this.cache={".":this.view},this.parent=e}W.prototype.push=function(e){return new W(e,this)};W.prototype.lookup=function(e){var n=this.cache,r;if(n.hasOwnProperty(e))r=n[e];else{for(var o=this,i,s,a,l=!1;o;){if(e.indexOf(".")>0)for(i=o.view,s=e.split("."),a=0;i!=null&&a<s.length;)a===s.length-1&&(l=D(i,s[a])||pe(i,s[a])),i=i[s[a++]];else i=o.view[e],l=D(o.view,e);if(l){r=i;break}o=o.parent}n[e]=r}return O(r)&&(r=r.call(this.view)),r};function g(){this.templateCache={_cache:{},set:function(e,n){this._cache[e]=n},get:function(e){return this._cache[e]},clear:function(){this._cache={}}}}g.prototype.clearCache=function(){typeof this.templateCache<"u"&&this.templateCache.clear()};g.prototype.parse=function(e,n){var r=this.templateCache,o=e+":"+(n||d.tags).join(":"),i=typeof r<"u",s=i?r.get(o):void 0;return s==null&&(s=Se(e,n),i&&r.set(o,s)),s};g.prototype.render=function(e,n,r,o){var i=this.getConfigTags(o),s=this.parse(e,i),a=n instanceof W?n:new W(n,void 0);return this.renderTokens(s,a,r,e,o)};g.prototype.renderTokens=function(e,n,r,o,i){for(var s="",a,l,u,p=0,h=e.length;p<h;++p)u=void 0,a=e[p],l=a[0],l==="#"?u=this.renderSection(a,n,r,o,i):l==="^"?u=this.renderInverted(a,n,r,o,i):l===">"?u=this.renderPartial(a,n,r,i):l==="&"?u=this.unescapedValue(a,n):l==="name"?u=this.escapedValue(a,n,i):l==="text"&&(u=this.rawValue(a)),u!==void 0&&(s+=u);return s};g.prototype.renderSection=function(e,n,r,o,i){var s=this,a="",l=n.lookup(e[1]);function u(m){return s.render(m,n,r,i)}if(l){if(S(l))for(var p=0,h=l.length;p<h;++p)a+=this.renderTokens(e[4],n.push(l[p]),r,o,i);else if(typeof l=="object"||typeof l=="string"||typeof l=="number")a+=this.renderTokens(e[4],n.push(l),r,o,i);else if(O(l)){if(typeof o!="string")throw new Error("Cannot use higher-order sections without the original template");l=l.call(n.view,o.slice(e[3],e[5]),u),l!=null&&(a+=l)}else a+=this.renderTokens(e[4],n,r,o,i);return a}};g.prototype.renderInverted=function(e,n,r,o,i){var s=n.lookup(e[1]);if(!s||S(s)&&s.length===0)return this.renderTokens(e[4],n,r,o,i)};g.prototype.indentPartial=function(e,n,r){for(var o=n.replace(/[^ \t]/g,""),i=e.split(`
`),s=0;s<i.length;s++)i[s].length&&(s>0||!r)&&(i[s]=o+i[s]);return i.join(`
`)};g.prototype.renderPartial=function(e,n,r,o){if(r){var i=this.getConfigTags(o),s=O(r)?r(e[1]):r[e[1]];if(s!=null){var a=e[6],l=e[5],u=e[4],p=s;l==0&&u&&(p=this.indentPartial(s,u,a));var h=this.parse(p,i);return this.renderTokens(h,n,r,p,o)}}};g.prototype.unescapedValue=function(e,n){var r=n.lookup(e[1]);if(r!=null)return r};g.prototype.escapedValue=function(e,n,r){var o=this.getConfigEscape(r)||d.escape,i=n.lookup(e[1]);if(i!=null)return typeof i=="number"&&o===d.escape?String(i):o(i)};g.prototype.rawValue=function(e){return e[1]};g.prototype.getConfigTags=function(e){return S(e)?e:e&&typeof e=="object"?e.tags:void 0};g.prototype.getConfigEscape=function(e){if(e&&typeof e=="object"&&!S(e))return e.escape};var d={name:"mustache.js",version:"4.2.0",tags:["{{","}}"],clearCache:void 0,escape:void 0,parse:void 0,render:void 0,Scanner:void 0,Context:void 0,Writer:void 0,set templateCache(t){L.templateCache=t},get templateCache(){return L.templateCache}},L=new g;d.clearCache=function(){return L.clearCache()};d.parse=function(e,n){return L.parse(e,n)};d.render=function(e,n,r,o){if(typeof e!="string")throw new TypeError('Invalid template! Template should be a "string" but "'+fe(e)+'" was given as the first argument for mustache#render(template, view, partials)');return L.render(e,n,r,o)};d.escape=ve;d.Scanner=B;d.Context=W;d.Writer=g;class ee{constructor(e,n){this.template=e,this.state=n,this.ast=d.parse(e)}getValue(){return this.value===void 0&&(this.value=d.render(this.template,this.state)),this.value}onChange(e){const n=[];for(const r of this.getUsedVariables().values())n.push(this.state.onVariableChange(r).subscribe(()=>{const o=d.render(this.template,this.state);o!==this.value&&(this.value=o,e(this.value))}));return{unsubscribe:()=>{for(const r of n)r.unsubscribe()}}}isPureString(){return this.ast.length===0||this.ast.length===1&&this.ast[0][0]==="text"}getUsedVariables(){const e=new Set;return this.recursiveGetUsedVariables(this.ast,e),e}recursiveGetUsedVariables(e,n){for(const r of e){const o=r[0],i=r[1],s=r[4];["name","&","#","^"].includes(o)&&n.add(i),s!==void 0&&typeof s!="string"&&this.recursiveGetUsedVariables(s,n)}}}async function Me(){var t;const e=await Q();for(const n of e){const r=(t=n.properties)!==null&&t!==void 0?t:[];for(const o of r){if(o.type==="int"||o.type==="bool"||o.type==="object"||typeof o.value!="string")continue;const i=new ee(o.value,WA.state);if(i.isPureString())continue;const s=i.getValue();await N(n.name,o.name,s),i.onChange(async a=>{await N(n.name,o.name,a)})}}}async function Le(){var t;const e=await P();for(const[n,r]of e.entries())if(r.type!=="objectgroup"){const o=(t=r.properties)!==null&&t!==void 0?t:[];for(const i of o){if(i.type==="int"||i.type==="bool"||i.type==="object"||typeof i.value!="string")continue;const s=new ee(i.value,WA.state);if(s.isPureString())continue;const a=s.getValue();q(n,i.name,a),s.onChange(l=>{q(n,i.name,l)})}}}async function N(t,e,n){console.log(t),(await WA.room.area.get(t)).setProperty(e,n)}function q(t,e,n){WA.room.setProperty(t,e,n),e==="visible"&&(n?WA.room.showLayer(t):WA.room.hideLayer(t))}const Pe="https://admin.workadventu.re/html";let V,I=0,$=0;function F(t){if(WA.state[t.name]){let e=t.properties.mustGetString("openLayer");for(const n of e.split(`
`))WA.room.showLayer(n);e=t.properties.mustGetString("closeLayer");for(const n of e.split(`
`))WA.room.hideLayer(n)}else{let e=t.properties.mustGetString("openLayer");for(const n of e.split(`
`))WA.room.hideLayer(n);e=t.properties.mustGetString("closeLayer");for(const n of e.split(`
`))WA.room.showLayer(n)}}function Be(t){const e=t.properties.getString("openSound"),n=t.properties.getNumber("soundRadius");let r=1;if(n){const o=ne(t.properties.mustGetString("openLayer").split(`
`));if(o>n)return;r=1-o/n}e&&WA.sound.loadSound(e).play({volume:r})}function Te(t){const e=t.properties.getString("closeSound"),n=t.properties.getNumber("soundRadius");let r=1;if(n){const o=ne(t.properties.mustGetString("closeLayer").split(`
`));if(o>n)return;r=1-o/n}e&&WA.sound.loadSound(e).play({volume:r})}function te(t){return t.map(e=>V.get(e)).filter(e=>(e==null?void 0:e.type)==="tilelayer")}function ne(t){const e=te(t),n=Z(e),r=((n.right-n.left)/2+n.left)*32,o=((n.bottom-n.top)/2+n.top)*32;return Math.sqrt(Math.pow(I-r,2)+Math.pow($-o,2))}function ke(t){WA.state.onVariableChange(t.name).subscribe(()=>{WA.state[t.name]?Be(t):Te(t),F(t)}),F(t)}function J(t,e,n,r){const o=t.name;let i,s,a=!1;const l=n.getString("tag");let u=!0;l&&!WA.player.tags.includes(l)&&(u=!1);const p=!!l;function h(){var c;i&&i.remove(),i=WA.ui.displayActionMessage({message:(c=n.getString("closeTriggerMessage"))!==null&&c!==void 0?c:"Press SPACE to close the door",callback:()=>{WA.state[e.name]=!1,m()}})}function m(){var c;i&&i.remove(),i=WA.ui.displayActionMessage({message:(c=n.getString("openTriggerMessage"))!==null&&c!==void 0?c:"Press SPACE to open the door",callback:()=>{WA.state[e.name]=!0,h()}})}function T(){let c;if(t.type==="tilelayer")c=Z(te(e.properties.mustGetString("closeLayer").split(`
`)));else{if(t.x===void 0||t.y===void 0||t.width===void 0||t.height===void 0)throw new Error(`Doorstep zone "${t.name}" is missing x, y, width or height`);c={top:t.y,left:t.x,right:t.x+t.width,bottom:t.y+t.height}}s=WA.room.website.create({name:"doorKeypad"+o,url:r+"/keypad.html#"+encodeURIComponent(o),position:{x:c.right*32,y:c.top*32,width:32*3,height:32*4},allowApi:!0})}function C(){s&&(WA.room.website.delete(s.name),s=void 0)}function f(){if(a=!0,n.getBoolean("autoOpen")&&u){WA.state[e.name]=!0;return}if(!WA.state[e.name]&&(p&&!u||!p)&&(n.getString("code")||n.getString("codeVariable"))){T();return}u&&(WA.state[e.name]?h():m())}function v(){a=!1,n.getBoolean("autoClose")&&(WA.state[e.name]=!1),i&&i.remove(),C()}t.type==="tilelayer"?(WA.room.onEnterLayer(o).subscribe(f),WA.room.onLeaveLayer(o).subscribe(v)):(WA.room.area.onEnter(o).subscribe(f),WA.room.area.onLeave(o).subscribe(v)),WA.state.onVariableChange(e.name).subscribe(()=>{a&&(!n.getBoolean("autoClose")&&WA.state[e.name]===!0&&h(),s&&WA.state[e.name]===!0&&C(),!n.getBoolean("autoOpen")&&WA.state[e.name]===!1&&m())})}function Re(t){const e=t.properties.mustGetString("bellSound"),n=t.properties.getNumber("soundRadius");let r=1;if(n){const o=Math.sqrt(Math.pow(t.x-I,2)+Math.pow(t.y-$,2));if(o>n)return;r=1-o/n}WA.sound.loadSound(e).play({volume:r})}function xe(t){WA.state[t.name]===void 0&&(WA.state[t.name]=0),WA.state.onVariableChange(t.name).subscribe(()=>{WA.state[t.name]&&Re(t)})}function K(t,e,n){let r;const o=e.getString("bellPopup");if(n.type==="tilelayer"){const i=n.name;WA.room.onEnterLayer(i).subscribe(()=>{var s;o?r=WA.ui.openPopup(o,"",[{label:(s=e.getString("bellButtonText"))!==null&&s!==void 0?s:"Ring",callback:()=>{WA.state[t]=WA.state[t]+1}}]):WA.state[t]=WA.state[t]+1}),WA.room.onLeaveLayer(i).subscribe(()=>{r&&(r.close(),r=void 0)})}else{const i=n.name;WA.room.area.onEnter(i).subscribe(()=>{var s;o?r=WA.ui.openPopup(o,"",[{label:(s=e.getString("bellButtonText"))!==null&&s!==void 0?s:"Ring",callback:()=>{WA.state[t]=WA.state[t]+1}}]):WA.state[t]=WA.state[t]+1}),WA.room.area.onLeave(i).subscribe(()=>{r&&(r.close(),r=void 0)})}}async function je(t){t=t??Pe;const e=await se();V=await P();for(const n of e.values())n.properties.get("door")&&ke(n),n.properties.get("bell")&&xe(n);for(const n of V.values()){const r=new A(n.properties),o=r.getString("doorVariable");if(o&&n.type==="tilelayer"){const s=e.get(o);if(s===void 0)throw new Error('Cannot find variable "'+o+'" referred in the "doorVariable" property of layer "'+n.name+'"');J(n,s,r,t)}const i=r.getString("bellVariable");i&&n.type==="tilelayer"&&K(i,r,n)}for(const n of await Q()){const r=new A(n.properties),o=r.getString("doorVariable");if(o){const s=e.get(o);if(s===void 0)throw new Error('Cannot find variable "'+o+'" referred in the "doorVariable" property of object "'+n.name+'"');J(n,s,r,t)}const i=r.getString("bellVariable");i&&K(i,r,n)}WA.player.onPlayerMove(n=>{I=n.x,$=n.y})}function Ge(t,e){const n=t.getString("bindVariable");if(n){const r=t.get("enterValue"),o=t.get("leaveValue"),i=t.getString("triggerMessage"),s=t.getString("tag");Ve(n,e,r,o,i,s)}}let R;function Ve(t,e,n,r,o,i){i&&!WA.player.tags.includes(i)||(n!==void 0&&WA.room.onEnterLayer(e).subscribe(()=>{o?R=WA.ui.displayActionMessage({type:"message",message:o,callback:()=>{WA.state[t]=n}}):WA.state[t]=n}),r!==void 0&&WA.room.onLeaveLayer(e).subscribe(()=>{WA.state[t]=r,R&&(R.remove().catch(s=>{console.error(s)}),R=void 0)}))}async function Oe(){const t=await P();for(const e of t.values()){const n=new A(e.properties);Ge(n,e.name)}}let z;async function Ie(t){const e=await WA.room.getTiledMap();t=t??H,z=await P();const n=e.layers.find(r=>r.name==="configuration");if(n){const o=new A(n.properties).getString("tag");(!o||WA.player.tags.includes(o))&&WA.ui.registerMenuCommand("Configure the room",()=>{WA.nav.openCoWebSite(t+"/configuration.html",!0)});for(const i of z.values()){const s=new A(i.properties),a=s.getString("openConfig");a&&i.type==="tilelayer"&&$e(a.split(","),i.name,s)}}}function $e(t,e,n){let r;const o=n.getString("openConfigAdminTag");let i=!0;o&&!WA.player.tags.includes(o)&&(i=!1);function s(){var l;r&&r.remove(),r=WA.ui.displayActionMessage({message:(l=n.getString("openConfigTriggerMessage"))!==null&&l!==void 0?l:"Press SPACE or touch here to configure",callback:()=>_(t)})}function a(){WA.nav.closeCoWebSite()}WA.room.onEnterLayer(e).subscribe(()=>{const l=n.getString("openConfigTrigger");i&&(l&&l==="onaction"?s():_(t))}),WA.room.onLeaveLayer(e).subscribe(()=>{r&&r.remove(),a()})}function _e(){return WA.onInit().then(()=>{je().catch(t=>console.error(t)),Oe().catch(t=>console.error(t)),Ie().catch(t=>console.error(t)),Le().catch(t=>console.error(t)),Me().catch(t=>console.error(t))}).catch(t=>console.error(t))}const De=[{id:"conference-room",label:"CAMEDIA TEAM"},{id:"meeting-room-1",label:"Larry Page"},{id:"meeting-room-2",label:"Steve Jobs"},{id:"meeting-room-3",label:"Roger Moore"},{id:"meeting-room-4",label:"Jimmy Page"},{id:"meeting-room-5",label:"Bill Gates"},{id:"meeting-room-6",label:"Philipp Erich"}];let M=null;console.log("Script started successfully");WA.onInit().then(async()=>{console.log("Scripting API ready"),_e().then(()=>{console.log("Scripting API Extra ready")}).catch(t=>console.error(t));for(const t of De)WA.room.area.onEnter(t.id).subscribe(async()=>await Ue(t))}).catch(t=>console.error(t));async function Ue(t){console.log(""),console.log("OnEnterArea: ",t.id),M&&(console.log("  - OEA - Close lastArea: ",M.id),Fe(M),console.log("  - OEA - Wait for lastArea to be closed"),setTimeout(()=>{console.log("  - OEA - Wait timeout"),M=null},300)),console.log("  - OEA - Open currentArea: ",t.id),re(t)}async function re(t){console.log("Open Jitsi Modal: ",t.id),WA.ui.modal.openModal({title:`Konferenz ${t.label}`,src:`https://jitsi.camedia.tools/${t.id}`,allow:"camera; microphone; fullscreen; display-capture",allowApi:!0,position:"right"}),qe(t),M=t}async function Ne(t){const e=`connect-${t.id}`;await WA.ui.actionBar.addButton({id:e,label:`${t.label} beitreten`,callback:async n=>{console.log(`Connected to meeting: ${t}`,n),await re(t),WA.ui.actionBar.removeButton(e)}})}async function qe(t){const e=`disconnect-${t.id}`;WA.ui.actionBar.addButton({id:e,label:`${t.label} austreten`,callback:async n=>{console.log(`disconnected from meeting: ${t}`,n),WA.ui.modal.closeModal(),WA.ui.actionBar.removeButton(e),await Ne(t)}})}function Fe(t){console.log("closeModal: ",t.id),console.log("  - CM: Remove Buttons"),WA.ui.actionBar.removeButton(`disconnect-${t.id}`),WA.ui.actionBar.removeButton(`connect-${t.id}`),console.log("  - CM: Close"),WA.ui.modal.closeModal()}
//# sourceMappingURL=main-D56vns2R.js.map
