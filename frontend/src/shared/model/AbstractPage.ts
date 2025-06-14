import type { FC } from 'react'
import type { LoaderFunction, ShouldRevalidateFunction } from 'react-router'

export abstract class AbstractPage<T extends unknown[] = []> {
  public abstract init(...args: T): {
    Component: FC
    shouldRevalidate?: ShouldRevalidateFunction
    loader: LoaderFunction
  }
}
