export const useUserAvatar = () => {
  const supabase = useSupabase()
  const avatarUrl = ref('')
  const userInitials = ref('')

  const loadAvatar = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      avatarUrl.value = user.user_metadata?.avatar_url || ''

      // Generate initials from email
      const email = user.email || ''
      if (email) {
        const parts = email.split('@')[0]?.split('.') || []
        const firstPart = parts[0]
        const secondPart = parts[1]

        if (parts.length > 1 && firstPart && firstPart.length > 0 && secondPart && secondPart.length > 0) {
          userInitials.value = (firstPart[0]! + secondPart[0]!).toUpperCase()
        } else if (firstPart && firstPart.length > 1) {
          userInitials.value = firstPart.substring(0, 2).toUpperCase()
        } else if (email.length > 1) {
          userInitials.value = email.substring(0, 2).toUpperCase()
        } else {
          userInitials.value = '??'
        }
      } else {
        userInitials.value = '??'
      }
    }
  }

  return {
    avatarUrl,
    userInitials,
    loadAvatar
  }
}