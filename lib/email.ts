import nodemailer from 'nodemailer'
import { prisma } from './prisma'

interface EmailConfig {
  host: string
  port: number
  user: string
  pass: string
  secure?: boolean
  from?: string
  fromName?: string
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

/**
 * Get email configuration from database settings
 * @returns EmailConfig or null if not configured
 */
export async function getEmailConfigFromDB(): Promise<EmailConfig | null> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'site_settings_singleton' },
      select: {
        smtpHost: true,
        smtpPort: true,
        smtpUsername: true,
        smtpPassword: true,
        smtpSecure: true,
      },
    })

    if (
      !settings?.smtpHost ||
      typeof settings.smtpPort !== 'number' ||
      !settings.smtpUsername ||
      !settings.smtpPassword
    ) {
      return null
    }

    return {
      host: settings.smtpHost,
      port: settings.smtpPort,
      user: settings.smtpUsername,
      pass: settings.smtpPassword,
      from: settings.smtpUsername,
      secure: settings.smtpSecure ?? false,
    }
  } catch (error) {
    console.error('Error loading email config from database:', error)
    return null
  }
}

/**
 * Get email configuration from environment variables
 * @throws Error if required environment variables are missing
 */
export function getEmailConfigFromEnv(): EmailConfig {
  const missing: string[] = []

  if (!process.env.EMAIL_HOST) missing.push('EMAIL_HOST')
  if (!process.env.EMAIL_PORT) missing.push('EMAIL_PORT')
  if (!process.env.EMAIL_USER) missing.push('EMAIL_USER')
  if (!process.env.EMAIL_PASS) missing.push('EMAIL_PASS')

  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(', ')}`)
  }

  const port = Number(process.env.EMAIL_PORT)
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('EMAIL_PORT must be a valid number')
  }

  return {
    host: process.env.EMAIL_HOST!,
    port,
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
    from: process.env.EMAIL_FROM,
    fromName: process.env.EMAIL_FROM_NAME,
  }
}

/**
 * Get email configuration, preferring database settings over environment variables
 * @returns EmailConfig
 * @throws Error if no configuration is available
 */
export async function getEmailConfig(): Promise<EmailConfig> {
  // Try database settings first
  const dbConfig = await getEmailConfigFromDB()
  if (dbConfig) {
    return dbConfig
  }

  // Fall back to environment variables
  try {
    return getEmailConfigFromEnv()
  } catch (envError) {
    throw new Error(
      'Email not configured. Please configure SMTP settings in Admin Settings or set EMAIL_* environment variables.'
    )
  }
}

export async function sendEmail(config: EmailConfig, options: EmailOptions) {
  try {
    if (process.env.NEXT_RUNTIME === 'edge') {
      throw new Error('SMTP transport is not supported in the Edge runtime. Use a Node.js runtime or provider API.')
    }

    const missing: string[] = []
    if (!config.host) missing.push('host')
    if (!config.port) missing.push('port')
    if (!config.user) missing.push('user')
    if (!config.pass) missing.push('pass')
    if (missing.length > 0) {
      throw new Error(`Missing email configuration: ${missing.join(', ')}`)
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure ?? config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass
      }
    })

    const fromAddress = config.from || config.user
    const fromName = config.fromName || 'Kashi Kweyu'

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo
    })

    if (process.env.NODE_ENV !== 'production') {
      console.log('Email sent:', {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected,
      })
    }

    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    }
  } catch (error: any) {
    const rawMessage = error?.message || 'Failed to send email'
    let friendlyMessage = rawMessage

    if (
      error?.code === 'EAUTH' ||
      error?.responseCode === 535 ||
      /auth|authentication|invalid login|bad credentials/i.test(rawMessage)
    ) {
      friendlyMessage = 'Authentication failed'
    } else if (
      error?.code === 'ENOTFOUND' ||
      /getaddrinfo|host not found/i.test(rawMessage)
    ) {
      friendlyMessage = 'SMTP host not found'
    } else if (
      error?.code === 'ECONNECTION' ||
      error?.code === 'ETIMEDOUT' ||
      /connect|timed out/i.test(rawMessage)
    ) {
      friendlyMessage = 'Unable to connect to SMTP server'
    }

    console.error('Email error:', error)
    return {
      success: false,
      error: friendlyMessage,
      details: error
    }
  }
}

type EmailTemplateType =
  | 'test'
  | 'request-accepted'
  | 'request-rejected'
  | 'license-issued'
  | 'license-revoked'
  | 'license-suspended'
  | 'license-abuse-detected'
  | 'license-seat-assigned'
  | 'license-seat-revoked'
  | 'download-reset-approved'
  | 'download-reset-rejected'

export function getEmailTemplate(type: EmailTemplateType, data?: any) {
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
    },
    'license-issued': {
      subject: 'Your License Has Been Issued',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #10b981;">License Issued</h1>
          <p>Your ${data?.licenseType} license for <strong>${data?.productName}</strong> has been issued.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>License Key:</strong></p>
            <code style="font-size: 16px; color: #1f2937;">${data?.licenseKey}</code>
          </div>
          <p>You can download your product and manage your license from your dashboard.</p>
          ${data?.licenseType === 'TEAM' ? `<p><strong>Team License:</strong> You can assign up to ${data?.maxUsers} seats to team members.</p>` : ''}
          <p>Best regards,<br>Kashi Kweyu</p>
        </div>
      `
    },
    'license-revoked': {
      subject: 'License Revoked',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #ef4444;">License Revoked</h1>
          <p>Your license for <strong>${data?.productName}</strong> has been revoked.</p>
          ${data?.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
          <p>License Key: <code>${data?.licenseKey}</code></p>
          <p>If you believe this is an error, contact support.</p>
          <p>Best regards,<br>Kashi Kweyu</p>
        </div>
      `
    },
    'license-suspended': {
      subject: 'License Suspended',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #f59e0b;">License Suspended</h1>
          <p>Your license for <strong>${data?.productName}</strong> has been suspended.</p>
          ${data?.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
          <p>License Key: <code>${data?.licenseKey}</code></p>
          <p>Downloads and usage are blocked until the issue is resolved.</p>
          <p>Contact support for assistance.</p>
          <p>Best regards,<br>Kashi Kweyu</p>
        </div>
      `
    },
    'license-abuse-detected': {
      subject: 'License Abuse Detected - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #ef4444;">Abuse Detected</h1>
          <p>Suspicious activity has been detected on your license for <strong>${data?.productName}</strong>.</p>
          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b;"><strong>Detected Issue:</strong> ${data?.abuseReason}</p>
          </div>
          <p>License Key: <code>${data?.licenseKey}</code></p>
          <p>Your license has been suspended pending review. If this is a false positive, contact support immediately.</p>
          <p>Best regards,<br>Kashi Kweyu</p>
        </div>
      `
    },
    'license-seat-assigned': {
      subject: 'You Have Been Assigned a License Seat',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #10b981;">License Seat Assigned</h1>
          <p>You have been assigned a seat on a team license for <strong>${data?.productName}</strong>.</p>
          <p>License Key: <code>${data?.licenseKey}</code></p>
          <p>You can now download and use this product. Access your license from your dashboard.</p>
          <p>Best regards,<br>Kashi Kweyu</p>
        </div>
      `
    },
    'license-seat-revoked': {
      subject: 'License Seat Revoked',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #ef4444;">License Seat Revoked</h1>
          <p>Your seat on the team license for <strong>${data?.productName}</strong> has been revoked.</p>
          <p>You no longer have access to this product.</p>
          <p>Best regards,<br>Kashi Kweyu</p>
        </div>
      `
    },
    'download-reset-approved': {
      subject: 'Download Reset Request Approved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #10b981;">Download Reset Approved</h1>
          <p>Your download reset request for <strong>${data?.productName}</strong> has been approved.</p>
          <p>Your download counter has been reset. You can now download the product again.</p>
          ${data?.notes ? `<p><strong>Admin Notes:</strong> ${data.notes}</p>` : ''}
          <p>Best regards,<br>Kashi Kweyu</p>
        </div>
      `
    },
    'download-reset-rejected': {
      subject: 'Download Reset Request Rejected',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #ef4444;">Download Reset Rejected</h1>
          <p>Your download reset request for <strong>${data?.productName}</strong> has been rejected.</p>
          ${data?.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
          <p>If you have questions, contact support.</p>
          <p>Best regards,<br>Kashi Kweyu</p>
        </div>
      `
    }
  }

  return templates[type]
}
