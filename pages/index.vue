<template>
  <div class="landing">

    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- ========================
         NAV
    ========================= -->
    <header class="landing-nav" role="banner">
      <div class="landing-container nav-inner">
        <a href="/" class="nav-logo" aria-label="BasketBuddy home">
          <img src="/logo.svg" alt="" aria-hidden="true" width="36" height="36" />
          <span class="nav-logo-text">BasketBuddy</span>
        </a>
        <nav aria-label="Primary navigation">
          <ul class="nav-links" role="list">
            <li><a href="#features" class="nav-link">Features</a></li>
            <li><a href="#pricing" class="nav-link">Pricing</a></li>
            <li><a href="#faq" class="nav-link">FAQ</a></li>
          </ul>
        </nav>
        <div class="nav-cta">
          <NuxtLink to="/login" class="button button-secondary nav-btn-login">Log in</NuxtLink>
          <NuxtLink to="/signup" class="button nav-btn-signup">Get started</NuxtLink>
        </div>
        <!-- Mobile menu button -->
        <button
          class="nav-mobile-toggle"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          @click="mobileMenuOpen = !mobileMenuOpen">
          <span class="hamburger-line" aria-hidden="true"></span>
          <span class="hamburger-line" aria-hidden="true"></span>
          <span class="hamburger-line" aria-hidden="true"></span>
        </button>
      </div>

      <!-- Mobile menu -->
      <div
        id="mobile-menu"
        class="mobile-menu"
        :class="{ 'mobile-menu--open': mobileMenuOpen }"
        :aria-hidden="!mobileMenuOpen">
        <nav aria-label="Mobile navigation">
          <ul role="list">
            <li><a href="#features" class="mobile-nav-link"
                @click="mobileMenuOpen = false">Features</a></li>
            <li><a href="#pricing" class="mobile-nav-link"
                @click="mobileMenuOpen = false">Pricing</a></li>
            <li><a href="#faq" class="mobile-nav-link" @click="mobileMenuOpen = false">FAQ</a></li>
            <li>
              <NuxtLink to="/login" class="mobile-nav-link" @click="mobileMenuOpen = false">Log in
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/signup" class="button mobile-nav-cta" @click="mobileMenuOpen = false">
                Get started free
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main id="main-content">

      <!-- ========================
           HERO
      ========================= -->
      <section class="hero" aria-labelledby="hero-heading">
        <div class="landing-container hero-inner">
          <div class="hero-content">
            <p class="hero-eyebrow" aria-hidden="true">Grocery shopping, simplified</p>
            <h1 id="hero-heading" class="hero-heading">
              Your whole family, <br class="hero-br" />
              <span class="hero-heading-accent">one list.</span>
            </h1>
            <p class="hero-body">
              BasketBuddy keeps your grocery lists in sync across everyone in your household — in
              real time, without the chaos.
            </p>
            <div class="hero-actions">
              <NuxtLink to="/signup" class="button hero-cta-primary">
                Start for free
              </NuxtLink>
              <a href="#features" class="hero-cta-secondary">
                See how it works
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3l5 5-5 5M3 8h10" stroke="currentColor" stroke-width="1.75"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </a>
            </div>
            <p class="hero-note">Solo from $4/mo. Family from $8/mo. Free to try.</p>
          </div>

          <div class="hero-visual" aria-hidden="true">
            <div class="phone-mockup">
              <div class="phone-screen">
                <div class="mockup-categories-row">
                  <span class="mockup-categories-label">Categories</span>
                  <span class="mockup-add-category-btn">Add Category</span>
                </div>
                <div class="mockup-input-row">
                  <span class="mockup-input-field">Add an item...</span>
                  <span class="mockup-add-photo-btn">Add Photo</span>
                  <span class="mockup-add-btn">Add</span>
                </div>
                <p class="mockup-section-label" aria-hidden="true">TO BUY</p>
                <ul class="mockup-list" role="presentation">
                  <li class="mockup-item">
                    <span class="mockup-circle"></span>
                    <span>Olive oil</span>
                  </li>
                  <li class="mockup-item">
                    <span class="mockup-circle"></span>
                    <span>Cherry tomatoes</span>
                  </li>
                  <li class="mockup-item">
                    <span class="mockup-circle"></span>
                    <span>Pasta</span>
                  </li>
                </ul>
                <p class="mockup-section-label" aria-hidden="true">COMPLETED</p>
                <ul class="mockup-list" role="presentation">
                  <li class="mockup-item mockup-item--done">
                    <span class="mockup-check"></span>
                    <span>Sourdough bread</span>
                  </li>
                  <li class="mockup-item mockup-item--done">
                    <span class="mockup-check"></span>
                    <span>Greek yogurt</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="hero-blob" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      <!-- ========================
           FEATURES
      ========================= -->
      <section id="features" class="features" aria-labelledby="features-heading">
        <div class="landing-container">
          <div class="section-header">
            <h2 id="features-heading" class="section-heading">Everything you need, nothing you don't
            </h2>
            <p class="section-subheading">Built for real households — not productivity apps
              pretending to be grocery lists.</p>
          </div>

          <ul class="features-grid" role="list">
            <li class="feature-card">
              <div class="feature-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor"
                    stroke-width="1.75" stroke-linecap="round" />
                  <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.75" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor"
                    stroke-width="1.75" stroke-linecap="round" />
                </svg>
              </div>
              <h3 class="feature-title">Shared family lists</h3>
              <p class="feature-body">Invite your household with a single link. Everyone sees the
                same list, updated the moment anything changes.</p>
            </li>

            <li class="feature-card">
              <div class="feature-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor"
                    stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <h3 class="feature-title">Real-time sync</h3>
              <p class="feature-body">Check off milk in the dairy aisle — your partner's phone
                updates instantly. No more duplicate purchases.</p>
            </li>

            <li class="feature-card">
              <div class="feature-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor"
                    stroke-width="1.75" />
                  <path d="M9 7h6M9 11h6M9 15h4" stroke="currentColor" stroke-width="1.75"
                    stroke-linecap="round" />
                </svg>
              </div>
              <h3 class="feature-title">Multiple lists</h3>
              <p class="feature-body">Weekly groceries, a holiday meal, a birthday party haul — keep
                them all organized and separate.</p>
            </li>

            <li class="feature-card">
              <div class="feature-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor"
                    stroke-width="1.75" stroke-linejoin="round" />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.75"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <h3 class="feature-title">Works offline</h3>
              <p class="feature-body">Poor signal at the store? BasketBuddy keeps working. Changes
                sync automatically when you're back online.</p>
            </li>

            <li class="feature-card">
              <div class="feature-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.75" />
                  <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="1.75"
                    stroke-linecap="round" />
                </svg>
              </div>
              <h3 class="feature-title">Purchase history</h3>
              <p class="feature-body">Can't remember if you bought it last week? Your history is
                always a tap away so you never double-stock.</p>
            </li>

            <li class="feature-card">
              <div class="feature-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                    stroke="currentColor" stroke-width="1.75" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"
                    stroke="currentColor" stroke-width="1.75" />
                </svg>
              </div>
              <h3 class="feature-title">Any device</h3>
              <p class="feature-body">Progressive web app — install it on iOS, Android, or your
                desktop. One app, every device.</p>
            </li>
          </ul>
        </div>
      </section>

      <!-- ========================
           PRICING
      ========================= -->
      <section id="pricing" class="pricing" aria-labelledby="pricing-heading">
        <div class="landing-container">
          <div class="section-header">
            <h2 id="pricing-heading" class="section-heading">Simple, honest pricing</h2>
            <p class="section-subheading">Solo at $4/mo. Family at $8/mo. Sign up free, no credit
              card required.</p>
          </div>

          <div class="pricing-grid">

            <!-- Free -->
            <article class="pricing-card" aria-labelledby="plan-free-name">
              <header class="pricing-card-header">
                <h3 id="plan-free-name" class="pricing-plan-name">Free</h3>
                <div class="pricing-amount">
                  <span class="pricing-price" aria-label="Free">$0</span>
                  <span class="pricing-period">/ forever</span>
                </div>
                <p class="pricing-tagline">No credit card required.</p>
              </header>
              <ul class="pricing-features" role="list" aria-label="Free plan features">
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Up to 2 lists
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Works offline
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  PWA — install on any device
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Rewards card storage
                </li>
                <li class="pricing-feature pricing-feature--muted">
                  <span class="pricing-x" aria-hidden="true"></span>
                  <span>List sharing</span>
                </li>
                <li class="pricing-feature pricing-feature--muted">
                  <span class="pricing-x" aria-hidden="true"></span>
                  <span>Real-time collaboration</span>
                </li>
              </ul>
              <NuxtLink to="/signup" class="button button-secondary pricing-cta"
                aria-describedby="plan-free-name">
                Get started free
              </NuxtLink>
            </article>

            <!-- Solo -->
            <article class="pricing-card" aria-labelledby="plan-solo-name">
              <header class="pricing-card-header">
                <h3 id="plan-solo-name" class="pricing-plan-name">Solo</h3>
                <div class="pricing-amount">
                  <span class="pricing-price" aria-label="4 dollars per month">$4</span>
                  <span class="pricing-period">/ month</span>
                </div>
                <p class="pricing-tagline">Everything you need for yourself.</p>
              </header>
              <ul class="pricing-features" role="list" aria-label="Solo plan features">
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Up to 5 lists
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Works offline
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Purchase history
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  PWA — install on any device
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  List sharing
                </li>
                <li class="pricing-feature pricing-feature--muted">
                  <span class="pricing-x" aria-hidden="true"></span>
                  <span>Real-time collaboration</span>
                </li>
              </ul>
              <NuxtLink to="/signup" class="button button-secondary pricing-cta"
                aria-describedby="plan-solo-name">
                Get Solo
              </NuxtLink>
            </article>

            <!-- Family -->
            <article class="pricing-card pricing-card--featured" aria-labelledby="plan-family-name">
              <div class="pricing-badge" aria-label="Most popular plan">Most popular</div>
              <header class="pricing-card-header">
                <h3 id="plan-family-name" class="pricing-plan-name">Family</h3>
                <div class="pricing-amount">
                  <span class="pricing-price" aria-label="8 dollars per month">$8</span>
                  <span class="pricing-period">/ month</span>
                </div>
                <p class="pricing-tagline">For households that shop together.</p>
              </header>
              <ul class="pricing-features" role="list" aria-label="Family plan features">
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Everything in Solo
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Up to 6 members, 12 lists
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Shared lists
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Real-time collaboration
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Invite via email link
                </li>
                <li class="pricing-feature">
                  <span class="pricing-check" aria-hidden="true"></span>
                  Priority support
                </li>
              </ul>
              <NuxtLink to="/signup?plan=family" class="button pricing-cta pricing-cta--featured"
                aria-describedby="plan-family-name">
                Start free trial
              </NuxtLink>
              <p class="pricing-trial-note">14-day free trial, cancel anytime.</p>
            </article>

          </div>
        </div>
      </section>

      <!-- ========================
           FAQ
      ========================= -->
      <section id="faq" class="faq" aria-labelledby="faq-heading">
        <div class="landing-container faq-inner">
          <div class="section-header">
            <h2 id="faq-heading" class="section-heading">Frequently asked questions</h2>
            <p class="section-subheading">Everything you need to know about BasketBuddy.</p>
          </div>

          <div class="faq-sections">

            <div class="faq-group">
              <h3 class="faq-group-title">General</h3>
              <div class="faq-list">
                <details class="faq-item">
                  <summary class="faq-question">What is BasketBuddy?</summary>
                  <div class="faq-answer">
                    <p>BasketBuddy is a collaborative grocery list app that lets you create, share,
                      and sync shopping lists in real time. It works on any device with a browser,
                      and can be installed on your phone like an app.</p>
                  </div>
                </details>
                <details class="faq-item">
                  <summary class="faq-question">Is there a free trial?</summary>
                  <div class="faq-answer">
                    <p>Yes — you can sign up for free with no credit card required and try
                      BasketBuddy before subscribing. Solo is $4/mo and Family is $8/mo.</p>
                  </div>
                </details>
                <details class="faq-item">
                  <summary class="faq-question">Can I cancel my subscription?</summary>
                  <div class="faq-answer">
                    <p>Yes, you can cancel any time from your account settings. You'll keep access
                      until the end of your current billing period.</p>
                  </div>
                </details>
                <details class="faq-item">
                  <summary class="faq-question">Is BasketBuddy accessible?</summary>
                  <div class="faq-answer">
                    <p>Yes. BasketBuddy is built to meet WCAG 2.2 AA accessibility standards. It
                      works with screen readers, keyboard navigation, and supports high contrast and
                      reduced motion preferences.</p>
                  </div>
                </details>
              </div>
            </div>

            <div class="faq-group">
              <h3 class="faq-group-title">Plans &amp; Billing</h3>
              <div class="faq-list">
                <details class="faq-item">
                  <summary class="faq-question">What is the difference between Solo and Family?
                  </summary>
                  <div class="faq-answer">
                    <p>The Solo plan ($4/mo) is for one person and supports up to 5 lists. The
                      Family plan ($8/mo) supports up to 6 members and up to 12 lists, making it
                      great for households that shop together.</p>
                  </div>
                </details>
                <details class="faq-item">
                  <summary class="faq-question">How much does BasketBuddy cost?</summary>
                  <div class="faq-answer">
                    <p>Solo is $4/month or $40/year. Family is $8/month or $80/year. Paying annually
                      saves you about two months compared to monthly billing.</p>
                  </div>
                </details>
                <details class="faq-item">
                  <summary class="faq-question">Is my payment information secure?</summary>
                  <div class="faq-answer">
                    <p>Yes. All payments are processed by Stripe, a PCI-compliant payment provider.
                      BasketBuddy never stores your card details.</p>
                  </div>
                </details>
              </div>
            </div>

            <div class="faq-group">
              <h3 class="faq-group-title">Sharing &amp; Collaboration</h3>
              <div class="faq-list">
                <details class="faq-item">
                  <summary class="faq-question">How do I share a list with someone?</summary>
                  <div class="faq-answer">
                    <p>Open the list you want to share, tap the share button, and enter the email
                      address of the person you want to invite. They'll receive an email with
                      instructions to join.</p>
                  </div>
                </details>
                <details class="faq-item">
                  <summary class="faq-question">Does the person I share with need an account?
                  </summary>
                  <div class="faq-answer">
                    <p>Yes, they'll need to sign up for a free account to view and edit the shared
                      list. Signing up is free and only takes a moment.</p>
                  </div>
                </details>
                <details class="faq-item">
                  <summary class="faq-question">How many people can share a list?</summary>
                  <div class="faq-answer">
                    <p>On the Family plan, up to 6 members can share lists. The Solo plan supports
                      list sharing but is capped at 5 lists total.</p>
                  </div>
                </details>
              </div>
            </div>

            <div class="faq-group">
              <h3 class="faq-group-title">Installing the app</h3>
              <div class="faq-list">
                <details class="faq-item">
                  <summary class="faq-question">How do I install BasketBuddy on an iPhone?</summary>
                  <div class="faq-answer">
                    <p>Open Safari, go to basketbuddyapp.netlify.app, tap the Share button, then tap
                      "Add to Home Screen." BasketBuddy must be opened in Safari — Chrome and
                      Firefox on iOS don't support installing apps.</p>
                  </div>
                </details>
                <details class="faq-item">
                  <summary class="faq-question">How do I install it on Android?</summary>
                  <div class="faq-answer">
                    <p>Open Chrome, go to basketbuddyapp.netlify.app, tap the three-dot menu, then
                      tap "Add to Home screen" or "Install app." It will appear on your home screen
                      just like a native app.</p>
                  </div>
                </details>
                <details class="faq-item">
                  <summary class="faq-question">Does it work offline?</summary>
                  <div class="faq-answer">
                    <p>Yes. Once installed, BasketBuddy can load even without an internet
                      connection. Your lists will sync automatically once you're back online.</p>
                  </div>
                </details>
              </div>
            </div>

          </div>

          <p class="faq-contact">Still have questions? <NuxtLink to="/faq" class="faq-contact-link">
              Visit the full FAQ</NuxtLink> or <a href="mailto:todd@toddl.dev"
              class="faq-contact-link">get in touch</a>.</p>

        </div>
      </section>

      <!-- ========================
           CTA BAND
      ========================= -->
      <section class="cta-band" aria-labelledby="cta-heading">
        <div class="landing-container cta-inner">
          <h2 id="cta-heading" class="cta-heading">Ready to simplify your grocery runs?</h2>
          <p class="cta-body">Join thousands of households already using BasketBuddy. Free to start,
            no card needed.</p>
          <NuxtLink to="/signup" class="button cta-button">Create your free account</NuxtLink>
        </div>
      </section>

    </main>

    <!-- ========================
         FOOTER
    ========================= -->
    <footer class="landing-footer" role="contentinfo">
      <div class="landing-container footer-inner">
        <div class="footer-brand">
          <a href="/" class="nav-logo footer-logo" aria-label="BasketBuddy home">
            <img src="/logo.svg" alt="" aria-hidden="true" width="28" height="28" />
            <span class="nav-logo-text">BasketBuddy</span>
          </a>
          <p class="footer-tagline">Grocery lists for the whole household.</p>
        </div>

        <nav class="footer-nav" aria-label="Footer navigation">
          <div class="footer-nav-group">
            <h3 class="footer-nav-heading">Product</h3>
            <ul role="list">
              <li><a href="#features" class="footer-link">Features</a></li>
              <li><a href="#pricing" class="footer-link">Pricing</a></li>
              <li>
                <NuxtLink to="/signup" class="footer-link">Sign up</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/login" class="footer-link">Log in</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="footer-nav-group">
            <h3 class="footer-nav-heading">Support</h3>
            <ul role="list">
              <li><a href="#faq" class="footer-link">FAQ</a></li>
              <li><a href="mailto:hello@basketbuddyapp.netlify.app" class="footer-link">Contact</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div class="footer-bottom">
        <div class="landing-container footer-bottom-inner">
          <p class="footer-copy">
            &copy; {{ new Date().getFullYear() }} BasketBuddy. Made with
            <span aria-label="love" class="heart">♥</span>
          </p>
          <nav aria-label="Legal links">
            <ul class="footer-legal" role="list">
              <li>
                <NuxtLink to="/privacy" class="footer-link">Privacy</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/terms" class="footer-link">Terms</NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Redirect logged-in users straight to the dashboard
