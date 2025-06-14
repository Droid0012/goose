import { type ConfigProviderType, configProvider } from 'src/shared/ConfigProvider';
import type { FetcherType } from 'src/shared/api/fetcher';
import { getFetcher } from 'src/shared/lib/FetcherStore';
import type { ApplicationError } from 'src/shared/model/ApplicationError';

import type {
    BattleResultGetError,
    BattleResultGetPort,
    BattleResultGetRequest,
    BattleResultGetResponse,
} from './BattleResultGetPort';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BattleRepositoryType extends BattleResultGetPort {}

class BattleRepository implements BattleRepositoryType {
    constructor(
        private readonly configProvider: ConfigProviderType,
        private readonly getFetcher: () => FetcherType,
    ) {}

    async getBattleResult(
        params: BattleResultGetRequest,
    ): Promise<BattleResultGetResponse | ApplicationError<BattleResultGetError>> {
        const result = await this.getFetcher()<
            {
                data: BattleResultGetResponse;
            },
            BattleResultGetError
        >(`${this.configProvider.GATEWAY_ORIGIN}/api/v1/stats/battle/${params.battleId}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (result instanceof Error) {
            return result;
        }

        return result.data;
    }
}

export const battleRepository = new BattleRepository(configProvider, getFetcher);
