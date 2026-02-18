<template>
  <div class="app-container">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <h1 class="app-title">BasketBuddy</h1>
          <div class="header-actions">
            <span v-if="!listStore.isOnline" class="offline-badge" role="status" aria-live="polite">
              Offline
            </span>
            <button
              @click="handleLogout"
              class="button button-secondary"
              aria-label="Sign out of your account">
              Sign Out
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
              <span aria-hidden="true">+</span> New List
            </button>
          </div>

          <div v-if="!listStore.lists || listStore.lists.length === 0" class="empty-state">
            <p class="empty-text">No lists yet. Create your first grocery list!</p>
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
  </div>
</template>

<script setup lang="ts">
import { useListStore } from '~/stores/listStores'
import type { GroceryList } from '~/types/models'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabase()
const router = useRouter()
const listStore = useListStore()

const showNewListDialog = ref(false)
const newListName = ref('')
const newListInput = ref<HTMLInputElement | null>(null)
const isCreating = ref(false)
const listToDelete = ref<GroceryList | null>(null)
const isDeleting = ref(false)

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user)
  await listStore.fetchLists?.()
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

const handleLogout = async () => {
  await supabase.auth.signOut()
  await clearAllData()
  await router.push('/login')
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
</style>