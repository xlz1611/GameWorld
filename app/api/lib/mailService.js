import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  const { MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER, MAIL_PASS } = process.env

  if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
    return null
  }

  transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: parseInt(MAIL_PORT || '465'),
    secure: MAIL_SECURE === 'true',
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS
    }
  })

  return transporter
}

export async function sendVerificationEmail(email, code) {
  const mailTransporter = getTransporter()

  if (!mailTransporter) {
    console.log(`[开发模式] 验证码: ${code}, 邮箱: ${email}`)
    return { success: true, dev: true, code }
  }

  const from = process.env.MAIL_FROM || `"GameHub" <${process.env.MAIL_USER}>`

  try {
    await mailTransporter.sendMail({
      from,
      to: email,
      subject: 'GameHub 注册验证码',
      html: `
        <div style="max-width:480px;margin:0 auto;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="background:#1E293B;border-radius:16px;overflow:hidden;border:1px solid #334155;">
            <div style="background:linear-gradient(135deg,#6366F1,#8B5CF6);padding:32px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">GameHub</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">邮箱验证</p>
            </div>
            <div style="padding:32px;text-align:center;">
              <p style="color:#94A3B8;margin:0 0 24px;font-size:14px;">您正在注册 GameHub 账号，验证码为：</p>
              <div style="background:#0F172A;border-radius:12px;padding:20px;margin:0 auto;max-width:240px;">
                <span style="font-size:36px;font-weight:bold;color:#8B5CF6;letter-spacing:8px;">${code}</span>
              </div>
              <p style="color:#64748B;margin:24px 0 0;font-size:12px;">验证码 5 分钟内有效，请勿泄露给他人</p>
            </div>
            <div style="padding:16px 32px;border-top:1px solid #334155;text-align:center;">
              <p style="color:#475569;margin:0;font-size:12px;">如果这不是您的操作，请忽略此邮件</p>
            </div>
          </div>
        </div>
      `
    })

    return { success: true }
  } catch (error) {
    console.error('发送邮件失败:', error)
    return { success: false, error: '邮件发送失败，请稍后重试' }
  }
}
