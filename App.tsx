import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, Text, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlaceForm } from './src/components/PlaceForm';
import { PlaceList } from './src/components/PlaceList';
import { PlaceRepository } from './src/repositories/PlaceRepository';
import { Place } from './src/types';

const placeRepo = new PlaceRepository();

export default function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const data = await placeRepo.getAll();
      setPlaces(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>📖 Diário de Lugares</Text>
        
        <PlaceForm onSaved={loadPlaces} />

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#2B6CB0" />
        ) : (
          <PlaceList places={places} onReload={loadPlaces} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbcfe8' }, // Um tom rosa claro combinando com os seus cards
  scrollContent: { padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A202C', textAlign: 'center', marginVertical: 10 },
});