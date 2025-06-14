import { BattleEntity } from 'src/domain/entities/battle';
import { ApplicationError } from 'src/shared/application-error';
import { BattleStatsRepository } from './battle-stats.repository';
import { UserEntityType } from 'src/domain/entities/user';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { BattleRepository } from './battle.repository';

export interface ApplyTapCommand {
  battleId: string;
  user: Pick<UserEntityType, 'id' | 'username' | 'role'>;
}

@Injectable()
export class TapGooseUseCase {
  constructor(
    @Inject('TapGoose_BattleRepository')
    private readonly battleRepository: BattleRepository,
    @Inject('TapGoose_BattleStatsRepository')
    private readonly battleStatsRepository: BattleStatsRepository,
  ) {}

  async execute(
    cmd: ApplyTapCommand,
  ): Promise<void | ApplicationError<
    'BattleNotFound' | 'BattleInactive' | 'InternalError'
  >> {
    const { id: userId } = cmd.user;
    const { battleId } = cmd;

    const battle = await this.battleRepository.findById(battleId);

    if (!battle) {
      return new ApplicationError('BattleNotFound', 'Battle not found');
    }

    if (!BattleEntity.isActive(battle.startAt, battle.endAt)) {
      return new ApplicationError('BattleInactive', 'Battle is not active');
    }

    try {
      await this.battleStatsRepository.incrementTapCount(battleId, userId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      Logger.error(_err);
      return new ApplicationError('InternalError', 'Failed to apply tap');
    }
  }
}
