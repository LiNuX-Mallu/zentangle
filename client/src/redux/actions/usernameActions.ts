export const SET_USERNAME = 'SET_USERNAME';

interface SetUsernameAction {
  type: typeof SET_USERNAME;
  payload: string;
}

export type UsernameActionType = SetUsernameAction;

export const setUsername = (username: string): SetUsernameAction => ({
  type: SET_USERNAME,
  payload: username,
});

export const getUsername = (state: {username: string | null}) => state.username;
