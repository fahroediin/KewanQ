// File: screens/CategoryScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesJson = await AsyncStorage.getItem('categories');
        if (categoriesJson) {
          setCategories(JSON.parse(categoriesJson));
        }
      } catch (e) {
        console.error("Gagal memuat kategori:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Fungsi yang sudah diperbaiki
  const handleCategoryPress = (categoryId) => {
    console.log("Navigasi ke Learning dengan categoryId:", categoryId); // Untuk debugging
    navigation.navigate('Learning', { categoryId: categoryId });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pilih Kelompok Hewan</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CustomButton
            title={item.name}
            iconName={item.icon_name}
            onPress={() => handleCategoryPress(item.id)}
          />
        )}
        contentContainerStyle={{ alignItems: 'center', width: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#F0FFF0',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#386641',
  },
});

export default CategoryScreen;