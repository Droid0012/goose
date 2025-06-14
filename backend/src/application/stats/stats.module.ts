import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { StatsController } from './stats.controller';
import { GetBattleResultsUseCase } from './get-battle-results.ts/get-battle-results.use-case';
import { PrismaTransactionManager } from './get-battle-results.ts/impl/transaction-manger';

@Module({
  imports: [PrismaModule],
  providers: [
    GetBattleResultsUseCase,
    {
      provide: 'TransactionManager',
      useClass: PrismaTransactionManager,
    },
  ],
  exports: [GetBattleResultsUseCase],
  controllers: [StatsController],
})
export class StatsModule {}
