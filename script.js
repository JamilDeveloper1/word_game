let nextWord = document.querySelector(".nextWord"); 
let startBtn = document.querySelector(".startBtn");
let timeSpan = document.querySelector(".timeSpan");
let show_word = document.querySelector(".show_word");
let letters = document.querySelector(".letters_grid"); 
let showHint = document.querySelector(".showHint");
let scoreDisplay = document.querySelector(".score"); 
let hintContainer = document.querySelector(".hint_container");
let closeHint = document.querySelector(".fa-circle-xmark");
let howBtn = document.querySelector(".how"); 
let closeInfo = document.querySelector(".closeInfo"); 

let info = document.querySelector(".info"); 


const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');


let index = 0; 
let timer = null;
let score = 0;
let words = []; 

async function fetchWords() {
    try {
        const response = await fetch('datas.json'); 
        if (!response.ok) throw new Error('Network response was not ok');
        words = await response.json();
        updateWordDisplay(); 
    } catch (error) {
        console.error('Error', error);
    }
}

function initializeLetters() {
    alphabet.forEach(letter => {
        let button = document.createElement('button');
        button.className = 'letterBtn';
        button.value = letter;
        button.innerText = letter;
        button.disabled = true; 
        button.style.opacity = '.5'; 
        button.style.cursor = 'auto';
        button.addEventListener('click', handleLetterClick);
        letters.appendChild(button);
    });
}

function enableLetters() {
    document.querySelectorAll('.letterBtn').forEach(button => {
        button.disabled = false; 
        button.style.opacity = '1'; 
        button.style.cursor = 'pointer';
    });
}

function resetButtonColors() {
    document.querySelectorAll('.letterBtn').forEach(button => {
        button.classList.remove('correct', 'incorrect');
        button.disabled = false; 
        button.style.opacity = '1'; 
        button.style.cursor = 'pointer';
    });
}

function updateWordDisplay() {
    if (words.length === 0) return; 
    show_word.innerHTML = words[index].name.split('').map(() => '<div class="lil_box"></div>').join(' ');
}

function handleLetterClick(event) {
    const letter = event.target.value;
    let currentWord = words[index].name;
    let displayedWord = show_word.querySelectorAll('.lil_box');

    let correctGuess = false;
    let incorrectGuess = true;

    for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i] === letter) {
            displayedWord[i].innerText = letter;
            correctGuess = true;
            incorrectGuess = false;
        }
    }

    if (correctGuess) {
        event.target.classList.add('correct');
        score += 10; 
    } else if (incorrectGuess) {
        event.target.classList.add('incorrect');
        score -= 10; 
    }

    event.target.disabled = true; 
    updateScoreDisplay();
    checkIfWordComplete();
}

function checkIfWordComplete() {
    let currentWord = words[index].name;
    let displayedWord = Array.from(show_word.querySelectorAll('.lil_box')).map(box => box.innerText).join('');

    if (currentWord === displayedWord) {
        setTimeout(() => nextWord.click(), 500); 
    }
}

function updateScoreDisplay() {
    scoreDisplay.innerText = `Score: ${score}`;
}

nextWord.addEventListener("click", () => {
    index++;
    if (index >= words.length) {
        nextWord.style.display = "none"; 
        document.querySelector(".container").style.display = 'none'; 
        document.body.innerHTML = `<div class='result'><h1>Thanks for being here!</h1><p>Your final score: ${score}</p> <button onclick="window.location.reload();">Try again!</button> </div>`;
    } else {
        resetButtonColors(); 
        timeSpan.innerHTML = 30; 
        updateWordDisplay();
    }
});

startBtn.addEventListener("click", () => {
    enableLetters();
    nextWord.disabled = false; 
    timer = setInterval(() => {
        timeSpan.innerHTML--;
        if (timeSpan.innerHTML <= 0) {
            timeSpan.innerHTML = 30;
            index++;
            if (index >= words.length) {
                clearInterval(timer);
                nextWord.style.display = "none"; 
                document.querySelector(".container").style.display = 'none'; 
                document.body.innerHTML = `<div class='result'><h1>Thanks for being here!</h1><p>Your final score: ${score}</p> <button onclick="window.location.reload();">Try again!</button> </div>`;
            } else {
                resetButtonColors();
                updateWordDisplay();
            }
        }
    }, 1000);

    startBtn.style.display = 'none';
});

showHint.addEventListener("click", () => {
    if (words.length > 0) {
        hintContainer.style.transform = 'scale(1)';
        document.querySelector(".hint_text").innerHTML = words[index].hint;
    }
});

closeHint.addEventListener("click", () => {
    hintContainer.style.transform = 'scale(0)';
});

initializeLetters();

fetchWords();

nextWord.disabled = true;

howBtn.addEventListener("click" , () =>{
    info.style.transform = 'scale(1)';
})

