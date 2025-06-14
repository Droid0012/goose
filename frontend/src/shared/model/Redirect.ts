export type ViewTarget = '_blank' | '_self' | '_parent'

export interface RouteChangeConfig {
  replace?: boolean
  target?: ViewTarget
}

export class Redirect {
  constructor(
    public readonly to: string,
    public readonly config?: {
      replace?: boolean
      target?: RouteChangeConfig
    },
  ) {}
}
