// File: api/assetManager.js

import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native'; // <-- 1. Import Platform

// Fungsi untuk download file jika belum ada (hanya untuk mobile)
export const downloadAsset = async (url) => {
  // 2. Cek apakah platformnya BUKAN web
  if (Platform.OS !== 'web') {
    // Logika ini hanya akan berjalan di iOS dan Android
    try {
      const filename = url.split('/').pop();
      const localUri = `${FileSystem.documentDirectory}${filename}`;
      
      const fileInfo = await FileSystem.getInfoAsync(localUri);

      if (fileInfo.exists) {
        return localUri;
      }
      
      console.log(`[Mobile] Mengunduh: ${url} ke ${localUri}`);
      await FileSystem.downloadAsync(url, localUri);
      return localUri;
    } catch (e) {
      console.error("Gagal download aset di mobile:", e);
      return null; // Kembalikan null jika gagal
    }
  } else {
    // 3. Jika platformnya ADALAH web, kita tidak download apa-apa.
    // Kita langsung kembalikan URL asli dari Supabase.
    // Browser akan menangani caching gambar dan audio dengan sendirinya.
    console.log(`[Web] Menggunakan URL langsung: ${url}`);
    return url;
  }
};