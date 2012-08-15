var envelope = {
    attack: 0.1, // in seconds
    decay:  0.1, // in seconds
    sustain:0.5, // amplitude (between 0 and 1)
    release:0.3  // in seconds
};

var frequency = 100; // in Hertz
var period = 1; // in Seconds

var noteTime = 0, envelopeTime;

var context = new webkitAudioContext();
var osc = context.createOscillator();
var oscGain = context.createGainNode();
osc.connect(oscGain);
oscGain.connect(context.destination);

osc.frequency.value = frequency;
oscGain.gain.value = 0;
osc.noteOn(0);

function sustainTime(){
    return period - envelope.attack - envelope.decay - envelope.release;
}

function schedule(){
    while (noteTime < context.currentTime + 0.200) {
        envelopeTime = noteTime;
        oscGain.gain.linearRampToValueAtTime(0, envelopeTime);
        envelopeTime += envelope.attack;
        oscGain.gain.linearRampToValueAtTime(1, envelopeTime);
        envelopeTime += envelope.decay;
        oscGain.gain.linearRampToValueAtTime(envelope.sustain, envelopeTime);
        envelopeTime += sustainTime();
        oscGain.gain.linearRampToValueAtTime(envelope.sustain, envelopeTime);
        envelopeTime += envelope.release;
        oscGain.gain.linearRampToValueAtTime(0, envelopeTime);
        noteTime += period;
    }
    setTimeout(schedule, 30);
}
schedule();



var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");


function drawEnvelope(){
    
    var totalTime = envelope.attack + envelope.decay + sustainTime() + envelope.release;
    var x, y, elapsedTime = 0;
    c.beginPath();
    
    // Starting point
    x = 0;
    y = canvas.height;
    c.moveTo(x,y);
    
    // Attack
    elapsedTime += envelope.attack;
    x = canvas.width * (elapsedTime / totalTime);
    y = 0;
    c.lineTo(x,y);
    
    // Decay
    elapsedTime += envelope.decay;
    x = canvas.width * (elapsedTime / totalTime);
    y = canvas.height * (1 - envelope.sustain);
    c.lineTo(x,y);
    
    // Sustain
    elapsedTime += sustainTime();
    x = canvas.width * (elapsedTime / totalTime);
    y = canvas.height * (1 - envelope.sustain);
    c.lineTo(x,y);
    
    // Release
    elapsedTime += envelope.release;
    x = canvas.width * (elapsedTime / totalTime);
    y = canvas.height;
    c.lineTo(x,y);
    
    c.stroke();
}
drawEnvelope();



function setEnvelope(newEnvelope){
    envelope = newEnvelope;
    c.clearRect(0,0,canvas.width, canvas.height);
    drawEnvelope();
}
//setEnvelope({attack: 0.01,decay: 0.1,sustain:0.5,release:0.3})