import { BattleEntityType } from 'src/domain/entities/battle';
import { ApplicationError } from 'src/shared/application-error';
import { BattleStatsRepository } from './battle-stats.repository';
import { UserEntity, UserEntityType } from 'src/domain/entities/user';
import { Injectable, Inject } from '@nestjs/common';
import { BattleRepository } from './battle.repository';
import { BattleStatsEntityType } from 'src/domain/entities/battle-stats';
import dayjs, { Dayjs } from 'dayjs';

export interface GetBattleStateCommand {
  battleId: BattleEntityType['id'];
  user: Pick<UserEntityType, 'id' | 'username' | 'role'>;
}

export interface GetBattleStateResult {
  user: {
    alwaysZero: boolean;
  };
  battle: {
    id: BattleEntityType['id'];
    startAt: BattleEntityType['startAt'];
    endAt: BattleEntityType['endAt'];
  };
  battleStats: {
    taps: BattleStatsEntityType['tapCount'];
  };
  now: Dayjs;
}

@Injectable()
export class GetBattleStateUseCase {
  constructor(
    @Inject('GetBattleState_BattleRepository')
    private readonly battleRepository: BattleRepository,
    @Inject('GetBattleState_BattleStatsRepository')
    private readonly battleStatsRepository: BattleStatsRepository,
  ) {}

  async execute(
    cmd: GetBattleStateCommand,
  ): Promise<
    GetBattleStateResult | ApplicationError<'BattleNotFound' | 'InternalError'>
  > {
    const { battleId, user } = cmd;
    const alwaysZero = UserEntity.isNikita(user.username);

    // 1. Получаем битву
    const battle = await this.battleRepository.findById(battleId);
    if (!battle) {
      return new ApplicationError('BattleNotFound', 'Battle not found');
    }

    // 2. Получаем статистику пользователя
    const stats = await this.battleStatsRepository.findByBattleIdAndUserId(
      battleId,
      user.id,
    );

    // 3. Возвращаем данные, независимо от времени
    return {
      user: {
        alwaysZero,
      },
      battle: {
        id: battle.id,
        startAt: battle.startAt,
        endAt: battle.endAt,
      },
      battleStats: {
        taps: stats?.tapCount ?? 0,
      },
      now: dayjs(),
    };
  }
}
