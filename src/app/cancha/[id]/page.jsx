import VenueDetail from './VenueDetail';

export default function VenuePage({ params }) {
  return <VenueDetail venueId={params.id} />;
}