const supabase = useSupabase()
const { data: { session } } = await supabase.auth.getSession()
if (session) {
  await navigateTo('/lists')
}

useHead({
  title: 'BasketBuddy — Grocery lists for the whole household',
  meta: [
    {
      name: 'description',
      content: 'BasketBuddy keeps your grocery lists in sync across everyone in your household — in real time, without the chaos. Free forever for solo use.'
    },
    { property: 'og:title', content: 'BasketBuddy — Grocery lists for the whole household' },
    {
      property: 'og:description',
      content: 'Shared grocery lists that sync in real time. Solo $4/mo, Family $8/mo. Free to sign up.'
    },
    { name: 'theme-color', content: '#6626AF' }
  ]
})

const mobileMenuOpen = ref(false)

watch(mobileMenuOpen, (open) => {
  if (process.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* ========================
   Layout
========================= */
.landing {
  --landing-max: 1120px;
  background-color: var(--color-background);
  color: var(--color-text);
  /* Lighter purple for text on dark backgrounds — passes WCAG AA */
  --color-purple-on-dark: #b794f4;
}

.landing-container {
  max-width: var(--landing-max);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* ========================
   Nav
========================= */
.landing-nav {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.nav-inner {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  height: 64px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  flex-shrink: 0;
}

.nav-logo-text {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
}

/* Dark mode nav background is dark — white reads far better than purple */
:root.dark .nav-logo-text,
:root:not(.light) .nav-logo-text {
  color: #ffffff;
}

/* Footer always dark */
.landing-footer .nav-logo-text {
  color: #ffffff;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: var(--spacing-lg);
  margin: 0;
  padding: 0;
  margin-left: auto;
}

.nav-link {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: 2px;
}

.nav-cta {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.nav-btn-login {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  min-height: 38px;
  font-size: var(--font-size-sm);
}

.nav-btn-login:hover:not(:disabled) {
  background-color: var(--color-surface);
  transform: none;
}

.nav-btn-signup {
  min-height: 38px;
  font-size: var(--font-size-sm);
}

.nav-mobile-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  min-width: var(--min-touch-target);
  min-height: var(--min-touch-target);
  margin-left: auto;
}

.hamburger-line {
  display: block;
  width: 22px;
  height: 2px;
  background-color: var(--color-text);
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}

.mobile-menu {
  display: none;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background);
  padding: var(--spacing-md) var(--spacing-lg);
}

.mobile-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.mobile-nav-link {
  display: block;
  padding: var(--spacing-sm) 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.mobile-nav-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: var(--spacing-md);
  box-sizing: border-box;
}

@media (max-width: 768px) {

  .nav-links,
  .nav-cta {
    display: none;
  }

  .nav-mobile-toggle {
    display: flex;
  }

  .mobile-menu--open {
    display: block;
    position: fixed;
    top: 64px;
    /* matches nav height */
    left: 0;
    right: 0;
    bottom: 0;
    z-index: calc(var(--z-header) - 1);
    overflow-y: auto;
    padding-bottom: env(safe-area-inset-bottom, var(--spacing-xl));
  }
}

/* ========================
   Section shared styles
========================= */
.section-header {
  text-align: center;
  max-width: 640px;
  margin: 0 auto var(--spacing-2xl);
}

.section-heading {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-md);
  line-height: 1.2;
}

.section-subheading {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* ========================
   Hero
========================= */
.hero {
  padding: var(--spacing-2xl) 0;
  overflow: hidden;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
  min-height: 540px;
}

.hero-content {
  max-width: 520px;
}

.hero-eyebrow {
  font-size: var(--font-size-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-purple-on-dark);
  margin: 0 0 var(--spacing-md);
}

.hero-heading {
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-text);
  margin: 0 0 var(--spacing-lg);
}

.hero-heading-accent {
  color: var(--color-purple-on-dark);
}

.hero-br {
  display: none;
}

.hero-body {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0 0 var(--spacing-xl);
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  margin-bottom: var(--spacing-md);
}

.hero-cta-primary {
  font-size: var(--font-size-base);
  padding: 0 var(--spacing-xl);
}

.hero-cta-secondary {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-purple-on-dark);
  text-decoration: none;
  transition: gap 0.2s;
}

.hero-cta-secondary:hover {
  gap: var(--spacing-sm);
}

.hero-cta-secondary:focus-visible {
  outline: 3px solid var(--color-purple-on-dark);
  outline-offset: 3px;
  border-radius: 2px;
}

.hero-note {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Phone mockup */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero-blob {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102, 38, 175, 0.12) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.phone-mockup {
  position: relative;
  z-index: 1;
  width: 280px;
  background-color: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: var(--spacing-md);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(102, 38, 175, 0.2);
}

.phone-screen {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.mockup-categories-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.mockup-categories-label {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: #e2e8f0;
}

.mockup-add-category-btn {
  font-size: 10px;
  font-weight: 700;
  background-color: #6626AF;
  color: white;
  padding: 5px 10px;
  border-radius: 0.375rem;
}

.mockup-input-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--spacing-xs);
}

.mockup-input-field {
  flex: 1;
  font-size: 11px;
  color: #4b5563;
  background-color: #0f172a;
  border: 1px solid #2d3748;
  border-radius: 0.375rem;
  padding: 6px 8px;
}

.mockup-add-photo-btn {
  font-size: 10px;
  color: #6b7280;
  border: 1px dashed #374151;
  border-radius: 0.375rem;
  padding: 6px 8px;
  white-space: nowrap;
}

.mockup-add-btn {
  font-size: 10px;
  font-weight: 700;
  background-color: #6626AF;
  color: white;
  padding: 6px 10px;
  border-radius: 0.375rem;
  white-space: nowrap;
}

.mockup-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #4b5563;
  margin: var(--spacing-xs) 0 4px;
  padding: 0;
}

.mockup-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mockup-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--font-size-sm);
  color: #e2e8f0;
  padding: 10px 12px;
  background-color: #1e2d45;
  border-radius: 0.5rem;
  border: 1px solid #243044;
}

