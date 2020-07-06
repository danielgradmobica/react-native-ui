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
  let refs = null;



  const _renderItem = ({item}) => {
    return (<div index={item.id}
               onPressItem={() => console.log("pressed item ",item.index)}
               name={item.name}
               createTagColor
    >{item.avatar}</div>)
  };

  const _keyExtractor = (item, index) => item.id;
  const onViewableItemsChanged = ({ viewableItems, changed }) => console.log("itemsChanged")//setViewableItems({viewableItems})
  const saveRef = r=>refs=r;
  const onViewRef = React.useRef((viewableItems)=> {
    console.log(viewableItems)
    // Use viewable items in state or as intended
  })

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
      backgroundColor: 'gray',
      padding: 20,
      marginHorizontal: 16,
    },
    avatar: {
      height: 50,
      width: 50,
    }
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
          data={MockPersonList}
          //ref={saveRef}//create refrence point to enable scrolling
          keyExtractor={item => item.id}//map your keys to whatever unique ids the have (mine is a "id" prop)
          renderItem={({item}) => <Item {...item}/>}//render each item
          //onViewableItemsChanged={onViewRef.current}
      />
    </SafeAreaView>
  );
}

