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
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> 1
                user</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span> Up to
                5 lists</li>
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
                6 members</li>
              <li class="feature-item"><span class="feature-check" aria-hidden="true">✓</span>
                Unlimited lists</li>
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

        </div>

        <p v-if="error" class="checkout-error" role="alert">{{ error }}</p>

      </div>
    </main>

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
</script>

<style scoped>
.pricing-hero {
  text-align: center;
  padding: var(--spacing-xl) 0 var(--spacing-2xl);
}

.pricing-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm);
}

.pricing-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0 auto var(--spacing-xl);
  max-width: 480px;
}

/* Toggle */
.billing-toggle {
  display: inline-flex;
  background-color: var(--color-surface);
  border: 2px solid var(--color-primary);
  border-radius: 9999px;
  padding: 4px;
  gap: 4px;
  box-shadow: 0 0 0 4px rgba(102, 38, 175, 0.1);
}

.billing-option {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.billing-option.active {
  background-color: var(--color-primary);
  color: #fff;
}

.billing-option:not(.active):hover {
  background-color: var(--color-border);
  color: var(--color-text);
}

.billing-save-badge {
  background-color: var(--color-success);
  color: #111;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.billing-option.active .billing-save-badge {
  background-color: rgba(255, 255, 255, 0.25);
}

/* Grid */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto var(--spacing-xl);
}

/* Cards */
.pricing-card {
  position: relative;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 1rem;
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.pricing-card-featured {
  border-color: var(--color-primary);
  box-shadow: 0 4px 32px rgba(102, 38, 175, 0.15);
}

.pricing-card-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-primary);
  color: #fff;
  padding: 4px 16px;
  border-radius: 9999px;
  font-size: var(--font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.pricing-card-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.plan-name {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-amount {
  font-size: var(--font-size-4xl, 2.5rem);
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}

.price-period {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.plan-price-note {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

/* Features */
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.feature-check {
  color: var(--color-success);
  font-weight: 700;
  flex-shrink: 0;
}

/* CTA */
.plan-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  box-sizing: border-box;
}

/* Error */
.checkout-error {
  text-align: center;
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-md);
}

@media (max-width: 640px) {
  .pricing-title {
    font-size: var(--font-size-2xl);
  }

  .pricing-card {
    padding: var(--spacing-lg);
  }
}
</style>