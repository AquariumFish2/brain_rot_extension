import { StorageUtils } from '../utils/StorageUtils.js';
import { StreakData } from '../types/index.js';

export class StreakManager {
  public static updateStreak(): void {
    const data = StorageUtils.loadStreak();
    const today = StorageUtils.getTodayKey();
    if (data.lastDate === today) return;

    const yesterday = StorageUtils.getYesterdayKey();
    if (data.lastDate === yesterday) {
      data.streak++;
    } else {
      data.streak = 1;
    }

    data.lastDate = today;
    if (!data.playedDates.includes(today)) data.playedDates.push(today);
    StorageUtils.saveStreak(data);
  }
}
