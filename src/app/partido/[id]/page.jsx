import dbConnect from '@/lib/mongoose';
import Match from '@/models/Match';
import Reservation from '@/models/Reservation';
import MatchClient from './MatchClient';

export default async function PartidoPage({ params }) {
  await dbConnect();
  const match = await Match.findById(params.id).lean();

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Partido no encontrado</p>
      </div>
    );
  }

  const reservations = await Reservation.find({
    matchId: params.id,
    status: { $nin: ['cancelled', 'expired'] },
  })
    .select('playerName status')
    .lean();

  const matchData = {
    _id: match._id.toString(),
    title: match.title,
    date: match.date.toISOString(),
    time: match.time,
    location: match.location || '',
    maxSlots: match.maxSlots,
    reservedSlots: match.reservedSlots,
    pricePerSlot: match.pricePerSlot || 0,
    paymentInfo: match.paymentInfo || '',
    status: match.status,
    availableSlots: match.maxSlots - match.reservedSlots,
    reservations: reservations.map((r) => ({
      _id: r._id.toString(),
      playerName: r.playerName,
      status: r.status,
    })),
  };

  return <MatchClient initialMatch={matchData} />;
}
