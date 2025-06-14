import { UserEntityType } from 'src/domain/entities/user';

export type UserRole = UserEntityType['role'];

export interface JwtPayload {
  sub: UserEntityType['id'];
  username: string;
  role: UserRole;
}
