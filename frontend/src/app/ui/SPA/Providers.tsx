import { useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';

import { getRouteConfig } from 'src/app/lib/routes';
import type { ViewModel } from 'src/app/model/ViewModel';
import type { PageInitConfigType } from 'src/shared/config/types';
import { setNavigate } from 'src/shared/lib/NavigateStore';

interface ProvidersPropsType {
    init: PageInitConfigType & {
        viewModel: ViewModel;
    };
}

export const Providers = ({ init }: ProvidersPropsType) => {
    const routeConfig = useMemo(() => getRouteConfig(init), [init]);

    const router = createBrowserRouter(routeConfig);

    setNavigate(router.navigate)

    return <RouterProvider router={router} />;
};
