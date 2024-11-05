import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PlantDetails = ({ route }) => {
  const { plantDetails, image, healthStatus } = route.params || {};
  const navigation = useNavigation();

  // Access classification suggestions
  const firstSuggestion = plantDetails?.result?.classification?.suggestions?.[0] || {};
  const plantName = firstSuggestion?.name || 'Unknown';
  const probability = firstSuggestion?.probability ? `${(firstSuggestion.probability * 100).toFixed(2)}%` : 'Not available';

  // Extract description
  const descriptionObject = firstSuggestion?.details?.description || {};
  const description = typeof descriptionObject === 'object' ? descriptionObject.value || 'No description available' : descriptionObject;

  // Extract taxonomy details
  const taxonomy = firstSuggestion?.details?.taxonomy || {};
  const family = taxonomy.family || 'Not available';
  const genus = taxonomy.genus || 'Not available';
  const order = taxonomy.order || 'Not available';
  const classTaxonomy = taxonomy.class || 'Not available';
  const phylum = taxonomy.phylum || 'Not available';
  const kingdom = taxonomy.kingdom || 'Not available';

  // Extract edible parts with correct path
  const edibleParts = firstSuggestion?.details?.edible_parts;
  const ediblePartsText = Array.isArray(edibleParts) && edibleParts.length > 0 
    ? edibleParts.join(', ') 
    : 'Not available';

  const handleMoreDetails = () => {
    navigation.navigate('MoreDetails', { 
      scientificName: plantName,
      image, // Pass the image URL
      taxonomy: { family, genus, order, classTaxonomy, phylum, kingdom } // Pass taxonomy details
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.photoContainer}>
        <Image source={{ uri: image }} style={styles.capturedImage} />
      </View>

      {plantDetails ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.heading}>Plant Details</Text>

          <DetailItem label="Common Name" detail={plantName} />
          <DetailItem label="Probability" detail={probability} />
          <DetailItem label="Description" detail={description} />
          <DetailItem label="Health Status" detail={healthStatus || 'No health assessment available'} />

          {/* Display Taxonomy Details */}
          {/* <DetailItem label="Family" detail={family} />
          <DetailItem label="Genus" detail={genus} />
          <DetailItem label="Order" detail={order} />
          <DetailItem label="Class" detail={classTaxonomy} />
          <DetailItem label="Phylum" detail={phylum} />
          <DetailItem label="Kingdom" detail={kingdom} /> */}

          {/* Display Edible Parts */}
          {/* <DetailItem label="Edible Parts" detail={ediblePartsText} /> */}

          <TouchableOpacity style={styles.moreDetailsButton} onPress={handleMoreDetails}>
            <Text style={styles.moreDetailsButtonText}>More Details</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.noDetailsText}>No plant details available.</Text>
      )}
    </ScrollView>
  );
};

// Extracted DetailItem as a separate reusable component
const DetailItem = ({ label, detail }) => (
  <View style={styles.itemBox}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.detail}>{detail}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#e0f7e4', // Light green background for a fresh look
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#e0f7e4', // White background to highlight the image
    padding: 10,
    borderRadius: 12,
    shadowColor: '#e0f7e4',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  capturedImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  detailsContainer: {
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
  heading: {
    fontSize: 20, // Reduced font size for better balance
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32', // Dark green for headings
    textAlign: 'center',
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
    fontSize: 15,
    marginTop: 5,
    color: '#4e342e', // Dark brown for details text
  },
  moreDetailsButton: {
    backgroundColor: '#81c784', // Light green for buttons
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  moreDetailsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDetailsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#d32f2f', // Red for alert messages
    fontSize: 16,
  },
});

export default PlantDetails;
