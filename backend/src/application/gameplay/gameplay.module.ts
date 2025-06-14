import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { TapGooseUseCase } from './tap-goose/tap-goose.use-case';
import { PrismaBattleRepository as TapGoosePrismaBattleRepository } from './tap-goose/impl/prisma-battle.repository';
import { PrismaBattleStatsRepository as TabGoosePrismaBattleStatsRepository } from './tap-goose/impl/prisma-battle-stats.repository';
import { GameplayController } from './gameplay.controller';
import { GetBattleStateUseCase } from './get-battle-state/get-battle-state.use-case';
import { PrismaBattleRepository as GetBattleStatePrismaBattleRepository } from './get-battle-state/impl/prisma-battle.repository';
import { PrismaBattleStatsRepository as GetBattleStatePrismaBattleStatsRepository } from './get-battle-state/impl/prisma-battle-stats.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    TapGooseUseCase,
    GetBattleStateUseCase,
    {
      provide: 'TapGoose_BattleRepository',
      useClass: TapGoosePrismaBattleRepository,
    },
    {
      provide: 'TapGoose_BattleStatsRepository',
      useClass: TabGoosePrismaBattleStatsRepository,
    },
    {
      provide: 'GetBattleState_BattleRepository',
      useClass: GetBattleStatePrismaBattleRepository,
    },
    {
      provide: 'GetBattleState_BattleStatsRepository',
      useClass: GetBattleStatePrismaBattleStatsRepository,
    },
  ],
  controllers: [GameplayController],
  exports: [TapGooseUseCase],
})
export class GameplayModule {}
