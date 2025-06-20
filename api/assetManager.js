import * as FileSystem from 'expo-file-system';

// Fungsi untuk download file jika belum ada
export const downloadAsset = async (url) => {
  const filename = url.split('/').pop();
  const localUri = `${FileSystem.documentDirectory}${filename}`;

  const fileInfo = await FileSystem.getInfoAsync(localUri);

  if (fileInfo.exists) {
    // console.log('File sudah ada di:', localUri);
    return localUri;
  }

  console.log('Mengunduh:', url, 'ke', localUri);
  await FileSystem.downloadAsync(url, localUri);
  return localUri;
};