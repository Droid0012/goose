import dayjs, { Dayjs } from 'dayjs';

export interface BattleEntityType {
  id: string;
  startAt: Dayjs;
  endAt: Dayjs;
  resultsCalculated: boolean;
  winnerId?: string | null;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export const BattleEntity = {
  isActive(
    startAt: BattleEntityType['startAt'],
    endAt: BattleEntityType['endAt'],
  ): boolean {
    const now = dayjs();

    return !startAt.isAfter(now) && !endAt.isBefore(now);
  },

  hasEnded(endAt: BattleEntityType['endAt']): boolean {
    const now = dayjs();

    return now.isAfter(endAt);
  },
};
