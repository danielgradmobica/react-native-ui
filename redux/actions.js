function setCoordinates (latitude, longitude) {
    return {
        type: 'SET_COORDINATES',
        latitude,
        longitude,
    };
};

export {
    setCoordinates,
};