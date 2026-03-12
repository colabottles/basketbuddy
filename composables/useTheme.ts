import { computed, onMounted } from 'vue'

export const useTheme = () => {
  const theme = useCookie('theme', { default: () => 'system' })
  const isDark = ref(false)

  const applyTheme = (value: string) => {
    if (value === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      isDark.value = true
    } else if (value === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
      isDark.value = false
    } else {
      document.documentElement.classList.remove('dark', 'light')
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  }

  const toggleTheme = () => {
    const next = isDark.value ? 'light' : 'dark'
    theme.value = next
    applyTheme(next)
  }

  onMounted(() => {
    const saved = theme.value
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved)
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(isDark.value ? 'dark' : 'light')
    }
  })

  return { theme, toggleTheme, isDark }
}