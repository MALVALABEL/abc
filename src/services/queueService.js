export async function getQueue(matchId) {
  const res = await fetch(`/api/queue?matchId=${matchId}`);
  if (!res.ok) throw new Error('Error al cargar cola');
  return res.json();
}

export async function joinQueue(matchId, data) {
  const res = await fetch('/api/queue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId, ...data }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al unirse a la cola');
  return json;
}
