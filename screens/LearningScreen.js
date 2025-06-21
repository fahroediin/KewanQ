// File: screens/LearningScreen.js

import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, Text } from 'react-native';
import { useGameStore } from '../store/gameStore';
import AnimalDisplay from '../components/AnimalDisplay';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedBackground from '../components/AnimatedBackground';
import { playClickSound } from '../utils/audioHelper';

const LearningScreen = ({ navigation, route }) => {
  // Ambil state secara reaktif dari store
  const isLoading = useGameStore(state => state.isLoading);
  const currentAnimals = useGameStore(state => state.currentAnimals);
  const currentAnimalIndex = useGameStore(state => state.currentAnimalIndex);
  const tapCount = useGameStore(state => state.tapCount);
  
  // Ambil actions dari store
  const { onAnimalTap, setBackgroundMusicVolume, resetBackgroundMusicVolume } = useGameStore.getState();

  useFocusEffect(
    useCallback(() => {
      // Tugasnya sekarang HANYA mengelola volume musik
      setBackgroundMusicVolume(0.1);

      // Fungsi cleanup saat meninggalkan layar
      return () => {
        resetBackgroundMusicVolume();
      };
    }, []) // Dependency array bisa dikosongkan karena tidak ada ketergantungan
  );

  // Hook untuk kembali otomatis setelah kategori selesai
  useEffect(() => {
    if (!isLoading && currentAnimals.length === 0) {
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    }
  }, [isLoading, currentAnimals, navigation]);

  const handleGoBack = () => {
    playClickSound();
    navigation.goBack();
  };
  
  // Tampilan loading sekarang hanya akan muncul sesaat jika ada jeda render
  if (isLoading) {
    return (
      <AnimatedBackground source={require('../assets/images/backgrounds/learning-bg.png')}>
          <View style={styles.container}>
              <ActivityIndicator size="large" color="#4CAF50" />
          </View>
      </AnimatedBackground>
    );
  }

  // Fallback jika tidak ada hewan (seharusnya tidak terjadi dengan pre-fetching)
  if (currentAnimals.length === 0) {
      return (
        <AnimatedBackground source={require('../assets/images/backgrounds/learning-bg.png')}>
          <View style={styles.container}>
            <Text>Tidak ada hewan untuk ditampilkan.</Text>
          </View>
        </AnimatedBackground>
      );
  }

  const currentAnimal = currentAnimals[currentAnimalIndex];

  return (
    <AnimatedBackground source={require('../assets/images/backgrounds/learning-bg.png')}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back-circle" size={48} color="#4CAF50" />
          </TouchableOpacity>
          <AnimalDisplay animal={currentAnimal} onTap={onAnimalTap} />
          <View style={styles.tapIndicatorContainer}>
              {Array(4).fill(0).map((_, index) => (
              <View
                  key={index}
                  style={[
                  styles.tapIndicatorDot,
                  { backgroundColor: tapCount > index ? '#4CAF50' : '#d3d3d3' }
                  ]}
              />
              ))}
          </View>
        </View>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, zIndex: 10 },
  tapIndicatorContainer: { flexDirection: 'row', position: 'absolute', bottom: 50 },
  tapIndicatorDot: { width: 15, height: 15, borderRadius: 7.5, marginHorizontal: 8 },
});

export default LearningScreen;