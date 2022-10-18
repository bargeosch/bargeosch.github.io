/*
Barry Schwartzkopf  6/10/2021

6/11/2021 Cookie logic is done.  Still need to add logic to update states and set the cookie. 
          Next time implement the play logic. 

DONE
6/12/2021 Next time complete the play mode logic.  Give wInput the focus.  Then this logic:
          'User presses Key to Guess a Letter'.  
DONE          
6/21/2021 Next time - Add the 'Check to see if the user has won:' 
          logic at the bottom of function processLetterGuess(letter)

6/22/2021 Next - replace the current menu.  
          I dont like how the functionality changes when the input field has the focus.

4/3/2022  Added keyboard.

*/

/* Clue and Puzzle data read from server file. */
var puzzleArr;

/* Ids for HTML elements */
var emodes;
var ewHint;
var epClue;
var epScore;
var ewPuzzle;
var epPuzzle;
//var ewInput;
var ebPlayAgain;
var ewHowTo;
var ewStats;
var etotScore;
var epuzCompleted;
var ecorLetters;
var ewrongLetters;
var etotLetters;
var erank;
var ewKb;
var epMessage;

/* Various working fields */

var usedString  = ""; // Just a string.  Not an array of strings.
var clueString;
var puzzleString;
var displayString = [""];  // Establish as an array.
displayString.length = 0;
var currentScore;
var letter;

/* Object for game statistics.  This object will be stored in the cookie. */

var stats = {
  totScore: 0,
  puzCompleted: 0,
  correctLetters: 0,
  wrongLetters: 0,
};

/* Cookie name.  */
var cname = "wguess";  

var kbBlocked = false;

function onloadFunctionW() {
    console.log("onloadFunctionW()");

    // Load the JSON deata file containing the clue and puzzle data.
    // Use an AJAX XMLHttpRequest to retrieve the JSON file.
    // https://www.w3schools.com/js/tryit.asp?filename=tryjson_http
    // https://www.w3schools.com/js/js_json_http.asp
    

    var xmlhttp = new XMLHttpRequest();
    var url = "puzzle.json";
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        puzzleArr = JSON.parse(this.responseText);
        //console.log("  puzzleArr[9].clue   = " + puzzleArr[9].clue);
        //console.log("  puzzleArr[9].puzzle = " + puzzleArr[9].puzzle);
        getElements();
        checkCookie();
        playMode();
      } else {
        // Can't do this here.  xmlhttp.onreadystatechange must be called several times for different states.
        // alert("No puzzles available.  You can't play Word Guess.  Sorry.");
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

} // End function onloadFunctionW()

function getElements() {
    console.log("getElements()");

    emodes = document.getElementById('modes');
    ewHint = document.getElementById('wHint');
    epClue = document.getElementById('pClue');
    epScore = document.getElementById('pScore');
    ewPuzzle = document.getElementById('wPuzzle');
    ewKb = document.getElementById('kb');
    epPuzzle = document.getElementById('pPuzzle');
    //ewInput = document.getElementById('wInput');
    ebPlayAgain = document.getElementById('bPlayAgain');
    ewHowTo = document.getElementById('wHowTo');
    ewStats = document.getElementById('wStats');
    etotScore = document.getElementById('totScore');
    epuzCompleted = document.getElementById('puzCompleted');
    ecorLetters = document.getElementById('corLetters');
    ewrongLetters = document.getElementById('wrongLetters');
    etotLetters = document.getElementById('totLetters');
    erank = document.getElementById('rank');
    ebresetStats = document.getElementById('bresetStats');
    epMessage = document.getElementById('pMessage');
} // End function getElements() 

/* Cookie Functions.  */

function setCookie(cname,cstats,exdays) {
  console.log("setCookie(cname,cstats,exdays)");
  console.log("  cstats = " + JSON.stringify(cstats));
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  var cvalue = JSON.stringify(cstats);
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}  // End function setCookie(cname,cstats,exdays)

