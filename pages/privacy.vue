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

        <div class="legal-hero">
          <h2 class="legal-title">Privacy Policy</h2>
          <p class="legal-meta">Last updated: March 13, 2026</p>
        </div>

        <div class="legal-content">

          <section aria-labelledby="intro-heading">
            <h3 id="intro-heading">Overview</h3>
            <p>BasketBuddy is built on a simple principle: your data is yours. We do not sell, rent,
              trade, or share your personal information with third parties for any commercial
              purpose — ever. This policy explains what we collect, why we collect it, and how we
              protect it.</p>
          </section>

          <section aria-labelledby="collect-heading">
            <h3 id="collect-heading">What We Collect</h3>
            <p>We collect only what is necessary to provide the service:</p>
            <p><strong>Account information</strong> — your email address, used to sign in and send
              you account-related emails such as password resets and list sharing invitations.</p>
            <p><strong>Grocery list data</strong> — the lists, items, and collaborators you create
              within the app. This data is stored securely in our database and is only accessible to
              you and anyone you explicitly share it with.</p>
            <p><strong>Profile information</strong> — an optional avatar image and display name you
              may choose to set.</p>
            <p><strong>Subscription information</strong> — your subscription plan and status.
              Payment details are handled entirely by Stripe and are never stored by BasketBuddy.
            </p>
          </section>

          <section aria-labelledby="no-sell-heading">
            <h3 id="no-sell-heading">We Do Not Sell Your Data</h3>
            <p>We do not sell, license, rent, or otherwise transfer your personal information or
              usage data to any third party, advertiser, data broker, or analytics company.
              BasketBuddy has no advertising relationships and does not use your data to serve ads.
              Your grocery habits are your business, not ours.</p>
          </section>

          <section aria-labelledby="use-heading">
            <h3 id="use-heading">How We Use Your Data</h3>
            <p>We use your data solely to operate and improve BasketBuddy:</p>
            <p>To provide the core functionality of the app — creating, syncing, and sharing grocery
              lists.</p>
            <p>To send transactional emails — such as list sharing invitations and account
              notifications. We do not send marketing emails unless you explicitly opt in.</p>
            <p>To process payments securely through Stripe.</p>
            <p>To diagnose and fix bugs and improve performance.</p>
          </section>

          <section aria-labelledby="third-party-heading">
            <h3 id="third-party-heading">Third-Party Services</h3>
            <p>BasketBuddy uses a small number of trusted third-party services to operate:</p>
            <p><strong>Supabase</strong> — our database and authentication provider. Your data is
              stored on Supabase's infrastructure. See <a href="https://supabase.com/privacy"
                target="_blank" rel="noopener noreferrer" class="legal-link">Supabase's privacy
                policy</a>.</p>
            <p><strong>Stripe</strong> — our payment processor. Stripe handles all payment
              information. BasketBuddy never sees or stores your card details. See <a
                href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"
                class="legal-link">Stripe's privacy policy</a>.</p>
            <p><strong>Netlify</strong> — our hosting provider. See <a
                href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer"
                class="legal-link">Netlify's privacy policy</a>.</p>
            <p>None of these providers are permitted to use your data for their own marketing
              purposes.</p>
          </section>

          <section aria-labelledby="cookies-heading">
            <h3 id="cookies-heading">Cookies &amp; Storage</h3>
            <p>BasketBuddy uses browser local storage to keep you signed in between sessions. We do
              not use third-party tracking cookies or analytics cookies. No advertising cookies are
              used.</p>
          </section>

          <section aria-labelledby="retention-heading">
            <h3 id="retention-heading">Data Retention</h3>
            <p>We retain your data for as long as your account is active. If you delete your
              account, your personal data and grocery lists are permanently deleted from our systems
              within 30 days. Stripe may retain payment records as required by law.</p>
          </section>

          <section aria-labelledby="rights-heading">
            <h3 id="rights-heading">Your Rights</h3>
            <p>You have the right to access, correct, export, or delete your personal data at any
              time. To make a request, contact us at <a href="mailto:todd@toddl.dev"
                class="legal-link">todd@toddl.dev</a> and we will respond within 30 days.</p>
          </section>

          <section aria-labelledby="security-heading">
            <h3 id="security-heading">Security</h3>
            <p>We take security seriously. All data is transmitted over HTTPS. Authentication is
              handled by Supabase with industry-standard protections. Row-level security policies
              ensure users can only access their own data. We regularly review our security
              practices.</p>
          </section>

          <section aria-labelledby="children-heading">
            <h3 id="children-heading">Children's Privacy</h3>
            <p>BasketBuddy is not directed at children under the age of 13. We do not knowingly
              collect personal information from children. If you believe a child has provided us
              with personal information, please contact us and we will delete it promptly.</p>
          </section>

          <section aria-labelledby="changes-heading">
            <h3 id="changes-heading">Changes to This Policy</h3>
            <p>If we make material changes to this privacy policy, we will notify you by email or by
              posting a notice in the app before the changes take effect. Continued use of
              BasketBuddy after changes take effect constitutes acceptance of the updated policy.
            </p>
          </section>

          <section aria-labelledby="contact-heading">
            <h3 id="contact-heading">Contact</h3>
            <p>Questions about this policy? Contact us at <a href="mailto:todd@toddl.dev"
                class="legal-link">todd@toddl.dev</a>.</p>
          </section>

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

useHead({ title: 'Privacy Policy - BasketBuddy' })
</script>

<style scoped>
.legal-hero {
  text-align: center;
  padding: var(--spacing-xl) 0 var(--spacing-2xl);
}

.legal-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-xs);
}

.legal-meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.legal-content {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  padding-bottom: var(--spacing-2xl);
}

.legal-content section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.legal-content h3 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--color-primary);
}

.legal-content p {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0;
}

.legal-link {
  color: var(--color-primary-light);
  font-weight: 500;
  text-decoration: underline;
}

.legal-link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.footer-nav {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
  justify-content: center;
}

@media (max-width: 640px) {
  .legal-title {
    font-size: var(--font-size-2xl);
  }
}
</style>