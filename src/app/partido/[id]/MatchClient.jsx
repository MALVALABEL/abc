'use client';
import useMatchData from '@/hooks/useMatchData';
import useReservation from '@/hooks/useReservation';
import useUser from '@/hooks/useUser';
import Header from '@/components/ui/Header';
import MatchHeader from '@/components/match/MatchHeader';
import SlotCounter from '@/components/match/SlotCounter';
import ReservationForm from '@/components/match/ReservationForm';
import ReservationStatus from '@/components/match/ReservationStatus';
import MatchClosed from '@/components/match/MatchClosed';
import QueueSection from '@/components/match/QueueSection';
import PaymentInfo from '@/components/match/PaymentInfo';
import Spinner from '@/components/ui/Spinner';

export default function MatchClient({ initialMatch }) {
  const { match, refresh: refreshMatch } = useMatchData(initialMatch._id, initialMatch);
  const { user } = useUser();
  const {
    reservation,
    loading: resLoading,
    error,
    reserve,
    cancel,
    uploadReceipt,
    refresh: refreshRes,
  } = useReservation(initialMatch._id);

  if (!match) return <Spinner />;

  const handleReserve = async (name, phone, isGoalkeeper, payWithWallet) => {
    const result = await reserve(name, phone, isGoalkeeper, payWithWallet);
    if (result) refreshMatch();
  };

  const handleCancel = async () => {
    await cancel();
    refreshMatch();
  };

  const handleExpired = () => {
    refreshRes();
    refreshMatch();
  };

  const isFull = match.availableSlots <= 0;
  const hasPending = (match.reservations || []).some((r) =>
    ['pending_payment', 'payment_uploaded'].includes(r.status)
  );
  const showQueue = isFull && hasPending;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto px-4 py-6 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <MatchHeader match={match} />
          <SlotCounter match={match} />
        </div>

        {resLoading ? (
          <Spinner size="sm" />
        ) : reservation ? (
          <ReservationStatus
            reservation={reservation}
            match={match}
            onUpload={uploadReceipt}
            onCancel={handleCancel}
            onExpired={handleExpired}
          />
        ) : isFull ? (
          <>
            <MatchClosed />
            {showQueue && <QueueSection matchId={match._id} user={user} />}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <PaymentInfo match={match} />
            <ReservationForm
              onReserve={handleReserve}
              user={user}
              matchPrice={match.pricePerSlot || 0}
            />
          </div>
        )}

        {error && (
          <p className="text-center text-sm text-red-500 bg-red-50 p-3 rounded-xl">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
