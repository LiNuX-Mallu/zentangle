import { LocationInterface } from "../types/locationType";
import { LocationActionType, SET_LOCATION } from "../actions/locationActions";

interface LocationState {
    location: LocationInterface | null;
}

const initialState: LocationState = {
    location: null,
}

const locationReducer = (state = initialState, action: LocationActionType) => {
    switch(action.type) {
        case SET_LOCATION:
            return {
                ...state, location: action.payload,
            };
        default:
            return state;
    }
}

export default locationReducer;