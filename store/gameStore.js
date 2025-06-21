// File: store/gameStore.js

import { create } from 'zustand';
import { Audio } from 'expo-av';

// --- Variabel untuk musik dipindahkan ke luar agar bisa diakses ---
let backgroundSoundObject = null;

export const useGameStore = create((set, get) => ({
  // === BAGIAN STATE ===
  currentAnimals: [],
  currentAnimalIndex: 0,
  tapCount: 0,
  isLoading: true, // Set default isLoading ke true
  sound: null, // Untuk suara hewan

  // === BAGIAN FUNGSI-FUNGSI (ACTIONS) ===

  // --- Fungsi untuk Musik Latar ---
  playBackgroundMusic: async () => {
    if (backgroundSoundObject) {
      const status = await backgroundSoundObject.getStatusAsync();
      if (status.isPlaying) return;
    }

    console.log('Memuat Musik Latar...');
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/music/background-music.mp3'), // Pastikan path ini benar
        { isLooping: true, volume: 0.5 }
      );
      backgroundSoundObject = sound;
      await backgroundSoundObject.playAsync();
      console.log('Musik Latar Diputar.');
    } catch (error) {
      console.error("Gagal memutar musik latar:", error);
    }
  },

  stopBackgroundMusic: async () => {
    if (backgroundSoundObject) {
      console.log('Menghentikan Musik Latar...');
      await backgroundSoundObject.unloadAsync();
      backgroundSoundObject = null;
    }
  },
  
  // --- Fungsi untuk Game ---
  loadCategory: (animals) => {
    console.log("Memuat kategori dengan hewan:", animals.length);
    set({
      currentAnimals: animals,
      currentAnimalIndex: 0,
      tapCount: 0,
      isLoading: false, // Set isLoading ke false setelah data dimuat
    });
  },

  onAnimalTap: async () => {
    const { currentAnimals, currentAnimalIndex, tapCount, sound } = get();
    if (sound) await sound.unloadAsync();

    const animal = currentAnimals[currentAnimalIndex];
    if (!animal) return;

    let audioUri;
    switch (tapCount) {
      case 0: audioUri = animal.audioNamePath; break;
      case 1: audioUri = animal.audioCharPath; break;
      case 2: audioUri = animal.audioFoodPath; break;
      case 3: audioUri = animal.audioReproPath; break;
    }

    if (audioUri) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });
        set({ sound: newSound });
        await newSound.playAsync();
        newSound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish && get().tapCount >= 3) {
            get()._nextAnimal();
          }
        });
      } catch (e) {
        console.error("Gagal memutar suara hewan:", e);
      }
    }

    if (tapCount < 3) {
      set({ tapCount: tapCount + 1 });
    } else {
      // Dihandle oleh listener di atas
    }
  },

  _nextAnimal: () => {
    const { currentAnimalIndex, currentAnimals } = get();
    if (currentAnimalIndex < currentAnimals.length - 1) {
      set(state => ({
        currentAnimalIndex: state.currentAnimalIndex + 1,
        tapCount: 0,
      }));
    } else {
      console.log("Kategori Selesai!");
      // Nanti bisa tambahkan navigasi kembali
    }
  },
}));