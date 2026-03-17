<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <img src="/logo.svg" alt="BasketBuddy Logo" class="logo-image" />
          <h1 class="auth-title">BasketBuddy</h1>
        </div>
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
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20"
                  height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
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

          <p class="req">Fields marked with <span class="required">*</span> are required.</p>
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
  <AppFooter />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: []
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

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) await navigateTo('/')
})

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
  overflow-x: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-container {
  width: 100%;
  max-width: 420px;
  padding: var(--spacing-md);
  box-sizing: border-box;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 9999px #1e293b inset;
}
</style>