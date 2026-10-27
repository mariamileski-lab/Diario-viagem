export type Place = {
  id: string;
  title: string;       // Campo obrigatório (Diário de Lugares)
  note: string;        // Comentário sobre o lugar
  photoUri: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;   // ISO String para evitar quebra ao salvar como JSON
};

export type NewPlace = Omit<Place, 'id' | 'createdAt'>;