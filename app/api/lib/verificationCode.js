const verificationCodes = new Map()

const CODE_EXPIRY = 5 * 60 * 1000
const CODE_COOLDOWN = 60 * 1000
const MAX_ATTEMPTS = 5
const MAX_CODES_PER_HOUR = 10

function cleanupExpired() {
  const now = Date.now()
  for (const [key, value] of verificationCodes) {
    if (now - value.createdAt > CODE_EXPIRY) {
      verificationCodes.delete(key)
    }
  }
}

setInterval(cleanupExpired, 60 * 1000)

export function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function storeCode(email, code) {
  const now = Date.now()
  const existing = verificationCodes.get(email)

  if (existing && now - existing.lastSentAt < CODE_COOLDOWN) {
    const remaining = Math.ceil((CODE_COOLDOWN - (now - existing.lastSentAt)) / 1000)
    return { success: false, error: `请${remaining}秒后再试`, cooldown: remaining }
  }

  if (existing && existing.sendCount >= MAX_CODES_PER_HOUR) {
    const hourAgo = now - 60 * 60 * 1000
    if (existing.lastSentAt > hourAgo) {
      return { success: false, error: '发送次数过多，请稍后再试' }
    }
  }

  verificationCodes.set(email, {
    code,
    createdAt: now,
    lastSentAt: now,
    attempts: 0,
    verified: false,
    sendCount: (existing?.sendCount || 0) + 1
  })

  return { success: true }
}

export function verifyCode(email, inputCode) {
  const record = verificationCodes.get(email)

  if (!record) {
    return { success: false, error: '验证码已过期，请重新获取' }
  }

  const now = Date.now()
  if (now - record.createdAt > CODE_EXPIRY) {
    verificationCodes.delete(email)
    return { success: false, error: '验证码已过期，请重新获取' }
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    verificationCodes.delete(email)
    return { success: false, error: '验证次数过多，请重新获取验证码' }
  }

  record.attempts++

  if (record.code !== inputCode) {
    const remaining = MAX_ATTEMPTS - record.attempts
    return { success: false, error: `验证码错误，还剩${remaining}次机会` }
  }

  record.verified = true
  return { success: true }
}

export function isEmailVerified(email) {
  const record = verificationCodes.get(email)
  if (!record || !record.verified) return false
  if (Date.now() - record.createdAt > CODE_EXPIRY) {
    verificationCodes.delete(email)
    return false
  }
  return true
}

export function clearVerification(email) {
  verificationCodes.delete(email)
}
