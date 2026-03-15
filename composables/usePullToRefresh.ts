export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const startY = ref(0)
  const pulling = ref(false)
  const pullDistance = ref(0)
  const refreshing = ref(false)
  const THRESHOLD = 80

  const getScrollTop = () => {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
  }

  const onTouchStart = (e: TouchEvent) => {
    const scrollTop = getScrollTop()
    if (scrollTop <= 0 && e.touches[0]) {
      startY.value = e.touches[0].clientY
      pulling.value = true
    }
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!pulling.value || !e.touches[0]) return
    const distance = e.touches[0].clientY - startY.value
    if (distance > 0) {
      pullDistance.value = Math.min(distance, THRESHOLD * 1.5)
    }
  }

  const onTouchEnd = async () => {
    if (!pulling.value) return
    pulling.value = false
    if (pullDistance.value >= THRESHOLD && !refreshing.value) {
      refreshing.value = true
      await onRefresh()
      refreshing.value = false
    }
    pullDistance.value = 0
  }

  onMounted(() => {
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
  })

  return { pullDistance, refreshing, THRESHOLD }
}