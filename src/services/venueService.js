export async function listVenues() {
  const res = await fetch('/api/venues');
  if (!res.ok) throw new Error('Error cargando canchas');
  return res.json();
}

export async function updateVenue(id, data) {
  const res = await fetch(`/api/venues/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error actualizando cancha');
  return res.json();
}

export async function uploadVenueImage(id, file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`/api/venues/${id}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Error subiendo imagen');
  return res.json();
}
