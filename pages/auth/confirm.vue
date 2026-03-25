<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <p class="auth-subtitle">{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: []
})

const supabase = useSupabase()
const router = useRouter()
const message = ref('Confirming your account...')

onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error

    if (data.session) {
      message.value = 'Email confirmed! Redirecting...'
      await new Promise(resolve => setTimeout(resolve, 1000))
      await router.replace('/')
    } else {
      message.value = 'Confirming your email...'
      // Wait for Supabase to process the token from the URL hash
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          subscription.unsubscribe()
          message.value = 'Email confirmed! Redirecting...'
          await new Promise(resolve => setTimeout(resolve, 1000))
          await router.replace('/')
        }
      })
    }
  } catch (error) {
    console.error('Confirmation error:', error)
    message.value = 'Something went wrong. Please try signing in.'
    await new Promise(resolve => setTimeout(resolve, 2000))
    await router.replace('/login')
  }
})

useHead({ title: 'Confirming Email - BasketBuddy' })
</script>