<template>
  <div class="app-container">
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <button
            @click="router.push('/')"
            class="button button-icon-only"
            aria-label="Go back to lists">
            <span aria-hidden="true">←</span>
          </button>
          <h1 class="app-title">{{ listStore.currentList?.name || 'BasketBuddy' }}</h1>
          <div class="header-actions">
            <span v-if="!listStore.isOnline" class="offline-badge" role="status" aria-live="polite">
              Offline
            </span>
            <button
              @click="router.push('/rewards')"
              class="button button-secondary"
              aria-label="Manage rewards cards">
              Rewards
            </button>
            <button
              @click="showShareDialog = true"
              class="button button-secondary"
              aria-label="Share this list">
              Share
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
        <!-- Categories Section -->
        <section aria-labelledby="categories-heading" class="categories-section">
          <div class="section-header">
            <h2 id="categories-heading" class="section-title-small">Categories</h2>
            <button
              @click="showCategoryDialog = true"
              class="button button-small button-secondary"
              aria-label="Add new category">
              Add Category
            </button>
          </div>

          <div v-if="listStore.categories && listStore.categories.length > 0"
            class="categories-list">
            <div
              v-for="category in listStore.categories"
              :key="category.id"
              class="category-chip-wrapper">
              <button
                @click="toggleCategoryFilter(category.name)"
                class="category-chip"
                :class="{ 'category-active': selectedCategory === category.name }"
                :style="{ '--category-color': category.color }"
                :aria-pressed="selectedCategory === category.name">
                {{ category.name }}
              </button>
              <button
                @click="confirmDeleteCategory(category)"
                class="category-delete-btn"
                :aria-label="`Delete ${category.name} category`">
                ×
              </button>
            </div>
            <button
              v-if="selectedCategory"
              @click="clearCategoryFilter"
              class="category-chip category-clear">
              Clear Filter
            </button>
          </div>
        </section>

        <section aria-labelledby="items-heading">
          <h2 id="items-heading" class="visually-hidden">Grocery Items</h2>

          <!-- Add Item Form -->
          <form @submit.prevent="handleAddItem" class="add-item-form">
            <div class="add-item-group">
              <div class="input-group">
                <label for="new-item" class="visually-hidden">Add new item</label>
                <input
                  id="new-item"
                  ref="newItemInput"
                  v-model="newItemText"
                  type="text"
                  class="input input-large"
                  placeholder="Add an item..."
                  aria-describedby="item-hint" />
                <span id="item-hint" class="visually-hidden">
                  Type an item name and press enter or click the add button to add it to your list
                </span>
              </div>

              <div class="input-group"
                v-if="listStore.categories && listStore.categories.length > 0">
                <label for="item-category" class="visually-hidden">Category (optional)</label>
                <select
                  id="item-category"
                  v-model="newItemCategory"
                  class="input category-select">
                  <option :value="null">No Category</option>
                  <option
                    v-for="category in listStore.categories"
                    :key="category.id"
                    :value="category.name">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              class="button button-primary"
              :disabled="!newItemText.trim() || isAddingItem"
              aria-label="Add item to list">
              Add
            </button>
          </form>

          <!-- Items List -->
          <div v-if="filteredItems.length === 0" class="empty-state">
            <p class="empty-text">
              {{ selectedCategory ? 'No items in this category yet.' : 'No items yet. Start adding items to your list!' }}
            </p>
          </div>

          <div v-else>
            <!-- Unchecked Items (Draggable) -->
            <div v-if="uncheckedItems.length > 0">
              <h3 class="subsection-title">To Buy</h3>
              <ul
                ref="uncheckedListRef"
                class="items-list"
                role="list"
                aria-label="Items to buy">
                <li
                  v-for="item in uncheckedItems"
                  :key="item.id"
                  :data-id="item.id"
                  class="item-row"
                  :class="{ 'item-dragging': draggingItemId === item.id, 'item-editing': editingItemId === item.id }">
                  <button
                    v-if="editingItemId !== item.id"
                    class="drag-handle"
                    aria-label="Drag to reorder"
                    tabindex="-1">
                    <span aria-hidden="true">⋮⋮</span>
                  </button>

                  <div class="item-content" v-if="editingItemId !== item.id">
                    <label class="checkbox-container">
                      <input
                        type="checkbox"
                        :checked="item.checked"
                        @change="handleToggleItem(item.id)"
                        class="checkbox-input"
                        :aria-label="`Mark ${item.text} as completed`" />
                      <span class="checkbox-custom" aria-hidden="true"></span>
                    </label>
                    <div class="item-info">
                      <div class="item-main">
                        <span class="item-text">{{ item.text }}</span>
                        <span
                          v-if="item.category"
                          class="item-category-pill"
                          :style="{ '--pill-color': getCategoryColor(item.category) }">
                          {{ item.category }}
                        </span>
                      </div>
                      <span v-if="item.notes" class="item-notes">{{ item.notes }}</span>
                    </div>
                  </div>

                  <!-- Edit Mode -->
                  <div class="item-edit-form" v-else>
                    <div class="edit-fields">
                      <input
                        v-model="editingText"
                        type="text"
                        class="input edit-input"
                        placeholder="Item name"
                        @keyup.enter="saveEdit(item.id)"
                        @keyup.esc="cancelEditing" />
                      <input
                        v-model="editingNotes"
                        type="text"
                        class="input edit-input"
                        placeholder="Notes (optional)"
                        @keyup.enter="saveEdit(item.id)"
                        @keyup.esc="cancelEditing" />

                      <!-- Image Upload -->
                      <div class="image-upload-section">
                        <input
                          ref="imageInput"
                          type="file"
                          accept="image/*"
                          @change="handleImageSelect"
                          class="visually-hidden"
                          :id="`image-input-${item.id}`" />

                        <div v-if="editingImagePreview" class="image-preview">
                          <img :src="editingImagePreview" :alt="`Preview for ${editingText}`" />
                          <button
                            type="button"
                            @click="removeEditingImage"
                            class="remove-image-btn"
                            aria-label="Remove image">
                            ×
                          </button>
                        </div>

                        <label
                          v-else
                          :for="`image-input-${item.id}`"
                          class="image-upload-label">
                          <span aria-hidden="true">📷</span> Add Photo
                        </label>
                      </div>
                    </div>

                    <div class="edit-actions">
                      <button
                        @click="saveEdit(item.id)"
                        class="button button-primary button-small">
                        Save
                      </button>
                      <button
                        @click="cancelEditing"
                        class="button button-secondary button-small">
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div class="item-actions" v-if="editingItemId !== item.id">
                    <button
                      @click="startEditingItem(item)"
                      class="button-icon"
                      :aria-label="`Edit ${item.text}`">
                      <span aria-hidden="true">✎</span>
                    </button>
                    <button
                      @click="confirmDeleteItem(item)"
                      class="button-icon button-danger"
                      :aria-label="`Delete ${item.text}`">
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Checked Items (Not draggable) -->
            <div v-if="checkedItems.length > 0" class="checked-section">
              <h3 class="subsection-title">Completed</h3>
              <ul class="items-list" role="list" aria-label="Completed items">
                <li
                  v-for="item in checkedItems"
                  :key="item.id"
                  class="item-row item-checked">
                  <div class="item-content">
                    <label class="checkbox-container">
                      <input
                        type="checkbox"
                        :checked="item.checked"
                        @change="handleToggleItem(item.id)"
                        class="checkbox-input"
                        :aria-label="`Mark ${item.text} as not completed`" />
                      <span class="checkbox-custom" aria-hidden="true"></span>
                    </label>
                    <div class="item-info">
                      <div class="item-main">
                        <span class="item-text">{{ item.text }}</span>
                        <span
                          v-if="item.category"
                          class="item-category-pill"
                          :style="{ '--pill-color': getCategoryColor(item.category) }">
                          {{ item.category }}
                        </span>
                      </div>
                      <span v-if="item.notes" class="item-notes">{{ item.notes }}</span>
                      <div v-if="item.image_url" class="item-image">
                        <img :src="item.image_url" :alt="item.text" />
                      </div>
                    </div>
                  </div>
                  <button
                    @click="confirmDeleteItem(item)"
                    class="button-icon button-danger"
                    :aria-label="`Delete ${item.text}`">
                    <span aria-hidden="true">×</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Items Summary -->
          <div v-if="filteredItems.length > 0" class="items-summary" role="status"
            aria-live="polite">
            <p class="summary-text">
              {{ checkedItems.length }} of {{ filteredItems.length }} items completed
            </p>
            <button
              v-if="checkedItems.length > 0"
              @click="handleClearCompleted"
              class="button button-secondary button-small">
              Clear Completed
            </button>
          </div>
        </section>
      </div>
    </main>

    <!-- Category Dialog -->
    <div
      v-if="showCategoryDialog"
      class="dialog-overlay"
      @click="closeCategoryDialog"
      role="dialog"
      aria-labelledby="category-title"
      aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="category-title" class="dialog-title">Add Category</h2>
        <form @submit.prevent="handleCreateCategory">
          <div class="form-group">
            <label for="category-name" class="form-label">
              Category Name
              <span aria-hidden="true">*</span>
            </label>
            <input
              id="category-name"
              ref="categoryNameInput"
              v-model="newCategoryName"
              type="text"
              class="input"
              required
              aria-required="true"
              placeholder="e.g., Produce, Dairy" />
          </div>

          <div class="form-group">
            <label class="form-label">
              Color
            </label>
            <div class="color-palette">
              <button
                v-for="color in colorPalette"
                :key="color.value"
                type="button"
                @click="newCategoryColor = color.value"
                class="color-swatch"
                :class="{ 'color-swatch-selected': newCategoryColor === color.value }"
                :style="{ backgroundColor: color.value }"
                :aria-label="`Select ${color.name} color`"
                :aria-pressed="newCategoryColor === color.value">
                <span v-if="newCategoryColor === color.value" class="color-check"
                  aria-hidden="true">✓</span>
              </button>
            </div>
          </div>

          <div class="dialog-actions">
            <button
              type="button"
              @click="closeCategoryDialog"
              class="button button-secondary">
              Cancel
            </button>
            <button
              type="submit"
              class="button button-primary"
              :disabled="!newCategoryName.trim() || isCreatingCategory">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Category Confirmation -->
    <div
      v-if="categoryToDelete"
      class="dialog-overlay"
      @click="cancelDeleteCategory"
      role="alertdialog"
      aria-labelledby="delete-category-title"
      aria-describedby="delete-category-description"
      aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="delete-category-title" class="dialog-title">Delete Category?</h2>
        <p id="delete-category-description" class="dialog-description">
          Are you sure you want to delete "{{ categoryToDelete.name }}"? Items in this category will
          not be deleted.
        </p>
        <div class="dialog-actions">
          <button
            type="button"
            @click="cancelDeleteCategory"
            class="button button-secondary">
            Cancel
          </button>
          <button
            @click="handleDeleteCategory"
            class="button button-danger"
            :disabled="isDeletingCategory">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Item Confirmation Dialog -->
    <div
      v-if="itemToDelete"
      class="dialog-overlay"
      @click="cancelDeleteItem"
      role="alertdialog"
      aria-labelledby="delete-item-title"
      aria-describedby="delete-item-description"
      aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="delete-item-title" class="dialog-title">Delete Item?</h2>
        <p id="delete-item-description" class="dialog-description">
          Are you sure you want to delete "{{ itemToDelete.text }}"? This action cannot be undone.
        </p>
        <div class="dialog-actions">
          <button
            type="button"
            @click="cancelDeleteItem"
            class="button button-secondary">
            Cancel
          </button>
          <button
            @click="handleDeleteItem"
            class="button button-danger"
            :disabled="isDeletingItem">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Share Dialog -->
    <div
      v-if="showShareDialog"
      class="dialog-overlay"
      @click="closeShareDialog"
      role="dialog"
      aria-labelledby="share-title"
      aria-modal="true">
      <div class="dialog dialog-large" @click.stop>
        <h2 id="share-title" class="dialog-title">Share List</h2>
        <p class="dialog-description">
          Invite others to view or edit this list with you.
        </p>

        <!-- Share Form -->
        <div class="share-form">
          <h3 class="share-subtitle">Invite by Email</h3>
          <div class="share-input-group">
            <input
              v-model="shareEmail"
              type="email"
              class="input"
              placeholder="Enter email address"
              @keyup.enter="handleShareList" />
            <select v-model="sharePermission" class="input share-permission-select">
              <option value="edit">Can Edit</option>
              <option value="view">Can View</option>
            </select>
            <button
              @click="handleShareList"
              class="button button-primary"
              :disabled="!shareEmail.trim() || isSharingList">
              {{ isSharingList ? 'Sending...' : 'Send Invite' }}
            </button>
          </div>
        </div>

        <!-- Current Shares -->
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
                <span class="share-permission">
                  {{ share.permission_level === 'edit' ? 'Can Edit' : 'Can View' }}
                </span>
                <span v-if="!share.user_id" class="share-pending">Pending</span>
              </div>
              <button
                @click="handleRemoveShare(share.id, share.invited_email)"
                class="button-icon button-danger"
                aria-label="Remove access">
                <span aria-hidden="true">×</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Share Link -->
        <div class="share-section">
          <h3 class="share-subtitle">Share Link</h3>
          <div class="share-link-group">
            <input
              ref="shareLinkInput"
              :value="shareLink"
              type="text"
              readonly
              class="input"
              aria-label="Share link" />
            <button
              @click="copyShareLink"
              class="button button-primary">
              {{ linkCopied ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <p class="help-text">
            Anyone with this link can view this list
          </p>
        </div>

        <div class="dialog-actions">
          <button
            type="button"
            @click="closeShareDialog"
            class="button button-secondary">
            Done
          </button>
        </div>
      </div>
    </div>

    <!-- Live Update Notification -->
    <div
      v-if="showUpdateNotification"
      class="notification"
      role="status"
      aria-live="polite"
      aria-atomic="true">
      <p class="notification-text">{{ updateMessage }}</p>
    </div>
    <div v-if="isLoggingOut" class="logout-overlay">
      <div class="logout-spinner"></div>
      <p class="logout-text">Signing out...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useListStore } from '~/stores/listStore'
import { useRealtimeSubscription } from '~/composables/useRealtimeSubscription'
import Sortable from 'sortablejs'
import type { Category, GroceryItem } from '~/types/models'
import { clearAllData } from '~/utils/indexedDB'
import { getList } from '~/utils/indexedDB'

definePageMeta({
  middleware: 'auth'
})

const colorPalette = [
  { name: 'Purple', value: '#9333ea', contrast: 'white' },
  { name: 'Blue', value: '#2563eb', contrast: 'white' },
  { name: 'Green', value: '#059669', contrast: 'white' },
  { name: 'Red', value: '#dc2626', contrast: 'white' },
  { name: 'Orange', value: '#ea580c', contrast: 'white' },
  { name: 'Pink', value: '#db2777', contrast: 'white' },
  { name: 'Indigo', value: '#4f46e5', contrast: 'white' },
  { name: 'Teal', value: '#0d9488', contrast: 'white' },
  { name: 'Amber', value: '#d97706', contrast: 'white' },
  { name: 'Lime', value: '#65a30d', contrast: 'white' },
  { name: 'Cyan', value: '#0891b2', contrast: 'white' },
  { name: 'Rose', value: '#e11d48', contrast: 'white' },
  { name: 'Emerald', value: '#10b981', contrast: 'white' },
  { name: 'Violet', value: '#7c3aed', contrast: 'white' },
  { name: 'Fuchsia', value: '#c026d3', contrast: 'white' },
  { name: 'Sky', value: '#0284c7', contrast: 'white' }
]

const route = useRoute()
const router = useRouter()
const listStore = useListStore()
const { subscribeToList, unsubscribeFromList } = useRealtimeSubscription()
const supabase = useSupabase()

const listId = computed(() => route.params.id as string)
const newItemText = ref('')
const newItemCategory = ref<string | null>(null)
const newItemInput = ref<HTMLInputElement | null>(null)
const isAddingItem = ref(false)
const showShareDialog = ref(false)
const shareLinkInput = ref<HTMLInputElement | null>(null)
const linkCopied = ref(false)
const showUpdateNotification = ref(false)
const updateMessage = ref('')
const showCategoryDialog = ref(false)
const newCategoryName = ref('')
const newCategoryColor = ref('#9333ea')
const categoryNameInput = ref<HTMLInputElement | null>(null)
const isCreatingCategory = ref(false)
const categoryToDelete = ref<Category | null>(null)
const isDeletingCategory = ref(false)
const selectedCategory = ref<string | null>(null)
const uncheckedListRef = ref<HTMLElement | null>(null)
const draggingItemId = ref<string | null>(null)
const editingItemId = ref<string | null>(null)
const editingText = ref('')
const editingNotes = ref('')
const itemToDelete = ref<GroceryItem | null>(null)
const isDeletingItem = ref(false)
const editingImage = ref<File | null>(null)
const editingImagePreview = ref<string | null>(null)
const imageInput = ref<HTMLInputElement | null>(null)
const listShares = ref<any[]>([])
const isLoadingShares = ref(false)
const shareEmail = ref('')
const sharePermission = ref<'view' | 'edit'>('edit')
const isSharingList = ref(false)
const isLoggingOut = ref(false)

let sortableInstance: Sortable | null = null

// Load list and items
onMounted(async () => {
  await loadListData()
  setupRealtimeSubscription()
  setupDragAndDrop()

  nextTick(() => {
    newItemInput.value?.focus()
  })
})

onUnmounted(() => {
  unsubscribeFromList(listId.value)
  if (sortableInstance) {
    sortableInstance.destroy()
  }
})

const loadListData = async () => {
  try {
    const list = await getList(listId.value)
    if (list) {
      listStore.currentList = list
    }

    await listStore.fetchListItems?.(listId.value)
    await listStore.fetchCategories?.(listId.value)
  } catch (error) {
    console.error('Error loading list:', error)
  }
}

const loadListShares = async () => {
  if (!listId.value) return

  isLoadingShares.value = true
  try {
    const shares = await listStore.getListShares?.(listId.value)
    listShares.value = shares || []
  } catch (error) {
    console.error('Error loading shares:', error)
  } finally {
    isLoadingShares.value = false
  }
}

const handleShareList = async () => {
  const email = shareEmail.value.trim()
  if (!email || isSharingList.value) return

  if (!email.includes('@')) {
    alert('Please enter a valid email address')
    return
  }

  isSharingList.value = true
  try {
    await listStore.shareList?.(listId.value, email, sharePermission.value)
    shareEmail.value = ''
    sharePermission.value = 'edit'
    await loadListShares()
    showNotification(`Invitation sent to ${email}`)
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
    await loadListShares()
    showNotification('Access removed')
  } catch (error) {
    console.error('Error removing share:', error)
    alert('Failed to remove access. Please try again.')
  }
}

const setupRealtimeSubscription = () => {
  subscribeToList(
    listId.value,
    (payload: any) => {
      const newItem = payload.new
      if (listStore.currentItems && !listStore.currentItems.find((item: GroceryItem) => item.id === newItem.id)) {
        listStore.currentItems.push(newItem)
        showNotification(`${newItem.text} was added`)
      }
    },
    (payload: any) => {
      const updatedItem = payload.new
      if (listStore.currentItems) {
        const index = listStore.currentItems.findIndex((item: GroceryItem) => item.id === updatedItem.id)
        if (index !== -1) {
          listStore.currentItems[index] = updatedItem
          const action = updatedItem.checked ? 'checked' : 'unchecked'
          showNotification(`${updatedItem.text} was ${action}`)
        }
      }
    },
    (payload: any) => {
      const deletedId = payload.old.id
      if (listStore.currentItems) {
        const item = listStore.currentItems.find((i: GroceryItem) => i.id === deletedId)
        if (item) {
          listStore.currentItems = listStore.currentItems.filter((i: GroceryItem) => i.id !== deletedId)
          showNotification(`${item.text} was removed`)
        }
      }
    }
  )
}

const setupDragAndDrop = () => {
  nextTick(() => {
    if (uncheckedListRef.value) {
      sortableInstance = new Sortable(uncheckedListRef.value, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'item-ghost',
        dragClass: 'item-dragging',
        onStart: (evt) => {
          const itemId = evt.item.getAttribute('data-id')
          if (itemId) {
            draggingItemId.value = itemId
          }
        },
        onEnd: async (evt) => {
          draggingItemId.value = null

          if (evt.oldIndex === undefined || evt.newIndex === undefined) return
          if (evt.oldIndex === evt.newIndex) return

          const reordered = [...uncheckedItems.value]
          const [movedItem] = reordered.splice(evt.oldIndex, 1)

          if (!movedItem) {
            console.warn('No item found at index', evt.oldIndex)
            return
          }

          reordered.splice(evt.newIndex, 0, movedItem)

          await listStore.reorderItems?.(listId.value, [
            ...reordered,
            ...checkedItems.value
          ])

          showNotification('Order updated')
        }
      })
    }
  })
}

