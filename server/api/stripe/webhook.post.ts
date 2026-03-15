import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const body = await readRawBody(event)
  const sig = getHeader(event, 'stripe-signature')!
  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(body!, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    throw createError({ statusCode: 400, message: 'Webhook signature invalid' })
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    const subscriptionId = session.subscription as string
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['discount']
    })
    const sub = subscription as unknown as {
      current_period_end: number
      items: Stripe.Subscription['items']
      status: string
      discount: { coupon: { percent_off: number } } | null
    }
    const priceId = sub.items?.data?.[0]?.price?.id ?? ''
    const plan = getPlanFromPriceId(priceId)
    const isFree = sub.discount?.coupon?.percent_off === 100

    await supabase.from('subscriptions').upsert({
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: session.customer as string,
      plan,
      status: 'active',
      is_free: isFree,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  if (stripeEvent.type === 'customer.subscription.deleted') {
    const sub = stripeEvent.data.object as unknown as { id: string }
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', sub.id)
  }

  if (stripeEvent.type === 'customer.subscription.updated') {
    const sub = stripeEvent.data.object as unknown as { id: string; status: string; current_period_end: number }
    await supabase
      .from('subscriptions')
      .update({
        status: sub.status,
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', sub.id)
  }

  return { received: true }
})

function getPlanFromPriceId(priceId: string): string {
  const map: Record<string, string> = {
    [process.env.STRIPE_SOLO_MONTHLY_PRICE_ID!]: 'solo',
    [process.env.STRIPE_SOLO_ANNUAL_PRICE_ID!]: 'solo',
    [process.env.STRIPE_FAMILY_MONTHLY_PRICE_ID!]: 'family',
    [process.env.STRIPE_FAMILY_ANNUAL_PRICE_ID!]: 'family',
  }
  return map[priceId] ?? 'solo'
}