// DetailScreen — shows full details for a single room listing.
// Includes an image carousel (horizontal scroll), description,
// amenities, and a "Call Owner" button.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function DetailScreen({ route }) {
  const { listing } = route.params;

  // Support a single imageUrl OR an array of images
  const images = Array.isArray(listing.images)
    ? listing.images
    : [listing.imageUrl].filter(Boolean);

  // Call the owner using the tel: scheme
  const handleCall = () => {
    if (!listing.phone) {
      Alert.alert('No phone number available');
      return;
    }
    Linking.openURL(`tel:${listing.phone}`).catch(() =>
      Alert.alert('Unable to open dialer')
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {images.length > 0 ? (
            images.map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                style={styles.image}
                resizeMode="cover"
              />
            ))
          ) : (
            <Image
              source={{
                uri:
                  'https://via.placeholder.com/800x500?text=No+Image',
              }}
              style={styles.image}
            />
          )}
        </ScrollView>

        {/* Main info */}
        <View style={styles.body}>
          <Text style={styles.price}>Rs. {listing.price}</Text>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.location}>📍 {listing.location}</Text>

          {listing.roomType ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{listing.roomType}</Text>
            </View>
          ) : null}

          {/* Description */}
          {listing.description ? (
            <>
              <Text style={styles.section}>Description</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </>
          ) : null}

          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <>
              <Text style={styles.section}>Amenities</Text>
              <View style={styles.amenities}>
                {listing.amenities.map((a) => (
                  <View key={a} style={styles.amenityPill}>
                    <Text style={styles.amenityText}>✓ {a}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Sticky Call button */}
      <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
        <Text style={styles.callBtnText}>📞 Call Owner</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width,
    height: 260,
    backgroundColor: '#eee',
  },
  body: {
    padding: 18,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 12,
  },
  tagText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    color: '#111',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityPill: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    color: '#333',
    fontSize: 13,
  },
  callBtn: {
    backgroundColor: '#16a34a',
    margin: 16,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  callBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
