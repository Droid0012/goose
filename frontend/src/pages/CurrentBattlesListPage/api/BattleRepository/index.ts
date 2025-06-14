import { type ConfigProviderType, configProvider } from 'src/shared/ConfigProvider';
import type { FetcherType } from 'src/shared/api/fetcher';
import { getFetcher } from 'src/shared/lib/FetcherStore';
import type { ApplicationError } from 'src/shared/model/ApplicationError';
import type {
    CurrentBattleListGetErrors,
    CurrentBattleListGetPort,
    CurrentBattleListGetResponse,
} from './CurrentBattleListGetPort';
import type { BattleEntityType } from 'src/entities/Battle';
import type { UserEntityType } from 'src/entities/User';
import dayjs from 'dayjs';
import type {
    BattleCreateErrors,
    BattleCreatePort,
    BattleCreateResponse,
} from './BattleCreatePort';

export interface BattleRepositoryType extends CurrentBattleListGetPort, BattleCreatePort {}

class BattleRepository implements BattleRepositoryType {
    constructor(
        private readonly configProvider: ConfigProviderType,
        private readonly getFetcher: () => FetcherType,
    ) {}

    async getCurrentBattles(): Promise<
        CurrentBattleListGetResponse | ApplicationError<CurrentBattleListGetErrors>
    > {
        const result = await this.getFetcher()<
            {
                data: {
                    battles: {
                        id: BattleEntityType['id'];
                        startAt: string; // ISO 8601 format
                        endAt: string; // ISO 8601 format
                        winnerId: UserEntityType['id'] | null;
                        createdAt: string; // ISO 8601 format
                    }[];
                };
            },
            CurrentBattleListGetErrors
        >(`${this.configProvider.GATEWAY_ORIGIN}/api/v1/battles/current`, {
            method: 'GET',
            credentials: 'include',
        });

        if (result instanceof Error) {
            return result;
        }

        return {
            battles: result.data.battles.map(battle => ({
                id: battle.id,
                startAt: dayjs(battle.startAt),
                endAt: dayjs(battle.endAt),
                winnerId: battle.winnerId,
                createdAt: dayjs(battle.createdAt),
            })),
        };
    }

    async createBattle(): Promise<BattleCreateResponse | ApplicationError<BattleCreateErrors>> {
        const result = await this.getFetcher()<
            {
                data: {
                    id: BattleEntityType['id'];
                    startAt: string; // ISO 8601 format
                    endAt: string; // ISO 8601 format
                    createdAt: string; // ISO 8601 format
                };
            },
            BattleCreateErrors
        >(`${this.configProvider.GATEWAY_ORIGIN}/api/v1/battles`, {
            method: 'POST',
            credentials: 'include',
        });

        if (result instanceof Error) {
            return result;
        }

        return {
            data: {
                id: result.data.id,
                startAt: dayjs(result.data.startAt),
                endAt: dayjs(result.data.endAt),
                createdAt: dayjs(result.data.createdAt),
            },
        };
    }
}

export const battleRepository = new BattleRepository(configProvider, getFetcher);
