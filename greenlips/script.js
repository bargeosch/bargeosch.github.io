/*
11/07/2021 Started coding.
11/11/2021 DONE Load the json file from onloadFunction().  When done set flag to true.
11/11/2021 Completed text build of selector div and calling loadsong function.  Works with one song in json file.
    These are done:
    buildSelectorDiv();
    displaySelectorDiv();
11/13/2021 loadTalkingArray(), loadDancingArray() and onloadFunction() are complete.
11/16/2021 function loadSong(x) plays audio correctly.  Analyzer is hooked up.
11/30/2021 Animations are working.  
    NEXT TIME: Create additional presentations - maybe 3 - and add them to the json file.  Test mulitple selections.
    Need to resolve design issue - see startPresentation() Function - Start Button clicked.
12/03/2021 - I may be all done.  Everything seems to work.  Need to create lots more content.
    NEXT TIME: Create the small png files and add the media query to detect phone screens.    



*/

// Canvas and audio fields.

const canvas = document.getElementById('canvas1');
canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;
canvas.height = 430;
const ctx = canvas.getContext('2d');
let audioA = new Audio();
let audioB = new Audio();
let audioSource = null;
let analyser;
let dataArray;
let bufferLength;
// 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768. Defaults to 2048.
const num = 32;                         //  Change to determine the number of bars.
audioAEnded = false;
audioBEnded = false;

// Here are the div's in the html.
let divWait = document.getElementById("wait");
let divReady = document.getElementById("ready");
let divEnd = document.getElementById("end");
let divFace = document.getElementById("face");
let divSpokenText = document.getElementById("spokenText");
let divSelector = document.getElementById("selector");

// Flags to track if all resources are loaded.  If all are true then presentations can start once user selects one.
let loadInterval;  // Used to track if all resources are loaded.
let loadedJsonFile        = false;
let loadedSelectionDiv    = false;
let loadedTalkingArray    = false; 
let loadedDancingArray    = false;
let loadCounter = 0;
let loadChecks = 0;  // If loadStatus() is called 6 times then there is some serious issue and we should tell user.
let graphicsFolder = "graphics";   // Need to check screen size and set this to the correct folder for small or large png files.

// These variables control setting the index into the sprite arrays for the animation:
let dInterval;
let dIndex = 0;  // Dancing array.
let tIndex = 0;  // Talking array.

 
// Data structure for song data.  Created from json file.
class Script{
    constructor() {
        this.title = "none";
        this.audioA = "none";
        this.audioB = "none";
        this.BMP = 0;
        this.spokenText = "none";
        this.created = null;
        this.release = null;
    }
}
let scriptArray = [];
let talkArray = [];      // Contains sprites of talking face.
let danceArray = [];     // Contains sprites of dancing face.

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;
    canvas.height = 430;
});



function onloadFunction() {
    /*  
    Executed once web page has completely loaded.  Will do additional set up and load resources here.
    */

    // Display the loading div and hide all the other divs.
    divWait.style.display = "block";
    divReady.style.display = "none";
    divEnd.style.display = "none";
    divFace.style.display = "none";
    divSpokenText.style.display = "none";
    divSelector.style.display = "none";

    // Start a setInterval() method to track status of resource loading.
    loadInterval = setInterval(loadStatus, 250);

    // Load the JSON file that contains the song information.  Creates scriptArray[]. Sets loadedJsonFile to true.
    loadJsonFile();

    // Load the talking sprites into array.  Sets loadedTalkingArray to true.
    loadTalkingArray();

    // Load the dancing sprites into array.  Sets loadedDancingArray to true.
    loadDancingArray();


} // End function onloadFunction()

