const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const reverbControl = document.getElementById("reverb");
const chorusControl = document.getElementById("chorus");
const delayControl = document.getElementById("delay");
const flangerControl = document.getElementById("flanger");

function createPiano() {
    const piano = document.getElementById("piano");
    const notes = ["C", "D", "E", "F", "G", "A", "B"];
    notes.forEach(note => {
        const key = document.createElement("div");
        key.classList.add("key");
        key.textContent = note;
        key.addEventListener("mousedown", () => playNote(note));
        key.addEventListener("mouseup", () => stopNote());
        piano.appendChild(key);
    });
}

function playNote(note) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.frequency.value = 440 * Math.pow(2, ("CDEFGAB".indexOf(note) - 9) / 12);
    oscillator.type = "sine";
    
    let delay = audioContext.createDelay();
    let feedbackGain = audioContext.createGain();
    let flanger = audioContext.createGain();

    delay.delayTime.value = delayControl.value * 0.5;
    feedbackGain.gain.value = 0.5;
    gainNode.gain.value = 0.5;
    
    oscillator.connect(gainNode);
    gainNode.connect(delay);
    delay.connect(feedbackGain);
    feedbackGain.connect(delay);
    feedbackGain.connect(audioContext.destination);
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 500);
}

function stopNote() {
    // Stop playing the note
}

createPiano();
