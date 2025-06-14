import { BattleEntityType } from 'src/domain/entities/battle';

export interface BattleRepository {
  create(
    battle: Pick<BattleEntityType, 'startAt' | 'endAt'>,
  ): Promise<BattleEntityType>;
}
