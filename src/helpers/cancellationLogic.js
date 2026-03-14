import Reservation from '@/models/Reservation';

const CANCEL_THRESHOLD = 3;

export async function getMonthlyCancellations(userId) {
  if (!userId) return 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return Reservation.countDocuments({
    userId,
    status: 'cancelled',
    cancelReason: { $ne: null },
    updatedAt: { $gte: startOfMonth },
  });
}

export function isFrequentCanceller(count) {
  return count >= CANCEL_THRESHOLD;
}

export { CANCEL_THRESHOLD };
