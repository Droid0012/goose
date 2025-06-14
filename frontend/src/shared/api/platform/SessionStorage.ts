import type { StorageRepositoryType } from './StorageTypes'
import { extendedJSONReplacer, extendedJSONReviver } from './helpers/extended-json-parsing'

const numberPrefix = '__NUMBER__'
const booleanPrefix = '__BOOLEAN__'

class SessionStorageRepository implements StorageRepositoryType {
  get<T extends string | object | number | boolean | undefined | null>(key: string): T | null {
    const result: T | string | null = sessionStorage.getItem(key)

    if (result === null || result === undefined || result === '') {
      return null
    }

    if (result.startsWith(numberPrefix)) {
      const number = +result.substring(numberPrefix.length)

      return (!isNaN(number) ? number : null) as T
    }

    if (result.startsWith(booleanPrefix)) {
      const boolean = result.substring(booleanPrefix.length)

      return (boolean === '1') as T
    }

    try {
      return JSON.parse(result, extendedJSONReviver) as T
    } catch (e) {
      return result as T
    }
  }

  set<T extends string | object | number | boolean | undefined | null>(key: string, value: T): boolean {
    if (value === null || value === undefined || value === '') {
      sessionStorage.removeItem(key)
      return true
    }

    if (typeof value === 'string') {
      sessionStorage.setItem(key, value)
      return true
    }

    if (typeof value === 'number') {
      sessionStorage.setItem(key, numberPrefix + value)
      return true
    }

    if (typeof value === 'boolean') {
      sessionStorage.setItem(key, booleanPrefix + (value ? '1' : '0'))
      return true
    }

    try {
      sessionStorage.setItem(key, JSON.stringify(value, extendedJSONReplacer))
    } catch (e) {
      console.error(`SessionStorageRepository: const save value for key ${key}`)
      console.error(e)
      return false
    }

    return true
  }

  update<T extends string | object | undefined | null>(key: string, value: T): boolean {
    const oldValue = this.get<T>(key)

    if (!oldValue || typeof oldValue !== 'object') {
      return this.set<T>(key, value)
    }

    if (Array.isArray(oldValue) && Array.isArray(value)) {
      return this.set<T>(key, [...oldValue, ...value] as T)
    }

    return this.set<T>(key, { ...oldValue, ...(value as object) } as T)
  }

  updateAndReturnNewValue<T extends string | object | undefined | null>(key: string, value: Partial<T>): T | null {
    const oldValue = this.get<T>(key)
    let newValue: T | null = oldValue

    if (!oldValue || typeof oldValue !== 'object') {
      newValue = value as T
    }

    if (Array.isArray(oldValue) && Array.isArray(value)) {
      newValue = [...oldValue, ...value] as T
    }
    if (typeof oldValue === 'object') {
      newValue = { ...oldValue, ...value } as T
    }
    const result = this.set<T>(key, { ...(oldValue as object), ...value } as T)
    return result ? newValue : oldValue
  }
}

export const sessionStorageRepository = new SessionStorageRepository()
