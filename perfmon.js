//  btw snoot if you read this i dont know if this'll work on terb
const cpuDisplay = document.getElementById('cpu');
const memDisplay = document.getElementById('mem');
const fpsDisplay = document.getElementById('fps');

const cpuGraph = document.getElementById('cpuGraph').getContext('2d');
const memGraph = document.getElementById('memGraph').getContext('2d');
const fpsGraph = document.getElementById('fpsGraph').getContext('2d');

let cpuData = [];
let memData = [];
let fpsData = [];

let lastFrameTime = performance.now();
let frames = 0;
let fps = 0;

function drawGraph(ctx, data, color) {
ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
ctx.strokeStyle = color;
ctx.beginPath();
data.forEach((val, i) => {
const x = (i / (data.length - 1)) * ctx.canvas.width;
const y = ctx.canvas.height - (val / 100) * ctx.canvas.height;
if (i === 0) ctx.moveTo(x, y);
else ctx.lineTo(x, y);
});
ctx.stroke();
}

function fpsLoop(now) {
frames++;
if (now - lastFrameTime >= 1000) {
fps = frames;
fpsDisplay.textContent = fps;
fpsData.push(Math.min(100, fps));
if (fpsData.length > 50) fpsData.shift();
drawGraph(fpsGraph, fpsData, '#0f0');
frames = 0;
lastFrameTime = now;
}
requestAnimationFrame(fpsLoop);
}
requestAnimationFrame(fpsLoop);

function getCPUUsage() {
const start = performance.now();
for (let i = 0; i < 500000; i++) { Math.sqrt(i); }
const duration = performance.now() - start;
const cpuLoad = Math.min(100, ((duration / 16) * 100));
cpuDisplay.textContent = cpuLoad.toFixed(1);
cpuData.push(cpuLoad);
if (cpuData.length > 50) cpuData.shift();
drawGraph(cpuGraph, cpuData, '#0f0');
}

function getMemoryUsage() {
if (performance.memory) {
const usedMB = performance.memory.usedJSHeapSize / 1048576;
memDisplay.textContent = usedMB.toFixed(1);
const memPercent = Math.min(100, (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100);
memData.push(memPercent);
if (memData.length > 50) memData.shift();
drawGraph(memGraph, memData, '#0f0');
} else {
memDisplay.textContent = "N/A";
}
}

setInterval(() => {
getCPUUsage();
getMemoryUsage();
}, 1000);