(function() {
  if (!JZZ) return;
  if (!JZZ.input) JZZ.input = {};

  var _version = '0.1';
  function _name(name) { return name ? name : 'ASCII'; }

  var _keycode = {
    ' ':32, 0:48, 1:49, 2:50, 3:51, 4:52, 5:53, 6:54, 7:55, 8:56, 9:57, '+':61, '=':61,
    A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77,
    N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90,
    _:173, '-':173, '[':219, '{':219, ']':221, '}':221, '|':220, '\\':220, '`':192, '~':192,
    ';':59, ':':59, "'":222, '"':222, ',':188, '<':188, '.':190, '>':190, '/':191, '?':191
  };

  function Keyboard(arg) {
    this.notes = {};
    this.playing = [];
    for (var k in arg) {
      var key = _keycode[k];
      var val = JZZ.MIDI.noteValue(arg[k]);
      if (key !== undefined && val !== undefined) this.notes[key] = val;
    }
    var self = this;
    this.keydown = function(e) {
      var midi = self.notes[e.keyCode];
      if (midi !== undefined && !self.playing[midi]) {
        self.playing[midi] = true;
        self.noteOn(midi);
      }
    };
    this.keyup = function(e) {
      var midi = self.notes[e.keyCode];
      if (midi !== undefined && self.playing[midi]) {
        self.playing[midi] = undefined;
        self.noteOff(midi);
      }
    };
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
    this._close = function() {
      document.removeEventListener('keydown', this.keydown);
      document.removeEventListener('keyup', this.keyup);
      for (var midi in self.playing) self.noteOff(midi);
    }
  }

  function Engine() {
  }

  Engine.prototype._info = function(name) {
    return {
      type: 'html/javascript',
      name: _name(name),
      manufacturer: 'virtual',
      version: _version
    };
  }

  Engine.prototype._openIn = function(port, name) {
    var keyboard = new Keyboard(this._arg);
    keyboard.noteOn = function(note) { port._event(JZZ.MIDI(0x90, note, 127)); };
    keyboard.noteOff = function(note) { port._event(JZZ.MIDI(0x80, note, 127)); };
    port._impl = keyboard;
    port._resume();
  }

  JZZ.input.ASCII = function() {
    var name, arg;
    if (arguments.length == 1) {
      if (typeof arguments[0] === 'string') name = arguments[0];
      else arg = arguments[0];
    }
    else { name = arguments[0]; arg = arguments[1];}
    var _engine = new Engine;
    _engine._arg = arg;
    return JZZ.lib.openMidiIn(name, _engine);
  }

  JZZ.input.ASCII.register = function() {
    var name, arg;
    if (arguments.length == 1) {
      if (typeof arguments[0] === 'string') name = arguments[0];
      else arg = arguments[0];
    }
    else { name = arguments[0]; arg = arguments[1];}
    var _engine = new Engine;
    _engine._arg = arg;
    return JZZ.lib.registerMidiIn(name, _engine);
  }

})();