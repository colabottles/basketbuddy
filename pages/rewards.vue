<template>
  <div class="app-container">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <button
            @click="router.back()"
            class="button button-icon-only"
            aria-label="Go back">
            <span aria-hidden="true">←</span>
          </button>
          <h1 class="app-title">Rewards Cards</h1>
          <button
            @click="showAddCardDialog = true"
            class="button button-secondary"
            aria-label="Add rewards card">
            Add Card
          </button>
        </div>
      </div>
    </header>

    <main id="main-content" class="main-content">
      <div class="container">
        <p class="page-description">
          Link your store rewards cards to track savings and get personalized deals.
        </p>

        <div v-if="rewardsStore.isLoading" class="loading-state">
          <div class="spinner"></div>
          <p class="loading-text">Loading your cards...</p>
        </div>

        <div v-else-if="rewardsStore.cards.length === 0" class="empty-state">
          <p class="empty-text">No rewards cards yet. Add your first card to get started!</p>
        </div>

        <div v-else class="cards-grid">
          <div
            v-for="card in rewardsStore.cards"
            :key="card.id"
            class="reward-card"
            :class="{ 'card-linked': card.is_linked }">
            <div class="card-header">
              <div class="card-logo">{{ card.retailer_logo || '🏪' }}</div>
              <button
                @click="confirmDeleteCard(card)"
                class="button-icon button-danger"
                :aria-label="`Delete ${card.retailer_name} card`">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <h3 class="card-name">{{ card.retailer_name }}</h3>
            <div v-if="card.card_number" class="card-number">
              •••• {{ card.card_number.slice(-4) }}
            </div>
            <div class="card-status">
              <span v-if="card.is_linked" class="status-badge status-linked">✓ Linked</span>
              <span v-else class="status-badge status-not-linked">Not Linked</span>
            </div>
            <button
              v-if="!card.is_linked"
              @click="openLinkCard(card)"
              class="button button-primary button-small">
              Link Account
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Card Dialog -->
    <div
      v-if="showAddCardDialog"
      class="dialog-overlay"
      @click="closeAddCardDialog"
      role="dialog"
      aria-labelledby="add-card-title"
      aria-modal="true">
      <div class="dialog dialog-large" @click.stop>
        <h2 id="add-card-title" class="dialog-title">Add Rewards Card</h2>

        <div v-if="!showCustomForm">
          <p class="dialog-description">Choose a popular retailer or add a custom card</p>

          <div class="retailers-grid">
            <button
              v-for="retailer in POPULAR_RETAILERS"
              :key="retailer.name"
              @click="selectRetailer(retailer)"
              class="retailer-button">
              <span class="retailer-logo">{{ retailer.logo }}</span>
              <span class="retailer-name">{{ retailer.name }}</span>
            </button>
          </div>

          <button
            @click="showCustomForm = true"
            class="button button-secondary button-full">
            Add Custom Card
          </button>
        </div>

        <div v-else>
          <button
            @click="showCustomForm = false"
            class="button button-secondary button-small back-button">
            ← Back to Popular
          </button>

          <form @submit.prevent="handleAddCustomCard" class="custom-card-form">
            <div class="form-group">
              <label for="custom-retailer" class="form-label">
                Retailer Name
                <span aria-hidden="true">*</span>
              </label>
              <input
                id="custom-retailer"
                v-model="customRetailerName"
                type="text"
                class="input"
                required
                placeholder="e.g., Local Market" />
            </div>

            <div class="form-group">
              <label for="custom-card-number" class="form-label">
                Card Number (Optional)
              </label>
              <input
                id="custom-card-number"
                v-model="customCardNumber"
                type="text"
                class="input"
                placeholder="Enter your card number" />
            </div>

            <div class="dialog-actions">
              <button
                type="button"
                @click="closeAddCardDialog"
                class="button button-secondary">
                Cancel
              </button>
              <button
                type="submit"
                class="button button-primary"
                :disabled="!customRetailerName.trim() || isAddingCard">
                {{ isAddingCard ? 'Adding...' : 'Add Card' }}
              </button>
            </div>
          </form>
        </div>

        <div v-if="!showCustomForm" class="dialog-actions">
          <button
            type="button"
            @click="closeAddCardDialog"
            class="button button-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="cardToDelete"
      class="dialog-overlay"
      @click="cancelDeleteCard"
      role="alertdialog"
      aria-labelledby="delete-card-title"
      aria-describedby="delete-card-description"
      aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="delete-card-title" class="dialog-title">Delete Card?</h2>
        <p id="delete-card-description" class="dialog-description">
          Are you sure you want to delete your {{ cardToDelete.retailer_name }} rewards card?
        </p>
        <div class="dialog-actions">
          <button
            type="button"
            @click="cancelDeleteCard"
            class="button button-secondary">
            Cancel
          </button>
          <button
            @click="handleDeleteCard"
            class="button button-danger"
            :disabled="isDeletingCard">
            {{ isDeletingCard ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="container">
        <div class="footer-content">
          <p class="footer-text">
            © {{ new Date().getFullYear() }} BasketBuddy. Made with <span class="heart"
              aria-label="love">❤️</span> by <a href="https://toddl.dev" target="_blank"
              rel="noopener noreferrer" class="footer-link">Todd Libby</a>.
          </p>
          <p class="footer-text">
            Built with accessibility in mind. <a href="https://github.com/colabottles/basketbuddy"
              target="_blank" rel="noopener noreferrer" class="footer-link">Support on GitHub</a> to
            keep this app free.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRewardsStore } from '~/stores/rewardsStore'
import type { RewardsCard, PopularRetailer } from '~/types/rewards'
import { POPULAR_RETAILERS } from '~/types/rewards'

definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const rewardsStore = useRewardsStore()

const showAddCardDialog = ref(false)
const showCustomForm = ref(false)
const customRetailerName = ref('')
const customCardNumber = ref('')
const isAddingCard = ref(false)
const cardToDelete = ref<RewardsCard | null>(null)
const isDeletingCard = ref(false)

onMounted(async () => {
  await rewardsStore.fetchCards()
})

const selectRetailer = async (retailer: PopularRetailer) => {
  isAddingCard.value = true
  try {
    const card = await rewardsStore.addCard(
      retailer.name,
      retailer.logo,
      null,
      'popular'
    )

    closeAddCardDialog()

    // If retailer has a login URL, offer to link
    if (retailer.loginUrl) {
      const shouldLink = confirm(`Would you like to link your ${retailer.name} account now?`)
      if (shouldLink && card) {
        window.open(retailer.loginUrl, '_blank')
        // Mark as linked after user confirms
        setTimeout(async () => {
          const linked = confirm('Did you successfully link your account?')
          if (linked) {
            await rewardsStore.linkCard(card.id)
          }
        }, 2000)
      }
    }
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

const openLinkCard = (card: RewardsCard) => {
  const retailer = POPULAR_RETAILERS.find(r => r.name === card.retailer_name)

  if (retailer?.loginUrl) {
    window.open(retailer.loginUrl, '_blank')
    setTimeout(async () => {
      const linked = confirm(`Did you successfully link your ${card.retailer_name} account?`)
      if (linked) {
        await rewardsStore.linkCard(card.id)
      }
    }, 2000)
  } else {
    alert('Please visit your retailer\'s website to create an account and note your card number.')
  }
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
  customRetailerName.value = ''
  customCardNumber.value = ''
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

.app-title {
  flex: 1;
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
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

.card-linked {
  border-color: var(--color-success);
  background-color: #f0fdf4;
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

.card-number {
  font-family: monospace;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  letter-spacing: 0.1em;
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
  background-color: var(--color-success);
  color: white;
}

.status-not-linked {
  background-color: #fee2e2;
  color: #991b1b;
}

.dialog-large {
  max-width: 600px;
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

.footer-text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.heart {
  color: #dc2626;
  display: inline-block;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {

  0%,
  100% {
    transform: scale(1);
  }

  10% {
    transform: scale(1.1);
  }

  20% {
    transform: scale(1);
  }
}

.footer-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.footer-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

@media (max-width: 640px) {
  .footer-content {
    gap: var(--spacing-md);
  }

  .footer-text {
    font-size: var(--font-size-sm);
  }
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .app-title {
    font-size: var(--font-size-lg);
  }

  .header-content {
    gap: var(--spacing-sm);
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
    /* Prevents zoom on iOS */
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