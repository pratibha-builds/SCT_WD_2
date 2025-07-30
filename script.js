document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const display = document.querySelector('.display');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapBtn = document.getElementById('lapBtn');
    const lapsList = document.getElementById('lapsList');
    const lapCountDisplay = document.getElementById('lapCount');
    const currentLapDisplay = document.getElementById('currentLapTime');
    
    // State variables
    let startTime;
    let elapsedTimeBeforePause = 0;
    let timerInterval;
    let isRunning = false;
    let laps = [];
    let lastLapTime = 0;
    let isFirstLap = true;

    // Format time as HH:MM:SS.mm
    function formatTime(ms) {
        const date = new Date(ms);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        const milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    // Get current elapsed time
    function getCurrentTime() {
        return isRunning ? elapsedTimeBeforePause + (Date.now() - startTime) : elapsedTimeBeforePause;
    }

    // Update all displays
    function updateDisplays() {
        const currentTime = getCurrentTime();
        display.textContent = formatTime(currentTime);
        
        // Update current lap display
        const currentLapTime = isFirstLap ? currentTime : currentTime - lastLapTime;
        currentLapDisplay.textContent = formatTime(currentLapTime);
    }

    // Start the stopwatch
    function startTimer() {
        if (!isRunning) {
            startTime = Date.now();
            timerInterval = setInterval(updateDisplays, 10);
            isRunning = true;
            
            // Enable/disable buttons
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
            lapBtn.disabled = false;
        }
    }

    // Pause the stopwatch
    function pauseTimer() {
        if (isRunning) {
            elapsedTimeBeforePause += Date.now() - startTime;
            clearInterval(timerInterval);
            isRunning = false;
            
            // Enable/disable buttons
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            // Keep lap and reset buttons enabled
        }
    }

    // Reset the stopwatch
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        elapsedTimeBeforePause = 0;
        laps = [];
        lastLapTime = 0;
        isFirstLap = true;
        
        // Update displays
        display.textContent = '00:00:00.00';
        lapsList.innerHTML = '';
        lapCountDisplay.textContent = '0';
        currentLapDisplay.textContent = '00:00:00.00';
        
        // Enable/disable buttons
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        lapBtn.disabled = true;
    }

    // Record a lap time (works when running OR paused)
    function recordLap() {
        const currentTime = getCurrentTime();
        let lapDuration;
        
        if (isFirstLap) {
            lapDuration = currentTime;
            isFirstLap = false;
        } else {
            lapDuration = currentTime - lastLapTime;
        }
        
        lastLapTime = currentTime;
        
        const lapData = {
            number: laps.length + 1,
            duration: lapDuration,
            totalTime: currentTime
        };
        
        laps.push(lapData);
        renderLap(lapData);
        
        // Update lap count
        lapCountDisplay.textContent = laps.length;
        
        // Update current lap display to start new lap
        currentLapDisplay.textContent = '00:00:00.00';
    }

    // Render a lap to the DOM
    function renderLap(lap) {
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lap.number}</span>
            <div class="lap-times">
                <span class="lap-duration">${formatTime(lap.duration)}</span>
                <span class="lap-time">Total: ${formatTime(lap.totalTime)}</span>
            </div>
        `;
        lapsList.prepend(lapItem);
    }

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', recordLap);
});