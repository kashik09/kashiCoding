import nodemailer from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  user: string
  pass: string
}

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail(config: EmailConfig, options: EmailOptions) {
  try {
    const transporter = nodemailer.createTransporter({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass
      }
    })

    const info = await transporter.sendMail({
      from: `"Kashi Kweyu" <${config.user}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    })

    return {
      success: true,
      messageId: info.messageId
    }
  } catch (error: any) {
    console.error('Email error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send email'
    }
  }
}

export function getEmailTemplate(type: 'test' | 'request-accepted' | 'request-rejected', data?: any) {
  const templates = {
    test: {
      subject: 'Test Email from Your Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Test Email</h1>
          <p>This is a test email from your portfolio website. Your email configuration is working correctly!</p>
          <p style="color: #666; font-size: 14px;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `
    },
    'request-accepted': {
      subject: 'Your Project Request Has Been Accepted!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10b981;">Request Accepted!</h1>
          <p>Hi ${data?.name},</p>
          <p>Great news! I've reviewed your project request and I'm excited to work with you.</p>
          ${data?.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
          <p>I'll be in touch soon to discuss the next steps.</p>
          <p>Best regards,<br>Kashi Kweyu</p>
        </div>
      `
    },
    'request-rejected': {
      subject: 'Update on Your Project Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ef4444;">Request Update</h1>
          <p>Hi ${data?.name},</p>
          <p>Thank you for your interest in working together. Unfortunately, I'm unable to take on your project at this time.</p>
          ${data?.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
          <p>I appreciate you reaching out and wish you the best with your project.</p>
          <p>Best regards,<br>Kashi Kweyu</p>
        </div>
      `
    }
  }

  return templates[type]
}
