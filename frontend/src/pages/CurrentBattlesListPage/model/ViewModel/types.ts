import type { BattleEntityType } from 'src/entities/Battle';
import type { ViewModelType } from 'src/shared/config/types';

export interface CurrentBattlesListItem {
    id: BattleEntityType['id'];
    startAt: string;
    endAt: string;
    createdAt: string;
    gameUrl: string;
}

export type SharedStateType = Record<string, never>;

export interface StateType extends ViewModelType<SharedStateType> {
    viewCurrentBattlesList: {
        list: CurrentBattlesListItem[];
    };
}
