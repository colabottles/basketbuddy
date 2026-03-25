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
          <h2 class="legal-title">Terms of Service</h2>
          <p class="legal-meta">Last updated: March 13, 2026</p>
        </div>

        <div class="legal-content">

          <section aria-labelledby="agreement-heading">
            <h3 id="agreement-heading">Agreement to Terms</h3>
            <p>By creating an account or using BasketBuddy, you agree to these Terms of Service. If
              you do not agree, please do not use the service. These terms apply to all users of
              BasketBuddy, including free and paid subscribers.</p>
          </section>

          <section aria-labelledby="service-heading">
            <h3 id="service-heading">The Service</h3>
            <p>BasketBuddy is a collaborative grocery list application that allows users to create,
              manage, and share shopping lists. We reserve the right to modify, suspend, or
              discontinue any part of the service at any time with reasonable notice.</p>
          </section>

          <section aria-labelledby="accounts-heading">
            <h3 id="accounts-heading">Accounts</h3>
            <p>You must provide a valid email address to create an account. You are responsible for
              maintaining the security of your account and password. BasketBuddy cannot and will not
              be liable for any loss or damage resulting from your failure to keep your account
              secure.</p>
            <p>You may not use BasketBuddy for any illegal or unauthorized purpose. You must not
              violate any laws in your jurisdiction when using the service.</p>
          </section>

          <section aria-labelledby="subscriptions-heading">
            <h3 id="subscriptions-heading">Subscriptions &amp; Billing</h3>
            <p>BasketBuddy offers paid subscription plans billed monthly or annually. Subscriptions
              automatically renew at the end of each billing period unless cancelled before the
              renewal date.</p>
            <p>You may cancel your subscription at any time from your account settings. Cancellation
              takes effect at the end of your current billing period — you will not be charged
              again, and you will retain access until the period ends. We do not offer refunds for
              partial billing periods.</p>
            <p>Prices are listed in US dollars and may be subject to applicable taxes depending on
              your location. We reserve the right to change pricing with 30 days notice.</p>
          </section>

          <section aria-labelledby="content-heading">
            <h3 id="content-heading">Your Content</h3>
            <p>You retain ownership of all content you create in BasketBuddy — your lists, items,
              and any other data you enter. By using the service, you grant BasketBuddy a limited
              license to store and display your content solely for the purpose of providing the
              service to you.</p>
            <p>You are responsible for the content you create and share. You agree not to use
              BasketBuddy to store or share any content that is illegal, harmful, or violates the
              rights of others.</p>
          </section>

          <section aria-labelledby="sharing-heading">
            <h3 id="sharing-heading">Sharing &amp; Collaboration</h3>
            <p>When you share a list with another user, that user gains the ability to view and edit
              the list. You are responsible for who you share your lists with. BasketBuddy is not
              responsible for actions taken by users you have invited to collaborate.</p>
          </section>

          <section aria-labelledby="prohibited-heading">
            <h3 id="prohibited-heading">Prohibited Use</h3>
            <p>You agree not to abuse, harass, or harm other users of the service. You agree not to
              attempt to gain unauthorized access to any part of BasketBuddy or its infrastructure.
              You agree not to use automated tools to scrape, crawl, or overload the service.</p>
          </section>

          <section aria-labelledby="termination-heading">
            <h3 id="termination-heading">Termination</h3>
            <p>You may delete your account at any time from your account settings. We reserve the
              right to suspend or terminate accounts that violate these terms. Upon termination,
              your data will be permanently deleted within 30 days as described in our Privacy
              Policy.</p>
          </section>

          <section aria-labelledby="disclaimer-heading">
            <h3 id="disclaimer-heading">Disclaimer of Warranties</h3>
            <p>BasketBuddy is provided "as is" without warranties of any kind, either express or
              implied. We do not guarantee that the service will be uninterrupted, error-free, or
              completely secure. We will make reasonable efforts to keep the service available and
              your data safe, but cannot guarantee against all possible failures.</p>
          </section>

          <section aria-labelledby="liability-heading">
            <h3 id="liability-heading">Limitation of Liability</h3>
            <p>To the fullest extent permitted by law, BasketBuddy and its operators shall not be
              liable for any indirect, incidental, special, or consequential damages arising from
              your use of or inability to use the service, even if we have been advised of the
              possibility of such damages.</p>
          </section>

          <section aria-labelledby="changes-heading">
            <h3 id="changes-heading">Changes to These Terms</h3>
            <p>We may update these terms from time to time. If we make material changes, we will
              notify you by email or through the app before the changes take effect. Continued use
              of BasketBuddy after changes take effect constitutes acceptance of the updated terms.
            </p>
          </section>

          <section aria-labelledby="governing-heading">
            <h3 id="governing-heading">Governing Law</h3>
            <p>These terms are governed by the laws of the State of Arizona, United States, without
              regard to its conflict of law provisions.</p>
          </section>

          <section aria-labelledby="contact-heading">
            <h3 id="contact-heading">Contact</h3>
            <p>Questions about these terms? Contact <a
                href="mailto:&#116;&#111;&#100;&#100;&#64;&#116;&#111;&#100;&#100;&#108;&#46;&#100;&#101;&#118;"
                class="legal-link">our Support Team</a>.</p>
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

useHead({ title: 'Terms of Service - BasketBuddy' })
</script>