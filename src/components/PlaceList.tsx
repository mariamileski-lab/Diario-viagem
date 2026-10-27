import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Place } from '../types';
import { PlaceRepository } from '../repositories/PlaceRepository';

const placeRepo = new PlaceRepository();

type PlaceListProps = {
  places: Place[];
  onReload: () => void;
};

export const PlaceList: React.FC<PlaceListProps> = ({ places, onReload }) => {
  const handleDelete = (id: string) => {
    Alert.alert('Confirmar Exclusão', 'Deseja remover este lugar do diário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await placeRepo.delete(id);
          onReload();
        },
      },
    ]);
  };

  if (places.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum lugar registrado ainda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {places.map((place) => (
        <View key={place.id} style={styles.itemCard}>
          {place.photoUri && <Image source={{ uri: place.photoUri }} style={styles.cardImage} />}
          <View style={styles.cardBody}>
            <Text style={styles.title}>{place.title}</Text>
            {place.note ? <Text style={styles.note}>{place.note}</Text> : null}

            {place.latitude !== null && place.longitude !== null ? (
              <Text style={styles.coords}>
                📍 {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
              </Text>
            ) : null}

            <Text style={styles.date}>{new Date(place.createdAt).toLocaleDateString('pt-BR')}</Text>

            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(place.id)}>
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: { marginVertical: 10 },
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#718096', fontSize: 16 },
  itemCard: { backgroundColor: '#f5c7e3', borderRadius: 8, marginBottom: 12, overflow: 'hidden', elevation: 1 },
  cardImage: { width: '100%', height: 160 },
  cardBody: { padding: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#2D3748' },
  note: { fontSize: 14, color: '#f587c7', marginVertical: 4 },
  coords: { fontSize: 12, color: '#003025', marginTop: 4 },
  date: { fontSize: 10, color: '#A0AEC0', marginTop: 4 },
  deleteButton: { marginTop: 10, backgroundColor: '#460000', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4, alignSelf: 'flex-start' },
  deleteButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});