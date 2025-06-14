import type { FC } from 'react';
import type { LoaderFunction, ShouldRevalidateFunction } from 'react-router';
import type { Redirect } from '../model/Redirect';
import type { NotificationType } from '../model/Notification';

export interface PageConfigType {
    title: string;
    route: string;
}

export interface PageInitConfigType {
    Component: FC;
    loader?: LoaderFunction;
    shouldRevalidate?: ShouldRevalidateFunction;
}

export interface RouteConfigType<T = object> {
    path?: string;
    query?: T;
    hash?: string;
}

export interface ViewModelType<T> {
    location: RouteConfigType<Partial<T>>;
}

export interface PartialVMWithMetaType<T> {
    state: T;
    redirect?: Redirect;
    notification?: NotificationType;
}
