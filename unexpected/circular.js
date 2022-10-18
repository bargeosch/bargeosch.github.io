/*
3/29/2022
https://youtu.be/raXW5J1Te7Y  
How to Code: Circular Motion

The top portion of this script is for the circular particles animation.
See below for the audio visual portion.

This is my first visualizer using more than one canvas.  There are two canvases stacked on top of each other.

*/

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particlesArray = [];
var mouseX = 0;
var mouseY = 0;


/* Resize listener prevents the rectangle from being
stretched if the window is resized.
*/
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].reSize();
    }  
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;  

});





canvas.addEventListener('click', function(event){
    mouseX = event.x;
    mouseY = event.y;
});

canvas.addEventListener('mousemove', function(event){
    mouseX = event.x;
    mouseY = event.y;
});

class Particle {
    constructor(x, y, radius, color) {
        //this.color = color;
        //this.hue = Math.random() * 360;
        this.hue = 246;
        
        this.color 
        this.x1 = x;   // Center of circle
        this.y1 = y;   // Center of circle
        this.x = x;
        this.y = y;
        this.size = radius;
        this.radians = 0;
        this.velocity = Math.random() *.03 + .01;
        //this.velocity = Math.floor(Math.random() * (.06 - .04) + .04);
        this.xMove = Math.floor(Math.random() * (canvas.width/2 - (canvas.width/4)) ) + (canvas.width/7);
        this.yMove = Math.floor(Math.random() * (canvas.height/2 - (canvas.height/4)) ) + (canvas.height/7);
        
    }
    update() {
        // Move points over time.
        //Uncomment to move with mouse.
        //this.x1 = mouseX;
        //this.y1 = mouseY;
        this.radians += this.velocity;
        this.x = this.x1 + Math.cos(this.radians) * this.xMove;
        this.y = this.y1 + Math.sin(this.radians) * this.yMove;
    }
    draw(){
    //ctx.fillStyle = this.color;
    ctx.fillStyle = 'hsl(' + this.hue + ',100%, 50%)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    }

    reSize() {
        this.x1 = canvas.width/2;    // Center of circle
        this.y1 = canvas.height/2;   // Center of circle
        this.xMove = Math.floor(Math.random() * (canvas.width/2 - (canvas.width/4)) ) + (canvas.width/7);
        this.yMove = Math.floor(Math.random() * (canvas.height/2 - (canvas.height/4)) ) + (canvas.height/7);
    }
}

function init() {
    for (let i = 0; i < 300; i++) {
        particlesArray.push(new Particle(
            canvas.width/2,
            canvas.height/2,
            9,
            'blue'
        ));
    }
}
init();

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
}

function animate() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}
animate();


/********************************************************************************************* 
 3/31/2022
 This section is for the audio visual portion.
 Plan is to have two canvases - one on top of the other.

 
 
***********************************************************************************************/

const canvas2 = document.getElementById('canvas2');
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
const ctx2 = canvas2.getContext('2d');
let hue2 = 0;


//  Audio Analyzer stull.   *******************************************************************

let audioA = new Audio('Unexpected.wav');
let audioSource = null;
let analyser;
let dataArray;
let bufferLength;
// 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768. Defaults to 2048.
const num = 512;                         //  Change to determine the number of bars.
audioAEnded = false;

function setUpAnalyzer() {
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

} // End function setUpAnalyzer ()


setUpAnalyzer();
audioA.play();

audioA.onended = function() {
    audioAEnded = true;
}

function animateA() {
    if (audioAEnded) {
        return;
    }
    analyser.getByteFrequencyData(dataArray);
    drawVisualiser();
    requestAnimationFrame(animateA);
} // End function animate() 

function drawVisualiser() {
    ctx2.clearRect(0,0,canvas2.width, canvas2.height);
    ctx2.fillStyle = 'rgba(0,0,0,0.0)';
    ctx2.fillRect(0,0,canvas2.width, canvas2.height);
    let x1 = 0;
    let y1 = canvas.height/2;
    let x2 = 0;
    let y2 = canvas.height/2;
    ctx2.strokeStyle = 'yellow';
    ctx2.lineWidth = 3;
    spacer = canvas2.width/dataArray.length;

    for (let i = 0; i < dataArray.length; i++) {
        x1 = x2;
        y1 = y2;
        x2 = x2 + spacer;
        y2 = (canvas.height/2) - (dataArray[i]);
        ctx2.beginPath();
        // ctx2.moveTo(x1, y1);
        // ctx2.lineTo(x2, y2);
        // ctx2.stroke();
        ctx2.beginPath();
        ctx2.moveTo(x1+1, y1);
        ctx2.lineTo(x2+3, y2+(dataArray[i]*.2));
        ctx2.stroke();


    } // End for loop.


}  // End function drawVisualiser().

animateA();