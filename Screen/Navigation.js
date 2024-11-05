import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import CameraScreen from './CameraScreen';
import ScanScreen from './ScanScreen';
import PlantDetails from './PlantDetails';
import MoreDetails from './MoreDetails';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CameraScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#e0f7e4', // Change header background color
          },
          headerTintColor: 'green', // Change header text color
          headerTitleStyle: {
            fontWeight: 'bold', // Optional: make the title bold
          },
        }}
      >
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{ headerShown: false }} // Hide header for CameraScreen
        />
        <Stack.Screen
          name="ScanScreen"
          component={ScanScreen}
          options={{ title: 'Scan' }}
        />
        <Stack.Screen
          name="PlantDetails"
          component={PlantDetails}
          options={{ title: 'Scanned Result' }}
        />
        <Stack.Screen
          name="MoreDetails"
          component={MoreDetails}
          options={{ title: 'More Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
