import { PALETTES } from './ThemeManager.js';
import { Difficulty } from '../types/index.js';

/**
 * Generates the Theme Dropdown HTML.
 */
export function getDropdownHTML(): string {
  const darkKeys = ['obsidian', 'midnight', 'forest'];
  const lightKeys = ['cream', 'cloud', 'rose'];
  const buildOptions = (keys: string[]) => keys.map(k => `
    <button class="theme-option" data-palette="${k}">
      <span class="theme-dot" style="background:${PALETTES[k as keyof typeof PALETTES].swatch}"></span>
      <span class="theme-name">${PALETTES[k as keyof typeof PALETTES].name}</span>
      <span class="theme-check">✓</span>
    </button>`).join('');

  return `
    <div class="theme-wrap" id="tf-themeWrap">
      <button class="theme-btn" id="tf-themeBtn" title="Change theme">
        <span class="theme-btn-dot" id="tf-themeBtnDot"></span>
        <span class="theme-btn-name" id="tf-themeBtnName"></span>
        <span class="theme-btn-arrow">▾</span>
      </button>
      <div class="theme-dropdown" id="tf-themeDropdown">
        <div class="theme-group-label">Dark</div>
        ${buildOptions(darkKeys)}
        <div class="theme-divider"></div>
        <div class="theme-group-label">Light</div>
        ${buildOptions(lightKeys)}
      </div>
    </div>`;
}

/**
 * Helper to build difficulty selection cards.
 */
export function getDiffCardHTML(id: Difficulty, name: string, meta: string): string {
  return `
    <div class="diff-card" id="tf-${id}-card">
      <div class="diff-left">
        <span class="diff-name">${name}</span>
        <span class="diff-meta">${meta}</span>
      </div>
      <span class="diff-badge" id="tf-badge-${id}">No record</span>
      <span class="diff-arrow">→</span>
    </div>`;
}

/**
 * Helper to build Top Score boxes.
 */
export function getScoreBoxHTML(id: Difficulty, label: string): string {
  return `
    <div class="score-box" id="tf-sbox-${id}">
      <span class="sv" id="tf-sc-${id}">—</span><span class="sl">${label}</span>
    </div>`;
}

/**
 * Returns the main overlay HTML template.
 */
