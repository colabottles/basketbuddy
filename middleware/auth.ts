export default defineNuxtRouteMiddleware(async (to, from) => {
  const publicRoutes = ['/login', '/signup', '/faq', '/privacy', '/terms', '/support', '/pricing']

  if (publicRoutes.includes(to.path)) return

  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return navigateTo('/login')
  }
})