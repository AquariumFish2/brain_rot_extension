import { BaseGame } from '../BaseGame.js';
import { Difficulty, GameConfig, GameState } from '../../types/index.js';
import { StorageUtils } from '../../utils/StorageUtils.js';

/**
 * MemoryGame: The core logic for our card-matching challenge.
 * We extend BaseGame to inherit general game properties.
 */
export class MemoryGame extends BaseGame {
  // Singleton instance to ensure we only ever have one game running (avoids multiple timers)
  private static instance: MemoryGame;

  // configuration for different difficulty levels
  protected config: Record<Difficulty, GameConfig> = {
    easy: { pairs: 8, cols: 4, time: 120 },   // 8 pairs, 4 columns, 120 seconds
    normal: { pairs: 12, cols: 6, time: 180 }, // 12 pairs, 6 columns, 180 seconds
    hard: { pairs: 18, cols: 6, time: 180 },   // 18 pairs, 6 columns, 180 seconds
  };

  protected difficulty: Difficulty = 'easy'; // Track the current selected difficulty
  private state: GameState;                  // Holds the reactive state of the current round
  private ticker: number | null = null;      // Holds the interval ID for the countdown timer

  /**
   * Private constructor to enforce Singleton pattern.
   * Initializes the basic state object.
   */
  private constructor() {
    super();
    this.state = this.getInitialState();
  }

  /**
   * Static method to get or create the single instance of the game.
   */
  public static getInstance(): MemoryGame {
    if (!this.instance) this.instance = new MemoryGame();
    return this.instance;
  }

  /**
   * Creates a fresh state object with default values.
   */
  private getInitialState(): GameState {
    return {
      currentDifficulty: 'easy',
      flippedCards: [],  // Currently face-up cards (max 2)
      matchedPairs: 0,   // Number of successful matches found
      moves: 0,          // Total attempt count
      timeLeft: 0,       // Seconds remaining
      isLocked: false,   // Prevent clicking while cards are animating
      totalPairs: 0,     // Targeted pairs for this difficulty
    };
  }

  /**
   * Starts a new round of the game.
   * @param difficulty The difficulty level chosen by the user.
   */
  public start(difficulty: Difficulty): void {
    this.difficulty = difficulty;
    const cfg = this.config[difficulty];
    
    // reset state for the new round
    this.state = {
      currentDifficulty: difficulty,
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      timeLeft: cfg.time,
      isLocked: false,
      totalPairs: cfg.pairs,
    };

    // Update the UI initial values
    this.updateUI();
    // Clear and build the card grid
    this.buildGrid(cfg);
    // Start the countdown
    this.startTimer();
    // Switch to the game screen
    this.showScreen('tf-gameScreen');
  }

  /**
   * Stops the game and clears the timer interval.
   */
  public stop(): void {
    if (this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null; // Important: Clear the reference after stopping
    }
  }

  /**
   * Resets the current game round with the same difficulty.
   */
  public reset(): void {
    this.stop(); // Stop any existing timer
    this.start(this.difficulty); // Start fresh
  }

  /**
   * Initiates the countdown interval.
   */
  private startTimer(): void {
    this.stop(); // Safety check: clear any existing intervals first
    this.ticker = window.setInterval(() => {
      this.state.timeLeft--; // Decrement the seconds left
      this.renderTimer();    // Update the visual clock
      
      // If time runs out, trigger a loss
      if (this.state.timeLeft <= 0) {
        this.triggerLose(false); // false means 'not skipped', actually timed out
      }
    }, 1000);
  }

  /**
   * Updates the timer pill in the top bar.
   */
  private renderTimer(): void {
    const m = Math.floor(this.state.timeLeft / 60); // Calculate minutes
    const s = this.state.timeLeft % 60;             // Calculate remaining seconds
    const pill = document.getElementById('tf-timerPill');
    if (pill) {
      // Format as M:SS
      pill.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
      // Add a 'warn' class (red color) if 20 seconds or less remain
      pill.classList.toggle('warn', this.state.timeLeft <= 20);
    }
  }

