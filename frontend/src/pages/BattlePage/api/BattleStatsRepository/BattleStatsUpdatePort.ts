import type { BattleEntityType } from 'src/entities/Battle';
import type { ApplicationError } from 'src/shared/model/ApplicationError';

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface BattleStatsUpdateRequest {
    battleId: BattleEntityType['id'];
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface BattleStatsUpdateResponse {}

export type BattleStatsUpdateError = 'BattleNotFound';

export interface BattleStatsUpdatePort {
    updateBattleState(
        params: BattleStatsUpdateRequest,
    ): Promise<BattleStatsUpdateResponse | ApplicationError<BattleStatsUpdateError>>;
}
