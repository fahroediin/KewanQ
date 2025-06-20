import { create } from 'zustand';
import { Audio } from 'expo-av';

export const useGameStore = create((set, get) => ({
  currentAnimals: [],
  currentAnimalIndex: 0,
  tapCount: 0,
  isLoading: false,
  sound: null,

  // Fungsi untuk memuat hewan dari penyimpanan lokal
  loadCategory: (animals) => {
    set({
      currentAnimals: animals,
      currentAnimalIndex: 0,
      tapCount: 0,
      isLoading: false,
    });
  },

  // Fungsi utama saat gambar hewan ditekan
  onAnimalTap: async () => {
    const { currentAnimals, currentAnimalIndex, tapCount, sound } = get();
    
    // Unload suara sebelumnya jika ada
    if (sound) {
      await sound.unloadAsync();
    }

    const animal = currentAnimals[currentAnimalIndex];
    let audioUri;

    // Tentukan file suara yang akan diputar dari URI lokal
    switch (tapCount) {
      case 0: audioUri = animal.audioNamePath; break;
      case 1: audioUri = animal.audioCharPath; break;
      case 2: audioUri = animal.audioFoodPath; break;
      case 3: audioUri = animal.audioReproPath; break;
    }

    // Putar suara dari file lokal
    if (audioUri) {
      const { sound: newSound } = await Audio.Sound.createAsync(
         { uri: audioUri }
      );
      set({ sound: newSound });
      await newSound.playAsync();

      // Listener untuk pindah hewan setelah suara selesai
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          if (get().tapCount >= 3) {
            get()._nextAnimal();
          }
        }
      });
    }

    // Update state tapCount
    if (tapCount < 3) {
      set({ tapCount: tapCount + 1 });
    } else {
      // Reset akan dihandle oleh listener di atas
    }
  },

  _nextAnimal: () => {
    const { currentAnimalIndex, currentAnimals } = get();
    if (currentAnimalIndex < currentAnimals.length - 1) {
      set(state => ({
        currentAnimalIndex: state.currentAnimalIndex + 1,
        tapCount: 0, // Reset tap count untuk hewan baru
      }));
    } else {
      console.log("Kategori Selesai!");
      // Di sini Anda bisa trigger navigasi kembali ke menu
    }
  },
}));