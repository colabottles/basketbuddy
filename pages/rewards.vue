<template>
  <div class="app-container">
    <AppHeader
      title="BasketBuddy"
      :show-back="true"
      :is-logging-out="isLoggingOut"
      :avatar-url="avatarUrl"
      :user-initials="userInitials"
      @logout="handleLogout" />

    <main id="main-content" class="main-content">
      <div class="container">
        <p class="page-description">
          Link your store rewards cards to track savings and get personalized deals.
        </p>

        <div v-if="rewardsStore.isLoading" class="loading-state">
          <div class="spinner"></div>
          <p class="loading-text">Loading your cards...</p>
        </div>

        <div class="cards-grid">
          <div
            v-for="card in rewardsStore.cards"
            :key="card.id"
            class="reward-card"
            :class="{ 'card-has-number': card.card_number }">
            <div class="card-header">
              <div class="card-logo">{{ card.retailer_logo || '🏪' }}</div>
              <button
                @click="confirmDeleteCard(card)"
                class="button-icon button-danger"
                :aria-label="`Delete ${card.retailer_name} card`">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
            <h3 class="card-name">{{ card.retailer_name }}</h3>
            <button
              v-if="card.card_number"
              @click="toggleReveal(card.id)"
              class="card-number-toggle"
              :aria-label="revealedCards.has(card.id)
                ? `Hide card number for ${card.retailer_name}`
                : `Show full card number for ${card.retailer_name}`"
              :aria-pressed="revealedCards.has(card.id)">
              <span aria-hidden="true">
                {{ revealedCards.has(card.id) ? card.card_number : `••••
                ${card.card_number.slice(-4)}` }}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true">
                <template v-if="revealedCards.has(card.id)">
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94">
                  </path>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19">
                  </path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </template>
                <template v-else>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </template>
              </svg>
            </button>
            <div class="card-status">
              <span v-if="card.card_number" class="status-badge status-linked has-number">✓ Card
                saved</span>
              <span v-else class="status-badge status-not-linked">No card number</span>
            </div>
          </div>

          <!-- Add card CTA -->
          <button
            class="reward-card add-card-cta"
            @click="showAddCardDialog = true"
            aria-label="Add a new rewards card">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span class="add-card-label">Add Card</span>
          </button>
        </div>
      </div>
    </main>

    <!-- Add Card Dialog -->
    <div v-if="showAddCardDialog" class="dialog-overlay" @click="closeAddCardDialog" role="dialog"
      aria-labelledby="add-card-title" aria-modal="true">
      <div class="dialog dialog-large" @click.stop>
        <h2 id="add-card-title" class="dialog-title">Add Rewards Card</h2>

        <!-- Choose retailer -->
        <div v-if="!selectedRetailer && !showCustomForm">
          <p class="dialog-description">Choose a popular retailer or add a custom card</p>

          <div class="retailers-grid">
            <button v-for="retailer in POPULAR_RETAILERS" :key="retailer.name"
              @click="selectedRetailer = retailer" class="retailer-button">
              <span class="retailer-logo">{{ retailer.logo }}</span>
              <span class="retailer-name">{{ retailer.name }}</span>
            </button>
          </div>

          <button @click="showCustomForm = true" class="button button-secondary button-full">
            Add Custom Card
          </button>
        </div>

        <!-- Card number for popular retailer -->
        <div v-else-if="selectedRetailer">
          <button @click="selectedRetailer = null"
            class="button button-secondary button-small back-button">
            ← Back
          </button>
          <div class="selected-retailer">
            <span class="retailer-logo">{{ selectedRetailer.logo }}</span>
            <span class="selected-retailer-name">{{ selectedRetailer.name }}</span>
          </div>
          <form @submit.prevent="handleAddRetailerCard" class="custom-card-form">
            <div class="form-group">
              <label for="retailer-card-number" class="form-label">
                Card Number <span class="label-optional">(optional)</span>
              </label>
              <input id="retailer-card-number" v-model="customCardNumber" type="text" class="input"
                placeholder="Enter your card number" />
              <p class="form-hint">You can find this on the back of your physical card or in the
                retailer's app.</p>
            </div>
            <div class="dialog-actions">
              <button type="button" @click="closeAddCardDialog" class="button button-secondary">
                Cancel
              </button>
              <button type="submit" class="button button-primary" :disabled="isAddingCard">
                {{ isAddingCard ? 'Adding...' : 'Add Card' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Custom card form -->
        <div v-else>
          <button @click="showCustomForm = false"
            class="button button-secondary button-small back-button">
            ← Back
          </button>

          <form @submit.prevent="handleAddCustomCard" class="custom-card-form">
            <div class="form-group">
              <label for="custom-retailer" class="form-label">
                Retailer Name
                <span aria-hidden="true">*</span>
              </label>
              <input id="custom-retailer" v-model="customRetailerName" type="text" class="input"
                required placeholder="e.g., Local Market" />
            </div>

            <div class="form-group">
              <label for="custom-card-number" class="form-label">
                Card Number <span class="label-optional">(optional)</span>
              </label>
              <input id="custom-card-number" v-model="customCardNumber" type="text" class="input"
                placeholder="Enter your card number" />
              <p class="form-hint">You can find this on the back of your physical card or in the
                retailer's app.</p>
            </div>

            <div class="dialog-actions">
              <button type="button" @click="closeAddCardDialog" class="button button-secondary">
                Cancel
              </button>
              <button type="submit" class="button button-primary"
                :disabled="!customRetailerName.trim() || isAddingCard">
                {{ isAddingCard ? 'Adding...' : 'Add Card' }}
              </button>
            </div>
          </form>
        </div>

        <div v-if="!selectedRetailer && !showCustomForm" class="dialog-actions">
          <button type="button" @click="closeAddCardDialog" class="button button-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="cardToDelete" class="dialog-overlay" @click="cancelDeleteCard" role="alertdialog"
      aria-labelledby="delete-card-title" aria-describedby="delete-card-description"
      aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="delete-card-title" class="dialog-title">Delete Card?</h2>
        <p id="delete-card-description" class="dialog-description">
          Are you sure you want to delete your {{ cardToDelete.retailer_name }} rewards card?
        </p>
        <div class="dialog-actions">
          <button type="button" @click="cancelDeleteCard" class="button button-secondary">
            Cancel
          </button>
          <button @click="handleDeleteCard" class="button button-danger" :disabled="isDeletingCard">
            {{ isDeletingCard ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <AppFooter />

  </div>
</template>

<script setup lang="ts">
import { useRewardsStore } from '~/stores/rewardsStore'
import type { RewardsCard, PopularRetailer } from '~/types/rewards'
import { POPULAR_RETAILERS } from '~/types/rewards'
import { clearAllData } from '~/server/utils/indexedDB'

definePageMeta({
  middleware: 'auth'
})

const { avatarUrl, userInitials, loadAvatar } = useUserAvatar()
onMounted(loadAvatar)

const router = useRouter()
const rewardsStore = useRewardsStore()

const showAddCardDialog = ref(false)
const showCustomForm = ref(false)
const selectedRetailer = ref<PopularRetailer | null>(null)
const customRetailerName = ref('')
const customCardNumber = ref('')
const isAddingCard = ref(false)
const cardToDelete = ref<RewardsCard | null>(null)
const isDeletingCard = ref(false)
const supabase = useSupabase()
const isLoggingOut = ref(false)

onMounted(async () => {
  await loadAvatar()
  await rewardsStore.fetchCards()
})

const handleAddRetailerCard = async () => {
  if (!selectedRetailer.value || isAddingCard.value) return

  isAddingCard.value = true
  try {
    await rewardsStore.addCard(
      selectedRetailer.value.name,
      selectedRetailer.value.logo,
      customCardNumber.value.trim() || null,
      'popular'
    )
    closeAddCardDialog()
  } catch (error) {
    console.error('Error adding card:', error)
    alert('Failed to add card. Please try again.')
  } finally {
    isAddingCard.value = false
  }
}

const handleAddCustomCard = async () => {
  if (!customRetailerName.value.trim() || isAddingCard.value) return

  isAddingCard.value = true
  try {
    await rewardsStore.addCard(
      customRetailerName.value.trim(),
      '🏪',
      customCardNumber.value.trim() || null,
      'custom'
    )
    closeAddCardDialog()
  } catch (error) {
    console.error('Error adding custom card:', error)
    alert('Failed to add card. Please try again.')
  } finally {
    isAddingCard.value = false
  }
}

const revealedCards = ref<Set<string>>(new Set())

const toggleReveal = (cardId: string) => {
  const next = new Set(revealedCards.value)
  next.has(cardId) ? next.delete(cardId) : next.add(cardId)
  revealedCards.value = next
}

const confirmDeleteCard = (card: RewardsCard) => {
  cardToDelete.value = card
}

const cancelDeleteCard = () => {
  cardToDelete.value = null
}

const handleDeleteCard = async () => {
  if (!cardToDelete.value || isDeletingCard.value) return

  isDeletingCard.value = true
  try {
    await rewardsStore.deleteCard(cardToDelete.value.id)
    cardToDelete.value = null
  } catch (error) {
    console.error('Error deleting card:', error)
    alert('Failed to delete card. Please try again.')
  } finally {
    isDeletingCard.value = false
  }
}

const closeAddCardDialog = () => {
  showAddCardDialog.value = false
  showCustomForm.value = false
  selectedRetailer.value = null
  customRetailerName.value = ''
  customCardNumber.value = ''
}

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await clearAllData()
    await supabase.auth.signOut()
    await new Promise(resolve => setTimeout(resolve, 300))
    await router.replace('/login')
  } catch (error) {
    console.error('Logout error:', error)
    window.location.href = '/login'
  } finally {
    isLoggingOut.value = false
  }
}

useHead({
  title: 'Rewards Cards - BasketBuddy'
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.app-header {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-md) 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.button-icon-only {
  min-width: var(--min-touch-target);
  min-height: var(--min-touch-target);
  padding: var(--spacing-sm);
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 0;
  border-radius: 0.25rem;
  font-size: var(--font-size-xl);
  cursor: pointer;
  box-sizing: border-box;
}

.button-icon-only:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
  padding: var(--spacing-xs);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.button-icon.button-danger {
  color: #f87171;
}

.button-icon.button-danger:hover {
  background-color: rgba(248, 113, 113, 0.15);
  border-color: #f87171;
  color: #fca5a5;
}

.button-icon.button-danger:focus-visible {
  outline: 2px solid #f87171;
  outline-offset: 2px;
}

.app-title {
  flex: 1;
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.button-secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.button-secondary:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.page-description {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto var(--spacing-md);
  box-sizing: border-box;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text,
.empty-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.reward-card {
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  transition: transform 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.reward-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-has-number {
  border-color: var(--color-success);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-logo {
  font-size: 2.5rem;
  line-height: 1;
}

.card-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
}

.card-number-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-family: monospace;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  letter-spacing: 0.1em;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  padding: 0.125rem var(--spacing-xs);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.card-number-toggle:hover {
  color: var(--color-text);
  border-color: var(--color-border);
  background-color: rgba(255, 255, 255, 0.05);
}

.card-number-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.card-status {
  margin-top: auto;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.status-linked {
  background-color: #7f1d1d;
  color: #fed7d7;
}

.status-linked.has-number {
  background-color: #064e3b;
  color: #6ee7b7;
}

.status-not-linked {
  background-color: #7f1d1d;
  color: #fed7d7;
}

.dialog-large {
  max-width: 600px;
}

.add-card-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border: 2px dashed var(--color-border);
  background: transparent;
  cursor: pointer;
  min-height: 160px;
  color: var(--color-text-secondary);
  transition: border-color 0.2s, color 0.2s, background-color 0.2s;
  font-family: inherit;
}

.add-card-cta:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: rgba(102, 38, 175, 0.05);
}

.add-card-cta:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

.add-card-label {
  font-size: var(--font-size-base);
  font-weight: 600;
}

.retailers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.retailer-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
}

.retailer-button:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.retailer-logo {
  font-size: 2rem;
}

.retailer-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  text-align: center;
  color: var(--color-text);
}

.button-full {
  width: 100%;
  margin-top: var(--spacing-md);
  grid-column: 1 / -1;
  max-width: 600px;
  justify-self: center;
}

.selected-retailer {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: var(--spacing-md) 0 var(--spacing-lg);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
}

.selected-retailer-name {
  font-size: var(--font-size-lg);
}

.label-optional {
  font-weight: 400;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.form-hint {
  margin: var(--spacing-xs) 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.back-button {
  margin-bottom: var(--spacing-md);
}

.custom-card-form {
  margin-top: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  z-index: 1000;
}

.dialog {
  background-color: var(--color-background);
  padding: var(--spacing-xl);
  border-radius: 0.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.dialog-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text);
}

.dialog-description {
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

@media (max-width: 640px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .retailers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.app-footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-xl) 0;
  margin-top: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  text-align: center;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .container {
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
    box-sizing: border-box;
  }

  .app-title {
    font-size: var(--font-size-lg);
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
    gap: var(--spacing-xs);
  }

  .button-icon-only {
    min-width: 36px;
    min-height: 36px;
    padding: var(--spacing-xs);
  }

  .page-description {
    font-size: var(--font-size-sm);
    padding: 0 var(--spacing-sm);
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .reward-card {
    padding: var(--spacing-sm);
  }

  .card-logo {
    font-size: 2rem;
  }

  .card-name {
    font-size: var(--font-size-base);
  }

  .retailers-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }

  .retailer-button {
    padding: var(--spacing-sm);
  }

  .retailer-logo {
    font-size: 1.5rem;
  }

  .retailer-name {
    font-size: var(--font-size-xs);
  }

  .dialog {
    margin: var(--spacing-sm);
    padding: var(--spacing-md);
    max-width: calc(100vw - var(--spacing-lg));
  }

  .dialog-large {
    max-width: calc(100vw - var(--spacing-lg));
  }

  .custom-card-form .input {
    font-size: 16px;
  }
}

/* Tablet optimizations */
@media (min-width: 641px) and (max-width: 1023px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .retailers-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop optimizations */
@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .retailers-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .dialog-large {
    max-width: 700px;
  }
}

/* Extra large screens */
@media (min-width: 1280px) {
  .cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>