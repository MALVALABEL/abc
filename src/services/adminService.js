export async function login(password) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error('Password incorrecto');
  return res.json();
}

export async function getMatchReservations(matchId) {
  const res = await fetch(`/api/matches/${matchId}/reservations`);
  if (!res.ok) throw new Error('Error al cargar reservas');
  return res.json();
}

export async function approveReservation(id) {
  const res = await fetch(`/api/reservations/${id}/approve`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al aprobar');
  return res.json();
}

export async function rejectReservation(id) {
  const res = await fetch(`/api/reservations/${id}/reject`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al rechazar');
  return res.json();
}
