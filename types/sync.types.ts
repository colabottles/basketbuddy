export interface SyncOperation {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  table: 'lists' | 'list_items' | 'list_shares' | 'categories'
  data: any
  timestamp: number
  synced: boolean
  retries: number
}

export interface OfflineData {
  lists: Map<string, any>
  listItems: Map<string, any>
  syncQueue: SyncOperation[]
  lastSync: number
}