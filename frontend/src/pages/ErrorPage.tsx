import { Result } from 'antd';
import { useRouteError } from 'react-router';

import { ApplicationError } from 'src/shared/model/ApplicationError';

export const ErrorPage = () => {
    const error = useRouteError() as Error | ApplicationError;
    const code: number = error instanceof ApplicationError ? error.code ?? 503 : 503;

    return (
        <div
            className=""
            style={{
                height: '100vh',
                display: 'grid',
                gridTemplateColumns: '1fr',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Result
                title={code}
                subTitle={
                    error instanceof ApplicationError
                        ? error.message
                        : 'An unexpected error occurred.'
                }
            />
        </div>
    );
};
