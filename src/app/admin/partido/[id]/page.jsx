import AdminMatchDetail from './AdminMatchDetail';

export default function AdminPartidoPage({ params }) {
  return <AdminMatchDetail matchId={params.id} />;
}
