(function() {
  if (!JZZ) return;
  if (!JZZ.input) JZZ.input = {};

  var _version = '0.4';
  function _name(name, deflt) { return name ? name : deflt; }

  function _copy(obj) {
    var ret = {};
    for(var k in obj) ret[k] = obj[k];
    return ret;
  }
  function _lftBtnDn(e) { return e.buttons === undefined ? !e.button : e.buttons & 1; }
  function _lftBtnUp(e) { return e.buttons === undefined ? !e.button : !(e.buttons & 1); }
  function _returnFalse() { return false; }
  function _style(sp, stl) {
    for(var k in stl) sp.style[k] = stl[k];
  }
  var _innerStyle = {margin:0, padding:0, width:'100%', height:'100%'};
  var _channelMap = { a:10, b:11, c:12, d:13, e:14, f:15, A:10, B:11, C:12, D:13, E:14, F:15 };
  for (var k = 0; k < 16; k++) _channelMap[k] = k;

  function _Data(d) {
    this.base = .5;
    this.val = .5;
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
    }
  }
////////////////////////////////////////////////////////////////////////////
  function _Span(ctrl, span, inner, stl, stl0, stl1) {
    this.ctrl = ctrl;
    this.span = span;
    this.inner = inner;
    this.stl = stl;
    this.stl0 = stl0;
    this.stl1 = stl1;
  }
  _Span.prototype.setInnerHTML = function(html) {
    this.inner.innerHTML = html;
    return this;
  }
  _Span.prototype.setStyle = function(s0, s1) {
    if (s1 === undefined) s1 = s0;
    for(var k in s0) this.stl0[k] = s0[k];
    for(var k in s1) this.stl1[k] = s1[k];
    _style(this.span, this.ctrl.isSelected() ? this.stl1 : this.stl0);
    _style(this.span, this.stl);
    return this;
  }
////////////////////////////////////////////////////////////////////////////
  function _Knob() {}
  function _initKnob(arg, common) {
    this.bins = [];
    this.params = {0:{}};
    if (arg === undefined) arg = {};
    if (common === undefined) common = {};
    this.chan = _channelMap[arg.chan];
    if (this.chan === undefined) this.chan = 0;
    var key;
    for (key in arg) {
      if (key == parseInt(key)) this.params[key] = _copy(arg[key]);
      else {
        if (key == 'chan') continue;
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
  _Knob.prototype.onResize = function() {
    var bin = 0;
    for (var i = 0; i < this.bins.length; i++) {
      if (this.bins[i] <= window.innerWidth) bin = this.bins[i];
      else break;
    }
    if (this.current == this.params[bin]) return;
    this.current = this.params[bin];
    this.createCurrent();
  }
  _Knob.prototype.settings = function() { return _copy(this.current); }
  _Knob.prototype.isSelected = function() { return this.dragX !== undefined; }
  _Knob.prototype.restyle = function() {
    for (var i in this.spans) this.spans[i].setStyle();
  }
  _Knob.prototype.onMouseDown = function(e) {
    if (this.dragX !== undefined) return;
    this.dragX = e.clientX;
    this.dragY = e.clientY;
    this.mouseMove = _MouseMove(this);
    this.mouseUp = _MouseUp(this);
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mouseup', this.mouseUp);
    this.restyle();
  }
  _Knob.prototype.onMouseMove = function(e) {
    if (this.dragX !== undefined) this.onMove(e.clientX, e.clientY);
  }
  _Knob.prototype.onMouseUp = function(e) {
// mouse or touch ended
  }
  _Knob.prototype.onTouchStart = function(e) {
    e.preventDefault();
    if (this.dragX !== undefined) return;
    this.touch = e.targetTouches[0].identifier;
    this.dragX = e.targetTouches[0].clientX;
    this.dragY = e.targetTouches[0].clientY;
    this.restyle();
  }
  _Knob.prototype.onTouchMove = function(e) {
    e.preventDefault();
    if (this.dragX === undefined || this.touch === undefined) return;
    for (var i in e.targetTouches) if (e.targetTouches[0].identifier == this.touch) {
      this.onMove(e.targetTouches[i].clientX, e.targetTouches[i].clientY);
      return;
    }
  }
  _Knob.prototype.onTouchEnd = function(e) {
    e.preventDefault();
    this.touch = undefined;
    this.dragX = undefined;
    this.restyle();
    this.onMouseUp(e);
  }
  function _MouseDown(x) { return function(e) { if (_lftBtnDn(e)) x.onMouseDown(e); }; }
  function _MouseMove(x) { return function(e) { x.onMouseMove(e); }; }
  function _MouseUp(x) { return function(e) {
    if (!_lftBtnUp(e)) return;
    window.removeEventListener("mousemove", x.mouseMove);
    window.removeEventListener("mouseup", x.mouseUp);
    x.dragX = undefined;
    x.restyle();
    x.onMouseUp(e);
  }; }
  function _TouchStart(x) { return function(e) { x.onTouchStart(e); }; }
  function _TouchMove(x) { return function(e) { x.onTouchMove(e); }; }
  function _TouchEnd(x) { return function(e) { x.onTouchEnd(e); }; }
  function _IgnoreTouch(e) { e.preventDefault(); }
////////////////////////////////////////////////////////////////////////////
  function Slider(arg) {
    _initKnob.call(this, arg, {pos:'N', rw:2, rh:128, kw:24, kh:16});
  }
  Slider.prototype = new _Knob;
  Slider.prototype.createAt = function(parent) {
    parent.innerHTML = '';
    var bh = parseInt(this.current.bh);
    var bw = parseInt(this.current.bw);
    var rh = parseInt(this.current.rh); if (!rh) rh = 128;
    this.rh = rh;
    var rw = parseInt(this.current.rw); if (!rw) rw = 2;
    var kh = parseInt(this.current.kh); if (!kh) kh = 24;
    var kw = parseInt(this.current.kw); if (!kw) kw = 16;
    var pos = this.current.pos.toUpperCase();
    this.pos = pos;
    if (!this.data) {
      this.data = new _Data(this.current.data);
      this.data.chan = this.chan;
      this.data.setBase(this.current.base);
      this.data.setValue(this.current.val);
    }
    this.dx = - (kw / 2);
    this.dy = - (kh / 2 + 1);

    if (!bh) bh = kh + rh + 2;
    if (!bw) bw = (kw > rw ? kw : rw) + 2;
    this.stlB = { display:'inline-block', position:'relative', margin:'0', padding:'0', userSelect:'none', KhtmlUserSelect:'none', MozUserSelect:'none', MsUserSelect:'none', OUserSelect:'none', WebkitUserSelect:'none' };
    this.stlB0 = { borderStyle:'none' };
    this.stlB1 = { borderStyle:'none' };
    this.stlR = { display:'inline-block', position:'absolute', margin:'0', padding:'0', borderStyle:'solid', borderWidth:'1px' };
    this.stlR0 = { backgroundColor:'#aaa' };
    this.stlR1 = { backgroundColor:'#bbb' };
    this.stlK = { display:'inline-block', position:'absolute', margin:'0', padding:'0', borderStyle:'solid', borderWidth:'1px' };
    this.stlK0 = { backgroundColor:'#ddd' };
    this.stlK1 = { backgroundColor:'#eee' };

    if (pos == 'E' || pos == 'W') {
      this.stlB.width = bh + 'px';
      this.stlB.height = bw + 'px';
      this.stlR.width = rh + 'px';
      this.stlR.height = rw + 'px';
      this.stlR.left = ((bh - rh) / 2 - 1) + 'px';
      this.stlR.top = ((bw - rw) / 2 - 1) + 'px';
      this.stlK.width = kh + 'px';
      this.stlK.height = kw + 'px';
      this.stlK.top = this.dx + 'px';
    }
    else {
      this.stlB.width = bw + 'px';
      this.stlB.height = bh + 'px';
      this.stlR.width = rw + 'px';
      this.stlR.height = rh + 'px';
      this.stlR.top = ((bh - rh) / 2 - 1) + 'px';
      this.stlR.left = ((bw - rw) / 2 - 1) + 'px';
      this.stlK.width = kw + 'px';
      this.stlK.height = kh + 'px';
      this.stlK.left = this.dx + 'px';
    }

    var box = document.createElement('span');
    this.box = box;
    var box_ = document.createElement('span');
    _style(box_, _innerStyle);
    this.boxSpan = new _Span(this, box, box_, this.stlB, this.stlB0, this.stlB1);
    var range = document.createElement('span');
    this.range = range;
    var range_ = document.createElement('span');
    _style(range_, _innerStyle);
    this.rangeSpan = new _Span(this, range, range_, this.stlR, this.stlR0, this.stlR1);
    var knob = document.createElement('span');
    this.knob = knob;
    this.knobSpan = new _Span(this, knob, knob, this.stlK, this.stlK0, this.stlK1);
    this.spans = [this.boxSpan, this.rangeSpan, this.knobSpan];

    var active = this.current.active === undefined || this.current.active;
    if (active) {
      box.addEventListener("touchstart", _IgnoreTouch);
      knob.addEventListener("mousedown", _MouseDown(this));
      knob.addEventListener("touchstart", _TouchStart(this));
      knob.addEventListener("touchmove", _TouchMove(this));
      knob.addEventListener("touchend", _TouchEnd(this));
    }
    if (this.current.onCreate) this.current.onCreate.apply(this);
    range.appendChild(range_);
    range.appendChild(knob);
    box.appendChild(box_);
    box.appendChild(range);
    box.ondragstart = _returnFalse;
    box.onselectstart = _returnFalse;
    parent.appendChild(box);
    if (!this.parent && this.bins.length > 1) {
      var self = this;
      this.resize = function() { self.onResize(); }
      window.addEventListener('resize', this.resize);
    }
    this.current.parent = parent;
    this.parent = parent;
    this.setValue();
    _style(this.box, this.dragX === undefined ? this.stlB0 : this.stlB1);
    _style(this.box, this.stlB);
    _style(this.range, this.dragX === undefined ? this.stlR0 : this.stlR1);
    _style(this.range, this.stlR);
    _style(this.knob, this.dragX === undefined ? this.stlK0 : this.stlK1);
    _style(this.knob, this.stlK);
  }
  Slider.prototype.getBox = function() { return this.boxSpan; }
  Slider.prototype.getRange = function() { return this.rangeSpan; }
  Slider.prototype.getKnob = function() { return this.knobSpan; }
  Slider.prototype.setValue = function(x) {
    if (x === undefined) x = this.data.val;
    else if (!this.data.setValue(x)) return;
    x = this.data.val;
    if (this.pos == 'N' || this.pos == 'W') x = 1. - x;
    x *= this.rh;
    this.coord = x;
    x += this.dy;
    if (this.pos == 'N' || this.pos == 'S') {
      this.stlK.top = x + 'px';
      this.knob.style.top = x + 'px';
    }
    else {
      this.stlK.left = x + 'px';
      this.knob.style.left = x + 'px';
    }
  }
  Slider.prototype.onMove = function(x, y) {
    var coord;
    if (this.pos == 'N' || this.pos == 'S') coord = this.coord + y - this.dragY;
    else coord = this.coord + x - this.dragX;
    if (coord < 0) coord = 0;
    if (coord > this.rh) coord = this.rh;
    this.move(coord);
  }
  Slider.prototype.move = function(coord) {
    if (this.coord == coord) return;
    if (this.pos == 'N' || this.pos == 'S') {
      this.knob.style.top = coord + this.dy + 'px';
      this.stlK.top = this.knob.style.top;
      this.dragY += coord - this.coord;
    }
    else {
      this.knob.style.left = coord + this.dy + 'px';
      this.stlK.left = this.knob.style.left;
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
////////////////////////////////////////////////////////////////////////////
  function Pad(arg) {
    _initKnob.call(this, arg, {pos:'N', rw:128, rh:128, kw:24, kh:16});
  }
  Pad.prototype = new _Knob;
  Pad.prototype.createAt = function(parent) {
    parent.innerHTML = '';
    var bh = parseInt(this.current.bh);
    var bw = parseInt(this.current.bw);
    var rh = parseInt(this.current.rh); if (!rh) rh = 128;
    this.rh = rh;
    var rw = parseInt(this.current.rw); if (!rw) rw = 128;
    this.rw = rw;
    var kh = parseInt(this.current.kh); if (!kh) kh = 24;
    var kw = parseInt(this.current.kw); if (!kw) kw = 16;
    var pos = this.current.pos.toUpperCase();
    this.pos = pos;
    if (!this.dataX) {
      this.dataX = new _Data(this.current.dataX);
      this.dataY = new _Data(this.current.dataY);
      if (this.current.dataX === undefined && this.current.dataY !== undefined && !this.dataY.msb) this.dataX = new _Data('mod');
      if (this.current.dataY === undefined && !this.dataX.msb) this.dataY = new _Data('mod');
      this.dataX.chan = this.chan;
      this.dataY.chan = this.chan;
      this.dataX.setBase(this.current.baseX);
      this.dataY.setBase(this.current.baseY);
      this.dataX.setValue(this.current.valX);
      this.dataY.setValue(this.current.valY);
    }
    this.dx = - (kw / 2 + 1);
    this.dy = - (kh / 2 + 1);

    if (!bh) bh = kh + rh + 2;
    if (!bw) bw = kw + rw + 2;
    this.stlB = { display:'inline-block', position:'relative', margin:'0', padding:'0', userSelect:'none', KhtmlUserSelect:'none', MozUserSelect:'none', MsUserSelect:'none', OUserSelect:'none', WebkitUserSelect:'none' };
    this.stlB0 = { borderStyle:'none' };
    this.stlB1 = { borderStyle:'none' };
    this.stlR = { display:'inline-block', position:'absolute', margin:'0', padding:'0', borderStyle:'solid', borderWidth:'1px' };
    this.stlR0 = { backgroundColor:'#aaa' };
    this.stlR1 = { backgroundColor:'#bbb' };
    this.stlK = { display:'inline-block', position:'absolute', margin:'0', padding:'0', borderStyle:'solid', borderWidth:'1px' };
    this.stlK0 = { backgroundColor:'#ddd' };
    this.stlK1 = { backgroundColor:'#eee' };

    if (pos == 'E' || pos == 'W') {
      this.stlB.width = bh + 'px';
      this.stlB.height = bw + 'px';
      this.stlR.width = rh + 'px';
      this.stlR.height = rw + 'px';
      this.stlR.left = ((bh - rh) / 2 - 1) + 'px';
      this.stlR.top = ((bw - rw) / 2 - 1) + 'px';
      this.stlK.width = kh + 'px';
      this.stlK.height = kw + 'px';
      this.stlK.top = this.dx + 'px';
    }
    else {
      this.stlB.width = bw + 'px';
      this.stlB.height = bh + 'px';
      this.stlR.width = rw + 'px';
      this.stlR.height = rh + 'px';
      this.stlR.top = ((bh - rh) / 2 - 1) + 'px';
      this.stlR.left = ((bw - rw) / 2 - 1) + 'px';
      this.stlK.width = kw + 'px';
      this.stlK.height = kh + 'px';
      this.stlK.left = this.dx + 'px';
    }

    var box = document.createElement('span');
    this.box = box;
    var box_ = document.createElement('span');
    _style(box_, _innerStyle);
    this.boxSpan = new _Span(this, box, box_, this.stlB, this.stlB0, this.stlB1);
    var range = document.createElement('span');
    this.range = range;
    var range_ = document.createElement('span');
    _style(range_, _innerStyle);
    this.rangeSpan = new _Span(this, range, range_, this.stlR, this.stlR0, this.stlR1);
    var knob = document.createElement('span');
    this.knob = knob;
    this.knobSpan = new _Span(this, knob, knob, this.stlK, this.stlK0, this.stlK1);
    this.spans = [this.boxSpan, this.rangeSpan, this.knobSpan];

    var active = this.current.active === undefined || this.current.active;
    if (active) {
      box.addEventListener("touchstart", _IgnoreTouch);
      knob.addEventListener("mousedown", _MouseDown(this));
      knob.addEventListener("touchstart", _TouchStart(this));
      knob.addEventListener("touchmove", _TouchMove(this));
      knob.addEventListener("touchend", _TouchEnd(this));
    }
    if (this.current.onCreate) this.current.onCreate.apply(this);
    range.appendChild(range_);
    range.appendChild(knob);
    box.appendChild(box_);
    box.appendChild(range);
    box.ondragstart = _returnFalse;
    box.onselectstart = _returnFalse;
    parent.appendChild(box);
    if (!this.parent && this.bins.length > 1) {
      var self = this;
      this.resize = function() { self.onResize(); }
      window.addEventListener('resize', this.resize);
    }
    this.current.parent = parent;
    this.parent = parent;
    this.setValue();
    _style(this.box, this.dragX === undefined ? this.stlB0 : this.stlB1);
    _style(this.box, this.stlB);
    _style(this.range, this.dragX === undefined ? this.stlR0 : this.stlR1);
    _style(this.range, this.stlR);
    _style(this.knob, this.dragX === undefined ? this.stlK0 : this.stlK1);
    _style(this.knob, this.stlK);
  }
  Pad.prototype.getBox = function() { return this.boxSpan; }
  Pad.prototype.getRange = function() { return this.rangeSpan; }
  Pad.prototype.getKnob = function() { return this.knobSpan; }
  Pad.prototype.setValue = function(x, y) {
    if (x === undefined) {
      x = this.dataX.val;
      y = this.dataY.val;
    }
    else if (!this.dataX.setValue(x) && !this.dataY.setValue(y)) return;
    x = this.dataX.val;
    y = this.dataY.val;
    if (this.pos == 'N' || this.pos == 'W') y = 1. - y;
    if (this.pos == 'S' || this.pos == 'W') x = 1. - x;
    x *= this.rw;
    y *= this.rh;
    if (this.pos == 'N' || this.pos == 'S') {
      this.coordX = x;
      this.coordY = y;
    }
    else {
      this.coordX = y;
      this.coordY = x;
    }
    x += this.dx;
    y += this.dy;
    if (this.pos == 'N' || this.pos == 'S') {
      this.stlK.left = x + 'px';
      this.stlK.top = y + 'px';
    }
    else {
      this.stlK.top = x + 'px';
      this.stlK.left = y + 'px';
    }
    this.knob.style.left = this.stlK.left;
    this.knob.style.top = this.stlK.top;
  }
  Pad.prototype.onMove = function(x, y) {
    x = this.coordX + x - this.dragX;
    y = this.coordY + y - this.dragY;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (this.pos == 'N' || this.pos == 'S') {
      if (x > this.rw) x = this.rw;
      if (y > this.rh) y = this.rh;
      this.knob.style.left = x + this.dx + 'px';
      this.knob.style.top = y + this.dy + 'px';
    }
    else {
      if (x > this.rh) x = this.rh;
      if (y > this.rw) y = this.rw;
      this.knob.style.left = x + this.dy + 'px';
      this.knob.style.top = y + this.dx + 'px';
    }
    this.stlK.left = this.knob.style.left;
    this.stlK.top = this.knob.style.top;

    this.dragX += x - this.coordX;
    this.dragY += y - this.coordY;
    this.coordX = x;
    this.coordY = y;
    if (this.pos == 'E' || this.pos == 'W') {
      x = this.coordY;
      y = this.coordX;
    }
    x /= this.rw;
    y /= this.rh;
    if (this.pos == 'N' || this.pos == 'W') y = 1. - y;
    if (this.pos == 'S' || this.pos == 'W') x = 1. - x;
    if (this.dataX.setValue(x)) this.dataX.emit(this);
    if (this.dataY.setValue(y)) this.dataY.emit(this);
  }
  Pad.prototype.forward = function(msg) {
    this.emit(msg);
    if (this.dataX.read(msg) || this.dataY.read(msg)) {
      this.setValue();
    }
  }
////////////////////////////////////////////////////////////////////////////
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
    port.settings = function() { return slider.settings(); }
    port.getBox = function() { return slider.boxSpan; }
    port.getRange = function() { return slider.rangeSpan; }
    port.getKnob = function() { return slider.knobSpan; }
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
////////////////////////////////////////////////////////////////////////////
  function EngPad() {}
  EngPad.prototype._info = function(name) {
    return {
      type: 'html/javascript',
      name: _name(name, 'Pad'),
      manufacturer: 'virtual',
      version: _version
    };
  }
  EngPad.prototype._openIn = function(port, name) {
    var pad = new Pad(this._arg);
    pad.create();
    pad.emit = function(msg) { port._emit(msg); };
    port._info = this._info(name);
    port._receive = function(msg) { pad.forward(msg); };
    port._close = function(){ pad._close(); }
    port.settings = function() { return pad.settings(); }
    port.getBox = function() { return pad.boxSpan; }
    port.getRange = function() { return pad.rangeSpan; }
    port.getKnob = function() { return pad.knobSpan; }
    port.setValue = function(x) { pad.setValue(x);}
    port._resume();
  }

  JZZ.input.Pad = function() {
    var name, arg;
    if (arguments.length == 1) {
      if (typeof arguments[0] === 'string') name = arguments[0];
      else arg = arguments[0];
    }
    else { name = arguments[0]; arg = arguments[1];}
    var _engine = new EngPad;
    _engine._arg = arg;
    return JZZ.lib.openMidiIn(name, _engine);
  }

  JZZ.input.Pad.register = function() {
    var name, arg;
    if (arguments.length == 1) {
      if (typeof arguments[0] === 'string') name = arguments[0];
      else arg = arguments[0];
    }
    else { name = arguments[0]; arg = arguments[1];}
    var _engine = new EngPad;
    _engine._arg = arg;
    return JZZ.lib.registerMidiIn(name, _engine);
  }

})();