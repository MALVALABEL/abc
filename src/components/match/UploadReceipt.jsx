'use client';
import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import { validateFile } from '@/helpers/validators';

export default function UploadReceipt({ onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const err = validateFile(selected);
    if (err) {
      setError(err);
      return;
    }

    setError(null);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Selecciona una imagen');
      return;
    }
    setLoading(true);
    await onUpload(file);
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 font-medium">Sube el comprobante de pago</p>
      <div
        className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 transition-all duration-200"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Comprobante" className="max-h-48 mx-auto rounded-lg" />
        ) : (
          <div className="space-y-2 py-4">
            <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">Toca para seleccionar imagen</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {file && (
        <Button onClick={handleSubmit} loading={loading}>
          Enviar comprobante
        </Button>
      )}
    </div>
  );
}
