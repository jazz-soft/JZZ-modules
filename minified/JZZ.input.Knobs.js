!function(){function a(a,b){return a?a:b}function b(a){var b={};for(var c in a)b[c]=a[c];return b}function c(a){return void 0===a.buttons?!a.button:1&a.buttons}function d(a){return void 0===a.buttons?!a.button:!(1&a.buttons)}function e(){return!1}function f(a,b){for(var c in b)a.style[c]=b[c]}function g(a){if(this.base=.5,this.val=.5,this["int"]=8192,this.msb=0,this.lsb=0,this.chan=0,a instanceof Array){if(1!=a.length&&2!=a.length)return;if(2==a.length){if(a[1]!=parseInt(a[1])||a[1]<1||a[1]>127)return;this.msb=a[0],a[1]!=a[0]&&(this.lsb=a[1])}else this.msb=a[0]}else if(a==parseInt(a)){if(1>a||a>127)return;this.msb=a}else{var b={mod:[1,33],breath:[2,34],foot:[4,36],portamento:[5,37],volume:[7,39],balance:[8,40],pan:[10,42],expression:[11,43],effect1:[12,44],effect2:[13,45]}[a];b&&(this.msb=b[0],this.lsb=b[1])}this.msb&&7!=this.msb&&8!=this.msb&&10!=this.msb&&(this.base=0),this.val=-1,this.setValue(this.base)}function h(a,b,c,d,e,f){this.ctrl=a,this.span=b,this.inner=c,this.stl=d,this.stl0=e,this.stl1=f}function i(){}function j(a,c){this.bins=[],this.params={0:{}},void 0===a&&(a={}),void 0===c&&(c={}),this.chan=u[a.chan],void 0===this.chan&&(this.chan=0);var d;for(d in a)if(d==parseInt(d))this.params[d]=b(a[d]);else{if("chan"==d)continue;c[d]=a[d]}for(d in this.params){this.bins.push(d);for(var e in c)"from"!=e&&"to"!=e||void 0!==_keyNum(this.params[d][e])||(this.params[d][e]=c[e]),e in this.params[d]||(this.params[d][e]=c[e])}this.bins.sort(function(a,b){return a-b})}function k(a){return function(b){c(b)&&a.onMouseDown(b)}}function l(a){return function(b){a.onMouseMove(b)}}function m(a){return function(b){d(b)&&(window.removeEventListener("mousemove",a.mouseMove),window.removeEventListener("mouseup",a.mouseUp),a.dragX=void 0,a.restyle(),a.onMouseUp(b))}}function n(a){return function(b){a.onTouchStart(b)}}function o(a){return function(b){a.onTouchMove(b)}}function p(a){return function(b){a.onTouchEnd(b)}}function q(a){a.preventDefault()}function r(a){j.call(this,a,{pos:"N",rw:2,rh:128,kw:24,kh:16})}function s(){}if(JZZ){JZZ.input||(JZZ.input={});for(var t="0.2",u={a:10,b:11,c:12,d:13,e:14,f:15,A:10,B:11,C:12,D:13,E:14,F:15},v=0;16>v;v++)u[v]=v;g.prototype.setBase=function(a){a=parseFloat(a),!isNaN(a)&&isFinite(a)&&a>=0&&1>=a&&(this.base=a)},g.prototype.setValue=function(a){return a=parseFloat(a),isNaN(a)||!isFinite(a)||0>a||a>1||a==this.val?void 0:(this.val=a,this.num=Math.round(a*(this.lsb||!this.msb?16383:127)),!0)},g.prototype.emit=function(a){this.msb?this.lsb?(a.emit([176+this.chan,this.msb,this.num>>7]),a.emit([176+this.chan,this.lsb,127&this.num])):a.emit([176+this.chan,this.msb,this.num]):a.emit([224+this.chan,127&this.num,this.num>>7])},g.prototype.read=function(a){if(!this.msb&&a[0]==224+this.chan&&a[1]==parseInt(a[1])&&a[2]==parseInt(a[2]))return this.num=a[2]<<7|127&a[1],this.val=this.num/16383,!0;if(this.msb&&a[0]==176+this.chan&&a[2]==parseInt(a[2])){if(a[1]==this.msb)return this.lsb?(this.num=a[2]<<7|127&this.num,this.val=this.num/16383):(this.num=127&a[2],this.val=this.num/127),!0;if(a[1]==this.lsb)return this.num=16256&this.num|127&a[2],this.val=this.num/16383,!0;out.emit([176+this.chan,this.msb,this.num>>7]),out.emit([176+this.chan,this.lsb,127&this.num])}},h.prototype.setInnerHTML=function(a){return this.inner&&(this.inner.innerHTML=a),this},h.prototype.setStyle=function(a,b){void 0===b&&(b=a);for(var c in a)this.stl0[c]=a[c];for(var c in b)this.stl1[c]=b[c];return f(this.span,this.ctrl.isSelected()?this.stl1:this.stl0),f(this.span,this.stl),this},i.prototype._close=function(){this.parent&&(this.parent.innerHTML=""),this.mouseUpHandler&&window.removeEventListener("mouseup",this.mouseUpHandler)},i.prototype.create=function(){for(var a=0,b=0;b<this.bins.length&&this.bins[b]<=window.innerWidth;b++)a=this.bins[b];this.current=this.params[a],this.createCurrent()},i.prototype.createCurrent=function(){this.parent&&(this.parent.innerHTML=""),"string"==typeof this.current.parent&&(this.current.parent=document.getElementById(this.current.parent));try{this.createAt(this.current.parent)}catch(a){this.bottom||(this.bottom=document.createElement("div"),document.body.appendChild(this.bottom)),this.createAt(this.bottom)}},i.prototype.onResize=function(){for(var a=0,b=0;b<this.bins.length&&this.bins[b]<=window.innerWidth;b++)a=this.bins[b];this.current!=this.params[a]&&(this.current=this.params[a],this.createCurrent())},i.prototype.isSelected=function(){return void 0!==this.dragX},i.prototype.restyle=function(){for(var a in this.spans)this.spans[a].setStyle()},i.prototype.onMouseDown=function(a){void 0===this.dragX&&(this.dragX=a.clientX,this.dragY=a.clientY,this.mouseMove=l(this),this.mouseUp=m(this),window.addEventListener("mousemove",this.mouseMove),window.addEventListener("mouseup",this.mouseUp),this.restyle())},i.prototype.onMouseMove=function(a){void 0!==this.dragX&&this.onMove(a.clientX,a.clientY)},i.prototype.onMouseUp=function(a){},i.prototype.onTouchStart=function(a){a.preventDefault(),void 0===this.dragX&&(this.touch=a.targetTouches[0].identifier,this.dragX=a.targetTouches[0].clientX,this.dragY=a.targetTouches[0].clientY,this.restyle())},i.prototype.onTouchMove=function(a){if(a.preventDefault(),void 0!==this.dragX&&void 0!==this.touch)for(var b in a.targetTouches)if(a.targetTouches[0].identifier==this.touch)return void this.onMove(a.targetTouches[b].clientX,a.targetTouches[b].clientY)},i.prototype.onTouchEnd=function(a){a.preventDefault(),this.touch=void 0,this.dragX=void 0,this.restyle(),this.onMouseUp(a)},r.prototype=new i,r.prototype.createAt=function(a){a.innerHTML="";var b=parseInt(this.current.bh),c=parseInt(this.current.bw),d=parseInt(this.current.rh);d||(d=128),this.rh=d;var i=parseInt(this.current.rw);i||(i=2);var j=parseInt(this.current.kh);j||(j=24);var l=parseInt(this.current.kw);l||(l=16);var m=this.current.pos.toUpperCase();this.pos=m,this.data||(this.data=new g(this.current.data),this.data.chan=this.chan,this.data.setBase(this.current.base),this.data.setValue(this.current.val)),this.dx=-(l/2),this.dy=-(j/2+1),b||(b=j+d),c||(c=l>i?l:i),this.stlB={display:"inline-block",position:"relative",margin:"0",padding:"0",userSelect:"none",KhtmlUserSelect:"none",MozUserSelect:"none",MsUserSelect:"none",OUserSelect:"none",WebkitUserSelect:"none"},this.stlB0={borderStyle:"none"},this.stlB1={borderStyle:"none"},this.stlR={display:"inline-block",position:"absolute",margin:"0",padding:"0",borderStyle:"solid",borderWidth:"1px"},this.stlR0={backgroundColor:"#aaa"},this.stlR1={backgroundColor:"#bbb"},this.stlK={display:"inline-block",position:"absolute",margin:"0",padding:"0",borderStyle:"solid",borderWidth:"1px"},this.stlK0={backgroundColor:"#ddd"},this.stlK1={backgroundColor:"#eee"},"E"==m||"W"==m?(this.stlB.width=b+"px",this.stlB.height=c+"px",this.stlR.width=d+"px",this.stlR.height=i+"px",this.stlR.left=(b-d)/2-1+"px",this.stlR.top=(c-i)/2-1+"px",this.stlK.width=j+"px",this.stlK.height=l+"px",this.stlK.top=this.dx+"px"):(this.stlB.width=c+"px",this.stlB.height=b+"px",this.stlR.width=i+"px",this.stlR.height=d+"px",this.stlR.top=(b-d)/2-1+"px",this.stlR.left=(c-i)/2-1+"px",this.stlK.width=l+"px",this.stlK.height=j+"px",this.stlK.left=this.dx+"px");var r=document.createElement("span");this.box=r,this.boxSpan=new h(this,r,0,this.stlB,this.stlB0,this.stlB1);var s=document.createElement("span");this.range=s,this.rangeSpan=new h(this,s,0,this.stlR,this.stlR0,this.stlR1);var t=document.createElement("span");this.knob=t,this.knobSpan=new h(this,t,t,this.stlK,this.stlK0,this.stlK1),this.spans=[this.boxSpan,this.rangeSpan,this.knobSpan];var u=void 0===this.current.active||this.current.active;if(u&&(r.addEventListener("touchstart",q),t.addEventListener("mousedown",k(this)),t.addEventListener("touchstart",n(this)),t.addEventListener("touchmove",o(this)),t.addEventListener("touchend",p(this))),this.setValue(this.value),this.current.onCreate&&this.current.onCreate.apply(this),s.appendChild(t),r.appendChild(s),r.ondragstart=e,r.onselectstart=e,a.appendChild(r),!this.parent&&this.bins.length>1){var v=this;this.resize=function(){v.onResize()},window.addEventListener("resize",this.resize)}this.current.parent=a,this.parent=a,this.setValue(),f(this.box,void 0===this.dragX?this.stlB0:this.stlB1),f(this.box,this.stlB),f(this.range,void 0===this.dragX?this.stlR0:this.stlR1),f(this.range,this.stlR),f(this.knob,void 0===this.dragX?this.stlK0:this.stlK1),f(this.knob,this.stlK)},r.prototype.getBox=function(){return this.boxSpan},r.prototype.getRange=function(){return this.rangeSpan},r.prototype.getKnob=function(){return this.knobSpan},r.prototype.setValue=function(a){if(void 0===a)a=this.data.val;else if(!this.data.setValue(a))return;a=this.data.val,"N"!=this.pos&&"W"!=this.pos||(a=1-a),a*=this.rh,this.coord=a,a+=this.dy,"N"==this.pos||"S"==this.pos?(this.stlK.top=a+"px",this.knob.style.top=a+"px"):(this.stlK.left=a+"px",this.knob.style.left=a+"px")},r.prototype.onMove=function(a,b){var c;c="N"==this.pos||"S"==this.pos?this.coord+b-this.dragY:this.coord+a-this.dragX,0>c&&(c=0),c>this.rh&&(c=this.rh),this.move(c)},r.prototype.move=function(a){if(this.coord!=a){"N"==this.pos||"S"==this.pos?(this.knob.style.top=a+this.dy+"px",this.stlK.top=this.knob.style.top,this.dragY+=a-this.coord):(this.knob.style.left=a+this.dy+"px",this.stlK.left=this.knob.style.left,this.dragX+=a-this.coord);var b=a/this.rh;"N"!=this.pos&&"W"!=this.pos||(b=1-b),this.data.setValue(b)&&this.data.emit(this),this.coord=a}},r.prototype.forward=function(a){this.emit(a),this.data.read(a)&&this.setValue()},s.prototype._info=function(b){return{type:"html/javascript",name:a(b,"Slider"),manufacturer:"virtual",version:t}},s.prototype._openIn=function(a,b){var c=new r(this._arg);c.create(),c.emit=function(b){a._emit(b)},a._info=this._info(b),a._receive=function(a){c.forward(a)},a._close=function(){c._close()},a.getBox=function(){return c.boxSpan},a.getRange=function(){return c.rangeSpan},a.getKnob=function(){return c.knobSpan},a.setValue=function(a){c.setValue(a)},a._resume()},JZZ.input.Slider=function(){var a,b;1==arguments.length?"string"==typeof arguments[0]?a=arguments[0]:b=arguments[0]:(a=arguments[0],b=arguments[1]);var c=new s;return c._arg=b,JZZ.lib.openMidiIn(a,c)},JZZ.input.Slider.register=function(){var a,b;1==arguments.length?"string"==typeof arguments[0]?a=arguments[0]:b=arguments[0]:(a=arguments[0],b=arguments[1]);var c=new s;return c._arg=b,JZZ.lib.registerMidiIn(a,c)}}}();