<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <p class="footer-text">&copy; {{ new Date().getFullYear() }} BasketBuddy. Made with <span
            class="heart">❤️</span> by <a href="https://toddl.dev" target="_blank"
            rel="noopener noreferrer" class="footer-link">Todd Libby</a>. Built with accessibility
          in mind. <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer"
            class="footer-built-with">
            <svg height="16" viewBox="0 0 256 171" xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true" focusable="false">
              <path
                d="M144.336 69.967L119.62 27.33c-2.113-3.586-5.967-5.8-10.148-5.8-4.18 0-8.035 2.214-10.148 5.8L.697 152.033C-1.416 155.619-1.416 160 .697 163.586c2.113 3.586 5.967 5.8 10.148 5.8h65.699c4.441 0 8.513-2.395 10.703-6.253l57.09-93.166Z"
                fill="#00DC82" />
              <path
                d="M245.302 152.033L176.16 30.907c-2.113-3.586-5.967-5.8-10.148-5.8-4.18 0-8.035 2.214-10.148 5.8l-24.716 42.637 34.864 56.86c2.19 3.573 2.19 8.02 0 11.593l-27.045 44.11c-2.113 3.586-5.967 5.8-10.148 5.8h65.699a11.79 11.79 0 0 0 10.148-5.8 11.79 11.79 0 0 0 0-11.074Z"
                fill="#00DC82" />
            </svg>
            Built with Nuxt
          </a>

        </p>
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

.footer-built-with {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color 0.2s;
}

.footer-built-with:hover {
  color: #00DC82;
}

.footer-built-with svg {
  flex-shrink: 0;
}
</style>