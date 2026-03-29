<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">

        <!-- Left: title + avatar -->
        <div class="header-left">
          <NuxtLink to="/" class="app-title-link" aria-label="BasketBuddy home">
            <h1 class="app-title">{{ title }}</h1>
          </NuxtLink>
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
        </div>

        <!-- Right: actions -->
        <div class="header-actions">
          <span
            v-if="showOffline"
            class="offline-badge"
            role="status"
            aria-live="polite">
            Offline
          </span>

          <!-- Desktop actions -->
          <div class="desktop-actions">
            <slot name="actions" />
            <button
              v-if="showShare"
              @click="emit('share')"
              class="button button-secondary"
              aria-label="Share this list">
              Share
            </button>
            <button
              @click="router.push('/rewards')"
              class="button button-secondary"
              aria-label="Manage rewards cards">
              Rewards
            </button>
            <button
              @click="router.push('/pricing')"
              class="button button-secondary"
              aria-label="View pricing">
              Pricing
            </button>
            <button
              @click="router.push('/settings')"
              class="button button-secondary"
              aria-label="Account settings">
              Settings
            </button>
            <button
              @click="toggleTheme"
              class="button button-secondary theme-toggle"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
              <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" width="20" height="20">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" width="20" height="20">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
            <button
              @click="emit('logout')"
              class="button button-secondary"
              :disabled="isLoggingOut"
              aria-label="Sign out of your account">
              <span v-if="isLoggingOut">Signing out...</span>
              <span v-else>Sign Out</span>
            </button>
          </div>

          <!-- Mobile hamburger -->
          <button
            class="hamburger"
            :aria-expanded="menuOpen"
            aria-controls="mobile-menu"
            :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
            @click="menuOpen = !menuOpen">
            <span class="hamburger-bar" />
            <span class="hamburger-bar" />
            <span class="hamburger-bar" />
          </button>
        </div>

      </div>
    </div>

    <!-- Drawer overlay -->
    <Transition name="overlay">
      <div
        v-if="menuOpen"
        class="drawer-overlay"
        aria-hidden="true"
        @click="menuOpen = false" />
    </Transition>

    <!-- Slide-in drawer -->
    <Transition name="drawer">
      <nav
        v-if="menuOpen"
        id="mobile-menu"
        class="drawer"
        aria-label="Mobile navigation">
        <div class="drawer-header">
          <div class="drawer-avatar-container">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Profile picture"
              class="drawer-avatar" />
            <span v-else class="drawer-avatar-placeholder" aria-hidden="true">
              {{ userInitials }}
            </span>
          </div>
          <button
            class="drawer-close"
            aria-label="Close menu"
            @click="menuOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true" focusable="false" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ul class="drawer-nav" role="list">
          <slot name="drawer-actions">
            <li v-if="showShare">
              <button class="drawer-item" @click="emit('share'); menuOpen = false">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" aria-hidden="true" focusable="false" width="20"
                  height="20">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share List
              </button>
            </li>
          </slot>

          <li class="drawer-section-label">App</li>

          <li>
            <button class="drawer-item" @click="router.push('/'); menuOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" width="20" height="20">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              My Lists
            </button>
          </li>
          <li>
            <button class="drawer-item" @click="router.push('/rewards'); menuOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" width="20" height="20">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Rewards
            </button>
          </li>
          <li>
            <button class="drawer-item" @click="router.push('/pricing'); menuOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" width="20" height="20">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Pricing
            </button>
          </li>
          <li>
            <button class="drawer-item" @click="router.push('/settings'); menuOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" width="20" height="20">
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Settings
            </button>
          </li>

          <li class="drawer-section-label">Info</li>

          <li>
            <button class="drawer-item" @click="router.push('/faq'); menuOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" width="20" height="20">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              FAQ
            </button>
          </li>
          <li>
            <button class="drawer-item" @click="router.push('/support'); menuOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" width="20" height="20">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Support
            </button>
          </li>
          <li>
            <button class="drawer-item" @click="router.push('/privacy'); menuOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" width="20" height="20">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Privacy
            </button>
          </li>
          <li>
            <button class="drawer-item" @click="router.push('/terms'); menuOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true" focusable="false" width="20" height="20">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Terms
            </button>
          </li>
        </ul>

        <div class="drawer-footer">
          <button
            class="drawer-item drawer-theme-toggle"
            @click="toggleTheme">
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true" focusable="false" width="20" height="20">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true" focusable="false" width="20" height="20">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            {{ isDark ? 'Light Mode' : 'Dark Mode' }}
          </button>
          <button
            class="drawer-item drawer-signout"
            :disabled="isLoggingOut"
            @click="emit('logout'); menuOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true" focusable="false" width="20" height="20">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span v-if="isLoggingOut">Signing out...</span>
            <span v-else>Sign Out</span>
          </button>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  showBack?: boolean
  showOffline?: boolean
  showShare?: boolean
  isLoggingOut?: boolean
  avatarUrl?: string | null
  userInitials?: string
}>()

