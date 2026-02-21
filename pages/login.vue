<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">BasketBuddy</h1>
        <p class="auth-subtitle">Sign in to sync your lists across devices</p>

        <form @submit.prevent="handleLogin" class="auth-form" novalidate>
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
                autocomplete="current-password"
                required
                aria-required="true"
                aria-describedby="password-error"
                :aria-invalid="passwordError ? 'true' : 'false'" />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
                :aria-label="showPassword ? 'Hide password' : 'Show password'">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
            <span v-if="passwordError" id="password-error" class="error-message" role="alert">
              {{ passwordError }}
            </span>
          </div>

          <button
            type="submit"
            class="button button-primary"
            :disabled="isLoading"
            :aria-busy="isLoading">
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>

          <div v-if="generalError" class="error-message general-error" role="alert">
            {{ generalError }}
          </div>

          <p class="req">Fields marked with <span class="required">*</span> are required.</p>
        </form>

        <div class="auth-footer">
          <p>
            Don't have an account?
            <NuxtLink to="/signup" class="auth-link">Sign up</NuxtLink>
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
const showPassword = ref(false)
const isLoading = ref(false)
const emailError = ref('')
const passwordError = ref('')
const generalError = ref('')

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const handleLogin = async () => {
  emailError.value = ''
  passwordError.value = ''
  generalError.value = ''

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

  isLoading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) throw error

    if (data.user) {
      await router.push('/')
    }
  } catch (error: any) {
    generalError.value = error.message || 'Failed to sign in. Please try again.'
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Sign In - BasketBuddy'
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
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-lg);
}

.auth-subtitle {
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-base);
  line-height: 1.6;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: 0 var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-weight: 600;
  color: white;
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-xs);
}
p.req {
  margin: 0 auto;
}

span.required {
  color: red;
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
  padding-right: 60px;
}

.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(147, 51, 234, 0.2);
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  color: var(--color-primary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;
  border-radius: 0.25rem;
}

.password-toggle svg {
  flex-shrink: 0;
}

.password-toggle:hover {
  background-color: rgba(147, 51, 234, 0.3);
  color: white;
}

.password-toggle:active {
  transform: translateY(-50%) scale(0.95);
}

.password-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
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

.button-primary {
  width: 100%;
  height: 52px;
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
  padding: var(--spacing-lg);
}

.auth-footer p {
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-base);
  margin: 0;
  line-height: 1.6;
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #a855f7;
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
    margin-bottom: var(--spacing-md);
  }

  .auth-subtitle {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-xl);
  }

  .auth-form {
    padding: 0;
    gap: var(--spacing-md);
  }

  .auth-footer {
    padding: var(--spacing-md) 0 0;
    margin-top: var(--spacing-xl);
  }

  .auth-footer p {
    font-size: var(--font-size-sm);
  }

  .input {
    font-size: 16px;
    height: 48px;
  }

  .input-with-icon {
    padding-right: 60px;
  }
}

/* Extra small devices */
@media (max-width: 375px) {
  .auth-card {
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .auth-title {
    font-size: var(--font-size-xl);
  }
}

/* Tablet and up */
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