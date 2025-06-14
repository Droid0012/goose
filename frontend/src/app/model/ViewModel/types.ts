import type { ViewModelType } from 'src/shared/config/types'

export interface AppStateType extends ViewModelType<object> {
  isLoading: boolean
}
