import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image } from 'react-native';
import Axios from 'axios';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import faker from 'faker';
import _ from 'lodash';
import Pagination,{Icon,Dot} from 'react-native-pagination';
import { NavigationContainer } from '@react-navigation/native';


import * as constants from './constants';
import { KEY } from './OPEN_WEATHER_API_KEY';

export default function App() {
  let MockPersonList = new _.times(35,(i)=>{
    return {
      id:i,
      index:i,
      name:faker.name.findName(),
      avatar:faker.internet.avatar(),
    }
  })

  const [viewableItems, setViewableItems] = useState([]);
  const openWeatherUrl = `${constants.OPEN_WEATHER_API_URL}?appid=${KEY}&q=London`;
  const listRef = useRef(null);

  const onViewRef = React.useRef(({viewableItems: viewable, changed})=> {
    if (!_.isEqual(viewable, viewableItems)) {
      setViewableItems(viewable);
    }
    return viewable;
  })
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 100 })



  useEffect(() => {
    Axios.get(openWeatherUrl).then(res => {
      console.log(openWeatherUrl, JSON.stringify(res))
    }).catch(err => {
      console.log(openWeatherUrl, JSON.stringify(err))
    });
  }, []);

  const Item = props => {
    return (
      <View style={styles.itemContainer}>
        <Image style={styles.avatar} source={{uri: props.avatar}}/>
        <Text style={styles.itemText}>{props.index+1} {props.name}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container2}>
      {/*<MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
      />*/}
      <FlatList
          data={MockPersonList}
          ref={listRef}
          keyExtractor={item => item.id}
          renderItem={({item}) => <Item {...item}/>}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
      />
      <Pagination
          dotThemeLight
          listRef={listRef.current}
          paginationVisibleItems={viewableItems}
          paginationItems={MockPersonList}
          paginationItemPadSize={3}
      />
    </View>
  );
}

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
  container2: {
    flex: 1,
    backgroundColor: 'grey',
    paddingVertical: 150,
    /*backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',*/
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  itemText: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 10,
    marginRight: 40,
  },
  avatar: {
    height: 50,
    width: 50,
  }
});