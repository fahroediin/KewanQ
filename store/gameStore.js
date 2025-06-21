// File: store/gameStore.js

import { create } from 'zustand';
import { Audio } from 'expo-av';

// Variabel untuk menyimpan objek musik agar bisa diakses di luar scope
let backgroundSoundObject = null;

export const useGameStore = create((set, get) => ({
  // === BAGIAN STATE ===
  isMusicStarted: false,
  currentAnimals: [],
  currentAnimalIndex: 0,
  tapCount: 0,
  isLoading: true,
  sound: null, // Untuk suara hewan

  // === BAGIAN FUNGSI-FUNGSI (ACTIONS) ===

  // --- Fungsi untuk Musik Latar ---
  playBackgroundMusic: async () => {
    if (get().isMusicStarted) return;
    console.log('Memuat Musik Latar...');
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/audio/music/background-music.mp3'),
        { isLooping: true, volume: 0.5 }
      );
      backgroundSoundObject = sound;
      await backgroundSoundObject.playAsync();
      set({ isMusicStarted: true });
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
      set({ isMusicStarted: false });
    }
  },

  setBackgroundMusicVolume: async (volume) => {
    if (backgroundSoundObject) {
      try {
        console.log(`Mengatur volume musik latar ke: ${volume}`);
        await backgroundSoundObject.setVolumeAsync(volume);
      } catch (error) {
        console.error("Gagal mengatur volume:", error);
      }
    }
  },

  resetBackgroundMusicVolume: async () => {
    await get().setBackgroundMusicVolume(0.5); // Kembalikan ke volume default (50%)
  },
  
  // --- Fungsi untuk Logika Game ---
  loadCategory: (animals) => {
    set({
      currentAnimals: animals,
      currentAnimalIndex: 0,
      tapCount: 0,
      isLoading: false,
    });
  },

  // --- FUNGSI onAnimalTap YANG SUDAH DIPERBAIKI ---
  onAnimalTap: async () => {
    const { currentAnimals, currentAnimalIndex, tapCount, sound } = get();
    if (sound) await sound.unloadAsync();

    const animal = currentAnimals[currentAnimalIndex];
    if (!animal) return;

    // Perbarui tapCount DI AWAL untuk update UI segera
    const nextTapCount = tapCount + 1;
    set({ tapCount: nextTapCount });

    let audioUri;
    // Gunakan tapCount LAMA (sebelum ditambah) untuk menentukan audio yang diputar
    switch (tapCount) { 
      case 0: audioUri = animal.audioNamePath; break;
      case 1: audioUri = animal.audioCharPath; break;
      case 2: audioUri = animal.audioFoodPath; break;
      case 3: audioUri = animal.audioReproPath; break;
      default:
        // Jika tapCount sudah 4 atau lebih, _nextAnimal seharusnya sudah berjalan
        // Ini sebagai pengaman saja
        get()._nextAnimal();
        return;
    }

    const isLastTap = nextTapCount >= 4;

    if (audioUri) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri });
        set({ sound: newSound });
        await newSound.playAsync();
        
        // Tambahkan listener HANYA jika ini adalah tap terakhir
        if (isLastTap) {
          newSound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) {
              newSound.unloadAsync();
              get()._nextAnimal();
            }
          });
        }
      } catch (e) {
        console.error("Gagal memutar suara hewan:", e);
        if(isLastTap) get()._nextAnimal();
      }
    } else if (isLastTap) {
      get()._nextAnimal();
    }
  },

  _nextAnimal: () => {
    const { currentAnimalIndex, currentAnimals } = get();
    if (currentAnimalIndex < currentAnimals.length - 1) {
      // Jika BUKAN hewan terakhir, pindah ke selanjutnya
      set({
        currentAnimalIndex: currentAnimalIndex + 1,
        tapCount: 0,
      });
      return false; // Kembalikan false karena belum selesai
    } else {
      // Jika INI ADALAH hewan terakhir
      console.log("Kategori Selesai! Mereset state.");
      set({
        currentAnimals: [],
        currentAnimalIndex: 0,
        tapCount: 0,
        isLoading: true,
      });
      return true; // Kembalikan true untuk menandakan kategori selesai
    }
  },
}));