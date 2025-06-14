// domain/user.ts

import { Dayjs } from 'dayjs';

export type UserRole = 'ADMIN' | 'PLAYER';

export interface UserEntityType {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export const UserEntity = {
  isNikita(username: UserEntityType['username']): boolean {
    return username.toLowerCase() === 'никита';
  },
};
