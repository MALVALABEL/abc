import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '@/models/Admin';
import dbConnect from '@/lib/mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export async function ensureSuperAdmin() {
  const exists = await Admin.findOne({ role: 'superadmin' });
  if (!exists) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await Admin.create({
      username: 'superadmin',
      password: hashed,
      name: 'Super Admin',
      role: 'superadmin',
    });
  }
}

export async function loginAdmin(username, password) {
  await dbConnect();
  await ensureSuperAdmin();

  const admin = await Admin.findOne({ username, active: true });
  if (!admin) {
    return { success: false, error: 'Usuario o contrasena incorrectos' };
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return { success: false, error: 'Usuario o contrasena incorrectos' };
  }

  const token = generateToken(admin._id, admin.role, admin.name);
  return { success: true, admin, token };
}

export function generateToken(adminId, role = 'admin', name = '') {
  return jwt.sign({ adminId, role, name, isAdmin: true }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const cookie = request.cookies?.get('admin_token')?.value;
  if (cookie) return cookie;

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

export function isAdmin(request) {
  const token = getTokenFromRequest(request);
  if (!token) return false;
  return verifyToken(token) !== null;
}

export function isSuperAdmin(request) {
  const token = getTokenFromRequest(request);
  if (!token) return false;
  const decoded = verifyToken(token);
  return decoded?.role === 'superadmin';
}

export function getAdminFromRequest(request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
