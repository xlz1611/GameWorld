import prisma from '../../lib/prisma'
import { generateCode, storeCode } from '../../lib/verificationCode'
import { sendVerificationEmail } from '../../lib/mailService'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: '请输入邮箱地址' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: '邮箱格式不正确' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: '该邮箱已被注册' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const code = generateCode()
    const storeResult = storeCode(email, code)

    if (!storeResult.success) {
      return new Response(
        JSON.stringify({ error: storeResult.error, cooldown: storeResult.cooldown }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const mailResult = await sendVerificationEmail(email, code)

    if (!mailResult.success) {
      return new Response(
        JSON.stringify({ error: mailResult.error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '验证码已发送',
        dev: mailResult.dev || false,
        devCode: mailResult.dev ? mailResult.code : undefined
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('发送验证码失败:', error)
    return new Response(
      JSON.stringify({ error: '发送验证码失败，请稍后重试' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
