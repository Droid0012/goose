import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { BattleStatsRepository, StatUpdate } from '../battle-stats.repository';

@Injectable()
export class PrismaBattleStatsRepository implements BattleStatsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async applyScores(updates: StatUpdate[]): Promise<void> {
    // Обновляем score для каждого участника
    await Promise.all(
      updates.map(({ id, score }) =>
        this.prismaService.battleStats.update({
          where: { id },
          data: { score },
        }),
      ),
    );
  }
}
