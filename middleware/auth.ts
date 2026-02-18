export default defineNuxtRouteMiddleware(async (to, from) => {
  const supabase = useSupabase()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return navigateTo('/login')
  }
})