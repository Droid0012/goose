import { Dayjs } from 'dayjs';

export interface BattleStatsEntityType {
  id: string;
  battleId: string;
  userId: string;
  tapCount: number;
  score: number;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}
