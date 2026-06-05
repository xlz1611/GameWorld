import { NextResponse } from 'next/server'

const rateLimit = new Map()

const RATE_LIMIT_MAX = parseInt(process.env.API_RATE_LIMIT_MAX) || 100
const RATE_LIMIT_WINDOW = parseInt(process.env.API_RATE_LIMIT_WINDOW) || 900000

function getRateLimitKey(request) {
  const ip = request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `${ip}-${userAgent}`
}

function checkRateLimit(key) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW
  
  let requests = rateLimit.get(key) || []
  
  requests = requests.filter(timestamp => timestamp > windowStart)
  
  if (requests.length >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: requests[0] + RATE_LIMIT_WINDOW
    }
  }
  
  requests.push(now)
  rateLimit.set(key, requests)
  
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - requests.length,
    resetAt: now + RATE_LIMIT_WINDOW
  }
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

function validateHeaders(request) {
  const contentType = request.headers.get('content-type')
  
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
    // 允许文件上传的multipart/form-data请求
    if (!contentType || (!contentType.includes('application/json') && !contentType.includes('multipart/form-data'))) {
      return false
    }
  }
  
  return true
}

export async function middleware(request) {
  const url = new URL(request.url)
  
  if (url.pathname.startsWith('/api/')) {
    const rateLimitKey = getRateLimitKey(request)
    const rateLimitResult = checkRateLimit(rateLimitKey)
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: '请求过于频繁，请稍后再试',
          resetAt: rateLimitResult.resetAt
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString()
          }
        }
      )
    }
    
    if (!validateHeaders(request)) {
      return new Response(
        JSON.stringify({ error: '无效的请求头' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    const response = NextResponse.next()
    
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString())
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetAt.toString())
    
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
