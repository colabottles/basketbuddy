<template>
  <div class="app-container">
    <AppHeader
      title="BasketBuddy"
      :is-logging-out="false"
      :avatar-url="avatarUrl"
      :user-initials="userInitials"
      @logout="handleLogout" />

    <main id="main-content" class="main-content">
      <div class="container">

        <div class="support-hero">
          <h2 class="support-title">Support</h2>
          <p class="support-subtitle">We're here to help. Reach out and we'll get back to you as
            soon as possible.</p>
        </div>

        <div class="support-content">

          <div class="support-options">

            <div class="support-card">
              <div class="support-card-icon" aria-hidden="true">✉️</div>
              <h3 class="support-card-title">Email Support</h3>
              <p class="support-card-text">For account issues, billing questions, or anything else,
                email us directly. We typically respond within one business day.</p>
              <a href="mailto:&#116;&#111;&#100;&#100;&#64;&#116;&#111;&#100;&#100;&#108;&#46;&#100;&#101;&#118;"
                class="button support-card-cta">Contact Support</a>
            </div>

            <div class="support-card">
              <div class="support-card-icon" aria-hidden="true">📖</div>
              <h3 class="support-card-title">FAQ</h3>
              <p class="support-card-text">Check our frequently asked questions for quick answers to
                the most common questions about BasketBuddy.</p>
              <a href="/faq" class="button button-secondary support-card-cta">View FAQ</a>
            </div>

            <div class="support-card">
              <div class="support-card-icon" aria-hidden="true">🔒</div>
              <h3 class="support-card-title">Privacy &amp; Terms</h3>
              <p class="support-card-text">Read our privacy policy and terms of service to
                understand how we handle your data and what you can expect from us.</p>
              <div class="support-card-links">
                <a href="/privacy" class="legal-link">Privacy Policy</a>
                <a href="/terms" class="legal-link">Terms of Service</a>
              </div>
            </div>

          </div>

          <section class="support-common" aria-labelledby="common-heading">
            <h3 id="common-heading" class="support-section-title">Common Issues</h3>

            <div class="support-issue-list">

              <div class="support-issue">
                <h4 class="support-issue-title">I forgot my password</h4>
                <p class="support-issue-text">Go to the <a href="/login" class="legal-link">login
                    page</a> and click "Forgot password". We'll send a reset link to your email
                  address.</p>
              </div>

              <div class="support-issue">
                <h4 class="support-issue-title">My lists aren't syncing</h4>
                <p class="support-issue-text">Make sure you have an active internet connection. Try
                  refreshing the page or closing and reopening the app. If the problem persists,
                  sign out and back in.</p>
              </div>

              <div class="support-issue">
                <h4 class="support-issue-title">I can't see a list someone shared with me</h4>
                <p class="support-issue-text">Make sure you're signed in with the same email address
                  the list was shared to. If you signed up with a different address, the list won't
                  appear in your account.</p>
              </div>

              <div class="support-issue">
                <h4 class="support-issue-title">I was charged but my subscription isn't active</h4>
                <p class="support-issue-text">This can occasionally happen if there's a delay
                  processing the payment confirmation. Wait a few minutes and refresh the app. If
                  your subscription still shows as inactive after 15 minutes, contact us at <a
                    href="mailto:&#116;&#111;&#100;&#100;&#64;&#116;&#111;&#100;&#100;&#108;&#46;&#100;&#101;&#118;"
                    class="legal-link">our Support Team</a> and we'll sort it out right away.</p>
              </div>

              <div class="support-issue">
                <h4 class="support-issue-title">How do I cancel my subscription?</h4>
                <p class="support-issue-text">Go to <a href="/settings"
                    class="legal-link">Settings</a> and find the Subscription section. You can
                  cancel from there. You'll keep access until the end of your current billing
                  period.</p>
              </div>

              <div class="support-issue">
                <h4 class="support-issue-title">How do I delete my account?</h4>
                <p class="support-issue-text">Go to <a href="/settings"
                    class="legal-link">Settings</a> and scroll to the bottom. There is an option to
                  permanently delete your account and all associated data.</p>
              </div>

              <div class="support-issue">
                <h4 class="support-issue-title">The app isn't working on my device</h4>
                <p class="support-issue-text">BasketBuddy works best on modern browsers — Chrome,
                  Safari, Firefox, and Edge. Make sure your browser is up to date. If you're having
                  trouble on a specific device, email us with details and we'll investigate.</p>
              </div>

            </div>
          </section>

          <div class="support-contact-footer">
            <p>Didn't find what you were looking for? <a
                href="mailto:&#116;&#111;&#100;&#100;&#64;&#116;&#111;&#100;&#100;&#108;&#46;&#100;&#101;&#118;"
                class="legal-link">Contact our Support Team</a> and we'll help you out.</p>
          </div>

        </div>

      </div>
    </main>

    <AppFooter />

  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: []
})

const { handleLogout } = useLogout()

const { avatarUrl, userInitials, loadAvatar } = useUserAvatar()
onMounted(loadAvatar)

useHead({ title: 'Support - BasketBuddy' })
</script>