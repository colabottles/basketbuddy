<template>
  <div class="app-container">
    <div
      class="pull-indicator"
      :style="{ transform: `translateY(${pullDistance}px)`, opacity: pullDistance / THRESHOLD }"
      aria-hidden="true">
      <span v-if="refreshing" class="pull-spinner"></span>
      <span v-else>↓</span>
    </div>
    <AppHeader
      :title="listStore.currentList?.name || 'BasketBuddy'"
      show-back
      :show-share="canShare"
      :show-offline="!listStore.isOnline"
      :is-logging-out="isLoggingOut"
      :avatar-url="avatarUrl"
      :user-initials="userInitials"
      @logout="handleLogout"
      @share="showShareDialog = true" />

    <main id="main-content" class="main-content">
      <div class="container">
        <!-- Categories Section -->
        <section aria-labelledby="categories-heading" class="categories-section">
          <div class="section-header">
            <h2 id="categories-heading" class="section-title-small">Categories</h2>
            <button
              @click="showCategoryDialog = true"
              class="button button-small button-secondary"
              aria-label="Manage categories">
              Manage Categories
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

              <!-- Image Upload for New Item -->
              <div class="input-group">
                <input
                  ref="newItemImageInput"
                  type="file"
                  accept="image/*"
                  @change="handleNewItemImageSelect"
                  class="visually-hidden"
                  id="new-item-image-input" />
                <div v-if="newItemImagePreview" class="new-item-image-preview">
                  <img :src="newItemImagePreview" alt="New item preview" />
                  <button
                    type="button"
                    @click="removeNewItemImage"
                    class="remove-image-btn"
                    aria-label="Remove image">
                    ×
                  </button>
                </div>
                <label
                  v-else
                  for="new-item-image-input"
                  class="image-upload-label"
                  tabindex="0"
                  @keydown.enter.prevent="newItemImageInput?.click()"
                  @keydown.space.prevent="newItemImageInput?.click()">
                  <span aria-hidden="true">📷</span> Add Photo
                </label>
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
                  :class="{ 'item-dragging': draggingItemId === item.id, 'item-editing': editingItemId === item.id }"
                  :style="item.category ? { '--item-border-color': getCategoryColor(item.category) } : {}">
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
                          class="item-category-dot"
                          :style="{ backgroundColor: getCategoryColor(item.category) }"
                          :aria-label="`Category: ${item.category}`">
                        </span>
                      </div>
                      <span v-if="item.notes" class="item-notes">{{ item.notes }}</span>
                      <div v-if="item.image_url" class="item-image-thumbnail">
                        <img
                          :src="item.image_url"
                          :alt="item.text"
                          @click="openImageViewer(item.image_url, item.text)"
                          role="button"
                          tabindex="0"
                          @keyup.enter="openImageViewer(item.image_url, item.text)"
                          @keyup.space.prevent="openImageViewer(item.image_url, item.text)" />
                      </div>
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
                      <select
                        v-model="editingCategory"
                        class="input edit-input"
                        :aria-label="`Category for ${editingText}`">
                        <option :value="null">No Category</option>
                        <option
                          v-for="category in listStore.categories"
                          :key="category.id"
                          :value="category.name">
                          {{ category.name }}
                        </option>
                        <option value="__new__">+ Create new category...</option>
                      </select>

                      <div v-if="editingCategory === '__new__'" class="inline-new-category">
                        <input
                          v-model="inlineNewCategoryName"
                          type="text"
                          class="input edit-input"
                          placeholder="Category name"
                          @keyup.enter="saveInlineCategory"
                          @keyup.esc="editingCategory = null" />
                        <button
                          type="button"
                          class="button button-small button-primary"
                          @click="saveInlineCategory"
                          :disabled="!inlineNewCategoryName.trim()">
                          Add
                        </button>
                      </div>

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
                          class="image-upload-label"
                          tabindex="0"
                          @keydown.enter.prevent="imageInput?.click()"
                          @keydown.space.prevent="imageInput?.click()">
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
                  class="item-row item-checked"
                  :style="item.category ? { '--item-border-color': getCategoryColor(item.category) } : {}">
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
                          class="item-category-dot"
                          :style="{ backgroundColor: getCategoryColor(item.category) }"
                          :aria-label="`Category: ${item.category}`">
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
      <div class="dialog dialog-large" @click.stop>
        <h2 id="category-title" class="dialog-title">Manage Categories</h2>

        <!-- Quick Add Presets -->
        <div class="category-section">
          <h3 class="category-section-title">Quick Add</h3>
          <div class="preset-bundle-tabs" role="tablist" aria-label="Category bundles">
            <button
              v-for="bundle in Object.keys(categoryPresets)"
              :key="bundle"
              class="preset-tab"
              :class="{ 'preset-tab-active': activePresetBundle === bundle }"
              role="tab"
              :aria-selected="activePresetBundle === bundle"
              @click="activePresetBundle = bundle as keyof typeof categoryPresets">
              {{ bundle }}
            </button>
          </div>
          <div class="preset-chips">
            <button
              v-for="preset in categoryPresets[activePresetBundle]"
              :key="preset.name"
              class="preset-chip"
              :class="{ 'preset-chip-added': listStore.categories.some(c => c.name === preset.name) }"
              :style="{ '--preset-color': preset.color }"
              :aria-pressed="listStore.categories.some(c => c.name === preset.name)"
              @click="handleTogglePresetCategory(preset)">
              <span class="preset-chip-dot" :style="{ backgroundColor: preset.color }"></span>
              {{ preset.name }}
              <span v-if="listStore.categories.some(c => c.name === preset.name)"
                aria-hidden="true">✓</span>
            </button>
          </div>
        </div>

        <!-- Existing Categories -->
        <div class="category-section" v-if="listStore.categories.length > 0">
          <h3 class="category-section-title">Your Categories</h3>
          <ul class="existing-categories" role="list">
            <li
              v-for="category in listStore.categories"
              :key="category.id"
              class="existing-category-item">
              <span
                class="existing-category-dot"
                :style="{ backgroundColor: category.color }">
              </span>
              <span class="existing-category-name">{{ category.name }}</span>
              <button
                @click="confirmDeleteCategory(category); closeCategoryDialog()"
                class="existing-category-delete"
                :aria-label="`Delete ${category.name} category`">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true" focusable="false" width="16"
                  height="16">
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

        <!-- Create Custom -->
        <div class="category-section">
          <h3 class="category-section-title">Create Custom</h3>
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
                <span class="form-label-hint">— click a swatch to choose</span>
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

                <!-- Custom color picker at the end -->
                <div class="color-swatch-custom">
                  <label
                    for="category-color-custom"
                    class="color-swatch color-swatch-picker"
                    :aria-label="`Custom color picker: ${newCategoryColor}`"
                    tabindex="0"
                    @keydown.enter.prevent="($el as HTMLElement).click()"
                    @keydown.space.prevent="($el as HTMLElement).click()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                      stroke="white" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" aria-hidden="true" focusable="false" width="22"
                      height="22">
                      <circle cx="13.5" cy="6.5" r=".5" fill="white" />
                      <circle cx="17.5" cy="10.5" r=".5" fill="white" />
                      <circle cx="8.5" cy="7.5" r=".5" fill="white" />
                      <circle cx="6.5" cy="12.5" r=".5" fill="white" />
                      <path
                        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                    </svg>
                    <input
                      id="category-color-custom"
                      v-model="newCategoryColor"
                      type="color"
                      class="color-picker-input-hidden"
                      aria-label="Choose a custom color" />
                  </label>
                  <span class="visually-hidden">Custom</span>
                </div>
              </div>
            </div>

            <div class="dialog-actions">
              <button
                type="button"
                @click="closeCategoryDialog"
                class="button button-secondary">
                Close
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
      aria-labelledby="collab-title"
      aria-modal="true">
      <div class="dialog dialog-large" @click.stop>
        <h2 id="collab-title" class="dialog-title">Share List</h2>
        <p class="dialog-description">
          Invite others to view or edit this list with you.
        </p>

        <!-- Share Form -->
        <div class="collab-form">
          <h3 class="collab-subtitle">Invite by Email</h3>
          <div class="collab-input-group">
            <input
              v-model="shareEmail"
              type="email"
              class="input"
              placeholder="Enter email address"
              @keyup.enter="handleShareList" />
            <select v-model="sharePermission" class="input collab-permission-select">
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
          <h3 class="collab-subtitle">People with Access</h3>
          <div v-if="isLoadingShares" class="loading-shares">
            <div class="spinner-small"></div>
            <span>Loading...</span>
          </div>
          <ul v-else class="shares-items">
            <li v-for="share in listShares" :key="share.id" class="collab-item">
              <div class="collab-info">
                <span class="collab-email">{{ share.invited_email || share.email || 'Unknown user'
                  }}</span>
                <span class="collab-permission">
                  {{ share.permission_level === 'edit' ? 'Can Edit' : 'Can View' }}
                </span>
                <span v-if="!share.user_id" class="collab-pending">Pending</span>
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
        <div class="collab-section">
          <h3 class="collab-subtitle">Share Link</h3>
          <div class="collab-link-group">
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

    <!-- Image Viewer Modal (outside all other dialogs to avoid z-index issues) -->
    <div
      v-if="viewingImage"
      class="image-viewer-overlay"
      @click="closeImageViewer"
      role="dialog"
      aria-labelledby="image-viewer-title"
      aria-modal="true">
      <div class="image-viewer-content" @click.stop>
        <div class="image-viewer-header">
          <h2 id="image-viewer-title" class="image-viewer-title">{{ viewingImageAlt }}</h2>
          <button
            @click="closeImageViewer"
            class="image-viewer-close"
            aria-label="Close image viewer">
            ×
          </button>
        </div>
        <div class="image-viewer-body">
          <img :src="viewingImage" :alt="viewingImageAlt" />
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

    <AppFooter />

  </div>