.mockup-item--done {
  color: #475569;
  text-decoration: line-through;
}

/* Purple filled square checkbox — checked */
.mockup-check {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  background-color: #6626AF;
  flex-shrink: 0;
  position: relative;
}

.mockup-check::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 10l3.5 3.5L15 7' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}

/* Dark square with border — unchecked */
.mockup-circle {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 2px solid #334155;
  background-color: #162032;
  flex-shrink: 0;
}

.mockup-avatar--purple {
  background-color: #6626AF;
}

.mockup-avatar--green {
  background-color: #059669;
}

.mockup-avatar--orange {
  background-color: #d97706;
}

.mockup-synced {
  font-size: 10px;
  color: #475569;
  margin-left: auto;
}

@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
    min-height: auto;
    gap: var(--spacing-xl);
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-br {
    display: block;
  }

  .hero-visual {
    order: -1;
  }

  .phone-mockup {
    width: 220px;
  }
}

/* ========================
   Features
========================= */
.features {
  padding: var(--spacing-2xl) 0;
  background-color: var(--color-surface);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: var(--spacing-xl);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.625rem;
  background-color: rgba(102, 38, 175, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.feature-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm);
}

.feature-body {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

/* ========================
   Pricing
========================= */
.pricing {
  padding: var(--spacing-2xl) 0;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  max-width: 960px;
  margin: 0 auto;
}

.pricing-card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  position: relative;
}

