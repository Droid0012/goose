import type { BattleStatsRepositoryType } from 'src/pages/BattlePage/api/BattleStatsRepository';
import { ApplicationError } from 'src/shared/model/ApplicationError';
import type { StateType } from '../types';

export class TapUseCase {
    constructor(private readonly battleStatsRepository: BattleStatsRepositoryType) {}

    public async tap(state: Pick<StateType, 'battle'>): Promise<boolean> {
        const res = await this.battleStatsRepository.updateBattleState({
            battleId: state.battle.battle.id,
        });

        return !(res instanceof ApplicationError);
    }
}
