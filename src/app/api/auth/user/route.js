import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { loginUser } from '@/helpers/userAuth';

export async function POST(request) {
  await dbConnect();
  const { phone, password } = await request.json();

  if (!phone || !password) {
    return NextResponse.json({ error: 'Telefono y contrasena son obligatorios' }, { status: 400 });
  }

  const result = await loginUser(phone, password);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const response = NextResponse.json({
    user: {
      _id: result.user._id,
      name: result.user.name,
      phone: result.user.phone,
      balance: result.user.balance,
    },
  });

  response.cookies.set('user_token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  return response;
}