.pricing-card--featured {
  border: 2px solid var(--color-primary);
}

.pricing-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 99px;
  white-space: nowrap;
}

.pricing-card-header {
  margin-bottom: var(--spacing-lg);
}

.pricing-plan-name {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm);
}

.pricing-amount {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.pricing-price {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}

.pricing-period {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.pricing-tagline {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.pricing-feature {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.pricing-feature--muted {
  color: var(--color-text-secondary);
}

.pricing-check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--color-success);
  flex-shrink: 0;
  position: relative;
}

.pricing-check::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 9l3.5 3.5L14 6' stroke='white' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}

.pricing-x {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--color-border);
  flex-shrink: 0;
  position: relative;
}

.pricing-x::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 6l6 6M12 6l-6 6' stroke='%236b7280' stroke-width='1.75' stroke-linecap='round'/%3E%3C/svg%3E");
}

.pricing-cta {
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  background: transparent;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
}

.pricing-cta:hover:not(:disabled) {
  background-color: rgba(102, 38, 175, 0.06);
  transform: none;
}

/* Dark mode — card surface is dark, primary purple fails contrast */
:root.dark .pricing-cta:not(.pricing-cta--featured),
:root:not(.light) .pricing-cta:not(.pricing-cta--featured) {
  color: var(--color-purple-on-dark);
  border-color: var(--color-purple-on-dark);
}

