import { type ConfigProviderType, configProvider } from 'src/shared/ConfigProvider';
import type { FetcherType } from 'src/shared/api/fetcher';
import { getFetcher } from 'src/shared/lib/FetcherStore';
import type { ApplicationError } from 'src/shared/model/ApplicationError';
import type {
    BattleStatsUpdateError,
    BattleStatsUpdatePort,
    BattleStatsUpdateRequest,
    BattleStatsUpdateResponse,
} from './BattleStatsUpdatePort';
import type {
    BattleStatsGetError,
    BattleStatsGetPort,
    BattleStatsGetRequest,
    BattleStatsGetResponse,
} from './BattleStatsGetPort';

export interface BattleStatsRepositoryType extends BattleStatsUpdatePort, BattleStatsGetPort {}

class BattleStatsRepository implements BattleStatsRepositoryType {
    constructor(
        private readonly configProvider: ConfigProviderType,
        private readonly getFetcher: () => FetcherType,
    ) {}

    async updateBattleState(
        params: BattleStatsUpdateRequest,
    ): Promise<BattleStatsUpdateResponse | ApplicationError<BattleStatsUpdateError>> {
        const result = await this.getFetcher()<BattleStatsUpdateResponse, BattleStatsUpdateError>(
            `${this.configProvider.GATEWAY_ORIGIN}/api/v1/gameplay`,
            {
                method: 'PUT',
                body: params,
                credentials: 'include',
            },
        );

        if (result instanceof Error) {
            return result;
        }

        return {};
    }

    async getBattleStat(
        params: BattleStatsGetRequest,
    ): Promise<BattleStatsGetResponse | ApplicationError<BattleStatsGetError>> {
        const result = await this.getFetcher()<
            {
                data: BattleStatsGetResponse;
            },
            BattleStatsGetError
        >(
            `${this.configProvider.GATEWAY_ORIGIN}/api/v1/gameplay/battles/${params.battleId}/state`,
            {
                method: 'GET',
                credentials: 'include',
            },
        );

        if (result instanceof Error) {
            return result;
        }

        return {
            user: {
                alwaysZero: result.data.user.alwaysZero,
            },
            battle: {
                id: result.data.battle.id,
                startAt: result.data.battle.startAt,
                endAt: result.data.battle.endAt,
            },
            battleStats: {
                taps: result.data.battleStats.taps,
            },
            now: result.data.now,
        };
    }
}

export const battleStatsRepository = new BattleStatsRepository(configProvider, getFetcher);
