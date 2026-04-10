import { Difficulty, GameConfig } from '../types/index.js';

export abstract class BaseGame {
  protected abstract config: Record<Difficulty, GameConfig>;
  protected abstract difficulty: Difficulty;

  public abstract start(difficulty: Difficulty): void;
  public abstract stop(): void;
  public abstract reset(): void;

  protected abstract triggerWin(): void;
  protected abstract triggerLose(skipped: boolean): void;

  public getDifficulty(): Difficulty {
    return this.difficulty;
  }
}
