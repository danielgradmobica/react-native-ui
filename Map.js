import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { setCoordinates } from './redux/actions';


function Map(props) {
    console.log(props)
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
              onPress={(event) => props.setCoordinates(
                  event.nativeEvent.coordinate.latitude,
                  event.nativeEvent.coordinate.longitude,
              )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default connect(
    () => ({}),
    (dispatch, ownProps) => {
        return {
            setCoordinates: (latitude, longitude) => dispatch(setCoordinates(latitude, longitude)),
        };
    },
)(Map);