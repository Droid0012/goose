export type SortDirectionType = 'ascend' | 'descend' | 'none'

export interface SortType<T extends object> {
  sortBy: keyof T
  sortOrder: SortDirectionType
}
