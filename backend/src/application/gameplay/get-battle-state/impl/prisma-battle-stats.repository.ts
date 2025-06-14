import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { BattleStatsRepository } from '../battle-stats.repository';
import { BattleEntityType } from 'src/domain/entities/battle';
import { BattleStatsEntityType } from 'src/domain/entities/battle-stats';
import { UserEntityType } from 'src/domain/entities/user';
import dayjs from 'dayjs';

@Injectable()
export class PrismaBattleStatsRepository implements BattleStatsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByBattleIdAndUserId(
    battleId: BattleEntityType['id'],
    userId: UserEntityType['id'],
  ): Promise<BattleStatsEntityType | null> {
    const r = await this.prismaService.battleStats.findFirst({
      where: {
        battleId,
        userId,
      },
    });

    if (!r) {
      return r;
    }

    return {
      ...r,
      createdAt: dayjs(r.createdAt),
      updatedAt: dayjs(r.updatedAt),
    };
  }
}
