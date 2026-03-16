export const useSubscription = () => {
  const supabase = useSupabase()
  const user = useSupabaseUser()
  const subscription = ref<{ plan: string; status: string; current_period_end: string; is_free: boolean } | null>(null)
  const loading = ref(true)

  const fetchSubscription = async () => {
    if (!user.value) return
    const { data } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end, is_free')
      .eq('user_id', user.value.id)
      .eq('status', 'active')
      .single()
    subscription.value = data
    loading.value = false
  }

  const isPaid = computed(() =>
    !!subscription.value && (subscription.value.is_free === true || subscription.value.status === 'active')
  )

  const maxLists = computed(() => {
    if (!subscription.value) return 2 // no subscription = free tier
    if (subscription.value.is_free) return Infinity // free forever = unlimited
    if (subscription.value.plan === 'family') return 12 // family paid
    return 5 // solo paid
  })

  const maxShares = computed(() => {
    if (!subscription.value) return 0 // no subscription = no sharing
    if (subscription.value.is_free) return Infinity // free forever = unlimited
    if (subscription.value.plan === 'family') return 6 // family paid
    return Infinity // solo paid = unlimited shares (just 5 lists)
  })

  const canShare = computed(() => {
    if (!subscription.value) return false
    return true
  })

  const isActive = computed(() => !!subscription.value?.status === true)
  const isSolo = computed(() => subscription.value?.plan === 'solo')
  const isFamily = computed(() => subscription.value?.plan === 'family')
  const isCancelling = computed(() => subscription.value?.status === 'cancelling')

  onMounted(fetchSubscription)

  return {
    subscription,
    loading,
    isPaid,
    isActive,
    isSolo,
    isFamily,
    isCancelling,
    maxLists,
    maxShares,
    canShare,
    fetchSubscription
  }
}