import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import Admin from '@/models/Admin';
import { isAdmin, isSuperAdmin, getAdminFromRequest } from '@/helpers/auth';

export async function PUT(request, { params }) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const data = await request.json();
  const update = {};

  if (data.active !== undefined && isSuperAdmin(request)) {
    update.active = data.active;
  }

  if (data.newPassword) {
    const caller = getAdminFromRequest(request);
    const isSelf = caller?.adminId === params.id;
    const isSA = caller?.role === 'superadmin';

    if (!isSelf && !isSA) {
      return NextResponse.json({ error: 'Solo puedes cambiar tu propia contrasena' }, { status: 403 });
    }

    update.password = await bcrypt.hash(data.newPassword, 10);
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 });
  }

  const admin = await Admin.findByIdAndUpdate(params.id, update, { new: true }).select('-password');

  if (!admin) {
    return NextResponse.json({ error: 'Admin no encontrado' }, { status: 404 });
  }

  return NextResponse.json(admin);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const admin = await Admin.findById(params.id);
  if (!admin) {
    return NextResponse.json({ error: 'Admin no encontrado' }, { status: 404 });
  }
  if (admin.role === 'superadmin') {
    return NextResponse.json({ error: 'No se puede eliminar al superadmin' }, { status: 400 });
  }

  await Admin.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Admin eliminado' });
}
