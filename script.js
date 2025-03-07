function createBubble() {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    let size = Math.random() * 30 + 10; 
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.animationDuration = `${Math.random() * 5 + 5}s`;

    document.body.appendChild(bubble);

    setTimeout(() => {
        bubble.remove();
    }, 10000);
}

setInterval(createBubble, 500);


const cards = document.querySelectorAll(".card");

let matched = 0;
let cardOne, cardTwo;
let disableDeck = false;

// Retrieve stored values or set defaults
let score = localStorage.getItem("score") ? parseInt(localStorage.getItem("score")) : 0;
let lives = localStorage.getItem("lives") ? parseInt(localStorage.getItem("lives")) : 5;

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const newGameButton = document.getElementById("newGame");

// Update UI with stored values
scoreElement.textContent = score;
livesElement.textContent = lives;

function flipCard({ target: clickedCard }) {
    if (cardOne !== clickedCard && !disableDeck) {
        clickedCard.classList.add("flip");

        if (!cardOne) {
            cardOne = clickedCard;
            return;
        }

        cardTwo = clickedCard;
        disableDeck = true;

        let cardOneImg = cardOne.querySelector(".back-view img").src;
        let cardTwoImg = cardTwo.querySelector(".back-view img").src;

        matchCards(cardOneImg, cardTwoImg);
    }
}

function matchCards(img1, img2) {
    if (img1 === img2) {
        matched++;
        updateScore();

        if (matched === 8) {
            setTimeout(() => shuffleCards(), 1000);
        }

        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        resetCards();
    } else {
        loseLife();

        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        }, 400);

        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");
            resetCards();
        }, 1200);
    }
}

function resetCards() {
    cardOne = cardTwo = "";
    disableDeck = false;
}

function shuffleCards() {
    matched = 0;
    disableDeck = false;
    cardOne = cardTwo = "";

    let imageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]; // Unique image set (each appears once)

    // Shuffle the images
    imageNumbers.sort(() => Math.random() - 0.5);

    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector(".back-view img");
        imgTag.src = `images/img-${imageNumbers[i]}.png`; // Assign unique images
        card.addEventListener("click", flipCard);
    });

    resetGame();
}

function updateScore() {
    score++;
    localStorage.setItem("score", score);
    scoreElement.textContent = score;
}

function loseLife() {
    lives--;
    localStorage.setItem("lives", lives);
    livesElement.textContent = lives;

    if (lives === 0) {
        setTimeout(() => {
            alert("Game Over! Try again.");
            shuffleCards();
        }, 500);
    }
}

function resetGame() {
    score = 0;
    lives = 5; // Set lives to 5
    localStorage.setItem("score", score);
    localStorage.setItem("lives", lives);
    scoreElement.textContent = score;
    livesElement.textContent = lives;
}

// Event listener for new game button
newGameButton.addEventListener("click", shuffleCards);

cards.forEach(card => card.addEventListener("click", flipCard));