  /**
   * Populates the grid with card elements based on configuration.
   */
  private buildGrid(cfg: GameConfig): void {
    const grid = document.getElementById('tf-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear existing cards
    // Calculate columns based on responsiveness
    grid.style.gridTemplateColumns = `repeat(${this.responsiveCols(cfg.cols)}, 1fr)`;

    // Fetch random images for the pairs
    const images = this.getImages(cfg.pairs);
    // Duplicate the images to create pairs, then shuffle them
    const set = [...images, ...images].sort(() => Math.random() - 0.5);

    // Create and append each card to the DOM
    set.forEach(url => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.id = url; // Store the image URL as an ID to check for matches
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-b"></div>
          <div class="card-f"><img src="${url}" alt="card" loading="lazy"></div>
        </div>`;
      // Listen for click on the card to flip it
      card.addEventListener('click', () => this.flip(card));
      grid.appendChild(card);
    });
  }

  /**
   * Handles the flipping of a card and checks for matches.
   */
  private flip(card: HTMLElement): void {
    // Exit if: locked, already flipped, already matched, or 2 cards already flipped
    if (this.state.isLocked || card.classList.contains('flipped') || card.classList.contains('matched') || this.state.flippedCards.length >= 2) return;

    card.classList.add('flipped'); // Visually flip the card
    this.state.flippedCards.push(card); // Track it in our state

    // If this is the second card flipped, check for a match
    if (this.state.flippedCards.length === 2) {
      this.state.moves++;      // Increment move counter
      this.updateMovesUI();    // Update moves in UI
      this.state.isLocked = true; // Lock interactions during animations

      const [c1, c2] = this.state.flippedCards;
      // Check if both cards have the same image URL
      if (c1.dataset.id === c2.dataset.id) {
        // MATCH FOUND
        setTimeout(() => {
          c1.classList.add('matched'); // Mark as permanently matched
          c2.classList.add('matched');
          this.state.matchedPairs++;   // Increment matched count
          this.updateProgressUI();     // Update the progress bar
          this.state.flippedCards = []; // Clear focus
          this.state.isLocked = false;  // Unlock
          // Check for victory
          if (this.state.matchedPairs === this.state.totalPairs) {
            setTimeout(() => this.triggerWin(), 400); // Trigger win after short delay
          }
        }, 300);
      } else {
        // NO MATCH
        setTimeout(() => {
          c1.classList.remove('flipped'); // Flip back face-down
          c2.classList.remove('flipped');
          this.state.flippedCards = [];   // Clear focus
          this.state.isLocked = false;     // Unlock
        }, 800);
      }
    }
  }

  /**
   * Generates a set of unique random image URLs from Picsum.
   */
  private getImages(count: number): string[] {
    const images: string[] = [];
    const usedSeeds = new Set<number>();
    while (images.length < count) {
      const seed = Math.floor(Math.random() * 1000);
      if (!usedSeeds.has(seed)) {
        usedSeeds.add(seed);
        images.push(`https://picsum.photos/seed/${seed}/200/200`);
      }
    }
    return images;
  }

  /**
   * Adjusts the number of columns based on screen width for mobile support.
   */
  private responsiveCols(ideal: number): number {
    const w = window.innerWidth;
    if (w < 360) return Math.min(ideal, 4);
    if (w < 480) return Math.min(ideal, 5);
    return ideal;
  }

  /**
   * Logic for when the user successfully matches all pairs.
   */
  protected triggerWin(): void {
    this.stop(); // Stop the timer
    const score = this.calcScore(); // Calculate final score
    StorageUtils.saveScore(this.difficulty, score); // Save strictly to local storage
    
    // Show the win overlay
    const winOverlay = document.getElementById('tf-winOverlay');
    if (winOverlay) winOverlay.classList.add('on');
    
    // Dispatch a global event so UIManager can update the summary screens
    const event = new CustomEvent('tf_game_win', { detail: { score, moves: this.state.moves, timeLeft: this.state.timeLeft, difficulty: this.difficulty } });
    document.dispatchEvent(event);
  }

  /**
   * Logic for when the user loses (time's up) or skips.
   * @param skipped True if the user manually hit 'skip'.
   */
  public triggerLose(skipped: boolean): void {
    this.stop(); // STOP THE TIMER IMMEDIATELY
    
    // Inform UIManager via event
    const event = new CustomEvent('tf_game_lose', { 
      detail: { 
        skipped, 
        matched: this.state.matchedPairs, 
        total: this.state.totalPairs, 
        moves: this.state.moves 
      } 
    });
    document.dispatchEvent(event);
  }

  /**
   * Calculates a score based on matches, time left, and moves taken.
   */
  private calcScore(): number {
    return Math.max(0, Math.round(this.state.matchedPairs * 100 + this.state.timeLeft * 5 - this.state.moves * 3));
  }

  /**
   * Updates multiple UI components at once.
   */
  private updateUI(): void {
    const pairsVal = document.getElementById('tf-pairsVal');
    const bestVal = document.getElementById('tf-bestVal');
    if (pairsVal) pairsVal.textContent = `0/${this.state.totalPairs}`;
    // Show the high score for the current difficulty
    if (bestVal) bestVal.textContent = String(StorageUtils.loadScores()[this.difficulty] || '—');
    this.updateMovesUI();
    this.updateProgressUI();
  }

  /**
   * Updates only the moves counter in the UI.
   */
  private updateMovesUI(): void {
    const movesVal = document.getElementById('tf-movesVal');
    if (movesVal) movesVal.textContent = String(this.state.moves);
  }

  /**
   * Updates the progress bar fill and current pairs count text.
   */
  private updateProgressUI(): void {
    const fill = document.getElementById('tf-progFill');
    const pairsVal = document.getElementById('tf-pairsVal');
    if (fill) fill.style.width = `${(this.state.matchedPairs / this.state.totalPairs) * 100}%`;
    if (pairsVal) pairsVal.textContent = `${this.state.matchedPairs}/${this.state.totalPairs}`;
  }

  /**
   * Shows a specific UI screen (Landing or Game) and hides others.
   */
  private showScreen(id: string): void {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
    const screen = document.getElementById(id);
    if (screen) screen.classList.add('on');
  }
}
