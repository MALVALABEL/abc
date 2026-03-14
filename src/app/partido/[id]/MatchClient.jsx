'use client';
import useMatchData from '@/hooks/useMatchData';
import useReservation from '@/hooks/useReservation';
import Header from '@/components/ui/Header';
import MatchHeader from '@/components/match/MatchHeader';
import SlotCounter from '@/components/match/SlotCounter';
import ReservationForm from '@/components/match/ReservationForm';
import ReservationStatus from '@/components/match/ReservationStatus';
import MatchClosed from '@/components/match/MatchClosed';
import PaymentInfo from '@/components/match/PaymentInfo';
import Spinner from '@/components/ui/Spinner';

export default function MatchClient({ initialMatch }) {
  const { match, refresh: refreshMatch } = useMatchData(initialMatch._id, initialMatch);
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

  const handleReserve = async (name, phone) => {
    const result = await reserve(name, phone);
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
          <MatchClosed />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <PaymentInfo match={match} />
            <ReservationForm onReserve={handleReserve} />
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
