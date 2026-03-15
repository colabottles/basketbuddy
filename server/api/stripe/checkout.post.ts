import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const VALID_PRICE_IDS = new Set([
  process.env.STRIPE_SOLO_MONTHLY_PRICE_ID,
  process.env.STRIPE_SOLO_ANNUAL_PRICE_ID,
  process.env.STRIPE_FAMILY_MONTHLY_PRICE_ID,
  process.env.STRIPE_FAMILY_ANNUAL_PRICE_ID,
])

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (rateLimit(`checkout:${ip}`, 5, 60_000)) {
    throw createError({ statusCode: 429, message: 'Too many requests, please try again later.' })
  }

  const { priceId, userId, email } = await readBody(event)

  if (!priceId || typeof priceId !== 'string' || !VALID_PRICE_IDS.has(priceId)) {
    throw createError({ statusCode: 400, message: 'Invalid price ID' })
  }
  if (!userId || typeof userId !== 'string' || !/^[0-9a-f-]{36}$/.test(userId)) {
    throw createError({ statusCode: 400, message: 'Invalid user ID' })
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Invalid email' })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId },
    allow_promotion_codes: true,
    success_url: `${process.env.APP_URL}/?checkout=success`,
    cancel_url: `${process.env.APP_URL}/pricing?checkout=cancelled`,
  })

  return { url: session.url }
})