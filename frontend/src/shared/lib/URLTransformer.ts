import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';

import type { RouteConfigType } from '../config/types';

class URLTransformer {
    getURLWithoutOrigin(url: string): string {
        const matches = /(?:(^https?(:\/\/))?[^/]*)?(.*)/.exec(url);

        return matches?.length ? matches[3]! : '';
    }

    urlSearchParamsToObject<T extends object>(url: string, prefix = ''): T {
        if (!url) {
            return {} as T;
        }

        return url
            .replace(new RegExp('^[^\\?]*\\?'), '')
            .split('&')
            .reduce<T>((acc, el) => {
                // Проверка по префиксу
                if (prefix.length && !el.startsWith(prefix)) {
                    return acc;
                }
                el = el.substring(prefix.length);

                const keyAndValue = el.split('=');
                if (keyAndValue.length < 2) {
                    return acc;
                }

                //// работа с value
                let value: string | number | boolean;
                const rawValue = keyAndValue[1];
                if (!rawValue) {
                    return acc;
                }
                const rawValueLower = rawValue.toLowerCase();

                // Проверка на true или false
                if (rawValueLower === 'true') {
                    value = true;
                } else if (rawValueLower === 'false') {
                    value = false;
                } else {
                    const rawValueAsNumber = +rawValue;
                    value = isNaN(rawValueAsNumber)
                        ? decodeURIComponent(rawValue)
                        : rawValueAsNumber;
                }

                //// работа с key
                // Проверяем принадлежность пары к массиву

                let key: keyof T = keyAndValue[0] as keyof T;
                if (typeof key === 'symbol') {
                    return acc;
                }

                const isKeyValuePartOfArray = /.*\[\]$/.test(String(key));

                if (isKeyValuePartOfArray) {
                    key = camelCase(String(key).replace(/\[\]$/, '')) as keyof T;

                    let arr: (string | number | boolean)[] = [];
                    if (!acc[key]) {
                        acc[key] = arr as T[keyof T];
                    } else {
                        arr = acc[key] as (string | number | boolean)[];
                    }

                    arr.push(value);
                } else {
                    key = (typeof key === 'string' ? camelCase(key) : key) as keyof T;
                    acc[key] = value as T[keyof T];
                }

                return acc;
            }, {} as T);
    }

    getViewConfig<T extends object>(view: string): Required<RouteConfigType<T>> {
        const urlWithoutOrigin = this.getURLWithoutOrigin(view);

        return {
            path: urlWithoutOrigin.split('?')[0]!.split('#')[0] ?? '',
            query: this.urlSearchParamsToObject<T>(urlWithoutOrigin),
            hash: urlWithoutOrigin.includes('#') ? urlWithoutOrigin.split('#').pop()! : '',
        };
    }

    objectToUrlSearchParams<T extends object>(query: T, toCebabCase = true): string {
        const result = Object.entries(query)
            .reduce((acc: string[], [key, value]) => {
                const formattedKey = toCebabCase ? kebabCase(key) : key;

                if (!value || (Array.isArray(value) && !value.length)) {
                    return acc;
                }
                if (Array.isArray(value)) {
                    acc.push(
                        ...value.map(
                            (currentValue: string | number) => `${formattedKey}[]=${currentValue}`,
                        ),
                    );
                } else {
                    acc.push(`${formattedKey}=${encodeURIComponent(value)}`);
                }
                return acc;
            }, [])
            .join('&');

        return result ? `?${result}` : '';
    }

    createURLFromConfig(route: RouteConfigType): string {
        const path = route.path ?? location.pathname;
        const query = this.objectToUrlSearchParams(route.query ?? {});
        const hash = route.hash ?? '';

        return path + query + (hash ? `#${hash}` : '');
    }
}

export const urlTransformer = new URLTransformer();
