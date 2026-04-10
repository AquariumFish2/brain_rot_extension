export type Difficulty = 'easy' | 'normal' | 'hard';

export interface GameConfig {
  pairs: number;
  cols: number;
  time: number;
}

export interface ScoreData {
  [key: string]: number; // difficulty -> score
}

export interface StreakData {
  streak: number;
  lastDate: string | null;
  playedDates: string[];
}

export interface Palette {
  name: string;
  swatch: string;
  dark: boolean;
  vars: Record<string, string>;
}

export interface GameState {
  currentDifficulty: Difficulty;
  flippedCards: HTMLElement[];
  matchedPairs: number;
  moves: number;
  timeLeft: number;
  isLocked: boolean;
  totalPairs: number;
}
