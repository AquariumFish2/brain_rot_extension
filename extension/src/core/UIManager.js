import { ThemeManager } from './ThemeManager.js';
import { StorageUtils } from '../utils/StorageUtils.js';
import { getMainOverlayHTML } from './UITemplates.js';
/**
 * UIManager: Responsible for creating, injecting, and managing the visual state of the extension.
 * This includes the landing screen, the game screen, and the win/lose overlays.
 */
export class UIManager {
    // Singleton instance
    static instance;
    // The main container for our extension, which stays fixed at the top of the browser
    overlay;
    /**
     * Private constructor creates the base 'tf-overlay' element.
     */
    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'tf-overlay';
    }
    /**
     * Static method to get the singleton instance.
     */
    static getInstance() {
        if (!this.instance)
            this.instance = new UIManager();
        return this.instance;
    }
    /**
     * Injects the entire HTML structure into the webpage.
     * This is only called once.
     */
    inject() {
        // If we've already injected, stop here to avoid duplicates
        if (document.getElementById('tf-overlay'))
            return;
        // Prevent the underlying page from scrolling while our overlay is open
        document.documentElement.style.overflow = 'hidden';
        // The massive HTML template for the whole app
        this.overlay.innerHTML = getMainOverlayHTML();
        // Append our built overlay to the top level of the page
        document.documentElement.appendChild(this.overlay);
        // Attach event listeners to the buttons we just injected
        this.setupEvents();
        // Initial render of landing screen data (streaks/scores)
        this.renderLanding();
    }
    /**
     * IMPORTANT: Centralized event handling.
     * This ensures that buttons work even if they were just added to the DOM.
     */
    setupEvents() {
        // Theme toggle button
        const themeBtn = document.getElementById('tf-themeBtn');
        const themeDD = document.getElementById('tf-themeDropdown');
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDD.classList.toggle('open');
        });
        // Close theme dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const wrap = document.getElementById('tf-themeWrap');
            if (wrap && !wrap.contains(e.target)) {
                themeDD?.classList.remove('open');
            }
        });
        // Theme option choices
        this.overlay.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.palette;
                if (key)
                    ThemeManager.getInstance().applyPalette(key);
            });
        });
        // Listen for custom game events dispatched by MemoryGame.ts
        document.addEventListener('tf_game_win', (e) => this.showWinOverlay(e.detail));
        document.addEventListener('tf_game_lose', (e) => this.showLoseOverlay(e.detail));
        // Nav and Overlay exit buttons
        document.getElementById('tf-continueBtn')?.addEventListener('click', () => this.unlockSite());
        document.getElementById('tf-proceedBtn')?.addEventListener('click', () => this.unlockSite());
    }
    /**
     * Renders the landing screen with storage data.
     */
    renderLanding() {
        this.renderStreak();
        const scores = StorageUtils.loadScores();
        ['easy', 'normal', 'hard'].forEach(diff => {
            const score = scores[diff];
            const box = document.getElementById(`tf-sbox-${diff}`);
            const badge = document.getElementById(`tf-badge-${diff}`);
            const val = document.getElementById(`tf-sc-${diff}`);
            if (score) {
                box?.classList.add('has');
                badge?.classList.add('has');
                if (val)
                    val.textContent = String(score);
                if (badge)
                    badge.textContent = `Best: ${score}`;
            }
            else {
                box?.classList.remove('has');
                badge?.classList.remove('has');
                if (val)
                    val.textContent = '—';
                if (badge)
                    badge.textContent = 'No record';
            }
        });
    }
    /**
     * Helper to render the streak section.
     */
    renderStreak() {
        const data = StorageUtils.loadStreak();
        const countEl = document.getElementById('tf-streakCount');
        const daysEl = document.getElementById('tf-streakDays');
        if (countEl)
            countEl.textContent = String(data.streak);
        if (!daysEl)
            return;
        const days = this.getWeekDays();
        daysEl.innerHTML = days.map(d => `
      <div class="streak-day${d.played ? ' played' : ''}${d.isToday ? ' today' : ''}${d.future ? ' future' : ''}">
        <span class="sd-name">${d.label}</span>
        <div class="sd-pip"></div>
        <span class="sd-date">${d.date}</span>
      </div>
    `).join('');
    }
    /**
     * Logic to get the current week's playing status for the streak UI.
     */
    getWeekDays() {
        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = StorageUtils.loadStreak();
        const today = new Date();
        const todayKey = StorageUtils.getTodayKey();
        // Find last Saturday as start of week grid
        const todayDay = today.getDay();
        const daysFromSat = (todayDay + 1) % 7;
        const satDate = new Date(today);
        satDate.setDate(today.getDate() - daysFromSat);
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(satDate);
            d.setDate(satDate.getDate() + i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            return {
                label: DAY_NAMES[d.getDay()],
                date: `${d.getDate()}-${MONTHS[d.getMonth()]}`,
                played: data.playedDates.includes(key),
                isToday: key === todayKey,
                future: d > today && key !== todayKey,
            };
        });
    }
    /**
     * Populates the Win summary data.
     */
    showWinOverlay(detail) {
        const winOverlay = document.getElementById('tf-winOverlay');
        if (winOverlay)
            winOverlay.classList.add('on');
        const scoreVal = document.getElementById('tf-wScore');
        const movesVal = document.getElementById('tf-wMoves');
        const movesValS = document.getElementById('tf-wMovesS');
        const timeVal = document.getElementById('tf-wTime');
        const timeValS = document.getElementById('tf-wTimeS');
        if (scoreVal)
            scoreVal.textContent = detail.score;
        if (movesVal)
            movesVal.textContent = detail.moves;
        if (movesValS)
            movesValS.textContent = detail.moves;
        const m = Math.floor(detail.timeLeft / 60);
        const s = detail.timeLeft % 60;
        const ts = `${m}:${s < 10 ? '0' : ''}${s}`;
        if (timeVal)
            timeVal.textContent = ts;
        if (timeValS)
            timeValS.textContent = ts;
        // Check if score is a new high record
        const saved = StorageUtils.loadScores();
        const isNew = detail.score > (saved[detail.difficulty] || 0);
        const badge = document.getElementById('tf-newBestTag');
        if (badge)
            badge.style.display = isNew ? 'block' : 'none';
    }
    /**
     * Populates the Lose/Skip summary data.
     */
    showLoseOverlay(detail) {
        const loseOverlay = document.getElementById('tf-loseOverlay');
        if (loseOverlay)
            loseOverlay.classList.add('on');
        const pairsVal = document.getElementById('tf-lPairs');
        const movesVal = document.getElementById('tf-lMoves');
        const titleEl = document.getElementById('tf-loseTitleEl');
        const msgEl = document.getElementById('tf-loseMsgEl');
        if (pairsVal)
            pairsVal.textContent = `${detail.matched}/${detail.total}`;
        if (movesVal)
            movesVal.textContent = detail.moves;
        if (titleEl)
            titleEl.textContent = detail.skipped ? 'Skipped.' : "Time's up.";
        if (msgEl)
            msgEl.textContent = detail.skipped
                ? 'No warmup today. Try again anytime.'
                : `You found ${detail.matched} of ${detail.total} pairs. Give it another shot.`;
    }
    /**
     * Smoothly removes the overlay and unlocks the site.
     */
    unlockSite() {
        this.overlay.style.transition = 'opacity 0.5s';
        this.overlay.style.opacity = '0';
        setTimeout(() => {
            this.overlay.remove();
            // Re-enable scrolling on the target site
            document.documentElement.style.overflow = '';
        }, 500);
    }
    /**
     * Returns UI to the landing screen from any state.
     */
    goLanding() {
        document.querySelectorAll('.overlay').forEach(o => o.classList.remove('on'));
        document.getElementById('tf-timerPill')?.classList.remove('on', 'warn');
        document.getElementById('tf-backBtn')?.classList.remove('on');
        this.renderLanding();
        this.showScreen('tf-landingScreen');
    }
    /**
     * Utility to toggle active screens.
     */
    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
        const screen = document.getElementById(id);
        if (screen)
            screen.classList.add('on');
    }
}
