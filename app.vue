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
    } else if (event === 'SIGNED_OUT') {

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
    { name: 'theme-color', content: '#7c3aed' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
  ]
})

onMounted(() => {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Failed to fetch dynamically imported module') ||
      event.reason?.message?.includes('Loading chunk') ||
      event.reason?.message?.includes('Loading failed for the module')) {
      window.location.reload()
    }
  })
})
</script>