(function() {
  if (!JZZ) return;
  if (!JZZ.synth) JZZ.synth = {};

  var _waiting = false;
  var _running = false;
  var _err;

  function _send(a) {
    var s = a[0]>>4;
    var c = a[0]&0xf;
    if (s == 0x8) {
      MIDI.noteOff(c, a[1]);
    }
    else if (s == 0x9) {
      MIDI.noteOn(c, a[1], a[2]);
    }
  }

  var _ports = [];
  function _release(port, name) {
    port._impl = {
      name: name,
      info: _engine._info(name),
      _send: _send
    };
    port._resume();
  }

  function _onsuccess() {
    _running = true;
    _waiting = false;
    for (var i=0; i<_ports.length; i++) _release(_ports[i][0], _ports[i][1]);
  }

  function _onerror(evt) {
    for (var i=0; i<_ports.length; i++) _ports[i][0]._crash(evt);
  }

  var _engine = {};

  _engine._info = function(name) {
    if (!name) name = 'MIDI.js';
    return {
      type: 'MIDI.js',
      name: name,
      manufacturer: '',
      version: '0.0'
    };
  }

  _engine._openOut = function(port, name) {
    if (_running) {
      _release(port, name);
      return;
    }
    port._pause();
    _ports.push([port, name]);
    if (_waiting) return;
    _waiting = true;
    var arg = _engine._arg;
    if (!arg) arg = {};
    arg.onsuccess = _onsuccess;
    arg.onerror = _onerror;
    try {
      MIDI.loadPlugin(arg);
    }
    catch(e) {
      _err = e.message;
      _onerror(_err);
    }
  }

  JZZ.synth.MIDIjs = function(name, arg) {
    if (!_running && !_waiting) _engine._arg = arg;
    return JZZ._openMidiOut(name, _engine);
  }

  JZZ.synth.MIDIjs.register = function(name, arg) {
    if (!_running && !_waiting) _engine._arg = arg;
    return JZZ._registerMidiOut(name, _engine);
  }

})();