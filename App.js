import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Axios from 'axios';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import * as constants from './constants';
//import { KEY } from './GUARDIAN_API_KEY'
import { KEY } from './OPEN_WEATHER_API_KEY';

export default function App() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  //const contentUrl = `${constants.GUARDIAN_API_URL}${constants.CONTENT_ENDPOINT}?api-key=${KEY}`;
  const openWeatherUrl = `${constants.OPEN_WEATHER_API_URL}?appid=${KEY}&q=London`;
  const test = 'a';
  let counter = 0;

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  useEffect(() => {
    Axios.get(openWeatherUrl).then(res => {
      setContent(res)
      console.log(openWeatherUrl, JSON.stringify(res))
    }).catch(err => {
      setError(err)
      console.log(openWeatherUrl, JSON.stringify(err))
    });
  }, []);

  return (
    <View style={styles.container}>
      <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
