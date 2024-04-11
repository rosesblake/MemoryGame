const gameContainer = document.getElementById("game");
const scoreCount = document.getElementById("score-count");
const highScoreCount = document.getElementById("high-score-count");
let cantClick = false;
let cards = 0;
let firstCard = null;
let secondCard = null;
let playing = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; //get highscore from localStorage

const IMAGES = [
  "images/dog.webp",
  "images/dog.webp",
  "images/cat.jpeg",
  "images/cat.jpeg",
  "images/horse.webp",
  "images/horse.webp",
  "images/lamb.jpeg",
  "images/lamb.jpeg",
  "images/tiger.jpeg",
  "images/tiger.jpeg"
];

// Function to shuffle an array
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

//change to shuffle images
let shuffledImages = shuffle(IMAGES);

// this function loops over the array of images
// it creates a new div and sets its background image to a placeholder image
// it also adds an event listener for a click for each card
function createDivsForImages(imageArray) {
  for (let image of imageArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // set the background image of the div to a placeholder
    newDiv.style.backgroundColor = randomRGB();

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}


// Create and append start button and reset
startButton = document.createElement("button");
startButton.textContent = "START";
restartButton = document.createElement("button");
restartButton.textContent = "TRY AGAIN"
const buttonBox = document.querySelector('#button-box')
startButton.addEventListener("click", startGame);
buttonBox.append(startButton, restartButton);
startButton.addEventListener("click", press)
restartButton.addEventListener("click", press)
restartButton.addEventListener("click", restartGame)

//click effect on buttons
function press(e){
  if(!e.target.classList.contains('pressed')){
  e.target.classList.add('pressed')
  }
  else if(e.target.classList.contains('pressed')){
    e.target.classList.remove('pressed')
  }
}

//update score function
function scoreUpdate(score){
  scoreCount.textContent = "SCORE: " + score;
}

// Function to update the low score attempts
function updateHighScore(newScore) {
  // Retrieve the high score from localStorage before updating
  highScore = localStorage.getItem("highScore") || 0;

  // Update high score if the new score is greater than the stored high score
  if (newScore > highScore) {
    highScore = newScore;
    localStorage.setItem("highScore", highScore); // Store high score in localStorage
  }

  // Always update the high score displayed on the page
  highScoreCount.textContent = "MOST ATTEMPTS: " + highScore;
}

// Update high score initially
updateHighScore(highScore);

// Function to start the game
function startGame() {
  if (!playing) {
    // Shuffle the images
    let shuffledImages = shuffle(IMAGES);

    // Clear the game container
    gameContainer.innerHTML = '';

    // Create divs for images
    createDivsForImages(shuffledImages);

    // Reset game variables
    cantClick = false;
    cards = 0;
    firstCard = null;
    secondCard = null;
    score = 0;
    playing = true;
    scoreUpdate(0)
    updateHighScore(highScore) // Update high score again when starting the game
  }
}

// Function to restart the game
function restartGame() {
  // Clear the game container
  gameContainer.innerHTML = '';
  // Create divs for images
  createDivsForImages(shuffledImages);

  // Reset game variables
  cantClick = false;
  cards = 0;
  firstCard = null;
  secondCard = null;
  score = 0;
  // Set playing to true to start the game
  playing = true;
  scoreUpdate(0)
}


// Function to handle card clicks
function handleCardClick(event) {
    // Ignore clicks if the game is not started or clicking is not allowed
    if (!playing || cantClick) return;
    scoreUpdate(score += 1);
    updateHighScore(score);
  
    // Flip the card
    const clickedCard = event.target;
    const cardIndex = Array.from(gameContainer.children).indexOf(clickedCard);
    const imageUrl = shuffledImages[cardIndex];
    clickedCard.style.backgroundImage = `url('${imageUrl}')`;
  
    // Mark the card as clicked
    clickedCard.classList.add("look");
  
    // Check if it's the first or second card clicked
    if (firstCard === null) {
      firstCard = clickedCard;
    } else {
      secondCard = clickedCard;
      // Prevent further clicking while processing
      cantClick = true;
  
      // Compare the images of the clicked cards
      const image1 = firstCard.style.backgroundImage;
      const image2 = secondCard.style.backgroundImage;
  
      if (image1 === image2) {
        // If they match, remove event listeners, update score, reset cards, and allow clicking again
        cards += 2;
        firstCard.removeEventListener("click", handleCardClick);
        secondCard.removeEventListener("click", handleCardClick);

         //dont need to specify twice for if/else
        firstCard = null;
        secondCard = null;
        cantClick = false;
      } else {
        // If they don't match, reset cards after a delay and allow clicking again
        setTimeout(function() {
          firstCard.style.backgroundImage = ""; // Reset background image
          secondCard.style.backgroundImage = ""; // Reset background image
          firstCard.classList.remove("look");
          secondCard.classList.remove("look");
          //
          firstCard = null;
          secondCard = null;
          cantClick = false;
        }, 1000);
      }
    }
  
    // Check if the game is over and delay to show last card clicked
    if (cards === IMAGES.length) {
      setTimeout(function() {
        alert("Game over!");
        restartGame();
      }, 500);
    }
  }

// When the DOM loads
createDivsForImages(shuffledImages);
//letters effects
function randomRGB(){
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`
  }
  
  const letters = document.querySelectorAll('.letter')
      setInterval(function(){
      for (let letter of letters){
          letter.style.color = randomRGB();
          letter.style.backgroundColor = randomRGB();
          }
      }, 500)

//SOURCES
//one of my struggles when I got back over it is understanding my code after I figured out a solution seemingly by "accident"
//this video helped understand the role of adding classes, but used more CSS than I wanted to https://www.youtube.com/watch?v=M0egyNvsN-Y&ab_channel=OnlineTutorials
//studied this game https://marina-ferreira.github.io/tutorials/js/memory-game/
//help understanding boolean logic in memory games https://stackoverflow.com/questions/53573816/understanding-a-booleans-role-in-a-memory-game-time-checkerplay-again-func
//some game logic inspo https://stackoverflow.com/questions/54171904/javascript-memory-game-need-to-add-congrats-message-at-the-end-of-game
//helped understand scoore logic https://stackoverflow.com/questions/68074211/make-score-counter-from-javascript-display-as-text-in-html
//asked my brother questions about localStorage and how to incorporate it into codes.