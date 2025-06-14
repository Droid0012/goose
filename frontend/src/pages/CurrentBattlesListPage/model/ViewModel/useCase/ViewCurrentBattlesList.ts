import type { BattleRepositoryType } from 'src/pages/CurrentBattlesListPage/api/BattleRepository';

import type { PartialVMWithMetaType } from 'src/shared/config/types';
import type { StateType } from '../types';
import { configProvider } from 'src/shared/ConfigProvider';

export class ViewCurrentBattlesListUseCase {
    constructor(private readonly battleRepository: BattleRepositoryType) {}

    public async init(
        state: Readonly<Pick<StateType, 'location'>>,
    ): Promise<PartialVMWithMetaType<Pick<StateType, 'viewCurrentBattlesList' | 'location'>>> {
        const res = await this.battleRepository.getCurrentBattles({});

        if (res instanceof Error) {
            throw res;
        } else {
            return {
                state: {
                    viewCurrentBattlesList: {
                        list: res.battles.map(battle => ({
                            id: battle.id,
                            startAt: battle.startAt.format('YYYY-MM-DD HH:mm:ss'),
                            endAt: battle.endAt.format('YYYY-MM-DD HH:mm:ss'),
                            createdAt: battle.createdAt.format('YYYY-MM-DD HH:mm:ss'),
                            gameUrl: `${configProvider.APP_ORIGIN}/battle/${battle.id}`,
                        })),
                    },
                    location: state.location,
                },
            };
        }
    }
}
