'use strict';

const TIMER_TICK = 100;    // in milliseconds
let mainTimer = null;

let numRows = -1;
let numCols = -1;

const BACKCOLOR = 'black';
const TEXTCOLOR = "lime"; // bright possible green, 00ff00

let letterWidth = -1;
let letterHeight = -1;

let arrayOfCols = [];

// animation data
let arrayColSpeeds = [];
let animationCounter = 0;

function getRandomChar() {
    // const charRange = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charRange = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return charRange.charAt(Math.floor(Math.random() * charRange.length))
}

function initLetterGrid() {
    for (let c = 0; c < numCols ; ++c) {
        let thisCol = [];
        for (let r = 0; r < numRows; ++r) {
            thisCol.push(getRandomChar());
        }
        arrayOfCols.push(thisCol);
    }
}

function initCanvasAndDoMeasurements() {
    let ctx = document.getElementById("mainCanvas").getContext("2d");
    ctx.font = "20pt Kristen ITC";  // TODO: need better font
    ctx.textAlign = "center";
    
    letterWidth = ctx.measureText('M').width;
    
    letterHeight = letterWidth; // CONSIDER figure out less hacky height measurement
    letterHeight = Math.floor(letterHeight) + 1; // round off, so that vertical animation is smooth

    numRows = (ctx.canvas.height / letterHeight);
    numCols = (ctx.canvas.width / letterWidth);

    for (let c = 0; c < numCols ; ++c) {
        arrayColSpeeds[c] = Math.floor((letterHeight / 5) + (Math.random() * (letterHeight / 4)));
    }
}

function drawBackground() {
    let ctx = document.getElementById("mainCanvas").getContext("2d");
    ctx.fillStyle = BACKCOLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawLetters() {
    let ctx = document.getElementById("mainCanvas").getContext("2d");
    ctx.fillStyle = TEXTCOLOR;

    for (let c = 0; c < numCols ; ++c) {
        for (let r = 0; r < numRows; ++r) {
            let verticalOffset = (arrayColSpeeds[c] * animationCounter) % letterHeight;
            ctx.fillText(arrayOfCols[c][r], c * letterWidth, r * letterHeight + verticalOffset);
        }
    }
}

function onTimer() {
    drawBackground();
    drawLetters();
    ++animationCounter;
    if (animationCounter > 1000000) animationCounter = 0;   // lazily avoid overflow
}

function resizeCanvas() {

    let canvas = document.getElementById("mainCanvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    initCanvasAndDoMeasurements();
    initLetterGrid();
}

window.onload = () => {

    // resize the canvas to fit the window...
    resizeCanvas();
    // ...and attach a listener to redo it if the window is resized
    window.addEventListener('resize', resizeCanvas, false);

    mainTimer = window.setInterval(onTimer, TIMER_TICK);
}