const emit = defineEmits<{
  logout: []
  share: []
}>()

const router = useRouter()
const { toggleTheme, isDark } = useTheme()
const menuOpen = ref(false)

watch(() => router.currentRoute.value.path, () => {
  menuOpen.value = false
})

onMounted(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') menuOpen.value = false
  }
  window.addEventListener('keydown', handleEsc)
  onUnmounted(() => window.removeEventListener('keydown', handleEsc))
})
</script>

<style scoped>
.app-header {
  padding-top: env(safe-area-inset-top, 16px);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 0;
}

.app-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
  color: white;
}

.app-title-link {
  text-decoration: none;
  color: inherit;
}

.app-title-link:hover .app-title {
  opacity: 0.85;
}

.app-header .button-secondary,
.app-header .button-icon-only {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: transparent;
}

.app-header .button-secondary:hover:not(:disabled),
.app-header .button-icon-only:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.3);
}

.header-avatar-container {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.header-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.desktop-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.offline-badge {
  background-color: rgba(255, 255, 255, 0.2);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 0.25rem;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: white;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  box-sizing: border-box;
}

.hamburger:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hamburger:focus-visible {
  outline: 3px solid white;
  outline-offset: 3px;
}

.hamburger-bar {
  display: block;
  width: 100%;
  height: 2px;
  background-color: white;
  border-radius: 2px;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 150;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 85vw);
  background-color: var(--color-surface);
  z-index: 200;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-primary);
}

.drawer-avatar-container {
  display: flex;
  align-items: center;
}

.drawer-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.drawer-avatar-placeholder {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-base);
  font-weight: 700;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.drawer-close {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 0.375rem;
  color: white;
  cursor: pointer;
}

.drawer-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.drawer-close:focus-visible {
  outline: 3px solid white;
  outline-offset: 3px;
}

.drawer-nav {
  list-style: none;
  padding: var(--spacing-md) 0;
  margin: 0;
  flex: 1;
}

.drawer-nav li {
  padding: 0 var(--spacing-sm);
}

.drawer-section-label {
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-xs);
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-secondary);
  list-style: none;
  margin-top: var(--spacing-sm);
}

.drawer-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-md);
  background: none;
  border: none;
  border-radius: 0.375rem;
  color: var(--color-text);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
  font-family: inherit;
}

.drawer-item:hover {
  background-color: var(--color-background);
}

.drawer-item:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
}

.drawer-item svg {
  flex-shrink: 0;
  color: var(--color-primary);
}

.drawer-footer {
  padding: var(--spacing-md) var(--spacing-sm);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.drawer-signout {
  color: var(--color-danger);
}

.drawer-signout svg {
  color: var(--color-danger);
}

.drawer-signout:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

@media (max-width: 640px) {
  .hamburger {
    box-sizing: border-box;
    display: flex;
  }

  .desktop-actions {
    display: none;
  }
}
</style>