import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export const useRealtimeSubscription = () => {
  const supabase = useSupabase()
  const channels = ref<Map<string, RealtimeChannel>>(new Map())

  const subscribeToList = (
    listId: string,
    onInsert?: (payload: any) => void,
    onUpdate?: (payload: any) => void,
    onDelete?: (payload: any) => void
  ) => {
    // Unsubscribe if already subscribed
    if (channels.value.has(listId)) {
      channels.value.get(listId)?.unsubscribe()
    }

    const channel = supabase
      .channel(`list-${listId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'list_items',
          filter: `list_id=eq.${listId}`
        },
        (payload) => {
          if (onInsert) onInsert(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'list_items',
          filter: `list_id=eq.${listId}`
        },
        (payload) => {
          if (onUpdate) onUpdate(payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'list_items',
          filter: `list_id=eq.${listId}`
        },
        (payload) => {
          if (onDelete) onDelete(payload)
        }
      )
      .subscribe()

    channels.value.set(listId, channel)

    return channel
  }

  const unsubscribeFromList = (listId: string) => {
    const channel = channels.value.get(listId)
    if (channel) {
      channel.unsubscribe()
      channels.value.delete(listId)
    }
  }

  const unsubscribeAll = () => {
    channels.value.forEach((channel) => {
      channel.unsubscribe()
    })
    channels.value.clear()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    unsubscribeAll()
  })

  return {
    subscribeToList,
    unsubscribeFromList,
    unsubscribeAll
  }
}