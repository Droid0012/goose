import type { PartialVMWithMetaType, ViewModelType } from '../config/types';

export abstract class AbstractViewModel<T extends ViewModelType<object>> {
    protected viewModel!: T;
    public observer: ((value: Readonly<PartialVMWithMetaType<T>>) => unknown) | null = null;

    public abstract init(
        ...args: unknown[]
    ): Promise<PartialVMWithMetaType<T>> | PartialVMWithMetaType<T>;

    protected updateVM<P extends Partial<T> | Record<string, never>>(
        data: PartialVMWithMetaType<P>,
    ): PartialVMWithMetaType<P> {
        if (Object.keys(data.state).length) {
            this.viewModel = {
                ...this.viewModel,
                ...data.state,
            };
        }

        if (this.observer) {
            this.observer({
                state: this.viewModel,
                redirect: data.redirect,
                notification: data.notification,
            });
        }

        return data;
    }

    public abstract beforeUnload?(): unknown;
}
