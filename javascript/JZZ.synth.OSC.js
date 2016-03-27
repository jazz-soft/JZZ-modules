(function() {
  if (!JZZ) return;
  if (!JZZ.synth) JZZ.synth = {};

  var _ac;
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) _ac = new AudioContext();
  if (_ac && !_ac.createGain) _ac.createGain = _ac.createGainNode;

  function Synth() {
    this.channels = [];
    this.channel = function(c) {
      if (!this.channels[c]) this.channels[c] = new Channel();
      return this.channels[c];
    }
    this.play = function(arr) {
      var b = arr[0];
      var n = arr[1];
      var v = arr[2];
      if (b<0 || b>255) return;
      var c = b&15;
      var s = b>>4;
      if (s == 9) this.channel(c).play(n, v);
      if (s == 8) this.channel(c).play(n, 0);
    }
  }

  function Channel() {
    this.notes = [];
    this.note = function(n) {
      if (!this.notes[n]) this.notes[n] = new Note(n, this);
      return this.notes[n];
    }
    this.play = function(n, v) {
      this.note(n).play(v);
    }
  }

  function Note(n, c) {
    this.note = n;
    this.channel = c;
    this.freq = 440 * Math.pow(2,(n-69)/12);
    this.play = function(v) {
      try {
        if (this.oscillator) this.oscillator.stop(0);
      }
      catch (e) {}
      if (!v) return;
      var ampl = v/127;
      this.oscillator = _ac.createOscillator();
      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.value = this.freq;
      if (!this.oscillator.start) this.oscillator.start = this.oscillator.noteOn;
      if (!this.oscillator.stop) this.oscillator.stop = this.oscillator.noteOff;

      this.gain = _ac.createGain();
      var releaseTime = 2;
      var now = _ac.currentTime;
      this.gain.gain.setValueAtTime(ampl, now);
      this.gain.gain.exponentialRampToValueAtTime(0.01*ampl, now + releaseTime);

      this.oscillator.connect(this.gain);
      this.gain.connect(_ac.destination);

      this.oscillator.start(0);
    }
  }

  var _synth = {};
  var _engine = {};

  _engine._info = function(name) {
    if (!name) name = 'JZZ.synth.OSC';
    return {
      type: 'Web Audo',
      name: name,
      manufacturer: 'virtual',
      version: '0.1'
    };
  }

  _engine._openOut = function(port, name) {
    if (!_ac) { port._crash('AudioContext not supported'); return;}
    if (!_synth[name]) _synth[name] = new Synth;
    port._info = _engine._info(name);
    port._send = function(msg) { _synth[name].play(msg); };
    port._resume();
  }

  JZZ.synth.OSC = function(name) {
    return JZZ.lib.openMidiOut(name, _engine);
  }

  JZZ.synth.OSC.register = function(name) {
    return _ac ? JZZ.lib.registerMidiOut(name, _engine) : false;
  }

})();