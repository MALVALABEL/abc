import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { loginAdmin } from '@/helpers/auth';

export async function POST(request) {
  await dbConnect();
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Usuario y contrasena requeridos' }, { status: 400 });
  }

  const result = await loginAdmin(username, password);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const response = NextResponse.json({
    success: true,
    role: result.admin.role,
    name: result.admin.name,
  });

  response.cookies.set('admin_token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
