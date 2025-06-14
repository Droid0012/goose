import type { ApplicationError } from '../../model/ApplicationError';

export type CustomFetchOptions = Omit<RequestInit, 'body'> & {
    cacheLiveTimeInsSecs?: number;
    body?: BodyInit | object | string | number;
    headers?: Headers;
};

export type RespType<TResponse, E extends string = string> = TResponse | ApplicationError<E>;

export type FetcherType = <TResponse, E extends string = string>(
    to: Parameters<typeof fetch>[0],
    options: CustomFetchOptions,
) => Promise<RespType<TResponse, E>>;
