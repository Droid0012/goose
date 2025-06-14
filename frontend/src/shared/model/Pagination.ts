export interface PaginationType {
  page: number
  size: number
}

export interface PaginationResponseType {
  page: number
  size: number
  total: number
}

export interface PaginationResponseAndResultType<T> extends PaginationResponseType {
  result: T[]
}
