import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { GameplayModule } from './application/gameplay/gameplay.module';
import { BattleModule } from './application/battle/battle.module';
import { StatsModule } from './application/stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    GameplayModule,
    BattleModule,
    StatsModule,
  ],
})
export class AppModule {}
