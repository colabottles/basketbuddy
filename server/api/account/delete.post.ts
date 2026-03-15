import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const { error } = await supabase.auth.admin.deleteUser(user.id)
  if (error) throw createError({ statusCode: 500, message: error.message })

  return { ok: true }
})