export function getMainOverlayHTML(): string {
  return `
    <div class="app">
      <!-- Background decorative grid -->
      <div class="grid-bg"></div>
      <!-- Decorative corners -->
      <div class="corner tl"></div> <div class="corner tr"></div>
      <div class="corner bl"></div> <div class="corner br"></div>

      <!-- Managed Top Bar -->
      <div class="top-bar">
        <span class="top-label">ThinkFirst</span>
        <div class="top-right">
          <button class="back-btn" id="tf-backBtn">← Menu</button>
          ${getDropdownHTML()}
          <div class="status-dot"><div class="dot"></div>Intercepted</div>
          <!-- Timer countdown display -->
          <div class="timer-pill" id="tf-timerPill">2:00</div>
        </div>
      </div>

      <!-- 1. LANDING SCREEN: Where the user picks difficulty -->
      <div class="screen on" id="tf-landingScreen">
        <div class="screen-inner">
          <div class="land-eyebrow">Brain checkpoint</div>
          <h1 class="land-title">Match pairs.<br/><em>Unlock</em> the AI.</h1>
          <p class="land-sub">Pick a difficulty. Beat the game. Then think with AI — not instead of it.</p>
          
          <div class="diff-cards">
            ${getDiffCardHTML('easy', 'Easy', '8 pairs · 2 min')}
            ${getDiffCardHTML('normal', 'Normal', '12 pairs · 3 min')}
            ${getDiffCardHTML('hard', 'Hard', '18 pairs · 3 min')}
          </div>

          <!-- Streak display (how many days in a row played) -->
          <div class="streak-section" id="tf-streakSection">
            <div class="streak-header">
              <span class="streak-count" id="tf-streakCount">0</span>
              <span class="streak-label">day streak</span>
            </div>
            <div class="streak-days" id="tf-streakDays"></div>
          </div>

          <!-- Personal Best Scores -->
          <div class="scores-section">
            <div class="scores-label">Top scores</div>
            <div class="scores-grid">
              ${getScoreBoxHTML('easy', 'Easy')}
              ${getScoreBoxHTML('normal', 'Normal')}
              ${getScoreBoxHTML('hard', 'Hard')}
            </div>
          </div>
        </div>
      </div>

      <!-- 2. GAME SCREEN: Where the card grid is rendered -->
      <div class="screen" id="tf-gameScreen">
        <div class="game-inner">
          <div class="g-eyebrow">Round active</div>
          <h2 class="g-title">Match the pairs to <em>unlock</em> the AI</h2>
          
          <div class="stats-row">
            <div class="stat-box hl">
              <span class="stat-val" id="tf-pairsVal">0/8</span>
              <span class="stat-lbl">Pairs</span>
            </div>
            <div class="stat-box">
              <span class="stat-val" id="tf-movesVal">0</span>
              <span class="stat-lbl">Moves</span>
            </div>
            <div class="stat-box">
              <span class="stat-val" id="tf-bestVal">—</span>
              <span class="stat-lbl">Best</span>
            </div>
          </div>
          
          <!-- Progress bar fill -->
          <div class="prog-track"><div class="prog-fill" id="tf-progFill"></div></div>
          <!-- The actual container for the cards -->
          <div class="grid-wrap"><div class="grid" id="tf-grid"></div></div>
          
          <div class="skip-wrap">
            <button class="btn-skip" id="tf-skipBtn" title="Skip and lose your streak">Skip — proceed without warming up</button>
          </div>
        </div>
      </div>

      <!-- 3. WIN OVERLAY: Shown when round is complete -->
      <div class="overlay ov-win" id="tf-winOverlay">
        <div class="new-best" id="tf-newBestTag" style="display:none">★ New best score!</div>
        <div class="ov-icon">🧠</div>
        <h2 class="ov-title">Mind warmed up.</h2>
        <p class="ov-msg">All pairs matched in <strong id="tf-wMoves">—</strong> moves with <strong id="tf-wTime">—</strong> left.</p>
        <div class="ov-stats">
          <div class="ov-stat"><span class="s" id="tf-wScore">—</span><span class="l">Score</span></div>
          <div class="ov-stat"><span class="s" id="tf-wMovesS">—</span><span class="l">Moves</span></div>
          <div class="ov-stat"><span class="s" id="tf-wTimeS">—</span><span class="l">Time left</span></div>
        </div>
        <button class="btn-g btn-gold" id="tf-continueBtn">Continue to the site →</button>
        <button class="btn-g btn-dark" id="tf-playAgainWin">Play again</button>
        <button class="btn-g btn-dark" id="tf-changeDiffWin">Change difficulty</button>
      </div>

      <!-- 4. LOSE OVERLAY: Shown on Time Out or Skip -->
      <div class="overlay ov-lose" id="tf-loseOverlay">
        <div class="ov-icon">⏱</div>
        <h2 class="ov-title" id="tf-loseTitleEl">Time's up.</h2>
        <p class="ov-msg" id="tf-loseMsgEl">Give your brain another shot.</p>
        <div class="ov-stats">
          <div class="ov-stat"><span class="s" id="tf-lPairs">—</span><span class="l">Pairs found</span></div>
          <div class="ov-stat"><span class="s" id="tf-lMoves">—</span><span class="l">Moves</span></div>
        </div>
        <button class="btn-g btn-gold" id="tf-tryAgainBtn">Try again</button>
        <button class="btn-g btn-dark" id="tf-changeDiffLose">Change difficulty</button>
        <button class="btn-g btn-dark" id="tf-proceedBtn">Proceed anyway</button>
      </div>
    </div>
  `;
}
