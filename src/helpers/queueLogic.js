import QueueEntry from '@/models/QueueEntry';
import Match from '@/models/Match';
import Reservation from '@/models/Reservation';

const RESERVATION_TTL_MS = 10 * 60 * 1000;

export async function joinQueue(matchId, playerName, playerPhone, isGoalkeeper, userId) {
  const existing = await QueueEntry.findOne({
    matchId,
    playerPhone,
    status: 'waiting',
  });

  if (existing) {
    return { success: false, error: 'Ya estas en la cola para este partido' };
  }

  const lastEntry = await QueueEntry.findOne({ matchId })
    .sort({ position: -1 });
  const position = lastEntry ? lastEntry.position + 1 : 1;

  const entry = await QueueEntry.create({
    matchId,
    userId: userId || null,
    playerName: playerName.trim(),
    playerPhone: playerPhone.trim(),
    isGoalkeeper,
    position,
  });

  return { success: true, entry };
}

export async function getQueueForMatch(matchId) {
  return QueueEntry.find({
    matchId,
    status: 'waiting',
  }).sort({ position: 1 });
}

export async function getQueueCount(matchId) {
  return QueueEntry.countDocuments({
    matchId,
    status: 'waiting',
  });
}

export async function processQueue(matchId) {
  const nextInQueue = await QueueEntry.findOne({
    matchId,
    status: 'waiting',
  }).sort({ position: 1 });

  if (!nextInQueue) return { processed: false };

  const match = await Match.findOneAndUpdate(
    {
      _id: matchId,
      status: 'open',
      $expr: { $lt: ['$reservedSlots', '$maxSlots'] },
    },
    { $inc: { reservedSlots: 1 } },
    { new: true }
  );

  if (!match) return { processed: false };

  const reservation = await Reservation.create({
    matchId,
    userId: nextInQueue.userId || null,
    playerName: nextInQueue.playerName,
    playerPhone: nextInQueue.playerPhone,
    isGoalkeeper: nextInQueue.isGoalkeeper,
    status: 'pending_payment',
    expiresAt: new Date(Date.now() + RESERVATION_TTL_MS),
  });

  nextInQueue.status = 'reserved';
  await nextInQueue.save();

  return { processed: true, reservation, queueEntry: nextInQueue };
}

export async function cancelQueueEntry(entryId, phone) {
  const entry = await QueueEntry.findById(entryId);
  if (!entry) return { success: false, error: 'No encontrado en cola' };
  if (entry.playerPhone !== phone) {
    return { success: false, error: 'No autorizado' };
  }

  entry.status = 'cancelled';
  await entry.save();

  return { success: true };
}
