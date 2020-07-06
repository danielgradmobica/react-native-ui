import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Map from './Map';
import List from './List';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
            name="List"
            component={List}
        />
        <Stack.Screen
            name="Map"
            component={Map}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}