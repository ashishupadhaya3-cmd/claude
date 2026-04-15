// Simple reusable loading spinner component.

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function Loader({ text = 'Loading...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
});
