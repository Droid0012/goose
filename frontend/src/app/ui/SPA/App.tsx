import { StrictMode } from 'react';

import { appInit } from 'src/app/init';
import { DevLayout } from './Layout';
import { Providers } from './Providers';
import { FetchWithAuth } from 'src/shared/api/fetcher';
import { configProvider } from 'src/shared/ConfigProvider';
import { urlTransformer } from 'src/shared/lib/URLTransformer';
import { FetchAndHandleErrors } from 'src/shared/api/fetcher/FetchAndHandleErrors';
import { setFetcher } from 'src/shared/lib/FetcherStore';
import { getNavigate } from 'src/shared/lib/NavigateStore';

setFetcher(
    new FetchWithAuth({
        authConfig: {
            refreshTokens: async () => {
                const f = new FetchAndHandleErrors();

                const r = await f.fetchAndHandleErrors(
                    `${configProvider.GATEWAY_ORIGIN}/api/v1/auth/refresh`,
                    {
                        method: 'POST',
                        credentials: 'include',
                    },
                );

                if (r instanceof Error) {
                    getNavigate()(
                        `/auth?from=${encodeURIComponent(
                            urlTransformer.getURLWithoutOrigin(window.location.href),
                        )}`,
                    );
                }
            },
            isAuthProblem: e => {
                return e.message === 'UNAUTHORIZED';
            },
        },
        fetcher: new FetchAndHandleErrors(),
    }).fetchWithAuth,
);

export const SPAApp = () => {
    return (
        <StrictMode>
            <Providers init={appInit(DevLayout)} />
        </StrictMode>
    );
};