</template>

<script setup lang="ts">
import { useListStore } from '~/stores/listStore'
import { useRealtimeSubscription } from '~/composables/useRealtimeSubscription'
import Sortable from 'sortablejs'
import type { Category, GroceryItem } from '~/types/models'
import { clearAllData } from '~/server/utils/indexedDB'
import { getList } from '~/server/utils/indexedDB'
import { usePullToRefresh } from '~/composables/usePullToRefresh'

definePageMeta({
  middleware: 'auth'
})

const categoryPresets = {
  Grocery: [
    { name: 'Produce', color: '#4D7C0F' },
    { name: 'Meat', color: '#B91C1C' },
    { name: 'Seafood', color: '#0369A1' },
    { name: 'Deli', color: '#C2410C' },
    { name: 'Dairy', color: '#0F766E' },
    { name: 'Bakery', color: '#B45309' },
    { name: 'Frozen', color: '#3730A3' },
    { name: 'Beverages', color: '#0F766E' },
    { name: 'Snacks', color: '#9F1239' },
    { name: 'Household', color: '#334155' },
    { name: 'Personal Care', color: '#6D28D9' },
    { name: 'Baby', color: '#86198F' },
  ],
  Hardware: [
    { name: 'Lumber', color: '#B45309' },
    { name: 'Electrical', color: '#B91C1C' },
    { name: 'Plumbing', color: '#0369A1' },
    { name: 'Paint', color: '#6D28D9' },
    { name: 'Tools', color: '#334155' },
    { name: 'Garden', color: '#4D7C0F' },
    { name: 'Flooring', color: '#C2410C' },
    { name: 'Hardware', color: '#1E3A5F' },
  ],
  Wholesale: [
    { name: 'Fresh', color: '#4D7C0F' },
    { name: 'Frozen', color: '#3730A3' },
    { name: 'Pantry', color: '#B45309' },
    { name: 'Household', color: '#334155' },
    { name: 'Electronics', color: '#1E3A5F' },
    { name: 'Clothing', color: '#581C87' },
    { name: 'Pharmacy', color: '#065F46' },
  ],
  Pharmacy: [
    { name: 'Prescriptions', color: '#B91C1C' },
    { name: 'Health', color: '#065F46' },
    { name: 'Beauty', color: '#86198F' },
    { name: 'Household', color: '#334155' },
    { name: 'Snacks', color: '#9F1239' },
  ],
} as const

