import { defineStore } from 'pinia'
import type { RewardsCard } from '~/types/rewards'
import { v4 as uuidv4 } from 'uuid'

export const useRewardsStore = defineStore('rewards', () => {
  const supabase = useSupabase()

  const cards = ref<RewardsCard[]>([])
  const isLoading = ref(false)

  // Fetch user's rewards cards
  const fetchCards = async () => {
    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('rewards_cards')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      cards.value = (data || []) as RewardsCard[]
    } catch (error) {
      console.error('Error fetching rewards cards:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Add a rewards card
  const addCard = async (
    retailerName: string,
    retailerLogo: string | null = null,
    cardNumber: string | null = null,
    cardType: string = 'custom'
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const newCard = {
        id: uuidv4(),
        user_id: user.id,
        retailer_name: retailerName,
        retailer_logo: retailerLogo,
        card_number: cardNumber,
        card_type: cardType,
        is_linked: false,
        linked_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error } = await (supabase.from('rewards_cards') as any)
        .insert([newCard])

      if (error) throw error

      cards.value.unshift(newCard as RewardsCard)
      return newCard
    } catch (error) {
      console.error('Error adding rewards card:', error)
      throw error
    }
  }

  // Update card
  const updateCard = async (cardId: string, updates: Partial<RewardsCard>) => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { error } = await (supabase.from('rewards_cards') as any)
        .update(updateData)
        .eq('id', cardId)

      if (error) throw error

      const index = cards.value.findIndex(c => c.id === cardId)
      if (index !== -1) {
        const existingCard = cards.value[index]
        if (!existingCard) return

        cards.value[index] = {
          id: existingCard.id,
          user_id: existingCard.user_id,
          retailer_name: updates.retailer_name ?? existingCard.retailer_name,
          retailer_logo: updates.retailer_logo !== undefined ? updates.retailer_logo : existingCard.retailer_logo,
          card_number: updates.card_number !== undefined ? updates.card_number : existingCard.card_number,
          card_type: updates.card_type ?? existingCard.card_type,
          is_linked: updates.is_linked ?? existingCard.is_linked,
          linked_at: updates.linked_at !== undefined ? updates.linked_at : existingCard.linked_at,
          created_at: existingCard.created_at,
          updated_at: updateData.updated_at
        }
      }
    } catch (error) {
      console.error('Error updating rewards card:', error)
      throw error
    }
  }

  // Mark card as linked
  const linkCard = async (cardId: string) => {
    try {
      await updateCard(cardId, {
        is_linked: true,
        linked_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error linking card:', error)
      throw error
    }
  }

  // Delete a rewards card
  const deleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('rewards_cards')
        .delete()
        .eq('id', cardId)

      if (error) throw error

      cards.value = cards.value.filter(c => c.id !== cardId)
    } catch (error) {
      console.error('Error deleting rewards card:', error)
      throw error
    }
  }

  return {
    cards,
    isLoading,
    fetchCards,
    addCard,
    updateCard,
    linkCard,
    deleteCard
  }
})