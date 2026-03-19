'use client';
import { useState, useEffect, useRef } from 'react';
import { listVenues, updateVenue, uploadVenueImage } from '@/services/venueService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function VenueManagement() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVenues = () => {
    listVenues()
      .then(setVenues)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchVenues(); }, []);

  if (loading) return <p className="text-sm text-gray-400">Cargando canchas...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-brand-600">Gestionar canchas</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <VenueCard key={venue._id} venue={venue} onUpdate={fetchVenues} />
        ))}
      </div>
    </div>
  );
}

function VenueCard({ venue, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(venue.name);
  const [schedule, setSchedule] = useState(venue.schedule);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadVenueImage(venue._id, file);
      onUpdate();
    } catch (err) {
      alert(err.message);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateVenue(venue._id, { name, schedule });
      setEditing(false);
      onUpdate();
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="relative h-36">
        <img
          src={venue.imageUrl}
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-600 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
        >
          {uploading ? 'Subiendo...' : 'Cambiar foto'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="p-4 space-y-3">
        {editing ? (
          <>
            <Input
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Horario"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="brand" loading={saving} onClick={handleSave}>
                Guardar
              </Button>
              <button
                onClick={() => { setEditing(false); setName(venue.name); setSchedule(venue.schedule); }}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <h4 className="font-bold text-brand-600">{venue.name}</h4>
            <p className="text-xs text-gray-500">{venue.schedule || 'Sin horario'}</p>
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-accent-500 font-medium hover:text-accent-600"
            >
              Editar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
