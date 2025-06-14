import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { BattleRepository } from '../battle.repository';
import { BattleStatsRepository } from '../battle-stats.repository';
import { PrismaBattleRepository } from './prisma-battle.repository';
import { PrismaBattleStatsRepository } from './prisma-battle-stats.repository';
import { TransactionManager } from '../transaction-manager';

@Injectable()
export class PrismaTransactionManager implements TransactionManager {
  constructor(private readonly prismaService: PrismaService) {}

  async runInTransaction<T>(
    callback: (repos: {
      battleRepo: BattleRepository;
      battleStatsRepo: BattleStatsRepository;
    }) => Promise<T>,
  ): Promise<T> {
    return this.prismaService.$transaction(async (tx) => {
      const battleRepo = new PrismaBattleRepository(tx as PrismaService);
      const battleStatsRepo = new PrismaBattleStatsRepository(
        tx as PrismaService,
      );
      return callback({ battleRepo, battleStatsRepo });
    });
  }
}
