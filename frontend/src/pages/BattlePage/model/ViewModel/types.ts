import type { BattleEntityType } from 'src/entities/Battle';
import type { BattleStatsEntityType } from 'src/entities/BattleStats';
import type { UserEntityType } from 'src/entities/User';
import type { ViewModelType } from 'src/shared/config/types';

export type SharedStateType = Record<string, never>;

export interface StateType extends ViewModelType<SharedStateType> {
    battle: {
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
    };
    results: {
        battleId: BattleEntityType['id'];
        winner: {
            username: UserEntityType['username'];
            score: BattleStatsEntityType['score'];
            isCurrentUser: boolean;
        } | null;
    } | null;
}
