import { UIManager } from '../core/UIManager.js';
import { ThemeManager } from '../core/ThemeManager.js';
import { MemoryGame } from '../games/memory/index.js';
import { StreakManager } from '../utils/StreakManager.js';
import { Difficulty } from '../types/index.js';

/**
 * init(): The main entry point of our extension's logic.
 * This runs when the script is first loaded into a page.
 */
function init() {
  // Get our singleton instances - this ensures we don't create multiple timers/overlays
  const ui = UIManager.getInstance();
  const theme = ThemeManager.getInstance();
  const game = MemoryGame.getInstance();

  // 1. Inject the UI overlay into the current webpage's DOM
  ui.inject();
  // 2. Load the user's saved theme (e.g. 'Obsidian') from storage
  theme.init();

  // --- NAVIGATION EVENTS ---

  // Handle 'Back to Menu' button click
  document.getElementById('tf-backBtn')?.addEventListener('click', () => {
    game.stop();     // Stop the game timer
    ui.goLanding();  // Return to the difficulty selection screen
  });

  // Handle clicking on an 'Easy' card
  document.getElementById('tf-easy-card')?.addEventListener('click', () => {
    game.start('easy'); // Initialize game with easy settings
    // Show top-bar elements that are hidden on landing
    document.getElementById('tf-backBtn')?.classList.add('on');
    document.getElementById('tf-timerPill')?.classList.add('on');
  });

  // Handle clicking on a 'Normal' card
  document.getElementById('tf-normal-card')?.addEventListener('click', () => {
    game.start('normal');
    document.getElementById('tf-backBtn')?.classList.add('on');
    document.getElementById('tf-timerPill')?.classList.add('on');
  });

  // Handle clicking on a 'Hard' card
  document.getElementById('tf-hard-card')?.addEventListener('click', () => {
    game.start('hard');
    document.getElementById('tf-backBtn')?.classList.add('on');
    document.getElementById('tf-timerPill')?.classList.add('on');
  });

  // Handle 'Skip' button - allows user to bypass the game at a cost
  document.getElementById('tf-skipBtn')?.addEventListener('click', () => {
    game.triggerLose(true); // 'true' tells the game this was a manual skip
  });

  // --- OVERLAY BUTTON EVENTS ---
  // These handle buttons inside the Win/Lose screens

  // Restart after winning
  document.getElementById('tf-playAgainWin')?.addEventListener('click', () => {
    document.querySelectorAll('.overlay').forEach(o => o.classList.remove('on'));
    game.reset(); // Restart same difficulty
  });

  // Restart after losing/timing out
  document.getElementById('tf-tryAgainBtn')?.addEventListener('click', () => {
    document.querySelectorAll('.overlay').forEach(o => o.classList.remove('on'));
    game.reset();
  });

  // Return to difficulty menu after winning
  document.getElementById('tf-changeDiffWin')?.addEventListener('click', () => {
    game.stop();
    ui.goLanding();
  });

  // Return to difficulty menu after losing
  document.getElementById('tf-changeDiffLose')?.addEventListener('click', () => {
    game.stop();
    ui.goLanding();
  });

  // --- SYSTEM EVENT LISTENERS ---

  // When a win is detected globally...
  document.addEventListener('tf_game_win', () => {
    // 1. Update the user's daily streak
    StreakManager.updateStreak();
    // 2. Refresh the high scores on the landing page
    ui.renderLanding();
  });
}

/**
 * Execution Check:
 * Ensures init() runs as soon as possible, but waits for the DOM if it's still loading.
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
