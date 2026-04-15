// PostListingScreen — form for posting a new room listing.
// Uploads image to Firebase Storage and saves the listing to Firestore.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { db, storage } from '../../firebaseConfig';

// Hard-coded options to keep the MVP simple
const ROOM_TYPES = ['1 room', '2 room', 'flat'];
const AMENITY_OPTIONS = [
  'WiFi',
  'Water',
  'Parking',
  'Furnished',
  'Kitchen',
  'Attached Bathroom',
];

export default function PostListingScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [roomType, setRoomType] = useState('1 room');
  const [amenities, setAmenities] = useState([]);
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Toggle an amenity in the checkbox list
  const toggleAmenity = (item) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  // Pick an image from the device gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'We need access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Upload the picked image to Firebase Storage and return its download URL
  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `listings/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  // Validate + submit the form
  const handleSubmit = async () => {
    if (!title || !price || !location || !phone) {
      Alert.alert(
        'Missing info',
        'Please fill title, price, location and phone.'
      );
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = '';
      if (imageUri) {
        imageUrl = await uploadImage(imageUri);
      }

      await addDoc(collection(db, 'listings'), {
        title,
        price: Number(price),
        location,
        roomType,
        amenities,
        phone,
        description,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Your listing has been posted!');
      navigation.goBack();
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', 'Failed to post listing. Check Firebase setup.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Title */}
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. 2BHK near Thamel"
          placeholderTextColor="#999"
        />

        {/* Price */}
        <Text style={styles.label}>Price (Rs) *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="e.g. 15000"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />

        {/* Location */}
        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Baneshwor, Kathmandu"
          placeholderTextColor="#999"
        />

        {/* Room Type (simple pill selector instead of dropdown) */}
        <Text style={styles.label}>Room Type</Text>
        <View style={styles.row}>
          {ROOM_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.pill,
                roomType === type && styles.pillActive,
              ]}
              onPress={() => setRoomType(type)}
            >
              <Text
                style={[
                  styles.pillText,
                  roomType === type && styles.pillTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amenities checkboxes */}
        <Text style={styles.label}>Amenities</Text>
        <View style={styles.row}>
          {AMENITY_OPTIONS.map((a) => {
            const checked = amenities.includes(a);
            return (
              <TouchableOpacity
                key={a}
                style={[styles.pill, checked && styles.pillActive]}
                onPress={() => toggleAmenity(a)}
              >
                <Text
                  style={[
                    styles.pillText,
                    checked && styles.pillTextActive,
                  ]}
                >
                  {checked ? '✓ ' : ''}
                  {a}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Phone */}
        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="98XXXXXXXX"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Tell tenants more about the room..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        {/* Image picker */}
        <Text style={styles.label}>Room Image</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <Text style={styles.imagePickerText}>
              + Tap to choose image
            </Text>
          )}
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>POST LISTING</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#fafafa',
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  pillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  pillText: {
    color: '#444',
    fontSize: 13,
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  imagePicker: {
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePickerText: {
    color: '#888',
    fontSize: 14,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  submitBtn: {
    marginTop: 24,
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
