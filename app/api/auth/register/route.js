import prisma from '../../lib/prisma'
import bcrypt from 'bcrypt'
import { verifyCode, clearVerification } from '../../lib/verificationCode'

export async function POST(request) {
  try {
    const { name, email, password, verificationCode } = await request.json()

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: '请填写完整的注册信息' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!verificationCode) {
      return new Response(
        JSON.stringify({ error: '请输入邮箱验证码' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const verifyResult = verifyCode(email, verificationCode)
    if (!verifyResult.success) {
      return new Response(
        JSON.stringify({ error: verifyResult.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: '密码长度至少为6位' }),
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

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user'
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true
      }
    })

    clearVerification(email)

    return new Response(
      JSON.stringify({ success: true, user }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('注册错误:', error)
    return new Response(
      JSON.stringify({ error: '注册失败，请稍后重试' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
