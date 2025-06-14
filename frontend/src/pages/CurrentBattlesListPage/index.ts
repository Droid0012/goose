import type { LoaderFunction } from 'react-router';

import type { PageInitConfigType } from 'src/shared/config/types';
import { urlTransformer } from 'src/shared/lib/URLTransformer';
import type { AppFunctionalityType } from 'src/shared/model/AppFunctionality';

import { ViewModel } from './model/ViewModel';
import type { SharedStateType } from './model/ViewModel/types';
import { UIController } from './ui/UIController';
import { battleRepository } from './api/BattleRepository';

export const init = (appFunctionality: AppFunctionalityType): PageInitConfigType => {
    const loader: LoaderFunction = router => {
        const viewConfig = urlTransformer.getViewConfig<Partial<SharedStateType>>(
            router.request.url,
        );

        const viewModel = new ViewModel(appFunctionality, battleRepository);

        return {
            data: viewModel.init(viewConfig),
            viewModel,
        };
    };

    return {
        Component: UIController,
        loader,
    };
};
