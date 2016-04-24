(function() {
  if (!JZZ) return;
  if (!JZZ.synth) JZZ.synth = {};

  function _name(name) { return name ? name : 'JZZ.synth.Timbre'; }
  function _loaded() { return typeof T !== 'undefined' && T.version;}

  var _synth = {};
  var _engine = {};
  var _version = _loaded() ? T.version : undefined;

  function Synth(name, synth) {
    this._T = synth;
    this.info = _engine._info(name);
    this.name = this.info.name;
    this._receive = _receive;
  }

  function _receive(msg) {
    var s = msg[0];
    var n = msg[1];
    var v = msg[2];
    if (s<0 || s>255) return;
    s = s>>4;
    if (s == 9) {
      if (v) this._T.noteOn(n, v);
      else this._T.noteOff(n);
    }
    else if (s == 8) this._T.noteOff(n);
    else if (s == 11) {
      if (n == 123) this._T.allNoteOff();
      else if (n == 120) this._T.allSoundOff();
    }
  }

  _engine._info = function(name) {
    return {
      type: 'Timbre.js',
      name: _name(name),
      manufacturer: 'virtual',
      version: _version
    };
  }

  _engine._openOut = function(port, name) {
    if (!_loaded()) { port._crash('Timbre.js is not loaded'); return;}
    if (!_synth[name]) { port._crash('Port ' + name + ' not found'); return;}
    if (!_valid(_synth[name]._T)) { port._crash('Not a valid synth'); return;}
    if (!_synth[name]) _synth[name] = new Synth;
    port._info = _engine._info(name);
    port._receive = function(msg) { _synth[name]._receive(msg); }
    port._resume();
  }

  function _valid(synth) {
    return synth && synth.noteOn instanceof Function && synth.noteOff instanceof Function;
  }

  JZZ.synth.Timbre = function() {
    var name, synth;
    if (arguments.length == 1) synth = arguments[0];
    else { name = arguments[0]; synth = arguments[1];}
    name = _name(name);
    if (!_synth[name]) _synth[name] = new Synth(name, synth);
    return JZZ.lib.openMidiOut(name, _engine);
  }

  JZZ.synth.Timbre.register = function() {
    var name, synth;
    if (arguments.length == 1) synth = arguments[0];
    else { name = arguments[0]; synth = arguments[1];}
    name = _name(name);
    if (!_loaded() || !_valid(synth)) return false;
    if (!_synth[name]) _synth[name] = new Synth(name, synth);
    return JZZ.lib.registerMidiOut(name, _engine);
  }

})();