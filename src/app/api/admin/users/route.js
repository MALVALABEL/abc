import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import Admin from '@/models/Admin';
import { isSuperAdmin } from '@/helpers/auth';

export async function GET(request) {
  await dbConnect();
  if (!isSuperAdmin(request)) {
    return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
  }

  const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
  return NextResponse.json(admins);
}

export async function POST(request) {
  await dbConnect();
  if (!isSuperAdmin(request)) {
    return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
  }

  const { username, password, name, role } = await request.json();

  if (!username || !password || !name) {
    return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
  }

  const exists = await Admin.findOne({ username });
  if (exists) {
    return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    username,
    password: hashed,
    name,
    role: role || 'admin',
  });

  const { password: _, ...safe } = admin.toObject();
  return NextResponse.json(safe, { status: 201 });
}
