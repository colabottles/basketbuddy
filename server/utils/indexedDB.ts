import { openDB, type IDBPDatabase } from 'idb'
import type { GroceryList, GroceryItem, ListShare, Category } from '~/types/models'
import type { SyncOperation } from '~/types/sync.types'

const DB_NAME = 'grocery-list-db'
const DB_VERSION = 2

export interface GroceryListDB {
  lists: {
    key: string
    value: GroceryList
    indexes: { 'by-updated': string }
  }
  listItems: {
    key: string
    value: GroceryItem
    indexes: { 'by-list': string; 'by-updated': string; 'by-category': string }
  }
  listShares: {
    key: string
    value: ListShare
    indexes: { 'by-list': string }
  }
  categories: {
    key: string
    value: Category
    indexes: { 'by-list': string }
  }
  syncQueue: {
    key: string
    value: SyncOperation
    indexes: { 'by-synced': number; 'by-timestamp': number }
  }
  metadata: {
    key: string
    value: any
  }
}

let dbInstance: IDBPDatabase<GroceryListDB> | null = null

export const initDB = async (): Promise<IDBPDatabase<GroceryListDB>> => {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<GroceryListDB>(DB_NAME, 2, { // Increment version
    upgrade(db, oldVersion, newVersion, transaction) {
      // Lists store
      if (!db.objectStoreNames.contains('lists')) {
        const listStore = db.createObjectStore('lists', { keyPath: 'id' })
        listStore.createIndex('by-updated', 'updated_at')
      }

      // List items store
      if (!db.objectStoreNames.contains('listItems')) {
        const itemStore = db.createObjectStore('listItems', { keyPath: 'id' })
        itemStore.createIndex('by-list', 'list_id')
        itemStore.createIndex('by-updated', 'updated_at')
        itemStore.createIndex('by-category', 'category')
      } else if (oldVersion < 2) {
        // Add category index if upgrading
        const itemStore = transaction.objectStore('listItems')
        if (!itemStore.indexNames.contains('by-category')) {
          itemStore.createIndex('by-category', 'category')
        }
      }

      // List shares store
      if (!db.objectStoreNames.contains('listShares')) {
        const shareStore = db.createObjectStore('listShares', { keyPath: 'id' })
        shareStore.createIndex('by-list', 'list_id')
      }

      // Categories store
      if (!db.objectStoreNames.contains('categories')) {
        const categoryStore = db.createObjectStore('categories', { keyPath: 'id' })
        categoryStore.createIndex('by-list', 'list_id')
      }

      // Sync queue store
      if (!db.objectStoreNames.contains('syncQueue')) {
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' })
        syncStore.createIndex('by-synced', 'synced')
        syncStore.createIndex('by-timestamp', 'timestamp')
      }

      // Metadata store
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' })
      }
    }
  })

  return dbInstance
}

// Lists operations
export const getAllLists = async (): Promise<GroceryList[]> => {
  const db = await initDB()
  return db.getAll('lists')
}

export const getList = async (id: string): Promise<GroceryList | undefined> => {
  const db = await initDB()
  return db.get('lists', id)
}

export const saveList = async (list: GroceryList): Promise<void> => {
  const db = await initDB()
  await db.put('lists', list)
}

export const deleteList = async (id: string): Promise<void> => {
  const db = await initDB()
  await db.delete('lists', id)
}

// List items operations
export const getListItems = async (listId: string): Promise<GroceryItem[]> => {
  const db = await initDB()
  return db.getAllFromIndex('listItems', 'by-list', listId)
}

export const getListItem = async (id: string): Promise<GroceryItem | undefined> => {
  const db = await initDB()
  return db.get('listItems', id)
}

export const saveListItem = async (item: GroceryItem): Promise<void> => {
  const db = await initDB()
  await db.put('listItems', item)
}

export const deleteListItem = async (id: string): Promise<void> => {
  const db = await initDB()
  await db.delete('listItems', id)
}

export const deleteListItems = async (listId: string): Promise<void> => {
  const db = await initDB()
  const items = await getListItems(listId)
  const tx = db.transaction('listItems', 'readwrite')
  await Promise.all(items.map(item => tx.store.delete(item.id)))
  await tx.done
}

// List shares operations
export const getListShares = async (listId: string): Promise<ListShare[]> => {
  const db = await initDB()
  return db.getAllFromIndex('listShares', 'by-list', listId)
}

export const saveListShare = async (share: ListShare): Promise<void> => {
  const db = await initDB()
  await db.put('listShares', share)
}

export const deleteListShare = async (id: string): Promise<void> => {
  const db = await initDB()
  await db.delete('listShares', id)
}

// Categories operations
export const getCategories = async (listId: string): Promise<Category[]> => {
  const db = await initDB()
  return db.getAllFromIndex('categories', 'by-list', listId)
}

export const getCategory = async (id: string): Promise<Category | undefined> => {
  const db = await initDB()
  return db.get('categories', id)
}

export const saveCategory = async (category: Category): Promise<void> => {
  const db = await initDB()
  await db.put('categories', category)
}

export const deleteCategory = async (id: string): Promise<void> => {
  const db = await initDB()
  await db.delete('categories', id)
}

export const deleteCategories = async (listId: string): Promise<void> => {
  const db = await initDB()
  const categories = await getCategories(listId)
  const tx = db.transaction('categories', 'readwrite')
  await Promise.all(categories.map(cat => tx.store.delete(cat.id)))
  await tx.done
}

// Sync queue operations
export const addToSyncQueue = async (operation: SyncOperation): Promise<void> => {
  const db = await initDB()
  await db.put('syncQueue', operation)
}

export const getPendingSyncOperations = async (): Promise<SyncOperation[]> => {
  const db = await initDB()
  return db.getAllFromIndex('syncQueue', 'by-synced', 0)
}

export const markSyncOperationComplete = async (id: string): Promise<void> => {
  const db = await initDB()
  const operation = await db.get('syncQueue', id)
  if (operation) {
    operation.synced = true
    await db.put('syncQueue', operation)
  }
}

export const deleteSyncOperation = async (id: string): Promise<void> => {
  const db = await initDB()
  await db.delete('syncQueue', id)
}

export const clearSyncedOperations = async (): Promise<void> => {
  const db = await initDB()
  const syncedOps = await db.getAllFromIndex('syncQueue', 'by-synced', 1)
  const tx = db.transaction('syncQueue', 'readwrite')
  await Promise.all(syncedOps.map(op => tx.store.delete(op.id)))
  await tx.done
}

// Metadata operations
export const getLastSyncTime = async (): Promise<number> => {
  const db = await initDB()
  const metadata = await db.get('metadata', 'lastSync')
  return metadata?.value || 0
}

export const setLastSyncTime = async (timestamp: number): Promise<void> => {
  const db = await initDB()
  await db.put('metadata', { key: 'lastSync', value: timestamp })
}

// Clear all data (useful for logout)
export const clearAllData = async (): Promise<void> => {
  const db = await initDB()
  const tx = db.transaction(['lists', 'listItems', 'listShares', 'categories', 'syncQueue', 'metadata'], 'readwrite')
  await Promise.all([
    tx.objectStore('lists').clear(),
    tx.objectStore('listItems').clear(),
    tx.objectStore('listShares').clear(),
    tx.objectStore('categories').clear(),
    tx.objectStore('syncQueue').clear(),
    tx.objectStore('metadata').clear()
  ])
  await tx.done
}