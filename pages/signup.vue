<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">BasketBuddy</h1>
        <p class="auth-subtitle">Create an account to start organizing your grocery lists</p>

        <form @submit.prevent="handleSignup" class="auth-form" novalidate>
          <div class="form-group">
            <label for="email" class="form-label">
              Email Address
              <span aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="input"
              autocomplete="email"
              required
              aria-required="true"
              aria-describedby="email-error"
              :aria-invalid="emailError ? 'true' : 'false'" />
            <span v-if="emailError" id="email-error" class="error-message" role="alert">
              {{ emailError }}
            </span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">
              Password
              <span aria-hidden="true">*</span>
            </label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="input input-with-icon"
                autocomplete="new-password"
                required
                aria-required="true"
                aria-describedby="password-error password-hint"
                :aria-invalid="passwordError ? 'true' : 'false'" />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
                :aria-label="showPassword ? 'Hide password' : 'Show password'">
                <span v-if="showPassword" aria-hidden="true">👁️</span>
                <span v-else aria-hidden="true">👁️‍🗨️</span>
              </button>
            </div>
            <span id="password-hint" class="help-text">Must be at least 6 characters</span>
            <span v-if="passwordError" id="password-error" class="error-message" role="alert">
              {{ passwordError }}
            </span>
          </div>

          <div class="form-group">
            <label for="confirm-password" class="form-label">
              Confirm Password
              <span aria-hidden="true">*</span>
            </label>
            <div class="password-input-wrapper">
              <input
                id="confirm-password"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="input input-with-icon"
                autocomplete="new-password"
                required
                aria-required="true"
                aria-describedby="confirm-password-error"
                :aria-invalid="confirmPasswordError ? 'true' : 'false'" />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="password-toggle"
                :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'">
                <span v-if="showConfirmPassword" aria-hidden="true">👁️</span>
                <span v-else aria-hidden="true">👁️‍🗨️</span>
              </button>
            </div>
            <span v-if="confirmPasswordError" id="confirm-password-error" class="error-message"
              role="alert">
              {{ confirmPasswordError }}
            </span>
          </div>

          <button
            type="submit"
            class="button button-primary"
            :disabled="isLoading"
            :aria-busy="isLoading">
            <span v-if="isLoading">Creating account...</span>
            <span v-else>Sign Up</span>
          </button>

          <div v-if="generalError" class="error-message general-error" role="alert">
            {{ generalError }}
          </div>

          <div v-if="successMessage" class="success-message" role="status">
            {{ successMessage }}
          </div>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account?
            <NuxtLink to="/login" class="auth-link">Sign in</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})

const supabase = useSupabase()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const generalError = ref('')
const successMessage = ref('')

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleSignup = async () => {
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
  generalError.value = ''
  successMessage.value = ''

  if (!email.value) {
    emailError.value = 'Email is required'
    return
  }

  if (!validateEmail(email.value)) {
    emailError.value = 'Please enter a valid email address'
    return
  }

  if (!password.value) {
    passwordError.value = 'Password is required'
    return
  }

  if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return
  }

  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password'
    return
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
    return
  }

  isLoading.value = true

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    })

    if (error) throw error

    if (data.user) {
      successMessage.value = 'Account created! Check your email to confirm your account.'

      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  } catch (error: any) {
    generalError.value = error.message || 'Failed to create account. Please try again.'
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Sign Up - BasketBuddy'
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  width: 100%;
  max-width: 420px;
  padding: var(--spacing-md);
  box-sizing: border-box;
}

.auth-card {
  background-color: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  padding: var(--spacing-2xl);
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  box-sizing: border-box;
}

.auth-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: var(--spacing-sm);
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  font-size: var(--font-size-base);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-weight: 500;
  color: white;
  font-size: var(--font-size-sm);
}

.input {
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background-color: rgba(15, 23, 42, 0.5);
  color: white;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.2);
}

.input[aria-invalid="true"] {
  border-color: var(--color-danger);
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
  padding: var(--spacing-sm);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  border-radius: 0.25rem;
}

.password-toggle:hover {
  color: rgba(255, 255, 255, 0.9);
  background-color: rgba(255, 255, 255, 0.1);
}

.password-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.help-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: var(--font-size-xs);
}

.error-message {
  color: #fca5a5;
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.general-error {
  padding: var(--spacing-sm);
  background-color: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.375rem;
  text-align: center;
}

.success-message {
  padding: var(--spacing-sm);
  background-color: rgba(5, 150, 105, 0.1);
  border: 1px solid rgba(5, 150, 105, 0.3);
  border-radius: 0.375rem;
  text-align: center;
  color: #6ee7b7;
  font-size: var(--font-size-sm);
}

.button-primary {
  width: 100%;
  height: 48px;
  margin-top: var(--spacing-md);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  box-sizing: border-box;
}

.button-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.button-primary:active:not(:disabled) {
  transform: scale(0.98);
}

.button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: var(--spacing-xl);
}

.auth-footer p {
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-sm);
  margin: 0;
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.auth-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.auth-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Mobile portrait optimizations */
@media (max-width: 640px) {
  .auth-container {
    max-width: 100%;
    padding: var(--spacing-sm);
  }

  .auth-card {
    padding: var(--spacing-xl) var(--spacing-lg);
  }

  .auth-title {
    font-size: var(--font-size-2xl);
  }

  .auth-subtitle {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-lg);
  }

  .input {
    font-size: 16px;
    /* Prevents iOS zoom */
    padding: var(--spacing-sm) var(--spacing-md);
    height: 48px;
  }

  .input-with-icon {
    padding-right: 48px;
  }

  .auth-form {
    gap: var(--spacing-md);
  }
}

/* Extra small devices (iPhone SE, etc) */
@media (max-width: 375px) {
  .auth-card {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .auth-title {
    font-size: var(--font-size-xl);
  }
}

/* Tablet and up - slightly larger card */
@media (min-width: 768px) {
  .auth-card {
    padding: var(--spacing-2xl) var(--spacing-xl);
  }
}

/* Safe area for iPhone notch */
@supports (padding: env(safe-area-inset-top)) {
  .auth-container {
    padding-top: max(var(--spacing-md), env(safe-area-inset-top));
    padding-bottom: max(var(--spacing-md), env(safe-area-inset-bottom));
    padding-left: max(var(--spacing-md), env(safe-area-inset-left));
    padding-right: max(var(--spacing-md), env(safe-area-inset-right));
  }
}
</style>