:root.dark .pricing-cta:not(.pricing-cta--featured):hover:not(:disabled),
:root:not(.light) .pricing-cta:not(.pricing-cta--featured):hover:not(:disabled) {
  background-color: rgba(183, 148, 244, 0.1);
}

.pricing-card--featured .pricing-cta--featured,
.pricing-cta--featured,
:root.dark .pricing-cta--featured,
:root:not(.light) .pricing-cta--featured {
  background-color: var(--color-primary-dark);
  color: white;
  border-color: var(--color-primary-dark);
}

.pricing-card--featured .pricing-cta--featured:hover:not(:disabled),
.pricing-cta--featured:hover:not(:disabled),
:root.dark .pricing-cta--featured:hover:not(:disabled),
:root:not(.light) .pricing-cta--featured:hover:not(:disabled) {
  background-color: #3d1769;
}

.pricing-trial-note {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-align: center;
  margin: var(--spacing-sm) 0 0;
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 420px;
  }

  .pricing-card--featured {
    order: -1;
  }
}

@media (min-width: 769px) and (max-width: 1023px) {
  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 680px;
  }
}

/* ========================
   FAQ
========================= */
/* ========================
   FAQ
========================= */
.faq {
  padding: var(--spacing-2xl) 0;
  background-color: var(--color-surface);
}