function loadStatus() {
    // Called from onloadFunction().  Will check to see if all resources are loaded and update the wait screen progress indicator.
    loadCounter = 0;
    if (loadedJsonFile) {loadCounter++;}
    if (loadedSelectionDiv) {loadCounter++;}
    if (loadedTalkingArray) {loadCounter++;}
    if (loadedDancingArray) {loadCounter++;}
    loadChecks++;

    if (loadCounter > 3) {
        clearInterval(loadInterval);
        document.getElementById("progress1").innerHTML = "Load Complete."
        displayReadyDiv();
    } else {
        document.getElementById("progress1").innerHTML = "Working " + loadChecks;
    }

    // Everything should be loaded by 3 seconds.  If not inform user.  Webpaged failed.
    if (loadChecks > 12 && loadCounter < 4) {
        clearInterval(loadInterval);
        document.getElementById("progress1").innerHTML = "Very sorry.  This webpage has failed.  Please try again tomorrow.";
        document.getElementById("h1Wait").innerHTML = "OH NO - FAILURE";
        document.getElementById("h2Wait").innerHTML = "What a DRAG!";
    }


} // End function loadStatus()


function startPresentation() {
    /*
    11/13/2021 BArry - not sure what this will do.  I may not even need this.
            Follow the Google docs design.  Maybe.  
            I should check to see if a song is booked marked and just play it.
            Else go straight to the select screen.
    Triggerred from the START button on the ready screen.  This function should execute init() function.
    */
    displaySelectorDiv();


} // End function startPresentation()

function loadJsonFile() {
    // Loads the json file that contains the presentation data.  Creates the script array of song data.

    // Load the JSON data file containing the song data.
    // Use an AJAX XMLHttpRequest to retrieve the JSON file.
    // https://www.w3schools.com/js/tryit.asp?filename=tryjson_http
    // https://www.w3schools.com/js/js_json_http.asp

    var xmlhttp = new XMLHttpRequest();
    var url = "json/song.json";    // This is the name of the JSON file contining the song scrxipts.
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        scriptArray = JSON.parse(this.responseText);
        loadedJsonFile = "true";
        buildSelectorDiv();
        // TEMP <<<< This may not go here.  Just for testing the selector div temporarily.
        // displaySelectorDiv();
      }
      if (this.readyState == 4 && this.status == 404) {
        displayError("Data File NOT Available");
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

} // End function loadJsonFile()

function displayError(message) {
    // Load process is stopped.
    clearInterval(loadInterval);
    // Display the loading div and hide all the other divs.
    divWait.style.display = "block";
    divReady.style.display = "none";
    divEnd.style.display = "none";
    divFace.style.display = "none";
    divSpokenText.style.display = "none";
    divSelector.style.display = "none";
    document.getElementById("progress1").innerHTML = message;
    document.getElementById("h1Wait").innerHTML = "OH NO - FAILURE";
    document.getElementById("h2Wait").innerHTML = "Please try again tomorrow.";


} // End function displayError(message)

function buildSelectorDiv() {
    let todayDate = new Date(); // Today's date. 
    

    let tempText = "<p>This website makes noise.<br>Please Select a Presentation by Clicking:</p>";
    // Loop through the scriptArray building a button for each script..
    for (let i = 0; i < scriptArray.length; i++)  {

        if (todayDate >= new Date(scriptArray[i].release)) {
            tempText = tempText + '<h2 id=sel' + i + ' onclick="loadSong(' + i +
            ')">' +
            scriptArray[i].title +
            '</h2>';
        }
         
    } // End for loop

    //tempText = tempText + '<button onclick="loadSong(0)">title</button>';    
    
    divSelector.innerHTML = tempText;
    loadedSelectionDiv = true;

} // End function buildSelectorDiv()


function displaySelectorDiv() {
        // Display the select div and hide all the other divs.
        divWait.style.display = "none";
        divReady.style.display = "none";
        divEnd.style.display = "none";
        divFace.style.display = "none";
        divSpokenText.style.display = "none";
        divSelector.style.display = "block";
    

} // End function displaySelectorDiv()

function loadTalkingArray() {
    let spritesLoaded = 0;
    for (let i = 0; i < 10; i++) {
        talkArray.push(new Image());
        talkArray[i].src = graphicsFolder + '/s' + i + '.png';
    
        talkArray[i].addEventListener('load', function(){
            spritesLoaded++;
            if (spritesLoaded > 9) {
                loadedTalkingArray = true;
            }
            
        });
    }
} // End function loadTalkingArray()

