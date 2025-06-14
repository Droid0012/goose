import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { BattleRepository } from '../battle.repository';
import { BattleEntityType } from 'src/domain/entities/battle';
import dayjs from 'dayjs';

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
}