.faq-inner {
  max-width: 720px;
}

.faq-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.faq-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.faq-group-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-primary);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.faq-item {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.faq-item[open] {
  border-color: var(--color-primary);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  list-style: none;
  gap: var(--spacing-md);
  min-height: var(--min-touch-target);
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-question::after {
  content: '+';
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-purple-on-dark);
  flex-shrink: 0;
}

.faq-item[open] .faq-question::after {
  content: '–';
}

.faq-question:hover {
  background-color: rgba(102, 38, 175, 0.05);
}

.faq-item summary:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: -3px;
}

.faq-answer {
  padding: 0 var(--spacing-lg) var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.faq-answer p {
  margin: 0;
}

.faq-contact {
  text-align: center;
  padding: var(--spacing-2xl) 0 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.faq-contact-link {
  color: var(--color-purple-on-dark);
  font-weight: 600;
  text-decoration: underline;
}

.faq-contact-link:hover {
  color: #d6bcfa;
}

@media (max-width: 640px) {
  .faq-question {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .faq-answer {
    padding: 0 var(--spacing-md) var(--spacing-sm);
  }
}


/* ========================
   CTA Band
========================= */
.cta-band {
  padding: var(--spacing-2xl) 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

.cta-inner {
  text-align: center;
}

.cta-heading {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: white;
  margin: 0 0 var(--spacing-md);
  line-height: 1.2;
}

.cta-body {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 var(--spacing-xl);
  line-height: 1.6;
}

.cta-button {
  background-color: white;
  color: var(--color-primary);
  font-size: var(--font-size-base);
  padding: 0 var(--spacing-xl);
}

.cta-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.9);
}

/* ========================
   Footer
========================= */
.landing-footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.footer-inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-2xl);
  align-items: start;
  padding-top: var(--spacing-2xl);
  padding-bottom: var(--spacing-2xl);
}

.footer-brand {
  max-width: 280px;
}

.footer-logo {
  margin-bottom: var(--spacing-sm);
}

.footer-tagline {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
}

.footer-nav {
  display: flex;
  gap: var(--spacing-2xl);
}

.footer-nav-group ul {
  list-style: none;
  padding: 0;
  margin: var(--spacing-sm) 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.footer-nav-heading {
  font-size: var(--font-size-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text);
  margin: 0;
}

.footer-link {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-link:hover {
  color: var(--color-purple-on-dark);
}

.footer-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-md) 0;
}

.footer-bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-copy {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.footer-legal {
  display: flex;
  gap: var(--spacing-md);
  list-style: none;
  padding: 0;
  margin: 0;
}

.heart {
  color: #dc2626;
}

@media (max-width: 640px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .footer-bottom-inner {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }
}

/* ========================
   Section spacing on mobile
========================= */
@media (max-width: 640px) {

  .hero,
  .features,
  .pricing,
  .faq,
  .cta-band {
    padding: var(--spacing-xl) 0;
  }

  .section-heading {
    font-size: var(--font-size-2xl);
  }

  .cta-heading {
    font-size: var(--font-size-2xl);
  }
}
</style>