(function() {
  if (!JZZ) return;
  if (!JZZ.input) JZZ.input = {};

  var _version = '0.1';
  function _name(name) { return name ? name : 'Kbd'; }

  function _copy(obj) {
    var ret = {};
    for(var k in obj) ret[k] = obj[k];
    return ret;
  }
  function _style(key, stl) {
    for(var k in stl) key.style[k] = stl[k];
  }
  function _keyNum(name) {
    if (!(typeof name == 'string')) return undefined;
    var base = {C:0, D:1, E:2, F:3, G:4, A:5, B:6}[name.substr(0, 1).toUpperCase()];
    if (base === undefined) return undefined;
    var oct = name.substr(1);
    if (parseInt(oct) != oct) return undefined;
    var num = 7 * oct + base;
    return num >= 0 && num <=74 ? num : undefined;
  }
  function _keyMidi(n) {
    return Math.floor(n / 7) * 12 + {0:0, 1:2, 2:4, 3:5, 4:7, 5:9, 6:11}[n % 7];
  }
  function _handleMouseDown(piano, midi) {
    return function(e) {
      if (!(e.buttons & 1) || piano.playing[midi]) return;
      piano.mouseDown = true;
      piano.playing[midi] = 'M';
      piano.press(midi);
    };
  }
  function _handleMouseEnter(piano, midi) {
    return function(e) {
      if (!piano.mouseDown || piano.playing[midi]) return;
      piano.playing[midi] = 'M';
      piano.press(midi);
    };
  }
  function _handleMouseLeave(piano, midi) {
    return function(e) {
      if (!piano.mouseDown || piano.playing[midi] != 'M') return;
      piano.playing[midi] = undefined;
      piano.release(midi);
    };
  }
  function _handleMouseUp(piano, midi) {
    return function(e) {
      if (e.buttons & 1 || !piano.mouseDown) return;
      if (piano.playing[midi] != 'M') return;
      piano.playing[midi] = undefined;
      piano.release(midi);
    };
  }
  function _handleMouseOff(piano) {
    return function(e) {
      if (e.buttons & 1) return;
      piano.mouseDown = false;
    };
  }
  function _handleTouch(piano) {
    return function(e) {
      e.preventDefault();
      var t = {};
      for (var i in e.touches) piano.findKey(e.touches[i].clientX, e.touches[i].clientY, t);
      var tt = {};
      for (var midi in t) {
        if (midi in piano.touches) tt[midi] = true;
        else if (piano.playing[midi] === undefined) {
          piano.playing[midi] = 'T';
          piano.press(midi);
          tt[midi] = true;
        }
      }
      for (var midi in piano.touches) {
        if (!(midi in t)) {
          piano.playing[midi] = undefined;
          piano.release(midi);
        }
      }
      piano.touches = tt;
    };
  }

  function Piano(arg) {
    this.bins = [];
    this.params = {0:{}};
    var common = {from:'C4', to:'E6', ww:42, bw:24, wl:150, bl:100, pos:'N'};
    if (arg === undefined) arg = {};
    var key;
    for (key in arg) {
      if (key == parseInt(key)) this.params[key] = _copy(arg[key]);
      else {
        if ((key == 'from' || key == 'to') && _keyNum(arg[key]) === undefined) continue;
        common[key] = arg[key];
      }
    }
    for (key in this.params) {
      this.bins.push(key);
      for (var k in common) {
        if ((k == 'from' || k == 'to') && _keyNum(this.params[key][k]) === undefined) this.params[key][k] = common[k];
        if (!(k in this.params[key])) this.params[key][k] = common[k];
      }
      var from = this.params[key]['from'];
      var to = this.params[key]['to'];
      if (_keyNum(from) > _keyNum(to)) {
        this.params[key]['from'] = to;
        this.params[key]['to'] = from;
      }
    }
    this.bins.sort(function(a, b){return a-b});
  }
  Piano.prototype.press = function(midi) {
    _style(this.keys[midi], this.stl1[midi]);
    _style(this.keys[midi], this.locs[midi]);
    this.noteOn(midi);
  }
  Piano.prototype.release = function(midi) {
    _style(this.keys[midi], this.stl0[midi]);
    _style(this.keys[midi], this.locs[midi]);
    this.noteOff(midi);
  }
  Piano.prototype.findKey = function(x, y, ret) {
    var found;
    for (var midi in this.keys) {
      var r = this.keys[midi].getBoundingClientRect();
      if (x > r.left && x < r.right && y > r.top && y < r.bottom) {
        found = midi;
        var k = midi % 12;
        if (k == 1 || k == 3 || k == 6 || k == 8 || k == 10) break;
      }
    }
    if (found !== undefined) ret[found] = true;
  }
  Piano.prototype.create = function() {
    var bin = 0;
    for (var i = 0; i < this.bins.length; i++) {
      if (this.bins[i] <= window.innerWidth) bin = this.bins[i];
      else break;
    }
    this.current = this.params[bin];
    this.createCurrent();
  }
  Piano.prototype.createCurrent = function() {
    if (this.parent) this.parent.innerHTML = '';
    if (typeof this.current.parent === 'string') this.current.parent = document.getElementById(this.current.parent);
    try { this.createAt(this.current.parent); }
    catch(e) {
      if (!this.bottom) {
        this.bottom = document.createElement('div'); 
        document.body.appendChild(this.bottom);
      }
      this.createAt(this.bottom);
    }
  }
  Piano.prototype.createAt = function(parent) {
    parent.innerHTML = '';
    this.keys = {}; this.locs = {};
    this.stl0 = {}; this.stl1 = {};
    this.playing = {}; this.touches = {};
    var pos = this.current.pos.toUpperCase();
    var first = _keyNum(this.current.from);
    var last = _keyNum(this.current.to);
    var num = last - first + 1;
    var w = num * this.current.ww + 1;
    var h = this.current.wl + 1;
    var ww = this.current.ww - 1;
    var wl = this.current.wl - 1;
    var bw = this.current.bw - 1;
    var bl = this.current.bl - 1;
    var l2r = (pos != 'N') ^ !this.current.rev;
    var t2b = (pos != 'E') ^ !this.current.rev;
    var midi;
    var key;
    var stl;
    
    var piano = document.createElement('span');
    piano.style.display = 'inline-block';
    piano.style.position = 'relative';
    piano.style.margin = '0px';
    piano.style.padding = '0px';
    piano.style.borderStyle = 'none';
    if (pos == 'E' || pos == 'W') {
      piano.style.width = h + 'px';
      piano.style.height = w + 'px';
    }
    else {
      piano.style.width = w + 'px';
      piano.style.height = h + 'px';
    }
    for (var i = 0; i < num; i++) {
      midi = _keyMidi(i + first);
      key = document.createElement('span'); this.keys[midi] = key;
      stl = { display:'inline-block', position:'absolute', margin:'0px', padding:'0px', borderStyle:'solid', borderWidth:'1px' };
      this.locs[midi] = stl;
      if (pos == 'E' || pos == 'W') {
        stl.width = wl + 'px';
        stl.height = ww + 'px';
        stl.left = '0px';
        stl[t2b ? 'top' : 'bottom'] = (this.current.ww * i) + 'px';
      }
      else {
        stl.width = ww + 'px';
        stl.height = wl + 'px';
        stl.top = '0px';
        stl[l2r ? 'left' : 'right'] = (this.current.ww * i) + 'px';
        stl.verticalAlign = 'top';
      }
      this.stl0[midi] = { backgroundColor:'#fff', borderColor:'#000' };
      this.stl1[midi] = { backgroundColor:'#aaa', borderColor:'#000' };
      _style(key, this.stl0[midi]);
      _style(key, stl);
      piano.appendChild(key);
    }
    var hole = Math.ceil(this.current.ww - this.current.bw * 3 / 4);
    if ((hole + this.current.ww) % 2) hole--; // both even or both odd
    var from = _keyMidi(first) + 1;
    var to = _keyMidi(last);
    for (midi = from; midi < to; midi++) {
      var note = midi % 12;
      var oct = Math.floor(midi / 12);
      var shift;
      if (note == 1) {      // C#
        shift = Math.floor(this.current.ww * (oct * 7 + 1.5 - first)) - hole / 2 - this.current.bw;
      }
      else if (note == 3) { // D#
        shift = Math.floor(this.current.ww * (oct * 7 + 1.5 - first) + hole / 2);
      }
      else if (note == 6) { // F#
        shift = this.current.ww * (oct * 7 + 5 - first) - Math.floor(this.current.bw / 2) - hole - this.current.bw;
      }
      else if (note == 8) { // G#
        shift = this.current.ww * (oct * 7 + 5 - first) - Math.floor(this.current.bw / 2);
      }
      else if (note == 10) {// Bb
        shift = this.current.ww * (oct * 7 + 5 - first) - Math.floor(this.current.bw / 2) + hole + this.current.bw;
      }
      else continue;
      key = document.createElement('span'); this.keys[midi] = key;
      stl = { display:'inline-block', position:'absolute', margin:'0px', padding:'0px', borderStyle:'solid', borderWidth:'1px' };
      this.locs[midi] = stl;
      if (pos == 'E' || pos == 'W') {
        stl.width = bl + 'px';
        stl.height = bw + 'px';
        stl[pos == 'E' ? 'right' : 'left'] = '0px';
        stl[t2b ? 'top' : 'bottom'] = shift + 'px';
      }
      else {
        stl.width = bw + 'px';
        stl.height = bl + 'px';
        stl[pos == 'N' ? 'top' : 'bottom'] = '0px';
        stl[l2r ? 'left' : 'right'] = shift + 'px';
      }
      this.stl0[midi] = { backgroundColor:'#000', borderColor:'#000' };
      this.stl1[midi] = { backgroundColor:'#888', borderColor:'#000' };
      _style(key, this.stl0[midi]);
      _style(key, stl);
      piano.appendChild(key);
    }

    parent.appendChild(piano);

    for (midi in this.keys) {
      this.keys[midi].addEventListener("mousedown", _handleMouseDown(this, midi));
      this.keys[midi].addEventListener("mouseenter", _handleMouseEnter(this, midi));
      this.keys[midi].addEventListener("mouseleave", _handleMouseLeave(this, midi));
      this.keys[midi].addEventListener("mouseup", _handleMouseUp(this, midi));
      this.keys[midi].ondragstart = function() { return false; };
    }
    window.addEventListener("mouseup", _handleMouseOff(this));
    var touchHandle = _handleTouch(this);
    piano.addEventListener("touchstart", touchHandle);
    piano.addEventListener("touchmove", touchHandle);
    piano.addEventListener("touchend", touchHandle);

    if (!this.parent && this.bins.length > 1) {
      var self = this;
      this.resize = function() { self.onResize();}
      window.addEventListener('resize', this.resize);
    }
    this.current.parent = parent;
    this.parent = parent;
  }
  Piano.prototype.onResize = function() {
    var bin = 0;
    for (var i = 0; i < this.bins.length; i++) {
      if (this.bins[i] <= window.innerWidth) bin = this.bins[i];
      else break;
    }
    if (this.current == this.params[bin]) return;
    this.current = this.params[bin];
    this.createCurrent();
  }

  Piano.prototype.destroy = function() {
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
    var piano = new Piano(this._arg);
    piano.create();
    piano.noteOn = function(note) { JZZ.util.iosSound(); port._event(JZZ.MIDI(0x90, note, 127)); };
    piano.noteOff = function(note) { port._event(JZZ.MIDI(0x80, note, 127)); };
    port._resume();
  }

  JZZ.input.Kbd = function() {
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

  JZZ.input.Kbd.register = function() {
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