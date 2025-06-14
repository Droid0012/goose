import type { PartialVMWithMetaType } from 'src/shared/config/types';
import { AbstractViewModel } from 'src/shared/model/AbstractViewModel';
import type { AppFunctionalityType } from 'src/shared/model/AppFunctionality';

import type { StateType } from './types';
import { TapUseCase } from './useCase/Tap';
import type { BattleStatsRepositoryType } from '../../api/BattleStatsRepository';
import type { BattleEntityType } from 'src/entities/Battle';
import type { BattleRepositoryType } from '../../api/BattleRepository';

import type { BattleResultGetResponse } from '../../api/BattleRepository/BattleResultGetPort';

export class ViewModel extends AbstractViewModel<StateType> {
    constructor(
        private readonly appFunctionality: AppFunctionalityType,
        private readonly battleStatsRepository: BattleStatsRepositoryType,
        private readonly battleRepository: BattleRepositoryType,
    ) {
        super();

        this.authUseCase = new TapUseCase(this.battleStatsRepository);
    }

    private readonly authUseCase: TapUseCase;

    public async init(
        location: Partial<StateType['location']>,
        battleId: BattleEntityType['id'],
    ): Promise<PartialVMWithMetaType<StateType>> {
        this.appFunctionality.setAppTitle('pages.ArchivedEntitiesList.title');

        const battle = await this.battleStatsRepository.getBattleStat({
            battleId,
        });

        if (battle instanceof Error) {
            throw battle;
        }

        this.viewModel = {
            battle: battle,
            location,
            results: null,
        };

        return {
            state: this.viewModel,
        };
    }

    tap = async (): Promise<boolean> => {
        return await this.authUseCase.tap({
            battle: this.viewModel.battle,
        });
    };

    onBattleFinished = async () => {
        const getBattleResult = async (): Promise<BattleResultGetResponse | null> => {
            const r = await this.battleRepository.getBattleResult({
                battleId: this.viewModel.battle.battle.id,
            });

            if (r instanceof Error) {
                if (
                    r.message === 'NOT_FOUND' ||
                    r.message === 'BattleNotFound' ||
                    r.message === 'INTERNAL_SERVER_ERROR'
                ) {
                    return null;
                } else {
                    return new Promise(resolve => {
                        setTimeout(async () => {
                            resolve(await getBattleResult());
                        }, 3000);
                    });
                }
            }

            return r;
        };

        const result = await getBattleResult();

        if (!result) {
            return this.updateVM({
                state: {},
                notification: {
                    type: 'error',
                    content: {
                        title: 'Ошибка',
                        children: 'Не удалось загрузить результаты битвы',
                    },
                },
            });
        } else {
            this.updateVM({
                state: {
                    results: result,
                },
            });
        }
    };

    public override beforeUnload: (() => unknown) | undefined = () => {
        //
    };
}
