import { Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { TransactionManager } from './transaction-manager';
import { BattleEntityType } from 'src/domain/entities/battle';
import { ApplicationError } from 'src/shared/application-error';
import { UserEntity, UserEntityType } from 'src/domain/entities/user';
import { BattleStatsEntityType } from 'src/domain/entities/battle-stats';

export interface GetBattleResultsCommand {
  user: Pick<UserEntityType, 'id' | 'username' | 'role'>;
  battleId: BattleEntityType['id'];
}

export interface GetBattleResultsResult {
  battleId: BattleEntityType['id'];
  winner: {
    username: UserEntityType['username'];
    score: BattleStatsEntityType['score'];
    isCurrentUser: boolean;
  } | null;
}

@Injectable()
export class GetBattleResultsUseCase {
  constructor(
    @Inject('TransactionManager')
    private readonly transactionManager: TransactionManager,
  ) {}

  async execute(
    cmd: GetBattleResultsCommand,
  ): Promise<
    | GetBattleResultsResult
    | ApplicationError<'BattleNotFound' | 'BattleNotReady'>
  > {
    const { battleId, user } = cmd;
    const now = dayjs();
    const delayMs = 2000;

    return this.transactionManager.runInTransaction(
      async ({ battleRepo, battleStatsRepo }) => {
        const battle = await battleRepo.findById(battleId);

        if (!battle)
          return new ApplicationError('BattleNotFound', 'Battle not found');

        // Если есть пока нет результатов
        if (!battle.resultsCalculated) {
          const endTime = dayjs(battle.endAt).add(delayMs, 'millisecond');
          // Если еще куллдаун послк окончания
          if (now.isBefore(endTime))
            return new ApplicationError(
              'BattleNotReady',
              'Battle results are not ready yet',
            );

          // Рассчитываем очки и сразу ищем победителя
          const updates = battle.stats
            .filter(({ user }) => !UserEntity.isNikita(user.username))
            .map(({ id, userId, tapCount }) => ({
              id,
              userId,
              score: tapCount + Math.floor(tapCount / 11) * 10,
            }));

          await battleStatsRepo.applyScores(
            updates.map(({ id, score }) => ({ id, score })),
          );

          // Оптимизированный поиск победителя
          const winner = updates.reduce<{
            id: BattleStatsEntityType['id'];
            userId: UserEntityType['id'];
            score: BattleStatsEntityType['score'];
          } | null>(
            (top, u) =>
              u.score !== 0 && u.score > (top?.score || 0) ? u : top,
            null,
          );
          await battleRepo.updateWinnerAndFlag(
            battleId,
            winner?.userId || null,
          );

          return {
            battleId,
            winner: winner
              ? {
                  username: winner.userId,
                  score: winner.score,
                  isCurrentUser: winner.userId === user.id,
                }
              : null,
          };
        }
        // Если результаты уже рассчитаны, просто возвращаем их
        else {
          const winnerEntry = battle.stats.find(
            (s) => s.userId === battle.winnerId,
          );
          return {
            battleId,
            winner: winnerEntry
              ? {
                  username: winnerEntry.user.username,
                  score: winnerEntry.score,
                  isCurrentUser: winnerEntry.userId === user.id,
                }
              : null,
          };
        }
      },
    );
  }
}
