import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, FlatList, Button, Image, TouchableOpacity } from 'react-native';
import Axios from 'axios';
import _ from 'lodash';
import Pagination from 'react-native-pagination';

import * as constants from './constants';
import { KEY } from './OPEN_WEATHER_API_KEY';

function List(props) {
    const [viewableItems, setViewableItems] = useState([]);
    const [weather, setWeather] = useState(null);
    const listRef = useRef(null);
    const onViewRef = React.useRef(({viewableItems: viewable, changed})=> {
        if (!_.isEqual(viewable, viewableItems)) {
            setViewableItems(viewable);
        }
        return viewable;
    })
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 100 })

    const openWeatherUrl = props.coordinates ? `${constants.OPEN_WEATHER_API_URL}?${constants.DEFAULT_QUERY_PARAMS}&lat=${props.coordinates.latitude}&lon=${props.coordinates.longitude}&appid=${KEY}` : null;

    useEffect(() => {
        if (openWeatherUrl) {
            console.log("Fetching Weather Data for:", props.coordinates)
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
                console.error(openWeatherUrl, JSON.stringify(err))
            });
        }
    }, [props.coordinates]);

    const parseEpochToHours = epochTime => {
        const date = new Date;
        date.setUTCSeconds(epochTime);
        return date.getHours();
    }

    const Item = props => {
        return (
            <View style={styles.itemContainer}>
                <Image style={styles.icon} source={{
                    uri: `${constants.OPEN_WEATHER_ICONS_URL}${props.icon}${constants.ICONS_POSTFIX}`,
                }}/>
                <Text style={styles.itemText}>{parseEpochToHours(props.dt)}</Text>
                <Text style={styles.itemText}>{props.description}</Text>
                <Text style={styles.itemText}>{props.temp} °C</Text>
                <Text style={styles.itemText}>Clouds: {props.clouds}%</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.currentWeather}
                onPress={() => props.navigation.navigate('Map')}
            >
                {props.coordinates && weather ? (
                    <React.Fragment>
                        <View style={styles.mainIcon}>
                            <Image style={styles.icon} source={{
                                uri: `${constants.OPEN_WEATHER_ICONS_URL}${weather.current.icon}${constants.ICONS_POSTFIX}`,
                            }}/>
                            <Text>{weather.location}</Text>
                        </View>
                        <View>
                            <Text>{parseEpochToHours(weather.current.dt)}</Text>
                            <Text>{weather.current.description}</Text>
                            <Text>{weather.current.temp} °C</Text>
                            <Text>Clouds: {weather.current.clouds}%</Text>
                        </View>
                    </React.Fragment>
                ) : (
                    <Text>
                        Tap to select location
                    </Text>
                )}
            </TouchableOpacity>
            {weather && weather.forecast && (
                <React.Fragment>
                    <FlatList
                        horizontal
                        data={weather.forecast}
                        ref={listRef}
                        keyExtractor={item => item.dt.toString()}
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
        paddingVertical: 50,
    },
    currentWeather: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 0.5,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'skyblue',
        marginBottom: 50,
        marginHorizontal: 25,
    },
    mainIcon: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 5,
        paddingHorizontal: 5,
        backgroundColor: 'skyblue',
        width: 100,
    },
    itemText: {
        flexGrow: 1,
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