<template>
  <div class="app-container">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <h1 class="app-title">BasketBuddy</h1>
          <div class="header-actions">
            <button
              @click="router.push('/rewards')"
              class="button button-secondary"
              aria-label="Manage rewards cards">
              Rewards
            </button>
            <button
              @click="handleLogout"
              class="button button-secondary"
              :disabled="isLoggingOut"
              aria-label="Sign out of your account">
              <span v-if="isLoggingOut">Signing out...</span>
              <span v-else>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main id="main-content" class="main-content">
      <div class="container">
        <section aria-labelledby="lists-heading">
          <div class="section-header">
            <h2 id="lists-heading" class="section-title">My Lists</h2>
            <button
              @click="showNewListDialog = true"
              class="button button-primary"
              aria-label="Create a new grocery list">
              New List
            </button>
          </div>

          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p class="loading-text">Loading your lists...</p>
          </div>

          <div v-else-if="!listStore.lists || listStore.lists.length === 0" class="empty-state">
            <p class="empty-text">No lists yet. Create your first grocery list!</p>
          </div>

          <!-- Pending Invitations -->
          <div v-if="pendingInvitations.length > 0" class="invitations-section">
            <h2 class="section-subtitle">Pending Invitations</h2>
            <ul class="invitations-list">
              <li v-for="invite in pendingInvitations" :key="invite.id" class="invitation-card">
                <div class="invitation-info">
                  <h3 class="invitation-title">{{ invite.lists?.name || 'Shared List' }}</h3>
                  <p class="invitation-meta">
                    Shared with {{ invite.permission_level }} access
                  </p>
                </div>
                <button
                  @click="acceptInvitation(invite.list_id, invite.lists?.name)"
                  class="button button-primary button-small">
                  Accept
                </button>
              </li>
            </ul>
          </div>

          <ul v-else class="lists-grid" role="list">
            <li v-for="list in listStore.lists" :key="list.id" class="list-card">
              <NuxtLink
                :to="`/list/${list.id}`"
                class="list-link"
                :aria-label="`Open ${list.name} list`">
                <h3 class="list-name">{{ list.name }}</h3>
                <p class="list-meta">
                  Updated {{ formatDate(list.updated_at) }}
                </p>
              </NuxtLink>
              <button
                @click="confirmDelete(list)"
                class="button-icon button-danger"
                :aria-label="`Delete ${list.name} list`">
                <span aria-hidden="true">×</span>
              </button>
            </li>
          </ul>
        </section>
      </div>
    </main>

    <!-- New List Dialog -->
    <div
      v-if="showNewListDialog"
      class="dialog-overlay"
      @click="closeNewListDialog"
      role="dialog"
      aria-labelledby="new-list-title"
      aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="new-list-title" class="dialog-title">Create New List</h2>
        <form @submit.prevent="handleCreateList">
          <div class="form-group">
            <label for="list-name" class="form-label">
              List Name
              <span aria-hidden="true">*</span>
            </label>
            <input
              id="list-name"
              ref="newListInput"
              v-model="newListName"
              type="text"
              class="input"
              required
              aria-required="true"
              placeholder="e.g., Weekly Shopping" />
          </div>
          <div class="dialog-actions">
            <button
              type="button"
              @click="closeNewListDialog"
              class="button button-secondary">
              Cancel
            </button>
            <button
              type="submit"
              class="button button-primary"
              :disabled="!newListName.trim() || isCreating">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="listToDelete"
      class="dialog-overlay"
      @click="cancelDelete"
      role="alertdialog"
      aria-labelledby="delete-title"
      aria-describedby="delete-description"
      aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="delete-title" class="dialog-title">Delete List?</h2>
        <p id="delete-description" class="dialog-description">
          Are you sure you want to delete "{{ listToDelete.name }}"? This action cannot be undone.
        </p>
        <div class="dialog-actions">
          <button
            type="button"
            @click="cancelDelete"
            class="button button-secondary">
            Cancel
          </button>
          <button
            @click="handleDeleteList"
            class="button button-danger"
            :disabled="isDeleting">
            Delete
          </button>
        </div>
      </div>
    </div>
    <div v-if="isLoggingOut" class="logout-overlay">
      <div class="logout-spinner"></div>
      <p class="logout-text">Signing out...</p>
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
            Built with accessibility ♿ in mind. <a href="https://github.com/colabottles/basketbuddy"
              target="_blank" rel="noopener noreferrer" class="footer-link">Please support on GitHub</a> to
            keep this app free.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useListStore } from '~/stores/listStore'
import { clearAllData } from '~/utils/indexedDB'
import type { GroceryList } from '~/types/models'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabase()
const router = useRouter()
const listStore = useListStore()

const isLoading = ref(true)
const showNewListDialog = ref(false)
const newListName = ref('')
const newListInput = ref<HTMLInputElement | null>(null)
const isCreating = ref(false)
const listToDelete = ref<GroceryList | null>(null)
const isDeleting = ref(false)
const isLoggingOut = ref(false)

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user)

  isLoading.value = true
  await listStore.fetchLists?.()
  isLoading.value = false
})

