const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

// Animation State
let multiplier = 1.0;
let targetMultiplier = 1.0;
let animationRunning = false;
let animationStartTime = null;

// Smooth Animation Timing
const SMOOTH_ANIMATION_DURATION = 200;

// Draw Grid
function drawGrid() {
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 4]);

    for (let i = 1; i <= 10; i++) {
        // Horizontal
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - i * 40);
        ctx.lineTo(canvas.width, canvas.height - i * 40);
        ctx.stroke();

        // Vertical
        ctx.beginPath();
        ctx.moveTo(i * 60, 0);
        ctx.lineTo(i * 60, canvas.height);
        ctx.stroke();
    }

    ctx.setLineDash([]);
}

// Draw Multiplier
function drawMultiplier(currentMultiplier) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    ctx.font = "36px Arial";
    ctx.fillStyle = "#FFF";
    ctx.textAlign = "center";
    ctx.fillText(`${currentMultiplier.toFixed(2)}x`, canvas.width / 2, canvas.height / 2);
}

// Animation Loop
function updateCanvas(timestamp) {
    if (!animationRunning) return;

    if (!animationStartTime) {
        animationStartTime = timestamp;
    }

    const elapsed = timestamp - animationStartTime;

    if (elapsed < SMOOTH_ANIMATION_DURATION) {
        const progress = elapsed / SMOOTH_ANIMATION_DURATION;
        multiplier = multiplier + (targetMultiplier - multiplier) * progress;
        drawMultiplier(multiplier);
        requestAnimationFrame(updateCanvas);
    } else {
        multiplier = targetMultiplier;
        animationStartTime = null;
        drawMultiplier(multiplier);
    }
}

// WebSocket Logic
const wsProtocol = location.protocol === "https:" ? "wss://" : "ws://";
const ws = new WebSocket(`${wsProtocol}${location.hostname}:${location.port || 3000}`);
const currentMultiplierDisplay = document.getElementById("currentMultiplier");

ws.onopen = () => {
    console.log("WebSocket connection established.");
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.event) {
        case "waiting":
            animationRunning = false;
            multiplier = 1.0;
            targetMultiplier = 1.0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            currentMultiplierDisplay.innerText = `STARTING IN ${data.countdown}s`;
            break;

        case "game_start":
            animationRunning = true;
            multiplier = 1.0;
            targetMultiplier = 1.0;
            currentMultiplierDisplay.innerText = "1.00x";
            drawMultiplier(multiplier);
            break;

        case "progress":
            targetMultiplier = parseFloat(data.multiplier);
            if (!animationRunning) {
                animationRunning = true;
                requestAnimationFrame(updateCanvas);
            }
            break;

        case "crash":
            animationRunning = false;
            drawMultiplier(parseFloat(data.multiplier));
            currentMultiplierDisplay.innerText = `BUSTED @ ${data.multiplier}x`;
            break;

        default:
            console.log("Unknown event:", data);
    }
};

// Initialize Grid
drawGrid();
