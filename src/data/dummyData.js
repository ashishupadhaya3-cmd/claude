// Dummy data used when Firestore has no listings yet.
// This lets a beginner test the UI without setting up Firebase first.

const dummyListings = [
  {
    id: 'dummy-1',
    title: 'Cozy 1BHK near Ratnapark',
    price: 12000,
    location: 'Ratnapark, Kathmandu',
    roomType: '1 room',
    amenities: ['WiFi', 'Water', 'Parking'],
    phone: '9801234567',
    imageUrl:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800',
    description:
      'A sunny, fully furnished 1BHK room near Ratnapark. Walking distance to the bus stop and local shops.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dummy-2',
    title: 'Modern Flat in Lalitpur',
    price: 25000,
    location: 'Jhamsikhel, Lalitpur',
    roomType: 'flat',
    amenities: ['WiFi', 'Water', 'Parking', 'Furnished'],
    phone: '9809876543',
    imageUrl:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    description:
      'Spacious 2-bedroom flat with a balcony view. Close to cafes and supermarkets. Perfect for small families.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'dummy-3',
    title: '2 Room Apartment in Baneshwor',
    price: 16000,
    location: 'New Baneshwor, Kathmandu',
    roomType: '2 room',
    amenities: ['Water', 'Parking'],
    phone: '9811122233',
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    description:
      'Quiet and clean 2-room apartment available for rent. Family preferred. 24-hour water supply.',
    createdAt: new Date().toISOString(),
  },
];

export default dummyListings;
