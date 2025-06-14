import { BattleEntityType } from 'src/domain/entities/battle';

export interface BattleRepository {
  findById(id: string): Promise<BattleEntityType | null>;
}
