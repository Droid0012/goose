import type { StorageRepositoryType } from 'src/shared/api/platform/StorageTypes'

export class SessionStorageAdapter {
  constructor(
    private readonly sessionStorageRepository: StorageRepositoryType,
    private readonly storageKey: string,
  ) {}

  private showBeforeSubZoneArchivingAlarmKey = `${this.storageKey}_sbszaa`
  private showBeforeCellArchivingAlarmKey = `${this.storageKey}_sbcaa`
  private showBeforeCellRemovingAlarmKey = `${this.storageKey}_sbcra`

  get showBeforeSubZoneArchivingAlarm(): boolean {
    return this.sessionStorageRepository.get<boolean>(this.showBeforeSubZoneArchivingAlarmKey) ?? true
  }

  set showBeforeSubZoneArchivingAlarm(value: boolean) {
    this.sessionStorageRepository.set<boolean>(this.showBeforeSubZoneArchivingAlarmKey, value)
  }
  //

  get showBeforeCellArchivingAlarm(): boolean {
    return this.sessionStorageRepository.get<boolean>(this.showBeforeCellArchivingAlarmKey) ?? true
  }

  set showBeforeCellArchivingAlarm(value: boolean) {
    this.sessionStorageRepository.set<boolean>(this.showBeforeCellArchivingAlarmKey, value)
  }

  //
  get showBeforeCellRemovingAlarm(): boolean {
    return this.sessionStorageRepository.get<boolean>(this.showBeforeCellRemovingAlarmKey) ?? true
  }

  set showBeforeCellRemovingAlarm(value: boolean) {
    this.sessionStorageRepository.set<boolean>(this.showBeforeCellRemovingAlarmKey, value)
  }
}
