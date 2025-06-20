import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/SplashScreen';
import MainMenuScreen from './screens/MainMenuScreen';
import CategoryScreen from './screens/CategoryScreen';
import LearningScreen from './screens/LearningScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash" 
        screenOptions={{ headerShown: false }} // Menyembunyikan header default
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="Learning" component={LearningScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}