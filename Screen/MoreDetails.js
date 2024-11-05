import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const MoreDetails = ({ route }) => {
  const { scientificName, image, taxonomy } = route.params || {};
  
  // Extract taxonomy properties
  const { family, genus, order, classTaxonomy, phylum, kingdom } = taxonomy || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Display Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      
      {/* Display Scientific Name */}
      <Text style={styles.heading}>{scientificName || 'Scientific Name Unavailable'}</Text>

      {/* Display Taxonomy Details */}
      <View style={styles.taxonomyContainer}>
        <DetailItem label="Family" detail={family} />
        <DetailItem label="Genus" detail={genus} />
        <DetailItem label="Order" detail={order} />
        <DetailItem label="Class" detail={classTaxonomy} />
        <DetailItem label="Phylum" detail={phylum} />
        <DetailItem label="Kingdom" detail={kingdom} />
      </View>
    </ScrollView>
  );
};

// Extracted DetailItem as a separate reusable component
const DetailItem = ({ label, detail }) => (
  <View style={styles.itemBox}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.detail}>{detail || 'Not available'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e0f7e4', // Light green background for a fresh look
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#e0f7e4', // White background to highlight the image
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  heading: {
    fontSize: 22, // Slightly smaller font size for better balance
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2e7d32', // Dark green for headings
  },
  taxonomyContainer: {
    marginTop: 20,
    backgroundColor: '#e0f7e4', // Soft yellow-green for a natural feel
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  itemBox: {
    marginBottom: 10,
    backgroundColor: '#e8f5e9', // Very light green for each detail item
    padding: 10,
    borderRadius: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#388e3c', // Medium green for labels
  },
  detail: {
    fontSize: 16,
    marginTop: 5,
    color: '#4e342e', // Dark brown for details text
  },
});

export default MoreDetails;
