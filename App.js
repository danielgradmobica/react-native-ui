import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Axios from 'axios';

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
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      {content && <Text>{JSON.stringify(content)}</Text>}
      {error && <Text>{JSON.stringify(error)}</Text>}
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
