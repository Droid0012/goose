import { Dayjs } from 'dayjs';
import { BattleEntityType } from 'src/domain/entities/battle';

export interface BattleRepository {
  findCurrentBattles(now: Dayjs): Promise<BattleEntityType[]>;
}
