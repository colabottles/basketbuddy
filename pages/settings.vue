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
          <h1 class="app-title">Settings</h1>
          <div class="header-actions">
            <button
              @click="router.push('/rewards')"
              class="button button-secondary"
              aria-label="Manage rewards cards">
              Rewards
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
        <section class="settings-section">
          <h2 class="section-title">Account Settings</h2>

          <!-- Avatar Upload -->
          <div class="settings-group">
            <h3 class="settings-label">Profile Picture</h3>
            <div class="avatar-section">
              <div class="avatar-preview">
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  alt="Profile picture"
                  class="avatar-image" />
                <div v-else class="avatar-placeholder">
                  <span aria-hidden="true">{{ userInitials }}</span>
                </div>
              </div>
              <div class="avatar-actions">
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  @change="handleAvatarSelect"
                  class="visually-hidden"
                  id="avatar-input" />
                <label for="avatar-input" class="button button-secondary">
                  {{ avatarUrl ? 'Change Photo' : 'Upload Photo' }}
                </label>
                <button
                  v-if="avatarUrl"
                  @click="handleRemoveAvatar"
                  class="button button-danger"
                  :disabled="isRemovingAvatar">
                  {{ isRemovingAvatar ? 'Removing...' : 'Remove Photo' }}
                </button>
              </div>
            </div>
            <div v-if="avatarError" class="error-message" role="alert">
              {{ avatarError }}
            </div>
            <div v-if="avatarSuccess" class="success-message" role="status">
              {{ avatarSuccess }}
            </div>
          </div>

          <!-- Email Settings -->
          <div class="settings-group">
            <h3 class="settings-label">Email Address</h3>
            <p v-if="!showEmailForm" class="settings-value">{{ userEmail || 'Loading...' }}</p>

            <button
              v-if="!showEmailForm"
              @click="showEmailForm = true"
              class="button button-secondary">
              Change Email
            </button>

            <form v-else @submit.prevent="handleChangeEmail" class="email-form">
              <div class="form-group">
                <label for="current-email" class="form-label">Current Email</label>
                <input
                  id="current-email"
                  :value="userEmail"
                  type="email"
                  class="input"
                  disabled
                  readonly />
              </div>

              <div class="form-group">
                <label for="new-email" class="form-label">
                  New Email Address
                  <span aria-hidden="true">*</span>
                </label>
                <input
                  id="new-email"
                  v-model="newEmail"
                  type="email"
                  class="input"
                  autocomplete="email"
                  required />
              </div>

              <div v-if="emailChangeError" class="error-message" role="alert">
                {{ emailChangeError }}
              </div>

              <div v-if="emailChangeSuccess" class="success-message" role="status">
                {{ emailChangeSuccess }}
              </div>

              <div class="form-actions">
                <button
                  type="button"
                  @click="cancelEmailChange"
                  class="button button-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  class="button button-primary"
                  :disabled="isChangingEmail">
                  {{ isChangingEmail ? 'Updating...' : 'Update Email' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Change Password -->
          <div class="settings-group">
            <h3 class="settings-label">Password</h3>
            <button
              v-if="!showPasswordForm"
              @click="showPasswordForm = true"
              class="button button-secondary">
              Change Password
            </button>

            <form v-else @submit.prevent="handleChangePassword" class="password-form">
              <div class="form-group">
                <label for="current-password" class="form-label">
                  Current Password
                  <span aria-hidden="true">*</span>
                </label>
                <div class="password-input-wrapper">
                  <input
                    id="current-password"
                    v-model="currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="input input-with-icon"
                    required />
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="password-toggle"
                    :aria-label="showCurrentPassword ? 'Hide password' : 'Show password'">
                    <svg v-if="showCurrentPassword" xmlns="http://www.w3.org/2000/svg" width="20"
                      height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      aria-hidden="true">
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                      </path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="new-password" class="form-label">
                  New Password
                  <span aria-hidden="true">*</span>
                </label>
                <div class="password-input-wrapper">
                  <input
                    id="new-password"
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="input input-with-icon"
                    required />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="password-toggle"
                    :aria-label="showNewPassword ? 'Hide password' : 'Show password'">
                    <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" width="20"
                      height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      aria-hidden="true">
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                      </path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
                <span class="help-text">Must be at least 6 characters</span>
              </div>

              <div class="form-group">
                <label for="confirm-password" class="form-label">
                  Confirm New Password
                  <span aria-hidden="true">*</span>
                </label>
                <div class="password-input-wrapper">
                  <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="input input-with-icon"
                    required />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="password-toggle"
                    :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'">
                    <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20"
                      height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      aria-hidden="true">
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                      </path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="passwordError" class="error-message" role="alert">
                {{ passwordError }}
              </div>

              <div v-if="passwordSuccess" class="success-message" role="status">
                {{ passwordSuccess }}
              </div>

              <div class="form-actions">
                <button
                  type="button"
                  @click="cancelPasswordChange"
                  class="button button-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  class="button button-primary"
                  :disabled="isChangingPassword">
                  {{ isChangingPassword ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Password Recovery -->
          <div class="settings-group">
            <h3 class="settings-label">Forgot Your Password?</h3>
            <p class="settings-description">
              Send a password reset link to your email address.
            </p>
            <button
              @click="handlePasswordReset"
              class="button button-secondary"
              :disabled="isSendingReset">
              {{ isSendingReset ? 'Sending...' : 'Send Reset Link' }}
            </button>
            <div v-if="resetSuccess" class="success-message" role="status">
              {{ resetSuccess }}
            </div>
            <div v-if="resetError" class="error-message" role="alert">
              {{ resetError }}
            </div>
          </div>
        </section>
      </div>
    </main>

    <footer class="app-footer">
      <div class="container">
        <div class="footer-content">
          <p class="footer-text">© {{ new Date().getFullYear() }} BasketBuddy. Made with <span
              class="heart">❤️</span> by <a href="https://toddl.dev"
              target="_blank" rel="noopener noreferrer" class="footer-link">Todd Libby</a>.</p>
          <p class="footer-text">Built with accessibility in mind. Support on <a
              href="https://github.com/colabottles/basketbuddy" target="_blank"
              rel="noopener noreferrer" class="footer-link">GitHub</a> or <a href="https://ko-fi.com/Y8Y727FD2" class="footer-link" target="_blank">Ko-Fi</a> to keep costs down.</p>
        </div>
      </div>
    </footer>

    <div v-if="isLoggingOut" class="logout-overlay">
      <div class="logout-spinner"></div>
      <p class="logout-text">Signing out...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clearAllData } from '~/utils/indexedDB'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabase()
const router = useRouter()

const userEmail = ref('')
const showPasswordForm = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isChangingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')
const isSendingReset = ref(false)
const resetSuccess = ref('')
const resetError = ref('')
const isLoggingOut = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarUrl = ref('')
const isUploadingAvatar = ref(false)
const isRemovingAvatar = ref(false)
const avatarError = ref('')
const avatarSuccess = ref('')
const newEmail = ref('')
const showEmailForm = ref(false)
const isChangingEmail = ref(false)
const emailChangeError = ref('')
const emailChangeSuccess = ref('')

const userInitials = computed(() => {
  if (!userEmail.value) return '??'

  const parts = userEmail.value.split('@')[0]?.split('.') || []
  const firstPart = parts[0]
  const secondPart = parts[1]

  if (parts.length > 1 && firstPart && firstPart.length > 0 && secondPart && secondPart.length > 0) {
    return (firstPart[0]! + secondPart[0]!).toUpperCase()
  } else if (firstPart && firstPart.length > 1) {
    return firstPart.substring(0, 2).toUpperCase()
  } else if (userEmail.value.length > 1) {
    return userEmail.value.substring(0, 2).toUpperCase()
  }

  return '??'
})

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    userEmail.value = user.email || ''
    // Load avatar URL from user metadata
    avatarUrl.value = user.user_metadata?.avatar_url || ''
  }
})

const handleAvatarSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  avatarError.value = ''
  avatarSuccess.value = ''

  // Validate file
  if (!file.type.startsWith('image/')) {
    avatarError.value = 'Please select an image file'
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    avatarError.value = 'Image must be less than 2MB'
    return
  }

  isUploadingAvatar.value = true

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user found')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/avatar.${fileExt}`

    // Delete old avatar if exists
    if (avatarUrl.value) {
      const oldPath = avatarUrl.value.split('/').slice(-2).join('/')
      await supabase.storage.from('avatars').remove([oldPath])
    }

    // Upload new avatar
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: urlData.publicUrl }
    })

    if (updateError) throw updateError

    avatarUrl.value = urlData.publicUrl
    avatarSuccess.value = 'Profile picture updated successfully!'

    setTimeout(() => {
      avatarSuccess.value = ''
    }, 3000)
  } catch (error: any) {
    console.error('Avatar upload error:', error)
    avatarError.value = error.message || 'Failed to upload avatar'
  } finally {
    isUploadingAvatar.value = false
    if (avatarInput.value) {
      avatarInput.value.value = ''
    }
  }
}

const handleRemoveAvatar = async () => {
  avatarError.value = ''
  avatarSuccess.value = ''
  isRemovingAvatar.value = true

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user found')

    // Delete from storage
    if (avatarUrl.value) {
      const path = avatarUrl.value.split('/').slice(-2).join('/')
      await supabase.storage.from('avatars').remove([path])
    }

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: null }
    })

    if (updateError) throw updateError

    avatarUrl.value = ''
    avatarSuccess.value = 'Profile picture removed'

    setTimeout(() => {
      avatarSuccess.value = ''
    }, 3000)
  } catch (error: any) {
    console.error('Avatar removal error:', error)
    avatarError.value = error.message || 'Failed to remove avatar'
  } finally {
    isRemovingAvatar.value = false
  }
}
const handleChangeEmail = async () => {
  emailChangeError.value = ''
  emailChangeSuccess.value = ''

  if (!newEmail.value.trim()) {
    emailChangeError.value = 'Email is required'
    return
  }

  if (!validateEmail(newEmail.value)) {
    emailChangeError.value = 'Please enter a valid email address'
    return
  }

  if (newEmail.value === userEmail.value) {
    emailChangeError.value = 'This is already your email address'
    return
  }

  isChangingEmail.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      email: newEmail.value
    })

    if (error) throw error

    emailChangeSuccess.value = 'Confirmation email sent! Check your new email address to confirm the change.'

    setTimeout(() => {
      cancelEmailChange()
    }, 3000)
  } catch (error: any) {
    emailChangeError.value = error.message || 'Failed to update email'
  } finally {
    isChangingEmail.value = false
  }
}

