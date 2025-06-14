import type { CreatingSubZoneType } from 'src/features/CreateSubZone'
import type { StorageRepositoryType } from 'src/shared/api/platform/StorageTypes'

export class StorageAdapter {
  constructor(
    private readonly storageRepository: StorageRepositoryType,
    private readonly storageKey: string,
  ) {}

  private creatingSubZoneKey = `${this.storageKey}_csz`

  set creatingSubZone(createGate: Partial<CreatingSubZoneType>) {
    this.storageRepository.set(this.creatingSubZoneKey, createGate)
  }

  get creatingSubZone(): Partial<CreatingSubZoneType> {
    return this.storageRepository.get<Partial<CreatingSubZoneType>>(this.creatingSubZoneKey) ?? {}
  }
}
