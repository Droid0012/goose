import type { BattleEntityType } from 'src/entities/Battle';
import type { ApplicationError } from 'src/shared/model/ApplicationError';

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface BattleCreateRequest {}

export interface BattleCreateResponse {
    data: {
        id: BattleEntityType['id'];
        startAt: BattleEntityType['startAt'];
        endAt: BattleEntityType['endAt'];
        createdAt: BattleEntityType['createdAt'];
    };
}

export type BattleCreateErrors = '';

export interface BattleCreatePort {
    createBattle(
        params: BattleCreateRequest,
    ): Promise<BattleCreateResponse | ApplicationError<BattleCreateErrors>>;
}
