const initialState = {
    coordinates: null,
};

export default function Reducer (state = initialState, action) {
    switch (action.type) {
        case 'SET_COORDINATES':
            console.log("REDUX SET_COORDS",action);
            return { ...state, coordinates: { latitude: action.latitude, longitude: action.longitude } };

        default:
            return state;
    }
}