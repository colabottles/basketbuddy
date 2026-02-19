export interface GroceryList {
  id: string
  name: string
  owner_id: string
  created_at: string
  updated_at: string
}

export interface GroceryItem {
  id: string
  list_id: string
  text: string
  checked: boolean
  item_order: number
  category: string | null
  notes: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface ListShare {
  id: string
  list_id: string
  user_id: string | null
  invited_email: string | null
  permission_level: 'view' | 'edit'
  invited_at: string
  created_at: string
}

export interface ShareInvite {
  email: string
  permission: 'view' | 'edit'
}

export interface Category {
  id: string
  list_id: string
  name: string
  color: string
  item_order: number
  created_at: string
}

export interface User {
  id: string
  email?: string
}

export interface ExportData {
  listName: string
  exportDate: string
  items: {
    text: string
    checked: boolean
    category: string | null
  }[]
  categories: {
    name: string
    color: string
  }[]
}