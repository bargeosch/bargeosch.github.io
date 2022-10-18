/*
8/29/2021   Barry
Visualization for Mad Girls Love Song - Sylvia Plath.  S2021 08 24.

*/

const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;
let audio1 = new Audio('Mad Girls Love Song - Sylvia Plath.wav');
let imagesLoaded = 0;
let songEnded = false;
const imageArray = [];
loadImages();

// Set up audio components for visualization.
let audioSource;
let analyser;
let dataArray;
let bufferLength;
// 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768. Defaults to 2048.
const elemCount = 256;                         //  Change to determine the number of spirals.

var x;
var di = 0;  // Index into dataArray.  used by all spiralArray[] elements.
const spriralArray = [];




/* 
Resize listener prevents the rectangle from being
stretched if the window is resized.
*/
window.addEventListener('resize', function(){
    canvas.width = 1280;
    canvas.height = 720;
    

});

container.addEventListener('click', function() {
    // Need to click on the screen after setting fullscreen to start animation.  For screen recording.
    audio1.play();

    // Set up audio stuff.
    const audioContext = new AudioContext();
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = elemCount;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);


    if (imagesLoaded > 4) {
        init();
     }   


}); // End container.addEventListener('click', function()

function init() {
    songEnded = false;

    let pat = .002;
    let colorhue = 5;
    for (let i = 0; i < elemCount; i++) {
        spriralArray.push(new Spiral(pat, colorhue));
        pat += .001;
        colorhue += 5;
    }

    animate();
}

function loadImages() {
    imagesLoaded = 5;

    // for (i = 0; i < 5; i++) {
    //     imageArray.push(new Image());
    //     imageArray[i].src = 'monkey' + i + '.png';
    
    //     imageArray[i].addEventListener('load', function(){
    //         imagesLoaded++;
    //     });
    // }   

}

audio1.onended = function() {
    songEnded = true;
    ctx.clearRect(0,0,canvas.width, canvas.height);

    var n = canvas.width / 2;
    var m = canvas.height / 2;

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.font = '35px "Ink Free"';
    ctx.textAlign = 'center';
    ctx.fillText('THANKS FOR WATCHING - Please like and subscribe.', n+2, m+2); 


    ctx.fillStyle = 'white';
    ctx.font = '35px "Ink Free"';
    ctx.textAlign = 'center';
    ctx.fillText('THANKS FOR WATCHING - Please like and subscribe.', n, m); 
}



function animate() {
    if (songEnded) {return;}

    ctx.clearRect(0,0,canvas.width, canvas.height);


    timeVar = audio1.currentTime;  // use this to trigger display of verse png's.  See Monkey Brains js for example code.

    x = 0;    
    
    analyser.getByteFrequencyData(dataArray);
    
    // Draw spirals here.

    for (let i = 0; i < spriralArray.length; i += 1) {
        spriralArray[i].drawSpiral(dataArray[i]/1.5);
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = 'white';
    ctx.font = '18px "Ink Free"';
    ctx.fillText('Mad Girls Love Song - Music by QWiRL, Poem by Sylvia Plath', 65, 65);

    requestAnimationFrame(animate);
}

class Spiral {
    constructor(p, h) { 
        // Origin point.
        this.oX = canvas.width/2;
        this.oY = canvas.height/2;
        this.pattern = p;   // Number between 0 and 1.  Increment slowly by .0001 or something.
        this.number = 0;
        this.scale = 30;
        this.hue = h;
        this.angle = 0;
        this.positionX = 0;
        this.positionY = 0;
        this.radius = 0;
    }
    drawSpiral(freq) {
        this.number = 0;
        for (let i = 0; i < freq; i++) {
            this.angle = this.number * this.pattern;  // Change last number for different shapes.
            this.radius = this.scale * Math.sqrt(this.number); // To increase very slowly.
            this.positionX = this.radius * Math.sin(this.angle) + canvas.width/2;
            this.positionY = this.radius * Math.cos(this.angle) + canvas.height/2;

            ctx.fillStyle = 'hsl(' + this.hue + ', 100%, 50%)';
            ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, 50%)';
            //ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(this.oX, this.oY);
            ctx.lineTo(this.positionX, this.positionY);
            //ctx.arc(positionX, positionY, number, 0, Math.PI *2);
            //ctx.fill();
            ctx.stroke();
            ctx.closePath();
            this.number++;
        }

    }
}