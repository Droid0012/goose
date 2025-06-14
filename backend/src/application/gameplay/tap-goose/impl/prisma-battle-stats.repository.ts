import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { BattleStatsRepository } from '../battle-stats.repository';

@Injectable()
export class PrismaBattleStatsRepository implements BattleStatsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async incrementTapCount(battleId: string, userId: string): Promise<void> {
    await this.prismaService.$executeRawUnsafe(
      `
      INSERT INTO "BattleStats" 
        ("battleId", "userId", "tapCount", "score", "createdAt", "updatedAt")
      VALUES 
        ($1::uuid, $2::uuid, 1, 0, CURRENT_TIMESTAMP AT TIME ZONE 'UTC', CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
      ON CONFLICT 
        ("battleId", "userId")
      DO UPDATE SET
        "tapCount" = "BattleStats"."tapCount" + 1,
        "updatedAt" = CURRENT_TIMESTAMP AT TIME ZONE 'UTC';`,
      battleId,
      userId,
    );
  }
}
