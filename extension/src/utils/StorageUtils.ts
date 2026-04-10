import { Difficulty, ScoreData, StreakData } from '../types/index.js';

const SCORE_KEY = 'tf_scores';
const STREAK_KEY = 'tf_streak';
const PALETTE_KEY = 'tf_palette';

export const StorageUtils = {
  loadScores(): ScoreData {
    try {
      return JSON.parse(localStorage.getItem(SCORE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  },

  saveScore(difficulty: Difficulty, score: number): void {
    const scores = this.loadScores();
    if (!scores[difficulty] || score > scores[difficulty]) {
      scores[difficulty] = score;
    }
    localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
  },

  loadStreak(): StreakData {
    try {
      return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"streak": 0, "lastDate": null, "playedDates": []}');
    } catch (e) {
      return { streak: 0, lastDate: null, playedDates: [] };
    }
  },

  saveStreak(data: StreakData): void {
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  },

  getTodayKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  getYesterdayKey(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  getSavedPalette(): string {
    return localStorage.getItem(PALETTE_KEY) || 'obsidian';
  },

  savePalette(key: string): void {
    localStorage.setItem(PALETTE_KEY, key);
  }
};
