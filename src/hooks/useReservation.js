'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  createReservation,
  cancelReservation as cancelApi,
  getReservation,
  uploadReceipt as uploadApi,
} from '@/services/reservationService';

export default function useReservation(matchId) {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storageKey = `reservation_${matchId}`;

  const fetchReservation = useCallback(async (resId) => {
    try {
      const data = await getReservation(resId);
      if (['cancelled', 'expired'].includes(data.status)) {
        localStorage.removeItem(storageKey);
        setReservation(null);
      } else {
        setReservation(data);
      }
    } catch {
      localStorage.removeItem(storageKey);
      setReservation(null);
    }
  }, [storageKey]);

  useEffect(() => {
    const savedId = localStorage.getItem(storageKey);
    if (savedId) {
      fetchReservation(savedId).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [storageKey, fetchReservation]);

  const reserve = async (playerName, playerPhone) => {
    setError(null);
    try {
      const data = await createReservation(matchId, { playerName, playerPhone });
      localStorage.setItem(storageKey, data._id);
      setReservation(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const cancel = async () => {
    if (!reservation) return;
    try {
      await cancelApi(reservation._id);
      localStorage.removeItem(storageKey);
      setReservation(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const uploadReceipt = async (file) => {
    if (!reservation) return;
    setError(null);
    try {
      const data = await uploadApi(reservation._id, file);
      setReservation(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const refresh = () => {
    if (reservation?._id) fetchReservation(reservation._id);
  };

  return { reservation, loading, error, reserve, cancel, uploadReceipt, refresh };
}
