import { Injectable } from '@nestjs/common';
import { BattleRepository } from '../battle.repository';
import { BattleEntityType } from 'src/domain/entities/battle';
import dayjs, { Dayjs } from 'dayjs';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class PrismaBattleRepository implements BattleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: {
    startAt: Dayjs;
    endAt: Dayjs;
    totalScore: number;
    winnerId?: string | null;
  }): Promise<BattleEntityType> {
    const battle = await this.prisma.battles.create({
      data: {
        startAt: params.startAt.toDate(),
        endAt: params.endAt.toDate(),
        winnerId: params.winnerId ?? null,
      },
    });

    return {
      ...battle,
      startAt: dayjs(battle.startAt),
      endAt: dayjs(battle.endAt),
      createdAt: dayjs(battle.createdAt),
      updatedAt: dayjs(battle.updatedAt),
    };
  }
}
