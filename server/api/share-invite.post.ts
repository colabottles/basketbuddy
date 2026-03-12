import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const { recipientEmail, listName, senderEmail } = await readBody(event)

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
    subject: `${senderEmail} shared a grocery list with you`,
    html: `
      <p>Hi there,</p>
      <p><strong>${senderEmail}</strong> has shared their grocery list
      "<strong>${listName}</strong>" with you on BasketBuddy.</p>
      <p><a href="${config.public.appUrl}">Open BasketBuddy</a> and sign in
      with this email address to see the shared list.</p>
      <p>— The BasketBuddy Team</p>
    `,
  })

  return { ok: true }
})