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

        <div class="faq-hero">
          <h2 class="faq-title">Frequently Asked Questions</h2>
          <p class="faq-subtitle">Everything you need to know about BasketBuddy.</p>
        </div>

        <div class="faq-sections">

          <section class="faq-section" aria-labelledby="general-heading">
            <h3 id="general-heading" class="faq-section-title">General</h3>

            <div class="faq-list">
              <details class="faq-item">
                <summary class="faq-question">What is BasketBuddy?</summary>
                <div class="faq-answer">
                  <p>BasketBuddy is a collaborative grocery list app that lets you create, share,
                    and sync shopping lists in real time. It works on any device with a browser, and
                    can be installed on your phone like an app.</p>
                </div>
              </details>

              <details class="faq-item">
                <summary class="faq-question">Is there a free trial?</summary>
                <div class="faq-answer">
                  <p>Yes — you can use BasketBuddy free with up to one list to try it out before
                    subscribing. No credit card required to sign up.</p>
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
                  <p>Yes. BasketBuddy is built to meet WCAG 2.2 AA accessibility standards. It works
                    with screen readers, keyboard navigation, and supports high contrast and reduced
                    motion preferences.</p>
                </div>
              </details>
            </div>
          </section>

          <section class="faq-section" aria-labelledby="plans-heading">
            <h3 id="plans-heading" class="faq-section-title">Plans &amp; Billing</h3>

            <div class="faq-list">
              <details class="faq-item">
                <summary class="faq-question">What is the difference between Solo and Family?
                </summary>
                <div class="faq-answer">
                  <p>The Solo plan is for one person and supports up to 5 lists. The Family plan
                    supports up to 6 members and unlimited lists, making it great for households
                    that shop together.</p>
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
          </section>

          <section class="faq-section" aria-labelledby="install-heading">
            <h3 id="install-heading" class="faq-section-title">Installing BasketBuddy on Your Phone
            </h3>
            <p class="faq-section-intro">BasketBuddy works like a native app on your phone — no app
              store required. Here's how to install it in a few taps.</p>

            <div class="faq-list">
              <details class="faq-item">
                <summary class="faq-question">How do I install BasketBuddy on an iPhone or iPad?
                </summary>
                <div class="faq-answer">
                  <ol class="install-steps">
                    <li>Open <strong>Safari</strong> on your iPhone or iPad. BasketBuddy must be
                      opened in Safari for this to work — Chrome and Firefox on iOS do not support
                      installing apps.</li>
                    <li>Go to <strong>basketbuddyapp.netlify.app</strong> and sign in.</li>
                    <li>Tap the <strong>Share button</strong> at the bottom of the screen — it looks
                      like a box with an arrow pointing up.</li>
                    <li>Scroll down in the share menu and tap <strong>"Add to Home Screen"</strong>.
                    </li>
                    <li>Give it a name (or leave it as BasketBuddy) and tap <strong>Add</strong>.
                    </li>
                    <li>BasketBuddy will now appear on your home screen just like any other app. Tap
                      it to open.</li>
                  </ol>
                </div>
              </details>

              <details class="faq-item">
                <summary class="faq-question">How do I install BasketBuddy on an Android phone?
                </summary>
                <div class="faq-answer">
                  <ol class="install-steps">
                    <li>Open <strong>Chrome</strong> on your Android phone.</li>
                    <li>Go to <strong>basketbuddyapp.netlify.app</strong> and sign in.</li>
                    <li>Tap the <strong>three dots menu</strong> in the top right corner of Chrome.
                    </li>
                    <li>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>
                      — the wording may vary depending on your Android version.</li>
                    <li>Tap <strong>Add</strong> or <strong>Install</strong> to confirm.</li>
                    <li>BasketBuddy will appear on your home screen. Tap it to open it just like any
                      other app.</li>
                  </ol>
                </div>
              </details>

              <details class="faq-item">
                <summary class="faq-question">How do I install BasketBuddy on a Windows or Mac
                  computer?</summary>
                <div class="faq-answer">
                  <ol class="install-steps">
                    <li>Open <strong>Chrome</strong> or <strong>Edge</strong> on your computer.</li>
                    <li>Go to <strong>basketbuddyapp.netlify.app</strong> and sign in.</li>
                    <li>Look for an <strong>install icon</strong> in the address bar on the right
                      side — it looks like a computer screen with a down arrow.</li>
                    <li>Click it and then click <strong>Install</strong>.</li>
                    <li>BasketBuddy will open in its own window and be added to your taskbar or
                      dock.</li>
                  </ol>
                </div>
              </details>

              <details class="faq-item">
                <summary class="faq-question">Does it work offline?</summary>
                <div class="faq-answer">
                  <p>Yes. Once installed, BasketBuddy can load even without an internet connection.
                    Your lists will sync automatically once you're back online.</p>
                </div>
              </details>
            </div>
          </section>

          <section class="faq-section" aria-labelledby="sharing-heading">
            <h3 id="sharing-heading" class="faq-section-title">Sharing &amp; Collaboration</h3>

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
                <summary class="faq-question">Does the person I share with need a BasketBuddy
                  account?</summary>
                <div class="faq-answer">
                  <p>Yes, they'll need to sign up for a free account to view and edit the shared
                    list. Signing up is free and only takes a moment.</p>
                </div>
              </details>

              <details class="faq-item">
                <summary class="faq-question">How many people can share a list?</summary>
                <div class="faq-answer">
                  <p>On the Solo plan, you can share lists with others but the total number of lists
                    is capped at 5. On the Family plan, you can have up to 6 members sharing
                    unlimited lists.</p>
                </div>
              </details>
            </div>
          </section>

        </div>

        <div class="faq-contact">
          <p>Still have questions? <a
              href="mailto:&#116;&#111;&#100;&#100;&#64;&#116;&#111;&#100;&#100;&#108;&#46;&#100;&#101;&#118;"
              class="faq-contact-link">Get in touch</a>.</p>
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

useHead({ title: 'FAQ - BasketBuddy' })
</script>