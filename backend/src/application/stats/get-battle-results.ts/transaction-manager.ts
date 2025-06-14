import { BattleStatsRepository } from './battle-stats.repository';
import { BattleRepository } from './battle.repository';

export interface TransactionManager {
  runInTransaction<T>(
    callback: (repos: {
      battleRepo: BattleRepository;
      battleStatsRepo: BattleStatsRepository;
    }) => Promise<T>,
  ): Promise<T>;
}
