import { BattleEntityType } from 'src/domain/entities/battle';
import { BattleStatsEntityType } from 'src/domain/entities/battle-stats';
import { UserEntityType } from 'src/domain/entities/user';

export interface BattleStatsRepository {
  findByBattleIdAndUserId(
    battleId: BattleEntityType['id'],
    userId: UserEntityType['id'],
  ): Promise<BattleStatsEntityType | null>;
}
