import { Request } from 'express';
import { UserEntityType } from 'src/domain/entities/user';

export interface RequestWithUser extends Request {
  user: Pick<UserEntityType, 'id' | 'username' | 'role'>;
}
