export interface ConfigProviderType {
    GATEWAY_ORIGIN: string;
    APP_ORIGIN: string;
}

class ConfigProvider implements ConfigProviderType {
    constructor() {
        this._GATEWAY_ORIGIN = import.meta.env.VITE_GATEWAY_ORIGIN;
        this._APP_ORIGIN = import.meta.env.VITE_APP_ORIGIN;
    }
    private readonly _GATEWAY_ORIGIN;
    private readonly _APP_ORIGIN;

    get GATEWAY_ORIGIN() {
        return this._GATEWAY_ORIGIN;
    }

    get APP_ORIGIN() {
        return this._APP_ORIGIN;
    }
}

export const configProvider: ConfigProviderType = new ConfigProvider();
