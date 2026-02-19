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
            <input
              id="password"
              v-model="password"
              type="password"
              class="input"
              autocomplete="current-password"
              required
              aria-required="true"
              aria-describedby="password-error"
              :aria-invalid="passwordError ? 'true' : 'false'" />
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
}

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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
  max-width: 400px;
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

/* Mobile portrait optimizations */
@media (max-width: 640px) {
  .auth-container {
    padding: var(--spacing-sm);
  }

  .auth-card {
    padding: var(--spacing-xl) var(--spacing-lg);
    max-width: 100%;
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

  .form-group {
    margin-bottom: 0;
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