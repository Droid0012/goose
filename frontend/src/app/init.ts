import type { LoaderFunction } from 'react-router';

import type { PageInitConfigType } from 'src/shared/config/types';

import { ViewModel } from './model/ViewModel';

export const appInit = (component: React.FC): PageInitConfigType & { viewModel: ViewModel } => {
    const viewModel = new ViewModel();

    const loader: LoaderFunction = async () => {
        const data = await viewModel.init();
        return {
            data,
            viewModel,
        };
    };

    return {
        loader,
        viewModel,
        Component: component,
    };
};
