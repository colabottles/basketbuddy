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

        <div class="pricing-hero">
          <h2 class="pricing-title">Pick your plan</h2>
          <p class="pricing-subtitle">No ads. No tracking. Cancel any time.</p>

          <div class="billing-toggle" role="group" aria-label="Billing period">
            <button
              class="billing-option"
              :class="{ active: billing === 'monthly' }"
              @click="billing = 'monthly'">
              Monthly
            </button>
            <button
              class="billing-option"
              :class="{ active: billing === 'annual' }"
              @click="billing = 'annual'">
              Annual
              <span class="billing-save-badge">Save 17%</span>
            </button>
          </div>
        </div>

        <div class="pricing-grid">

          <!-- Free -->
          <div class="pricing-card">
            <div class="pricing-card-header">
              <h3 class="plan-name">Free</h3>
              <div class="plan-price">
                <span class="price-amount">$0</span>
                <span class="price-period">/ forever</span>
              </div>
              <p class="plan-price-note">No credit card required</p>
            </div>
            <ul class="plan-features" role="list">
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> Up to
                2 lists</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> No
                sharing</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                Real-time sync</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                Offline support (PWA)</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                Rewards card storage</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> WCAG
                2.2 AA accessible</li>
            </ul>
            <button
              v-if="subscription"
              @click="showDowngradeDialog = true"
              class="button button-secondary plan-cta">
              Downgrade to Free
            </button>
            <NuxtLink
              v-else
              to="/signup"
              class="button button-secondary plan-cta">
              Get Started Free
            </NuxtLink>
          </div>

          <!-- Solo -->
          <div class="pricing-card">
            <div class="pricing-card-header">
              <h3 class="plan-name">Solo</h3>
              <div class="plan-price">
                <span class="price-amount">{{ billing === 'monthly' ? '$4' : '$40' }}</span>
                <span class="price-period">{{ billing === 'monthly' ? '/ month' : '/ year' }}</span>
              </div>
              <p class="plan-price-note" v-if="billing === 'annual'">Billed annually — save $8 vs
                monthly</p>
              <p class="plan-price-note" v-else>Billed monthly</p>
            </div>
            <ul class="plan-features" role="list">
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> Up to
                5 lists</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> List
                sharing</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                Real-time sync</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                Offline support (PWA)</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                Rewards card storage</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> WCAG
                2.2 AA accessible</li>
            </ul>
            <button
              class="button button-secondary plan-cta"
              :disabled="loading"
              @click="checkout(billing === 'monthly' ? 'STRIPE_SOLO_MONTHLY_PRICE_ID' : 'STRIPE_SOLO_ANNUAL_PRICE_ID')">
              Get Solo
            </button>
          </div>

          <!-- Family -->
          <div class="pricing-card pricing-card-featured">
            <div class="pricing-card-badge">Best value</div>
            <div class="pricing-card-header">
              <h3 class="plan-name">Family</h3>
              <div class="plan-price">
                <span class="price-amount">{{ billing === 'monthly' ? '$8' : '$80' }}</span>
                <span class="price-period">{{ billing === 'monthly' ? '/ month' : '/ year' }}</span>
              </div>
              <p class="plan-price-note" v-if="billing === 'annual'">Billed annually — save $16 vs
                monthly</p>
              <p class="plan-price-note" v-else>Billed monthly</p>
            </div>
            <ul class="plan-features" role="list">
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> Up to
                12 lists</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> Up to
                6 members</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                Real-time sync</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                Offline support (PWA)</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                Rewards card storage</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> WCAG
                2.2 AA accessible</li>
            </ul>
            <button
              class="button plan-cta"
              :disabled="loading"
              @click="checkout(billing === 'monthly' ? 'STRIPE_FAMILY_MONTHLY_PRICE_ID' : 'STRIPE_FAMILY_ANNUAL_PRICE_ID')">
              Get Family
            </button>
          </div>

            <!-- Super User - Coming Soon -->
            <div class="pricing-card pricing-card-coming-soon">
              <div class="pricing-card-badge pricing-card-badge-coming-soon">Coming Soon</div>
              <div class="pricing-card-header">
                <h3 class="plan-name">Super User</h3>
                <div class="plan-price">
                  <span class="price-amount">{{ billing === 'monthly' ? '$20' : '$200' }}</span>
                  <span class="price-period">{{ billing === 'monthly' ? '/ month' : '/ year' }}</span>
                </div>
                <p class="plan-price-note" v-if="billing === 'annual'">Billed annually — save $40 vs
                  monthly</p>
                <p class="plan-price-note" v-else>Billed monthly</p>
              </div>
              <ul class="plan-features" role="list">
                <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                  Unlimited lists</li>
                <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                  Unlimited members</li>
                <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> Item
                  price tracking</li>
                <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                  Running total per list</li>
                <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                  Budget calculator</li>
                <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                  Priority support</li>
                <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                  Real-time sync</li>
                <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                  Offline support (PWA)</li>
                <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> WCAG
                  2.2 AA accessible</li>
              </ul>
              <button
                class="button plan-cta plan-cta-disabled"
                disabled
                aria-disabled="true">
                Coming Soon
              </button>
            </div>
          </div>

        <p v-if="error" class="checkout-error" role="alert">{{ error }}</p>

      </div>
    </main>

    <div
      v-if="showDowngradeDialog"
      class="dialog-overlay"
      @click="showDowngradeDialog = false"
      role="alertdialog"
      aria-labelledby="downgrade-title"
      aria-describedby="downgrade-description"
      aria-modal="true">
      <div class="dialog" @click.stop>
        <h2 id="downgrade-title" class="dialog-title">Downgrade to Free?</h2>
        <div id="downgrade-description">
          <p class="dialog-description">
            Your current plan will remain active until the end of your billing period. After that,
            your account will switch to the Free plan with the following limits:
          </p>
          <ul class="downgrade-list">
            <li>Maximum 2 lists (existing lists are kept but you cannot create new ones until you're
              under the limit)</li>
            <li>No list sharing — shared lists will become view-only for collaborators</li>
            <li>No price tracking or budget features</li>
          </ul>
          <p class="dialog-description">Are you sure you want to downgrade?</p>
        </div>
        <div v-if="downgradeError" class="error-message" role="alert">
          {{ downgradeError }}
        </div>
        <div class="dialog-actions">
          <button
            type="button"
            @click="showDowngradeDialog = false"
            class="button button-secondary">
            Keep My Plan
          </button>
          <button
            @click="handleDowngrade"
            class="button button-danger"
            :disabled="isDowngrading">
            {{ isDowngrading ? 'Processing...' : 'Yes, Downgrade' }}
          </button>
        </div>
      </div>
    </div>

    <AppFooter />

  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Pricing - BasketBuddy' })

