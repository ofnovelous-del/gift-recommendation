// src/app/api/auth/[...nextauth]/route.ts

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ❗ เวอร์ชันชั่วคราวเพื่อให้ deploy ผ่าน
// ยังไม่ใช้ NextAuth จริง ๆ
export async function GET() {
  return new Response('Auth route GET (temporary stub)', { status: 200 });
}

export async function POST() {
  return new Response('Auth route POST (temporary stub)', { status: 200 });
}
