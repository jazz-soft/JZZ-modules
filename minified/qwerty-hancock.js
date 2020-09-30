!function(){function a(e){return Math.floor((p.width-e)/e)}function n(e){var t=3===e.length?e.charAt(2):e.charAt(1);return e=(e=["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"].indexOf(e.slice(0,-1)))<3?e+12+12*(t-1)+1:e+12*(t-1)+1,440*Math.pow(2,(e-49)/12)}function r(e){null!==e&&(e.style.backgroundColor=p.activeColour)}function i(e){null!==e&&("white"===e.getAttribute("data-note-type")?e.style.backgroundColor=p.whiteKeyColour:e.style.backgroundColor=p.blackKeyColour)}function l(e){for(var t=0,o=e.length,n=[],r=0;r<o;r++)if(p.startNote.charAt(0)===e[r]){t=r;break}for(r=0;r<o;r++)n[r]=o-1<r+t?e[r+t-o]:e[r+t];return n}function t(e){var t,o;e.el.style.display="inline-block",e.el.style["-webkit-user-select"]="none","white"===e.colour?((o=e).el.style.backgroundColor=p.whiteKeyColour,o.el.style.border="1px solid "+p.borderColour,o.el.style.borderRight=0,o.el.style.height=p.height+"px",o.el.style.width=o.width+"px",o.el.style.borderRadius="0 0 5px 5px",o.noteNumber===C()-1&&(o.el.style.border="1px solid "+p.borderColour)):(t=e,o=a(C()),e=Math.floor(o/2),t.el.style.backgroundColor=p.blackKeyColour,t.el.style.border="1px solid "+p.borderColour,t.el.style.position="absolute",t.el.style.left=Math.floor((o+1)*(t.noteNumber+1)-e/2)+"px",t.el.style.width=e+"px",t.el.style.height=p.height/1.5+"px",t.el.style.borderRadius="0 0 3px 3px")}function s(e){function t(e){e.style.cursor="default",e.style.fontSize="0px",e.style.height=p.height+"px",e.style.padding=0,e.style.position="relative",e.style.listStyle="none",e.style.margin=0,e.style.width=p.width+"px",e.style["-webkit-user-select"]="none"}t(e.container),t(e.el)}function u(e,t){"li"==e.tagName.toLowerCase()&&(g=!0,r(e),t(e.title,n(e.title)))}function d(e,t){"li"==e.tagName.toLowerCase()&&(g=!1,i(e),t(e.title,n(e.title)))}function c(e,t){g&&(i(e),t(e.title,n(e.title)))}function h(e){return e.el=document.createElement("li"),e.el.id=e.id,e.el.title=e.id,e.el.setAttribute("data-note-type",e.colour),t(e),e}function y(e){return w[e].replace("l",parseInt(p.startOctave,10)+p.keyPressOffset).replace("u",(parseInt(p.startOctave,10)+p.keyPressOffset+1).toString())}function e(e){this.version="0.5.1",this.keyDown=function(){},this.keyUp=function(){},function(e){user_settings=e||{},p={id:user_settings.id||"keyboard",octaves:user_settings.octaves||3,width:user_settings.width,height:user_settings.height,startNote:user_settings.startNote||"A3",whiteKeyColour:user_settings.whiteKeyColour||"#fff",blackKeyColour:user_settings.blackKeyColour||"#000",activeColour:user_settings.activeColour||"yellow",borderColour:user_settings.borderColour||"#000",keyboardLayout:user_settings.keyboardLayout||"en"},e=document.getElementById(p.id),void 0===p.width&&(p.width=e.offsetWidth),void 0===p.height&&(p.height=e.offsetHeight),p.startOctave=parseInt(p.startNote.charAt(1),10),v(),b.call(this,e)}.call(this,e)}var o=this,f="undefined"==typeof global?o:o.window,p={},g=!1,k={},w={65:"Cl",87:"C#l",83:"Dl",69:"D#l",68:"El",70:"Fl",84:"F#l",71:"Gl",89:"G#l",90:"G#l",72:"Al",85:"A#l",74:"Bl",75:"Cu",79:"C#u",76:"Du",80:"D#u",59:"Eu",186:"Eu",222:"Fu",221:"F#u",220:"Gu"},C=function(){return 7*p.octaves},v=function(){var e,t,o={container:document.getElementById(p.id),el:document.createElement("ul"),whiteNotes:l(["C","D","E","F","G","A","B"]),notesWithSharps:l(["C","D","F","G","A"])};return o.keys=function(){for(var o,n=this,r=[],i=0,l=p.startOctave,s=C(),u=0;u<s;u++)u%this.whiteNotes.length==0&&(i=0),bizarre_note_counter=this.whiteNotes[i],"C"===bizarre_note_counter&&0!==u&&l++,o=h({colour:"white",octave:l,width:a(s),id:this.whiteNotes[i]+l,noteNumber:u}),r.push(o.el),u!==s-1&&this.notesWithSharps.forEach(function(e,t){e===n.whiteNotes[i]&&(o=h({colour:"black",octave:l,width:a(s)/2,id:n.whiteNotes[i]+"#"+l,noteNumber:u}),r.push(o.el))}),i++;return r}.call(o),e=o.whiteNotes,p.keyPressOffset="C"===e[0]?0:1,s(o),(t=o).keys.forEach(function(e){t.el.appendChild(e)}),o.container.appendChild(o.el),o},b=function(e){var o=this;f.addEventListener("keydown",function(e){var t;t=e,e=o.keyDown,t.keyCode in k||(k[t.keyCode]=!0,void 0!==w[t.keyCode]&&(e(t=y(t.keyCode),n(t)),r(document.getElementById(t))))}),f.addEventListener("keyup",function(e){var t;t=e,e=o.keyUp,delete k[t.keyCode],void 0!==w[t.keyCode]&&(e(t=y(t.keyCode),n(t)),i(document.getElementById(t)))}),e.addEventListener("mousedown",function(e){u(e.target,o.keyDown)}),e.addEventListener("mouseup",function(e){d(e.target,o.keyUp)}),e.addEventListener("mouseover",function(e){var t;t=e.target,e=o.keyDown,g&&(r(t),e(t.title,n(t.title)))}),e.addEventListener("mouseout",function(e){c(e.target,o.keyUp)}),"ontouchstart"in document.documentElement&&(e.addEventListener("touchstart",function(e){u(e.target,o.keyDown)}),e.addEventListener("touchend",function(e){d(e.target,o.keyUp)}),e.addEventListener("touchleave",function(e){c(e.target,o.keyUp)}),e.addEventListener("touchcancel",function(e){c(e.target,o.keyUp)}))};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=e),exports.QwertyHancock=e):o.QwertyHancock=e}();