const showNotification = (message: string) => {
  updateMessage.value = message
  showUpdateNotification.value = true

  setTimeout(() => {
    showUpdateNotification.value = false
  }, 3000)
}

const filteredItems = computed((): GroceryItem[] => {
  if (!listStore.currentItems) return []
  if (!selectedCategory.value) {
    return listStore.currentItems
  }
  return listStore.currentItems.filter((item: GroceryItem) => item.category === selectedCategory.value)
})

const uncheckedItems = computed((): GroceryItem[] => {
  if (!filteredItems.value) return []
  return filteredItems.value
    .filter((item: GroceryItem) => !item.checked)
    .sort((a: GroceryItem, b: GroceryItem) => a.item_order - b.item_order)
})

const checkedItems = computed((): GroceryItem[] => {
  if (!filteredItems.value) return []
  return filteredItems.value
    .filter((item: GroceryItem) => item.checked)
    .sort((a: GroceryItem, b: GroceryItem) => a.item_order - b.item_order)
})

const toggleCategoryFilter = (categoryName: string) => {
  selectedCategory.value = selectedCategory.value === categoryName ? null : categoryName
}

const clearCategoryFilter = () => {
  selectedCategory.value = null
}

const getCategoryColor = (categoryName: string): string => {
  if (!listStore.categories) return '#6b7280'
  const category = listStore.categories.find((c: Category) => c.name === categoryName)
  return category?.color || '#6b7280'
}

