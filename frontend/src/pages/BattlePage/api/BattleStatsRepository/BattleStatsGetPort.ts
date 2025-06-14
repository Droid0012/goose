import type { BattleEntityType } from 'src/entities/Battle';
import type { BattleStatsEntityType } from 'src/entities/BattleStats';
import type { ApplicationError } from 'src/shared/model/ApplicationError';

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface BattleStatsGetRequest {
    battleId: BattleEntityType['id'];
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface BattleStatsGetResponse {
    user: {
        alwaysZero: boolean;
    };
    battle: {
        id: BattleEntityType['id'];
        startAt: string; // ISO UTC
        endAt: string; // ISO UTC
    };
    battleStats: {
        taps: BattleStatsEntityType['tapCount'];
    };
    now: string; // ISO UTC;
}

export type BattleStatsGetError = 'BattleNotFound';

export interface BattleStatsGetPort {
    getBattleStat(
        params: BattleStatsGetRequest,
    ): Promise<BattleStatsGetResponse | ApplicationError<BattleStatsGetError>>;
}
