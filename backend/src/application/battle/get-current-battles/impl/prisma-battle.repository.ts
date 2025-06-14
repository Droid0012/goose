import { Injectable } from '@nestjs/common';
import { BattleRepository } from '../battle.repository';
import { BattleEntityType } from 'src/domain/entities/battle';
import dayjs, { Dayjs } from 'dayjs';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class PrismaBattleRepository implements BattleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCurrentBattles(now: Dayjs): Promise<BattleEntityType[]> {
    const battles = await this.prisma.battles.findMany({
      where: {
        endAt: {
          gt: now.toDate(),
        },
      },
    });

    return battles.map((battle) => ({
      ...battle,
      startAt: dayjs(battle.startAt),
      endAt: dayjs(battle.endAt),
      createdAt: dayjs(battle.createdAt),
      updatedAt: dayjs(battle.updatedAt),
    }));
  }
}
