<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <p class="footer-text">&copy; {{ new Date().getFullYear() }} BasketBuddy. Made with <span
            class="heart">❤️</span> by <a href="https://toddl.dev" target="_blank"
            rel="noopener noreferrer" class="footer-link">Todd Libby</a>. Built with accessibility
          in mind.</p>
        <nav class="footer-nav" aria-label="Footer navigation">
          <NuxtLink to="/faq" class="footer-link">FAQ</NuxtLink>
          <NuxtLink to="/pricing" class="footer-link">Pricing</NuxtLink>
          <NuxtLink to="/privacy" class="footer-link">Privacy</NuxtLink>
          <NuxtLink to="/terms" class="footer-link">Terms</NuxtLink>
          <NuxtLink to="/support" class="footer-link">Support</NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-nav {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  justify-content: center;
}
</style>