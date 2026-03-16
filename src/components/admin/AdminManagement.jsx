'use client';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', name: '' });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAdmins = () => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAdmins(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setForm({ username: '', password: '', name: '' });
      setShowForm(false);
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const toggleActive = async (id, active) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    fetchAdmins();
  };

  const deleteAdmin = async (id) => {
    if (!confirm('Eliminar este administrador?')) return;
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    fetchAdmins();
  };

  const changePassword = async (id) => {
    const newPass = prompt('Nueva contrasena:');
    if (!newPass || newPass.length < 4) {
      if (newPass !== null) alert('La contrasena debe tener al menos 4 caracteres');
      return;
    }
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword: newPass }),
    });
    if (res.ok) {
      alert('Contrasena actualizada');
    } else {
      const json = await res.json();
      alert(json.error || 'Error al cambiar contrasena');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-brand-600">Administradores</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 gradient-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          {showForm ? 'Cancelar' : '+ Nuevo admin'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" />
          <Input label="Usuario" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Nombre de usuario" />
          <Input label="Contrasena" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Contrasena" />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" variant="brand" loading={saving}>Crear administrador</Button>
        </form>
      )}

      <div className="space-y-3">
        {admins.map((admin) => (
          <div key={admin._id} className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${admin.active ? 'bg-brand-50 text-brand-500' : 'bg-gray-100 text-gray-400'}`}>
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{admin.name}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                      ADMIN
                    </span>
                    {!admin.active && (
                      <span className="text-[10px] font-bold bg-red-50 text-red-500 px-1.5 py-0.5 rounded-full">
                        INACTIVO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">@{admin.username}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => changePassword(admin._id)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
              >
                Cambiar contrasena
              </button>
              <button
                onClick={() => toggleActive(admin._id, admin.active)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  admin.active
                    ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {admin.active ? 'Desactivar' : 'Activar'}
              </button>
              <button
                onClick={() => deleteAdmin(admin._id)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
