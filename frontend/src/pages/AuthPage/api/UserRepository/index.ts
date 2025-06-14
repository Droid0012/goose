import { type ConfigProviderType, configProvider } from 'src/shared/ConfigProvider';
import type { FetcherType } from 'src/shared/api/fetcher';
import { getFetcher } from 'src/shared/lib/FetcherStore';
import type { ApplicationError } from 'src/shared/model/ApplicationError';
import type {
    UserAuthGetErrorsType,
    UserAuthGetPort,
    UserAuthGetRequest,
    UserAuthGetResponse,
} from './UserAuthGetPort';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserRepositoryType extends UserAuthGetPort {}

class UserRepository implements UserRepositoryType {
    constructor(
        private readonly configProvider: ConfigProviderType,
        private readonly getFetcher: () => FetcherType,
    ) {}

    async getUserAuth(
        params: UserAuthGetRequest,
    ): Promise<UserAuthGetResponse | ApplicationError<UserAuthGetErrorsType>> {
        const result = await this.getFetcher()<UserAuthGetRequest, UserAuthGetErrorsType>(
            `${this.configProvider.GATEWAY_ORIGIN}/api/v1/auth/login`,
            {
                method: 'POST',
                body: params,
                credentials: 'include',
            },
        );

        if (result instanceof Error) {
            return result;
        }

        return {};
    }
}

export const userRepository = new UserRepository(configProvider, getFetcher);