const handleAddItem = async () => {
  const text = newItemText.value.trim()
  if (!text || isAddingItem.value) return

  isAddingItem.value = true
  try {
    const newItem = await listStore.addItem?.(listId.value, text)

    const categoryToAssign = newItemCategory.value || selectedCategory.value
    if (categoryToAssign && newItem) {
      await listStore.updateItemCategory?.(newItem.id, categoryToAssign)
    }

    newItemText.value = ''
    newItemCategory.value = null
    newItemInput.value?.focus()
  } catch (error) {
    console.error('Error adding item:', error)
    alert('Failed to add item. Please try again.')
  } finally {
    isAddingItem.value = false
  }
}

const handleToggleItem = async (itemId: string) => {
  try {
    await listStore.toggleItem?.(itemId)
  } catch (error) {
    console.error('Error toggling item:', error)
  }
}

const startEditingItem = (item: GroceryItem) => {
  editingItemId.value = item.id
  editingText.value = item.text
  editingNotes.value = item.notes || ''
  editingImage.value = null
  editingImagePreview.value = item.image_url || null
}

const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    editingImage.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      editingImagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeEditingImage = () => {
  editingImage.value = null
  editingImagePreview.value = null
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const cancelEditing = () => {
  editingItemId.value = null
  editingText.value = ''
  editingNotes.value = ''
  editingImage.value = null
  editingImagePreview.value = null
}

const saveEdit = async (itemId: string) => {
  if (!editingText.value.trim()) {
    alert('Item name cannot be empty')
    return
  }

  try {
    await listStore.updateItemText?.(itemId, editingText.value.trim())
    await listStore.updateItemNotes?.(itemId, editingNotes.value.trim() || null)

    if (editingImage.value) {
      await listStore.updateItemImage?.(itemId, editingImage.value)
    } else if (editingImagePreview.value === null) {
      const item = listStore.currentItems?.find((i: GroceryItem) => i.id === itemId)
      if (item?.image_url) {
        await listStore.updateItemImage?.(itemId, null)
      }
    }

    cancelEditing()
  } catch (error) {
    console.error('Error saving edit:', error)
    alert('Failed to save changes. Please try again.')
  }
}

const confirmDeleteItem = (item: GroceryItem) => {
  itemToDelete.value = item
}

const cancelDeleteItem = () => {
  itemToDelete.value = null
}

const handleDeleteItem = async () => {
  if (!itemToDelete.value || isDeletingItem.value) return

  isDeletingItem.value = true
  try {
    await listStore.deleteItem?.(itemToDelete.value.id)
    itemToDelete.value = null
  } catch (error) {
    console.error('Error deleting item:', error)
    alert('Failed to delete item. Please try again.')
  } finally {
    isDeletingItem.value = false
  }
}

const handleClearCompleted = async () => {
  const completed = checkedItems.value

  if (completed.length === 0) return

  const confirmed = confirm(`Delete ${completed.length} completed item${completed.length === 1 ? '' : 's'}? This action cannot be undone.`)
  if (!confirmed) return

  try {
    await Promise.all(
      completed.map((item: GroceryItem) => listStore.deleteItem?.(item.id))
    )
  } catch (error) {
    console.error('Error clearing completed items:', error)
    alert('Failed to clear completed items. Please try again.')
  }
}

const closeCategoryDialog = () => {
  showCategoryDialog.value = false
  newCategoryName.value = ''
  newCategoryColor.value = '#9333ea'
}

watch(showCategoryDialog, (show) => {
  if (show) {
    nextTick(() => {
      categoryNameInput.value?.focus()
    })
  }
})

const handleCreateCategory = async () => {
  const name = newCategoryName.value.trim()
  if (!name || isCreatingCategory.value) return

  isCreatingCategory.value = true
  try {
    await listStore.createCategory?.(listId.value, name, newCategoryColor.value)
    closeCategoryDialog()
    showNotification(`Category "${name}" created`)
  } catch (error) {
    console.error('Error creating category:', error)
    alert('Failed to create category. Please try again.')
  } finally {
    isCreatingCategory.value = false
  }
}

const confirmDeleteCategory = (category: Category) => {
  categoryToDelete.value = category
}

const cancelDeleteCategory = () => {
  categoryToDelete.value = null
}

const handleDeleteCategory = async () => {
  if (!categoryToDelete.value || isDeletingCategory.value) return

  isDeletingCategory.value = true
  const categoryName = categoryToDelete.value.name
  try {
    await listStore.deleteCategoryById?.(categoryToDelete.value.id)
    showNotification(`Category "${categoryName}" deleted`)

    if (selectedCategory.value === categoryName) {
      selectedCategory.value = null
    }

    categoryToDelete.value = null
  } catch (error) {
    console.error('Error deleting category:', error)
    alert('Failed to delete category. Please try again.')
  } finally {
    isDeletingCategory.value = false
  }
}

const shareLink = computed(() => {
  if (process.client) {
    return `${window.location.origin}/list/${listId.value}`
  }
  return ''
})

const closeShareDialog = () => {
  showShareDialog.value = false
  linkCopied.value = false
  shareEmail.value = ''
  sharePermission.value = 'edit'
  listShares.value = []
}

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    linkCopied.value = true

    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Error copying link:', error)
    shareLinkInput.value?.select()
  }
}

