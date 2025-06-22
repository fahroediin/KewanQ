// File: screens/ModeSelectionScreen.js

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import CustomButton from '../components/CustomButton';
import { playClickSound } from '../utils/audioHelper';

const ModeSelectionScreen = ({ navigation }) => {
  const handleModePress = (action) => {
    playClickSound();
    action();
  };

  const modes = [
    { id: 1, name: 'Belajar', icon_name: 'school', action: () => navigation.navigate('Category') },
    { id: 2, name: 'Kuis', icon_name: 'gamepad-variant', action: () => alert('Fitur Kuis Segera Hadir!') },
  ];

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        {/* Tombol Back sudah dihapus */}
        
        <Image source={require('../assets/images/kewanq-logo.png')} style={styles.logo} />

        <View style={styles.buttonContainer}>
          {modes.map((mode) => (
            <CustomButton key={mode.id} title={mode.name} iconName={mode.icon_name} onPress={() => handleModePress(mode.action)} />
          ))}
        </View>
      </View>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // Style untuk backButton dan backIcon sudah dihapus
  logo: { position: 'absolute', top: 50, right: 20, width: 120, height: 40, resizeMode: 'contain' },
  buttonContainer: { width: '100%', alignItems: 'center', marginTop: 80 },
});

export default ModeSelectionScreen;