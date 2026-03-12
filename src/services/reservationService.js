export async function createReservation(matchId, data) {
  const res = await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId, ...data }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al reservar');
  return json;
}

export async function getReservation(id) {
  const res = await fetch(`/api/reservations/${id}`);
  if (!res.ok) throw new Error('Reserva no encontrada');
  return res.json();
}

export async function cancelReservation(id) {
  const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || 'Error al cancelar');
  }
  return res.json();
}

export async function uploadReceipt(id, file) {
  const formData = new FormData();
  formData.append('receipt', file);
  const res = await fetch(`/api/reservations/${id}/receipt`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al subir comprobante');
  return json;
}
