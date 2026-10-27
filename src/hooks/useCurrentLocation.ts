import { useState } from 'react';
import * as Location from 'expo-location';

type LocationState = {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
};

export const useCurrentLocation = () => {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  const getLocation = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({ latitude: null, longitude: null, loading: false, error: 'Permissão negada' });
        return null;
      }

      // Timeout de 20 segundos (20000ms)
      const locationPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Tempo limite de busca excedido (20s)')), 20000)
      );

      const location = await Promise.race([locationPromise, timeoutPromise]);

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setState({ ...coords, loading: false, error: null });
      return coords;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao obter localização';
      setState({ latitude: null, longitude: null, loading: false, error: errorMessage });
      return null;
    }
  };

  return { ...state, getLocation };
};