function getCookie(cname) {
  console.log("getCookie(cname)");
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {  // Eliminating leading spaces (?)
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}  // End function getCookie(cname)

function checkCookie() {
  console.log("checkCookie()");
  var tempStat = getCookie(cname);
  console.log("  tempStat= " + tempStat);
  if (tempStat != "") {
    stats = JSON.parse(tempStat);
  } else {
    setCookie(cname, stats, 2);
  }
} // End function checkCookie()

// Called from <select name="modes" id="modes" onclick="modeFunction()">
function modeFunction(smode) {
  console.log("modeFunction(smode) - " + smode);
  // ewInput.blur(); 
  //ewInput.blur();
  if (smode == "play") {
    playMode();
  }
  if (smode == "stats") {
    statsMode();
  }
  if (smode == "how") {
    howMode();
  }

} // End function modeFunction()

function playMode() {
  console.log("playMode()");
  epMessage.innerHTML = ". ";
  kbBlocked = false;

  /*
  Alert the user if all the available puzzle are completed.  Prevents out of bounds on puzzleArr.
  */

  if (stats.puzCompleted >= puzzleArr.length) {
    //alert("There are no more puzzles to solve.  Reset the stats if you want to replay.");
    document.getElementById('noMore').innerHTML = "There are no more puzzles to solve.  Reset the stats if you want to replay.";
    statsMode();
    return;
  }

  /* Hide and Show the correct elements for play mode.  */
  ewHint.style.display = "block";
  ewPuzzle.style.display = "block";
  ewKb.style.display = "block";
  //ewInput.style.display = "inline";
  ewHowTo.style.display = "none";
  ewStats.style.display = "none";
  ebPlayAgain.style.display = "none";
  ebresetStats.style.display = "none"; 

  /*
  Need to identify if a puzle is in progress and return right here.
  */

  if (usedString.length > 0 ) {
  //  ewInput.value = "";  
  //  ewInput.focus(); // Allow user input and hopefully trigger virtual keyboard on mobile devices.
    return;
  }

  usedString = "";   // do I always want to do this?  What if the user clicks how to in middle of a puzzle?
  currentScore = 0;  // do I always want to do this?  What if the user clicks how to in middle of a puzzle?
  displayString.length = 0;
  epClue.innerHTML = puzzleArr[stats.puzCompleted].clue;
  epScore.innerHTML = "SCORE: " + currentScore;

  /* Create a DISPLAY string based on PUZZLE where every character A – Z is replaced with an underscore. */
  var tempStr = puzzleArr[stats.puzCompleted].puzzle.toUpperCase();
  console.log("  puzzleArr[stats.puzCompleted].puzzle = " + puzzleArr[stats.puzCompleted].puzzle);
  console.log("  tempStr = " + tempStr);
  puzzleString = tempStr.split("");
  console.log("  puzzleString = " + puzzleString);
  var i;
  var tempTxt = "";
  

  for (i = 0; i < puzzleString.length; i++ ) {
    if (puzzleString[i] >= "A" && puzzleString[i] <= "Z" ) {
      displayString.push("_");
      tempTxt += "_";
    } else {
      displayString.push(puzzleString[i]);
      tempTxt += puzzleString[i];
    }
  }

  // The shift() method removes the first array element and "shifts" all other elements to a lower index.
  //displayString.shift();
  console.log("  displayString = " + displayString);
  epPuzzle.innerHTML = tempTxt;

  //ewInput.value = "";  
  //ewInput.focus(); // Allow user input and hopefully trigger virtual keyboard on mobile devices.

} // End function playMode()

// Used to be called letterGuess().  I changed this for virtual keyboard I added.
function kbPressed(char) {
  // The user must press enter for this function to be executed.
  console.log("kbPressed(char)");
  if (kbBlocked == true) {return;}

  epMessage.innerHTML = ". ";
  

  //ewInput.blur(); // Take focus away from input field. Hopefully to limit input to a single character.
  console.log("  kbPressed = " + char);

  if (char >= "a" && char <= "z" ) {
    letter = char.toUpperCase();
  } else {
    letter = char;
  }

  if (letter >= "A" && letter <= "Z" ) {
    processLetterGuess(letter);
  } else {
    char = "";
    alert("You must enter a letter.  Characters A through Z.  Thanks.");
    //ewInput.focus();
  }
}  // End function letterGuess()

function processLetterGuess(letter) {
  console.log("processLetterGuess(letter) " + letter);
  //ewInput.value = "";

  /*
  Check the USED string to see if the letter 
  has already been entered.  If yes alert user and exit loop.  
  If no add letter to USED and continue.
  */
  var n = usedString.search(letter);
  if (n == -1) {  // Letter has NOT been guessed yet.
    usedString = usedString + letter;
    console.log("  usedString = " + usedString);
  } else {
    //alert("You already guessed this letter: " + letter);
    epMessage.innerHTML = "You already guessed this letter: " + letter;
    //ewInput.focus();
    return;
  }

  /*
  Check to see if the letter exists in the PUZZLE string.  If yes:
  Add 1 to correctLetters
  Add 30 to the user’s score for each time the letter occurs.
  Update the DISPLAY string to replace the underscore with the 
  letter at the same position it occurs in the PUZZLE string.
  */

  var bletter = true;
  for (i = 0; i < puzzleString.length; i++ ) {
    if (puzzleString[i] == letter) {
      displayString[i] = letter;
      stats.correctLetters += 1;
      currentScore += 30;
      epScore.innerHTML = "SCORE: " + currentScore;
      bletter = false;
    } // End if.
  } // End for loop.

  /*
  If the letter does not exist in the PUZZLE string alert 
  the user and add -10 to his score.  Add 1 to incorrectLetters.
  */

  if (bletter == true) {
    currentScore -= 10;
    epScore.innerHTML = "SCORE: " + currentScore;
    stats.wrongLetters += 1;
    //alert("SORRY - this letter is not in the puzzle: " + letter);
    epMessage.innerHTML = "SORRY - this letter is not in the puzzle: " + letter;
  }  // End if.

  /*
  Display the updated puzzle.
  */
  tempTxt = "";
  for (i = 0; i < displayString.length; i++ ) {
    tempTxt += displayString[i]; 
  } // End for
  epPuzzle.innerHTML = tempTxt;

  /*
  Check to see if the puzzled is solved.
  Check to see if the user has won:  
  If all letters revealed alert user he Won.
  Add 1 to puzzlesPlayed.
  Save stats.
  Display bPlayAgain button
  */

  console.log("  tempTxt = " + tempTxt);
  n = tempTxt.search("_");
  if (n == -1) {  // All the letters found.  Puzzled solved.
    epPuzzle.innerHTML = tempTxt;
    console.log("  Puzzled solved " );
    stats.puzCompleted += 1;
    stats.totScore += currentScore;
    setCookie(cname, stats, 2);
    usedString = "";
    //ewInput.style.display = "none"; // Prevents user from entering letters after puzzle is solved.
    ebPlayAgain.style.display = "inline";
    setTimeout(function(){
      //alert("Congratulations!  You solved the puzzle with a score of " + currentScore + "!!!");
      epMessage.innerHTML = "Congratulations!  You solved the puzzle with a score of " + currentScore + "!!!";
      kbBlocked = true;
    }, 500);
  
  } else {
    //ewInput.focus();
  }


  //ewInput.focus(); // This should always be the last instruction.  Unles the puzzle is complete. (?)
} // End function processLetterGuess()

function statsMode() {
  ebPlayAgain.style.display = "none";
  //ewInput.blur();
  ewHint.style.display = "none";
  ewPuzzle.style.display = "none";
  ewKb.style.display = "none";
  ewHowTo.style.display = "none";
  ewStats.style.display = "block";
  ebresetStats.style.display = "inline";

  etotScore.innerHTML = stats.totScore;
  epuzCompleted.innerHTML = stats.puzCompleted;
  ecorLetters.innerHTML = stats.correctLetters;
  ewrongLetters.innerHTML = stats.wrongLetters;
  etotLetters.innerHTML = stats.correctLetters + stats.wrongLetters;
  erank.innerHTML = "To be determined... ";
}  // End function statsMode()

function resetStats() {
  usedString = "";
  stats.totScore = 0;
  stats.puzCompleted = 0;
  stats.correctLetters = 0;
  stats.wrongLetters = 0;
  setCookie(cname, stats, 2);
  statsMode();
} // function resetStats()

function howMode() {
  ebPlayAgain.style.display = "none";
  //ewInput.blur();
  ewHint.style.display = "none";
  ewPuzzle.style.display = "none";
  ewKb.style.display = "none";
  ewStats.style.display = "none";
  ewHowTo.style.display = "block";
} // End function howMode() 