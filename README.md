# JZZ-modules

Additional modules for [**JZZ.js**](https://github.com/jazz-soft/JZZ):

[**JZZ.synth.MIDIjs**](#jzzsynthmidijs)  
[**JZZ.synth.Timbre**](#jzzsynthtimbre)  
[**JZZ.synth.OSC**](#jzzsynthosc) - moved to **https://github.com/jazz-soft/JZZ-synth-OSC**  
[**JZZ.synth.Tiny**](#jzzsynthtiny) - see at **https://github.com/jazz-soft/JZZ-synth-Tiny**  
[**JZZ.input.Qwerty**](#jzzinputqwerty)  
[**JZZ.input.Kbd**](#jzzinputkbd) - moved to **https://github.com/jazz-soft/JZZ-input-Kbd**  
[**JZZ.input.ASCII**](#jzzinputascii) - moved to **https://github.com/jazz-soft/JZZ-input-Kbd**  
[**JZZ.input.Knobs**](#jzzinputknobs) - moved to **https://github.com/jazz-soft/JZZ-input-Kbd**  

## JZZ.synth.MIDIjs

Create a custom MIDI-Out port using [**MIDI.js**](https://github.com/mudcube/MIDI.js) library.

![windows](https://jazz-soft.github.io/img/windows.jpg)
![mocos](https://jazz-soft.github.io/img/macos.jpg)
![linux](https://jazz-soft.github.io/img/linux.jpg)
![android](https://jazz-soft.github.io/img/android.jpg)

##### Example

```html
<script src='javascript/JZZ.js'></script>
<script src='javascript/MIDI.js'></script>
<script src='javascript/JZZ.synth.MIDIjs.js'></script>
<script><!--
JZZ.synth.MIDIjs({ soundfontUrl: "./soundfont/", instrument: "acoustic_grand_piano" })
   .note(0, 'C5', 127, 500).wait(500)
   .note(0, 'E5', 127, 500).wait(500)
   .note(0, 'G5', 127, 500).wait(500)
   .note(0, 'C6', 127, 500);
--></script>
```

See the [**demo**](https://jazz-soft.github.io/modules/midijs).

## JZZ.synth.Timbre

A wrapper for the [**Timbre.js**](https://github.com/mohayonao/timbre.js) T("PluckGen")/T("OscGen")/T("SynthDef") synths.

![windows](https://jazz-soft.github.io/img/windows.jpg)
![mocos](https://jazz-soft.github.io/img/macos.jpg)
![linux](https://jazz-soft.github.io/img/linux.jpg)
![android](https://jazz-soft.github.io/img/android.jpg)

(Unlike advertized, does not seem to work in IE9 and some other browsers)

##### Example

```html
<script src='javascript/timbre.js'></script>
<script src='javascript/JZZ.js'></script>
<script src='javascript/JZZ.synth.MIDIjs.js'></script>
<script><!--
var synth = T("SynthDef").play();
synth.def = function(opts) {
  var osc1, osc2, env;
  osc1 = T("sin", {freq:opts.freq, mul:0.25});
  osc2 = T("sin", {freq:opts.freq + 8, mul:0.25});
  env  = T("linen", {s:450, r:2500, lv:0.5}, osc1, osc2);
  return env.on("ended", opts.doneAction).bang();
};
JZZ.synth.Timbre(synth)
   .note(0, 'C5', 127, 500).wait(500)
   .note(0, 'E5', 127, 500).wait(500)
   .note(0, 'G5', 127, 500).wait(500)
   .note(0, 'C6', 127, 500);
--></script>
```

See the [**demo**](https://jazz-soft.github.io/modules/timbre).

## JZZ.synth.OSC

A simple Web Audio oscillator-based MIDI-Out port.

![windows](https://jazz-soft.github.io/img/windows.jpg)
![mocos](https://jazz-soft.github.io/img/macos.jpg)
![linux](https://jazz-soft.github.io/img/linux.jpg)
![ios](https://jazz-soft.github.io/img/ios.jpg)
![android](https://jazz-soft.github.io/img/android.jpg)

(moved to **https://github.com/jazz-soft/JZZ-synth-OSC**)

##### Example

```html
<script src='javascript/JZZ.js'></script>
<script src='javascript/JZZ.synth.OSC.js'></script>
<script><!--
JZZ.synth.OSC()
   .note(0, 'C5', 127, 500).wait(500)
   .note(0, 'E5', 127, 500).wait(500)
   .note(0, 'G5', 127, 500).wait(500)
   .note(0, 'C6', 127, 500);
--></script>
```

See the [**demo**](https://jazz-soft.github.io/modules/osc).

## JZZ.synth.Tiny

Tiny Web-Audio GM Synthesizer 
([g200kg/webaudio-tinysynth](https://github.com/g200kg/webaudio-tinysynth))
wrapped as MIDI-Out port.

![windows](https://jazz-soft.github.io/img/windows.jpg)
![mocos](https://jazz-soft.github.io/img/macos.jpg)
![linux](https://jazz-soft.github.io/img/linux.jpg)
![ios](https://jazz-soft.github.io/img/ios.jpg)
![android](https://jazz-soft.github.io/img/android.jpg)

(see at **https://github.com/jazz-soft/JZZ-synth-Tiny**)

##### Example

```html
<script src='javascript/JZZ.js'></script>
<script src='javascript/JZZ.synth.Tiny.js'></script>
<script><!--
JZZ.synth.Tiny()
   .note(0, 'C5', 127, 500).wait(500)
   .note(0, 'E5', 127, 500).wait(500)
   .note(0, 'G5', 127, 500).wait(500)
   .note(0, 'C6', 127, 500);
--></script>
```

See the [**demo**](https://jazz-soft.github.io/modules/tiny).

## JZZ.input.Qwerty

A wrapper for the [**Qwerty-Hancock**](https://github.com/stuartmemo/qwerty-hancock) keyboard.

![windows](https://jazz-soft.github.io/img/windows.jpg)
![mocos](https://jazz-soft.github.io/img/macos.jpg)
![linux](https://jazz-soft.github.io/img/linux.jpg)

Works wherewer the mouse and keyboard inputs are available.

[![qwerty](https://jazz-soft.github.io/img/qwerty.png)](https://jazz-soft.github.io/modules/qwerty)

##### Example

```html
<script src='javascript/JZZ.js'></script>
<script src='javascript/qwerty-hancock.js'></script>
<script src='javascript/JZZ.input.Qwerty'></script>
...
<div id='qwerty'> here comes the piano! </div>
...
<script><!--
JZZ.input.Qwerty({id:'qwerty', width:281, height:150, octaves:1, startNote:'C4'})
   .connect(JZZ().openMidiOut());
--></script>
```

See the [**demo**](https://jazz-soft.github.io/modules/qwerty).

## JZZ.input.Kbd

Universal HTML keyboard for your MIDI projects.

![windows](https://jazz-soft.github.io/img/windows.jpg)
![mocos](https://jazz-soft.github.io/img/macos.jpg)
![linux](https://jazz-soft.github.io/img/linux.jpg)
![ios](https://jazz-soft.github.io/img/ios.jpg)
![android](https://jazz-soft.github.io/img/android.jpg)

Mouse and multitouch support.
Custom styles.
Ready for responsive design.

(moved to **https://github.com/jazz-soft/JZZ-input-Kbd**)

[![kbd](https://jazz-soft.github.io/img/kbds.png)](https://jazz-soft.github.io/modules/kbd)

##### Example

```html
<script src='javascript/JZZ.js'></script>
<script src='javascript/JZZ.input.Kbd'></script>
...
<script><!--
JZZ.input.Kbd().connect(JZZ().openMidiOut());
--></script>
```

See the [**demo**](https://jazz-soft.github.io/modules/kbd).

## JZZ.input.ASCII

ASCII keyboard as MIDI input.

![windows](https://jazz-soft.github.io/img/windows.jpg)
![mocos](https://jazz-soft.github.io/img/macos.jpg)
![linux](https://jazz-soft.github.io/img/linux.jpg)

Can be connected to [**JZZ.input.Kbd**](#jzzinputkbd) to enable both keyboard and mouse/touch input.

(moved to **https://github.com/jazz-soft/JZZ-input-Kbd**)

##### Example

```html
<script src='javascript/JZZ.js'></script>
<script src='javascript/JZZ.input.ASCII'></script>
...
<script><!--
JZZ.input.ASCII({
     //  S D   G H J
     // Z X C V B N M
     Z:'C5', S:'C#5', X:'D5', D:'D#5', C:'E5', V:'F5',
     G:'F#5', B:'G5', H:'Ab5', N:'A5', J:'Bb5', M:'B5'
   }).connect(JZZ().openMidiOut());
--></script>
```

See the [**demo**](https://jazz-soft.github.io/modules/ascii).

## JZZ.input.Knobs

Pitch-bend, modulation, and other knobs for your virtual instrument.

![windows](https://jazz-soft.github.io/img/windows.jpg)
![mocos](https://jazz-soft.github.io/img/macos.jpg)
![linux](https://jazz-soft.github.io/img/linux.jpg)
![ios](https://jazz-soft.github.io/img/ios.jpg)
![android](https://jazz-soft.github.io/img/android.jpg)

Mouse and multitouch.
Custom styles.
Responsive design friendly.
Perfect to use together with [**JZZ.input.Kbd**](#jzzinputkbd)...

(moved to **https://github.com/jazz-soft/JZZ-input-Kbd**)

[![knobs](https://jazz-soft.github.io/img/knobs.png)](https://jazz-soft.github.io/modules/knobs)

##### Example

```html
<script src='javascript/JZZ.js'></script>
<script src='javascript/JZZ.input.Knobs'></script>
...
<script><!--
JZZ.input.Slider({data:'pitch'}).connect(JZZ().openMidiOut());
JZZ.input.Pad({dataX:'mod', dataY:'volume'}).connect(JZZ().openMidiOut());
--></script>
```

See the [**demo**](https://jazz-soft.github.io/modules/knobs).

[**How to create your own modules for JZZ.js**](https://jazz-soft.net/doc/JZZ/modules.html)
