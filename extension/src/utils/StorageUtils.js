const SCORE_KEY = 'tf_scores';
const STREAK_KEY = 'tf_streak';
const PALETTE_KEY = 'tf_palette';
export const StorageUtils = {
    loadScores() {
        try {
            return JSON.parse(localStorage.getItem(SCORE_KEY) || '{}');
        }
        catch (e) {
            return {};
        }
    },
    saveScore(difficulty, score) {
        const scores = this.loadScores();
        if (!scores[difficulty] || score > scores[difficulty]) {
            scores[difficulty] = score;
        }
        localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
    },
    loadStreak() {
        try {
            return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"streak": 0, "lastDate": null, "playedDates": []}');
        }
        catch (e) {
            return { streak: 0, lastDate: null, playedDates: [] };
        }
    },
    saveStreak(data) {
        localStorage.setItem(STREAK_KEY, JSON.stringify(data));
    },
    getTodayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },
    getYesterdayKey() {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },
    getSavedPalette() {
        return localStorage.getItem(PALETTE_KEY) || 'obsidian';
    },
    savePalette(key) {
        localStorage.setItem(PALETTE_KEY, key);
    }
};
