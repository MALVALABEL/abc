export async function registerUser(name, phone, password) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al registrar');
  return json;
}

export async function loginUser(phone, password) {
  const res = await fetch('/api/auth/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al ingresar');
  return json;
}

export async function getMe() {
  const res = await fetch('/api/users/me');
  if (!res.ok) return null;
  return res.json();
}

export async function updatePreferences(data) {
  const res = await fetch('/api/users/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar');
  return res.json();
}

export async function logoutUser() {
  document.cookie = 'user_token=; path=/; max-age=0';
}
