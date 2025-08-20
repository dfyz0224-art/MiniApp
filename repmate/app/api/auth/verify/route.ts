// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'

function verifyInitData(initData: string, botToken: string) {
  const url = new URLSearchParams(initData)
  const hash = url.get('hash') || ''
  url.delete('hash')

  const data_check_string = Array.from(url.entries())
    .map(([k, v]) => `${k}=${v}`)
    .sort()
    .join('\n')

  const secret_key = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest()

  const signature = crypto
    .createHmac('sha256', secret_key)
    .update(data_check_string)
    .digest('hex')

  return signature === hash
}

export async function POST(req: NextRequest) {
  const { initData } = await req.json()
  const ok = verifyInitData(initData, process.env.BOT_TOKEN!)
  return NextResponse.json({ ok })
}
