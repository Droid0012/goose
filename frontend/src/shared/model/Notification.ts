export interface NotificationType {
  type: 'success' | 'error' | 'info' | 'warning'
  content: {
    title: string
    children: string
  }
  behavior?: {
    id?: string
    manuallyClose?: boolean
    duration?: number
  }
}
