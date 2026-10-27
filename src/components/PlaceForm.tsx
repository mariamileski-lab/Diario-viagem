import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { PlaceRepository, InvalidPlaceError } from '../repositories/PlaceRepository';

const placeRepo = new PlaceRepository();

type PlaceFormProps = {
  onSaved: () => void;
};

export const PlaceForm: React.FC<PlaceFormProps> = ({ onSaved }) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { latitude, longitude, loading: locationLoading, error: locationError, getLocation } = useCurrentLocation();

  const handleTakePicture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão negada', 'É necessária permissão de acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await placeRepo.create({
        title,
        note,
        photoUri,
        latitude,
        longitude,
      });

      // Limpa os dados do formulário
      setTitle('');
      setNote('');
      setPhotoUri(null);
      Alert.alert('Sucesso', 'Lugar registrado com sucesso!');
      onSaved();
    } catch (err) {
      if (err instanceof InvalidPlaceError) {
        Alert.alert('Validação', err.message);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o registro.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Novo Lugar no Diário</Text>

      <TextInput
        style={styles.input}
        placeholder="Título do lugar (ex: Praça Central)"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Comentário/Nota sobre o lugar"
        value={note}
        onChangeText={setNote}
        multiline
      />

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={handleTakePicture}>
          <Text style={styles.buttonText}>📷 Tirar Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={getLocation} disabled={locationLoading}>
          {locationLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📍 Obter GPS</Text>
          )}
        </TouchableOpacity>
      </View>

      {photoUri && <Image source={{ uri: photoUri }} style={styles.previewImage} />}

      {latitude !== null && longitude !== null && (
        <Text style={styles.infoText}>
          Coordenadas: {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </Text>
      )}

      {locationError && <Text style={styles.errorText}>{locationError}</Text>}

      <TouchableOpacity
        style={[styles.buttonPrimary, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonPrimaryText}>Salvar Lugar</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10 },
  textArea: { height: 60 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  buttonSecondary: { backgroundColor: '#007009', padding: 10, borderRadius: 6, flex: 0.48, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#6b1048', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600' },
  buttonPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  previewImage: { width: '100%', height: 180, borderRadius: 6, marginVertical: 8 },
  infoText: { color: '#2F855A', marginVertical: 4, fontWeight: '500' },
  errorText: { color: '#E53E3E', marginVertical: 4 },
});