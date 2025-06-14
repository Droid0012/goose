import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { BattleEntityType } from 'src/domain/entities/battle';
import { UserEntityType } from 'src/domain/entities/user';
import { BattleRepository } from '../battle.repository';
import dayjs from 'dayjs';

@Injectable()
export class PrismaBattleRepository implements BattleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(battleId: BattleEntityType['id']) {
    const result = await this.prismaService.battles.findUnique({
      where: { id: battleId },
      include: { stats: { include: { user: true } } },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      endAt: dayjs(result.endAt),
      winnerId: result.winnerId,
      resultsCalculated: !!result.resultsCalculated,
      stats: result.stats.map((s) => ({
        id: s.id,
        tapCount: s.tapCount,
        score: s.score,
        userId: s.userId,
        user: {
          id: s.user.id,
          username: s.user.username,
        },
      })),
    };
  }

  async updateWinnerAndFlag(
    battleId: BattleEntityType['id'],
    winnerId: UserEntityType['id'] | null,
  ) {
    const result = await this.prismaService.battles.update({
      where: { id: battleId },
      data: {
        winnerId,
        resultsCalculated: true,
      },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      winnerId: result.winnerId,
      resultsCalculated: !!result.resultsCalculated,
      endAt: dayjs(result.endAt),
      updatedAt: dayjs(result.updatedAt),
      createdAt: dayjs(result.createdAt),
    };
  }
}
