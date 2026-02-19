<template>
  <div class="auth-page">
    <div class="container">
      <main id="main-content" class="auth-container">
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
            class="button button-primary button-full"
            :disabled="isLoading"
            :aria-busy="isLoading">
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>

          <div v-if="generalError" class="error-message" role="alert">
            {{ generalError }}
          </div>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <NuxtLink to="/signup" class="auth-link">Sign up</NuxtLink>
          </p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  // Reset errors
  emailError.value = ''
  passwordError.value = ''
  generalError.value = ''

  // Validate
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

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    await router.push('/')
  }
})

useHead({
  title: 'Sign In - BasketBuddy'
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface);
}

.auth-container {
  width: 100%;
  max-width: 400px;
  background-color: var(--color-background);
  padding: var(--spacing-xl);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.auth-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.auth-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
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
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.button-primary {
  background-color: var(--color-primary);
  color: white;
}

.button-full {
  width: 100%;
}

.auth-footer {
  margin-top: var(--spacing-lg);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.auth-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}

.auth-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .auth-container {
    padding: var(--spacing-md);
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

  .auth-card {
    padding: var(--spacing-lg);
    margin: 0;
    width: 100%;
  }

  .auth-title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-sm);
  }

  .auth-subtitle {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-xl);
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  .form-label {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-xs);
  }

  .input {
    font-size: 16px;
    /* Prevents iOS zoom */
    height: 48px;
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .button-primary {
    height: 48px;
    font-size: var(--font-size-base);
    width: 100%;
    margin-top: var(--spacing-md);
  }

  .auth-footer {
    margin-top: var(--spacing-xl);
    font-size: var(--font-size-sm);
  }

  .auth-link {
    font-size: var(--font-size-sm);
  }
}

/* iPhone specific fixes */
@media (max-width: 428px) {
  .auth-card {
    padding: var(--spacing-md);
  }

  .auth-title {
    font-size: var(--font-size-xl);
  }
}

/* Safe area for iPhone notch */
@supports (padding-top: env(safe-area-inset-top)) {
  .auth-container {
    padding-top: max(var(--spacing-md), env(safe-area-inset-top));
    padding-bottom: max(var(--spacing-md), env(safe-area-inset-bottom));
  }
}
</style>