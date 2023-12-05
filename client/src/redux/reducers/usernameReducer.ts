import { SET_USERNAME } from '../actions/usernameActions';
import { UsernameActionType } from '../actions/usernameActions';

const usernameReducer = (state: string | null = null, action: UsernameActionType) => {
  switch (action.type) {
    case SET_USERNAME:
      return action.payload;
    default:
      return state;
  }
};

export default usernameReducer;
