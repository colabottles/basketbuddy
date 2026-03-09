export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const startY = ref(0)
  const pulling = ref(false)
  const pullDistance = ref(0)
  const refreshing = ref(false)
  const THRESHOLD = 80

  const onTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0 && e.touches[0]) {
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
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd)
  })

  onUnmounted(() => {
    document.removeEventListener('touchstart', onTouchStart)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onTouchEnd)
  })

  return { pullDistance, refreshing, THRESHOLD }
}