let navigate: ((s: string) => unknown) | null = null;

export function setNavigate(n: (s: string) => unknown) {
    navigate = n;
}

export function getNavigate(): (s: string) => unknown {
    if (!navigate) throw new Error('Navigate not set. Did you forget to call setFetcher()?');
    return navigate;
}
