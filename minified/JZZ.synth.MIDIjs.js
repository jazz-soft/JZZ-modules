!function(){var e,i,u,o,s,f;function t(n){return n||"JZZ.synth.MIDIjs"}function a(n){var r=n[0]>>4,t=15&n[0];8==r?MIDI.noteOff(t,n[1]):9==r&&MIDI.noteOn(t,n[1],n[2])}function c(n,r){n._info=f._info(r),n._receive=a,n._resume()}function Z(){e=!(i=!0);for(var n=0;n<s.length;n++)c(s[n][0],s[n][1])}function I(n){u=!0,o=n;for(var r=0;r<s.length;r++)s[r][0]._crash(o)}JZZ&&(JZZ.synth||(JZZ.synth={}),u=i=e=!1,s=[],f={_info:function(n){return{type:"MIDI.js",name:t(n),manufacturer:"virtual",version:"0.3.2"}},_openOut:function(n,r){if(i)c(n,r);else if(u)n._crash(o);else if(n._pause(),s.push([n,r]),!e){e=!0;var t=f._arg;(t=t||{}).onsuccess=Z,t.onerror=I;try{MIDI.loadPlugin(t)}catch(n){I(o=n.message)}}}},JZZ.synth.MIDIjs=function(){var n=1==arguments.length?arguments[0]:(r=arguments[0],arguments[1]),r=t(r);return i||e||(f._arg=n),JZZ.lib.openMidiOut(r,f)},JZZ.synth.MIDIjs.register=function(){var n=1==arguments.length?arguments[0]:(r=arguments[0],arguments[1]),r=t(r);return i||e||(f._arg=n),JZZ.lib.registerMidiOut(r,f)})}();