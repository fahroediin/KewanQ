import { Audio } from 'expo-av';

export const playClickSound = async () => {
  try {
    const { sound } = await Audio.Sound.createAsync(
       require('../assets/audio/ui/click.mp3')
    );
    await sound.playAsync();
  } catch (error) {
    console.error("Gagal memutar suara klik:", error);
  }
};