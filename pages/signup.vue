<template>
  <div class="auth-page">
    <div class="container">
      <main id="main-content" class="auth-container">
        <h1 class="auth-title">BasketBuddy</h1>
        <p class="auth-subtitle">Create your account</p>

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
            <input
              id="password"
              v-model="password"
              type="password"
              class="input"
              autocomplete="new-password"
              required
              aria-required="true"
              aria-describedby="password-help password-error"
              :aria-invalid="passwordError ? 'true' : 'false'" />
            <span id="password-help" class="help-text">
              Must be at least 6 characters
            </span>
            <span v-if="passwordError" id="password-error" class="error-message" role="alert">
              {{ passwordError }}
            </span>
          </div>

          <div class="form-group">
            <label for="confirm-password" class="form-label">
              Confirm Password
              <span aria-hidden="true">*</span>
            </label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              class="input"
              autocomplete="new-password"
              required
              aria-required="true"
              aria-describedby="confirm-password-error"
              :aria-invalid="confirmPasswordError ? 'true' : 'false'" />
            <span v-if="confirmPasswordError" id="confirm-password-error" class="error-message"
              role="alert">
              {{ confirmPasswordError }}
            </span>
          </div>

          <button
            type="submit"
            class="button button-primary button-full"
            :disabled="isLoading"
            :aria-busy="isLoading">
            <span v-if="isLoading">Creating account...</span>
            <span v-else>Create Account</span>
          </button>

          <div v-if="generalError" class="error-message" role="alert">
            {{ generalError }}
          </div>

          <div v-if="successMessage" class="success-message" role="status">
            {{ successMessage }}
          </div>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <NuxtLink to="/login" class="auth-link">Sign in</NuxtLink>
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
const confirmPassword = ref('')
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
  // Reset errors
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
  generalError.value = ''
  successMessage.value = ''

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
      password: password.value
    })

    if (error) throw error

    if (data.user) {
      successMessage.value = 'Account created successfully! Redirecting...'
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
  } catch (error: any) {
    generalError.value = error.message || 'Failed to create account. Please try again.'
  } finally {
    isLoading.value = false
  }
}

definePageMeta({
  middleware: 'guest'
})

useHead({
  title: 'Sign Up - BasketBuddy'
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

.help-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.error-message {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.success-message {
  color: var(--color-success);
  font-size: var(--font-size-sm);
  text-align: center;
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
</style>