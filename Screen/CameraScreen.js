import React, { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera/legacy';

export default function CameraScreen() {
  const [alertShown, setAlertShown] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      // Request permission to use the camera
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      if (!alertShown) {
        Alert.alert(
          "NOTE: The app is on testing stage",
          "DEVELOPER ISKO TECH.",
          [{ text: "OK", onPress: () => setAlertShown(true) }]
        );
      }
    })();
  }, [alertShown]);

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <Button onPress={async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        }} title="Grant Permission" />
      </View>
    );
  }

  // Function to take a picture
  const takePicture = async () => {
    if (cameraReady && cameraRef.current) {
      try {
        const options = { quality: 0.7, base64: true };
        const photo = await cameraRef.current.takePictureAsync(options);
        navigation.navigate('ScanScreen', { photoUri: photo.uri });
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'There was a problem taking the picture.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={cameraRef}
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.circleButton} onPress={takePicture}>
            <Text style={styles.circleText}>●</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
  },
  circleText: {
    fontSize: 50,
    color: 'black',
  },
  permissionText: {
    textAlign: 'center',
    marginVertical: 20,
  },
});
