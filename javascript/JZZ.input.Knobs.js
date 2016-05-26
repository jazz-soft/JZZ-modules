(function() {
  if (!JZZ) return;
  if (!JZZ.input) JZZ.input = {};

  var _version = '0.1';
  function _name(name, deflt) { return name ? name : deflt; }

  function _copy(obj) {
    var ret = {};
    for(var k in obj) ret[k] = obj[k];
    return ret;
  }
  function _lftBtnDn(e) { return e.buttons === undefined ? !e.button : e.buttons & 1; }
  function _lftBtnUp(e) { return e.buttons === undefined ? !e.button : !(e.buttons & 1); }
  function _returnFalse() { return false; }
  function _style(key, stl) {
    for(var k in stl) key.style[k] = stl[k];
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

  var _channelMap = { a:10, b:11, c:12, d:13, e:14, f:15, A:10, B:11, C:12, D:13, E:14, F:15 };
  for (var k = 0; k < 16; k++) _channelMap[k] = k;

  function Piano(arg) {
    var self = this;
    this.bins = [];
    this.params = {0:{}};
    var common = {from:'C4', to:'E6', ww:42, bw:24, wl:150, bl:100, pos:'N'};
    if (arg === undefined) arg = {};
    this.channel = _channelMap[arg.channel];
    if (this.channel === undefined) this.channel = 0;
    var key;
    for (key in arg) {
      if (key == parseInt(key)) this.params[key] = _copy(arg[key]);
      else {
        if (key == 'channel') continue;
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
    this._close = function() { // _impl = self
      for (var midi in self.playing) if (self.playing[midi] == 'M' || self.playing[midi] == 'T') self.noteOff(midi);;
      if (self.parent) self.parent.innerHTML = '';
      window.removeEventListener("mouseup", self.mouseUpHandler);
    }
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
  Piano.prototype.getKey = function(note) {
    var keys = new Keys(this);
    var k = JZZ.MIDI.noteValue(note);
    if (this.keys[k] !== undefined) keys.keys.push(k);
    return keys;
  }
  Piano.prototype.getKeys = function(from, to) {
    var keys = new Keys(this);
    var n0 = from === undefined ? undefined : JZZ.MIDI.noteValue(from);
    var n1 = to === undefined ? undefined : JZZ.MIDI.noteValue(to);
    if (n0 !== undefined && n1 !== undefined && n1 < n0) { var nn = n0; n0 = n1; n1 = nn; }
    for (var k in this.keys) {
      if (n0 !== undefined && k < n0) continue;
      if (n1 !== undefined && k > n1) continue;
      keys.keys.push(k);
    }
    return keys;
  }

  function Keys(piano) {
    this.piano = piano;
    this.keys = [];
  }
  Keys.prototype.setInnerHTML = function(html) {
    for (var k in this.keys) this.piano.keys[this.keys[k]].innerHTML = html;
    return this;
  }
  Keys.prototype.setStyle = function(s0, s1) {
    if (s1 === undefined) s1 = s0;
    for (var k in this.keys) {
      var midi = this.keys[k];
      for (var n in s0) this.piano.stl0[midi][n] = s0[n];
      for (var n in s1) this.piano.stl1[midi][n] = s1[n];
      _style(this.piano.keys[midi], this.piano.playing[midi] ? this.piano.stl1[midi] :  this.piano.stl0[midi]);
      _style(this.piano.keys[midi], this.piano.locs[midi]);
    }
    return this;
  }
////////////////////////////////////////////////////////////////////////////
  function _Data(d) {
    this.base = .5;
    this.val = .5;
    this.int = 0x2000;
    this.msb = 0;
    this.lsb = 0;
    this.chan = 0;
    if (d instanceof Array) {
      if (d.length != 1 && d.length != 2) return;
      if (d.length == 2) {
        if (d[1] != parseInt(d[1]) || d[1] < 1 || d[1] > 0x7f) return;
        this.msb = d[0];
        if (d[1] != d[0]) this.lsb = d[1];
      }
      else this.msb = d[0];
    }
    else if (d == parseInt(d)) {
      if (d < 1 || d > 0x7f) return;
      this.msb = d;
    }
    else {
      var z = {
        mod:[0x01, 0x21], breath:[0x02, 0x22], foot:[0x04, 0x24], portamento:[0x05, 0x25], volume:[0x07, 0x27],
        balance:[0x08, 0x28], pan:[0x0a, 0x2a], expression:[0x0b, 0x2b], effect1:[0x0c, 0x2c], effect2:[0x0d, 0x2d]
      }[d];
      if (z) {
        this.msb = z[0];
        this.lsb = z[1];
      }
    }
    if (this.msb && this.msb != 7 && this.msb != 8 && this.msb != 0xa) this.base = 0;
    this.val = -1;
    this.setValue(this.base);
  }
  _Data.prototype.setBase = function(x) {
    x = parseFloat(x);
    if (!isNaN(x) && isFinite(x) && x >= 0 && x <= 1) this.base = x;
  }
  _Data.prototype.setValue = function(x) {
    x = parseFloat(x);
    if (isNaN(x) || !isFinite(x) || x < 0 || x > 1 || x == this.val) return;
    this.val = x;
    this.num = Math.round(x * (this.lsb || !this.msb ? 0x3fff : 0x7f));
    return true;
  }
  _Data.prototype.emit = function(out) {
    if (!this.msb) {
      out.emit([0xe0 + this.chan, this.num & 0x7f, this.num >> 7]);
    }
    else if (!this.lsb) {
      out.emit([0xb0 + this.chan, this.msb, this.num]);
    }
    else {
      out.emit([0xb0 + this.chan, this.msb, this.num >> 7]);
      out.emit([0xb0 + this.chan, this.lsb, this.num & 0x7f]);
    }
  }
  _Data.prototype.read = function(msg) {
    if (!this.msb && msg[0] == 0xe0 + this.chan && msg[1] == parseInt(msg[1]) && msg[2] == parseInt(msg[2])) {
      this.num = (msg[2] << 7) | (msg[1] & 0x7f);
      this.val = this.num / 0x3fff;
      return true;
    }
    else if (this.msb && msg[0] == 0xb0 + this.chan && msg[2] == parseInt(msg[2])) {
      if (msg[1] == this.msb) {
        if (this.lsb) {
          this.num = (msg[2] << 7) | (this.num & 0x7f);
          this.val = this.num / 0x3fff;
        }
        else {
          this.num = msg[2] & 0x7f;
          this.val = this.num / 0x7f;
        }
        return true;
      }
      if (msg[1] == this.lsb) {
        this.num = (this.num & 0x3f80) | (msg[2] & 0x7f);
        this.val = this.num / 0x3fff;
        return true;
      }
      out.emit([0xb0 + this.chan, this.msb, this.num >> 7]);
      out.emit([0xb0 + this.chan, this.lsb, this.num & 0x7f]);
    }
  }
////////////////////////////////////////////////////////////////////////////
  function _Knob() {}
  function _initKnob(arg, common) {
    this.bins = [];
    this.params = {0:{}};
    if (arg === undefined) arg = {};
    if (common === undefined) common = {};
    this.channel = _channelMap[arg.channel];
    if (this.channel === undefined) this.channel = 0;
    var key;
    for (key in arg) {
      if (key == parseInt(key)) this.params[key] = _copy(arg[key]);
      else {
        if (key == 'channel') continue;
        common[key] = arg[key];
      }
    }
    for (key in this.params) {
      this.bins.push(key);
      for (var k in common) {
        if ((k == 'from' || k == 'to') && _keyNum(this.params[key][k]) === undefined) this.params[key][k] = common[k];
        if (!(k in this.params[key])) this.params[key][k] = common[k];
      }
    }
    this.bins.sort(function(a, b){return a-b});
  }
  _Knob.prototype._close = function() {
    if (this.parent) this.parent.innerHTML = '';
    if (this.mouseUpHandler) window.removeEventListener("mouseup", this.mouseUpHandler);
  }
  _Knob.prototype.create = function() {
    var bin = 0;
    for (var i = 0; i < this.bins.length; i++) {
      if (this.bins[i] <= window.innerWidth) bin = this.bins[i];
      else break;
    }
    this.current = this.params[bin];
    this.createCurrent();
  }
  _Knob.prototype.createCurrent = function() {
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
  _Knob.prototype.onMouseDown = function(e) {
    if (this.dragX !== undefined) return;
    this.dragX = e.clientX;
    this.dragY = e.clientY;
    this.mouseMove = _MouseMove(this);
    this.mouseUp = _MouseUp(this);
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mouseup', this.mouseUp);
  }
  _Knob.prototype.onMouseUp = function(e) {
//console.log('UP', e);
  }
////////////////////////////////////////////////////////////////////////////
  function _MouseDown(x) { return function(e) { if (_lftBtnDn(e)) x.onMouseDown(e); }; }
  function _MouseMove(x) { return function(e) { x.onMouseMove(e); }; }
  function _MouseUp(x) { return function(e) {
    if (!_lftBtnUp(e)) return;
    window.removeEventListener("mousemove", x.mouseMove);
    window.removeEventListener("mouseup", x.mouseUp);
    x.dragX = undefined;
    x.onMouseUp(e);
  }; }
////////////////////////////////////////////////////////////////////////////
  function Slider(arg) {
    _initKnob.call(this, arg, {pos:'N', rw:2, rh:128, kw:24, kh:16});
  }
  Slider.prototype = new _Knob;
  Slider.prototype.createAt = function(parent) {
    parent.innerHTML = '';
    var bh = parseInt(this.current.bh);
    var bw = parseInt(this.current.bw);
    var rh = parseInt(this.current.rh); if (!rh) rh = 127;
    this.rh = rh;
    var rw = parseInt(this.current.rw); if (!rw) rw = 2;
    var kh = parseInt(this.current.kh); if (!kh) kh = 24;
    var kw = parseInt(this.current.kw); if (!kw) kw = 16;
    var pos = this.current.pos.toUpperCase();
    this.pos = pos;
    if (!this.data) {
      this.data = new _Data(this.current.data);
      this.data.setBase(this.current.base);
      this.data.setValue(this.current.val);
    }
    this.dx = - (kw / 2);
    this.dy = - (kh / 2 + 1);

    if (!bh) bh = kh + rh;
    if (!bw) bw = kw > rw ? kw : rw;
    var slider = document.createElement('span');
    slider.style.display = 'inline-block';
    slider.style.position = 'relative';
    slider.style.margin = '0px';
    slider.style.padding = '0px';
    slider.style.borderStyle = 'none';
    slider.style.userSelect = 'none';
    slider.style.KhtmlUserSelect = 'none';
    slider.style.MozUserSelect = 'none';
    slider.style.MsUserSelect = 'none';
    slider.style.OUserSelect = 'none';
    slider.style.WebkitUserSelect = 'none';

    var range = document.createElement('span');
    range.style.display = 'inline-block';
    range.style.position = 'absolute';
    range.style.margin = '0px';
    range.style.padding = '0px';
    range.style.borderStyle = 'solid';
    range.style.borderWidth = '1px';
    range.style.backgroundColor = '#aaa';

    var knob = document.createElement('span');
    knob.style.display = 'inline-block';
    knob.style.position = 'absolute';
    knob.style.margin = '0px';
    knob.style.padding = '0px';
    knob.style.borderStyle = 'solid';
    knob.style.borderWidth = '1px';
    knob.style.backgroundColor = '#ddd';
    this.knob = knob;
    knob.addEventListener("mousedown", _MouseDown(this));

    if (pos == 'E' || pos == 'W') {
      slider.style.width = bh + 'px';
      slider.style.height = bw + 'px';
      range.style.width = rh + 'px';
      range.style.height = rw + 'px';
      range.style.left = ((bh - rh) / 2 - 1) + 'px';
      range.style.top = ((bw - rw) / 2 - 1) + 'px';
      knob.style.width = kh + 'px';
      knob.style.height = kw + 'px';
      knob.style.top = this.dx + 'px';
    }
    else {
      slider.style.width = bw + 'px';
      slider.style.height = bh + 'px';
      range.style.width = rw + 'px';
      range.style.height = rh + 'px';
      range.style.top = ((bh - rh) / 2 - 1) + 'px';
      range.style.left = ((bw - rw) / 2 - 1) + 'px';
      knob.style.width = kw + 'px';
      knob.style.height = kh + 'px';
      knob.style.left = this.dx + 'px';
    }
    this.setValue(this.value);
    if (this.current.onCreate) this.current.onCreate.apply(this);
    range.appendChild(knob);
    slider.appendChild(range);
    slider.ondragstart = _returnFalse;
    slider.onselectstart = _returnFalse;
    range.ondragstart = _returnFalse;
    range.onselectstart = _returnFalse;
    knob.ondragstart = _returnFalse;
    knob.onselectstart = _returnFalse;
    parent.appendChild(slider);
    this.current.parent = parent;
    this.parent = parent;
    this.setValue();
  }
  Slider.prototype.setValue = function(x) {
    if (x === undefined) x = this.data.val;
    else if (!this.data.setValue(x)) return;
    x = this.data.val;
    if (this.pos == 'N' || this.pos == 'W') x = 1. - x;
    x *= this.rh;
    this.coord = x;
    x += this.dy;
    if (this.pos == 'N' || this.pos == 'S') this.knob.style.top = x + 'px';
    else this.knob.style.left = x + 'px';
  }
  Slider.prototype.onMouseMove = function(e) {
    var coord;
    if (this.pos == 'N' || this.pos == 'S') coord = this.coord + e.clientY - this.dragY;
    else coord = this.coord + e.clientX - this.dragX;
    if (coord < 0) coord = 0;
    if (coord > this.rh) coord = this.rh;
    this.move(coord);
  }
  Slider.prototype.move = function(coord) {
    if (this.coord == coord) return;
    if (this.pos == 'N' || this.pos == 'S') {
      this.knob.style.top = coord + this.dy + 'px';
      this.dragY += coord - this.coord;
    }
    else {
      this.knob.style.left = coord + this.dy + 'px';
      this.dragX += coord - this.coord;
    }
    var x = coord / this.rh;
    if (this.pos == 'N' || this.pos == 'W') x = 1. - x;
    if (this.data.setValue(x)) this.data.emit(this);
    this.coord = coord;
  }
  Slider.prototype.forward = function(msg) {
    this.emit(msg);
    if (this.data.read(msg)) {
      this.setValue();
    }
  }
  function EngSlider() {}
  EngSlider.prototype._info = function(name) {
    return {
      type: 'html/javascript',
      name: _name(name, 'Slider'),
      manufacturer: 'virtual',
      version: _version
    };
  }
  EngSlider.prototype._openIn = function(port, name) {
    var slider = new Slider(this._arg);
    slider.create();
    slider.emit = function(msg) { port._emit(msg); };
    port._info = this._info(name);
    port._receive = function(msg) { slider.forward(msg); };
    port._close = function(){ slider._close(); }
    //port.getKey = function(note) { return piano.getKey(note); }
    //port.getKeys = function(a, b) { return piano.getKeys(a, b); }
    port.setValue = function(x) { slider.setValue(x);}
    port._resume();
  }

  JZZ.input.Slider = function() {
    var name, arg;
    if (arguments.length == 1) {
      if (typeof arguments[0] === 'string') name = arguments[0];
      else arg = arguments[0];
    }
    else { name = arguments[0]; arg = arguments[1];}
    var _engine = new EngSlider;
    _engine._arg = arg;
    return JZZ.lib.openMidiIn(name, _engine);
  }

  JZZ.input.Slider.register = function() {
    var name, arg;
    if (arguments.length == 1) {
      if (typeof arguments[0] === 'string') name = arguments[0];
      else arg = arguments[0];
    }
    else { name = arguments[0]; arg = arguments[1];}
    var _engine = new EngSlider;
    _engine._arg = arg;
    return JZZ.lib.registerMidiIn(name, _engine);
  }

})();