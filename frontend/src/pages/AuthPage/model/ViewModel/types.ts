import type { UserEntityType } from 'src/entities/User';
import type { ViewModelType } from 'src/shared/config/types';

export type SharedStateType = {
    from: string;
};

export interface AuthForm {
    username: UserEntityType['username'];
    password: UserEntityType['password'];
}

export interface StateType extends ViewModelType<SharedStateType> {
    auth: {
        validationErros: Partial<Record<keyof AuthForm, string>>;
    };
}
