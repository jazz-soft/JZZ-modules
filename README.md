# JZZ-modules

Additional modules for [**JZZ.js**](https://github.com/jazz-soft/JZZ)

## JZZ.synth.MIDIjs

Create a custom MIDI-Out port using [**MIDI.js**](https://github.com/mudcube/MIDI.js) library.

[![windows](http://jazz-soft.github.io/img/windows.jpg)](https://jazz-soft.github.io/modules/midijs)
[![mocos](http://jazz-soft.github.io/img/macos.jpg)](https://jazz-soft.github.io/modules/midijs)
[![linux](http://jazz-soft.github.io/img/linux.jpg)](https://jazz-soft.github.io/modules/midijs)
[![android](http://jazz-soft.github.io/img/android.jpg)](https://jazz-soft.github.io/modules/midijs)

##### Example

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

See the [**demo**](https://jazz-soft.github.io/modules/midijs).

## JZZ.synth.Timbre

A wrapper for the [**Timbre.js**](https://github.com/mohayonao/timbre.js) T("PluckGen")/T("OscGen")/T("SynthDef") synths.

[![windows](http://jazz-soft.github.io/img/windows.jpg)](https://jazz-soft.github.io/modules/timbre)
[![mocos](http://jazz-soft.github.io/img/macos.jpg)](https://jazz-soft.github.io/modules/timbre)
[![linux](http://jazz-soft.github.io/img/linux.jpg)](https://jazz-soft.github.io/modules/timbre)
[![android](http://jazz-soft.github.io/img/android.jpg)](https://jazz-soft.github.io/modules/timbre)

(Unlike advertized, does not seem to work in IE9 and some other browsers)

##### Example

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

See the [**demo**](https://jazz-soft.github.io/modules/timbre).

## JZZ.synth.OSC

Create a custom MIDI-Out port implemented via Web Audio AudioContext.oscillator.

[![windows](http://jazz-soft.github.io/img/windows.jpg)](https://jazz-soft.github.io/modules/osc)
[![mocos](http://jazz-soft.github.io/img/macos.jpg)](https://jazz-soft.github.io/modules/osc)
[![linux](http://jazz-soft.github.io/img/linux.jpg)](https://jazz-soft.github.io/modules/osc)
[![ios](http://jazz-soft.github.io/img/ios.jpg)](https://jazz-soft.github.io/modules/osc)
[![android](http://jazz-soft.github.io/img/android.jpg)](https://jazz-soft.github.io/modules/osc)

##### Example

    <script src='javascript/JZZ.js'></script>
    <script src='javascript/JZZ.synth.OSC.js'></script>
    <script><!--
    JZZ.synth.OSC()
       .note(0, 'C5', 127, 500).wait(500)
       .note(0, 'E5', 127, 500).wait(500)
       .note(0, 'G5', 127, 500).wait(500)
       .note(0, 'C6', 127, 500);
    --></script>

See the [**demo**](https://jazz-soft.github.io/modules/osc).

## JZZ.input.Qwerty

A wrapper for the [**Qwerty-Hancock**](https://github.com/stuartmemo/qwerty-hancock) keyboard.

[![windows](http://jazz-soft.github.io/img/windows.jpg)](https://jazz-soft.github.io/modules/qwerty)
[![mocos](http://jazz-soft.github.io/img/macos.jpg)](https://jazz-soft.github.io/modules/qwerty)
[![linux](http://jazz-soft.github.io/img/linux.jpg)](https://jazz-soft.github.io/modules/qwerty)

Works wherewer the mouse and keyboard inputs are available.

[![qwerty](http://jazz-soft.github.io/img/qwerty.png)](https://jazz-soft.github.io/modules/qwerty)

##### Example

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

See the [**demo**](https://jazz-soft.github.io/modules/qwerty).

## JZZ.input.Kbd

Universal HTML keyboard for your MIDI projects.

[![windows](http://jazz-soft.github.io/img/windows.jpg)](https://jazz-soft.github.io/modules/kbd)
[![mocos](http://jazz-soft.github.io/img/macos.jpg)](https://jazz-soft.github.io/modules/kbd)
[![linux](http://jazz-soft.github.io/img/linux.jpg)](https://jazz-soft.github.io/modules/kbd)
[![ios](http://jazz-soft.github.io/img/ios.jpg)](https://jazz-soft.github.io/modules/kbd)
[![android](http://jazz-soft.github.io/img/android.jpg)](https://jazz-soft.github.io/modules/kbd)

Mouse and multitouch support.
Custom styles.
Ready for responsive design.

[![kbd](http://jazz-soft.github.io/img/kbds.png)](https://jazz-soft.github.io/modules/kbd)

##### Example

    <script src='javascript/JZZ.js'></script>
    <script src='javascript/JZZ.input.Kbd'></script>
    ...
    <script><!--
    JZZ.input.Kbd().connect(JZZ().openMidiOut());
    --></script>

See the [**demo**](https://jazz-soft.github.io/modules/kbd).

## JZZ.input.ASCII

ASCII keyboard as MIDI input.

[![windows](http://jazz-soft.github.io/img/windows.jpg)](https://jazz-soft.github.io/modules/ascii)
[![mocos](http://jazz-soft.github.io/img/macos.jpg)](https://jazz-soft.github.io/modules/ascii)
[![linux](http://jazz-soft.github.io/img/linux.jpg)](https://jazz-soft.github.io/modules/ascii)

Can be connected to JZZ.input.Kbd to enable both keyboard and mouse/touch input.

##### Example

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

See the [**demo**](https://jazz-soft.github.io/modules/ascii).


### More modules are coming soon...

[**How to create your own modules for JZZ.js**](http://jazz-soft.net/doc/JZZ/modules.html)