import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, Button, Image } from 'react-native';
import Axios from 'axios';
import faker from 'faker';
import _ from 'lodash';
import Pagination from 'react-native-pagination';

import * as constants from './constants';
import { KEY } from './OPEN_WEATHER_API_KEY';

function List(props) {
    console.log("LIST PROPS", props.coordinates)
    let MockPersonList = new _.times(35,(i)=>{
        return {
            id:i,
            index:i,
            name:faker.name.findName(),
            avatar:faker.internet.avatar(),
        }
    })

    const [viewableItems, setViewableItems] = useState([]);
    const [weather, setWeather] = useState(null);
    const openWeatherUrl = props.coordinates ? `${constants.OPEN_WEATHER_API_URL}?${constants.DEFAULT_QUERY_PARAMS}&lat=${props.coordinates.latitude}&lon=${props.coordinates.longitude}&appid=${KEY}` : null;
    const listRef = useRef(null);

    const onViewRef = React.useRef(({viewableItems: viewable, changed})=> {
        if (!_.isEqual(viewable, viewableItems)) {
            setViewableItems(viewable);
        }
        return viewable;
    })
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 100 })

    useEffect(() => {
        if (openWeatherUrl) {
            console.log("Fetching Weather Data", props.coordinates)
            Axios.get(openWeatherUrl).then(res => {
                const response = res.data;
                setWeather({
                    location: response.timezone,
                    current: {
                        dt: response.current.dt,
                        temp: response.current.temp,
                        clouds: response.current.clouds,
                        icon: response.current.weather[0].icon,
                        description: response.current.weather[0].description,
                    },
                    forecast: response.hourly.map(f => ({
                        dt: f.dt,
                        temp: f.temp,
                        clouds: f.clouds,
                        icon: f.weather[0].icon,
                        description: f.weather[0].description,
                    })),
                });
            }).catch(err => {
                console.log(openWeatherUrl, JSON.stringify(err))
            });
        }
    }, [props.coordinates]);

    const Item = props => {
        return (
            <View style={styles.itemContainer}>
                <Image style={styles.icon} source={{
                    uri: `${constants.OPEN_WEATHER_ICONS_URL}${props.icon}${constants.ICONS_POSTFIX}`,
                }}/>
                <Text style={styles.itemText}>{props.index+1} {props.name}</Text>
            </View>
        );
    }
    //console.log(weather)
    console.log("forecast", weather && weather.forecast)
    return (
        <View style={styles.container}>
            <View style={styles.currentWeather}>
                {props.coordinates && weather ? (
                    <Text>
                        Current location: {weather.location}
                    </Text>
                ) : (
                    <Text>
                        No location selected
                    </Text>
                )}
            </View>
            <Button
                title="Select location"
                onPress={() => props.navigation.navigate('Map')}
            />
            {weather && weather.forecast && (
                <React.Fragment>
                    <FlatList
                        data={weather.forecast}
                        ref={listRef}
                        keyExtractor={item => item.dt}
                        renderItem={({item}) => <Item {...item}/>}
                        onViewableItemsChanged={onViewRef.current}
                        viewabilityConfig={viewConfigRef.current}
                    />
                    <Pagination
                        horizontal
                        dotThemeLight
                        listRef={listRef.current}
                        paginationVisibleItems={viewableItems}
                        paginationItems={weather.forecast}
                        paginationItemPadSize={3}
                    />
                </React.Fragment>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'deepskyblue',
        paddingVertical: 150,
    },
    currentWeather: {
        backgroundColor: 'skyblue',
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
        backgroundColor: 'skyblue',
    },
    itemText: {
        flexGrow: 1,
        padding: 20,
        marginHorizontal: 10,
        marginRight: 40,
    },
    icon: {
        height: 50,
        width: 50,
    }
});

export default connect(
    (state, ownProps) => {
        return {
            coordinates: state.coordinates,
        };
    },
    () => ({}),
)(List);