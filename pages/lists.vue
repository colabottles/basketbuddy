<template>
  <div class="app-container">
    <AppHeader
      title="BasketBuddy"
      :is-logging-out="isLoggingOut"
      :avatar-url="avatarUrl"
      :user-initials="userInitials"
      @logout="handleLogout" />

    <main id="main-content" class="main-content">
      <div class="container">
        <p class="pull-hint" aria-live="polite">
          <span aria-hidden="true">↓</span> Pull down to refresh
        </p>
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
                  <p class="list-owner-badge" v-if="list.owner_id !== currentUserId">
                    Shared with you
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
                    v-if="canShare"
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
      aria-labelledby="collab-title" aria-modal="true">
      <div class="dialog dialog-large" @click.stop>
        <h2 id="collab-title" class="dialog-title">Share "{{ sharingList?.name }}"</h2>
        <p class="dialog-description">
          Invite others to view or edit this list with you.
        </p>

        <div class="collab-form">
          <h3 class="collab-subtitle">Invite by Email</h3>
          <div class="collab-input-group">
            <input v-model="shareEmail" type="email" class="input" placeholder="Enter email address"
              @keyup.enter="handleShareList" />
            <select v-model="sharePermission" class="input collab-permission-select">
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
          <h3 class="collab-subtitle">People with Access</h3>
          <div v-if="isLoadingShares" class="loading-shares">
            <div class="spinner-small"></div>
            <span>Loading...</span>
          </div>
          <ul v-else class="shares-items">
            <li v-for="share in listShares" :key="share.id" class="collab-item">
              <div class="collab-info">
                <span class="collab-email">{{ share.invited_email || 'User' }}</span>
                <span class="collab-permission-label">
                  {{ share.permission_level === 'edit' ? 'Can Edit' : 'Can View' }}
                </span>
                <span v-if="!share.user_id" class="collab-pending">Pending</span>
              </div>
              <button @click="handleRemoveShare(share.id, share.invited_email)"
                class="button-icon button-danger"
                :aria-label="`Remove access for ${share.invited_email}`">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true" focusable="false" width="20"
                  height="20">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <p class="dialog-description" v-else-if="upgradeReason === 'shares_limit'">
          You've reached the limit of 6 members on the Family plan.
        </p>

        <div class="collab-section">
          <h3 class="collab-subtitle">Share Link</h3>
          <div class="collab-link-group">
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

    <!-- Upgrade Dialog -->
    <div v-if="showUpgradeDialog" class="dialog-overlay" @click="showUpgradeDialog = false"
      role="dialog" aria-labelledby="upgrade-title" aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="upgrade-title" class="dialog-title">Upgrade to Continue</h2>
        <p class="dialog-description" v-if="upgradeReason === 'list'">
          You've reached the limit of {{ maxLists }} lists on the free plan. Upgrade to Solo for up
          to 5 lists, or Family for unlimited lists.
        </p>
        <p class="dialog-description" v-else>
          Sharing lists is available on paid plans. Upgrade to Solo or Family to share lists with
          others.
        </p>
        <div class="dialog-actions">
          <button type="button" @click="showUpgradeDialog = false" class="button button-secondary">
            Not Now
          </button>
          <NuxtLink to="/pricing" class="button button-primary" @click="showUpgradeDialog = false">
            View Plans
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-if="isLoggingOut" class="logout-overlay">
      <div class="logout-spinner"></div>
      <p class="logout-text">Signing out...</p>
    </div>

    <AppFooter />

  </div>
</template>

<script setup lang="ts">
import { useListStore } from '~/stores/listStore'
import { clearAllData } from '~/server/utils/indexedDB'
import type { GroceryList } from '~/types/models'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabase()
const currentUserId = ref<string | null>(null)
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
const { maxLists, maxShares, canShare, fetchSubscription, subscription } = useSubscription()
const showUpgradeDialog = ref(false)
const upgradeReason = ref('')