const colorPalette = [
  { name: 'Crimson', value: '#B91C1C' },
  { name: 'Tangerine', value: '#C2410C' },
  { name: 'Amber', value: '#B45309' },
  { name: 'Lime', value: '#4D7C0F' },
  { name: 'Emerald', value: '#065F46' },
  { name: 'Teal', value: '#0F766E' },
  { name: 'Sky', value: '#0369A1' },
  { name: 'Indigo', value: '#3730A3' },
  { name: 'Violet', value: '#6D28D9' },
  { name: 'Fuchsia', value: '#86198F' },
  { name: 'Rose', value: '#9F1239' },
  { name: 'Slate', value: '#334155' },
  { name: 'Forest', value: '#14532D' },
  { name: 'Navy', value: '#1E3A5F' },
  { name: 'Plum', value: '#581C87' },
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
const newItemImage = ref<File | null>(null)
const newItemImagePreview = ref<string | null>(null)
const newItemImageInput = ref<HTMLInputElement | null>(null)
const showShareDialog = ref(false)
const shareLinkInput = ref<HTMLInputElement | null>(null)
const linkCopied = ref(false)
const showUpdateNotification = ref(false)
const updateMessage = ref('')
const showCategoryDialog = ref(false)
const newCategoryName = ref('')
const newCategoryColor = ref('#7c3aed')
const categoryNameInput = ref<HTMLInputElement | null>(null)
const isCreatingCategory = ref(false)
const editingCategory = ref<string | null>(null)
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
const viewingImage = ref<string | null>(null)
const viewingImageAlt = ref<string>('')
const listShares = ref<any[]>([])
const isLoadingShares = ref(false)
const { canShare } = useSubscription()
const shareEmail = ref('')
const sharePermission = ref<'view' | 'edit'>('edit')
const isSharingList = ref(false)
const isLoggingOut = ref(false)
const activePresetBundle = ref<keyof typeof categoryPresets>('Grocery')

let sortableInstance: Sortable | null = null

const { avatarUrl, userInitials, loadAvatar } = useUserAvatar()

onMounted(async () => {
  await loadAvatar()
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
      listStore.currentList = list  // only reads from IndexedDB, never Supabase
    }

    await listStore.fetchLists?.()
    await listStore.fetchItems?.(listId.value)
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
  isSharingList.value = true  // set immediately, before validation

  if (!email.includes('@')) {
    alert('Please enter a valid email address')
    isSharingList.value = false
    return
  }

  try {
    const newShare = await listStore.shareList?.(listId.value, email, sharePermission.value)
    if (newShare) {
      listShares.value.push(newShare)
    }
    shareEmail.value = ''
    sharePermission.value = 'edit'
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
    listShares.value = listShares.value.filter(share => share.id !== shareId)
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
      }
    },
    (payload: any) => {
      const updatedItem = payload.new
      if (listStore.currentItems) {
        const index = listStore.currentItems.findIndex((item: GroceryItem) => item.id === updatedItem.id)
        if (index !== -1) {
          const existingItem = listStore.currentItems[index]
          listStore.currentItems[index] = updatedItem
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

const handleTogglePresetCategory = async (preset: { name: string, color: string }) => {
  const existing = listStore.categories.find(c => c.name === preset.name)
  if (existing) {
    await listStore.deleteCategoryById?.(existing.id)
    showNotification(`"${preset.name}" removed`)
  } else {
    await listStore.createCategory?.(listId.value, preset.name, preset.color)
    showNotification(`"${preset.name}" added`)
  }
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

const handleNewItemImageSelect = (event: Event) => {
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

    newItemImage.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      newItemImagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeNewItemImage = () => {
  newItemImage.value = null
  newItemImagePreview.value = null
  if (newItemImageInput.value) {
    newItemImageInput.value.value = ''
  }
}

const openImageViewer = (imageUrl: string, itemName: string) => {
  viewingImage.value = imageUrl
  viewingImageAlt.value = itemName
}

const closeImageViewer = () => {
  viewingImage.value = null
  viewingImageAlt.value = ''
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

    if (newItemImage.value && newItem) {
      await listStore.updateItemImage?.(newItem.id, newItemImage.value)
    }

    newItemText.value = ''
    newItemCategory.value = null
    newItemImage.value = null
    newItemImagePreview.value = null
    if (newItemImageInput.value) {
      newItemImageInput.value.value = ''
    }
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
    const item = listStore.currentItems?.find((i: GroceryItem) => i.id === itemId)
    if (item) {
      const action = item.checked ? 'checked' : 'unchecked'
      showNotification(`${item.text} was ${action}`)
    }
  } catch (error) {
    console.error('Error toggling item:', error)
  }
}

const startEditingItem = (item: GroceryItem) => {
  editingItemId.value = item.id
  editingText.value = item.text
  editingNotes.value = item.notes || ''
  editingCategory.value = item.category
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

const inlineNewCategoryName = ref('')

const saveInlineCategory = async () => {
  const name = inlineNewCategoryName.value.trim()
  if (!name) return
  await listStore.createCategory?.(listId.value, name, '#7c3aed')
  editingCategory.value = name
  inlineNewCategoryName.value = ''
}

const cancelEditing = () => {
  editingItemId.value = null
  editingText.value = ''
  editingNotes.value = ''
  editingCategory.value = null
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
    await listStore.updateItemCategory?.(itemId, editingCategory.value)

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
  newCategoryColor.value = '#7c3aed'
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

const { pullDistance, refreshing, THRESHOLD } = usePullToRefresh(async () => {
  await loadListData()
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
  overflow-x: hidden;
}

.button-danger {
  background-color: var(--color-danger);
  color: white;
}

.button-danger:hover {
  background-color: #b91c1c;
}

.button-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}

.categories-section {
  margin-bottom: var(--spacing-xl);
}

.category-section {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.category-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.category-section-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 var(--spacing-md);
}

.preset-bundle-tabs {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
}

.preset-tab {
  padding: var(--spacing-xs) var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: 2rem;
  background: none;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.preset-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-text);
}

.preset-tab-active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.preset-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.preset-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 2rem;
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-text);
  font-family: inherit;
}

.preset-chip:hover:not(:disabled) {
  border-color: var(--preset-color);
  color: var(--color-text);
}

.preset-chip-added {
  background-color: var(--preset-color);
  border-color: var(--preset-color);
  color: white;
  opacity: 0.8;
}

.preset-chip-added:hover {
  opacity: 1;
}

.preset-chip-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.existing-categories {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.existing-category-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--color-surface);
  border-radius: 0.375rem;
}

.existing-category-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}

.existing-category-name {
  flex: 1;
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.existing-category-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  color: var(--color-danger);
  transition: background-color 0.2s;
}

.existing-category-delete:hover {
  background-color: rgba(220, 38, 38, 0.1);
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

.inline-new-category {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
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
  border: 2px solid var(--item-border-color, var(--color-border));
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

.new-item-image-preview {
  position: relative;
  display: inline-block;
  max-width: 120px;
}

.new-item-image-preview img {
  width: 100%;
  height: auto;
  border-radius: 0.375rem;
  border: 2px solid var(--color-border);
}

@media (max-width: 640px) {
  .add-item-group {
    flex-direction: column;
  }

  .new-item-image-preview {
    max-width: 100%;
  }
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

.form-label-hint {
  font-size: var(--font-size-xs);
  font-weight: 400;
  color: var(--color-text-secondary);
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
  min-width: 0;
  flex: 1;
}

.item-text {
  font-size: var(--font-size-base);
  color: var(--color-text);
  word-break: break-word;
  min-width: 0;
  flex: 1;
}

.item-checked .item-text {
  text-decoration: line-through;
}

.item-category-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
}

.item-checked .item-category-dot {
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

.item-image-thumbnail {
  margin-top: var(--spacing-sm);
  max-width: 80px;
  cursor: pointer;
}

.item-image-thumbnail img {
  width: 100%;
  height: auto;
  border-radius: 0.375rem;
  border: 2px solid var(--color-border);
  transition: transform 0.2s, box-shadow 0.2s;
}

.item-image-thumbnail img:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.item-image-thumbnail img:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.image-viewer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.image-viewer-content {
  background-color: var(--color-background);
  border-radius: 0.5rem;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.image-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.image-viewer-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
}

.image-viewer-close {
  min-width: var(--min-touch-target);
  min-height: var(--min-touch-target);
  padding: var(--spacing-xs);
  background: none;
  border: none;
  font-size: var(--font-size-3xl);
  line-height: 1;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
}

.image-viewer-close:hover {
  background-color: var(--color-surface);
  color: var(--color-text);
}

.image-viewer-close:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.image-viewer-body {
  padding: var(--spacing-lg);
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-viewer-body img {
  max-width: 100%;
  max-height: 70vh;
  height: auto;
  border-radius: 0.375rem;
}

.image-upload-label:focus {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  border-color: var(--color-primary);
}

.image-upload-label:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
  border-color: var(--color-primary);
}

@media (max-width: 640px) {
  .item-image-thumbnail {
    max-width: 60px;
  }

  .image-viewer-content {
    max-width: 95vw;
    max-height: 95vh;
  }

  .image-viewer-header {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .image-viewer-title {
    font-size: var(--font-size-base);
  }

  .image-viewer-body {
    padding: var(--spacing-md);
  }

  .image-viewer-body img {
    max-height: 60vh;
  }
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: 0.5rem;
}

.items-summary .button {
  width: auto;
  flex-shrink: 0;
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
  min-width: 200px;
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
}

.collab-email {
  font-weight: 500;
  color: var(--color-text);
}

.collab-permission {
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
}

@media (max-width: 640px) {
  .collab-input-group {
    flex-direction: column;
  }

  .collab-input-group .input,
  .collab-permission-select {
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

.color-swatch-picker {
  position: relative;
  cursor: pointer;
  min-width: 50px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-swatch-picker {
  background-color: #0EA5E9
}

.color-picker-input-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.color-picker-input {
  width: 36px;
  height: 36px;
  padding: 2px;
  border: 2px solid var(--color-border);
  border-radius: 0.375rem;
  cursor: pointer;
  background: none;
}

.color-picker-input:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
}

.color-check {
  color: white;
  font-size: var(--font-size-xl);
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.dialog-actions .button-danger {
  background-color: #b91c1c;
  color: white;
  border: 2px solid #b91c1c;
}

.dialog-actions .button-danger:hover:not(:disabled) {
  background-color: #991b1b;
  border-color: #991b1b;
  color: white;
}

.dialog-actions .button-secondary {
  background-color: var(--color-surface);
  color: var(--color-text);
  border: 2px solid var(--color-border);
}

.dialog-actions .button-secondary:hover:not(:disabled) {
  background-color: var(--color-border);
  color: var(--color-text);
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

.pull-indicator {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  z-index: 999;
  pointer-events: none;
  transition: opacity 0.1s;
}

.pull-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
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

/* Mobile optimizations */
@media (max-width: 640px) {
  .container {
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
    box-sizing: border-box;
  }

  .header-content {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    align-items: center;
  }

  .header-actions .button {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
  }

  .app-title {
    flex: 1;
    min-width: 0;
    font-size: var(--font-size-base);
  }

  .section-header {
    flex-wrap: wrap;
  }

  .button-icon-only {
    min-width: 36px;
    min-height: 36px;
  }

  .categories-list {
    gap: var(--spacing-xs);
  }

  .category-chip {
    font-size: var(--font-size-xs);
    padding: 4px var(--spacing-sm);
    padding-right: var(--spacing-lg);
  }

  .add-item-form {
    flex-direction: column;
  }

  .add-item-group {
    flex-direction: column;
  }

  .category-select {
    min-width: 100%;
  }

  .drag-handle {
    min-width: 36px;
    font-size: var(--font-size-base);
  }

  .item-row {
    padding: var(--spacing-sm);
    gap: var(--spacing-xs);
  }

  .item-text {
    font-size: var(--font-size-sm);
  }

  .item-notes {
    font-size: var(--font-size-xs);
  }

  .item-edit-form {
    flex-direction: column;
  }

  .edit-actions {
    width: 100%;
  }

  .edit-actions .button {
    flex: 1;
  }

  .button-icon {
    min-width: 36px;
    min-height: 36px;
    font-size: var(--font-size-xl);
  }

  .dialog {
    margin: var(--spacing-sm);
    padding: var(--spacing-md);
    max-width: calc(100vw - 2rem);
    width: calc(100vw - 2rem);
    box-sizing: border-box;
  }

  .dialog-actions {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .dialog-actions .button {
    flex: 1;
    min-width: 0;
    padding: 0 var(--spacing-sm);
    font-size: var(--font-size-sm);
    box-sizing: border-box;
  }

  .dialog-large {
    max-width: calc(100vw - var(--spacing-lg));
  }

  .collab-input-group {
    flex-direction: column;
  }

  .collab-input-group .input,
  .collab-permission-select {
    width: 100%;
  }

  .color-palette {
    grid-template-columns: repeat(4, 1fr);
  }

  .color-swatch {
    min-width: 40px;
    min-height: 40px;
  }
}

/* Tablet optimizations */
@media (min-width: 641px) and (max-width: 1023px) {
  .add-item-group {
    flex-wrap: wrap;
  }

  .color-palette {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* Desktop optimizations */
@media (min-width: 1024px) {
  .container {
    max-width: 800px;
  }

  .color-palette {
    grid-template-columns: repeat(8, 1fr);
  }
}

/* Landscape phone fixes */
@media (max-width: 896px) and (orientation: landscape) {
  .dialog {
    max-height: 90vh;
    overflow-y: auto;
  }
}
</style>