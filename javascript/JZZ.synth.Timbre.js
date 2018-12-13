(function() {
  if (!JZZ) return;
  if (!JZZ.synth) JZZ.synth = {};

  function _name(name) { return name ? name : 'JZZ.synth.Timbre'; }
  function _loaded() { return typeof T != 'undefined' && T.version; }

  var _synth = {};
  var _noname = [];
  var _engine = {};
  var _version = _loaded() ? T.version : undefined;

  function Synth(timbre) {
    this._T = timbre;
  }

  Synth.prototype._receive = function(msg) {
    var s = msg[0];
    var n = msg[1];
    var v = msg[2];
    if (s < 0 || s > 255) return;
    s = s >> 4;
    if (s == 9) {
      if (v) this._T.noteOn(n, v);
      else this._T.noteOff(n);
    }
    else if (s == 8) this._T.noteOff(n);
    else if (s == 11) {
      if (n == 123) this._T.allNoteOff();
      else if (n == 120) this._T.allSoundOff();
    }
  };

  function Engine(timbre) {
    this.timbre = timbre;
  }

  Engine.prototype._info = function(name) {
    if (!name) name = 'JZZ.synth.Timbre';
    return {
      type: 'Timbre.js',
      name: name,
      manufacturer: 'virtual',
      version: _version
    };
  };

  Engine.prototype._openOut = function(port, name) {
    if (!_loaded()) { port._crash('Timbre.js is not loaded'); return; }
    if (!_valid(this.timbre)) { port._crash('Not a valid synth'); return; }
    var synth;
    if (typeof name !== 'undefined') {
      name = '' + name;
      if (!_synth[name]) _synth[name] = new Synth(this.timbre);
      synth = _synth[name];
    }
    else {
      synth = new Synth(this.timbre);
      _noname.push(synth);
    }
    port._info = this._info(name);
    port._receive = function(msg) { synth._receive(msg); }
    port._resume();
  };

  function _valid(synth) {
    return synth && synth.noteOn instanceof Function && synth.noteOff instanceof Function;
  }

  JZZ.synth.Timbre = function() {
    var name, timbre;
    if (arguments.length == 1) timbre = arguments[0];
    else { name = arguments[0]; timbre = arguments[1]; }
    return JZZ.lib.openMidiOut(name, new Engine(timbre));
  };

  JZZ.synth.Timbre.register = function() {
    var name, timbre;
    if (arguments.length == 1) timbre = arguments[0];
    else { name = arguments[0]; timbre = arguments[1]; }
    name = _name(name);
    if (!_loaded() || !_valid(timbre)) return false;
    return JZZ.lib.registerMidiOut(name, new Engine(timbre));
  };

})();
