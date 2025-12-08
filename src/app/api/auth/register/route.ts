// src/app/api/auth/register/route.ts

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ❗ เวอร์ชันชั่วคราว เพื่อให้ Vercel build ผ่านก่อน
export async function POST() {
  return new Response('Register route (temporary stub)', { status: 200 });
}

export async function GET() {
  return new Response('Register route (temporary stub GET)', { status: 200 });
}
