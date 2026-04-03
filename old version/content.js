
const CARD_EMOJIS = ["🧠", "🤖", "🕹️", "👾", "💾", "🔌", "🔋", "💻", "🖥️", "🖱️", "📡", "🛰️"];

let timerInterval;
let timeLeft = 60;
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let isGameActive = false;

function createOverlay() {
  const existing = document.getElementById("ai-blocker-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "ai-blocker-overlay";
  document.documentElement.appendChild(overlay);
  
  showDifficultyScreen();
}

function showDifficultyScreen() {
  const overlay = document.getElementById("ai-blocker-overlay");
  overlay.innerHTML = `
    <div class="difficulty-screen">
      <h1 class="title">PIXEL PURGE</h1>
      <p style="margin-bottom: 20px;">Use your brain to unlock AI</p>
      <div>
        <button onclick="window.startMemoryGame(4, 3)">EASY (4x3)</button>
        <button onclick="window.startMemoryGame(4, 4)">NORMAL (4x4)</button>
        <button onclick="window.startMemoryGame(4, 5)">HARD (4x5)</button>
      </div>
    </div>
  `;
}

window.startMemoryGame = (cols, rows) => {
  const totalCards = cols * rows;
  totalPairs = totalCards / 2;
  matchedPairs = 0;
  flippedCards = [];
  timeLeft = 60;
  isGameActive = true;

  const overlay = document.getElementById("ai-blocker-overlay");
  overlay.innerHTML = `
    <div class="game-container">
      <div class="timer">TIME: <span id="time-val">60</span>s</div>
      <div id="game-grid" class="grid grid-${cols}x${rows}"></div>
    </div>
  `;

  const grid = document.getElementById("game-grid");
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  // Generate and shuffle cards
  const icons = CARD_EMOJIS.slice(0, totalPairs);
  const gameIcons = [...icons, ...icons].sort(() => Math.random() - 0.5);

  gameIcons.forEach((icon, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.icon = icon;
    card.dataset.index = index;
    card.onclick = () => handleCardClick(card);

    card.innerHTML = `
      <div class="card-back"></div>
      <div class="card-front">${icon}</div>
    `;
    grid.appendChild(card);
  });

  startTimer();
};

function handleCardClick(card) {
  if (!isGameActive || card.classList.contains("flipped") || flippedCards.length === 2) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const match = card1.dataset.icon === card2.dataset.icon;

  if (match) {
    matchedPairs++;
    flippedCards = [];
    if (matchedPairs === totalPairs) {
      winGame();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 600);
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    const timeDisplay = document.getElementById("time-val");
    if (timeDisplay) timeDisplay.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showGameOver();
    }
  }, 1000);
}

function showGameOver() {
  isGameActive = false;
  const overlay = document.getElementById("ai-blocker-overlay");
  overlay.innerHTML = `
    <div class="game-over-screen">
      <h1 class="title error-text">TIME'S UP!</h1>
      <p style="margin-bottom: 20px;">Your brain is stalling...</p>
      <button onclick="location.reload()">RESTART</button>
      <button onclick="window.unlockChatGPT()">SKIP (COWARD)</button>
    </div>
  `;
}

function winGame() {
  clearInterval(timerInterval);
  isGameActive = false;
  const overlay = document.getElementById("ai-blocker-overlay");
  overlay.innerHTML = `
    <div class="game-over-screen">
      <h1 class="title">PURGED!</h1>
      <p style="margin-bottom: 20px;">Brain restored. AI unlocked.</p>
      <button onclick="window.unlockChatGPT()">PROCEED</button>
    </div>
  `;
}

window.unlockChatGPT = () => {
  const overlay = document.getElementById("ai-blocker-overlay");
  if (overlay) {
    overlay.style.transition = "opacity 0.5s";
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.remove();
      document.documentElement.style.overflow = "auto";
    }, 500);
  }
};

// Start the experience
document.documentElement.style.overflow = "hidden";
createOverlay();

