import { ApplicationError, type HTTPErrorCode } from '../../model/ApplicationError';
import { API_CACHE_KEY } from './constants';
import type { CustomFetchOptions, RespType } from './types';

function isContentJSON(contentType: string): boolean {
    return contentType.includes('application') && contentType.includes('json');
}

export class FetchAndHandleErrors {
    /**
     * Рекурсивно сортирует объект и массивы внутри него
     */
    private normalizeObject(obj: object): object {
        if (Array.isArray(obj)) {
            return obj.map(this.normalizeObject).sort(); // Рекурсивно сортируем массив
        }

        if (typeof obj === 'object' && !(obj instanceof Blob) && !(obj instanceof FormData)) {
            return Object.keys(obj)
                .sort()
                .reduce((acc, key) => {
                    if (key in obj) {
                        acc[key] = this.normalizeObject(obj[key as keyof typeof obj]);
                    }
                    return acc;
                }, {} as Record<string, object>); // Сортируем ключи и рекурсивно нормализуем значения
        }

        return obj;
    }

    /**
     * Кодирует тело запроса в query-параметр (если это объект)
     */
    private encodeCacheKey(url: string, body?: CustomFetchOptions['body']): string {
        if (!body) {
            return url;
        }

        // Если строка или число, не передаем в `normalizeObject`
        if (typeof body === 'string' || typeof body === 'number') {
            return `${url}?__body__=${encodeURIComponent(String(body))}`;
        }

        const normalizedBody = this.normalizeObject(body); // Теперь всегда объект
        const encodedBody = encodeURIComponent(JSON.stringify(normalizedBody)); // Кодируем JSON
        return `${url}?__body__=${encodedBody}`;
    }

    /**
     * Получает данные из Cache API
     */
    private async getFromCache<T>(cacheKey: string): Promise<T | Blob | null> {
        const cache = await caches.open(API_CACHE_KEY);
        const cachedResponse = await cache.match(cacheKey);

        if (!cachedResponse) {
            return null;
        }

        // Проверяем, JSON это или нет
        const contentType = cachedResponse.headers.get('Content-Type') || '';

        if (isContentJSON(contentType)) {
            const cachedData: { timestamp: number; ttl: number; response: T } =
                await cachedResponse.json();

            if (Date.now() - cachedData.timestamp > cachedData.ttl * 1000) {
                await cache.delete(cacheKey); // Если TTL истек - удаляем из кеша
                return null;
            }

            return cachedData.response;
        }

        // Если это бинарные данные, возвращаем их как Blob
        return await cachedResponse.blob();
    }

    /**
     * Сохраняет ответ в Cache API
     */
    private async saveToCache(cacheKey: string, response: Response, ttl: number): Promise<void> {
        if (!response.ok) {
            return;
        } // Не кешируем ошибки

        const cache = await caches.open(API_CACHE_KEY);

        // Проверяем Content-Type
        const contentType = response.headers.get('Content-Type') || '';

        if (isContentJSON(contentType)) {
            // Если JSON - сохраняем как объект
            const responseData = await response
                .clone()
                .json()
                .catch(() => null);
            if (!responseData) {
                return;
            }

            const cachedResponse = new Response(
                JSON.stringify({ timestamp: Date.now(), ttl, response: responseData }),
                {
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            await cache.put(new Request(cacheKey), cachedResponse);
        } else {
            // Если это бинарные данные - сохраняем их напрямую
            const cachedResponse = response.clone();
            await cache.put(new Request(cacheKey), cachedResponse);
        }
    }

    /**
     * Формирует тело запроса
     */
    private handleBody(options: CustomFetchOptions): RequestInit {
        const { body, headers, method, ...restOptions } = options;

        const newOptions: RequestInit = { ...restOptions, method: method?.toUpperCase() || 'POST' };

        if (body == null) {
            return newOptions;
        } // Если тела нет - сразу возвращаем

        if (typeof body === 'object' && !(body instanceof Blob) && !(body instanceof FormData)) {
            const newHeaders = new Headers(headers);
            if (!newHeaders.has('Content-Type')) {
                newHeaders.set('Content-Type', 'application/json');
            }

            return { ...newOptions, headers: newHeaders, body: JSON.stringify(body) };
        }

        if (typeof body === 'number' || typeof body === 'string') {
            return { ...newOptions, body: String(body) };
        }

        return { ...newOptions, body };
    }

    /**
     * Выполняет `fetch` с кэшированием через Cache API
     */
    private async fetchWithCache<T>(
        to: Parameters<typeof fetch>[0],
        options: CustomFetchOptions,
    ): ReturnType<typeof fetch> {
        if (!options.cacheLiveTimeInsSecs) {
            return fetch(to, this.handleBody(options));
        }

        const url: string =
            typeof to === 'string' ? to : to instanceof URL ? to.toString() : to.url;
        const cacheKey = this.encodeCacheKey(url, options.body);

        const cachedData = await this.getFromCache<T>(cacheKey);
        if (cachedData) {
            return new Response(JSON.stringify(cachedData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const response = await fetch(to, this.handleBody(options));
        if (response.ok) {
            await this.saveToCache(cacheKey, response, options.cacheLiveTimeInsSecs);
        }

        return response;
    }

    fetchAndHandleErrors = async <TResponse, E extends string = string>(
        ...args: Parameters<typeof this.fetchWithCache>
    ): Promise<RespType<TResponse, E>> => {
        try {
            const response = await this.fetchWithCache(...args);

            const contentType = response.headers.get('Content-Type') || '';

            if (response.ok) {
                if (isContentJSON(contentType)) {
                    const r = (await this.parseSecure(response)) as object;

                    if ('applicationError' in r) {
                        return new ApplicationError(r.applicationError as E);
                    }

                    return r as TResponse;
                } else {
                    return response.body as RespType<TResponse, E>;
                }
            } else {
                if (isContentJSON(contentType)) {
                    const body = await this.parseSecure(response);

                    if (typeof body === 'object' && 'applicationError' in body!) {
                        return new ApplicationError<E>(body.applicationError as E);
                    }
                }

                return new ApplicationError<E>(response.status as HTTPErrorCode);
            }
        } catch (e) {
            console.error('FETCH ERROR', e);
            return new ApplicationError<E>('INTERNAL_SERVER_ERROR') as ApplicationError<E>;
        }
    };

    private async parseSecure<T>(r: Response): Promise<T | undefined> {
        try {
            return (await r.json()) as T;
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }
}
