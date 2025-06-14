import type { PartialVMWithMetaType } from 'src/shared/config/types';
import { AbstractViewModel } from 'src/shared/model/AbstractViewModel';
import type { AppFunctionalityType } from 'src/shared/model/AppFunctionality';

import type { AuthForm, StateType } from './types';
import { AuthUseCase } from './useCase/Auth';
import type { UserRepositoryType } from '../../api/UserRepository';

export class ViewModel extends AbstractViewModel<StateType> {
    constructor(
        private readonly appFunctionality: AppFunctionalityType,
        private readonly userRepository: UserRepositoryType,
    ) {
        super();

        this.authUseCase = new AuthUseCase(this.userRepository);
    }

    private readonly authUseCase: AuthUseCase;

    public async init(
        location: Partial<StateType['location']>,
    ): Promise<PartialVMWithMetaType<StateType>> {
        this.appFunctionality.setAppTitle('pages.ArchivedEntitiesList.title');

        this.viewModel = {
            auth: {
                validationErros: {},
            },
            location,
        };

        return {
            state: this.viewModel,
        };
    }

    auth = async (form: AuthForm): Promise<PartialVMWithMetaType<Record<string, never>>> => {
        return this.updateVM(
            await this.authUseCase.auth(form, {
                location: this.viewModel.location,
            }),
        );
    };

    public override beforeUnload: (() => unknown) | undefined = () => {
        //
    };
}
