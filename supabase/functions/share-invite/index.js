import { createClient } from 'jsr:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const APP_URL = Deno.env.get('APP_URL') ?? 'https://basketbuddyapp.netlify.app'

Deno.serve(async (req) => {
  try {
    const payload = await req.json()

    const record = payload.record
    const { invited_email, list_id } = record

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: list } = await supabase
      .from('lists')
      .select('name, owner_id')
      .eq('id', list_id)
      .single()

    const { data: owner } = await supabase.auth.admin.getUserById(list.owner_id)
    const senderEmail = owner?.user?.email ?? 'Someone'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BasketBuddy <noreply@yourdomain.com>',
        to: invited_email,
        subject: `${senderEmail} shared a grocery list with you`,
        html: `
          <p>Hi there,</p>
          <p><strong>${senderEmail}</strong> has shared their grocery list
          "<strong>${list.name}</strong>" with you on BasketBuddy.</p>
          <p><a href="${APP_URL}">Open BasketBuddy</a> and sign in with
          this email address to see the shared list.</p>
          <p>— The BasketBuddy Team</p>
        `,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Resend error: ${error}`)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const error = err as Error
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})