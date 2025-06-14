import type { BattleEntityType } from 'src/entities/Battle';
import type { ApplicationError } from 'src/shared/model/ApplicationError';

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface CurrentBattleListGetRequest {}

export interface CurrentBattleListGetResponse {
    battles: {
        id: BattleEntityType['id'];
        startAt: BattleEntityType['startAt'];
        endAt: BattleEntityType['endAt'];
        createdAt: BattleEntityType['createdAt'];
    }[];
}

export type CurrentBattleListGetErrors = 'BattleNotFound' | 'BattleNotReady';

export interface CurrentBattleListGetPort {
    getCurrentBattles(
        params: CurrentBattleListGetRequest,
    ): Promise<CurrentBattleListGetResponse | ApplicationError<CurrentBattleListGetErrors>>;
}
