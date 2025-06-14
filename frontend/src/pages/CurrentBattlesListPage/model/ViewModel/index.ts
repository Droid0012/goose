import type { PartialVMWithMetaType } from 'src/shared/config/types';
import { AbstractViewModel } from 'src/shared/model/AbstractViewModel';
import type { AppFunctionalityType } from 'src/shared/model/AppFunctionality';

import type { StateType } from './types';
import { ViewCurrentBattlesListUseCase } from './useCase/ViewCurrentBattlesList';
import type { BattleRepositoryType } from '../../api/BattleRepository';
import { CreateBattlesUseCase } from './useCase/CreateBattle';

export class ViewModel extends AbstractViewModel<StateType> {
    constructor(
        private readonly appFunctionality: AppFunctionalityType,
        private readonly battleRepository: BattleRepositoryType,
    ) {
        super();

        this.viewCurrentBattlesListUseCase = new ViewCurrentBattlesListUseCase(
            this.battleRepository,
        );

        this.createBattlesUseCase = new CreateBattlesUseCase(this.battleRepository);
    }

    private readonly viewCurrentBattlesListUseCase: ViewCurrentBattlesListUseCase;
    private readonly createBattlesUseCase: CreateBattlesUseCase;

    public async init(
        location: Partial<StateType['location']>,
    ): Promise<PartialVMWithMetaType<StateType>> {
        this.appFunctionality.setAppTitle('pages.ArchivedEntitiesList.title');

        const init = await this.viewCurrentBattlesListUseCase.init({
            location,
        });

        this.viewModel = init.state;

        return init;
    }

    createBattle = async (): Promise<
        PartialVMWithMetaType<Pick<StateType, 'viewCurrentBattlesList'>>
    > => {
        return this.updateVM(
            await this.createBattlesUseCase.createBattle({
                viewCurrentBattlesList: this.viewModel.viewCurrentBattlesList,
            }),
        );
    };

    public override beforeUnload: (() => unknown) | undefined = () => {
        //
    };
}
