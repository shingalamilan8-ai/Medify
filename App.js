import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScanScreen from './screens/ScanScreen';
import VerifyScreen from './screens/VerifyScreen';
import ResultScreen from './screens/ResultScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Scan"
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#2E86AB',
          headerTitleStyle: { fontWeight: '700' },
          cardStyle: { backgroundColor: '#fff' },
        }}
      >
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{ title: 'Scan Medicine', headerShown: false }}
        />
        <Stack.Screen
          name="Verify"
          component={VerifyScreen}
          options={{ title: 'Verifying…', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
         options={{ title: 'Result', headerBackTitle: 'Back' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
