import type { RouteObject } from 'react-router';

import { ErrorPage } from 'src/pages/ErrorPage';
import type { PageInitConfigType } from 'src/shared/config/types';

import type { ViewModel } from '../model/ViewModel';

export const getRouteConfig = ({
    viewModel,
    ...init
}: PageInitConfigType & {
    viewModel: ViewModel;
}): RouteObject[] => [
    {
        path: '/',
        ErrorBoundary: ErrorPage,
        ...init,
        children: [
            {
                path: 'current-battles',
                lazy: async () => {
                    return (await import('src/pages/CurrentBattlesListPage')).init(viewModel);
                },
                index: true,
            },
            {
                path: 'auth',
                lazy: async () => {
                    return (await import('src/pages/AuthPage')).init(viewModel);
                },
                index: true,
            },
            {
                path: 'battle/:battleId',
                lazy: async () => {
                    return (await import('src/pages/BattlePage')).init(viewModel);
                },
                index: true,
            },
        ],
    },
];
