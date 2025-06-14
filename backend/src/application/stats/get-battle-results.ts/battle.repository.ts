import { BattleEntityType } from 'src/domain/entities/battle';
import { BattleStatsEntityType } from 'src/domain/entities/battle-stats';
import { UserEntityType } from 'src/domain/entities/user';

export interface BattleRepository {
  findById(battleId: string): Promise<{
    id: BattleEntityType['id'];
    endAt: BattleEntityType['endAt'];
    resultsCalculated: BattleEntityType['resultsCalculated'];
    winnerId: BattleEntityType['winnerId'];
    stats: {
      id: BattleStatsEntityType['id'];
      tapCount: BattleStatsEntityType['tapCount'];
      userId: UserEntityType['id'];
      score: BattleStatsEntityType['score'];
      user: {
        id: UserEntityType['id'];
        username: UserEntityType['username'];
      };
    }[];
  } | null>;

  updateWinnerAndFlag(
    battleId: string,
    winnerId: string | null,
  ): Promise<{
    id: string;
    winnerId: string | null;
    resultsCalculated: boolean;
    endAt: BattleEntityType['endAt'];
    updatedAt: BattleEntityType['updatedAt'];
    createdAt: BattleEntityType['createdAt'];
  } | null>;
}
