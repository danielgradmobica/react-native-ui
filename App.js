import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image } from 'react-native';
import Axios from 'axios';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import faker from 'faker';
import _ from 'lodash';
import Pagination,{Icon,Dot} from 'react-native-pagination';


import * as constants from './constants';
//import { KEY } from './GUARDIAN_API_KEY'
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

  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [items, setItems] = useState(MockPersonList);
  const [viewableItems, setViewableItems] = useState([]);
  //const contentUrl = `${constants.GUARDIAN_API_URL}${constants.CONTENT_ENDPOINT}?api-key=${KEY}`;
  const openWeatherUrl = `${constants.OPEN_WEATHER_API_URL}?appid=${KEY}&q=London`;
  const listRef = useRef(null);

  const onViewableItemsChanged = ({ viewableItems, changed }) => console.log("itemsChanged")//setViewableItems({viewableItems})
  const onViewRef = React.useRef(({viewableItems: viewable, changed})=> {
    console.log("viewableItems")
    console.log(viewable)
    console.log("changed")
    console.log(changed)
    console.log(viewableItems)
    if (!_.isEqual(viewable, viewableItems)) {
      setViewableItems(viewable);
    }
    return viewableItems;
    // Use viewable items in state or as intended
  })
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 100 })



  useEffect(() => {
    Axios.get(openWeatherUrl).then(res => {
      setContent(res)
      console.log(openWeatherUrl, JSON.stringify(res))
    }).catch(err => {
      setError(err)
      console.log(openWeatherUrl, JSON.stringify(err))
    });
  }, []);

  const Item = props => {
    return (
      <View style={styles.itemContainer}>
        <Image style={styles.avatar} source={{uri: props.avatar}}/>
        <Text style={styles.itemText}>{props.name}</Text>
      </View>
    );
  }
console.log(MockPersonList)
  return (
    <SafeAreaView style={styles.container2}>
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
          data={items}
          ref={listRef}//create refrence point to enable scrolling
          keyExtractor={item => item.id}//map your keys to whatever unique ids the have (mine is a "id" prop)
          renderItem={({item}) => <Item {...item}/>}//render each item
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
      />
      <Pagination
          dotThemeLight //<--use with backgroundColor:"grey"
          listRef={listRef.current}//to allow React Native Pagination to scroll to item when clicked  (so add "ref={r=>this.refs=r}" to your list)
          paginationVisibleItems={viewableItems}//needs to track what the user sees
          paginationItems={items}//pass the same list as data
          paginationItemPadSize={3} //num of items to pad above and below your visable items
      />
    </SafeAreaView>
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