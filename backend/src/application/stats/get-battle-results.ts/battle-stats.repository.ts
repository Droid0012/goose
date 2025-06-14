export interface StatUpdate {
  id: string;
  score: number;
}

export interface BattleStatsRepository {
  applyScores(updates: StatUpdate[]): Promise<void>;
}
