var ison = false;

var slider1 = document.getElementById("myRange1");
var output1 = document.getElementById("demo1");
output1.innerHTML = slider1.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider1.oninput = function() {
    output1.innerHTML = this.value;
    if(ison){
        gainNode.gain.value = .1 * (document.getElementById("myRange1").value / 50) * (document.getElementById("myRange2").value / 50);
        gainNode.gain.value = .1 * (document.getElementById("myRange1").value / 50) * ((100 - document.getElementById("myRange2").value) / 50);
    }
}

var slider2 = document.getElementById("myRange2");
var output2 = document.getElementById("demo2");

// Update the current slider value (each time you drag the slider handle)
slider2.oninput = function() {
    output2.innerHTML = (100 - this.value) + ' | ' + this.value;
    if(ison){
        gainNode.gain.value = .1 * (document.getElementById("myRange1").value / 50) * (document.getElementById("myRange2").value / 50);
        gainNode.gain.value = .1 * (document.getElementById("myRange1").value / 50) * ((100 - document.getElementById("myRange2").value) / 50);
    }
}

var contextClass = (window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
window.msAudioContext);

if (contextClass) {
    // Web Audio API is available.
    var context = new contextClass();
}
var oscs = {sine:0, square:1, sawtooth:2, triangle:3 };
var oscOn = function(){ //freq, volume, balance, waveform
    var form = document.getElementsByName("waveform");
    for (var i = 0; i < form.length; i++){
        if(form[i].checked){
            form_value = form[i].value;
        }
    }
    merger = context.createChannelMerger(2);

    oscillator1 = context.createOscillator();
    oscillator1.type = form_value;
    oscillator1.frequency.value = parseFloat(document.getElementById("freq").value);
    gainNode = context.createGain ? context.createGain() : context.createGainNode();
    oscillator1.connect(gainNode,0,0);
    // gainNode.connect(context.destination,0,0);
    gainNode.gain.value = .1 * (document.getElementById("myRange1").value / 50) * (document.getElementById("myRange2").value / 50);
    oscillator1.start ? oscillator1.start(0) : oscillator1.noteOn(0)

    gainNode.connect(merger,0,1);

    oscillator2 = context.createOscillator();
    oscillator2.type = form_value;
    oscillator2.frequency.value = parseFloat(document.getElementById("freq").value);
    gainNode = context.createGain ? context.createGain() : context.createGainNode();
    oscillator2.connect(gainNode);
    // gainNode.connect(context.destination,0,1);

    gainNode.gain.value = .1 * (document.getElementById("myRange1").value / 50) * ((100 - document.getElementById("myRange2").value) / 50);
    oscillator2.start ? oscillator2.start(0) : oscillator2.noteOn(0)

    gainNode.connect(merger,0,0);

    merger.connect(context.destination);


};

function start() {
    if (typeof oscillator1 != 'undefined') oscillator1.disconnect();
    if (typeof oscillator2 != 'undefined') oscillator2.disconnect();
    oscOn();
    ison = true;
}

function stop() {
    oscillator1.disconnect();
    oscillator2.disconnect();
    ison = false;
}