onMounted(async () => {
  await loadAvatar()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    isLoading.value = false
    return
  }

  currentUserId.value = session.user.id
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
  if (listStore.lists.length >= maxLists.value) {
    upgradeReason.value = 'list'
    showUpgradeDialog.value = true
    return
  }
  isCreating.value = true
  try {
    const newList = await listStore.createList?.(newListName.value.trim())
    closeNewListDialog()
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
      .update({ name: newListName.value.trim() })
      .eq('id', listToRename.value.id)

    if (error) throw error

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
  if (!canShare.value) {
    upgradeReason.value = 'share'
    showUpgradeDialog.value = true
    return
  }
  sharingList.value = list
  showShareDialog.value = true
  isLoadingShares.value = true
  try {
    const shares = await listStore.getListShares?.(list.id)
    listShares.value = shares || []

    if (subscription.value?.plan === 'family' && !subscription.value?.is_free) {
      const activeShares = listShares.value.filter(s => s.user_id)
      if (activeShares.length >= maxShares.value) {
        upgradeReason.value = 'shares_limit'
        showUpgradeDialog.value = true
        showShareDialog.value = false
        return
      }
    }
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
    await clearAllData()

    listStore.lists = []
    listStore.currentList = null
    listStore.currentItems = []
    listStore.categories = []

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
  title: 'My Lists — BasketBuddy'
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.container {
  width: 100%;
  max-width: 100%;
  padding-left: var(--spacing-md);
  padding-right: var(--spacing-md);
  box-sizing: border-box;
}

.pull-hint {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md);
  display: none;
}

@media (max-width: 640px) {
  .pull-hint {
    display: block;
  }
}

/* ========================
   Section header
========================= */
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

.section-subtitle {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text);
}

/* ========================
   Lists grid
========================= */
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

.list-owner-badge {
  display: inline-block;
  margin: var(--spacing-xs) 0 0 0;
  padding: 2px 8px;
  background-color: rgba(102, 38, 175, 0.2);
  color: #c4b5fd;
  border-radius: 12px;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

:root.light .list-owner-badge,
:root:not(.dark) .list-owner-badge {
  background-color: #ede9fe;
  color: #5b21b6;
}

/* ========================
   List action buttons
========================= */
.list-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-top: auto;
  width: 100%;
  box-sizing: border-box;
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
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.375rem;
  min-width: 0;
}

.button-action svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.button-action:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.action-text {
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Light mode action colors */
.button-action.button-edit {
  color: #b45309;
}

.button-action.button-rename {
  color: #047857;
}

.button-action.button-collab {
  color: #1d4ed8;
}

.button-action.button-danger {
  color: #b91c1c;
}

.button-action.button-edit:hover {
  background-color: rgba(180, 83, 9, 0.1);
  border-color: #b45309;
}

.button-action.button-rename:hover {
  background-color: rgba(4, 120, 87, 0.1);
  border-color: #047857;
}

.button-action.button-collab:hover {
  background-color: rgba(29, 78, 216, 0.1);
  border-color: #1d4ed8;
}

.button-action.button-danger:hover {
  background-color: rgba(185, 28, 28, 0.1);
  border-color: #b91c1c;
}

/* Dark mode action colors */
:root.dark .button-action.button-edit,
:root:not(.light) .button-action.button-edit {
  color: #fbbf24;
}

:root.dark .button-action.button-rename,
:root:not(.light) .button-action.button-rename {
  color: #34d399;
}

:root.dark .button-action.button-collab,
:root:not(.light) .button-action.button-collab {
  color: #60a5fa;
}

:root.dark .button-action.button-danger,
:root:not(.light) .button-action.button-danger {
  color: #f87171;
}

/* ========================
   Invitations
========================= */
.invitations-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md);
  background-color: #fef3c7;
  border-radius: 0.5rem;
  border: 2px solid #fbbf24;
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
  background-color: var(--color-background);
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

/* ========================
   Dialogs
========================= */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  z-index: var(--z-dialog);
}

.dialog {
  background-color: var(--color-background);
  padding: var(--spacing-xl);
  border-radius: 0.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.dialog-large {
  max-width: 600px;
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

.delete-button {
  background-color: var(--color-danger);
  color: white;
  font-weight: 500;
}

.delete-button:hover:not(:disabled) {
  background-color: #b91c1c;
}

/* ========================
   Share / collab dialog
========================= */
.collab-form {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.collab-subtitle {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text);
}

.collab-input-group {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.collab-input-group .input {
  flex: 1;
  min-width: 180px;
}

.collab-permission-select {
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

.collab-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: var(--color-surface);
  border-radius: 0.375rem;
  gap: var(--spacing-md);
}

.collab-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
  min-width: 0;
}

.collab-email {
  font-weight: 500;
  color: var(--color-text);
  font-size: var(--font-size-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.collab-permission-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.collab-pending {
  display: inline-block;
  padding: 2px 8px;
  background-color: #fbbf24;
  color: #78350f;
  border-radius: 12px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  width: fit-content;
}

.collab-section {
  margin-bottom: var(--spacing-lg);
}

.collab-link-group {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.help-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

/* ========================
   Misc button styles
========================= */
.button-icon {
  min-width: var(--min-touch-target);
  min-height: var(--min-touch-target);
  padding: var(--spacing-xs);
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
}

.button-icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.button-icon.button-danger {
  color: var(--color-danger);
}

.button-icon.button-danger:hover {
  background-color: rgba(220, 38, 38, 0.1);
}

/* ========================
   Loading / logout states
========================= */
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
  z-index: var(--z-logout);
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

/* ========================
   Responsive
========================= */
@media (max-width: 640px) {
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

  .button-action svg {
    width: 14px;
    height: 14px;
  }

  .action-text {
    font-size: 9px;
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

@media (min-width: 768px) and (max-width: 1023px) {
  .lists-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .lists-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
</style>