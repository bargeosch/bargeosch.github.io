const puzzleBoard = document.querySelector('#puzzle')
const solveButton = document.querySelector('#solve-button')
const resetButton = document.querySelector('#reset-button');
const solutionDisplay = document.querySelector('#solution')
const squares = 81
const submission = []
let dataString = '';
let keyThing = '';
greyInputs = [0,1,2,9,10,11,18,19,20,6,7,8,15,16,17,24,25,26,30,31,32,39,40,41,48,49,50,54,55,56,63,64,65,72,73,74,60,61,62,69,70,71,78,79,80];

for (let i = 0; i < squares; i++) {
    const inputElement = document.createElement('input')
    inputElement.setAttribute('type', 'number')
    inputElement.setAttribute('min', '1')
    inputElement.setAttribute('max', '9')
    if (greyInputs.includes(i)) {
        inputElement.classList.add('odd-section')
    }




    puzzleBoard.appendChild(inputElement)
}

const joinValues = () => {

    let p = submission.length;

    for (i = 0; i < p; i++ ) {
        submission.pop();
    }

    const inputs2 = document.querySelectorAll('input')
    inputs2.forEach(input => {
        if (input.value) {
            submission.push(input.value)
        } else {
            submission.push('0')  // Do I need a zero here???
        }
    })
    dataString = '{"input":[' +  submission.toString() +  ']}';
} 

const populateValues = (response) => {
    const inputs = document.querySelectorAll('input')
    inputs.forEach((input, i) => {
        input.value = response.answer[i]
    })
    solutionDisplay.innerHTML = "This is the solution."

}

function loadJsonFile() {

    var xmlhttp = new XMLHttpRequest();
    var url = "thing.json";    
    
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        keyThing = JSON.parse(this.responseText);
        loadedJsonFile = "true";
      }
      if (this.readyState == 4 && this.status == 404) {
        solutionDisplay.innerHTML = "CAN'T LOAD JSON FILE.  FATAL."
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

} // End function loadJsonFile()



const solve = () => {

    solutionDisplay.innerHTML = "This takes several seconds. Please wait."
  
    // Barry should try (JavaScript) fetch from rapidapi. different from video.

    // import axios from "axios"; Barry dont need see HTML.

    joinValues()
    const data = submission.join('')
    
    const options = {
      method: 'POST',
      url: 'https://sudoku-solver3.p.rapidapi.com/sudokusolver/',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'sudoku-solver3.p.rapidapi.com',
        'X-RapidAPI-Key': keyThing.thingee
      },
      //data: '{"input":[0,0,8,9,0,0,4,0,0,0,0,5,6,0,0,0,0,0,3,0,0,7,0,0,6,0,9,5,0,0,0,0,4,0,2,0,0,0,0,0,0,0,0,6,5,0,0,2,0,0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,8,9,0,0,0,7,0,4,0,0,2,0,0]}'
      data: dataString
    };
    
    axios.request(options).then(function (response) {

        populateValues(response.data)
    }).catch(function (error) {
        console.error(error);

        solutionDisplay.innerHTML = "This is not solvable."
    });    


}


function resetPuzzle() {
    const inputs1 = document.querySelectorAll('input')
    inputs1.forEach((input, i) => {
        input.value = 0;
    })
    solutionDisplay.innerHTML = "Puzzle is reset."
}

solveButton.addEventListener('click', solve)
resetButton.addEventListener('click', resetPuzzle);

loadJsonFile();





