export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      lists: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      list_items: {
        Row: {
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
        Insert: {
          id?: string
          list_id: string
          text: string
          checked?: boolean
          item_order?: number
          category?: string | null
          notes?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          text?: string
          checked?: boolean
          item_order?: number
          category?: string | null
          notes?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      list_shares: {
        Row: {
          id: string
          list_id: string
          user_id: string
          permission_level: 'view' | 'edit'
          created_at: string
        }
        Insert: {
          id?: string
          list_id: string
          user_id: string
          permission_level?: 'view' | 'edit'
          created_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          user_id?: string
          permission_level?: 'view' | 'edit'
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          list_id: string
          name: string
          color: string
          item_order: number
          created_at: string
        }
        Insert: {
          id?: string
          list_id: string
          name: string
          color?: string
          item_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          name?: string
          color?: string
          item_order?: number
          created_at?: string
        }
      }
    }
  }
}