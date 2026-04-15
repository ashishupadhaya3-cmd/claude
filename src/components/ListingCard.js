// ListingCard — shows a single room listing row on the Home screen.
// Tapping the card opens the Detail screen; tapping "Call" dials the owner.

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';

export default function ListingCard({ item, onPress }) {
  // Dial the owner directly using the phone dialer
  const handleCall = () => {
    if (!item.phone) {
      Alert.alert('No phone number available');
      return;
    }
    const url = `tel:${item.phone}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Unable to open dialer')
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={onPress}
    >
      <Image
        source={{
          uri:
            item.imageUrl ||
            'https://via.placeholder.com/600x400?text=No+Image',
        }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.price}>Rs. {item.price}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          📍 {item.location}
        </Text>

        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
          <Text style={styles.callBtnText}>📞 Call Owner</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    // subtle shadow for iOS + elevation for Android
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#eee',
  },
  body: {
    padding: 14,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  callBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  callBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
