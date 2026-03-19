import Match from '@/models/Match';

export async function createMatch(data) {
  const match = await Match.create({
    title: data.title,
    date: new Date(data.date + 'T12:00:00'),
    time: data.time,
    location: data.location || '',
    maxSlots: parseInt(data.maxSlots, 10),
    pricePerSlot: parseInt(data.pricePerSlot || 0, 10),
    paymentInfo: data.paymentInfo || '',
    status: 'open',
  });
  return match;
}

export async function listMatches(filter = {}) {
  return Match.find(filter).sort({ date: -1 });
}

export async function getMatch(id) {
  return Match.findById(id);
}
