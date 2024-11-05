import * as React from 'react';
import Navigation from './Screen/Navigation'; 
import 'react-native-gesture-handler';

// Import the navigation component

export default function App() {
  return <Navigation />; // Render the Navigation component
}
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
