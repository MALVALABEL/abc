const DAYS = [
  'Domingo', 'Lunes', 'Martes', 'Miercoles',
  'Jueves', 'Viernes', 'Sabado',
];

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export function formatMatchDay(dateStr) {
  const d = new Date(dateStr);
  const day = DAYS[d.getDay()];
  const num = d.getDate();
  const month = MONTHS[d.getMonth()];
  return `${day} ${num} de ${month}`;
}

export function isMatchPast(dateStr, timeStr) {
  const d = new Date(dateStr);
  const [hours, minutes] = (timeStr || '23:59').split(':').map(Number);
  d.setHours(hours, minutes, 0, 0);
  return d < new Date();
}

export function filterUpcomingMatches(matches) {
  return matches.filter((m) => {
    if (m.status !== 'open') return false;
    return !isMatchPast(m.date, m.time);
  });
}

export function groupMatchesByVenue(matches, venues) {
  const grouped = {};
  venues.forEach((v) => {
    grouped[v.name] = [];
  });
  matches.forEach((m) => {
    const loc = m.location || '';
    const venueKey = Object.keys(grouped).find(
      (name) => loc.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(loc.toLowerCase())
    );
    if (venueKey) {
      grouped[venueKey].push(m);
    }
  });
  return grouped;
}
