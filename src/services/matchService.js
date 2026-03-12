export async function getMatch(id) {
  const res = await fetch(`/api/matches/${id}`);
  if (!res.ok) throw new Error('Error al cargar partido');
  return res.json();
}

export async function listMatches() {
  const res = await fetch('/api/matches');
  if (!res.ok) throw new Error('Error al listar partidos');
  return res.json();
}

export async function createMatch(data) {
  const res = await fetch('/api/matches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al crear partido');
  }
  return res.json();
}
