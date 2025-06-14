export interface BattleStatsRepository {
  incrementTapCount(battleId: string, userId: string): Promise<void>;
}
