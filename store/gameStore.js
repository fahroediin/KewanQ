// File: store/gameStore.js

import { create } from 'zustand';
import { Audio } from 'expo-av';

let backgroundSoundObject = null;

export const useGameStore = create((set, get) => ({
  // === STATE ===
  isMusicStarted: false,
  currentAnimals: [],
  currentAnimalIndex: 0,
  tapCount: 0,
  isLoading: true,
  sound: null,

  // === ACTIONS ===

  playBackgroundMusic: async () => {
    if (get().isMusicStarted) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/music/background-music.mp3'),
        { isLooping: true, volume: 0.5 }
      );
      backgroundSoundObject = sound;
      await backgroundSoundObject.playAsync();
      set({ isMusicStarted: true });
    } catch (error) { console.error("Gagal memutar musik latar:", error); }
  },

  setBackgroundMusicVolume: async (volume) => {
    if (backgroundSoundObject) {
      try {
        await backgroundSoundObject.setVolumeAsync(volume);
      } catch (error) { console.error("Gagal mengatur volume:", error); }
    }
  },

  resetBackgroundMusicVolume: async () => {
    await get().setBackgroundMusicVolume(0.5);
  },
  
  loadCategory: (animals) => {
    set({
      currentAnimals: animals,
      currentAnimalIndex: 0,
      tapCount: 0,
      isLoading: false,
    });
  },

  onAnimalTap: async () => {
    const { currentAnimals, currentAnimalIndex, tapCount, sound } = get();
    if (sound) await sound.unloadAsync();

    const animal = currentAnimals[currentAnimalIndex];
    if (!animal) return;

    const nextTapCount = tapCount + 1;
    set({ tapCount: nextTapCount });

    let audioUri;
    switch (tapCount) { 
      case 0: audioUri = animal.audioNamePath; break;
      case 1: audioUri = animal.audioCharPath; break;
      case 2: audioUri = animal.audioFoodPath; break;
      case 3: audioUri = animal.audioReproPath; break;
      default:
        get()._nextAnimal();
        return;
    }

    const isLastTap = nextTapCount >= 4;

    if (audioUri) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });
        set({ sound: newSound });
        await newSound.playAsync();
        
        if (isLastTap) {
          newSound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) {
              newSound.unloadAsync();
              get()._nextAnimal();
            }
          });
        }
      } catch (e) {
        if(isLastTap) get()._nextAnimal();
      }
    } else if (isLastTap) {
      get()._nextAnimal();
    }
  },

  _nextAnimal: () => {
    const { currentAnimalIndex, currentAnimals } = get();
    if (currentAnimalIndex < currentAnimals.length - 1) {
      set({
        currentAnimalIndex: currentAnimalIndex + 1,
        tapCount: 0,
      });
    } else {
      console.log("Kategori Selesai! Mereset state hewan.");
      // **PERBAIKAN KUNCI:** Jangan set isLoading: true di sini.
      // Biarkan isLoading tetap false agar useEffect di LearningScreen bisa mendeteksi kondisi akhir.
      set({
        currentAnimals: [],
        currentAnimalIndex: 0,
        tapCount: 0,
      });
    }
  },

  // Fungsi ini memastikan state kembali ke awal sebelum masuk LearningScreen
  resetLearningState: () => {
    set({
      currentAnimals: [],
      currentAnimalIndex: 0,
      tapCount: 0,
      isLoading: true, 
    });
  },
}));