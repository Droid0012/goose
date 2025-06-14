import type { PartialVMWithMetaType } from 'src/shared/config/types';
import { AbstractViewModel } from 'src/shared/model/AbstractViewModel';
import type { AppFunctionalityType } from 'src/shared/model/AppFunctionality';

import type { AppStateType } from './types';

export class ViewModel extends AbstractViewModel<AppStateType> implements AppFunctionalityType {
    constructor() {
        super();
    }

    init = (): PartialVMWithMetaType<AppStateType> => {
        this.viewModel = {
            location: {},
            isLoading: false,
        };

        return {
            state: this.viewModel,
        };
    };

    beforeUnload = () => {
        //
    };

    // ############################# APP TITLE #############################

    setAppTitle = (title: string) => {
        if (title) {
            setTimeout(() => {
                document.title = title;
            });
        }
    };
}
