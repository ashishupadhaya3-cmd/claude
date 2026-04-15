// HomeScreen — shows a list of all room listings fetched from Firestore.
// Falls back to dummy data if Firestore is empty or not configured yet.

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { db } from '../../firebaseConfig';
import ListingCard from '../components/ListingCard';
import Loader from '../components/Loader';
import dummyListings from '../data/dummyData';

export default function HomeScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch listings from Firestore
  const fetchListings = useCallback(async () => {
    try {
      const q = query(
        collection(db, 'listings'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // If Firestore has no data, show dummy data so beginners can test the UI
      if (data.length === 0) {
        setListings(dummyListings);
      } else {
        setListings(data);
      }
    } catch (err) {
      console.warn('Failed to fetch listings:', err.message);
      // On error (e.g. Firebase not configured) show dummy data
      setListings(dummyListings);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch on first mount
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Re-fetch when user pulls down to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchListings();
  };

  // Re-fetch every time we come back to the Home screen (e.g. after posting)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchListings);
    return unsubscribe;
  }, [navigation, fetchListings]);

  if (loading) {
    return <Loader text="Loading listings..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            onPress={() => navigation.navigate('Detail', { listing: item })}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // Empty state
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No listings yet</Text>
            <Text style={styles.emptySub}>
              Be the first to post a room!
            </Text>
          </View>
        }
      />

      {/* Floating "Post Listing" button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('PostListing')}
      >
        <Text style={styles.fabText}>+ Post Listing</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  empty: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  emptySub: {
    marginTop: 6,
    color: '#888',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: '#2563eb',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
