// File: components/CustomButton.js

import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomButton = ({ title, iconName, onPress, disabled }) => {
  // Animasi untuk efek tekan (memantul)
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95, // Sedikit mengecil saat ditekan
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1, // Kembali ke ukuran normal
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  // Fungsi untuk menentukan warna tombol berdasarkan nama kategori
  const getButtonColor = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case 'serangga': return '#84CC16'; // Hijau Limau
      case 'mamalia': return '#3B82F6'; // Biru
      case 'unggas': return '#EF4444'; // Merah
      default: return '#6B7280'; // Abu-abu sebagai fallback
    }
  };

  const buttonColor = getButtonColor(title);

  return (
    // Bungkus dengan Animated.View agar bisa dianimasikan
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, disabled && { opacity: 0.6 }]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9} // Opacity saat ditekan
        style={styles.touchable}
      >
        <View style={[styles.buttonBody, { backgroundColor: buttonColor }]}>
            {/* Lingkaran putih untuk ikon */}
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name={iconName} size={32} color={buttonColor} />
            </View>
            
            <Text style={styles.buttonText}>{title.toUpperCase()}</Text>

            {/* Ikon panah di ujung kanan */}
            <MaterialCommunityIcons name="chevron-right" size={40} color="rgba(255,255,255,0.7)" style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    width: '90%',
    height: 90,
    marginVertical: 12,
    // Efek bayangan yang lebih baik
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 45, // Membuat sudut sangat bulat
    borderWidth: 4,
    borderColor: 'white',
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Lingkaran sempurna
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  buttonText: {
    flex: 1,
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1.5, // Beri jarak antar huruf
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  arrowIcon: {
    marginLeft: 10,
  }
});

export default CustomButton;