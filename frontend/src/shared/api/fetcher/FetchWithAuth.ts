import { ApplicationError } from '../../model/ApplicationError';
import type { FetchAndHandleErrors } from './FetchAndHandleErrors';
import type { FetcherType } from './types';

export interface FetchWithAuthConfig {
    fetcher: FetchAndHandleErrors;
    authConfig?: {
        refreshTokens: () => Promise<void>;
        isAuthProblem: (error: ApplicationError) => boolean;
    };
}

export class FetchWithAuth {
    constructor(private readonly config: FetchWithAuthConfig) {}

    private refreshPromise: Promise<void> | null = null;

    private async refreshTokenIfNeeded() {
        if (this.refreshPromise) {
            return this.refreshPromise; // Если обновление уже началось, ждем его завершения
        }

        this.refreshPromise = this.config
            .authConfig!.refreshTokens()
            .catch(() => {
                console.error('Auth error');
            })
            .finally(() => {
                this.refreshPromise = null;
            });

        return this.refreshPromise;
    }

    fetchWithAuth = async <TResponse, E extends string = string>(
        ...args: Parameters<FetcherType>
    ) => {
        const to = args[0];
        const params = args[1] ? args[1] : {};

        if (!this.config.authConfig) {
            return await this.config.fetcher.fetchAndHandleErrors<TResponse, E>(to, params);
        }

        const result = await this.config.fetcher.fetchAndHandleErrors<TResponse, E>(to, params);

        if (result instanceof ApplicationError) {
            if (this.config.authConfig.isAuthProblem(result)) {
                await this.refreshTokenIfNeeded(); // Дождаться обновления токена, если нужно
                return await this.config.fetcher.fetchAndHandleErrors<TResponse, E>(to, params);
            }
        }

        return result;
    };
}