function loadDancingArray() {
    let spritesLoaded = 0;
    for (let i = 0; i < 8; i++) {
        danceArray.push(new Image());
        danceArray[i].src = graphicsFolder + '/d' + i + '.png';
    
        danceArray[i].addEventListener('load', function(){
            spritesLoaded++;
            if (spritesLoaded > 7) {
                loadedDancingArray = true;
            }
            
        });
    }
} // End function loadDancingArray()

function displayReadyDiv() {
    divWait.style.display = "none";
    divReady.style.display = "block";
    divEnd.style.display = "none";
    divFace.style.display = "none";
    divSpokenText.style.display = "none";
    divSelector.style.display = "none";
} // End function displayReadyDiv()



function loadSong(x) {
    // x is the index into the scriptArray for the selected presentation.


    // Pause whatever is currently playing.
    audioA.pause();
    audioA.currentTime = 0;
    audioB.pause();
    audioB.currentTime = 0;
    
    let temp1 = "sel" + x;
    document.getElementById(temp1).style.color = "black";
    document.getElementById(temp1).style.textShadow = "2px 2px 2px rgb(255, 0, 255)";

    // Load the mp3 files.
    audioA.src = "audio/" + scriptArray[x].audioA;
    audioB.src = "audio/" + scriptArray[x].audioB;

    // Hook up the audio anlyzer on audioA that will drive the face animation.
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

    // Display the talking and text divs only.

    divWait.style.display = "none";
    divReady.style.display = "none";
    divEnd.style.display = "none";
    divFace.style.display = "block";
    divSpokenText.style.display = "block";
    divSelector.style.display = "none";

    divSpokenText.innerHTML = scriptArray[x].spokenText;


    // Start the animations and play the audio.
    audioAEnded = false;
    audioBEnded = false;

    setTimeout(function(){
        dInterval = setInterval(setDIndex, (60000/scriptArray[x].BMP)/4);
        animate();
        audioA.play();
        audioAEnded = false;
        audioB.play();
        audioBEnded = false;
    }, 20);

} // End function loadSong(x)

function setDIndex() {
    if (dIndex < (danceArray.length - 1)) {
        dIndex++;
    } else {
        dIndex = 0;
    }

} // End function setDIndex() 

audioA.onended = function() {
    audioAEnded = true;
}

audioB.onended = function() {
    audioBEnded = true;
}

function animate() {
    if (audioAEnded && audioBEnded) {
        clearInterval(dInterval);
        displaySelectorDiv();
        return;
    }
    analyser.getByteFrequencyData(dataArray);
    drawVisualiser();
    requestAnimationFrame(animate);
} // End function animate() 

function drawVisualiser() {

    let k = 5;  // This is the band to drive the talking sprites.  May change this value.

    let sX = (canvas.width/2) - (talkArray[0].width/2);
    let sY = 8;
    // let sY = (canvas.height/2) - (danceArray[0].height/4);

    ctx.clearRect(0,0,canvas.width, canvas.height);

    if (dataArray[k] == 0) {
        sX = Math.round((canvas.width/2) - (danceArray[dIndex].width/2));
        ctx.drawImage(danceArray[dIndex], sX, sY);
    }

    if (dataArray[k] > 0) {
        tIndex = Math.round(dataArray[k]/25);
        if (tIndex >= talkArray.length) {
            tIndex = talkArray.length - 1;
        }
        ctx.drawImage(talkArray[tIndex], sX, sY);
    }

} // End function drawVisualiser()


function stopPresentation() {
    // This function is called when the user clicks on the face when a presentation is in progress.
    // means the user wants to stop the current presentation and start a new one.
    audioA.pause();
    audioB.pause();
    audioAEnded = true;
    audioBEnded = true;
    displaySelectorDiv();

} // End function stopPresentation()
