// --- POMODORO TIMER LOGIC ---
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isRunning = false;
let currentMode = 25; // default 25 mins

// Grab DOM Elements for Timer
const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeButtons = document.querySelectorAll('.mode-btn');

// Helper function to format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update the display on screen and in browser tab title
function updateDisplay() {
    const formattedTime = formatTime(timeLeft);
    timeDisplay.textContent = formattedTime;
    document.title = `${formattedTime} - NeuroSpace`;
}

// Start Timer
startBtn.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        // Run every 1000ms (1 second)
        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                // Timer finished
                clearInterval(timerId);
                isRunning = false;
                playAlarm();
                alert("Time is up! Great focus session.");
            }
        }, 1000);
    }
});

// Pause Timer
pauseBtn.addEventListener('click', () => {
    clearInterval(timerId);
    isRunning = false;
});

// Reset Timer to current mode's default time
resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    isRunning = false;
    timeLeft = currentMode * 60;
    updateDisplay();
});

// Handle Study Mode Selection
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove 'active' class from all mode buttons
        modeButtons.forEach(b => b.classList.remove('active'));
        // Add 'active' class to the clicked button
        btn.classList.add('active');
        
        // Update timer based on selected mode
        currentMode = parseInt(btn.getAttribute('data-time'));
        timeLeft = currentMode * 60;
        updateDisplay();
        
        // Pause timer if it was running
        clearInterval(timerId);
        isRunning = false;
    });
});

// Play a simple alarm beep using Web Audio API when time is up
function playAlarm() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
    
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);
}

// --- AMBIENT SOUND LOGIC ---
// In a real application, these buttons would trigger HTML5 Audio playback.
// For this frontend demo, we simulate the UI interaction.
const soundButtons = document.querySelectorAll('.sound-btn');

soundButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Toggle play/pause visual state
        if (btn.classList.contains('playing')) {
            btn.classList.remove('playing');
        } else {
            // Optional: Remove playing class from others if you only want 1 sound at a time
            // soundButtons.forEach(b => b.classList.remove('playing'));
            
            btn.classList.add('playing');
        }
    });
});

// --- AI MOTIVATIONAL QUOTES LOGIC ---
// Array of inspirational quotes
const quotes = [
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
    { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" }
];

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');

// Add smooth transition for fading quotes
quoteText.style.transition = "opacity 0.3s ease";
quoteAuthor.style.transition = "opacity 0.3s ease";

newQuoteBtn.addEventListener('click', () => {
    // Fade out
    quoteText.style.opacity = 0;
    quoteAuthor.style.opacity = 0;
    
    // Wait for fade out to finish, then change text and fade back in
    setTimeout(() => {
        const randomIdx = Math.floor(Math.random() * quotes.length);
        const q = quotes[randomIdx];
        
        quoteText.textContent = `"${q.text}"`;
        quoteAuthor.textContent = `- ${q.author}`;
        
        // Fade in
        quoteText.style.opacity = 1;
        quoteAuthor.style.opacity = 1;
    }, 300);
});

// Initialize the display on page load
updateDisplay();
