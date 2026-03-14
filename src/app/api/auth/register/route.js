import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { registerUser } from '@/helpers/userAuth';
import { validateName, validatePhone } from '@/helpers/validators';

export async function POST(request) {
  await dbConnect();
  const { name, phone, password } = await request.json();

  const nameErr = validateName(name);
  if (nameErr) return NextResponse.json({ error: nameErr }, { status: 400 });

  const phoneErr = validatePhone(phone);
  if (phoneErr) return NextResponse.json({ error: phoneErr }, { status: 400 });

  if (!password || password.length < 4) {
    return NextResponse.json({ error: 'La contrasena debe tener al menos 4 caracteres' }, { status: 400 });
  }

  const result = await registerUser(name, phone, password);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  const response = NextResponse.json({
    user: { _id: result.user._id, name: result.user.name, phone: result.user.phone, balance: 0 },
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
