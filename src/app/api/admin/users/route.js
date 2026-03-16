import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import Admin from '@/models/Admin';
import { isAdmin, isSuperAdmin, getAdminFromRequest } from '@/helpers/auth';

export async function GET(request) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const requester = getAdminFromRequest(request);
  const query = requester?.role === 'superadmin' ? {} : { role: { $ne: 'superadmin' } };

  const admins = await Admin.find(query).select('-password').sort({ createdAt: -1 });
  return NextResponse.json(admins);
}

export async function POST(request) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const requester = getAdminFromRequest(request);
  const { username, password, name, role } = await request.json();

  if (!username || !password || !name) {
    return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
  }

  const exists = await Admin.findOne({ username });
  if (exists) {
    return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 });
  }

  // Non-superadmins can only create admin role
  const finalRole = requester?.role === 'superadmin' ? (role || 'admin') : 'admin';

  const hashed = await bcrypt.hash(password, 10);
  const admin = await Admin.create({
    username,
    password: hashed,
    name,
    role: finalRole,
  });

  const { password: _, ...safe } = admin.toObject();
  return NextResponse.json(safe, { status: 201 });
}
