import { BattleEntityType } from 'src/domain/entities/battle';
import { BattleRepository } from './battle.repository';
import { UserEntityType } from 'src/domain/entities/user';
import dayjs from 'dayjs';
import { Injectable, Inject } from '@nestjs/common';

export interface GetCurrentBattlesCommand {
  user: Pick<UserEntityType, 'id' | 'username' | 'role'>;
}

export interface GetCurrentBattlesResult {
  result: Omit<BattleEntityType, 'winnerId'>[];
}

@Injectable()
export class GetCurrentBattlesUseCase {
  constructor(
    @Inject('GetCurrentBattles_BattleRepository')
    private readonly battleRepo: BattleRepository,
  ) {}

  async execute(): Promise<GetCurrentBattlesResult> {
    const now = dayjs();

    const battles = await this.battleRepo.findCurrentBattles(now);

    return {
      result: battles,
    };
  }
}
