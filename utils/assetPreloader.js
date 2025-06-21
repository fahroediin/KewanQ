// File: utils/assetPreloader.js

import { Image } from 'react-native';
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';

// Fungsi untuk memuat gambar ke cache
const cacheImages = (images) => {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

// Fungsi untuk memuat suara ke cache
const cacheSounds = (sounds) => {
  return sounds.map(sound => {
    const s = new Audio.Sound();
    return s.loadAsync(sound);
    // Kita tidak unload, biarkan di memori untuk akses cepat
  });
};

export const preloadAssets = async () => {
  console.log("Memulai preloading aset lokal...");
  
  // Daftar semua gambar lokal yang penting
  const imageAssets = cacheImages([
    require('../assets/images/layers/tanah-dan-semak.png'),
    require('../assets/images/kewanq-logo.png'),
    require('../assets/images/animations/cloud1.png'),
    require('../assets/images/animations/cloud2.png'),
    require('../assets/images/buttons/icon-back.png'),
    require('../assets/images/backgrounds/category-bg.png'),
    require('../assets/images/backgrounds/learning-bg.png'),
  ]);

  // Daftar semua suara lokal yang penting
  const soundAssets = cacheSounds([
    require('../assets/audio/selamat-datang.mp3'),
    require('../assets/audio/ui/click.mp3'),
    require('../assets/audio/music/background-music.mp3'),
    require('../assets/audio/categories/pilih-jenis-hewan.mp3'),
    require('../assets/audio/categories/serangga.mp3'),
    require('../assets/audio/categories/mamalia.mp3'),
    require('../assets/audio/categories/unggas.mp3'),
  ]);

  // Jalankan semua proses loading secara paralel
  await Promise.all([...imageAssets, ...soundAssets]);
  
  console.log("Preloading aset lokal selesai.");
};