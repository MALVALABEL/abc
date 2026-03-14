import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export async function registerUser(name, phone, password) {
  const existing = await User.findOne({ phone });
  if (existing) {
    return { success: false, error: 'Ya existe una cuenta con este telefono' };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    phone: phone.trim(),
    password: hashed,
  });

  const token = generateUserToken(user._id);
  return { success: true, user, token };
}

export async function loginUser(phone, password) {
  const user = await User.findOne({ phone });
  if (!user) {
    return { success: false, error: 'Telefono o contrasena incorrectos' };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { success: false, error: 'Telefono o contrasena incorrectos' };
  }

  const token = generateUserToken(user._id);
  return { success: true, user, token };
}

export function generateUserToken(userId) {
  return jwt.sign({ userId, role: 'user' }, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyUserToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'user') return null;
    return decoded;
  } catch {
    return null;
  }
}

export function getUserIdFromRequest(request) {
  const cookie = request.cookies?.get('user_token')?.value;
  if (!cookie) return null;
  const decoded = verifyUserToken(cookie);
  return decoded?.userId || null;
}
