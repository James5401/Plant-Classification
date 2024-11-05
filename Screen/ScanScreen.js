import React, { useRef, useState } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

export default function ScanScreen({ route }) {
  const { photoUri } = route.params;
  const navigation = useNavigation();
  const [scanning, setScanning] = useState(false);
  const scanAnimation = useRef(new Animated.Value(0)).current;

  const handleRetake = () => {
    navigation.navigate('CameraScreen');
  };

  const getApiKey = () => {
    const apiKey = Constants.manifest?.extra?.PLANT_ID_API_KEY || Constants.expoConfig?.extra?.PLANT_ID_API_KEY;
    if (!apiKey) {
      console.log('Error: API Key is missing');
      Alert.alert('Error', 'API Key is missing');
    }
    return apiKey;
  };

  const getHealthAssessment = async (accessToken) => {
    try {
      const apiKey = getApiKey();
      if (!apiKey || !accessToken) {
        console.log('Error: API key or access token is missing');
        Alert.alert('Error', 'API key or access token is missing');
        return;
      }

      const details = 'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods';
      const language = 'en';

      const response = await axios.get(
        `https://plant.id/api/v3/identification/${accessToken}`,
        {
          headers: { 'Api-Key': apiKey },
          params: { details, language },
        }
      );

      let healthStatus = response.data.health_assessment?.is_healthy === true
        ? 'Healthy'
        : response.data.health_assessment?.is_healthy === false
        ? 'Unhealthy'
        : 'No health assessment available';

      if (response.data.result?.disease?.suggestions?.length > 0) {
        const disease = response.data.result.disease.suggestions[0];
        healthStatus = `Disease detected: ${disease.name} (Probability: ${disease.probability})`;
        if (disease.details?.description) {
          healthStatus += `\nDescription: ${disease.details.description}`;
        }
      }

      // console.log(JSON.stringify(response.data, null, 2));

      return {
        plantDetails: response.data,
        healthStatus,
      };
    } catch (err) {
      console.error('Error retrieving health assessment:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to retrieve health assessment. Please try again.');
      return null;
    }
  };

  const handleScan = async () => {
    setScanning(true);
    startScanAnimation();
  
    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        Alert.alert('Error', 'API key is missing');
        setScanning(false);
        return;
      }
  
      if (!photoUri) {
        Alert.alert('Error', 'No image available for scanning.');
        setScanning(false);
        return;
      }
  
      const base64Image = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Use the identification endpoint with health=all to get both plant and health data
      const identificationResponse = await axios.post(
        'https://plant.id/api/v3/identification',
        {
          images: [`data:image/jpeg;base64,${base64Image}`],
          latitude: 49.207,
          longitude: 16.608,
          similar_images: true,
          health: 'all', // Correct modifier to request full health assessment
        },
        {
          headers: {
            'Api-Key': apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const accessToken = identificationResponse.data.access_token;
      if (accessToken) {
        const result = await getHealthAssessment(accessToken);
  
        if (result) {
          const { plantDetails, healthStatus } = result;
  
          // Access suggestions from the correct path
          const suggestions = plantDetails?.result?.classification?.suggestions;
  
          if (suggestions && suggestions.length > 0) {
            navigation.navigate('PlantDetails', { plantDetails, image: photoUri, healthStatus });
          } else {
            Alert.alert('No Results', 'No plant identification results found. Ensure the image is clear and try again.');
          }
        }
      } else {
        Alert.alert('Error', 'No access token received.');
      }
    } catch (err) {
      console.error('Error identifying plant:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to identify the plant. Please try again.');
    }
  
    setScanning(false);
  };
  
  const startScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const scanLineTranslateY = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  });

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <Image source={{ uri: photoUri }} style={styles.photo} />
        {scanning && (
          <Animated.View
            style={[styles.scanLine, { transform: [{ translateY: scanLineTranslateY }] }]}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRetake}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleScan}>
          <Text style={styles.buttonText}>Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#e0f7e4' },
  photoContainer: { width: 300, height: 400, position: 'relative' },
  photo: { width: '100%', height: '100%', resizeMode: 'cover' },
  scanLine: { position: 'absolute', width: '100%', height: 50, backgroundColor: 'green', opacity: 0.8 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '80%', marginTop: 20 },
  button: { backgroundColor: '#388e3c',color:'white', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 16 },
});