const closeNewListDialog = () => {
  showNewListDialog.value = false
  newListName.value = ''
}

watch(showNewListDialog, (show) => {
  if (show) {
    nextTick(() => {
      newListInput.value?.focus()
    })
  }
})

const handleCreateList = async () => {
  if (!newListName.value.trim() || isCreating.value) return

  isCreating.value = true
  try {
    const newList = await listStore.createList?.(newListName.value.trim())
    closeNewListDialog()
    // Navigate to the new list
    if (newList) {
      await router.push(`/list/${newList.id}`)
    }
  } catch (error) {
    console.error('Error creating list:', error)
    alert('Failed to create list. Please try again.')
  } finally {
    isCreating.value = false
  }
}

const confirmDelete = (list: GroceryList) => {
  listToDelete.value = list
}

const cancelDelete = () => {
  listToDelete.value = null
}

const handleDeleteList = async () => {
  if (!listToDelete.value || isDeleting.value) return

  isDeleting.value = true
  try {
    await listStore.deleteListById?.(listToDelete.value.id)
    listToDelete.value = null
  } catch (error) {
    console.error('Error deleting list:', error)
    alert('Failed to delete list. Please try again.')
  } finally {
    isDeleting.value = false
  }
}

const pendingInvitations = ref<any[]>([])

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user)

  isLoading.value = true
  await listStore.fetchLists?.()

  // Load pending invitations
  const invites = await listStore.getPendingInvitations?.()
  pendingInvitations.value = invites || []

  isLoading.value = false
})

const acceptInvitation = async (listId: string, listName: string) => {
  try {
    await listStore.acceptShareInvitation?.(listId)
    await listStore.fetchLists?.()

    const invites = await listStore.getPendingInvitations?.()
    pendingInvitations.value = invites || []

    alert(`You now have access to "${listName}"`)
  } catch (error) {
    console.error('Error accepting invitation:', error)
    alert('Failed to accept invitation. Please try again.')
  }
}

const handleLogout = async () => {
  isLoggingOut.value = true

  try {
    // Clear all local data first
    await clearAllData()

    // Clear store state
    listStore.lists = []
    listStore.currentList = null
    listStore.currentItems = []
    listStore.categories = []

    // Sign out from Supabase
    await supabase.auth.signOut()

    // Small delay to ensure everything is cleared
    await new Promise(resolve => setTimeout(resolve, 300))

    // Navigate using router instead of full reload
    await router.replace('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // If there's an error, force reload as fallback
    window.location.href = '/login'
  } finally {
    isLoggingOut.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}

useHead({
  title: 'My Lists - BasketBuddy'
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

.app-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.offline-badge {
  background-color: rgba(255, 255, 255, 0.2);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 0.25rem;
  font-size: var(--font-size-sm);
  font-weight: 500;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: 0.5rem;
}

.empty-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-card {
  position: relative;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.list-link {
  display: block;
  padding: var(--spacing-md);
  text-decoration: none;
  color: inherit;
}

.list-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.list-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text);
}

.list-meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.button-icon {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  min-width: var(--min-touch-target);
  min-height: var(--min-touch-target);
  padding: var(--spacing-xs);
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-2xl);
  line-height: 1;
  color: var(--color-text-secondary);
  border-radius: 0.25rem;
}

.button-icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.button-danger {
  color: var(--color-danger);
}

.button-danger:hover {
  background-color: rgba(220, 38, 38, 0.1);
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
}

.dialog-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0 0 var(--spacing-lg) 0;
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

.invitations-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md);
  background-color: #fef3c7;
  border-radius: 0.5rem;
  border: 2px solid #fbbf24;
}

.section-subtitle {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text);
}

.invitations-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.invitation-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: white;
  border-radius: 0.375rem;
  gap: var(--spacing-md);
}

.invitation-info {
  flex: 1;
}

.invitation-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text);
}

.invitation-meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
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

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  gap: var(--spacing-lg);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
}

.logout-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  z-index: 9999;
}

.logout-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.logout-text {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin: 0;
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

/* Small devices (landscape phones, 640px and up) */
@media (max-width: 640px) {
  .app-title {
    font-size: var(--font-size-lg);
  }

  .header-actions {
    gap: var(--spacing-sm);
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .section-header .button {
    width: 100%;
  }

  .lists-grid {
    grid-template-columns: 1fr;
  }

  .invitations-section {
    padding: var(--spacing-sm);
  }

  .invitation-card {
    flex-direction: column;
    align-items: stretch;
  }

  .dialog {
    margin: var(--spacing-sm);
    padding: var(--spacing-md);
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) and (max-width: 1023px) {
  .lists-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large devices (desktops, 1024px and up) */
@media (min-width: 1024px) {
  .lists-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .container {
    max-width: 1024px;
  }
}

/* Extra large devices (large desktops, 1280px and up) */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
</style>