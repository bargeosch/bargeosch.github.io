/*
4/14/2022

Use the following:

    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowBlur = 10;

    Use these colors:
    rgb(255, 255, 0)    yellow
    rgb(64, 255, 0)     green

    And a gray gradient.

*/

// Audio Analyzer stuff -----------------------------------------------------------------
let audioA = new Audio('Alt Flow.mp3');
let audioSource = null;
let analyser;
let dataArray;
let bufferLength;
// 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768. Defaults to 2048.
const num = 256;                         //  Change to determine the number of bars.
audioAEnded = false;


// Canvas 1 stuff -----------------------------------------------------------------------
var canvas1;
var ctx1;
const particlesArray = [];
var interval1;

// Canvas 2 stuff -----------------------------------------------------------------------
var canvas2;
var ctx2;
var sides;



// Particles only drawn on canvas1.
class Particle {
    constructor() {
        this.x = Math.floor(Math.random() * canvas1.width);
        this.y = Math.floor(Math.random() * canvas1.height);
        this.grd = null;
    }
    updateCenter() {
        // Call this for resize event when everything is updated.
        this.x = Math.floor(Math.random() * canvas1.width);
        this.y = Math.floor(Math.random() * canvas1.height);
    }
    draw(i) {
        // i is the index of the partical array.  Do I need this???
        this.grd = ctx1.createLinearGradient(
            this.x - i/2,              //The x-coordinate of the start point of the gradient
            this.y - i/2,              //The y-coordinate of the start point of the gradient
            this.x + i/2,              //The x-coordinate of the end point of the gradient
            this.y + i/2);             //The y-coordinate of the end point of the gradient
        this.grd.addColorStop(0, "rgb(30, 30, 30)");
        this.grd.addColorStop(1, "rgb(250, 250, 250)");

        ctx1.shadowBlur = 5;
        //ctx1.shadowColor = 'rgb(64, 255, 0)'; // Green
        ctx1.shadowColor = 'rgb(0, 0, 0)';
        ctx1.shadowOffsetX = 5;
        ctx1.shadowOffsetX = 5;
        ctx1.fillStyle = this.grd;
        //ctx1.fillStyle = 'rgb(64, 64, 64)';
        ctx1.beginPath();
        ctx1.arc(this.x, this.y, i/2, 0, Math.PI * 2);
        ctx1.fill();
    }
}; // End class Particle

window.addEventListener('load', function(){
    // Called automatically after page resources are loaded.  Drives the main process.
    initializeAudio();
    initializeCanvas1();

    // canvas settings
    // The ctx2 shadow settings seem to have no effect.  ctx1 overrides them.
    ctx2.shadowColor = 'rgb(0, 0, 0)';
    ctx2.shadowOffsetX = 5;
    ctx2.shadowOffsetX = 5;
    ctx2.fillStyle = 'green';
    ctx2.strokeStyle = 'rgb(0, 255, 0)';
    ctx2.lineWidth = 35;
    ctx2.lineCap = 'round';
    sides = dataArray.length;
    


    audioA.play();
    animate1();
    //interval1 = setInterval(animate1, 375);



}); // End window.addEventListener('load', function()

window.addEventListener('resize', function(){
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].updateCenter();
    }  
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height); 
    
    ctx2.shadowColor = 'rgb(0, 0, 0)';
    ctx2.shadowOffsetX = 5;
    ctx2.shadowOffsetX = 5;
    ctx2.fillStyle = 'green';
    ctx2.strokeStyle = 'rgb(0, 255, 0)';
    ctx2.lineWidth = 35;
    ctx2.lineCap = 'round';
 


});



function initializeCanvas1() {
    canvas1 = document.getElementById('canvas1');
    ctx1 = canvas1.getContext('2d');
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;

    // Load the particle array.  One particle for each audio bar.
    for (let i = 0; i < dataArray.length; i++) {
        particlesArray.push(new Particle());
    }

    canvas2 = document.getElementById('canvas2');
    ctx2 = canvas1.getContext('2d');
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;


} // End initializeCanvas1()


function initializeAudio() {
    // Hook up the audio anlyzer on audioA 
    if (audioSource == null) {
        const audioContext = new AudioContext();
        audioSource = audioContext.createMediaElementSource(audioA);
        analyser = audioContext.createAnalyser();
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = num;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }

} // End initializeAudio()


audioA.onended = function() {
    audioAEnded = true;
}

function animate1() {
    if (audioAEnded) {
        ctx1.clearRect(0,0,canvas1.width, canvas1.height);
        ctx1.fillStyle = 'rgba(0,0,0,0.2)';
        ctx1.fillRect(0,0,canvas.width, canvas.height);
        return;
    }
    ctx1.clearRect(0,0,canvas1.width, canvas1.height);
    analyser.getByteFrequencyData(dataArray);
    
    for (let i = 0; i < particlesArray.length; i+=1) {
        particlesArray[i].draw(dataArray[i]);
    }

    drawCanvas2();
    
    requestAnimationFrame(animate1);
}

function drawCanvas2() {
    
    ctx2.fillStyle = 'rgba(0,0,0,0.0)';
    ctx2.fillRect(0,0,canvas2.width, canvas2.height);
    x1 = canvas2.width/2;
    y1 = canvas2.height/2;

    ctx2.save();
    ctx2.translate(x1,y1);
    ctx2.rotate(0);

    for (let i = 0; i < sides; i++) {
        
        ctx2.beginPath();
        ctx2.moveTo(0,0);
        x2 = dataArray[i] * .6;
        y2 = -25
        x3 = dataArray[i] * 1.3;
        y3 = 38;
        x4 = dataArray[i] * 2;
        y4 = 0
        ctx2.bezierCurveTo(x2, y2, x3, y3, x4, y4);
        ctx2.stroke();
        ctx2.rotate((Math.PI * 2)/(sides/2.5)); // Uses radians. 3.14 radians is half circle.
    }
    ctx2.restore();



} // End function drawCanvas2()