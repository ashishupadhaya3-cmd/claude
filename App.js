// App.js — Root component for RoomKhoj
// Sets up the navigation stack: Home -> Detail -> PostListing

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import PostListingScreen from './src/screens/PostListingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#222',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'RoomKhoj' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Room Details' }}
        />
        <Stack.Screen
          name="PostListing"
          component={PostListingScreen}
          options={{ title: 'Post a Room' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
