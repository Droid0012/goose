import { PrismaService } from 'src/infrastructure/database/prisma.service';
import dayjs from 'dayjs';
import { BattleEntityType } from 'src/domain/entities/battle';
import { Injectable } from '@nestjs/common';
import { BattleRepository } from '../battle.repository';

@Injectable()
export class PrismaBattleRepository implements BattleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private toEntity(raw: {
    id: string;
    startAt: Date;
    endAt: Date;
    winnerId: string | null;
    resultsCalculated: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): BattleEntityType {
    return {
      id: raw.id,
      startAt: dayjs(raw.startAt),
      resultsCalculated: raw.resultsCalculated,
      endAt: dayjs(raw.endAt),
      winnerId: raw.winnerId,
      createdAt: dayjs(raw.createdAt),
      updatedAt: dayjs(raw.updatedAt),
    };
  }

  async findById(id: BattleEntityType['id']): Promise<BattleEntityType | null> {
    const battle = await this.prismaService.battles.findUnique({
      where: { id },
    });
    return battle ? this.toEntity(battle) : null;
  }

  async create(params: {
    startAt: dayjs.Dayjs;
    endAt: dayjs.Dayjs;
  }): Promise<BattleEntityType> {
    const created = await this.prismaService.battles.create({
      data: {
        startAt: params.startAt.toDate(),
        endAt: params.endAt.toDate(),
      },
    });

    return this.toEntity(created);
  }
}
