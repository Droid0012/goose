import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { CreateBattleUseCase } from './create-battle/create-battle.use-case';
import { GetCurrentBattlesUseCase } from './get-current-battles/get-current-battles.use-case';
import { PrismaBattleRepository as CreateBattlePrismaBattleRepository } from './create-battle/impl/prisma-battle.repository';
import { PrismaBattleRepository as GetCurrentBattlesPrismaBattleRepository } from './get-current-battles/impl/prisma-battle.repository';
import { BattleController } from './battle.controller';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [
    CreateBattleUseCase,
    GetCurrentBattlesUseCase,
    {
      provide: 'CreateBattle_BattleRepository',
      useClass: CreateBattlePrismaBattleRepository,
    },
    {
      provide: 'GetCurrentBattles_BattleRepository',
      useClass: GetCurrentBattlesPrismaBattleRepository,
    },
    {
      provide: 'BATTLE_COOLDOWN_SECS',
      useFactory: (configService: ConfigService) =>
        +configService.getOrThrow<number>('COOLDOWN_DURATION'),
      inject: [ConfigService],
    },
    {
      provide: 'BATTLE_DURATION_SECS',
      useFactory: (configService: ConfigService) =>
        +configService.getOrThrow<number>('ROUND_DURATION'),
      inject: [ConfigService],
    },
  ],
  controllers: [BattleController],
  exports: [CreateBattleUseCase, GetCurrentBattlesUseCase],
})
export class BattleModule {}
