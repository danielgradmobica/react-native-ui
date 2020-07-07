import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Reducer from './redux/reducer';
import Map from './Map';
import List from './List';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={ createStore(Reducer) }>
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
    </Provider>
  );
}