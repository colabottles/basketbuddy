import nodemailer from 'nodemailer'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (rateLimit(`share-invite:${ip}`, 10, 60_000)) {
    throw createError({ statusCode: 429, message: 'Too many requests, please try again later.' })
  }

  const { recipientEmail, listName, senderEmail } = await readBody(event)

  if (!recipientEmail || typeof recipientEmail !== 'string' || !EMAIL_REGEX.test(recipientEmail)) {
    throw createError({ statusCode: 400, message: 'Invalid recipient email' })
  }
  if (!senderEmail || typeof senderEmail !== 'string' || !EMAIL_REGEX.test(senderEmail)) {
    throw createError({ statusCode: 400, message: 'Invalid sender email' })
  }
  if (!listName || typeof listName !== 'string' || listName.trim().length === 0 || listName.length > 100) {
    throw createError({ statusCode: 400, message: 'Invalid list name' })
  }

  // Sanitize for HTML injection
  const safeListName = listName.replace(/[<>&"']/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;'
  }[c] ?? c))
  const safeSenderEmail = senderEmail.replace(/[<>&"']/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;'
  }[c] ?? c))

  const config = useRuntimeConfig()

  const transporter = nodemailer.createTransport({
    host: 'smtp.protonmail.ch',
    port: 587,
    secure: false,
    auth: {
      user: config.smtpUser,
      pass: config.smtpToken,
    },
  })

  await transporter.sendMail({
    from: `"BasketBuddy" <${config.smtpUser}>`,
    to: recipientEmail,
    subject: `${safeSenderEmail} shared a grocery list with you`,
    html: `
      <p>Hi there,</p>
      <p><strong>${safeSenderEmail}</strong> has shared their grocery list
      "<strong>${safeListName}</strong>" with you on BasketBuddy.</p>
      <p><a href="${config.public.appUrl}">Open BasketBuddy</a> and sign in
      with this email address to see the shared list.</p>
      <p>— The BasketBuddy Team</p>
    `,
  })

  return { ok: true }
})