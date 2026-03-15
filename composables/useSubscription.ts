export const useSubscription = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const subscription = ref<{ plan: string; status: string; current_period_end: string } | null>(null)
  const loading = ref(true)

  const fetchSubscription = async () => {
  if (!user.value) return
  const { data } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', user.value.id)
    .eq('status', 'active')
    .single()
  subscription.value = data
  loading.value = false
}

  const isActive = computed(() => subscription.value?.status === 'active')
  const isSolo = computed(() => subscription.value?.plan === 'solo')
  const isFamily = computed(() => subscription.value?.plan === 'family')
  const maxLists = computed(() => isSolo.value ? 5 : Infinity)

  onMounted(fetchSubscription)

  return { subscription, loading, isActive, isSolo, isFamily, maxLists, fetchSubscription }
}