<template>
  <div id="app">
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabase()

onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('User signed in')
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out')
    }
  })
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  title: 'BasketBuddy',
  meta: [
    { name: 'description', content: 'Collaborative grocery list app with real-time sharing' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#9333ea' }
  ]
})
</script>