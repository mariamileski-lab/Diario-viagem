import AsyncStorage from '@react-native-async-storage/async-storage';
import { Place, NewPlace } from '../types';

const STORAGE_KEY = '@diario-de-lugares:places';

export class InvalidPlaceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPlaceError';
  }
}

export class PlaceRepository {
  async getAll(): Promise<Place[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Erro ao buscar lugares:', e);
      return [];
    }
  }

  async create(data: NewPlace): Promise<Place> {
    if (!data.title || data.title.trim() === '') {
      throw new InvalidPlaceError('O título do lugar é obrigatório.');
    }

    // Regra de aceite: exige Foto OU Localização (comparado com null pois coord 0 é válida)
    const semFoto = data.photoUri === null;
    const semLocalizacao = data.latitude === null || data.longitude === null;

    if (semFoto && semLocalizacao) {
      throw new InvalidPlaceError('Tire uma foto OU obtenha a localização.');
    }

    const newPlace: Place = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    const currentPlaces = await this.getAll();
    const updatedPlaces = [newPlace, ...currentPlaces];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlaces));

    return newPlace;
  }

  async delete(id: string): Promise<void> {
    const currentPlaces = await this.getAll();
    const updatedPlaces = currentPlaces.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlaces));
  }
}