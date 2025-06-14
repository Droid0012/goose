import { BattleEntityType } from 'src/domain/entities/battle';

export interface BattleRepository {
  findById(id: BattleEntityType['id']): Promise<BattleEntityType | null>;
}
