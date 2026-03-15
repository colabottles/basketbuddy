export const useLogout = () => {
  const supabase = useSupabase()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await router.replace('/login')
  }

  return { handleLogout }
}