const cancelEmailChange = () => {
  showEmailForm.value = false
  newEmail.value = ''
  emailChangeError.value = ''
  emailChangeSuccess.value = ''
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleChangePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (newPassword.value.length < 6) {
    passwordError.value = 'New password must be at least 6 characters'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match'
    return
  }

  isChangingPassword.value = true

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value
    })

    if (error) throw error

    passwordSuccess.value = 'Password updated successfully!'

    // Reset form
    setTimeout(() => {
      cancelPasswordChange()
    }, 2000)
  } catch (error: any) {
    passwordError.value = error.message || 'Failed to update password'
  } finally {
    isChangingPassword.value = false
  }
}

const cancelPasswordChange = () => {
  showPasswordForm.value = false
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  passwordError.value = ''
  passwordSuccess.value = ''
}

const handlePasswordReset = async () => {
  resetError.value = ''
  resetSuccess.value = ''
  isSendingReset.value = true

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(userEmail.value, {
      redirectTo: `${window.location.origin}/settings`
    })

    if (error) throw error

    resetSuccess.value = 'Password reset link sent to your email!'
  } catch (error: any) {
    resetError.value = error.message || 'Failed to send reset link'
  } finally {
    isSendingReset.value = false
  }
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
  title: 'Settings - BasketBuddy'
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
  border: none;
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

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
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

.settings-section {
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xl);
  color: var(--color-text);
}

.settings-group {
  background-color: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: 0.5rem;
  margin-bottom: var(--spacing-lg);
}

.settings-label {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text);
}

.settings-value {
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-base);
}

.settings-description {
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.password-form {
  margin-top: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-base);
}

.form-label span {
  color: red;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon {
  padding-right: 48px;
}

.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  border-radius: 0.25rem;
}

.password-toggle:hover {
  color: var(--color-text);
}

.password-toggle svg {
  flex-shrink: 0;
}

.help-text {
  display: block;
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.error-message {
  padding: var(--spacing-sm);
  background-color: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.375rem;
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-md);
}

.success-message {
  padding: var(--spacing-sm);
  background-color: rgba(5, 150, 105, 0.1);
  border: 1px solid rgba(5, 150, 105, 0.3);
  border-radius: 0.375rem;
  color: var(--color-success);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-md);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
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
  box-sizing: border-box;
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
  padding: var(--spacing-lg) 0;
  margin-top: auto;
  border-top: 1px solid var(--color-border);
}

.footer-content {
  text-align: center;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.avatar-preview {
  flex-shrink: 0;
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-border);
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  border: 3px solid var(--color-border);
}

.avatar-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.button-danger {
  background-color: var(--color-danger);
  color: white;
}

.button-danger:hover:not(:disabled) {
  background-color: #b91c1c;
}

@media (max-width: 640px) {
  .avatar-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .avatar-actions {
    width: 100%;
  }

  .avatar-actions button,
  .avatar-actions label {
    flex: 1;
  }
}

@media (max-width: 640px) {
  .header-content {
    gap: var(--spacing-sm);
  }

  .app-title {
    font-size: var(--font-size-lg);
  }

  .settings-section {
    padding: 0 var(--spacing-sm);
  }

  .settings-group {
    padding: var(--spacing-md);
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>