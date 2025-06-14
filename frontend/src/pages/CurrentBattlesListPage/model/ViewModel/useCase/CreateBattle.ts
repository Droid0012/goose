import type { BattleRepositoryType } from 'src/pages/CurrentBattlesListPage/api/BattleRepository';

import type { PartialVMWithMetaType } from 'src/shared/config/types';
import type { StateType } from '../types';
import type { NotificationType } from 'src/shared/model/Notification';
import { configProvider } from 'src/shared/ConfigProvider';

export class CreateBattlesUseCase {
    constructor(private readonly battleRepository: BattleRepositoryType) {}

    public async createBattle(
        state: Pick<StateType, 'viewCurrentBattlesList'>,
    ): Promise<PartialVMWithMetaType<Pick<StateType, 'viewCurrentBattlesList'>>> {
        let notification: NotificationType | undefined = undefined;
        const res = await this.battleRepository.createBattle({});
        let viewCurrentBattlesList = state.viewCurrentBattlesList;

        if (res instanceof Error) {
            notification = {
                type: 'error',
                content: {
                    title: 'Ошибка',
                    children: 'Не удалось создать битву',
                },
            };
        } else {
            notification = {
                type: 'success',
                content: {
                    title: 'Успешно',
                    children: 'Битва добавлена',
                },
            };

            viewCurrentBattlesList = {
                ...viewCurrentBattlesList,
                list: [
                    {
                        id: res.data.id,
                        startAt: res.data.startAt.format('YYYY-MM-DD HH:mm:ss'),
                        endAt: res.data.endAt.format('YYYY-MM-DD HH:mm:ss'),
                        createdAt: res.data.createdAt.format('YYYY-MM-DD HH:mm:ss'),
                        gameUrl: `${configProvider.APP_ORIGIN}/battle/${res.data.id}`,
                    },
                    ...state.viewCurrentBattlesList.list,
                ],
            };
        }

        return {
            state: {
                viewCurrentBattlesList,
            },
            notification,
        };
    }
}
