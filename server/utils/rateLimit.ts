const requests = new Map<string, { count: number; resetAt: number }>()

export const rateLimit = (key: string, limit: number, windowMs: number) => {
  const now = Date.now()
  const entry = requests.get(key)

  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (entry.count >= limit) {
    return true // rate limited
  }

  entry.count++
  return false
}