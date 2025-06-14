import type { BattleEntityType } from 'src/entities/Battle';
import type { BattleStatsEntityType } from 'src/entities/BattleStats';
import type { UserEntityType } from 'src/entities/User';
import type { ApplicationError } from 'src/shared/model/ApplicationError';

export interface BattleResultGetRequest {
    battleId: BattleEntityType['id'];
}

export interface BattleResultGetResponse {
    battleId: BattleEntityType['id'];
    winner: {
        username: UserEntityType['username'];
        score: BattleStatsEntityType['score'];
        isCurrentUser: boolean;
    } | null;
}

export type BattleResultGetError = 'BattleNotFound' | 'BattleNotReady';

export interface BattleResultGetPort {
    getBattleResult(
        params: BattleResultGetRequest,
    ): Promise<BattleResultGetResponse | ApplicationError<BattleResultGetError>>;
}
