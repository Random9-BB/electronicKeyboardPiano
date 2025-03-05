const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const reverbControl = document.getElementById("reverb");
const chorusControl = document.getElementById("chorus");
const delayControl = document.getElementById("delay");
const flangerControl = document.getElementById("flanger");

const keyMap = {
    'q': 'C4',  '2': 'C#4', 'w': 'D4',  '3': 'D#4',
    'e': 'E4',  'r': 'F4',  '5': 'F#4', 't': 'G4',
    '6': 'G#4', 'y': 'A4',  '7': 'A#4', 'u': 'B4',
    'i': 'C5',  '9': 'C#5', 'o': 'D5',  '0': 'D#5',
    'p': 'E5'    
};


let activeOscillators = {};


function playNote(note) {
    if (activeOscillators[note]) return;

    const match = note.match(/^([A-G]#?)(\d)$/);
    if (!match) return;

    const [_, pitch, octave] = match;

    const noteOrder = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    const noteIndex = noteOrder.indexOf(pitch);
    const semitoneOffset = (parseInt(octave) - 4) * 12 + (noteIndex - 9);

    const frequency = 440 * Math.pow(2, semitoneOffset / 12);

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.frequency.value = frequency;
    const real = new Float32Array([0, 1, 0, 0.2, 0]);
    const imag = new Float32Array(real.length);
    const wave = audioContext.createPeriodicWave(real, imag);
    oscillator.setPeriodicWave(wave);


    gainNode.gain.value = 0.5;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    activeOscillators[note] = oscillator;
}


function stopNote(note) {
    if (activeOscillators[note]) {
        activeOscillators[note].stop();
        delete activeOscillators[note];
    }
}

document.addEventListener("keydown", (event) => {
    const note = keyMap[event.key.toLowerCase()];
    if (note) handleKeyPress(note);
});

document.addEventListener("keyup", (event) => {
    const note = keyMap[event.key.toLowerCase()];
    if (note) handleKeyRelease(note);
});

function handleKeyPress(note) {
    playNote(note);
    highlightKey(note);
}

function handleKeyRelease(note) {
    stopNote(note);
    removeHighlight(note);
}

function highlightKey(note) {
    const keyElement = document.querySelector(`.key[data-note="${note}"]`);
    if (keyElement) {
        keyElement.classList.add('active');
    }
}

function removeHighlight(note) {
    const keyElement = document.querySelector(`.key[data-note="${note}"]`);
    if (keyElement) {
        keyElement.classList.remove('active');
    }
}

createPiano();
