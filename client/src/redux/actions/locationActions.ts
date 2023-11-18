import { LocationInterface } from "../types/locationType";

export const SET_LOCATION = 'SET_LOCATION';

interface SetLocationAction {
    type: typeof SET_LOCATION;
    payload: LocationInterface;
}

export type LocationActionType = SetLocationAction;

export const setLocation = (location: LocationInterface): SetLocationAction => ({
    type: SET_LOCATION,
    payload: location,
});