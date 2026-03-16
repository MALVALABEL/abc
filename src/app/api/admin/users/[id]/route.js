import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Admin from '@/models/Admin';
import { isSuperAdmin } from '@/helpers/auth';

export async function PUT(request, { params }) {
  await dbConnect();
  if (!isSuperAdmin(request)) {
    return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
  }

  const { active } = await request.json();
  const admin = await Admin.findByIdAndUpdate(
    params.id,
    { active },
    { new: true }
  ).select('-password');

  if (!admin) {
    return NextResponse.json({ error: 'Admin no encontrado' }, { status: 404 });
  }

  return NextResponse.json(admin);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  if (!isSuperAdmin(request)) {
    return NextResponse.json({ error: 'Solo superadmin' }, { status: 403 });
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
