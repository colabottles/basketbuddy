import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id, is_free')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!subscription) throw createError({ statusCode: 404, message: 'No active subscription found' })
  if (subscription.is_free) throw createError({ statusCode: 400, message: 'Free subscriptions cannot be cancelled this way' })

  // Cancel at period end in Stripe
  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: true
  })

  // Mark as cancelling in Supabase
  await supabase
    .from('subscriptions')
    .update({ status: 'cancelling' })
    .eq('user_id', user.id)

  return { ok: true }
})