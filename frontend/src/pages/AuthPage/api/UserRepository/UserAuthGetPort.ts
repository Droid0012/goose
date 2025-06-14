import type { UserEntityType } from 'src/entities/User';
import type { ApplicationError } from 'src/shared/model/ApplicationError';

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface UserAuthGetRequest {
    username: UserEntityType['username'];
    password: UserEntityType['password'];
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface UserAuthGetResponse {}

export type UserAuthGetErrorsType = '';

export interface UserAuthGetPort {
    getUserAuth(
        params: UserAuthGetRequest,
    ): Promise<UserAuthGetResponse | ApplicationError<UserAuthGetErrorsType>>;
}
