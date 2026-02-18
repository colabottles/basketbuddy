import { defineStore } from 'pinia'
import type { GroceryList, GroceryItem, Category } from '~/types/models'
import type { SyncOperation } from '~/types/sync.types'
import type { Database } from '~/types/database.types'
import {
  getAllLists,
  getList,
  saveList,
  deleteList,
  getListItems,
  saveListItem,
  deleteListItem,
  deleteListItems,
  getCategories,
  saveCategory,
  deleteCategory,
  addToSyncQueue,
  getPendingSyncOperations,
  markSyncOperationComplete,
  clearSyncedOperations,
  setLastSyncTime,
  clearAllData
} from '~/utils/indexedDB'
import { v4 as uuidv4 } from 'uuid'

export const useListStore = defineStore('lists', () => {
  const supabase = useSupabase()

  // State
  const lists = ref<GroceryList[]>([])
  const currentList = ref<GroceryList | null>(null)
  const currentItems = ref<GroceryItem[]>([])
  const categories = ref<Category[]>([])
  const isOnline = ref(true)
  const isSyncing = ref(false)
  const lastSyncTime = ref<number>(0)

  // Check online status
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }

  if (process.client) {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  }

  // Load lists from IndexedDB
  const loadListsFromLocal = async () => {
    try {
      const localLists = await getAllLists()
      lists.value = localLists
    } catch (error) {
      console.error('Error loading lists from IndexedDB:', error)
    }
  }

  // Load list items from IndexedDB
  const loadItemsFromLocal = async (listId: string) => {
    try {
      const localItems = await getListItems(listId)
      currentItems.value = localItems.sort((a, b) => a.item_order - b.item_order)
    } catch (error) {
      console.error('Error loading items from IndexedDB:', error)
    }
  }

  // Fetch lists from Supabase
  const fetchLists = async () => {
    if (!isOnline.value) {
      await loadListsFromLocal()
      return
    }

    try {
      const { data: userLists, error } = await supabase
        .from('lists')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error

      if (userLists) {
        for (const list of userLists) {
          await saveList(list as GroceryList)
        }
        lists.value = userLists as GroceryList[]
      }
    } catch (error) {
      console.error('Error fetching lists:', error)
      await loadListsFromLocal()
    }
  }

  // Fetch list items from Supabase
  const fetchListItems = async (listId: string) => {
    if (!isOnline.value) {
      await loadItemsFromLocal(listId)
      return
    }

    try {
      const { data: items, error } = await supabase
        .from('list_items')
        .select('*')
        .eq('list_id', listId)
        .order('item_order', { ascending: true })

      if (error) throw error

      if (items) {
        for (const item of items) {
          await saveListItem(item as GroceryItem)
        }
        currentItems.value = items as GroceryItem[]
      }
    } catch (error) {
      console.error('Error fetching list items:', error)
      await loadItemsFromLocal(listId)
    }
  }

  // Fetch categories
  const fetchCategories = async (listId: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('list_id', listId)
        .order('item_order', { ascending: true })

      if (error) throw error

      if (data) {
        for (const category of data) {
          await saveCategory(category as Category)
        }
        categories.value = data as Category[]
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      const localCategories = await getCategories(listId)
      categories.value = localCategories
    }
  }

  // Create a new list
  const createList = async (name: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const newList: GroceryList = {
      id: uuidv4(),
      name,
      owner_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await saveList(newList)
    lists.value.unshift(newList)

    if (isOnline.value) {
      try {
        const { error } = await (supabase.from('lists') as any).insert([newList])
        if (error) throw error
      } catch (error) {
        console.error('Error creating list online:', error)
        await addToSyncQueue({
          id: uuidv4(),
          type: 'CREATE',
          table: 'lists',
          data: newList,
          timestamp: Date.now(),
          synced: false,
          retries: 0
        })
      }
    } else {
      await addToSyncQueue({
        id: uuidv4(),
        type: 'CREATE',
        table: 'lists',
        data: newList,
        timestamp: Date.now(),
        synced: false,
        retries: 0
      })
    }

    return newList
  }

  // Add item to list
  const addItem = async (listId: string, text: string) => {
    const maxOrder = currentItems.value.length > 0
      ? Math.max(...currentItems.value.map(item => item.item_order))
      : 0

    const newItem: GroceryItem = {
      id: uuidv4(),
      list_id: listId,
      text,
      checked: false,
      item_order: maxOrder + 1,
      category: null,
      notes: null,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await saveListItem(newItem)
    currentItems.value.push(newItem)

    if (isOnline.value) {
      try {
        const { error } = await (supabase.from('list_items') as any).insert([newItem])
        if (error) throw error
      } catch (error) {
        console.error('Error adding item online:', error)
        await addToSyncQueue({
          id: uuidv4(),
          type: 'CREATE',
          table: 'list_items',
          data: newItem,
          timestamp: Date.now(),
          synced: false,
          retries: 0
        })
      }
    } else {
      await addToSyncQueue({
        id: uuidv4(),
        type: 'CREATE',
        table: 'list_items',
        data: newItem,
        timestamp: Date.now(),
        synced: false,
        retries: 0
      })
    }

    return newItem
  }

  // Toggle item checked status
  const toggleItem = async (itemId: string) => {
    const itemIndex = currentItems.value.findIndex((i: GroceryItem) => i.id === itemId)
    if (itemIndex === -1) {
      console.warn(`Item ${itemId} not found`)
      return
    }

    const item = currentItems.value[itemIndex]!

    const updatedItem: GroceryItem = {
      id: item.id,
      list_id: item.list_id,
      text: item.text,
      checked: !item.checked,
      item_order: item.item_order,
      category: item.category,
      notes: item.notes,
      image_url: item.image_url,
      created_at: item.created_at,
      updated_at: new Date().toISOString()
    }

    await saveListItem(updatedItem)
    currentItems.value[itemIndex] = updatedItem

    if (isOnline.value) {
      try {
        const { error } = await (supabase.from('list_items') as any)
          .update({ checked: updatedItem.checked, updated_at: updatedItem.updated_at })
          .eq('id', itemId)

        if (error) throw error
      } catch (error) {
        console.error('Error toggling item online:', error)
        await addToSyncQueue({
          id: uuidv4(),
          type: 'UPDATE',
          table: 'list_items',
          data: { id: itemId, checked: updatedItem.checked, updated_at: updatedItem.updated_at },
          timestamp: Date.now(),
          synced: false,
          retries: 0
        })
      }
    } else {
      await addToSyncQueue({
        id: uuidv4(),
        type: 'UPDATE',
        table: 'list_items',
        data: { id: itemId, checked: updatedItem.checked, updated_at: updatedItem.updated_at },
        timestamp: Date.now(),
        synced: false,
        retries: 0
      })
    }
  }

  // Delete item
  const deleteItem = async (itemId: string) => {
    await deleteListItem(itemId)
    currentItems.value = currentItems.value.filter(i => i.id !== itemId)

    if (isOnline.value) {
      try {
        const { error } = await supabase
          .from('list_items')
          .delete()
          .eq('id', itemId)

        if (error) throw error
      } catch (error) {
        console.error('Error deleting item online:', error)
        await addToSyncQueue({
          id: uuidv4(),
          type: 'DELETE',
          table: 'list_items',
          data: { id: itemId },
          timestamp: Date.now(),
          synced: false,
          retries: 0
        })
      }
    } else {
      await addToSyncQueue({
        id: uuidv4(),
        type: 'DELETE',
        table: 'list_items',
        data: { id: itemId },
        timestamp: Date.now(),
        synced: false,
        retries: 0
      })
    }
  }

  // Delete list
  const deleteListById = async (listId: string) => {
    await deleteList(listId)
    await deleteListItems(listId)
    lists.value = lists.value.filter(l => l.id !== listId)

    if (isOnline.value) {
      try {
        const { error } = await supabase
          .from('lists')
          .delete()
          .eq('id', listId)

        if (error) throw error
      } catch (error) {
        console.error('Error deleting list online:', error)
        await addToSyncQueue({
          id: uuidv4(),
          type: 'DELETE',
          table: 'lists',
          data: { id: listId },
          timestamp: Date.now(),
          synced: false,
          retries: 0
        })
      }
    } else {
      await addToSyncQueue({
        id: uuidv4(),
        type: 'DELETE',
        table: 'lists',
        data: { id: listId },
        timestamp: Date.now(),
        synced: false,
        retries: 0
      })
    }
  }

  // Create category
  const createCategory = async (listId: string, name: string, color: string = '#9333ea') => {
    const maxOrder = categories.value.length > 0
      ? Math.max(...categories.value.map(cat => cat.item_order))
      : 0

    const newCategory: Category = {
      id: uuidv4(),
      list_id: listId,
      name,
      color,
      item_order: maxOrder + 1,
      created_at: new Date().toISOString()
    }

    await saveCategory(newCategory)
    categories.value.push(newCategory)

    if (isOnline.value) {
      try {
        const { error } = await (supabase.from('categories') as any).insert([newCategory])
        if (error) throw error
      } catch (error) {
        console.error('Error creating category online:', error)
        await addToSyncQueue({
          id: uuidv4(),
          type: 'CREATE',
          table: 'categories',
          data: newCategory,
          timestamp: Date.now(),
          synced: false,
          retries: 0
        })
      }
    } else {
      await addToSyncQueue({
        id: uuidv4(),
        type: 'CREATE',
        table: 'categories',
        data: newCategory,
        timestamp: Date.now(),
        synced: false,
        retries: 0
      })
    }

    return newCategory
  }

  // Delete category
  const deleteCategoryById = async (categoryId: string) => {
    await deleteCategory(categoryId)
    categories.value = categories.value.filter(c => c.id !== categoryId)

    if (isOnline.value) {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', categoryId)

        if (error) throw error
      } catch (error) {
        console.error('Error deleting category online:', error)
        await addToSyncQueue({
          id: uuidv4(),
          type: 'DELETE',
          table: 'categories',
          data: { id: categoryId },
          timestamp: Date.now(),
          synced: false,
          retries: 0
        })
      }
    } else {
      await addToSyncQueue({
        id: uuidv4(),
        type: 'DELETE',
        table: 'categories',
        data: { id: categoryId },
        timestamp: Date.now(),
        synced: false,
        retries: 0
      })
    }
  }

  // Reorder items
  const reorderItems = async (listId: string, reorderedItems: GroceryItem[]) => {
    currentItems.value = reorderedItems.map((item, index) => ({
      ...item,
      item_order: index,
      updated_at: new Date().toISOString()
    }))

    for (const item of currentItems.value) {
      await saveListItem(item)
    }

    if (isOnline.value) {
      try {
        const updates = currentItems.value.map(item => ({
          id: item.id,
          item_order: item.item_order,
          updated_at: item.updated_at
        }))

        for (const update of updates) {
          await (supabase.from('list_items') as any)
            .update({ item_order: update.item_order, updated_at: update.updated_at })
            .eq('id', update.id)
        }
      } catch (error) {
        console.error('Error reordering items online:', error)
      }
    }
  }

  // Update item category
  const updateItemCategory = async (itemId: string, category: string | null) => {
    const itemIndex = currentItems.value.findIndex((i: GroceryItem) => i.id === itemId)
    if (itemIndex === -1) {
      console.warn(`Item ${itemId} not found`)
      return
    }

    const item = currentItems.value[itemIndex]!

    const updatedItem: GroceryItem = {
      id: item.id,
      list_id: item.list_id,
      text: item.text,
      checked: item.checked,
      item_order: item.item_order,
      category,
      notes: item.notes,
      image_url: item.image_url,
      created_at: item.created_at,
      updated_at: new Date().toISOString()
    }

    await saveListItem(updatedItem)
    currentItems.value[itemIndex] = updatedItem

    if (isOnline.value) {
      try {
        const { error } = await (supabase.from('list_items') as any)
          .update({ category, updated_at: updatedItem.updated_at })
          .eq('id', itemId)

        if (error) throw error
      } catch (error) {
        console.error('Error updating item category online:', error)
        await addToSyncQueue({
          id: uuidv4(),
          type: 'UPDATE',
          table: 'list_items',
          data: { id: itemId, category, updated_at: updatedItem.updated_at },
          timestamp: Date.now(),
          synced: false,
          retries: 0
        })
      }
    } else {
      await addToSyncQueue({
        id: uuidv4(),
        type: 'UPDATE',
        table: 'list_items',
        data: { id: itemId, category, updated_at: updatedItem.updated_at },
        timestamp: Date.now(),
        synced: false,
        retries: 0
      })
    }
  }

  // Update item text
  const updateItemText = async (itemId: string, text: string) => {
    const itemIndex = currentItems.value.findIndex((i: GroceryItem) => i.id === itemId)
    if (itemIndex === -1) {
      console.warn(`Item ${itemId} not found`)
      return
    }

    const item = currentItems.value[itemIndex]!

    const updatedItem: GroceryItem = {
      id: item.id,
      list_id: item.list_id,
      text,
      checked: item.checked,
      item_order: item.item_order,
      category: item.category,
      notes: item.notes,
      image_url: item.image_url,
      created_at: item.created_at,
      updated_at: new Date().toISOString()
    }

    await saveListItem(updatedItem)
    currentItems.value[itemIndex] = updatedItem

    if (isOnline.value) {
      try {
        const { error } = await (supabase.from('list_items') as any)
          .update({ text, updated_at: updatedItem.updated_at })
          .eq('id', itemId)

        if (error) throw error
      } catch (error) {
        console.error('Error updating item text online:', error)
        await addToSyncQueue({
          id: uuidv4(),
          type: 'UPDATE',
          table: 'list_items',
          data: { id: itemId, text, updated_at: updatedItem.updated_at },
          timestamp: Date.now(),
          synced: false,
          retries: 0
        })
      }
    } else {
      await addToSyncQueue({
        id: uuidv4(),
        type: 'UPDATE',
        table: 'list_items',
        data: { id: itemId, text, updated_at: updatedItem.updated_at },
        timestamp: Date.now(),
        synced: false,
        retries: 0
      })
    }
  }

  // Update item notes
  const updateItemNotes = async (itemId: string, notes: string | null) => {
    const itemIndex = currentItems.value.findIndex((i: GroceryItem) => i.id === itemId)
    if (itemIndex === -1) {
      console.warn(`Item ${itemId} not found`)
      return
    }

    const item = currentItems.value[itemIndex]!

    const updatedItem: GroceryItem = {
      id: item.id,
      list_id: item.list_id,
      text: item.text,
      checked: item.checked,
      item_order: item.item_order,
      category: item.category,
      notes,
      image_url: item.image_url,
      created_at: item.created_at,
      updated_at: new Date().toISOString()
    }

    await saveListItem(updatedItem)
    currentItems.value[itemIndex] = updatedItem

    if (isOnline.value) {
      try {
        const { error } = await (supabase.from('list_items') as any)
          .update({ notes, updated_at: updatedItem.updated_at })
          .eq('id', itemId)

        if (error) throw error
      } catch (error) {
        console.error('Error updating item notes online:', error)
        await addToSyncQueue({
          id: uuidv4(),
          type: 'UPDATE',
          table: 'list_items',
          data: { id: itemId, notes, updated_at: updatedItem.updated_at },
          timestamp: Date.now(),
          synced: false,
          retries: 0
        })
      }
    } else {
      await addToSyncQueue({
        id: uuidv4(),
        type: 'UPDATE',
        table: 'list_items',
        data: { id: itemId, notes, updated_at: updatedItem.updated_at },
        timestamp: Date.now(),
        synced: false,
        retries: 0
      })
    }
  }

  // Update item image
  const updateItemImage = async (itemId: string, imageFile: File | null) => {
    const itemIndex = currentItems.value.findIndex((i: GroceryItem) => i.id === itemId)
    if (itemIndex === -1) {
      console.warn(`Item ${itemId} not found`)
      return
    }

    const item = currentItems.value[itemIndex]!
    let imageUrl: string | null = null

    if (imageFile) {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')

        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${itemId}-${Date.now()}.${fileExt}`

        const { data, error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName)

        imageUrl = publicUrl

        if (item.image_url) {
          const oldPath = item.image_url.split('/item-images/')[1]
          if (oldPath) {
            await supabase.storage.from('item-images').remove([oldPath])
          }
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        throw error
      }
    } else if (item.image_url) {
      const oldPath = item.image_url.split('/item-images/')[1]
      if (oldPath) {
        await supabase.storage.from('item-images').remove([oldPath])
      }
    }

    const updatedItem: GroceryItem = {
      id: item.id,
      list_id: item.list_id,
      text: item.text,
      checked: item.checked,
      item_order: item.item_order,
      category: item.category,
      notes: item.notes,
      image_url: imageUrl,
      created_at: item.created_at,
      updated_at: new Date().toISOString()
    }

    await saveListItem(updatedItem)
    currentItems.value[itemIndex] = updatedItem

    if (isOnline.value) {
      try {
        const { error } = await (supabase.from('list_items') as any)
          .update({ image_url: imageUrl, updated_at: updatedItem.updated_at })
          .eq('id', itemId)

        if (error) throw error
      } catch (error) {
        console.error('Error updating item image online:', error)
        await addToSyncQueue({
          id: uuidv4(),
          type: 'UPDATE',
          table: 'list_items',
          data: { id: itemId, image_url: imageUrl, updated_at: updatedItem.updated_at },
          timestamp: Date.now(),
          synced: false,
          retries: 0
        })
      }
    } else {
      await addToSyncQueue({
        id: uuidv4(),
        type: 'UPDATE',
        table: 'list_items',
        data: { id: itemId, image_url: imageUrl, updated_at: updatedItem.updated_at },
        timestamp: Date.now(),
        synced: false,
        retries: 0
      })
    }

    return imageUrl
  }

  // Export functions
  const exportToJSON = () => {
    return {
      listName: currentList.value?.name || 'BasketBuddy List',
      exportDate: new Date().toISOString(),
      items: currentItems.value.map(item => ({
        text: item.text,
        checked: item.checked,
        category: item.category
      })),
      categories: categories.value.map(cat => ({
        name: cat.name,
        color: cat.color
      }))
    }
  }

  const exportToCSV = (): string => {
    const headers = ['Item', 'Checked', 'Category']
    const rows = currentItems.value.map(item => [
      `"${item.text.replace(/"/g, '""')}"`,
      item.checked ? 'Yes' : 'No',
      item.category ? `"${item.category.replace(/"/g, '""')}"` : ''
    ])

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
  }

  const exportToText = (): string => {
    const unchecked = currentItems.value.filter(i => !i.checked)
    const checked = currentItems.value.filter(i => i.checked)

    let text = `${currentList.value?.name || 'BasketBuddy List'}\n`
    text += `Exported: ${new Date().toLocaleDateString()}\n\n`

    if (categories.value.length > 0) {
      categories.value.forEach(cat => {
        const items = unchecked.filter(i => i.category === cat.name)
        if (items.length > 0) {
          text += `${cat.name}:\n`
          items.forEach(item => {
            text += `  ☐ ${item.text}\n`
          })
          text += '\n'
        }
      })

      const uncategorized = unchecked.filter(i => !i.category)
      if (uncategorized.length > 0) {
        text += 'Other:\n'
        uncategorized.forEach(item => {
          text += `  ☐ ${item.text}\n`
        })
        text += '\n'
      }
    } else {
      if (unchecked.length > 0) {
        text += 'To Buy:\n'
        unchecked.forEach(item => {
          text += `  ☐ ${item.text}\n`
        })
        text += '\n'
      }
    }

    if (checked.length > 0) {
      text += 'Completed:\n'
      checked.forEach(item => {
        text += `  ☑ ${item.text}\n`
      })
    }

    return text
  }

  // Sync pending operations
  const syncPendingOperations = async () => {
    if (!isOnline.value || isSyncing.value) return

    isSyncing.value = true

    try {
      const pendingOps = await getPendingSyncOperations()

      for (const op of pendingOps) {
        try {
          if (op.table === 'lists') {
            if (op.type === 'CREATE') {
              await (supabase.from('lists') as any).insert([op.data])
            } else if (op.type === 'UPDATE') {
              await (supabase.from('lists') as any).update(op.data).eq('id', op.data.id)
            } else if (op.type === 'DELETE') {
              await supabase.from('lists').delete().eq('id', op.data.id)
            }
          } else if (op.table === 'list_items') {
            if (op.type === 'CREATE') {
              await (supabase.from('list_items') as any).insert([op.data])
            } else if (op.type === 'UPDATE') {
              await (supabase.from('list_items') as any).update(op.data).eq('id', op.data.id)
            } else if (op.type === 'DELETE') {
              await supabase.from('list_items').delete().eq('id', op.data.id)
            }
          } else if (op.table === 'categories') {
            if (op.type === 'CREATE') {
              await (supabase.from('categories') as any).insert([op.data])
            } else if (op.type === 'UPDATE') {
              await (supabase.from('categories') as any).update(op.data).eq('id', op.data.id)
            } else if (op.type === 'DELETE') {
              await supabase.from('categories').delete().eq('id', op.data.id)
            }
          }

          await markSyncOperationComplete(op.id)
        } catch (error) {
          console.error('Error syncing operation:', error)
        }
      }

      await clearSyncedOperations()

      const now = Date.now()
      await setLastSyncTime(now)
      lastSyncTime.value = now
    } catch (error) {
      console.error('Error syncing:', error)
    } finally {
      isSyncing.value = false
    }
  }

  watch(isOnline, (online) => {
    if (online) {
      syncPendingOperations()
    }
  })

  return {
    lists,
    currentList,
    currentItems,
    categories,
    isOnline,
    isSyncing,
    lastSyncTime,
    loadListsFromLocal,
    fetchLists,
    fetchListItems,
    fetchCategories,
    createList,
    addItem,
    toggleItem,
    deleteItem,
    deleteListById,
    createCategory,
    deleteCategoryById,
    reorderItems,
    updateItemCategory,
    updateItemText,
    updateItemNotes,
    updateItemImage,
    exportToJSON,
    exportToCSV,
    exportToText,
    syncPendingOperations
  }
})