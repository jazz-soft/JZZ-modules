!function(){if(JZZ){JZZ.synth||(JZZ.synth={});var e={},r=[],t=o()?T.version:void 0;s.prototype._receive=function(n){var t=n[0],i=n[1],e=n[2];t<0||255<t||(9==(t>>=4)?e?this._T.noteOn(i,e):this._T.noteOff(i):8==t?this._T.noteOff(i):11==t&&(123==i?this._T.allNoteOff():120==i&&this._T.allSoundOff()))},i.prototype._info=function(n){return n||(n="JZZ.synth.Timbre"),{type:"Timbre.js",name:n,manufacturer:"virtual",version:t}},i.prototype._openOut=function(n,t){var i;o()?f(this.timbre)?(void 0!==t?(e[t=""+t]||(e[t]=new s(this.timbre)),i=e[t]):(i=new s(this.timbre),r.push(i)),n._info=this._info(t),n._receive=function(n){i._receive(n)},n._resume()):n._crash("Not a valid synth"):n._crash("Timbre.js is not loaded")},JZZ.synth.Timbre=function(){var n,t;return t=1==arguments.length?arguments[0]:(n=arguments[0],arguments[1]),JZZ.lib.openMidiOut(n,new i(t))},JZZ.synth.Timbre.register=function(){var n,t;return t=1==arguments.length?arguments[0]:(n=arguments[0],arguments[1]),n=n||"JZZ.synth.Timbre",!(!o()||!f(t))&&JZZ.lib.registerMidiOut(n,new i(t))}}function o(){return"undefined"!=typeof T&&T.version}function s(n){this._T=n}function i(n){this.timbre=n}function f(n){return n&&n.noteOn instanceof Function&&n.noteOff instanceof Function}}();