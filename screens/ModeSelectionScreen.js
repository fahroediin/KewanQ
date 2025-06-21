// File: screens/ModeSelectionScreen.js

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import CustomButton from '../components/CustomButton';
import { playClickSound } from '../utils/audioHelper'; // Import fungsi klik

const ModeSelectionScreen = ({ navigation }) => {
  const handleModePress = (action) => {
    playClickSound(); // Panggil suara klik
    action();
  };

  const handleGoBack = () => {
    playClickSound(); // Panggil suara klik
    navigation.goBack();
  }

  const modes = [
    { id: 1, name: 'Belajar', icon_name: 'school', action: () => navigation.navigate('Category') },
    { id: 2, name: 'Kuis', icon_name: 'gamepad-variant', action: () => alert('Fitur Kuis Segera Hadir!') },
  ];

  return (
    <AnimatedBackground>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Image source={require('../assets/images/buttons/icon-back.png')} style={styles.backIcon} />
        </TouchableOpacity>
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
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  backIcon: { width: 60, height: 60, resizeMode: 'contain' },
  logo: { position: 'absolute', top: 50, right: 20, width: 120, height: 40, resizeMode: 'contain' },
  buttonContainer: { width: '100%', alignItems: 'center', marginTop: 80 },
});

export default ModeSelectionScreen;