import type { PartialVMWithMetaType } from 'src/shared/config/types';
import type { AuthForm, StateType } from '../types';
import type { UserRepositoryType } from 'src/pages/AuthPage/api/UserRepository';
import type { NotificationType } from 'src/shared/model/Notification';
import { Redirect } from 'src/shared/model/Redirect';

export class AuthUseCase {
    constructor(private readonly userRepository: UserRepositoryType) {}

    public async auth(
        form: AuthForm,
        state: Pick<StateType, 'location'>,
    ): Promise<PartialVMWithMetaType<Record<string, never>>> {
        const res = await this.userRepository.getUserAuth(form);
        let notification: NotificationType | undefined = undefined;
        let redirect: Redirect | undefined = undefined;

        if (res instanceof Error) {
            notification = {
                type: 'error',
                content: {
                    title: 'Ошибка',
                    children: res.code === 401 ? 'Неправильный логин или пароль' : 'Ошибка сервера',
                },
            };
        } else {
            redirect = new Redirect(state.location.query?.from ?? '/current-battles');
        }

        return {
            notification,
            redirect,
            state: {},
        };
    }
}
