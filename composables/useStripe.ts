export const useStripe = () => {
  const redirectToCheckout = async (priceId: string, email: string) => {
    const { url } = await $fetch<{ url: string | null }>('/api/stripe/checkout', {
      method: 'POST',
      body: { priceId, email },
    })
    if (!url) throw new Error('No checkout URL returned from Stripe')
    window.location.href = url
  }
  return { redirectToCheckout }
}