const { handleLogout } = useLogout()

const { avatarUrl, userInitials, loadAvatar } = useUserAvatar()
onMounted(loadAvatar)

const supabase = useSupabase()
const billing = ref<'monthly' | 'annual'>('monthly')
const loading = ref(false)
const error = ref('')
const { subscription, canShare, maxLists } = useSubscription()
const showDowngradeDialog = ref(false)
const isDowngrading = ref(false)
const downgradeError = ref('')

const config = useRuntimeConfig()
const priceIds: Record<string, string> = {
  STRIPE_SOLO_MONTHLY_PRICE_ID: config.public.stripeSoloMonthly as string,
  STRIPE_SOLO_ANNUAL_PRICE_ID: config.public.stripeSoloAnnual as string,
  STRIPE_FAMILY_MONTHLY_PRICE_ID: config.public.stripeFamilyMonthly as string,
  STRIPE_FAMILY_ANNUAL_PRICE_ID: config.public.stripeFamilyAnnual as string,
}

const checkout = async (priceKey: string) => {
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  if (!user) {
    await navigateTo('/login')
    return
  }

  error.value = ''
  loading.value = true
  try {
    const { url } = await $fetch<{ url: string | null }>('/api/stripe/checkout', {
      method: 'POST',
      body: { priceId: priceIds[priceKey], userId: user.id, email: user.email },
    })
    if (url) window.location.href = url
  } catch (e) {
    console.error(e)
    error.value = 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleDowngrade = async () => {
  isDowngrading.value = true
  downgradeError.value = ''
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return navigateTo('/login')

    await $fetch('/api/stripe/cancel', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` }
    })
    showDowngradeDialog.value = false
    await navigateTo('/settings')
  } catch (e: any) {
    downgradeError.value = e.message || 'Failed to downgrade. Please contact support.'
  } finally {
    isDowngrading.value = false
  }
}
</script>