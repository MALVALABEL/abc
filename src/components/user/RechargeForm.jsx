'use client';
import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { requestRecharge } from '@/services/walletService';
import { validateFile } from '@/helpers/validators';

export default function RechargeForm({ onComplete }) {
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    const err = validateFile(selected);
    if (err) { setError(err); return; }
    setError(null);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseInt(amount) <= 0) {
      setError('Ingresa un monto valido');
      return;
    }
    if (!file) {
      setError('Adjunta el comprobante de transferencia');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await requestRecharge(parseInt(amount), file);
      setSuccess(true);
      setTimeout(onComplete, 2000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 text-center space-y-2">
        <svg className="w-10 h-10 mx-auto text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-semibold text-emerald-800">Recarga enviada</p>
        <p className="text-sm text-emerald-600">El admin verificara tu comprobante y se acreditara tu saldo.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <h3 className="font-semibold text-brand-600 text-sm">Recargar billetera</h3>
      <Input
        label="Monto a recargar (COP)"
        type="number"
        min="1000"
        step="1000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Ej: 50000"
      />
      <div>
        <p className="text-sm text-gray-600 font-medium mb-2">Comprobante de transferencia</p>
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center cursor-pointer hover:border-brand-400 transition-all"
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="Comprobante" className="max-h-32 mx-auto rounded-lg" />
          ) : (
            <p className="text-sm text-gray-400 py-3">Toca para seleccionar imagen</p>
          )}
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button type="submit" loading={loading}>
        Enviar recarga
      </Button>
    </form>
  );
}
