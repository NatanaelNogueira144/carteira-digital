import { useCallback, useState } from 'react';
import { gainService, Gain, GainPayload } from '../services/gainService';
import { normalizeApiError } from '../core/http/api';
import { ApiError } from '../core/http/interceptors';

type LoadingState = {
  list: boolean;
  show: boolean;
  create: boolean;
  update: boolean;
  destroy: boolean;
};

const initialLoadingState: LoadingState = {
  list: false,
  show: false,
  create: false,
  update: false,
  destroy: false,
};

export function useGain() {
  const [gains, setGains] = useState<Gain[]>([]);
  const [selectedGain, setSelectedGain] = useState<Gain | null>(null);
  const [loading, setLoading] = useState<LoadingState>(initialLoadingState);
  const [error, setError] = useState<ApiError | null>(null);

  const setLoadingKey = useCallback((key: keyof LoadingState, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  }, []);

  const runWithState = useCallback(
    async <T>(key: keyof LoadingState, action: () => Promise<T>): Promise<T> => {
      try {
        setError(null);
        setLoadingKey(key, true);

        return await action();
      } catch (err) {
        const parsedError = normalizeApiError(err);
        setError(parsedError);
        throw parsedError;
      } finally {
        setLoadingKey(key, false);
      }
    },
    [setLoadingKey]
  );

  const fetchGains = useCallback(
    () =>
    runWithState('list', async () => {
      const gains = await gainService.list();
      gains.forEach(gain => gain.date = gain.date.replace('Z', ''));
      setGains(gains);
      return gains;
    }),
    [runWithState]
  );

  const showGain = useCallback(
    (id: number) =>
    runWithState('show', async () => {
      const data = await gainService.show(id);
      setSelectedGain(data);
      return data;
    }),
    [runWithState]
  );

  const createGain = useCallback(
    (payload: GainPayload) =>
    runWithState('create', async () => {
      const createdGain = await gainService.store(payload);
      setGains((prev) => [createdGain, ...prev]);
      return createdGain;
    }),
    [runWithState]
  );

  const updateGain = useCallback(
    (id: number, payload: GainPayload) =>
    runWithState('update', async () => {
      const updatedGain = await gainService.update(id, payload);

      setGains((prev) => prev.map((gain) => (gain.id === id ? updatedGain : gain)));
      setSelectedGain((prev) => prev?.id === id ? updatedGain : prev);

      return updatedGain;
    }),
    [runWithState]
  );

  const destroyGain = useCallback(
    (id: number) =>
    runWithState('destroy', async () => {
      await gainService.destroy(id);

      setGains((prev) => prev.filter((gain) => gain.id !== id));
      setSelectedGain((prev) => (prev?.id === id ? null : prev));
    }),
    [runWithState]
  );

  const resetSelectedGain = useCallback(() => {
    setSelectedGain(null);
  }, []);

  return {
    gains,
    selectedGain,
    loading,
    error,
    fetchGains,
    showGain,
    createGain,
    updateGain,
    destroyGain,
    resetSelectedGain,
  };
}