watch(showShareDialog, (show) => {
  if (show) {
    loadListShares()
    nextTick(() => {
      shareLinkInput.value?.select()
    })
  }
})

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

useHead({
  title: computed(() => `${listStore.currentList?.name || 'List'} - BasketBuddy`)
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
  position: relative;
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
  padding: var(--spacing-xs);
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: var(--font-size-xl);
  cursor: pointer;
}

.button-icon-only:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.button-danger {
  background-color: var(--color-danger);
  color: white;
}

.button-danger:hover {
  background-color: #b91c1c;
  /* Darker red on hover */
}

.button-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-title {
  flex: 1;
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.export-menu-item:hover {
  background-color: var(--color-surface);
}

.export-menu-item:first-child {
  border-radius: 0.5rem 0.5rem 0 0;
}

.export-menu-item:last-child {
  border-radius: 0 0 0.5rem 0.5rem;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.categories-section {
  margin-bottom: var(--spacing-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  gap: var(--spacing-md);
}

.section-title-small {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
}

.button-small {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  min-height: 36px;
  min-width: auto;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.category-chip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  padding-right: var(--spacing-xl);
  background-color: var(--color-surface);
  border: 2px solid var(--category-color, var(--color-border));
  border-radius: 1rem;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-text);
}

.category-chip:hover {
  background-color: var(--color-background);
  transform: translateY(-1px);
}

.category-active {
  background-color: var(--category-color);
  color: white;
  border-color: var(--category-color);
}

.category-delete-btn {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: var(--font-size-base);
  line-height: 1;
  color: inherit;
  z-index: 1;
}

.category-delete-btn:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.category-active .category-delete-btn {
  background-color: rgba(255, 255, 255, 0.2);
}

.category-active .category-delete-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.category-clear {
  background-color: var(--color-text-secondary);
  color: white;
  border-color: var(--color-text-secondary);
  padding-right: var(--spacing-sm);
}

.add-item-form {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.add-item-group {
  flex: 1;
  display: flex;
  gap: var(--spacing-sm);
}

.input-group {
  flex: 1;
}

.input-large {
  font-size: var(--font-size-base);
}

.category-select {
  min-width: 150px;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  background-color: var(--color-surface);
  border-radius: 0.5rem;
}

.empty-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
}

.subsection-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.checked-section {
  margin-top: var(--spacing-xl);
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.item-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 0.5rem;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.item-row:hover {
  background-color: var(--color-background);
}

.item-dragging {
  opacity: 0.5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.item-ghost {
  opacity: 0.3;
}

.item-checked {
  opacity: 0.6;
}

.item-editing {
  background-color: var(--color-background);
  border-color: var(--color-primary);
}

.drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: var(--min-touch-target);
  min-height: var(--min-touch-target);
  padding: var(--spacing-xs);
  background: none;
  border: none;
  cursor: grab;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
  line-height: 1;
}

.drag-handle:active {
  cursor: grabbing;
}

.item-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  min-width: 0;
}

.checkbox-container {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  min-width: var(--min-touch-target);
  min-height: var(--min-touch-target);
  justify-content: center;
  flex-shrink: 0;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
  margin: 0;
}

.checkbox-custom {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkbox-input:checked+.checkbox-custom {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-input:checked+.checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.checkbox-input:focus-visible+.checkbox-custom {
  box-shadow: var(--focus-ring);
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
}

.item-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.item-text {
  font-size: var(--font-size-base);
  color: var(--color-text);
  word-break: break-word;
}

.item-checked .item-text {
  text-decoration: line-through;
}

.item-category-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background-color: var(--pill-color);
  color: white;
  border-radius: 12px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.item-checked .item-category-pill {
  opacity: 0.6;
}

.item-notes {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-style: italic;
  padding-left: var(--spacing-sm);
}

.item-edit-form {
  flex: 1;
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
  padding: var(--spacing-xs);
}

.image-upload-section {
  margin-top: var(--spacing-sm);
}

.image-upload-label {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.image-upload-label:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background-color: var(--color-background);
}

.image-preview {
  position: relative;
  display: inline-block;
  max-width: 200px;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 0.375rem;
  border: 2px solid var(--color-border);
}

.remove-image-btn {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-danger);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: var(--font-size-lg);
  line-height: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.remove-image-btn:hover {
  background-color: #b91c1c;
}

.item-image {
  margin-top: var(--spacing-sm);
  max-width: 200px;
}

.item-image img {
  width: 100%;
  height: auto;
  border-radius: 0.375rem;
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: transform 0.2s;
}

.item-image img:hover {
  transform: scale(1.02);
}

.edit-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.edit-input {
  width: 100%;
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  min-height: 36px;
}

.edit-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.item-actions {
  display: flex;
  gap: var(--spacing-xs);
  flex-shrink: 0;
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
  flex-shrink: 0;
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

.items-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: 0.5rem;
}

.summary-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
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
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text);
}

.dialog-description {
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: 1.5;
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
  min-width: 200px;
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
}

.share-permission {
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
}

@media (max-width: 640px) {
  .share-input-group {
    flex-direction: column;
  }

  .share-input-group .input,
  .share-permission-select {
    width: 100%;
  }
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

.color-palette {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: var(--spacing-sm);
}

.color-swatch {
  position: relative;
  min-width: 50px;
  min-height: 50px;
  border: 3px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.color-swatch:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.color-swatch-selected {
  border-color: var(--color-text);
  box-shadow: 0 0 0 1px var(--color-background), 0 0 0 3px var(--color-text);
}

.color-check {
  color: white;
  font-size: var(--font-size-xl);
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.share-section {
  margin-bottom: var(--spacing-lg);
}

.share-subtitle {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text);
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

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.dialog-actions .button-danger {
  background-color: var(--color-danger);
  color: white;
}

.dialog-actions .button-danger:hover {
  background-color: #b91c1c;
}

.notification {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  background-color: var(--color-text);
  color: var(--color-background);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  animation: slideIn 0.3s ease-out;
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

@keyframes slideIn {
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.notification-text {
  margin: 0;
  font-size: var(--font-size-base);
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
  }

  .app-title {
    order: -1;
    flex-basis: 100%;
  }

  .add-item-form {
    flex-direction: column;
  }

  .add-item-group {
    flex-direction: column;
  }

  .items-summary {
    flex-direction: column;
    align-items: stretch;
  }

  .drag-handle {
    min-width: 32px;
  }

  .item-edit-form {
    flex-direction: column;
  }

  .edit-actions {
    width: 100%;
  }

  .edit-actions button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .export-menu {
    right: 0;
    left: 0;
    margin: var(--spacing-xs) var(--spacing-md) 0;
  }
}
</style>