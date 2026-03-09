<template>
  <div class="app-container">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <h1 class="app-title">BasketBuddy</h1>
          <div class="header-actions">
            <button
              @click="router.push('/rewards')"
              class="button button-secondary">
              Rewards
            </button>
            <button
              @click="router.push('/settings')"
              class="button button-secondary">
              Settings
            </button>
            <div class="header-avatar-container">
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                alt="Profile picture"
                class="header-avatar" />
              <span v-else class="header-avatar-placeholder" aria-hidden="true">
                {{ userInitials }}
              </span>
            </div>
            <button
              @click="handleLogout"
              class="button button-secondary"
              :disabled="isLoggingOut">
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
              class="button button-primary">
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

          <template v-else>
            <ul class="lists-grid" role="list">
              <li v-for="list in listStore.lists" :key="list.id" class="list-card">
                <div class="list-card-body">
                  <h3 class="list-name">{{ list.name }}</h3>
                  <p class="list-meta">
                    Updated {{ formatDate(list.updated_at) }}
                  </p>
                </div>
                <div class="list-actions">
                  <button
                    @click="router.push(`/list/${list.id}`)"
                    class="button-action button-edit"
                    :aria-label="`Edit ${list.name}`">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <span class="action-text">Edit</span>
                  </button>
                  <button
                    @click="openRenameDialog(list)"
                    class="button-action button-rename"
                    :aria-label="`Rename ${list.name}`">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    <span class="action-text">Rename</span>
                  </button>
                  <button
                    @click="openShareDialog(list)"
                    class="button-action button-collab"
                    :aria-label="`Share ${list.name}`">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    <span class="action-text">Share</span>
                  </button>
                  <button
                    @click="confirmDelete(list)"
                    class="button-action button-danger"
                    :aria-label="`Delete ${list.name}`">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
                    <span class="action-text">Delete</span>
                  </button>
                </div>
              </li>
            </ul>
          </template>
        </section>
      </div>
    </main>

    <!-- New List Dialog -->
    <div v-if="showNewListDialog" class="dialog-overlay" @click="closeNewListDialog" role="dialog"
      aria-labelledby="new-list-title" aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="new-list-title" class="dialog-title">Create New List</h2>
        <form @submit.prevent="handleCreateList">
          <div class="form-group">
            <label for="list-name" class="form-label">
              List Name
              <span aria-hidden="false">*</span>
            </label>
            <input id="list-name" ref="newListInput" v-model="newListName" type="text" class="input"
              required aria-required="true" placeholder="e.g., Weekly Shopping" />
          </div>
          <div class="dialog-actions">
            <button type="button" @click="closeNewListDialog" class="button button-secondary">
              Cancel
            </button>
            <button type="submit" class="button button-primary"
              :disabled="!newListName.trim() || isCreating">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="listToDelete" class="dialog-overlay" @click="cancelDelete" role="alertdialog"
      aria-labelledby="delete-title" aria-describedby="delete-description" aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="delete-title" class="dialog-title">Delete List?</h2>
        <p id="delete-description" class="dialog-description">
          Are you sure you want to delete "{{ listToDelete.name }}"? This action cannot be undone.
        </p>
        <div class="dialog-actions">
          <button type="button" @click="cancelDelete" class="button button-secondary">
            Cancel
          </button>
          <button @click="handleDeleteList" class="button delete-button" :disabled="isDeleting">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Rename List Dialog -->
    <div v-if="listToRename" class="dialog-overlay" @click="closeRenameDialog" role="dialog"
      aria-labelledby="rename-title" aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="rename-title" class="dialog-title">Rename List</h2>
        <form @submit.prevent="handleRenameList">
          <div class="form-group">
            <label for="rename-list-name" class="form-label">
              List Name
              <span aria-hidden="true">*</span>
            </label>
            <input id="rename-list-name" v-model="newListName" type="text" class="input" required
              aria-required="true" placeholder="e.g., Weekly Shopping" />
          </div>
          <div class="dialog-actions">
            <button type="button" @click="closeRenameDialog" class="button button-secondary">
              Cancel
            </button>
            <button type="submit" class="button button-primary"
              :disabled="!newListName.trim() || isRenaming">
              {{ isRenaming ? 'Renaming...' : 'Rename' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Share List Dialog -->
    <div v-if="showShareDialog" class="dialog-overlay" @click="closeShareDialog" role="dialog"
      aria-labelledby="share-title" aria-modal="true">
      <div class="dialog dialog-large" @click.stop>
        <h2 id="share-title" class="dialog-title">Share "{{ sharingList?.name }}"</h2>
        <p class="dialog-description">
          Invite others to view or edit this list with you.
        </p>

        <div class="share-form">
          <h3 class="share-subtitle">Invite by Email</h3>
          <div class="share-input-group">
            <input v-model="shareEmail" type="email" class="input" placeholder="Enter email address"
              @keyup.enter="handleShareList" />
            <select v-model="sharePermission" class="input share-permission-select">
              <option value="edit">Can Edit</option>
              <option value="view">Can View</option>
            </select>
            <button @click="handleShareList" class="button button-primary"
              :disabled="!shareEmail.trim() || isSharingList">
              {{ isSharingList ? 'Sending...' : 'Send Invite' }}
            </button>
          </div>
        </div>

        <div v-if="listShares.length > 0" class="shares-list">
          <h3 class="share-subtitle">People with Access</h3>
          <div v-if="isLoadingShares" class="loading-shares">
            <div class="spinner-small"></div>
            <span>Loading...</span>
          </div>
          <ul v-else class="shares-items">
            <li v-for="share in listShares" :key="share.id" class="share-item">
              <div class="share-info">
                <span class="share-email">{{ share.invited_email || 'User' }}</span>
                <span class="share-permission-label">
                  {{ share.permission_level === 'edit' ? 'Can Edit' : 'Can View' }}
                </span>
                <span v-if="!share.user_id" class="share-pending">Pending</span>
              </div>
              <button @click="handleRemoveShare(share.id, share.invited_email)"
                class="button-icon button-danger"
                :aria-label="`Remove access for ${share.invited_email}`">
                <span aria-hidden="true">×</span>
              </button>
            </li>
          </ul>
        </div>

        <div class="share-section">
          <h3 class="share-subtitle">Share Link</h3>
          <div class="share-link-group">
            <input ref="shareLinkInput" :value="shareLink" type="text" readonly class="input"
              aria-label="Share link" />
            <button @click="copyShareLink" class="button button-primary">
              {{ linkCopied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <p class="help-text">Anyone with this link can view this list</p>
        </div>

        <div class="dialog-actions">
          <button type="button" @click="closeShareDialog" class="button button-secondary">
            Done
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
          <p class="footer-text">© {{ new Date().getFullYear() }} BasketBuddy. Made with <span
              class="heart">❤️</span> by <a href="https://toddl.dev" target="_blank"
              rel="noopener noreferrer" class="footer-link">Todd Libby</a>.</p>
          <p class="footer-text">Built with accessibility in mind. Support on <a
              href="https://github.com/colabottles/basketbuddy" target="_blank"
              rel="noopener noreferrer" class="footer-link">GitHub</a> or <a
              href="https://ko-fi.com/Y8Y727FD2" class="footer-link" target="_blank">Ko-Fi</a> to
            keep costs down.</p>
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
const listToRename = ref<GroceryList | null>(null)
const isRenaming = ref(false)
const isDeleting = ref(false)
const isLoggingOut = ref(false)
const showShareDialog = ref(false)
const sharingList = ref<GroceryList | null>(null)
const shareEmail = ref('')
const sharePermission = ref<'view' | 'edit'>('edit')
const isSharingList = ref(false)
const listShares = ref<any[]>([])
const isLoadingShares = ref(false)
const shareLinkInput = ref<HTMLInputElement | null>(null)
const linkCopied = ref(false)

const { avatarUrl, userInitials, loadAvatar } = useUserAvatar()
const pendingInvitations = ref<any[]>([])

onMounted(async () => {
  await loadAvatar()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    isLoading.value = false
    return
  }

  isLoading.value = true
  listStore.lists = []

  await listStore.fetchLists?.()

  const invites = await listStore.getPendingInvitations?.()
  pendingInvitations.value = invites || []

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

const openRenameDialog = (list: GroceryList) => {
  listToRename.value = list
  newListName.value = list.name
}

const closeRenameDialog = () => {
  listToRename.value = null
  newListName.value = ''
}

const handleRenameList = async () => {
  if (!listToRename.value || !newListName.value.trim() || isRenaming.value) return

  isRenaming.value = true
  try {
    const { error } = await (supabase as any)
      .from('lists')
      .update({
        name: newListName.value.trim()
      })
      .eq('id', listToRename.value.id)

    if (error) throw error

    // Update local list immediately
    const listIndex = listStore.lists.findIndex(l => l.id === listToRename.value?.id)
    if (listIndex !== -1 && listStore.lists[listIndex]) {
      listStore.lists[listIndex]!.name = newListName.value.trim()
      listStore.lists[listIndex]!.updated_at = new Date().toISOString()
    }

    closeRenameDialog()
  } catch (error) {
    console.error('Error renaming list:', error)
    alert('Failed to rename list. Please try again.')
  } finally {
    isRenaming.value = false
  }
}

const shareLink = computed(() => {
  if (process.client && sharingList.value) {
    return `${window.location.origin}/list/${sharingList.value.id}`
  }
  return ''
})

const openShareDialog = async (list: GroceryList) => {
  sharingList.value = list
  showShareDialog.value = true
  isLoadingShares.value = true
  try {
    const shares = await listStore.getListShares?.(list.id)
    listShares.value = shares || []
  } catch (error) {
    console.error('Error loading shares:', error)
  } finally {
    isLoadingShares.value = false
  }
}

const closeShareDialog = () => {
  showShareDialog.value = false
  sharingList.value = null
  shareEmail.value = ''
  sharePermission.value = 'edit'
  listShares.value = []
  linkCopied.value = false
}

const handleShareList = async () => {
  const email = shareEmail.value.trim()
  if (!email || isSharingList.value || !sharingList.value) return

  if (!email.includes('@')) {
    alert('Please enter a valid email address')
    return
  }

  isSharingList.value = true
  try {
    const newShare = await listStore.shareList?.(sharingList.value.id, email, sharePermission.value)
    if (newShare) {
      listShares.value.push(newShare)
    }
    shareEmail.value = ''
    sharePermission.value = 'edit'
  } catch (error: any) {
    console.error('Error sharing list:', error)
    alert(error.message || 'Failed to share list. Please try again.')
  } finally {
    isSharingList.value = false
  }
}

const handleRemoveShare = async (shareId: string, email: string) => {
  const confirmed = confirm(`Remove access for ${email}?`)
  if (!confirmed) return

  try {
    await listStore.removeShare?.(shareId)
    listShares.value = listShares.value.filter(s => s.id !== shareId)
  } catch (error) {
    console.error('Error removing share:', error)
    alert('Failed to remove access. Please try again.')
  }
}

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    linkCopied.value = true
    setTimeout(() => { linkCopied.value = false }, 2000)
  } catch (error) {
    console.error('Error copying link:', error)
    shareLinkInput.value?.select()
  }
}

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

<style>
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

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.container {
  width: 100%;
  max-width: 100%;
  padding-left: var(--spacing-md);
  padding-right: var(--spacing-md);
  box-sizing: border-box;
}

.app-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
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
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: var(--spacing-md);
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
}

.list-card {
  position: relative;
  background-color: var(--color-surface);
  border-radius: 0.5rem;
  padding: var(--spacing-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
}

.list-card-body {
  display: block;
  padding: var(--spacing-md);
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

.list-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: auto;
  width: 100%;
  box-sizing: border-box;
}

.list-actions-row {
  display: flex;
  gap: 4px;
  width: 100%;
}

.list-actions-row .button-action {
  flex: 1;
}

.button-icon {
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

.button-action {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 52px;
  padding: var(--spacing-xs) 2px;
  background: transparent;
  border: 1px solid var(--color-border);
  color: #10b981;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.375rem;
  min-width: 0;
}

.button-action:hover {
  background-color: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  color: #34d399;
}

.button-action.button-danger {
  color: #f87171;
  border-color: var(--color-border);
}

.button-action.button-danger:hover {
  background-color: rgba(248, 113, 113, 0.1);
  border-color: #f87171;
  color: #fca5a5;
}

.button-action.button-collab {
  color: #3b82f6;
  border-color: var(--color-border);
}

.button-action.button-collab:hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  color: #60a5fa;
}

.button-action.button-edit {
  color: #f59e0b;
  border-color: var(--color-border);
}

.button-action.button-edit:hover {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
  color: #fbbf24;
}

.button-action.button-rename {
  color: #10b981;
  border-color: var(--color-border);
}

.button-action.button-rename:hover {
  background-color: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  color: #34d399;
}

.button-action:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.button-action svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.action-text {
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.button-delete {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  min-width: 60px;
  min-height: 60px;
  padding: var(--spacing-xs);
  background: transparent;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.375rem;
}

.button-delete:hover {
  background-color: rgba(220, 38, 38, 0.1);
  color: #b91c1c;
}

.button-delete:focus-visible {
  outline: 2px solid var(--color-danger);
  outline-offset: 2px;
}

.button-delete svg {
  flex-shrink: 0;
}

.delete-text {
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

.dialog-large {
  max-width: 600px;
}

.share-form {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.share-subtitle {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text);
}

.share-input-group {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.share-input-group .input {
  flex: 1;
  min-width: 180px;
}

.share-permission-select {
  min-width: 120px;
  flex-shrink: 0;
}

.shares-list {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.loading-shares {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.shares-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.share-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: var(--color-surface);
  border-radius: 0.375rem;
  gap: var(--spacing-md);
}

.share-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
}

.share-email {
  font-weight: 500;
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.share-permission-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.share-pending {
  display: inline-block;
  padding: 2px 8px;
  background-color: #fbbf24;
  color: #78350f;
  border-radius: 12px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  width: fit-content;
}

.share-section {
  margin-bottom: var(--spacing-lg);
}

.share-link-group {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.help-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.delete-button {
  background-color: #dc2626;
  color: white;
  font-weight: 500;
}

.delete-button:hover:not(:disabled) {
  background-color: #b91c1c;
}

.delete-button:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
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

.avatar-button {
  padding: 0 !important;
  overflow: hidden;
}

.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.header-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: white;
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

/* Small devices (640px and below) */
@media (max-width: 640px) {
  .app-title {
    font-size: var(--font-size-lg);
  }

  .header-content {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .header-actions {
    width: auto;
    justify-content: flex-start;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }

  .section-header {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .section-header .button {
    width: auto;
    min-width: 160px;
  }

  .lists-grid {
    grid-template-columns: 1fr;
  }

  .list-card {
    padding: var(--spacing-sm);
  }

  .button-action {
    flex: unset;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    min-height: 52px;
    padding: var(--spacing-xs) 2px;
    background: transparent;
    border: 1px solid var(--color-border);
    color: #10b981;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 0.375rem;
    min-width: 0;
  }

  .button-action svg {
    width: 14px;
    height: 14px;
  }

  .action-text {
    font-size: 9px;
  }

  .button-delete {
    min-width: 50px;
    min-height: 50px;
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
    max-width: calc(100vw - 2rem);
    box-sizing: border-box;
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