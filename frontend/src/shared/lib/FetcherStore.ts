import type { FetcherType } from './../api/fetcher/types';

let fetcher: FetcherType | null = null;

export function setFetcher(f: FetcherType) {
    fetcher = f;
}

export function getFetcher(): FetcherType {
    if (!fetcher) throw new Error('Fetcher not set. Did you forget to call setFetcher()?');
    return fetcher;
}
