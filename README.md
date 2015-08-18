# JZZ-modules

Additional modules for [**JZZ.js**](https://github.com/jazz-soft/JZZ)

## JZZ.synth.MIDIjs

Create a custom MIDI-Out port using [**MIDI.js**](https://github.com/mudcube/MIDI.js) library.

##### Example

    <script src='javascript/JZZ.js'></script>
    <script src='javascript/MIDI.js'></script>
    <script src='javascript/JZZ.synth.MIDIjs.js'></script>
    <script><!--
    JZZ.synth.MIDIjs('MIDI.js', { soundfontUrl: "./soundfont/", instrument: "acoustic_grand_piano" })
       .note(0, 'C5', 127, 500).wait(500)
       .note(0, 'E5', 127, 500).wait(500)
       .note(0, 'G5', 127, 500).wait(500)
       .note(0, 'C6', 127, 500);
    --></script>

See the [**demo**](http://jazz-soft.github.io/modules/midijs).

## JZZ.synth.OSC

Create a custom MIDI-Out port implemented via Web Audio AudioContext.oscillator.

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

See the [**demo**](http://jazz-soft.github.io/modules/osc).

### More modules are coming soon...

[**How to create your own modules for JZZ.js**](http://jazz-soft.net/doc/JZZ/modules.html)