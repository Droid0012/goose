import { BattleEntityType } from 'src/domain/entities/battle';
import { BattleRepository } from './battle.repository';
import { UserEntityType } from 'src/domain/entities/user';
import dayjs from 'dayjs';
import { Injectable, Inject } from '@nestjs/common';

export interface CreateBattleCommand {
  user: Pick<UserEntityType, 'id' | 'username' | 'role'>;
}

export interface CreateBattleResult extends BattleEntityType {}

@Injectable()
export class CreateBattleUseCase {
  constructor(
    @Inject('CreateBattle_BattleRepository')
    private readonly battleRepo: BattleRepository,
    @Inject('BATTLE_COOLDOWN_SECS')
    private readonly battleCooldownInSecs: number,
    @Inject('BATTLE_DURATION_SECS')
    private readonly battleDurationInSecs: number,
  ) {}

  async execute(): Promise<CreateBattleResult> {
    const now = dayjs();
    const startAt = now.add(this.battleCooldownInSecs, 'second');
    const endAt = startAt.add(this.battleDurationInSecs, 'second');

    const createdBattle = await this.battleRepo.create({
      startAt,
      endAt,
    });

    return createdBattle;
  }
}
