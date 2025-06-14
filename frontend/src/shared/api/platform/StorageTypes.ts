export interface StorageValueUpdatePortType {
  updateAndReturnNewValue<T extends string | object | undefined | null>(key: string, value: Partial<T>): T | null
}

export interface StorageGetPortType {
  get<T extends string | object | number | boolean | undefined | null>(key: string): T | null
}

export interface StorageSetPortType {
  set<T extends string | object | number | boolean | undefined | null>(key: string, value: T): boolean
}

export interface StorageUpdatePortType {
  update<T extends string | object | undefined | null>(key: string, value: T): boolean
}

export interface StorageRepositoryType
  extends StorageGetPortType,
    StorageSetPortType,
    StorageUpdatePortType,
    StorageValueUpdatePortType {}
